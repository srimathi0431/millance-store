from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import Optional

from db.database import get_db
from app.core.dependencies import require_permission
from app.core.exceptions import success_response
from app.schemas.coupon import CouponCreate, CouponUpdate, CouponStatusUpdate, CouponOut
from app.schemas.common import paginate
from app.services import coupon as coupon_svc

router = APIRouter(prefix="/api/admin/coupons", tags=["Admin Coupons"])


@router.get("", summary="List coupons")
def list_coupons(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    is_active: Optional[bool] = Query(None),
    search: Optional[str] = Query(None),
    db: Session = Depends(get_db),
    admin=Depends(require_permission("coupons.view")),
):
    items, total = coupon_svc.list_coupons(db, page, page_size, is_active, search)
    return success_response(
        data=paginate([CouponOut.model_validate(c) for c in items], total, page, page_size),
        message="Coupons loaded"
    )


@router.post("", status_code=201, summary="Create coupon")
def create_coupon(
    payload: CouponCreate,
    db: Session = Depends(get_db),
    admin=Depends(require_permission("coupons.create")),
):
    coupon = coupon_svc.create_coupon(db, payload, admin)
    return success_response(data=CouponOut.model_validate(coupon), message="Coupon created")


@router.get("/{coupon_id}", summary="Get coupon detail")
def get_coupon(
    coupon_id: int,
    db: Session = Depends(get_db),
    admin=Depends(require_permission("coupons.view")),
):
    coupon = coupon_svc.get_coupon(db, coupon_id)
    return success_response(data=CouponOut.model_validate(coupon), message="Coupon loaded")


@router.put("/{coupon_id}", summary="Update coupon")
def update_coupon(
    coupon_id: int,
    payload: CouponUpdate,
    db: Session = Depends(get_db),
    admin=Depends(require_permission("coupons.update")),
):
    coupon = coupon_svc.update_coupon(db, coupon_id, payload, admin)
    return success_response(data=CouponOut.model_validate(coupon), message="Coupon updated")


@router.patch("/{coupon_id}/status", summary="Update coupon status")
def update_status(
    coupon_id: int,
    payload: CouponStatusUpdate,
    db: Session = Depends(get_db),
    admin=Depends(require_permission("coupons.update")),
):
    coupon = coupon_svc.update_status(db, coupon_id, payload.is_active, admin)
    return success_response(data=CouponOut.model_validate(coupon), message="Coupon status updated")


@router.delete("/{coupon_id}", status_code=204, summary="Delete coupon")
def delete_coupon(
    coupon_id: int,
    db: Session = Depends(get_db),
    admin=Depends(require_permission("coupons.delete")),
):
    coupon_svc.delete_coupon(db, coupon_id, admin)
