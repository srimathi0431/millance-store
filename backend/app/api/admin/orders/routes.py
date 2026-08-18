from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import Optional
from datetime import datetime

from db.database import get_db
from app.core.dependencies import require_permission
from app.core.exceptions import success_response
from app.schemas.order import (
    OrderOut,
    OrderListOut,
    OrderStatusHistoryOut,
    OrderStatusUpdate,
    OrderCancelRequest,
    OrderConfirmRequest,
    OrderPackRequest,
    OrderDispatchRequest,
    OrderDeliverRequest,
    OrderReturnApproveRequest,
    OrderReturnRejectRequest,
)
from app.schemas.common import paginate
from app.services import order as order_svc

router = APIRouter(prefix="/api/admin/orders", tags=["Admin Orders"])


# ─────────────────────────────────────────────────────────────────────────────
# List & Detail
# ─────────────────────────────────────────────────────────────────────────────

@router.get("", summary="List orders")
def list_orders(
    page:        int            = Query(1,  ge=1),
    page_size:   int            = Query(20, ge=1, le=100),
    search:      Optional[str]  = Query(None, description="Search by order #, tracking #, or customer name"),
    customer_id: Optional[int]  = Query(None),
    status:      Optional[str]  = Query(None),
    date_from:   Optional[datetime] = Query(None),
    date_to:     Optional[datetime] = Query(None),
    sort_by:     str            = Query("created_at"),
    sort_order:  str            = Query("desc", enum=["asc", "desc"]),
    db:    Session = Depends(get_db),
    admin = Depends(require_permission("orders.view")),
):
    items, total = order_svc.list_orders(
        db, page, page_size,
        search=search, customer_id=customer_id, status=status,
        date_from=date_from, date_to=date_to,
        sort_by=sort_by, sort_order=sort_order,
    )
    out = []
    for o in items:
        row = OrderListOut.model_validate(o)
        # Enrich with customer name/phone from joined relationship
        if o.customer:
            row.customer_name  = o.customer.name
            row.customer_phone = o.customer.phone
        out.append(row)
    return success_response(
        data=paginate(out, total, page, page_size),
        message="Orders loaded",
    )


@router.get("/{order_id}", summary="Get order detail with timeline")
def get_order(
    order_id: int,
    db:    Session = Depends(get_db),
    admin = Depends(require_permission("orders.view")),
):
    order = order_svc.get_order(db, order_id)
    out   = OrderOut.model_validate(order)
    if order.customer:
        out.customer_name  = order.customer.name
        out.customer_phone = order.customer.phone
    return success_response(data=out, message="Order loaded")


# ─────────────────────────────────────────────────────────────────────────────
# Timeline
# ─────────────────────────────────────────────────────────────────────────────

@router.get("/{order_id}/timeline", summary="Full status history for an order")
def get_timeline(
    order_id: int,
    db:    Session = Depends(get_db),
    admin = Depends(require_permission("orders.view")),
):
    timeline = order_svc.get_timeline(db, order_id)
    return success_response(
        data=[OrderStatusHistoryOut.model_validate(h) for h in timeline],
        message="Timeline loaded",
    )


# ─────────────────────────────────────────────────────────────────────────────
# Generic transition  (kept for backward compat — your separate app can use it)
# ─────────────────────────────────────────────────────────────────────────────

@router.patch("/{order_id}/status", summary="Generic status update")
def update_status(
    order_id: int,
    payload:  OrderStatusUpdate,
    db:    Session = Depends(get_db),
    admin = Depends(require_permission("orders.update")),
):
    order = order_svc.update_status(db, order_id, payload, admin)
    out   = OrderOut.model_validate(order)
    if order.customer:
        out.customer_name  = order.customer.name
        out.customer_phone = order.customer.phone
    return success_response(data=out, message="Order status updated")


# ─────────────────────────────────────────────────────────────────────────────
# Stage-specific endpoints
# Pipeline: PENDING → CONFIRMED → PROCESSING → PACKED → SHIPPED
#           → OUT_FOR_DELIVERY → DELIVERED
#           ↳ RETURN_REQUESTED → RETURNED | DELIVERED (reject)
#           Any cancellable stage → CANCELLED
# ─────────────────────────────────────────────────────────────────────────────

@router.post("/{order_id}/confirm", summary="PENDING → CONFIRMED")
def confirm_order(
    order_id: int,
    payload:  OrderConfirmRequest = OrderConfirmRequest(),
    db:    Session = Depends(get_db),
    admin = Depends(require_permission("orders.update")),
):
    """Confirm a pending order. Notifies the warehouse to begin processing."""
    order = order_svc.confirm_order(db, order_id, payload, admin)
    out   = OrderOut.model_validate(order)
    if order.customer:
        out.customer_name  = order.customer.name
        out.customer_phone = order.customer.phone
    return success_response(data=out, message="Order confirmed")


@router.post("/{order_id}/pack", summary="CONFIRMED/PROCESSING → PACKED")
def pack_order(
    order_id: int,
    payload:  OrderPackRequest = OrderPackRequest(),
    db:    Session = Depends(get_db),
    admin = Depends(require_permission("orders.update")),
):
    """
    Mark order as packed and ready for dispatch.
    If the order is still CONFIRMED it is auto-advanced through PROCESSING first.
    """
    order = order_svc.pack_order(db, order_id, payload, admin)
    out   = OrderOut.model_validate(order)
    if order.customer:
        out.customer_name  = order.customer.name
        out.customer_phone = order.customer.phone
    return success_response(data=out, message="Order packed")


@router.post("/{order_id}/dispatch", summary="PACKED → SHIPPED  (requires tracking number)")
def dispatch_order(
    order_id: int,
    payload:  OrderDispatchRequest,
    db:    Session = Depends(get_db),
    admin = Depends(require_permission("orders.update")),
):
    """
    Hand the order to a courier.
    tracking_number and (optionally) courier_name are saved on the order
    and returned in every subsequent order response — the customer app can
    display these directly.
    """
    order = order_svc.dispatch_order(db, order_id, payload, admin)
    out   = OrderOut.model_validate(order)
    if order.customer:
        out.customer_name  = order.customer.name
        out.customer_phone = order.customer.phone
    return success_response(data=out, message=f"Order dispatched — tracking: {payload.tracking_number}")


@router.post("/{order_id}/out-for-delivery", summary="SHIPPED → OUT_FOR_DELIVERY")
def out_for_delivery(
    order_id: int,
    db:    Session = Depends(get_db),
    admin = Depends(require_permission("orders.update")),
):
    """Mark the order as out for delivery (last-mile)."""
    order = order_svc.mark_out_for_delivery(db, order_id, admin)
    out   = OrderOut.model_validate(order)
    if order.customer:
        out.customer_name  = order.customer.name
        out.customer_phone = order.customer.phone
    return success_response(data=out, message="Order is out for delivery")


@router.post("/{order_id}/deliver", summary="OUT_FOR_DELIVERY → DELIVERED")
def deliver_order(
    order_id: int,
    payload:  OrderDeliverRequest = OrderDeliverRequest(),
    db:    Session = Depends(get_db),
    admin = Depends(require_permission("orders.update")),
):
    """Confirm delivery to customer."""
    order = order_svc.deliver_order(db, order_id, payload, admin)
    out   = OrderOut.model_validate(order)
    if order.customer:
        out.customer_name  = order.customer.name
        out.customer_phone = order.customer.phone
    return success_response(data=out, message="Order marked as delivered")


@router.post("/{order_id}/approve-return", summary="RETURN_REQUESTED → RETURNED")
def approve_return(
    order_id: int,
    payload:  OrderReturnApproveRequest = OrderReturnApproveRequest(),
    db:    Session = Depends(get_db),
    admin = Depends(require_permission("orders.update")),
):
    """Approve a customer return request."""
    order = order_svc.approve_return(db, order_id, payload, admin)
    out   = OrderOut.model_validate(order)
    if order.customer:
        out.customer_name  = order.customer.name
        out.customer_phone = order.customer.phone
    return success_response(data=out, message="Return approved")


@router.post("/{order_id}/reject-return", summary="RETURN_REQUESTED → DELIVERED (reject)")
def reject_return(
    order_id: int,
    payload:  OrderReturnRejectRequest = OrderReturnRejectRequest(),
    db:    Session = Depends(get_db),
    admin = Depends(require_permission("orders.update")),
):
    """Reject a return request — order goes back to DELIVERED."""
    order = order_svc.reject_return(db, order_id, payload, admin)
    out   = OrderOut.model_validate(order)
    if order.customer:
        out.customer_name  = order.customer.name
        out.customer_phone = order.customer.phone
    return success_response(data=out, message="Return rejected — order remains delivered")


@router.post("/{order_id}/cancel", summary="Cancel order (PENDING/CONFIRMED/PROCESSING only)")
def cancel_order(
    order_id: int,
    payload:  OrderCancelRequest = OrderCancelRequest(),
    db:    Session = Depends(get_db),
    admin = Depends(require_permission("orders.update")),
):
    """
    Cancel an order and automatically restore inventory.
    Only PENDING, CONFIRMED, or PROCESSING orders can be cancelled.
    """
    order = order_svc.cancel_order(db, order_id, payload, admin)
    out   = OrderOut.model_validate(order)
    if order.customer:
        out.customer_name  = order.customer.name
        out.customer_phone = order.customer.phone
    return success_response(data=out, message="Order cancelled and inventory restored")
