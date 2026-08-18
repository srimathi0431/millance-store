from pydantic import BaseModel, field_validator
from typing import Optional
from datetime import datetime
from decimal import Decimal
from app.models.payment import PaymentStatus, RefundStatus


class PaymentOut(BaseModel):
    id: int
    order_id: int
    customer_id: Optional[int]
    amount: Decimal
    currency: str
    payment_method: Optional[str]
    gateway: Optional[str]
    transaction_id: Optional[str]
    status: str
    paid_at: Optional[datetime]
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class RefundCreate(BaseModel):
    amount: Decimal
    reason: Optional[str] = None

    @field_validator("amount")
    @classmethod
    def amount_positive(cls, v: Decimal) -> Decimal:
        if v <= 0:
            raise ValueError("Refund amount must be greater than 0")
        return v


class RefundOut(BaseModel):
    id: int
    order_id: int
    payment_id: int
    admin_id: Optional[int]
    amount: Decimal
    reason: Optional[str]
    status: str
    gateway_refund_id: Optional[str]
    processed_at: Optional[datetime]
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}
