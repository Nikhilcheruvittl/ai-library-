from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from app.schemas.author import AuthorSchema
from app.schemas.genre import GenreSchema

class BookSchema(BaseModel):
    id: int
    title: str
    subtitle: Optional[str] = None
    isbn: str
    summary: str
    description: str
    page_count: int
    publication_year: int
    language: str
    difficulty_level: str
    rating: float
    publisher: Optional[str] = None
    format: Optional[str] = None
    target_audience: Optional[str] = None
    cover_image_url: Optional[str] = None
    created_at: Optional[datetime] = None
    authors: List[AuthorSchema] = []
    genres: List[GenreSchema] = []

    class Config:
        from_attributes = True

class BookListResponse(BaseModel):
    total: int
    limit: int
    offset: int
    items: List[BookSchema]
