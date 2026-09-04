from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List

from app.core.database import get_db
from app.models import Genre, Book
from app.schemas.genre import GenreSchema

router = APIRouter()

@router.get("", response_model=List[GenreSchema])
def list_genres(db: Session = Depends(get_db)):
    results = db.query(
        Genre,
        func.count(Book.id).label("book_count")
    ).outerjoin(Genre.books)\
     .group_by(Genre.id)\
     .order_by(Genre.name.asc()).all()

    genres = []
    for genre_obj, count in results:
        g_data = GenreSchema.model_validate(genre_obj)
        g_data.book_count = count
        genres.append(g_data)

    return genres
