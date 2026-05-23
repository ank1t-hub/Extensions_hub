# ExtensionHub — Database Schema

Implemented in **Phase 1** with SQLAlchemy models and Alembic migration `001_initial`.

## `users`

| Column | Type | Notes |
|--------|------|--------|
| id | UUID (CHAR 36) PK | |
| username | VARCHAR(64) UNIQUE | |
| email | VARCHAR(255) UNIQUE | |
| password_hash | VARCHAR(255) | bcrypt |
| role | ENUM | `admin`, `developer`, `user` |
| is_active | BOOLEAN | default true |
| created_at | DATETIME | |
| updated_at | DATETIME | |

## `extensions`

| Column | Type | Notes |
|--------|------|--------|
| id | UUID (PK) | |
| title | VARCHAR(200) | |
| description | TEXT | |
| author_id | UUID (FK → users) | |
| download_count | INT | default 0 |
| logo_path | VARCHAR(512) | optional |
| created_at | DATETIME | |
| updated_at | DATETIME | |

## `extension_versions`

| Column | Type | Notes |
|--------|------|--------|
| id | UUID (PK) | |
| extension_id | UUID (FK) | |
| version | VARCHAR(50) | unique per extension |
| changelog | TEXT | optional |
| file_path | VARCHAR(512) | |
| is_latest | BOOLEAN | |
| created_at | DATETIME | |

## `documentation`

| Column | Type | Notes |
|--------|------|--------|
| id | UUID (PK) | |
| extension_id | UUID (FK) UNIQUE | one doc per extension (MVP) |
| markdown_content | TEXT | |
| updated_at | DATETIME | |

## `categories`

| Column | Type |
|--------|------|
| id | UUID (PK) |
| name | VARCHAR(100) UNIQUE |
| slug | VARCHAR(100) UNIQUE |

## `extension_categories` (join)

| extension_id | category_id |

---

## Migrations & seed

```bash
cd backend
alembic upgrade head
python ../scripts/seed-dev-data.py
```

**Dev seed accounts** (change in production):

| Email | Password | Role |
|-------|----------|------|
| admin@example.com | Admin123! | admin |
| dev@example.com | Dev123! | developer |
| user@example.com | User123! | user |

> Uses `@example.com` because Pydantic `EmailStr` rejects `.local` addresses.

---

## Relationships

- User **1—N** Extensions (as author)
- Extension **1—N** ExtensionVersions
- Extension **1—1** Documentation (MVP)
- Extension **N—M** Categories
