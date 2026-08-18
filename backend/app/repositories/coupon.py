from sqlalchemy.orm import Session
from typing import Optional, Tuple, List

from app.models.coupon import Coupon


def get_coupon_by_id(db: Session, coupon_id: int) -> Optional[Coupon]:
    return db.query(Coupon).filter(Coupon.id == coupon_id).first()


def get_coupon_by_code(db: Session, code: str) -> Optional[Coupon]:
    return db.query(Coupon).filter(Coupon.code == code).first()


def list_coupons(db: Session, page: int, page_size: int,
                 is_active: Optional[bool] = None,
                 search: Optional[str] = None) -> Tuple[List[Coupon], int]:
    q = db.query(Coupon)
    if is_active is not None:
        q = q.filter(Coupon.is_active == is_active)
    if search:
        q = q.filter(Coupon.code.ilike(f"%{search}%"))
    total = q.count()
    items = q.order_by(Coupon.created_at.desc()).offset((page - 1) * page_size).limit(page_size).all()
    return items, total


def create_coupon(db: Session, data: dict) -> Coupon:
    coupon = Coupon(**data)
    db.add(coupon)
    db.commit()
    db.refresh(coupon)
    return coupon


def update_coupon(db: Session, coupon: Coupon, data: dict) -> Coupon:
    for k, v in data.items():
        if v is not None:
            setattr(coupon, k, v)
    db.commit()
    db.refresh(coupon)
    return coupon


def delete_coupon(db: Session, coupon: Coupon) -> None:
    db.delete(coupon)
    db.commit()
