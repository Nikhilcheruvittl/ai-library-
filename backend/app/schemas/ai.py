from pydantic import BaseModel, Field, ConfigDict
from typing import Optional, Literal, List
from app.schemas.book import BookSchema


class NumericFilter(BaseModel):
    operator: Literal["lt", "lte", "gt", "gte", "eq"] = Field(
        ...,
        description="Comparison operator: 'lt' (<), 'lte' (<=), 'gt' (>), 'gte' (>=), 'eq' (=)."
    )
    value: int = Field(
        ...,
        gt=0,
        description="Positive integer numeric value for comparison."
    )


class BookSearchRequest(BaseModel):
    search: Optional[str] = Field(
        default=None,
        description="Free-text search terms matching book title, author name, genre, or summary."
    )
    genre: Optional[str] = Field(
        default=None,
        description="Specific book genre or subject area to filter by (e.g., Programming, Cybersecurity, History, Philosophy)."
    )
    difficulty: Optional[str] = Field(
        default=None,
        description="Target reading difficulty level (e.g., Beginner, Intermediate, Advanced)."
    )
    language: Optional[str] = Field(
        default=None,
        description="Language of the book publication (e.g., English)."
    )
    page_count: Optional[NumericFilter] = Field(
        default=None,
        description="Page count filter specification with comparison operator and integer value."
    )
    publication_year: Optional[NumericFilter] = Field(
        default=None,
        description="Publication year filter specification with comparison operator and integer value."
    )

    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "search": "python programming",
                "genre": "Programming",
                "difficulty": "Beginner",
                "language": "English",
                "page_count": {"operator": "lt", "value": 400},
                "publication_year": {"operator": "gt", "value": 2015}
            }
        }
    )


class AIAssistantIntentResponse(BaseModel):
    intent: Literal["book_search", "conversation"] = Field(
        ...,
        description="Query classification: 'book_search' for book requests/recommendations, 'conversation' for greetings/general questions."
    )
    message: Optional[str] = Field(
        default=None,
        description="Natural language answer when intent is 'conversation'. Null when intent is 'book_search'."
    )
    book_search: Optional[BookSearchRequest] = Field(
        default=None,
        description="Structured book search query parameters when intent is 'book_search'. Null when intent is 'conversation'."
    )


class AISearchResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    intent: Literal["book_search", "conversation"] = Field(..., description="Intent classification: 'book_search' or 'conversation'")
    message: Optional[str] = Field(default=None, description="Conversational text answer if intent is conversation")
    total: int = Field(0, description="Total matching books count")
    limit: int = Field(12, description="Pagination limit")
    offset: int = Field(0, description="Pagination offset")
    items: List[BookSchema] = Field(default_factory=list, description="List of matching books")
