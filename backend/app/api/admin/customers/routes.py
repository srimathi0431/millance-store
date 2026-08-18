from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import Optional

from db.database import get_db
from app.core.dependencies import require_permission
from app.core.exceptions import success_response
from app.schemas.customer import CustomerOut, CustomerListOut, CustomerStatusUpdate
from app.schemas.order import OrderListOut
from app.schemas.common import paginate
from app.services import customer as cust_svc

router = APIRouter(prefix="/api/admin/customers", tags=["Admin Customers"])


@router.get("", summary="List customers")
def list_customers(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    search: Optional[str] = Query(None),
    is_active: Optional[bool] = Query(None),
    is_blocked: Optional[bool] = Query(None),
    db: Session = Depends(get_db),
    admin=Depends(require_permission("users.view")),
):
    items, total = cust_svc.list_customers(
        db, page, page_size, search=search, is_active=is_active, is_blocked=is_blocked
    )
    return success_response(
        data=paginate([CustomerListOut.model_validate(c) for c in items], total, page, page_size),
        message="Customers loaded"
    )


@router.get("/{customer_id}", summary="Get customer detail")
def get_customer(
    customer_id: int,
    db: Session = Depends(get_db),
    admin=Depends(require_permission("users.view")),
):
    c = cust_svc.get_customer(db, customer_id)
    stats = cust_svc.get_customer_stats(db, customer_id)
    data = CustomerOut.model_validate(c).model_dump()
    data.update(stats)
    return success_response(data=data, message="Customer loaded")


@router.patch("/{customer_id}/status", summary="Block/unblock or activate/deactivate customer")
def update_status(
    customer_id: int,
    payload: CustomerStatusUpdate,
    db: Session = Depends(get_db),
    admin=Depends(require_permission("users.update")),
):
    c = cust_svc.update_status(db, customer_id, payload, admin)
    return success_response(data=CustomerOut.model_validate(c), message="Customer status updated")


@router.get("/{customer_id}/orders", summary="Get customer orders")
def customer_orders(
    customer_id: int,
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
    admin=Depends(require_permission("users.view")),
):
    items, total = cust_svc.get_customer_orders(db, customer_id, page, page_size)
    return success_response(
        data=paginate([OrderListOut.model_validate(o) for o in items], total, page, page_size),
        message="Customer orders loaded"
    )
