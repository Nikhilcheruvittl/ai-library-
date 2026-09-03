from sqlalchemy import Column, Integer, String, Text, Float, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from app.core.database import Base

class Book(Base):
    __tablename__ = "books"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True, nullable=False)
    subtitle = Column(String, nullable=True)
    isbn = Column(String, unique=True, index=True, nullable=False)
    summary = Column(Text, nullable=False)
    description = Column(Text, nullable=False)
    page_count = Column(Integer, index=True, nullable=False)
    publication_year = Column(Integer, index=True, nullable=False)
    language = Column(String, default="English", index=True, nullable=False)
    difficulty_level = Column(String, index=True, nullable=False)
    rating = Column(Float, default=4.5)
    publisher = Column(String, nullable=True)
    format = Column(String, nullable=True)
    target_audience = Column(String, nullable=True)
    cover_image_url = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    authors = relationship("Author", secondary="book_authors", back_populates="books")
    genres = relationship("Genre", secondary="book_genres", back_populates="books")
