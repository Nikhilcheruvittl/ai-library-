# AI Library

An end-to-end full-stack AI-ready Library Application built with Next.js, FastAPI, PostgreSQL, SQLAlchemy, Docker, and Tailwind CSS.

## Architecture

```
Browser (Next.js + TypeScript + Tailwind CSS)
    ↓ HTTP REST API
FastAPI Backend (Python + Pydantic)
    ↓ SQLAlchemy ORM
PostgreSQL Database (Docker Compose)
```

## Quick Start

### 1. Start Database Container
```bash
docker compose up -d
```

### 2. Backend Setup (FastAPI)
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python app/seed/seed_db.py  # Seed database with initial dataset
uvicorn app.main:app --reload --port 8000
```
FastAPI interactive API documentation will be available at `http://localhost:8000/docs`.

### 3. Frontend Setup (Next.js)
```bash
cd frontend
npm install
npm run dev
```
Frontend web application will be available at `http://localhost:3000`.

## Project Structure
- `frontend/`: Next.js React client application.
- `backend/`: FastAPI Python REST API & SQLAlchemy database layer.
- `docker-compose.yml`: Local PostgreSQL database service.
