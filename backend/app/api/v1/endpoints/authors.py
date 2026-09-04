from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from app.core.database import get_db
from app.models import Author
from app.schemas.author import AuthorSchema

router = APIRouter()

@router.get("", response_model=List[AuthorSchema])
def list_authors(db: Session = Depends(get_db)):
    return db.query(Author).order_by(Author.name.asc()).all()
