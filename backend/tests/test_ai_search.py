import unittest
from unittest.mock import patch
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.core.database import Base
from app.models import Book, Author, Genre
from app.schemas.ai import BookSearchRequest, NumericFilter, AIAssistantIntentResponse
from app.api.v1.endpoints.ai import ai_search_books, AISearchInput, parse_assistant_intent


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


if __name__ == "__main__":
    unittest.main()

