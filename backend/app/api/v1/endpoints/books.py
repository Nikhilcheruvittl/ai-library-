from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session, selectinload
from sqlalchemy import or_, func
from typing import Optional

from app.core.database import get_db
from app.models import Book, Author, Genre
from app.schemas.book import BookSchema, BookListResponse

router = APIRouter()

@router.get("", response_model=BookListResponse)
def list_books(
    db: Session = Depends(get_db),
    search: Optional[str] = Query(None, description="Search query matching title, summary, author, or genre"),
    genre: Optional[str] = Query(None, description="Filter by genre name"),
    difficulty: Optional[str] = Query(None, description="Filter by difficulty level (Beginner, Intermediate, Advanced)"),
    language: Optional[str] = Query(None, description="Filter by language"),
    max_page_count: Optional[int] = Query(None, description="Filter books with page count <= max_page_count"),
    min_year: Optional[int] = Query(None, description="Filter books published >= min_year"),
    limit: int = Query(12, ge=1, le=50, description="Items limit (default 12, max 50)"),
    offset: int = Query(0, ge=0, description="Pagination offset (default 0)")
):
    query = db.query(Book).options(
        selectinload(Book.authors),
        selectinload(Book.genres)
    )

    # 1. Text Search Filter (Title, Summary, Author Name, Genre Name)
    if search and search.strip():
        pattern = f"%{search.strip()}%"
        query = query.filter(
            or_(
                Book.title.ilike(pattern),
                Book.summary.ilike(pattern),
                Book.description.ilike(pattern),
                Book.authors.any(Author.name.ilike(pattern)),
                Book.genres.any(Genre.name.ilike(pattern))
            )
        )

    # 2. Genre Filter (Many-to-Many relationship query)
    if genre and genre.strip() and genre.strip().lower() != "all":
        query = query.filter(
            Book.genres.any(func.lower(Genre.name) == genre.strip().lower())
        )

    # 3. Difficulty Level Filter
    if difficulty and difficulty.strip() and difficulty.strip().lower() != "all":
        query = query.filter(
            func.lower(Book.difficulty_level) == difficulty.strip().lower()
        )

    # 4. Language Filter
    if language and language.strip() and language.strip().lower() != "all":
        query = query.filter(
            func.lower(Book.language) == language.strip().lower()
        )

    # 5. Max Page Count Filter
    if max_page_count is not None:
        query = query.filter(Book.page_count <= max_page_count)

    # 6. Min Publication Year Filter
    if min_year is not None:
        query = query.filter(Book.publication_year >= min_year)

    # Order by publication year descending, title ascending
    query = query.order_by(Book.publication_year.desc(), Book.title.asc())

    total = query.count()
    items = query.offset(offset).limit(limit).all()

    return {
        "total": total,
        "limit": limit,
        "offset": offset,
        "items": items
    }

@router.get("/{book_id}", response_model=BookSchema)
def get_book_by_id(book_id: int, db: Session = Depends(get_db)):
    book = db.query(Book).options(
        selectinload(Book.authors),
        selectinload(Book.genres)
    ).filter(Book.id == book_id).first()

    if not book:
        raise HTTPException(status_code=404, detail=f"Book with ID {book_id} not found")

    return book
