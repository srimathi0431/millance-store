from sqlalchemy.orm import Session

from app.repositories import inventory as inv_repo
from app.repositories import audit as audit_repo
from app.core.exceptions import NotFoundError
from app.schemas.inventory import InventoryUpdate, InventoryThresholdUpdate
from app.models.admin import Admin


def get_inventory(db: Session, product_id: int):
    inv = inv_repo.get_inventory_by_product(db, product_id)
    if not inv:
        raise NotFoundError(f"Inventory for product {product_id} not found")
    return inv


def list_inventory(db, page, page_size, low_stock_only=False, out_of_stock_only=False):
    return inv_repo.list_inventory(db, page, page_size, low_stock_only, out_of_stock_only)


def adjust_stock(db: Session, product_id: int, data: InventoryUpdate, admin: Admin):
    inv = get_inventory(db, product_id)
    txn = inv_repo.adjust_stock(
        db, inv, data.transaction_type, data.quantity, data.notes, admin.id
    )
    audit_repo.log_action(db, "INVENTORY_UPDATED", admin_id=admin.id,
                          entity_type="inventory", entity_id=product_id,
                          new_value={"type": data.transaction_type.value, "qty": data.quantity})
    return txn


def update_threshold(db: Session, product_id: int, data: InventoryThresholdUpdate, admin: Admin):
    inv = get_inventory(db, product_id)
    from app.repositories.inventory import update_threshold as repo_update_threshold
    return repo_update_threshold(db, inv, data.low_stock_threshold)


def get_history(db: Session, product_id: int, page: int, page_size: int):
    inv = get_inventory(db, product_id)
    return inv_repo.get_inventory_history(db, inv.id, page, page_size)
