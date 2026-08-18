from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import datetime, timezone
from typing import Optional
import hashlib

from app.models.admin import Admin, AdminRefreshToken, AdminRole
from app.core.security import hash_password


def get_admin_by_email(db: Session, email: str) -> Optional[Admin]:
    return db.query(Admin).filter(Admin.email == email).first()


def get_admin_by_id(db: Session, admin_id: int) -> Optional[Admin]:
    return db.query(Admin).filter(Admin.id == admin_id).first()


def create_admin(db: Session, name: str, email: str, plain_password: str,
                 role: AdminRole = AdminRole.SUPER_ADMIN, permissions: list = None) -> Admin:
    admin = Admin(
        name=name,
        email=email,
        hashed_password=hash_password(plain_password),
        role=role,
        permissions=permissions or [],
    )
    db.add(admin)
    db.commit()
    db.refresh(admin)
    return admin


def update_last_login(db: Session, admin: Admin) -> None:
    admin.last_login_at = datetime.now(timezone.utc)
    db.commit()


def update_admin_password(db: Session, admin: Admin, new_plain_password: str) -> None:
    admin.hashed_password = hash_password(new_plain_password)
    admin.password_reset_token = None
    admin.password_reset_expires = None
    db.commit()


def set_reset_token(db: Session, admin: Admin, token: str, expires: datetime) -> None:
    admin.password_reset_token = token
    admin.password_reset_expires = expires
    db.commit()


def get_admin_by_reset_token(db: Session, token: str) -> Optional[Admin]:
    return db.query(Admin).filter(
        Admin.password_reset_token == token,
        Admin.password_reset_expires > datetime.now(timezone.utc),
    ).first()


# ---------------------------------------------------------------------------
# Refresh tokens
# ---------------------------------------------------------------------------

def _hash_token(token: str) -> str:
    return hashlib.sha256(token.encode()).hexdigest()


def store_refresh_token(db: Session, admin_id: int, token: str, expires_at: datetime) -> AdminRefreshToken:
    rt = AdminRefreshToken(
        admin_id=admin_id,
        token_hash=_hash_token(token),
        expires_at=expires_at,
    )
    db.add(rt)
    db.commit()
    db.refresh(rt)
    return rt


def get_refresh_token(db: Session, token: str) -> Optional[AdminRefreshToken]:
    return db.query(AdminRefreshToken).filter(
        AdminRefreshToken.token_hash == _hash_token(token),
        AdminRefreshToken.is_revoked == False,
        AdminRefreshToken.expires_at > datetime.now(timezone.utc),
    ).first()


def revoke_refresh_token(db: Session, token: str) -> None:
    rt = db.query(AdminRefreshToken).filter(
        AdminRefreshToken.token_hash == _hash_token(token)
    ).first()
    if rt:
        rt.is_revoked = True
        db.commit()


def revoke_all_refresh_tokens(db: Session, admin_id: int) -> None:
    db.query(AdminRefreshToken).filter(
        AdminRefreshToken.admin_id == admin_id
    ).update({"is_revoked": True})
    db.commit()
