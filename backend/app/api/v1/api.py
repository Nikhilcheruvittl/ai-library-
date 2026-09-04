from fastapi import APIRouter
from app.api.v1.endpoints import books, authors, genres, stats

api_router = APIRouter()

api_router.include_router(books.router, prefix="/books", tags=["books"])
api_router.include_router(authors.router, prefix="/authors", tags=["authors"])
api_router.include_router(genres.router, prefix="/genres", tags=["genres"])
api_router.include_router(stats.router, prefix="/stats", tags=["stats"])
