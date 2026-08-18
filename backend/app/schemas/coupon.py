from pydantic import BaseModel, field_validator, model_validator
from typing import Optional
from datetime import datetime
from decimal import Decimal
from app.models.coupon import DiscountType


class CouponCreate(BaseModel):
    code: str
    description: Optional[str] = None
    discount_type: DiscountType = DiscountType.PERCENTAGE
    discount_value: Decimal
    min_order_amount: Decimal = Decimal("0")
    max_discount_amount: Optional[Decimal] = None
    usage_limit: Optional[int] = None
    per_user_limit: int = 1
    starts_at: Optional[datetime] = None
    expires_at: Optional[datetime] = None

    @field_validator("code")
    @classmethod
    def code_not_empty(cls, v: str) -> str:
        if not v or not v.strip():
            raise ValueError("Coupon code must not be empty")
        return v.strip().upper()

    @field_validator("discount_value")
    @classmethod
    def discount_positive(cls, v: Decimal) -> Decimal:
        if v <= 0:
            raise ValueError("Discount value must be greater than 0")
        return v

    @model_validator(mode="after")
    def validate_dates(self):
        if self.starts_at and self.expires_at:
            if self.expires_at <= self.starts_at:
                raise ValueError("Expiry date must be after start date")
        return self


class CouponUpdate(BaseModel):
    description: Optional[str] = None
    discount_value: Optional[Decimal] = None
    min_order_amount: Optional[Decimal] = None
    max_discount_amount: Optional[Decimal] = None
    usage_limit: Optional[int] = None
    per_user_limit: Optional[int] = None
    starts_at: Optional[datetime] = None
    expires_at: Optional[datetime] = None


class CouponStatusUpdate(BaseModel):
    is_active: bool


class CouponOut(BaseModel):
    id: int
    code: str
    description: Optional[str]
    discount_type: str
    discount_value: Decimal
    min_order_amount: Decimal
    max_discount_amount: Optional[Decimal]
    usage_limit: Optional[int]
    per_user_limit: int
    used_count: int
    is_active: bool
    starts_at: Optional[datetime]
    expires_at: Optional[datetime]
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}
