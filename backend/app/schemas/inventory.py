from pydantic import BaseModel, field_validator
from typing import Optional
from datetime import datetime
from app.models.inventory import TransactionType


class InventoryOut(BaseModel):
    id: int
    product_id: int
    product_name: Optional[str] = None   # enriched from join
    product_sku: Optional[str] = None    # enriched from join
    total_stock: int
    reserved_stock: int
    available_stock: int
    low_stock_threshold: int
    is_low_stock: bool
    is_out_of_stock: bool
    updated_at: datetime

    model_config = {"from_attributes": True}


class InventoryUpdate(BaseModel):
    transaction_type: TransactionType
    quantity: int
    notes: Optional[str] = None

    @field_validator("quantity")
    @classmethod
    def quantity_positive(cls, v: int) -> int:
        if v <= 0:
            raise ValueError("Quantity must be greater than 0")
        return v


class InventoryThresholdUpdate(BaseModel):
    low_stock_threshold: int

    @field_validator("low_stock_threshold")
    @classmethod
    def threshold_non_negative(cls, v: int) -> int:
        if v < 0:
            raise ValueError("Low stock threshold must be non-negative")
        return v


class InventoryTransactionOut(BaseModel):
    id: int
    transaction_type: str
    quantity: int
    previous_stock: int
    new_stock: int
    reference_id: Optional[str]
    notes: Optional[str]
    admin_id: Optional[int]
    created_at: datetime

    model_config = {"from_attributes": True}
