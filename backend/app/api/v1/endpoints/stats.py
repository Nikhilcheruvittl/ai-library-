from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.core.database import get_db
from app.models import Book, Author, Genre
from app.schemas.stats import StatsSchema

router = APIRouter()

@router.get("", response_model=StatsSchema)
def get_library_stats(db: Session = Depends(get_db)):
    total_books = db.query(func.count(Book.id)).scalar() or 0
    total_authors = db.query(func.count(Author.id)).scalar() or 0
    total_genres = db.query(func.count(Genre.id)).scalar() or 0

    return {
        "total_books": total_books,
        "total_authors": total_authors,
        "total_genres": total_genres
    }
