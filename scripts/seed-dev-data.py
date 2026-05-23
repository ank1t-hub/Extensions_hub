#!/usr/bin/env python3
"""Seed development users and categories. Run after: alembic upgrade head"""
from __future__ import annotations

import sys
from pathlib import Path

BACKEND_ROOT = Path(__file__).resolve().parents[1] / "backend"
sys.path.insert(0, str(BACKEND_ROOT))

from sqlalchemy import select

from app.auth.password import hash_password
from app.database.connection import SessionLocal
from app.models import Category, User
from app.models.user import UserRole

DEV_USERS = [
    {
        "username": "admin",
        "email": "admin@extensionhub.local",
        "password": "Admin123!",
        "role": UserRole.admin,
    },
    {
        "username": "devuser",
        "email": "dev@extensionhub.local",
        "password": "Dev123!",
        "role": UserRole.developer,
    },
    {
        "username": "testuser",
        "email": "user@extensionhub.local",
        "password": "User123!",
        "role": UserRole.user,
    },
]

DEV_CATEGORIES = [
    ("Productivity", "productivity"),
    ("Themes", "themes"),
    ("Developer Tools", "developer-tools"),
    ("Other", "other"),
]


def seed_users(db) -> None:
    for data in DEV_USERS:
        exists = db.scalar(select(User).where(User.email == data["email"]))
        if exists:
            print(f"  skip user (exists): {data['email']}")
            continue
        user = User(
            username=data["username"],
            email=data["email"],
            password_hash=hash_password(data["password"]),
            role=data["role"],
            is_active=True,
        )
        db.add(user)
        print(f"  created user: {data['email']} ({data['role'].value})")


def seed_categories(db) -> None:
    for name, slug in DEV_CATEGORIES:
        exists = db.scalar(select(Category).where(Category.slug == slug))
        if exists:
            print(f"  skip category (exists): {slug}")
            continue
        db.add(Category(name=name, slug=slug))
        print(f"  created category: {slug}")


def main() -> None:
    print("Seeding ExtensionHub dev data...")
    db = SessionLocal()
    try:
        seed_users(db)
        seed_categories(db)
        db.commit()
        print("Done.")
    except Exception as exc:
        db.rollback()
        print(f"Seed failed: {exc}", file=sys.stderr)
        raise
    finally:
        db.close()


if __name__ == "__main__":
    main()
