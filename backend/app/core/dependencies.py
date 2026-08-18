from fastapi import Depends, Header
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from typing import Optional

from db.database import get_db
from app.core.security import decode_token
from app.core.exceptions import UnauthorizedError, ForbiddenError
from app.models.admin import Admin, AdminRole

bearer_scheme = HTTPBearer(auto_error=False)


def get_current_admin(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(bearer_scheme),
    db: Session = Depends(get_db),
) -> Admin:
    if not credentials:
        raise UnauthorizedError("Authentication required")

    payload = decode_token(credentials.credentials)
    if not payload:
        raise UnauthorizedError("Invalid or expired token")

    if payload.get("type") != "access":
        raise UnauthorizedError("Invalid token type")

    admin_id = payload.get("sub")
    if not admin_id:
        raise UnauthorizedError("Invalid token payload")

    admin = db.query(Admin).filter(Admin.id == int(admin_id), Admin.is_active == True).first()
    if not admin:
        raise UnauthorizedError("Admin account not found or deactivated")

    return admin


def require_permission(permission: str):
    """Returns a dependency that checks if the current admin has a specific permission."""
    def checker(admin: Admin = Depends(get_current_admin)) -> Admin:
        # SUPER_ADMIN bypasses all permission checks
        if admin.role == AdminRole.SUPER_ADMIN:
            return admin
        if not admin.has_permission(permission):
            raise ForbiddenError(f"Permission denied: {permission}")
        return admin
    return checker


def require_roles(*roles: AdminRole):
    """Returns a dependency that checks admin role."""
    def checker(admin: Admin = Depends(get_current_admin)) -> Admin:
        if admin.role not in roles:
            raise ForbiddenError("Insufficient role")
        return admin
    return checker


def get_client_ip(x_forwarded_for: Optional[str] = Header(None)) -> str:
    if x_forwarded_for:
        return x_forwarded_for.split(",")[0].strip()
    return "unknown"
