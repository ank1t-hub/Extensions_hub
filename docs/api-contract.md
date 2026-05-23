# ExtensionHub — API Contract (v1)

Base URL: `http://localhost:8000/api/v1`

Interactive docs: `http://localhost:8000/docs`

---

## Health

### `GET /health`

**Response 200**

```json
{
  "status": "ok",
  "app": "ExtensionHub API",
  "environment": "development",
  "database": "connected"
}
```

`status` is `degraded` when MySQL is unreachable.

---

## Authentication (Phase 2 — implemented)

### `POST /auth/signup`

**Body**

```json
{
  "username": "string",
  "email": "string",
  "password": "string",
  "role": "user"
}
```

**Response 201** — user object (no password).

### `POST /auth/login`

**Body**

```json
{
  "email": "string",
  "password": "string"
}
```

**Response 200**

```json
{
  "access_token": "string",
  "token_type": "bearer"
}
```

### `POST /auth/logout`

**Headers:** `Authorization: Bearer <token>`

**Response 200** — `{ "message": "Logged out successfully" }` (client clears stored token).

### `GET /auth/me`

**Headers:** `Authorization: Bearer <token>`

**Response 200** — current user object (same shape as signup `user`).

---

## Extensions (Phase 3)

### `GET /extensions`

Query: `q`, `category`, `page`, `limit`

**Response 200**

```json
{
  "items": [
    {
      "id": "uuid",
      "title": "string",
      "description": "string",
      "version": "string",
      "download_count": 0,
      "author_id": "uuid"
    }
  ],
  "total": 0,
  "page": 1,
  "limit": 20
}
```

### `GET /extensions/{id}`

**Response 200** — full extension detail including versions summary.

### `POST /extensions`

**Auth:** developer or admin  
**Content-Type:** `multipart/form-data`  
Fields: `title`, `description`, `version`, `file`, optional `logo`

**Response 201**

### `PUT /extensions/{id}`

**Auth:** owner developer or admin  
**Body:** metadata fields (JSON)

**Response 200**

### `DELETE /extensions/{id}`

**Auth:** owner developer or admin  

**Response 204**

---

## Documentation (Phase 4)

### `GET /docs/{extension_id}`

**Response 200**

```json
{
  "extension_id": "uuid",
  "markdown_content": "string"
}
```

### `POST /docs`

**Auth:** developer (owner)

**Body**

```json
{
  "extension_id": "uuid",
  "markdown_content": "string"
}
```

### `PUT /docs/{extension_id}`

**Auth:** developer (owner)

**Body:** `{ "markdown_content": "string" }`

---

## Downloads (Phase 3)

### `GET /download/{extension_id}`

Query: optional `version`

**Response** — file stream (`application/octet-stream`)  
Increments `download_count` on success.

---

## Admin (Phase 7)

### `GET /admin/users`

### `PATCH /admin/users/{id}`

Body: `{ "role": "user" | "developer" | "admin", "is_active": true }`

### `DELETE /admin/extensions/{id}`

Moderation remove.

---

## Errors

Standard shape:

```json
{
  "detail": "Human-readable message"
}
```

| Code | Usage |
|------|--------|
| 400 | Validation |
| 401 | Missing/invalid token |
| 403 | Forbidden role |
| 404 | Not found |
| 413 | Upload too large |
| 429 | Rate limited |
