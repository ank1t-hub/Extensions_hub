# ExtensionHub

A minimalist developer-focused platform to browse extensions, read documentation, and download releases.

## Stack

- **Frontend:** React, Vite, Tailwind CSS
- **Backend:** FastAPI
- **Database:** MySQL 8

## Prerequisites

- Node.js 18+
- Python 3.11+
- Docker Desktop (for local MySQL)

## Quick start

### 1. Environment (Phase 0.2 — required before Phase 1 migrations)

```bash
cp .env.example .env
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

Edit `.env` files with your local values. See [docs/env-setup.md](docs/env-setup.md) for how the two `.env` files relate to each phase.

**Important:** `MYSQL_PORT` in root `.env` must match the port in `backend/.env` → `DATABASE_URL` (e.g. both `3307`).

### 2. Database (Docker)

```bash
docker compose up -d
```

MySQL runs on `localhost:3306` by default.

### 3. Backend

```bash
cd backend
python -m venv .venv
# Windows: .venv\Scripts\activate
# macOS/Linux: source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

- API: http://localhost:8000
- Docs: http://localhost:8000/docs
- Health: http://localhost:8000/api/v1/health

### 4. Frontend

```bash
cd frontend
npm install
npm run dev
```

App: http://localhost:5173

## Project structure

```
Extensions_hub/
├── frontend/     # React + Tailwind
├── backend/      # FastAPI
├── docs/         # Architecture & API contract
└── scripts/      # Dev helpers
```

## Database setup (Phase 1)

With MySQL running (`docker compose up -d`):

```bash
cd backend
# activate venv, then:
pip install -r requirements.txt
alembic upgrade head
python ../scripts/seed-dev-data.py
```

## Development phases

See `docs/architecture.md` for the phased roadmap.

- **Phase 0** — Scaffold, Docker, health check, base UI
- **Phase 1** — SQLAlchemy models, Alembic migrations, Pydantic schemas, dev seed
- **Phase 2** — JWT auth (signup/login/logout/me), RBAC dependencies, frontend auth UI
