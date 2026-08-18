from fastapi import APIRouter, Depends, Query, Body
from sqlalchemy.orm import Session
from typing import Optional

from db.database import get_db
from app.core.exceptions import success_response
from app.core.customer_dependencies import get_current_customer
from app.schemas.common import paginate
from app.schemas.customer_api import (
    PlaceOrderRequest,
    CustomerOrderOut,
    CustomerOrderListOut,
    OrderStatusHistoryPublicOut,
)
from app.services import customer_api as svc

router = APIRouter(prefix="/api/customer/orders", tags=["Customer Orders"])


@router.post("", summary="Place an order from cart")
def place_order(
    data: PlaceOrderRequest,
    db: Session = Depends(get_db),
    customer=Depends(get_current_customer),
):
    order = svc.place_order(db, customer, data)
    out   = CustomerOrderOut.model_validate(order)
    return success_response(data=out.model_dump(), message=f"Order #{order.order_number} placed successfully")


@router.get("", summary="List my orders")
def list_orders(
    page:      int           = Query(1,  ge=1),
    page_size: int           = Query(10, ge=1, le=50),
    status:    Optional[str] = Query(None),
    db: Session = Depends(get_db),
    customer=Depends(get_current_customer),
):
    orders, total = svc.list_customer_orders(db, customer, page, page_size, status)
    out = []
    for o in orders:
        item_count = len(o.items) if hasattr(o, "items") else 0
        d = CustomerOrderListOut.model_validate(o).model_dump()
        d["item_count"] = item_count
        out.append(d)
    return success_response(
        data=paginate(out, total, page, page_size),
        message="Orders loaded",
    )


@router.get("/{order_id}", summary="Get order detail with tracking timeline")
def get_order(
    order_id: int,
    db: Session = Depends(get_db),
    customer=Depends(get_current_customer),
):
    order = svc.get_customer_order(db, customer, order_id)
    out   = CustomerOrderOut.model_validate(order)
    return success_response(data=out.model_dump(), message="Order loaded")


@router.get("/{order_id}/tracking", summary="Get tracking info and status history")
def track_order(
    order_id: int,
    db: Session = Depends(get_db),
    customer=Depends(get_current_customer),
):
    order = svc.get_customer_order(db, customer, order_id)
    timeline = [OrderStatusHistoryPublicOut.model_validate(h).model_dump()
                for h in order.history]
    return success_response(data={
        "order_number":   order.order_number,
        "status":         order.status,
        "tracking_number": order.tracking_number,
        "courier_name":   order.courier_name,
        "confirmed_at":   order.confirmed_at,
        "packed_at":      order.packed_at,
        "dispatched_at":  order.dispatched_at,
        "delivered_at":   order.delivered_at,
        "timeline":       timeline,
    }, message="Tracking info loaded")


@router.post("/{order_id}/return", summary="Request return for a delivered order")
def request_return(
    order_id: int,
    reason: str = Body(..., embed=True),
    db: Session = Depends(get_db),
    customer=Depends(get_current_customer),
):
    order = svc.request_return(db, customer, order_id, reason)
    return success_response(
        data={"status": order.status, "return_reason": order.return_reason},
        message="Return request submitted",
    )
