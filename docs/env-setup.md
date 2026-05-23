# Environment files — which phase?

ExtensionHub uses **two local `.env` files** (never commit them to Git). Both are created from `.env.example` templates in **Phase 0** and are **required in Phase 1** to run migrations.

| File | Created in | Used for |
|------|------------|----------|
| **Root** `.env` | **Phase 0 → Step 0.2** | `docker compose` — MySQL port, database name, user/password |
| **`backend/.env`** | **Phase 0 → Step 0.2** | FastAPI, Alembic, seed script — `DATABASE_URL` and app settings |

## Phase mapping

### Phase 0 — Step 0.2 (Local infrastructure)

- Copy templates:
  - `.env.example` → `.env` (project root)
  - `backend/.env.example` → `backend/.env`
- Start MySQL: `docker compose up -d`

### Phase 1 — Step 1.2 (Migrations & seed)

Uses **`backend/.env`** so Alembic can connect:

```bash
cd backend
alembic upgrade head
python ../scripts/seed-dev-data.py
```

Uses **root `.env`** only indirectly — Docker must expose MySQL on the same port as `DATABASE_URL`.

## Port must match

If root `.env` has:

```env
MYSQL_PORT=3307
```

then `backend/.env` must use the **same host port**:

```env
DATABASE_URL=mysql+pymysql://extensionhub:extensionhub@localhost:3307/extensionhub
```

Inside the container MySQL is always on `3306`; Docker maps `HOST:3307 → container:3306`.

## What you did (correct)

1. **Phase 0.2** — Created root `.env` for Docker.
2. **Phase 0.2 + Phase 1.2** — Created `backend/.env` with `DATABASE_URL` for migrations.
3. **Phase 1.2** — `docker compose up -d`, then `alembic upgrade head`, then seed.

`.env` files are **not** a separate phase; they are setup steps that bridge Phase 0 (Docker) and Phase 1 (database).

## Optional: full `backend/.env`

You can copy all keys from `backend/.env.example` (JWT, CORS, uploads). Minimum for migrations is `DATABASE_URL`; Phase 2+ needs the rest.

## Security

- `.env` and `backend/.env` are in `.gitignore`.
- Only commit `.env.example` files (no real passwords).
