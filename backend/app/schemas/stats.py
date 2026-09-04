from pydantic import BaseModel

class StatsSchema(BaseModel):
    total_books: int
    total_authors: int
    total_genres: int
