from sqlalchemy.orm import Session
from typing import Optional, Tuple, List
from datetime import datetime, timezone
from decimal import Decimal

from app.models.payment import Payment, Refund, PaymentStatus, RefundStatus
from app.core.exceptions import BadRequestError


def get_payment_by_id(db: Session, payment_id: int) -> Optional[Payment]:
    return db.query(Payment).filter(Payment.id == payment_id).first()


def get_payment_by_order(db: Session, order_id: int) -> Optional[Payment]:
    return db.query(Payment).filter(Payment.order_id == order_id).first()


def list_payments(db: Session, page: int, page_size: int,
                  status: Optional[str] = None) -> Tuple[List[Payment], int]:
    q = db.query(Payment)
    if status:
        q = q.filter(Payment.status == status)
    total = q.count()
    items = q.order_by(Payment.created_at.desc()).offset((page - 1) * page_size).limit(page_size).all()
    return items, total


def create_refund(db: Session, order_id: int, payment_id: int,
                  admin_id: int, amount: Decimal, reason: Optional[str]) -> Refund:
    payment = get_payment_by_id(db, payment_id)
    if not payment:
        raise BadRequestError("Payment not found")
    if payment.status not in (PaymentStatus.SUCCESS.value, PaymentStatus.PARTIALLY_REFUNDED.value):
        raise BadRequestError("Payment is not in a refundable state")

    # Calculate already refunded
    already_refunded = db.query(
        __import__("sqlalchemy", fromlist=["func"]).func.coalesce(
            __import__("sqlalchemy", fromlist=["func"]).func.sum(Refund.amount), 0
        )
    ).filter(
        Refund.payment_id == payment_id,
        Refund.status.in_([RefundStatus.APPROVED.value, RefundStatus.COMPLETED.value])
    ).scalar() or Decimal("0")

    refundable = payment.amount - Decimal(str(already_refunded))
    if amount > refundable:
        raise BadRequestError(f"Refund amount {amount} exceeds refundable amount {refundable}")

    refund = Refund(
        order_id=order_id, payment_id=payment_id,
        admin_id=admin_id, amount=amount, reason=reason,
        status=RefundStatus.APPROVED.value,
        processed_at=datetime.now(timezone.utc),
    )
    db.add(refund)

    # Update payment status
    new_total_refunded = Decimal(str(already_refunded)) + amount
    if new_total_refunded >= payment.amount:
        payment.status = PaymentStatus.REFUNDED.value
    else:
        payment.status = PaymentStatus.PARTIALLY_REFUNDED.value

    db.commit()
    db.refresh(refund)
    return refund


def list_refunds(db: Session, page: int, page_size: int) -> Tuple[List[Refund], int]:
    q = db.query(Refund)
    total = q.count()
    items = q.order_by(Refund.created_at.desc()).offset((page - 1) * page_size).limit(page_size).all()
    return items, total


def get_refund_by_id(db: Session, refund_id: int) -> Optional[Refund]:
    return db.query(Refund).filter(Refund.id == refund_id).first()
