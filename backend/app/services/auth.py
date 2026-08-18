from sqlalchemy.orm import Session
from datetime import datetime, timezone, timedelta
from typing import Tuple

from app.core.security import (
    verify_password, create_access_token, create_refresh_token,
    decode_token, get_token_expires_in
)
from app.core.config import settings
from app.core.exceptions import UnauthorizedError, BadRequestError, NotFoundError
from app.repositories import admin as admin_repo
from app.repositories import audit as audit_repo
from app.models.admin import Admin


def login(db: Session, email: str, password: str,
          ip: str = None, user_agent: str = None) -> dict:
    admin = admin_repo.get_admin_by_email(db, email)
    if not admin or not admin.is_active:
        raise UnauthorizedError("Invalid email or password")
    if not verify_password(password, admin.hashed_password):
        raise UnauthorizedError("Invalid email or password")

    access_token = create_access_token({"sub": str(admin.id), "role": admin.role.value})
    refresh_token = create_refresh_token({"sub": str(admin.id)})

    expires_at = datetime.now(timezone.utc) + timedelta(minutes=settings.REFRESH_TOKEN_EXPIRE_MINUTES)
    admin_repo.store_refresh_token(db, admin.id, refresh_token, expires_at)
    admin_repo.update_last_login(db, admin)

    audit_repo.log_action(db, "ADMIN_LOGIN", admin_id=admin.id,
                          entity_type="admin", entity_id=admin.id,
                          ip_address=ip, user_agent=user_agent)

    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer",
        "expires_in": get_token_expires_in(),
    }


def refresh(db: Session, refresh_token: str) -> dict:
    payload = decode_token(refresh_token)
    if not payload or payload.get("type") != "refresh":
        raise UnauthorizedError("Invalid or expired refresh token")

    stored = admin_repo.get_refresh_token(db, refresh_token)
    if not stored:
        raise UnauthorizedError("Refresh token has been revoked or expired")

    admin = admin_repo.get_admin_by_id(db, int(payload["sub"]))
    if not admin or not admin.is_active:
        raise UnauthorizedError("Admin account not found or deactivated")

    # Revoke old token (rotation)
    admin_repo.revoke_refresh_token(db, refresh_token)

    # Issue new tokens
    new_access = create_access_token({"sub": str(admin.id), "role": admin.role.value})
    new_refresh = create_refresh_token({"sub": str(admin.id)})
    expires_at = datetime.now(timezone.utc) + timedelta(minutes=settings.REFRESH_TOKEN_EXPIRE_MINUTES)
    admin_repo.store_refresh_token(db, admin.id, new_refresh, expires_at)

    return {
        "access_token": new_access,
        "refresh_token": new_refresh,
        "token_type": "bearer",
        "expires_in": get_token_expires_in(),
    }


def logout(db: Session, refresh_token: str, admin: Admin,
           ip: str = None, user_agent: str = None) -> None:
    admin_repo.revoke_refresh_token(db, refresh_token)
    audit_repo.log_action(db, "ADMIN_LOGOUT", admin_id=admin.id,
                          entity_type="admin", entity_id=admin.id,
                          ip_address=ip, user_agent=user_agent)


def change_password(db: Session, admin: Admin, current_password: str,
                    new_password: str, ip: str = None, user_agent: str = None) -> None:
    if not verify_password(current_password, admin.hashed_password):
        raise BadRequestError("Current password is incorrect")
    admin_repo.update_admin_password(db, admin, new_password)
    admin_repo.revoke_all_refresh_tokens(db, admin.id)
    audit_repo.log_action(db, "ADMIN_PASSWORD_CHANGED", admin_id=admin.id,
                          entity_type="admin", entity_id=admin.id,
                          ip_address=ip, user_agent=user_agent)


def forgot_password(db: Session, email: str) -> str:
    """Returns reset token (in production this would be emailed)."""
    import secrets
    admin = admin_repo.get_admin_by_email(db, email)
    if not admin:
        # Don't reveal existence
        return "If this email exists, a reset link has been sent."
    token = secrets.token_urlsafe(32)
    expires = datetime.now(timezone.utc) + timedelta(hours=1)
    admin_repo.set_reset_token(db, admin, token, expires)
    return token  # In production: send via email, return generic message


def reset_password(db: Session, token: str, new_password: str) -> None:
    admin = admin_repo.get_admin_by_reset_token(db, token)
    if not admin:
        raise BadRequestError("Invalid or expired reset token")
    admin_repo.update_admin_password(db, admin, new_password)
