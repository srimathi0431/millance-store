from sqlalchemy.orm import Session

from app.repositories import order as order_repo
from app.repositories import inventory as inv_repo
from app.repositories import audit as audit_repo
from app.core.exceptions import NotFoundError
from app.schemas.order import (
    OrderStatusUpdate,
    OrderCancelRequest,
    OrderConfirmRequest,
    OrderPackRequest,
    OrderDispatchRequest,
    OrderDeliverRequest,
    OrderReturnApproveRequest,
    OrderReturnRejectRequest,
)
from app.models.admin import Admin
from app.models.order import OrderStatus, OrderItem
from app.models.inventory import TransactionType


# ─────────────────────────────────────────────────────────────────────────────
# Helpers
# ─────────────────────────────────────────────────────────────────────────────

def _get_or_404(db: Session, order_id: int):
    order = order_repo.get_order_by_id(db, order_id)
    if not order:
        raise NotFoundError(f"Order {order_id} not found")
    return order


def _restore_inventory(db: Session, order_id: int, order_number: str, admin_id: int):
    """Restore stock for every item in an order (used on cancel)."""
    items = db.query(OrderItem).filter(OrderItem.order_id == order_id).all()
    for item in items:
        if item.product_id:
            inv = inv_repo.get_inventory_by_product(db, item.product_id)
            if inv:
                try:
                    inv_repo.adjust_stock(
                        db, inv,
                        TransactionType.ORDER_RESTORED,
                        item.quantity,
                        f"Restored from cancelled order #{order_number}",
                        admin_id,
                        reference_id=str(order_id),
                    )
                except Exception:
                    pass  # never fail a cancellation because of inventory


# ─────────────────────────────────────────────────────────────────────────────
# Read
# ─────────────────────────────────────────────────────────────────────────────

def list_orders(db: Session, page: int, page_size: int, **filters):
    page_size = min(page_size, 100)
    return order_repo.list_orders(db, page, page_size, **filters)


def get_order(db: Session, order_id: int):
    return _get_or_404(db, order_id)


def get_timeline(db: Session, order_id: int):
    _get_or_404(db, order_id)   # 404 if not found
    return order_repo.get_order_timeline(db, order_id)


# ─────────────────────────────────────────────────────────────────────────────
# Generic transition (PATCH /status — kept for flexibility)
# ─────────────────────────────────────────────────────────────────────────────

def update_status(db: Session, order_id: int, data: OrderStatusUpdate, admin: Admin):
    order      = _get_or_404(db, order_id)
    old_status = order.status
    updated    = order_repo.update_order_status(db, order, data.status, data.notes, admin.id)
    audit_repo.log_action(
        db, "ORDER_STATUS_UPDATED", admin_id=admin.id,
        entity_type="order", entity_id=order_id,
        old_value={"status": old_status},
        new_value={"status": data.status.value},
    )
    return updated


# ─────────────────────────────────────────────────────────────────────────────
# Stage-specific actions
# ─────────────────────────────────────────────────────────────────────────────

def confirm_order(db: Session, order_id: int, data: OrderConfirmRequest, admin: Admin):
    order   = _get_or_404(db, order_id)
    updated = order_repo.confirm_order(db, order, data.notes, admin.id)
    audit_repo.log_action(
        db, "ORDER_CONFIRMED", admin_id=admin.id,
        entity_type="order", entity_id=order_id,
        old_value={"status": "PENDING"}, new_value={"status": "CONFIRMED"},
    )
    return updated


def pack_order(db: Session, order_id: int, data: OrderPackRequest, admin: Admin):
    order = _get_or_404(db, order_id)
    # Auto-advance CONFIRMED → PROCESSING → PACKED if still at CONFIRMED
    if order.status == OrderStatus.CONFIRMED:
        order = order_repo.start_processing(db, order, notes="Auto-advanced to PROCESSING", admin_id=admin.id)
    updated = order_repo.pack_order(db, order, data.notes, admin.id)
    audit_repo.log_action(
        db, "ORDER_PACKED", admin_id=admin.id,
        entity_type="order", entity_id=order_id,
        old_value={"status": "PROCESSING"}, new_value={"status": "PACKED"},
    )
    return updated


def dispatch_order(db: Session, order_id: int, data: OrderDispatchRequest, admin: Admin):
    order   = _get_or_404(db, order_id)
    updated = order_repo.dispatch_order(
        db, order,
        tracking_number=data.tracking_number,
        courier_name=data.courier_name,
        notes=data.notes,
        admin_id=admin.id,
    )
    audit_repo.log_action(
        db, "ORDER_DISPATCHED", admin_id=admin.id,
        entity_type="order", entity_id=order_id,
        old_value={"status": "PACKED"},
        new_value={"status": "SHIPPED", "tracking_number": data.tracking_number,
                   "courier_name": data.courier_name},
    )
    return updated


def mark_out_for_delivery(db: Session, order_id: int, admin: Admin):
    order   = _get_or_404(db, order_id)
    updated = order_repo.mark_out_for_delivery(db, order, admin_id=admin.id)
    audit_repo.log_action(
        db, "ORDER_OUT_FOR_DELIVERY", admin_id=admin.id,
        entity_type="order", entity_id=order_id,
        old_value={"status": "SHIPPED"}, new_value={"status": "OUT_FOR_DELIVERY"},
    )
    return updated


def deliver_order(db: Session, order_id: int, data: OrderDeliverRequest, admin: Admin):
    order   = _get_or_404(db, order_id)
    updated = order_repo.deliver_order(db, order, data.notes, admin.id)
    audit_repo.log_action(
        db, "ORDER_DELIVERED", admin_id=admin.id,
        entity_type="order", entity_id=order_id,
        old_value={"status": "OUT_FOR_DELIVERY"}, new_value={"status": "DELIVERED"},
    )
    return updated


def approve_return(db: Session, order_id: int, data: OrderReturnApproveRequest, admin: Admin):
    order   = _get_or_404(db, order_id)
    updated = order_repo.approve_return(db, order, data.notes, admin.id)
    audit_repo.log_action(
        db, "ORDER_RETURN_APPROVED", admin_id=admin.id,
        entity_type="order", entity_id=order_id,
        old_value={"status": "RETURN_REQUESTED"}, new_value={"status": "RETURNED"},
    )
    return updated


def reject_return(db: Session, order_id: int, data: OrderReturnRejectRequest, admin: Admin):
    order   = _get_or_404(db, order_id)
    updated = order_repo.reject_return(db, order, data.notes, admin.id)
    audit_repo.log_action(
        db, "ORDER_RETURN_REJECTED", admin_id=admin.id,
        entity_type="order", entity_id=order_id,
        old_value={"status": "RETURN_REQUESTED"}, new_value={"status": "DELIVERED"},
    )
    return updated


def cancel_order(db: Session, order_id: int, data: OrderCancelRequest, admin: Admin):
    order      = _get_or_404(db, order_id)
    old_status = order.status
    cancelled  = order_repo.cancel_order(db, order, data.reason, admin.id)

    _restore_inventory(db, order_id, order.order_number, admin.id)

    audit_repo.log_action(
        db, "ORDER_CANCELLED", admin_id=admin.id,
        entity_type="order", entity_id=order_id,
        old_value={"status": old_status},
        new_value={"status": OrderStatus.CANCELLED.value, "reason": data.reason},
    )
    return cancelled
