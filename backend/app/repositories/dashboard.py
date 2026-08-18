from sqlalchemy.orm import Session
from sqlalchemy import func, text
from datetime import datetime, timezone, timedelta
from decimal import Decimal
from typing import List

from app.models.order import Order, OrderStatus
from app.models.product import Product, ProductStatus
from app.models.user import Customer
from app.models.payment import Payment
from app.models.inventory import Inventory


def get_revenue_stats(db: Session) -> dict:
    now = datetime.now(timezone.utc)
    today_start = now.replace(hour=0, minute=0, second=0, microsecond=0)
    week_start = today_start - timedelta(days=7)
    month_start = today_start - timedelta(days=30)

    def rev(from_dt=None):
        q = db.query(func.coalesce(func.sum(Payment.amount), 0)).filter(
            Payment.status == "SUCCESS"
        )
        if from_dt:
            q = q.filter(Payment.paid_at >= from_dt)
        return q.scalar() or Decimal("0")

    return {
        "total_revenue": rev(),
        "today_revenue": rev(today_start),
        "weekly_revenue": rev(week_start),
        "monthly_revenue": rev(month_start),
    }


def get_order_stats(db: Session) -> dict:
    now = datetime.now(timezone.utc)
    today_start = now.replace(hour=0, minute=0, second=0, microsecond=0)

    def cnt(status=None, from_dt=None):
        q = db.query(func.count(Order.id))
        if status:
            q = q.filter(Order.status == status)
        if from_dt:
            q = q.filter(Order.created_at >= from_dt)
        return q.scalar() or 0

    return {
        "total_orders": cnt(),
        "today_orders": cnt(from_dt=today_start),
        "pending_orders": cnt(status=OrderStatus.PENDING.value),
        "confirmed_orders": cnt(status=OrderStatus.CONFIRMED.value),
        "processing_orders": cnt(status=OrderStatus.PROCESSING.value),
        "shipped_orders": cnt(status=OrderStatus.SHIPPED.value),
        "delivered_orders": cnt(status=OrderStatus.DELIVERED.value),
        "cancelled_orders": cnt(status=OrderStatus.CANCELLED.value),
    }


def get_product_stats(db: Session) -> dict:
    total = db.query(func.count(Product.id)).scalar() or 0
    active = db.query(func.count(Product.id)).filter(Product.status == ProductStatus.ACTIVE.value).scalar() or 0
    low_stock = db.query(func.count(Inventory.id)).filter(
        Inventory.total_stock - Inventory.reserved_stock > 0,
        Inventory.total_stock - Inventory.reserved_stock <= Inventory.low_stock_threshold,
    ).scalar() or 0
    out_of_stock = db.query(func.count(Inventory.id)).filter(
        Inventory.total_stock - Inventory.reserved_stock <= 0
    ).scalar() or 0
    return {
        "total_products": total,
        "active_products": active,
        "low_stock_products": low_stock,
        "out_of_stock_products": out_of_stock,
    }


def get_customer_stats(db: Session) -> dict:
    now = datetime.now(timezone.utc)
    today_start = now.replace(hour=0, minute=0, second=0, microsecond=0)
    total = db.query(func.count(Customer.id)).scalar() or 0
    active = db.query(func.count(Customer.id)).filter(Customer.is_active == True).scalar() or 0
    new_today = db.query(func.count(Customer.id)).filter(Customer.created_at >= today_start).scalar() or 0
    return {"total_customers": total, "active_customers": active, "new_today": new_today}


def get_recent_orders(db: Session, limit: int = 10) -> list:
    orders = db.query(Order).order_by(Order.created_at.desc()).limit(limit).all()
    return [
        {
            "id": o.id,
            "order_number": o.order_number,
            "customer_id": o.customer_id,
            "status": o.status,
            "total_amount": float(o.total_amount),
            "created_at": o.created_at.isoformat(),
        }
        for o in orders
    ]


def get_top_products(db: Session, limit: int = 10) -> list:
    from app.models.order import OrderItem
    from sqlalchemy import desc
    results = db.query(
        OrderItem.product_id,
        OrderItem.product_name,
        func.sum(OrderItem.quantity).label("total_sold"),
        func.sum(OrderItem.total_price).label("total_revenue"),
    ).group_by(OrderItem.product_id, OrderItem.product_name) \
     .order_by(desc("total_sold")).limit(limit).all()
    return [
        {
            "product_id": r.product_id,
            "product_name": r.product_name,
            "total_sold": r.total_sold or 0,
            "total_revenue": float(r.total_revenue or 0),
        }
        for r in results
    ]


def get_sales_chart(db: Session, period: str = "daily", days: int = 30) -> list:
    now = datetime.now(timezone.utc)
    from_dt = now - timedelta(days=days)

    if period == "daily":
        trunc = func.date_trunc("day", Payment.paid_at)
    elif period == "weekly":
        trunc = func.date_trunc("week", Payment.paid_at)
    elif period == "monthly":
        trunc = func.date_trunc("month", Payment.paid_at)
    else:
        trunc = func.date_trunc("year", Payment.paid_at)

    results = db.query(
        trunc.label("label"),
        func.coalesce(func.sum(Payment.amount), 0).label("revenue"),
        func.count(Payment.id).label("orders"),
    ).filter(
        Payment.status == "SUCCESS",
        Payment.paid_at >= from_dt,
    ).group_by("label").order_by("label").all()

    return [
        {"label": str(r.label), "revenue": float(r.revenue), "orders": r.orders}
        for r in results
    ]
