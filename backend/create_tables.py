import os
import sys

# Ensure backend root directory is in sys.path when running script directly
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.core.database import engine, Base
import app.models  # Registers Book, Author, Genre, BookAuthor, BookGenre on Base.metadata

def create_tables():
    """
    One-time beginner-friendly setup script to create all 5 database tables in PostgreSQL:
    1. books
    2. authors
    3. genres
    4. book_authors
    5. book_genres
    """
    print("Connecting to PostgreSQL and creating database tables...")
    Base.metadata.create_all(bind=engine)
    
    table_names = list(Base.metadata.tables.keys())
    print("Database tables created successfully!")
    print("Created Tables:")
    for tname in sorted(table_names):
        print(f" - {tname}")

if __name__ == "__main__":
    create_tables()
