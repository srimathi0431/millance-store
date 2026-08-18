from pydantic import BaseModel, EmailStr, field_validator
from datetime import datetime
from db.models import UserRole


# ---------------------------------------------------------------------------
# Request schemas
# ---------------------------------------------------------------------------

class LoginRequest(BaseModel):
    """Payload for both admin and vendor login endpoints."""
    email: EmailStr
    password: str

    @field_validator("password")
    @classmethod
    def password_must_not_be_empty(cls, v: str) -> str:
        if not v or not v.strip():
            raise ValueError("Password must not be empty")
        return v


# ---------------------------------------------------------------------------
# Response schemas
# ---------------------------------------------------------------------------

class TokenResponse(BaseModel):
    """JWT token returned on successful login."""
    access_token: str
    token_type: str = "bearer"
    role: UserRole
    email: EmailStr


class UserOut(BaseModel):
    """Public-safe representation of a user record."""
    id: int
    email: EmailStr
    role: UserRole
    is_active: bool
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class ErrorResponse(BaseModel):
    """Standard error envelope."""
    detail: str
