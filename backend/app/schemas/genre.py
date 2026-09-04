from pydantic import BaseModel
from typing import Optional

class GenreSchema(BaseModel):
    id: int
    name: str
    slug: str
    book_count: Optional[int] = None

    class Config:
        from_attributes = True
