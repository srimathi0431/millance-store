from sqlalchemy.orm import Session

from app.repositories import payment as pay_repo
from app.repositories import audit as audit_repo
from app.core.exceptions import NotFoundError
from app.schemas.payment import RefundCreate
from app.models.admin import Admin


def list_payments(db, page, page_size, status=None):
    page_size = min(page_size, 100)
    return pay_repo.list_payments(db, page, page_size, status)


def get_payment(db: Session, payment_id: int):
    p = pay_repo.get_payment_by_id(db, payment_id)
    if not p:
        raise NotFoundError(f"Payment {payment_id} not found")
    return p


def get_payment_by_order(db: Session, order_id: int):
    p = pay_repo.get_payment_by_order(db, order_id)
    if not p:
        raise NotFoundError(f"No payment found for order {order_id}")
    return p


def create_refund(db: Session, order_id: int, data: RefundCreate, admin: Admin):
    payment = pay_repo.get_payment_by_order(db, order_id)
    if not payment:
        raise NotFoundError(f"No payment found for order {order_id}")
    refund = pay_repo.create_refund(db, order_id, payment.id, admin.id, data.amount, data.reason)
    audit_repo.log_action(db, "REFUND_CREATED", admin_id=admin.id,
                          entity_type="refund", entity_id=refund.id,
                          new_value={"order_id": order_id, "amount": str(data.amount)})
    return refund


def list_refunds(db, page, page_size):
    page_size = min(page_size, 100)
    return pay_repo.list_refunds(db, page, page_size)


def get_refund(db: Session, refund_id: int):
    r = pay_repo.get_refund_by_id(db, refund_id)
    if not r:
        raise NotFoundError(f"Refund {refund_id} not found")
    return r
