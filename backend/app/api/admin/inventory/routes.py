from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from db.database import get_db
from app.core.dependencies import require_permission
from app.core.exceptions import success_response
from app.schemas.inventory import InventoryOut, InventoryUpdate, InventoryThresholdUpdate, InventoryTransactionOut
from app.schemas.common import paginate
from app.services import inventory as inv_svc
from app.repositories.inventory import enrich_inventory

router = APIRouter(prefix="/api/admin/inventory", tags=["Admin Inventory"])


def _out(inv, db) -> dict:
    """Return enriched inventory dict (with product name/SKU)."""
    return enrich_inventory(db, inv)


@router.get("", summary="List all inventory with product name/SKU")
def list_inventory(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
    admin=Depends(require_permission("inventory.view")),
):
    items, total = inv_svc.list_inventory(db, page, page_size)
    return success_response(
        data=paginate([_out(i, db) for i in items], total, page, page_size),
        message="Inventory loaded"
    )


@router.get("/low-stock", summary="Low stock products")
def low_stock(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
    admin=Depends(require_permission("inventory.view")),
):
    items, total = inv_svc.list_inventory(db, page, page_size, low_stock_only=True)
    return success_response(
        data=paginate([_out(i, db) for i in items], total, page, page_size),
        message="Low stock items loaded"
    )


@router.get("/out-of-stock", summary="Out-of-stock products")
def out_of_stock(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
    admin=Depends(require_permission("inventory.view")),
):
    items, total = inv_svc.list_inventory(db, page, page_size, out_of_stock_only=True)
    return success_response(
        data=paginate([_out(i, db) for i in items], total, page, page_size),
        message="Out of stock loaded"
    )


@router.get("/{product_id}", summary="Get product inventory")
def get_inventory(
    product_id: int,
    db: Session = Depends(get_db),
    admin=Depends(require_permission("inventory.view")),
):
    inv = inv_svc.get_inventory(db, product_id)
    return success_response(data=_out(inv, db), message="Inventory loaded")


@router.patch("/{product_id}", summary="Adjust stock (STOCK_IN/OUT/ADJUSTMENT/RESERVED/RELEASED)")
def adjust_stock(
    product_id: int,
    payload: InventoryUpdate,
    db: Session = Depends(get_db),
    admin=Depends(require_permission("inventory.update")),
):
    txn = inv_svc.adjust_stock(db, product_id, payload, admin)
    return success_response(
        data=InventoryTransactionOut.model_validate(txn),
        message="Stock adjusted"
    )


@router.patch("/{product_id}/threshold", summary="Update low-stock threshold")
def update_threshold(
    product_id: int,
    payload: InventoryThresholdUpdate,
    db: Session = Depends(get_db),
    admin=Depends(require_permission("inventory.update")),
):
    inv = inv_svc.update_threshold(db, product_id, payload, admin)
    return success_response(data=_out(inv, db), message="Threshold updated")


@router.get("/{product_id}/history", summary="Inventory transaction history")
def history(
    product_id: int,
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
    admin=Depends(require_permission("inventory.view")),
):
    items, total = inv_svc.get_history(db, product_id, page, page_size)
    return success_response(
        data=paginate([InventoryTransactionOut.model_validate(t) for t in items], total, page, page_size),
        message="History loaded"
    )
