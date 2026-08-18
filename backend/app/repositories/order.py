from sqlalchemy.orm import Session, joinedload
from sqlalchemy import or_
from typing import Optional, Tuple, List
from datetime import datetime, timezone

from app.models.order import Order, OrderItem, OrderStatus, OrderStatusHistory, ORDER_TRANSITIONS
from app.models.user import Customer
from app.core.exceptions import BadRequestError


# ─────────────────────────────────────────────────────────────────────────────
# Helpers
# ─────────────────────────────────────────────────────────────────────────────

def _now() -> datetime:
    return datetime.now(timezone.utc)


def _write_history(
    db: Session,
    order: Order,
    from_status: Optional[str],
    to_status: str,
    notes: Optional[str] = None,
    admin_id: Optional[int] = None,
) -> None:
    """Append one immutable row to order_status_history."""
    entry = OrderStatusHistory(
        order_id=order.id,
        from_status=from_status,
        to_status=to_status,
        notes=notes,
        changed_by=admin_id,
    )
    db.add(entry)


# ─────────────────────────────────────────────────────────────────────────────
# Read
# ─────────────────────────────────────────────────────────────────────────────

def get_order_by_id(db: Session, order_id: int) -> Optional[Order]:
    return (
        db.query(Order)
        .options(
            joinedload(Order.items),
            joinedload(Order.history),
            joinedload(Order.customer),
        )
        .filter(Order.id == order_id)
        .first()
    )


def get_order_by_number(db: Session, order_number: str) -> Optional[Order]:
    return db.query(Order).filter(Order.order_number == order_number).first()


def get_order_by_tracking(db: Session, tracking_number: str) -> Optional[Order]:
    return db.query(Order).filter(Order.tracking_number == tracking_number).first()


def list_orders(
    db: Session,
    page: int,
    page_size: int,
    search:          Optional[str]      = None,
    customer_id:     Optional[int]      = None,
    status:          Optional[str]      = None,
    date_from:       Optional[datetime] = None,
    date_to:         Optional[datetime] = None,
    sort_by:         str                = "created_at",
    sort_order:      str                = "desc",
) -> Tuple[List[Order], int]:
    q = (
        db.query(Order)
        .options(joinedload(Order.customer))
    )

    if search:
        q = q.filter(
            or_(
                Order.order_number.ilike(f"%{search}%"),
                Order.tracking_number.ilike(f"%{search}%"),
                Order.shipping_name.ilike(f"%{search}%"),
            )
        )
    if customer_id:
        q = q.filter(Order.customer_id == customer_id)
    if status:
        q = q.filter(Order.status == status)
    if date_from:
        q = q.filter(Order.created_at >= date_from)
    if date_to:
        q = q.filter(Order.created_at <= date_to)

    total = q.count()

    col = getattr(Order, sort_by, Order.created_at)
    q = q.order_by(col.desc() if sort_order == "desc" else col.asc())
    items = q.offset((page - 1) * page_size).limit(page_size).all()
    return items, total


# ─────────────────────────────────────────────────────────────────────────────
# Generic status transition (used by PATCH /status)
# ─────────────────────────────────────────────────────────────────────────────

def update_order_status(
    db: Session,
    order: Order,
    new_status: OrderStatus,
    notes: Optional[str] = None,
    admin_id: Optional[int] = None,
) -> Order:
    current = OrderStatus(order.status)
    allowed = ORDER_TRANSITIONS.get(current, [])
    if new_status not in allowed:
        raise BadRequestError(
            f"Invalid transition: {current.value} → {new_status.value}. "
            f"Allowed: {[s.value for s in allowed]}"
        )

    old_status = order.status
    order.status = new_status.value

    # Stamp lifecycle timestamps automatically
    now = _now()
    if new_status == OrderStatus.CONFIRMED:
        order.confirmed_at = now
    elif new_status == OrderStatus.PACKED:
        order.packed_at = now
    elif new_status == OrderStatus.SHIPPED:
        order.dispatched_at = now
    elif new_status == OrderStatus.DELIVERED:
        order.delivered_at = now

    if notes:
        order.notes = notes

    _write_history(db, order, old_status, new_status.value, notes, admin_id)
    db.commit()
    db.refresh(order)
    return order


# ─────────────────────────────────────────────────────────────────────────────
# Stage-specific transitions
# ─────────────────────────────────────────────────────────────────────────────

def confirm_order(
    db: Session, order: Order, notes: Optional[str] = None, admin_id: Optional[int] = None
) -> Order:
    return update_order_status(db, order, OrderStatus.CONFIRMED, notes, admin_id)


def start_processing(
    db: Session, order: Order, notes: Optional[str] = None, admin_id: Optional[int] = None
) -> Order:
    return update_order_status(db, order, OrderStatus.PROCESSING, notes, admin_id)


def pack_order(
    db: Session, order: Order, notes: Optional[str] = None, admin_id: Optional[int] = None
) -> Order:
    return update_order_status(db, order, OrderStatus.PACKED, notes, admin_id)


def dispatch_order(
    db: Session,
    order: Order,
    tracking_number: str,
    courier_name: Optional[str] = None,
    notes: Optional[str] = None,
    admin_id: Optional[int] = None,
) -> Order:
    current = OrderStatus(order.status)
    if current != OrderStatus.PACKED:
        raise BadRequestError(
            f"Order must be PACKED before dispatching. Current status: {current.value}"
        )

    old_status = order.status
    order.status         = OrderStatus.SHIPPED.value
    order.tracking_number = tracking_number.strip()
    order.courier_name   = courier_name.strip() if courier_name else None
    order.dispatched_at  = _now()
    if notes:
        order.notes = notes

    _write_history(db, order, old_status, OrderStatus.SHIPPED.value, notes, admin_id)
    db.commit()
    db.refresh(order)
    return order


def mark_out_for_delivery(
    db: Session, order: Order, notes: Optional[str] = None, admin_id: Optional[int] = None
) -> Order:
    return update_order_status(db, order, OrderStatus.OUT_FOR_DELIVERY, notes, admin_id)


def deliver_order(
    db: Session, order: Order, notes: Optional[str] = None, admin_id: Optional[int] = None
) -> Order:
    return update_order_status(db, order, OrderStatus.DELIVERED, notes, admin_id)


def approve_return(
    db: Session, order: Order, notes: Optional[str] = None, admin_id: Optional[int] = None
) -> Order:
    return update_order_status(db, order, OrderStatus.RETURNED, notes, admin_id)


def reject_return(
    db: Session, order: Order, notes: Optional[str] = None, admin_id: Optional[int] = None
) -> Order:
    """Reject return request → put order back to DELIVERED."""
    current = OrderStatus(order.status)
    if current != OrderStatus.RETURN_REQUESTED:
        raise BadRequestError(
            f"Order is not in RETURN_REQUESTED state. Current: {current.value}"
        )
    old_status = order.status
    order.status = OrderStatus.DELIVERED.value
    if notes:
        order.notes = notes

    _write_history(db, order, old_status, OrderStatus.DELIVERED.value, notes, admin_id)
    db.commit()
    db.refresh(order)
    return order


def cancel_order(
    db: Session, order: Order, reason: Optional[str] = None, admin_id: Optional[int] = None
) -> Order:
    current = OrderStatus(order.status)
    if OrderStatus.CANCELLED not in ORDER_TRANSITIONS.get(current, []):
        raise BadRequestError(
            f"Order in status '{current.value}' cannot be cancelled. "
            f"Only PENDING, CONFIRMED or PROCESSING orders can be cancelled."
        )
    old_status = order.status
    order.status           = OrderStatus.CANCELLED.value
    order.cancelled_reason = reason

    _write_history(db, order, old_status, OrderStatus.CANCELLED.value, reason, admin_id)
    db.commit()
    db.refresh(order)
    return order


def set_return_reason(
    db: Session, order: Order, reason: Optional[str]
) -> Order:
    order.return_reason = reason
    db.commit()
    db.refresh(order)
    return order


# ─────────────────────────────────────────────────────────────────────────────
# Timeline
# ─────────────────────────────────────────────────────────────────────────────

def get_order_timeline(db: Session, order_id: int) -> List[OrderStatusHistory]:
    return (
        db.query(OrderStatusHistory)
        .filter(OrderStatusHistory.order_id == order_id)
        .order_by(OrderStatusHistory.changed_at.asc())
        .all()
    )
