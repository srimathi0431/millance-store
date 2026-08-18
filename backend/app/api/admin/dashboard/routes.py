from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from db.database import get_db
from app.core.dependencies import get_current_admin, require_permission
from app.core.exceptions import success_response
from app.services import dashboard as dash_svc

router = APIRouter(prefix="/api/admin/dashboard", tags=["Admin Dashboard"])


@router.get("", summary="Full dashboard stats")
def dashboard(
    db: Session = Depends(get_db),
    admin=Depends(require_permission("dashboard.view")),
):
    data = dash_svc.get_dashboard(db)
    return success_response(data=data, message="Dashboard loaded")


@router.get("/sales", summary="Sales chart data")
def sales(
    period: str = Query("daily", enum=["daily", "weekly", "monthly", "yearly"]),
    days: int = Query(30, ge=1, le=365),
    db: Session = Depends(get_db),
    admin=Depends(require_permission("dashboard.view")),
):
    data = dash_svc.get_sales(db, period, days)
    return success_response(data=data, message="Sales data loaded")


@router.get("/orders", summary="Order statistics")
def order_stats(
    db: Session = Depends(get_db),
    admin=Depends(require_permission("dashboard.view")),
):
    data = dash_svc.get_order_stats(db)
    return success_response(data=data, message="Order stats loaded")


@router.get("/top-products", summary="Top selling products")
def top_products(
    limit: int = Query(10, ge=1, le=50),
    db: Session = Depends(get_db),
    admin=Depends(require_permission("dashboard.view")),
):
    data = dash_svc.get_top_products(db, limit)
    return success_response(data=data, message="Top products loaded")
