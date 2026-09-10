import json
import urllib.request
import urllib.error
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, Field, ValidationError
from sqlalchemy.orm import Session, selectinload

from app.core.config import settings
from app.core.database import get_db
from app.models import Book
from app.schemas.ai import BookSearchRequest, AIAssistantIntentResponse, AISearchResponse
from app.services.book_search import apply_book_search_filters

router = APIRouter()


class ParseSearchInput(BaseModel):
    query: str = Field(..., min_length=1, description="Natural language search query from user.")


class AISearchInput(BaseModel):
    query: str = Field(..., min_length=1, description="Natural language search query from user.")
    limit: int = Field(12, ge=1, le=50, description="Items limit (default 12, max 50)")
    offset: int = Field(0, ge=0, description="Pagination offset (default 0)")


SYSTEM_PROMPT = (
    "You are OpenLibrary's AI Assistant. Classify the user's query as 'book_search' or 'conversation'.\n"
    "Rules:\n"
    "- If user wants to search, find, or filter books, set intent to 'book_search', fill the 'book_search' criteria object, and set 'message' to null.\n"
    "  Allowed difficulty: Beginner, Intermediate, Advanced.\n"
    "  Allowed genres: Programming, Cybersecurity, Technology, Science Fiction, History, Psychology, Business, Finance, Biography, Philosophy, Self-development, Fiction, Mystery, Fantasy.\n"
    "  Numeric operators allowed for page_count and publication_year: lt, lte, gt, gte, eq.\n"
    "  Examples:\n"
    "  - 'under 300 pages' or 'fewer than 300 pages' -> page_count: {\"operator\": \"lt\", \"value\": 300}\n"
    "  - 'up to 400 pages' or '400 pages or fewer' -> page_count: {\"operator\": \"lte\", \"value\": 400}\n"
    "  - 'published after 2015' -> publication_year: {\"operator\": \"gt\", \"value\": 2015}\n"
    "- If user is greeting, asking general questions, or chatting (e.g. 'Hi, how are you?', 'What is SQL injection?'), set intent to 'conversation', provide a clear answer in 'message', and set 'book_search' to null.\n"
    "Output JSON strictly matching the schema with no explanation."
)


UNSUPPORTED_GEMINI_SCHEMA_KEYS = {
    "exclusiveMinimum",
    "exclusiveMaximum",
    "minimum",
    "maximum",
    "minLength",
    "maxLength",
    "pattern",
    "minItems",
    "maxItems",
    "uniqueItems",
    "example",
    "examples",
}


def sanitize_schema_for_gemini(schema):
    """
    Sanitize Pydantic JSON schema for Google Gemini structured output.
    Gemini response_schema rejects validation keywords like exclusiveMinimum,
    minimum, minLength, pattern, example, etc.
    """
    if isinstance(schema, dict):
        return {
            key: sanitize_schema_for_gemini(value)
            for key, value in schema.items()
            if key not in UNSUPPORTED_GEMINI_SCHEMA_KEYS
        }
    elif isinstance(schema, list):
        return [sanitize_schema_for_gemini(item) for item in schema]
    return schema


def parse_assistant_intent_gemini(query_str: str) -> AIAssistantIntentResponse:
    """Parse intent using Google GenAI SDK (Gemini)."""
    if not settings.GEMINI_API_KEY:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Gemini API key is not configured.",
        )

    try:
        from google import genai
        from google.genai import types

        client = genai.Client(api_key=settings.GEMINI_API_KEY)
        response_schema = sanitize_schema_for_gemini(AIAssistantIntentResponse.model_json_schema())
        response = client.models.generate_content(
            model=settings.GEMINI_MODEL,
            contents=f"{SYSTEM_PROMPT}\nQuery: \"{query_str}\"",
            config=types.GenerateContentConfig(
                response_mime_type="application/json",
                response_schema=response_schema,
                temperature=0.0,
            ),
        )
        llm_output_raw = response.text or ""

    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=f"Gemini service request failed: {exc}",
        )

    try:
        validated_response = AIAssistantIntentResponse.model_validate_json(llm_output_raw)
        return validated_response
    except ValidationError as exc:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=f"LLM output did not satisfy AIAssistantIntentResponse schema: {exc}",
        )


def parse_assistant_intent_ollama(query_str: str) -> AIAssistantIntentResponse:
    """Parse intent using local Ollama service."""
    ollama_url = f"{settings.OLLAMA_BASE_URL.rstrip('/')}/api/generate"

    payload = {
        "model": settings.OLLAMA_MODEL,
        "prompt": f"{SYSTEM_PROMPT}\nQuery: \"{query_str}\"",
        "stream": False,
        "format": AIAssistantIntentResponse.model_json_schema(),
        "options": {
            "temperature": 0.0,
            "num_predict": 180,
            "num_ctx": 1024,
        },
    }

    try:
        req = urllib.request.Request(
            ollama_url,
            data=json.dumps(payload).encode("utf-8"),
            headers={"Content-Type": "application/json"},
            method="POST",
        )
        with urllib.request.urlopen(req, timeout=120) as response:
            if response.status != 200:
                raise HTTPException(
                    status_code=status.HTTP_502_BAD_GATEWAY,
                    detail=f"Ollama returned HTTP status {response.status}",
                )
            body = response.read().decode("utf-8")
            res_json = json.loads(body)
            llm_output_raw = res_json.get("response", "")

    except (TimeoutError, urllib.error.URLError) as exc:
        if isinstance(exc, TimeoutError) or getattr(exc, "reason", None) == "timed out":
            raise HTTPException(
                status_code=status.HTTP_504_GATEWAY_TIMEOUT,
                detail="Ollama LLM service request timed out.",
            )
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=f"Unable to connect to Ollama service at {settings.OLLAMA_BASE_URL}. Ensure Ollama is running. ({exc.reason})",
        )

    except json.JSONDecodeError as exc:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=f"Invalid JSON received from Ollama response: {exc}",
        )

    try:
        validated_response = AIAssistantIntentResponse.model_validate_json(llm_output_raw)
        return validated_response
    except ValidationError as exc:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=f"LLM output did not satisfy AIAssistantIntentResponse schema: {exc}",
        )


def parse_assistant_intent(user_query: str) -> AIAssistantIntentResponse:
    """
    Classify user query into 'book_search' or 'conversation' using configured AI provider (Gemini or Ollama).
    - For 'conversation': populates `message` with a natural-language answer.
    - For 'book_search': populates `book_search` with structured `BookSearchRequest`.
    """
    query_str = user_query.strip()
    if not query_str:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Search query cannot be empty."
        )

    provider = (settings.AI_PROVIDER or "").lower()
    if provider == "gemini":
        return parse_assistant_intent_gemini(query_str)
    return parse_assistant_intent_ollama(query_str)



@router.post("/parse-search", response_model=BookSearchRequest, summary="Parse natural language request into structured search criteria")
def parse_search_intent(input_data: ParseSearchInput) -> BookSearchRequest:
    """
    Convert a natural-language book request into a validated `BookSearchRequest` using local Ollama LLM.
    Backward-compatible with original search parser endpoint.
    """
    intent_res = parse_assistant_intent(input_data.query)
    if intent_res.intent == "book_search" and intent_res.book_search:
        return intent_res.book_search
    return BookSearchRequest(search=input_data.query)


@router.post("/search", response_model=AISearchResponse, summary="Perform end-to-end natural language AI book search or conversation")
def ai_search_books(
    input_data: AISearchInput,
    db: Session = Depends(get_db)
):
    """
    End-to-end natural-language AI assistant & search endpoint:
    1. Parse intent via Ollama (book_search vs conversation).
    2. If conversation: return AI text answer.
    3. If book_search: convert `BookSearchRequest` into ORM query using `apply_book_search_filters` and return matching books.
    """
    intent_res = parse_assistant_intent(input_data.query)

    if intent_res.intent == "conversation":
        return {
            "intent": "conversation",
            "message": intent_res.message or "I am OpenLibrary AI Assistant. How can I help you today?",
            "total": 0,
            "limit": input_data.limit,
            "offset": input_data.offset,
            "items": []
        }

    # Book search handling
    parsed_request = intent_res.book_search or BookSearchRequest(search=input_data.query)

    base_query = db.query(Book).options(
        selectinload(Book.authors),
        selectinload(Book.genres)
    )

    filtered_query = apply_book_search_filters(base_query, parsed_request)
    ordered_query = filtered_query.order_by(Book.publication_year.desc(), Book.title.asc())
    total = ordered_query.count()
    items = ordered_query.offset(input_data.offset).limit(input_data.limit).all()

    return {
        "intent": "book_search",
        "message": None,
        "total": total,
        "limit": input_data.limit,
        "offset": input_data.offset,
        "items": items
    }

