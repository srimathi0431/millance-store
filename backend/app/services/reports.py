from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import datetime, timezone
from typing import Optional

from app.models.payment import Payment
from app.models.order import Order, OrderItem, OrderStatus
from app.models.product import Product
from app.models.user import Customer


def sales_report(db: Session, date_from: Optional[datetime], date_to: Optional[datetime],
                 period: str = "daily") -> list:
    if period == "daily":
        trunc = func.date_trunc("day", Payment.paid_at)
    elif period == "weekly":
        trunc = func.date_trunc("week", Payment.paid_at)
    elif period == "monthly":
        trunc = func.date_trunc("month", Payment.paid_at)
    else:
        trunc = func.date_trunc("year", Payment.paid_at)

    q = db.query(
        trunc.label("period"),
        func.count(Payment.id).label("transactions"),
        func.coalesce(func.sum(Payment.amount), 0).label("revenue"),
    ).filter(Payment.status == "SUCCESS")
    if date_from:
        q = q.filter(Payment.paid_at >= date_from)
    if date_to:
        q = q.filter(Payment.paid_at <= date_to)
    results = q.group_by("period").order_by("period").all()
    return [{"period": str(r.period), "transactions": r.transactions, "revenue": float(r.revenue)} for r in results]


def orders_report(db: Session, date_from: Optional[datetime], date_to: Optional[datetime]) -> dict:
    q = db.query(Order.status, func.count(Order.id).label("count"))
    if date_from:
        q = q.filter(Order.created_at >= date_from)
    if date_to:
        q = q.filter(Order.created_at <= date_to)
    results = q.group_by(Order.status).all()
    return {r.status: r.count for r in results}


def products_report(db: Session, date_from: Optional[datetime], date_to: Optional[datetime]) -> list:
    q = db.query(
        OrderItem.product_id,
        OrderItem.product_name,
        func.sum(OrderItem.quantity).label("total_sold"),
        func.sum(OrderItem.total_price).label("total_revenue"),
    )
    if date_from or date_to:
        q = q.join(Order, OrderItem.order_id == Order.id)
        if date_from:
            q = q.filter(Order.created_at >= date_from)
        if date_to:
            q = q.filter(Order.created_at <= date_to)
    results = q.group_by(OrderItem.product_id, OrderItem.product_name) \
               .order_by(func.sum(OrderItem.quantity).desc()).limit(50).all()
    return [
        {"product_id": r.product_id, "product_name": r.product_name,
         "total_sold": r.total_sold, "total_revenue": float(r.total_revenue or 0)}
        for r in results
    ]


def customers_report(db: Session, date_from: Optional[datetime], date_to: Optional[datetime]) -> dict:
    q = db.query(func.count(Customer.id))
    if date_from:
        q = q.filter(Customer.created_at >= date_from)
    if date_to:
        q = q.filter(Customer.created_at <= date_to)
    new_customers = q.scalar() or 0

    total = db.query(func.count(Customer.id)).scalar() or 0
    active = db.query(func.count(Customer.id)).filter(Customer.is_active == True).scalar() or 0
    blocked = db.query(func.count(Customer.id)).filter(Customer.is_blocked == True).scalar() or 0

    return {
        "total_customers": total,
        "active_customers": active,
        "blocked_customers": blocked,
        "new_in_range": new_customers,
    }
