from sqlalchemy.orm import Query
from sqlalchemy import or_, func
from app.models import Book, Author, Genre
from app.schemas.ai import BookSearchRequest, NumericFilter


def build_numeric_condition(column, numeric_filter: NumericFilter):
    """
    Map a NumericFilter operator ('lt', 'lte', 'gt', 'gte', 'eq')
    to a standard SQLAlchemy ORM comparison expression.
    """
    op = numeric_filter.operator
    val = numeric_filter.value

    if op == "lt":
        return column < val
    elif op == "lte":
        return column <= val
    elif op == "gt":
        return column > val
    elif op == "gte":
        return column >= val
    elif op == "eq":
        return column == val
    else:
        raise ValueError(f"Unsupported operator: {op}")


def apply_book_search_filters(query: Query, request: BookSearchRequest) -> Query:
    """
    Apply a validated BookSearchRequest to a SQLAlchemy Query[Book].
    Uses pure SQLAlchemy ORM expressions without constructing raw SQL strings.
    """
    # 1. Search Query Filter (Title, Summary, Description, Author, Genre)
    if request.search and request.search.strip():
        pattern = f"%{request.search.strip()}%"
        query = query.filter(
            or_(
                Book.title.ilike(pattern),
                Book.summary.ilike(pattern),
                Book.description.ilike(pattern),
                Book.authors.any(Author.name.ilike(pattern)),
                Book.genres.any(Genre.name.ilike(pattern)),
            )
        )

    # 2. Genre Filter (Many-to-Many relationship query)
    if request.genre and request.genre.strip() and request.genre.strip().lower() != "all":
        query = query.filter(
            Book.genres.any(func.lower(Genre.name) == request.genre.strip().lower())
        )

    # 3. Difficulty Level Filter
    if request.difficulty and request.difficulty.strip() and request.difficulty.strip().lower() != "all":
        query = query.filter(
            func.lower(Book.difficulty_level) == request.difficulty.strip().lower()
        )

    # 4. Language Filter
    if request.language and request.language.strip() and request.language.strip().lower() != "all":
        query = query.filter(
            func.lower(Book.language) == request.language.strip().lower()
        )

    # 5. Page Count Numeric Filter
    if request.page_count is not None:
        query = query.filter(build_numeric_condition(Book.page_count, request.page_count))

    # 6. Publication Year Numeric Filter
    if request.publication_year is not None:
        query = query.filter(build_numeric_condition(Book.publication_year, request.publication_year))

    return query
