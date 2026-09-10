import unittest
from unittest.mock import patch
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.core.database import Base
from app.models import Book, Author, Genre
from app.schemas.ai import BookSearchRequest, NumericFilter, AIAssistantIntentResponse
from app.api.v1.endpoints.ai import (
    ai_search_books,
    AISearchInput,
    parse_assistant_intent,
    parse_assistant_intent_gemini,
    sanitize_schema_for_gemini,
)


class TestAISearchIntegration(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        # Isolated in-memory SQLite database
        cls.engine = create_engine("sqlite:///:memory:")
        Base.metadata.create_all(cls.engine)
        cls.TestingSessionLocal = sessionmaker(bind=cls.engine)

        # Seed test data into SQLite
        db = cls.TestingSessionLocal()
        
        # Genres
        g_cyber = Genre(id=1, name="Cybersecurity", slug="cybersecurity")
        g_prog = Genre(id=2, name="Programming", slug="programming")
        db.add_all([g_cyber, g_prog])

        # Authors
        a_alice = Author(id=1, name="Alice Vance", bio="Cybersecurity researcher")
        a_bob = Author(id=2, name="Bob Smith", bio="Python developer")
        db.add_all([a_alice, a_bob])
        db.commit()

        # Books
        b1 = Book(
            id=1,
            title="Practical Cybersecurity Basics",
            isbn="978-1-111",
            summary="Introductory guide to cybersecurity fundamentals",
            description="Complete beginner guide to cybersecurity principles.",
            page_count=250,
            publication_year=2021,
            language="English",
            difficulty_level="Beginner",
            rating=4.8,
            authors=[a_alice],
            genres=[g_cyber]
        )
        b2 = Book(
            id=2,
            title="Advanced Network Security",
            isbn="978-2-222",
            summary="Advanced topics in network defense",
            description="Deep dive into network security architecture.",
            page_count=450,
            publication_year=2018,
            language="English",
            difficulty_level="Advanced",
            rating=4.5,
            authors=[a_alice],
            genres=[g_cyber]
        )
        b3 = Book(
            id=3,
            title="Learning Python",
            isbn="978-3-333",
            summary="Comprehensive Python reference",
            description="Learn Python from scratch.",
            page_count=600,
            publication_year=2015,
            language="English",
            difficulty_level="Beginner",
            rating=4.7,
            authors=[a_bob],
            genres=[g_prog]
        )
        db.add_all([b1, b2, b3])
        db.commit()
        db.close()

    def setUp(self):
        self.db = self.TestingSessionLocal()

    def tearDown(self):
        self.db.close()

    @patch("app.api.v1.endpoints.ai.parse_assistant_intent")
    def test_intent_greeting_conversation(self, mock_parse):
        """Test 'Hi, how are you?' returns conversation intent with text answer."""
        mock_parse.return_value = AIAssistantIntentResponse(
            intent="conversation",
            message="Hello! I'm doing well, thank you. How can I help you today?",
            book_search=None
        )

        res = ai_search_books(
            input_data=AISearchInput(query="Hi, how are you?"),
            db=self.db
        )

        self.assertEqual(res["intent"], "conversation")
        self.assertIn("doing well", res["message"])
        self.assertEqual(res["total"], 0)
        self.assertEqual(res["items"], [])

    @patch("app.api.v1.endpoints.ai.parse_assistant_intent")
    def test_intent_general_question_conversation(self, mock_parse):
        """Test 'What is SQL injection?' returns conversation intent with text explanation."""
        mock_parse.return_value = AIAssistantIntentResponse(
            intent="conversation",
            message="SQL injection is a security vulnerability that allows an attacker to manipulate database queries.",
            book_search=None
        )

        res = ai_search_books(
            input_data=AISearchInput(query="What is SQL injection?"),
            db=self.db
        )

        self.assertEqual(res["intent"], "conversation")
        self.assertIn("SQL injection is a security vulnerability", res["message"])
        self.assertEqual(res["total"], 0)
        self.assertEqual(res["items"], [])

    @patch("app.api.v1.endpoints.ai.parse_assistant_intent")
    def test_intent_book_search_beginner_cybersecurity(self, mock_parse):
        """Test 'Find a beginner cybersecurity book under 300 pages' returns book_search intent and matched items."""
        mock_parse.return_value = AIAssistantIntentResponse(
            intent="book_search",
            message=None,
            book_search=BookSearchRequest(
                genre="Cybersecurity",
                difficulty="Beginner",
                page_count=NumericFilter(operator="lt", value=300)
            )
        )

        res = ai_search_books(
            input_data=AISearchInput(query="Find a beginner cybersecurity book under 300 pages"),
            db=self.db
        )

        self.assertEqual(res["intent"], "book_search")
        self.assertIsNone(res["message"])
        self.assertEqual(res["total"], 1)
        self.assertEqual(len(res["items"]), 1)
        self.assertEqual(res["items"][0].title, "Practical Cybersecurity Basics")

    @patch("app.api.v1.endpoints.ai.parse_assistant_intent")
    def test_ai_search_no_matching_books_returns_empty_items(self, mock_parse):
        """Test book query with no matching records returns total: 0 and empty items array."""
        mock_parse.return_value = AIAssistantIntentResponse(
            intent="book_search",
            message=None,
            book_search=BookSearchRequest(
                genre="Cybersecurity",
                page_count=NumericFilter(operator="lt", value=200)
            )
        )

        res = ai_search_books(
            input_data=AISearchInput(query="Cybersecurity books under 200 pages"),
            db=self.db
        )

        self.assertEqual(res["intent"], "book_search")
        self.assertEqual(res["total"], 0)
        self.assertEqual(res["items"], [])

    @patch("app.api.v1.endpoints.ai.settings")
    @patch("app.api.v1.endpoints.ai.parse_assistant_intent_gemini")
    def test_provider_dispatch_gemini(self, mock_gemini, mock_settings):
        """Test that setting AI_PROVIDER='gemini' dispatches to parse_assistant_intent_gemini."""
        mock_settings.AI_PROVIDER = "gemini"
        mock_settings.GEMINI_API_KEY = "test_key"
        mock_gemini.return_value = AIAssistantIntentResponse(intent="conversation", message="Gemini response")

        res = parse_assistant_intent("Hello Gemini")
        self.assertEqual(res.intent, "conversation")
        self.assertEqual(res.message, "Gemini response")
        mock_gemini.assert_called_once_with("Hello Gemini")

    @patch("app.api.v1.endpoints.ai.settings")
    def test_gemini_missing_api_key_raises_503(self, mock_settings):
        """Test that missing GEMINI_API_KEY raises HTTP 503."""
        from fastapi import HTTPException
        mock_settings.AI_PROVIDER = "gemini"
        mock_settings.GEMINI_API_KEY = None

        with self.assertRaises(HTTPException) as ctx:
            parse_assistant_intent("Hello")
        self.assertEqual(ctx.exception.status_code, 503)

    def test_sanitize_schema_for_gemini_removes_unsupported_numeric_constraints(self):
        """Regression test: Ensure exclusiveMinimum and unsupported keywords are stripped from Gemini response schema."""
        raw_schema = AIAssistantIntentResponse.model_json_schema()
        
        # Confirm raw schema contains exclusiveMinimum on NumericFilter.value
        numeric_filter_raw = raw_schema["$defs"]["NumericFilter"]["properties"]["value"]
        self.assertIn("exclusiveMinimum", numeric_filter_raw)
        self.assertEqual(numeric_filter_raw["exclusiveMinimum"], 0)

        sanitized_schema = sanitize_schema_for_gemini(raw_schema)
        
        # Confirm exclusiveMinimum and example are stripped
        numeric_filter_sanitized = sanitized_schema["$defs"]["NumericFilter"]["properties"]["value"]
        self.assertNotIn("exclusiveMinimum", numeric_filter_sanitized)
        self.assertEqual(numeric_filter_sanitized["type"], "integer")
        self.assertNotIn("example", sanitized_schema["$defs"]["BookSearchRequest"])

    @patch("app.api.v1.endpoints.ai.settings")
    @patch("google.genai.Client")
    def test_parse_assistant_intent_gemini_success_with_sanitized_schema(self, mock_genai_client_class, mock_settings):
        """Test that parse_assistant_intent_gemini passes sanitized schema to Gemini and validates output."""
        mock_settings.GEMINI_API_KEY = "test_key"
        mock_settings.GEMINI_MODEL = "gemini-2.5-flash"

        mock_client = mock_genai_client_class.return_value
        mock_response = mock_client.models.generate_content.return_value
        mock_response.text = '{"intent": "book_search", "message": null, "book_search": {"page_count": {"operator": "lt", "value": 300}}}'

        res = parse_assistant_intent_gemini("books under 300 pages")

        self.assertEqual(res.intent, "book_search")
        self.assertIsNotNone(res.book_search)
        self.assertEqual(res.book_search.page_count.value, 300)

        # Inspect call args sent to generate_content
        mock_client.models.generate_content.assert_called_once()
        call_kwargs = mock_client.models.generate_content.call_args.kwargs
        config = call_kwargs["config"]
        
        # Verify schema passed to Gemini is sanitized (no exclusiveMinimum)
        schema_passed = config.response_schema
        self.assertIsInstance(schema_passed, dict)
        self.assertNotIn("exclusiveMinimum", schema_passed["$defs"]["NumericFilter"]["properties"]["value"])

    @patch("app.api.v1.endpoints.ai.settings")
    @patch("google.genai.Client")
    def test_parse_assistant_intent_gemini_invalid_data_fails_application_validation(self, mock_genai_client_class, mock_settings):
        """Test that invalid data from Gemini (violating gt=0 constraint) is rejected by Pydantic post-validation."""
        from fastapi import HTTPException
        mock_settings.GEMINI_API_KEY = "test_key"
        mock_settings.GEMINI_MODEL = "gemini-2.5-flash"

        mock_client = mock_genai_client_class.return_value
        mock_response = mock_client.models.generate_content.return_value
        # value: 0 violates gt=0 application constraint on NumericFilter
        mock_response.text = '{"intent": "book_search", "message": null, "book_search": {"page_count": {"operator": "lt", "value": 0}}}'

        with self.assertRaises(HTTPException) as ctx:
            parse_assistant_intent_gemini("books under 0 pages")
        
        self.assertEqual(ctx.exception.status_code, 502)
        self.assertIn("AIAssistantIntentResponse schema", ctx.exception.detail)


if __name__ == "__main__":
    unittest.main()


