from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import Optional

from db.database import get_db
from app.core.dependencies import require_permission
from app.core.exceptions import success_response
from app.schemas.payment import PaymentOut, RefundCreate, RefundOut
from app.schemas.common import paginate
from app.services import payment as pay_svc

router = APIRouter(prefix="/api/admin", tags=["Admin Payments & Refunds"])


@router.get("/payments", summary="List payments")
def list_payments(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    status: Optional[str] = Query(None),
    db: Session = Depends(get_db),
    admin=Depends(require_permission("payments.view")),
):
    items, total = pay_svc.list_payments(db, page, page_size, status)
    return success_response(
        data=paginate([PaymentOut.model_validate(p) for p in items], total, page, page_size),
        message="Payments loaded"
    )


@router.get("/payments/{payment_id}", summary="Get payment detail")
def get_payment(
    payment_id: int,
    db: Session = Depends(get_db),
    admin=Depends(require_permission("payments.view")),
):
    p = pay_svc.get_payment(db, payment_id)
    return success_response(data=PaymentOut.model_validate(p), message="Payment loaded")


@router.get("/orders/{order_id}/payment", summary="Get payment for order")
def get_order_payment(
    order_id: int,
    db: Session = Depends(get_db),
    admin=Depends(require_permission("payments.view")),
):
    p = pay_svc.get_payment_by_order(db, order_id)
    return success_response(data=PaymentOut.model_validate(p), message="Payment loaded")


@router.post("/orders/{order_id}/refund", status_code=201, summary="Create refund for order")
def create_refund(
    order_id: int,
    payload: RefundCreate,
    db: Session = Depends(get_db),
    admin=Depends(require_permission("payments.view")),
):
    refund = pay_svc.create_refund(db, order_id, payload, admin)
    return success_response(data=RefundOut.model_validate(refund), message="Refund created")


@router.get("/refunds", summary="List all refunds")
def list_refunds(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
    admin=Depends(require_permission("payments.view")),
):
    items, total = pay_svc.list_refunds(db, page, page_size)
    return success_response(
        data=paginate([RefundOut.model_validate(r) for r in items], total, page, page_size),
        message="Refunds loaded"
    )


@router.get("/refunds/{refund_id}", summary="Get refund detail")
def get_refund(
    refund_id: int,
    db: Session = Depends(get_db),
    admin=Depends(require_permission("payments.view")),
):
    r = pay_svc.get_refund(db, refund_id)
    return success_response(data=RefundOut.model_validate(r), message="Refund loaded")
