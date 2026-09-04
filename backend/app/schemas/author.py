from pydantic import BaseModel
from typing import Optional

class AuthorSchema(BaseModel):
    id: int
    name: str
    bio: Optional[str] = None

    class Config:
        from_attributes = True
