import unittest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Query
from sqlalchemy.dialects import postgresql

from app.core.database import Base
from app.models import Book, Author, Genre

from app.schemas.ai import BookSearchRequest, NumericFilter
from app.services.book_search import apply_book_search_filters, build_numeric_condition


class TestBookSearchService(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        # Create an in-memory SQLite engine for Query testing
        cls.engine = create_engine("sqlite:///:memory:")
        Base.metadata.create_all(cls.engine)
        cls.Session = sessionmaker(bind=cls.engine)

    def setUp(self):
        self.session = self.Session()

    def tearDown(self):
        self.session.close()

    def test_build_numeric_condition_operators(self):
        """Test that build_numeric_condition produces correct SQLAlchemy binary expressions for all 5 operators."""
        operators_and_values = [
            ("lt", 400, "lt"),
            ("lte", 400, "le"),
            ("gt", 2015, "gt"),
            ("gte", 2015, "ge"),
            ("eq", 2020, "eq"),
        ]

        for op, val, expected_py_op in operators_and_values:
            # Page count condition
            nf = NumericFilter(operator=op, value=val)
            cond_pc = build_numeric_condition(Book.page_count, nf)
            self.assertEqual(cond_pc.operator.__name__, expected_py_op)
            self.assertEqual(cond_pc.right.value, val)

            # Publication year condition
            cond_py = build_numeric_condition(Book.publication_year, nf)
            self.assertEqual(cond_py.operator.__name__, expected_py_op)
            self.assertEqual(cond_py.right.value, val)


    def test_apply_book_search_filters_combined_request(self):
        """
        Test that a combined request such as:
        BookSearchRequest(
            genre="Cybersecurity",
            difficulty="Beginner",
            page_count=NumericFilter(operator="lt", value=300)
        )
        is applied to a SQLAlchemy query correctly without errors.
        """
        req = BookSearchRequest(
            genre="Cybersecurity",
            difficulty="Beginner",
            page_count=NumericFilter(operator="lt", value=300)
        )

        base_query = self.session.query(Book)
        filtered_query = apply_book_search_filters(base_query, req)

        # Inspect compiled SQL statement
        sql_str = str(filtered_query.statement.compile(compile_kwargs={"literal_binds": True}))
        
        self.assertIn("books", sql_str.lower())
        self.assertIn("page_count < 300", sql_str.lower())
        self.assertIn("cybersecurity", sql_str.lower())
        self.assertIn("beginner", sql_str.lower())

    def test_all_five_operators_page_count_query(self):
        """Test applying all 5 numeric operators for page_count to a SQLAlchemy query."""
        for op in ["lt", "lte", "gt", "gte", "eq"]:
            req = BookSearchRequest(page_count=NumericFilter(operator=op, value=250))
            q = apply_book_search_filters(self.session.query(Book), req)
            sql = str(q.statement.compile(compile_kwargs={"literal_binds": True}))
            self.assertIn("page_count", sql.lower())

    def test_all_five_operators_publication_year_query(self):
        """Test applying all 5 numeric operators for publication_year to a SQLAlchemy query."""
        for op in ["lt", "lte", "gt", "gte", "eq"]:
            req = BookSearchRequest(publication_year=NumericFilter(operator=op, value=2010))
            q = apply_book_search_filters(self.session.query(Book), req)
            sql = str(q.statement.compile(compile_kwargs={"literal_binds": True}))
            self.assertIn("publication_year", sql.lower())


if __name__ == "__main__":
    unittest.main()
