from sqlalchemy import Column, Integer, ForeignKey
from app.core.database import Base

class BookAuthor(Base):
    __tablename__ = "book_authors"

    book_id = Column(Integer, ForeignKey("books.id", ondelete="CASCADE"), primary_key=True)
    author_id = Column(Integer, ForeignKey("authors.id", ondelete="CASCADE"), primary_key=True)

class BookGenre(Base):
    __tablename__ = "book_genres"

    book_id = Column(Integer, ForeignKey("books.id", ondelete="CASCADE"), primary_key=True)
    genre_id = Column(Integer, ForeignKey("genres.id", ondelete="CASCADE"), primary_key=True)
