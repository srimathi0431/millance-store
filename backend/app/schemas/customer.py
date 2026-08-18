from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime


class CustomerOut(BaseModel):
    id: int
    name: str
    email: EmailStr
    phone: Optional[str]
    is_active: bool
    is_blocked: bool
    email_verified: bool
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class CustomerListOut(BaseModel):
    id: int
    name: str
    email: EmailStr
    phone: Optional[str]
    is_active: bool
    is_blocked: bool
    created_at: datetime

    model_config = {"from_attributes": True}


class CustomerStatusUpdate(BaseModel):
    is_active: Optional[bool] = None
    is_blocked: Optional[bool] = None
