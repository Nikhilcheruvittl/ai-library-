AI Library

An OpenLibrary-inspired book catalog with a natural-language AI assistant. The project combines a Next.js frontend, FastAPI backend, PostgreSQL database, and Gemini/Ollama-powered AI search to let users browse books normally or describe what they want in plain English.

Live Demo

Production: https://ai-library-five.vercel.app

GitHub

Repository: https://github.com/Nikhilcheruvittl/ai-library-

Features

Browse a curated library of books.

Search books by title, author, and text.

Filter by genre, difficulty, language, page count, and publication year.

View book metadata, authors, genres, ratings, publishers, and formats.

Natural-language AI book search.

Conversational AI responses for general questions.

Structured AI output that converts natural-language requests into database filters.

PostgreSQL-backed catalog with SQLAlchemy ORM.

Local AI development with Ollama.

Production AI with Google Gemini.

Production deployment using Vercel and Supabase.

Example AI Queries

You can ask the assistant things such as:

Show me beginner cybersecurity books under 300 pages

Find advanced programming books published after 2020

I want an intermediate technology book with fewer than 500 pages

The AI does not need the entire database as context. Gemini interprets the request and creates structured search criteria. FastAPI then applies those criteria to PostgreSQL and returns the matching books.

Architecture

                         Production

        ┌───────────────────────────────┐
        │           Browser             │
        └───────────────┬───────────────┘
                        │
                        ▼
        ┌───────────────────────────────┐
        │ Next.js / React / Tailwind    │
        │          Frontend             │
        └───────────────┬───────────────┘
                        │ /api/v1
                        ▼
        ┌───────────────────────────────┐
        │      FastAPI / Python         │
        │       Backend API             │
        └───────────┬───────────┬───────┘
                    │           │
                    │           │ AI request
                    │           ▼
                    │   ┌──────────────────┐
                    │   │ Google Gemini    │
                    │   │ Structured JSON  │
                    │   └────────┬─────────┘
                    │            │
                    │            ▼
                    │   Structured filters
                    │
                    ▼
        ┌───────────────────────────────┐
        │       Supabase PostgreSQL    │
        │         Book Database         │
        └───────────────────────────────┘

                         Local Development

        FastAPI ───────────────► Ollama
                                  │
                                  ▼
                           Local LLM Model

AI Search Flow

User natural-language request
            │
            ▼
        Gemini / Ollama
            │
            ▼
Structured search intent
            │
            ▼
        FastAPI
            │
            ▼
   SQLAlchemy database query
            │
            ▼
     PostgreSQL / Supabase
            │
            ▼
     Matching book records
            │
            ▼
       Frontend response

The LLM is used for intent understanding and structured filter extraction. The database remains the source of truth for the actual book retrieval.

Technology Stack

Frontend

Next.js 14

React 18

TypeScript

Tailwind CSS

Backend

Python

FastAPI

Uvicorn

Pydantic / Pydantic Settings

SQLAlchemy 2

psycopg2

Database

PostgreSQL 16 for local development

Supabase PostgreSQL for production

AI

Ollama for local development

Google Gemini API for production

google-genai Python SDK

Structured JSON output

Pydantic validation

Deployment

Vercel for the frontend and FastAPI service

Supabase for the hosted PostgreSQL database

Development / Testing

Git / GitHub

Python unittest

TypeScript compiler

Next.js production build

Project Structure

ai-library-/
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   └── v1/
│   │   │       └── endpoints/
│   │   │           ├── ai.py
│   │   │           ├── authors.py
│   │   │           ├── books.py
│   │   │           ├── genres.py
│   │   │           ├── health.py
│   │   │           └── stats.py
│   │   ├── core/
│   │   │   ├── config.py
│   │   │   └── database.py
│   │   ├── models/
│   │   ├── schemas/
│   │   └── services/
│   │       └── book_search.py
│   ├── tests/
│   │   └── test_ai_search.py
│   ├── main.py
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   ├── components/
│   │   └── lib/
│   ├── package.json
│   └── ...
├── compose.yaml
├── vercel.json
├── .gitignore
└── README.md

Prerequisites

Install the following before running the project locally:

Git

Python 3.11+ recommended

Node.js and npm

Docker and Docker Compose

Ollama

Check versions:

python3 --version
node --version
npm --version
docker --version
ollama --version

Local Setup

1. Clone the repository

git clone https://github.com/Nikhilcheruvittl/ai-library-.git
cd ai-library-

2. Start PostgreSQL

The local database is defined in compose.yaml.

docker compose up -d

The local application uses PostgreSQL through the configured DATABASE_URL.

Keep the database password consistent with your local environment configuration. Do not commit credentials.

3. Create the Python virtual environment

python3 -m venv .venv
source .venv/bin/activate

4. Install backend dependencies

pip install -r backend/requirements.txt

5. Configure environment variables

Create a local .env file using the values appropriate for your machine.

Example structure:

DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5433/ai_library_db

AI_PROVIDER=ollama
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=qwen2.5:1.5b

# Only needed when using Gemini locally:
# GEMINI_API_KEY=YOUR_GEMINI_API_KEY
# GEMINI_MODEL=gemini-3.6-flash

Never commit .env or API keys to GitHub.

6. Install and prepare Ollama

Make sure Ollama is running:

ollama serve

In another terminal, pull the model used by this project:

ollama pull qwen2.5:1.5b

Verify the model:

ollama list

7. Start the FastAPI backend

From the repository root:

PYTHONPATH=backend .venv/bin/python -m uvicorn app.main:app --reload --port 8000

Backend API:

http://localhost:8000

Swagger documentation:

http://localhost:8000/docs

Health check:

http://localhost:8000/api/v1/health

8. Start the Next.js frontend

Open a second terminal:

cd frontend
npm install
npm run dev

Frontend:

http://localhost:3000

The frontend uses the local FastAPI API during development.

Environment Configuration

Local

AI_PROVIDER=ollama
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=qwen2.5:1.5b

Production

Vercel uses server-side environment variables:

DATABASE_URL=<Supabase transaction-pooler connection string>
GEMINI_API_KEY=<your Gemini API key>
AI_PROVIDER=gemini

The Gemini model defaults to:

GEMINI_MODEL=gemini-3.6-flash

API secrets must stay in Vercel Environment Variables and must never be exposed in frontend code.

API Endpoints

Main backend endpoints include:

GET  /api/v1/health
GET  /api/v1/books
GET  /api/v1/books/{id}
GET  /api/v1/genres
GET  /api/v1/authors
GET  /api/v1/stats
POST /api/v1/ai/parse-search
POST /api/v1/ai/search

Example book request

curl "http://localhost:8000/api/v1/books?limit=12&offset=0"

Example AI search request

curl -X POST "http://localhost:8000/api/v1/ai/search" \
  -H "Content-Type: application/json" \
  -d '{"query":"beginner cybersecurity books under 300 pages"}'

Database

The application uses SQLAlchemy ORM models for:

books

authors

genres

book_authors

book_genres

The production Supabase database currently contains the project catalog used by the application.

For local development, PostgreSQL runs through Docker.

A local SQL backup can be kept outside Git for recovery purposes. Do not commit database dumps containing application data unless intentionally required.

AI Architecture Details

Intent classification

The AI assistant classifies requests into two broad categories:

book_search — the user wants books or book filters.

conversation — the user is greeting, asking a general question, or having a normal conversation.

For a book-search request, the model produces structured filters such as:

{
  "intent": "book_search",
  "book_search": {
    "difficulty_level": "Beginner",
    "page_count": {
      "operator": "lt",
      "value": 300
    }
  },
  "message": null
}

FastAPI validates that structure with Pydantic and then applies the filters to the database through the deterministic book-search service.

Structured output compatibility

The production Gemini integration sanitizes unsupported JSON Schema validation keywords before sending the schema to Gemini. The final Gemini response is still validated against the application's original Pydantic model, so application-level constraints remain enforced.

Testing

Backend tests

PYTHONPATH=backend .venv/bin/python -m unittest discover -s backend/tests

The current test suite covers API behavior, AI provider routing, Gemini structured-output schema handling, and validation behavior.

Frontend type checking

cd frontend
npx tsc --noEmit

Production build

npm run build

Production Deployment

The application is deployed using Vercel.

High-level deployment flow:

GitHub main branch
       │
       ▼
     Vercel
   ┌───┴──────────────┐
   ▼                  ▼
Next.js             FastAPI
   │                  │
   │                  ├── Gemini API
   │                  │
   │                  └── Supabase PostgreSQL
   │
   └────── Production website

The stable production domain is:

https://ai-library-five.vercel.app

After pushing changes to main, Vercel creates a new deployment. Verify the deployment is Ready before testing production.

Security Notes

Never commit GEMINI_API_KEY, database passwords, or other secrets.

Keep production secrets in Vercel Environment Variables.

Keep local secrets in .env files excluded by .gitignore.

The browser should communicate with the backend API rather than receiving the Gemini API key.

The LLM generates search intent/filter data; the database remains the source of truth for book records.

Do not commit ai_library_backup.sql or other sensitive database dumps to the public repository.

Current Project Status

Frontend deployed: ✅

FastAPI deployed: ✅

Supabase PostgreSQL connected: ✅

Book catalog populated: ✅

Natural-language AI search: ✅

Local Ollama support: ✅

Production Gemini support: ✅

Structured AI output validation: ✅

Automated backend tests: ✅

Future Learning / Extension Ideas

This project is designed to grow into a practical LLM application. Potential next steps include:

Embeddings and semantic/vector search.

Retrieval-Augmented Generation (RAG).

Tool/function calling.

Conversation memory.

LLM evaluation and test datasets.

Prompt-injection and LLM security testing.

Streaming AI responses.

More advanced recommendations and personalization.

License

Add the license you choose for this project before publishing the repository as an open-source project.

Author

Nikhil P C

GitHub: https://github.com/Nikhilcheruvittl

This project is built as a learning-focused application for exploring modern web development, APIs, databases, and LLM application architecture.
