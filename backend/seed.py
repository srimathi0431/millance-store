"""
seed.py — Seeds the database with the default admin and vendor accounts.

Usage:
    python seed.py

Run this AFTER applying migrations:
    alembic upgrade head
    python seed.py
"""

import os
import sys

from dotenv import load_dotenv
from sqlalchemy.orm import Session

load_dotenv()

# Ensure the backend root is on sys.path when run directly.
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from db.database import SessionLocal
from db.models import UserRole
from db.queries import get_user_by_email, create_user
from auth.utils import hash_password


def seed() -> None:
    db: Session = SessionLocal()

    seeds = [
        {
            "email": os.getenv("ADMIN_EMAIL", "admin@millance.store"),
            "password": os.getenv("ADMIN_PASSWORD", "12345678"),
            "role": UserRole.admin,
        },
        {
            "email": os.getenv("VENDOR_EMAIL", "vendor@millance.store"),
            "password": os.getenv("VENDOR_PASSWORD", "12345678"),
            "role": UserRole.vendor,
        },
    ]

    try:
        for entry in seeds:
            existing = get_user_by_email(db, entry["email"])
            if existing:
                print(f"[SKIP]  {entry['email']} already exists (role={existing.role.value})")
            else:
                user = create_user(
                    db,
                    email=entry["email"],
                    hashed_password=hash_password(entry["password"]),
                    role=entry["role"],
                )
                print(f"[OK]    Created {user.role.value} → {user.email}  (id={user.id})")
    finally:
        db.close()

    print("\nSeeding complete.")


if __name__ == "__main__":
    seed()
