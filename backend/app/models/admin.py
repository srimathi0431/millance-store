import enum
from sqlalchemy import Column, Integer, String, Boolean, DateTime, Enum, Text, ForeignKey, JSON
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from db.base import Base


class AdminRole(str, enum.Enum):
    SUPER_ADMIN = "SUPER_ADMIN"
    ADMIN = "ADMIN"
    MANAGER = "MANAGER"
    STAFF = "STAFF"


# All available permissions
PERMISSIONS = [
    "dashboard.view",
    "products.view", "products.create", "products.update", "products.delete",
    "categories.view", "categories.create", "categories.update", "categories.delete",
    "orders.view", "orders.update",
    "users.view", "users.update",
    "inventory.view", "inventory.update",
    "payments.view",
    "coupons.view", "coupons.create", "coupons.update", "coupons.delete",
    "reviews.view", "reviews.update",
    "reports.view",
    "settings.view", "settings.update",
]


class Admin(Base):
    __tablename__ = "admins"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String(255), nullable=False)
    email = Column(String(255), unique=True, nullable=False, index=True)
    hashed_password = Column(String(255), nullable=False)
    role = Column(Enum(AdminRole), nullable=False, default=AdminRole.STAFF)
    permissions = Column(JSON, nullable=False, default=list)  # list of permission strings
    is_active = Column(Boolean, default=True, nullable=False)
    last_login_at = Column(DateTime(timezone=True), nullable=True)
    password_reset_token = Column(String(255), nullable=True)
    password_reset_expires = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

    refresh_tokens = relationship("AdminRefreshToken", back_populates="admin", cascade="all, delete-orphan")
    audit_logs = relationship("AuditLog", back_populates="admin")

    def has_permission(self, permission: str) -> bool:
        if self.role == AdminRole.SUPER_ADMIN:
            return True
        return permission in (self.permissions or [])


class AdminRefreshToken(Base):
    __tablename__ = "admin_refresh_tokens"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    admin_id = Column(Integer, ForeignKey("admins.id", ondelete="CASCADE"), nullable=False, index=True)
    token_hash = Column(String(255), unique=True, nullable=False, index=True)
    expires_at = Column(DateTime(timezone=True), nullable=False)
    is_revoked = Column(Boolean, default=False, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    admin = relationship("Admin", back_populates="refresh_tokens")
