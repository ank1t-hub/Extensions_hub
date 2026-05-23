# ExtensionHub — Database Schema (planned)

Implemented in **Phase 1** with SQLAlchemy + Alembic.

## `users`

| Column | Type | Notes |
|--------|------|--------|
| id | UUID (PK) | |
| username | VARCHAR(64) UNIQUE | |
| email | VARCHAR(255) UNIQUE | |
| password_hash | VARCHAR(255) | |
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
| version | VARCHAR(50) | |
| changelog | TEXT | optional |
| file_path | VARCHAR(512) | |
| is_latest | BOOLEAN | |
| created_at | DATETIME | |

## `documentation`

| Column | Type | Notes |
|--------|------|--------|
| id | UUID (PK) | |
| extension_id | UUID (FK) UNIQUE | one doc per extension (MVP) |
| markdown_content | LONGTEXT | |
| updated_at | DATETIME | |

## `categories` (optional MVP+)

| Column | Type |
|--------|------|
| id | UUID (PK) |
| name | VARCHAR(100) UNIQUE |
| slug | VARCHAR(100) UNIQUE |

## `extension_categories` (join)

| extension_id | category_id |

---

## Relationships

- User **1—N** Extensions (as author)
- Extension **1—N** ExtensionVersions
- Extension **1—1** Documentation (MVP)
- Extension **N—M** Categories (optional)
