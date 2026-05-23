# ExtensionHub — Architecture

## Overview

Monorepo with a React SPA and a FastAPI REST API backed by MySQL.

```
Browser → frontend (Vite/React) → backend (FastAPI) → MySQL
                              ↘ local file storage (uploads/)
```

## Repository layout

| Path | Role |
|------|------|
| `frontend/` | Public UI, developer dashboard, admin dashboard |
| `backend/app/` | API, auth, services, models (Phase 1+) |
| `backend/uploads/` | Extension binaries (MVP local storage) |
| `docs/` | Contracts and schema reference |

## API versioning

All REST routes live under `/api/v1` (see `docs/api-contract.md`).

## Authentication (Phase 2+)

- JWT access tokens
- Roles: `admin`, `developer`, `user`
- Password hashing (bcrypt/argon2)

## Phased delivery

| Phase | Focus |
|-------|--------|
| **0** | Scaffold, Docker MySQL, health check, design tokens |
| **1** | SQLAlchemy models, Alembic migrations |
| **2** | Auth APIs + frontend auth |
| **3** | Extensions CRUD, upload, download |
| **4** | Documentation (markdown) |
| **5** | Public pages (listing, details) |
| **6** | Developer dashboard |
| **7** | Admin dashboard |
| **8** | Security hardening |
| **9** | Integration & polish |

## Future-ready (not MVP)

- Dark mode via `ThemeContext` + CSS variables in `tokens.css`
- Cloud storage abstraction behind upload service
- Elasticsearch, CDN, microservices — out of scope for MVP
