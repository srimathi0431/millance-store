from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import Optional
from datetime import datetime

from db.database import get_db
from app.core.dependencies import require_permission
from app.core.exceptions import success_response
from app.services import reports as report_svc

router = APIRouter(prefix="/api/admin/reports", tags=["Admin Reports"])


@router.get("/sales", summary="Sales report by period")
def sales_report(
    date_from: Optional[datetime] = Query(None),
    date_to: Optional[datetime] = Query(None),
    period: str = Query("daily", enum=["daily", "weekly", "monthly", "yearly"]),
    db: Session = Depends(get_db),
    admin=Depends(require_permission("reports.view")),
):
    data = report_svc.sales_report(db, date_from, date_to, period)
    return success_response(data=data, message="Sales report loaded")


@router.get("/orders", summary="Orders report by status")
def orders_report(
    date_from: Optional[datetime] = Query(None),
    date_to: Optional[datetime] = Query(None),
    db: Session = Depends(get_db),
    admin=Depends(require_permission("reports.view")),
):
    data = report_svc.orders_report(db, date_from, date_to)
    return success_response(data=data, message="Orders report loaded")


@router.get("/products", summary="Top products report")
def products_report(
    date_from: Optional[datetime] = Query(None),
    date_to: Optional[datetime] = Query(None),
    db: Session = Depends(get_db),
    admin=Depends(require_permission("reports.view")),
):
    data = report_svc.products_report(db, date_from, date_to)
    return success_response(data=data, message="Products report loaded")


@router.get("/customers", summary="Customers report")
def customers_report(
    date_from: Optional[datetime] = Query(None),
    date_to: Optional[datetime] = Query(None),
    db: Session = Depends(get_db),
    admin=Depends(require_permission("reports.view")),
):
    data = report_svc.customers_report(db, date_from, date_to)
    return success_response(data=data, message="Customers report loaded")
