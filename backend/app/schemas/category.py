from pydantic import BaseModel, field_validator
from typing import Optional, List
from datetime import datetime


class CategoryCreate(BaseModel):
    name: str
    description: Optional[str] = None
    image_url: Optional[str] = None
    parent_id: Optional[int] = None
    is_active: bool = True
    sort_order: int = 0

    @field_validator("name")
    @classmethod
    def name_not_empty(cls, v: str) -> str:
        if not v or not v.strip():
            raise ValueError("Category name must not be empty")
        if len(v) > 255:
            raise ValueError("Category name must be 255 characters or less")
        return v.strip()


class CategoryUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    image_url: Optional[str] = None
    parent_id: Optional[int] = None
    sort_order: Optional[int] = None


class CategoryStatusUpdate(BaseModel):
    is_active: bool


class CategoryOut(BaseModel):
    id: int
    name: str
    slug: str
    description: Optional[str]
    image_url: Optional[str]
    parent_id: Optional[int]
    is_active: bool
    sort_order: int
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}
