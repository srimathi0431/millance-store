from pydantic import BaseModel, field_validator
from typing import Optional, List
from datetime import datetime
from decimal import Decimal
from app.models.order import OrderStatus


# ─────────────────────────────────────────────────────────────────────────────
# Sub-schemas
# ─────────────────────────────────────────────────────────────────────────────

class OrderItemOut(BaseModel):
    id:             int
    product_id:     Optional[int]
    product_name:   str
    product_sku:    str
    variant_id:     Optional[int]
    quantity:       int
    unit_price:     Decimal
    discount_price: Optional[Decimal]
    tax_percent:    Decimal
    total_price:    Decimal

    model_config = {"from_attributes": True}


class OrderStatusHistoryOut(BaseModel):
    id:          int
    from_status: Optional[str]
    to_status:   str
    notes:       Optional[str]
    changed_by:  Optional[int]
    changed_at:  datetime

    model_config = {"from_attributes": True}


# ─────────────────────────────────────────────────────────────────────────────
# List response (lightweight — no items/history)
# ─────────────────────────────────────────────────────────────────────────────

class OrderListOut(BaseModel):
    id:              int
    order_number:    str
    customer_id:     Optional[int]
    customer_name:   Optional[str] = None   # joined from customers table
    customer_phone:  Optional[str] = None
    status:          str
    total_amount:    Decimal
    tracking_number: Optional[str]
    courier_name:    Optional[str]
    created_at:      datetime
    confirmed_at:    Optional[datetime]
    packed_at:       Optional[datetime]
    dispatched_at:   Optional[datetime]
    delivered_at:    Optional[datetime]

    model_config = {"from_attributes": True}


# ─────────────────────────────────────────────────────────────────────────────
# Full detail response
# ─────────────────────────────────────────────────────────────────────────────

class OrderOut(BaseModel):
    id:               int
    order_number:     str
    customer_id:      Optional[int]
    customer_name:    Optional[str] = None
    customer_phone:   Optional[str] = None
    status:           str
    subtotal:         Decimal
    discount_amount:  Decimal
    tax_amount:       Decimal
    shipping_amount:  Decimal
    total_amount:     Decimal
    coupon_id:        Optional[int]
    shipping_name:    Optional[str]
    shipping_phone:   Optional[str]
    shipping_address: Optional[str]
    tracking_number:  Optional[str]
    courier_name:     Optional[str]
    notes:            Optional[str]
    cancelled_reason: Optional[str]
    return_reason:    Optional[str]
    confirmed_at:     Optional[datetime]
    packed_at:        Optional[datetime]
    dispatched_at:    Optional[datetime]
    delivered_at:     Optional[datetime]
    created_at:       datetime
    updated_at:       datetime
    items:            List[OrderItemOut]          = []
    history:          List[OrderStatusHistoryOut] = []

    model_config = {"from_attributes": True}


# ─────────────────────────────────────────────────────────────────────────────
# Request schemas — generic + stage-specific
# ─────────────────────────────────────────────────────────────────────────────

class OrderStatusUpdate(BaseModel):
    """Generic status update — used by PATCH /{id}/status."""
    status: OrderStatus
    notes:  Optional[str] = None


class OrderCancelRequest(BaseModel):
    reason: Optional[str] = None


class OrderConfirmRequest(BaseModel):
    """PENDING → CONFIRMED."""
    notes: Optional[str] = None


class OrderPackRequest(BaseModel):
    """PROCESSING → PACKED."""
    notes: Optional[str] = None


class OrderDispatchRequest(BaseModel):
    """PACKED → SHIPPED.  tracking_number is required at this stage."""
    tracking_number: str
    courier_name:    Optional[str] = None
    notes:           Optional[str] = None

    @field_validator("tracking_number")
    @classmethod
    def tracking_not_empty(cls, v: str) -> str:
        if not v or not v.strip():
            raise ValueError("tracking_number is required when dispatching an order")
        return v.strip()


class OrderDeliverRequest(BaseModel):
    """OUT_FOR_DELIVERY → DELIVERED."""
    notes: Optional[str] = None


class OrderReturnApproveRequest(BaseModel):
    """RETURN_REQUESTED → RETURNED."""
    notes: Optional[str] = None


class OrderReturnRejectRequest(BaseModel):
    """RETURN_REQUESTED → DELIVERED  (reject the return, mark as delivered again)."""
    notes: Optional[str] = None
