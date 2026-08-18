from sqlalchemy.orm import Session
from app.repositories import dashboard as dash_repo


def get_dashboard(db: Session) -> dict:
    return {
        "revenue": dash_repo.get_revenue_stats(db),
        "orders": dash_repo.get_order_stats(db),
        "products": dash_repo.get_product_stats(db),
        "customers": dash_repo.get_customer_stats(db),
        "recent_orders": dash_repo.get_recent_orders(db),
        "top_products": dash_repo.get_top_products(db),
    }


def get_sales(db: Session, period: str = "daily", days: int = 30) -> list:
    allowed_periods = ("daily", "weekly", "monthly", "yearly")
    if period not in allowed_periods:
        period = "daily"
    return dash_repo.get_sales_chart(db, period, days)


def get_top_products(db: Session, limit: int = 10) -> list:
    limit = min(limit, 50)
    return dash_repo.get_top_products(db, limit)


def get_order_stats(db: Session) -> dict:
    return dash_repo.get_order_stats(db)
