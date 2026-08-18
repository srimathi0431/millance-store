from sqlalchemy.orm import Session

from app.repositories import coupon as coupon_repo
from app.repositories import audit as audit_repo
from app.core.exceptions import NotFoundError, ConflictError
from app.schemas.coupon import CouponCreate, CouponUpdate
from app.models.admin import Admin


def list_coupons(db, page, page_size, is_active=None, search=None):
    page_size = min(page_size, 100)
    return coupon_repo.list_coupons(db, page, page_size, is_active, search)


def get_coupon(db: Session, coupon_id: int):
    c = coupon_repo.get_coupon_by_id(db, coupon_id)
    if not c:
        raise NotFoundError(f"Coupon {coupon_id} not found")
    return c


def create_coupon(db: Session, data: CouponCreate, admin: Admin):
    if coupon_repo.get_coupon_by_code(db, data.code):
        raise ConflictError(f"Coupon code '{data.code}' already exists")
    coupon = coupon_repo.create_coupon(db, data.model_dump())
    audit_repo.log_action(db, "COUPON_CREATED", admin_id=admin.id,
                          entity_type="coupon", entity_id=coupon.id,
                          new_value={"code": coupon.code})
    return coupon


def update_coupon(db: Session, coupon_id: int, data: CouponUpdate, admin: Admin):
    coupon = get_coupon(db, coupon_id)
    update_data = {k: v for k, v in data.model_dump().items() if v is not None}
    updated = coupon_repo.update_coupon(db, coupon, update_data)
    audit_repo.log_action(db, "COUPON_UPDATED", admin_id=admin.id,
                          entity_type="coupon", entity_id=coupon_id,
                          new_value=update_data)
    return updated


def update_status(db: Session, coupon_id: int, is_active: bool, admin: Admin):
    coupon = get_coupon(db, coupon_id)
    coupon_repo.update_coupon(db, coupon, {"is_active": is_active})
    return coupon


def delete_coupon(db: Session, coupon_id: int, admin: Admin):
    coupon = get_coupon(db, coupon_id)
    audit_repo.log_action(db, "COUPON_DELETED", admin_id=admin.id,
                          entity_type="coupon", entity_id=coupon_id,
                          old_value={"code": coupon.code})
    coupon_repo.delete_coupon(db, coupon)
