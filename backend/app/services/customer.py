from sqlalchemy.orm import Session

from app.repositories import customer as cust_repo
from app.repositories import order as order_repo
from app.core.exceptions import NotFoundError
from app.schemas.customer import CustomerStatusUpdate
from app.models.admin import Admin


def list_customers(db, page, page_size, **filters):
    page_size = min(page_size, 100)
    return cust_repo.list_customers(db, page, page_size, **filters)


def get_customer(db: Session, customer_id: int):
    c = cust_repo.get_customer_by_id(db, customer_id)
    if not c:
        raise NotFoundError(f"Customer {customer_id} not found")
    return c


def update_status(db: Session, customer_id: int, data: CustomerStatusUpdate, admin: Admin):
    c = get_customer(db, customer_id)
    return cust_repo.update_customer_status(db, c, data.is_active, data.is_blocked)


def get_customer_orders(db: Session, customer_id: int, page: int, page_size: int):
    get_customer(db, customer_id)
    page_size = min(page_size, 100)
    return order_repo.list_orders(db, page, page_size, customer_id=customer_id)


def get_customer_stats(db: Session, customer_id: int):
    get_customer(db, customer_id)
    return cust_repo.get_customer_order_stats(db, customer_id)
