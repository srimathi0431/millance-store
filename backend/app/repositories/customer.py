from sqlalchemy.orm import Session
from sqlalchemy import func, or_
from typing import Optional, Tuple, List

from app.models.user import Customer
from app.models.order import Order


def get_customer_by_id(db: Session, customer_id: int) -> Optional[Customer]:
    return db.query(Customer).filter(Customer.id == customer_id).first()


def list_customers(db: Session, page: int, page_size: int,
                   search: Optional[str] = None,
                   is_active: Optional[bool] = None,
                   is_blocked: Optional[bool] = None) -> Tuple[List[Customer], int]:
    q = db.query(Customer)
    if search:
        q = q.filter(or_(
            Customer.name.ilike(f"%{search}%"),
            Customer.email.ilike(f"%{search}%"),
            Customer.phone.ilike(f"%{search}%"),
        ))
    if is_active is not None:
        q = q.filter(Customer.is_active == is_active)
    if is_blocked is not None:
        q = q.filter(Customer.is_blocked == is_blocked)
    total = q.count()
    items = q.order_by(Customer.created_at.desc()).offset((page - 1) * page_size).limit(page_size).all()
    return items, total


def get_customer_order_stats(db: Session, customer_id: int) -> dict:
    from sqlalchemy import func
    from decimal import Decimal
    result = db.query(
        func.count(Order.id).label("order_count"),
        func.coalesce(func.sum(Order.total_amount), 0).label("total_spent"),
    ).filter(Order.customer_id == customer_id).first()
    return {
        "order_count": result.order_count or 0,
        "total_spent": result.total_spent or Decimal("0"),
    }


def update_customer_status(db: Session, customer: Customer,
                           is_active: Optional[bool], is_blocked: Optional[bool]) -> Customer:
    if is_active is not None:
        customer.is_active = is_active
    if is_blocked is not None:
        customer.is_blocked = is_blocked
    db.commit()
    db.refresh(customer)
    return customer
