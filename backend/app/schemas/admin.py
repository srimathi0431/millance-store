from pydantic import BaseModel, EmailStr, field_validator, model_validator
from typing import Optional, List
from datetime import datetime
from app.models.admin import AdminRole


class AdminLoginRequest(BaseModel):
    email: EmailStr
    password: str

    @field_validator("password")
    @classmethod
    def password_not_empty(cls, v: str) -> str:
        if not v or not v.strip():
            raise ValueError("Password must not be empty")
        return v


class AdminLoginResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    expires_in: int


class RefreshTokenRequest(BaseModel):
    refresh_token: str


class ChangePasswordRequest(BaseModel):
    current_password: str
    new_password: str
    confirm_password: str

    @model_validator(mode="after")
    def passwords_match(self):
        if self.new_password != self.confirm_password:
            raise ValueError("New password and confirm password do not match")
        if len(self.new_password) < 8:
            raise ValueError("New password must be at least 8 characters")
        return self


class ForgotPasswordRequest(BaseModel):
    email: EmailStr


class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str
    confirm_password: str

    @model_validator(mode="after")
    def passwords_match(self):
        if self.new_password != self.confirm_password:
            raise ValueError("Passwords do not match")
        if len(self.new_password) < 8:
            raise ValueError("Password must be at least 8 characters")
        return self


class AdminOut(BaseModel):
    id: int
    name: str
    email: EmailStr
    role: AdminRole
    permissions: List[str]
    is_active: bool
    last_login_at: Optional[datetime]
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class AdminCreate(BaseModel):
    name: str
    email: EmailStr
    password: str
    role: AdminRole = AdminRole.STAFF
    permissions: List[str] = []


class AdminUpdate(BaseModel):
    name: Optional[str] = None
    role: Optional[AdminRole] = None
    permissions: Optional[List[str]] = None
    is_active: Optional[bool] = None
