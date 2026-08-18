from sqlalchemy.orm import Session, joinedload
from sqlalchemy import func
from typing import Optional, Tuple, List

from app.models.inventory import Inventory, InventoryTransaction, TransactionType
from app.models.product import Product
from app.core.exceptions import BadRequestError


def get_inventory_by_product(db: Session, product_id: int) -> Optional[Inventory]:
    return db.query(Inventory).filter(Inventory.product_id == product_id).first()


def list_inventory(db: Session, page: int, page_size: int,
                   low_stock_only: bool = False,
                   out_of_stock_only: bool = False) -> Tuple[List[Inventory], int]:
    q = db.query(Inventory)
    if out_of_stock_only:
        q = q.filter(Inventory.total_stock - Inventory.reserved_stock <= 0)
    elif low_stock_only:
        q = q.filter(
            Inventory.total_stock - Inventory.reserved_stock > 0,
            Inventory.total_stock - Inventory.reserved_stock <= Inventory.low_stock_threshold
        )
    total = q.count()
    items = q.offset((page - 1) * page_size).limit(page_size).all()
    return items, total


def enrich_inventory(db: Session, inventory: Inventory) -> dict:
    """Return inventory data enriched with product name and SKU."""
    product = db.query(Product).filter(Product.id == inventory.product_id).first()
    return {
        "id": inventory.id,
        "product_id": inventory.product_id,
        "product_name": product.name if product else None,
        "product_sku": product.sku if product else None,
        "total_stock": inventory.total_stock,
        "reserved_stock": inventory.reserved_stock,
        "available_stock": inventory.available_stock,
        "low_stock_threshold": inventory.low_stock_threshold,
        "is_low_stock": inventory.is_low_stock,
        "is_out_of_stock": inventory.is_out_of_stock,
        "updated_at": inventory.updated_at,
    }


def adjust_stock(db: Session, inventory: Inventory, transaction_type: TransactionType,
                 quantity: int, notes: Optional[str], admin_id: Optional[int],
                 reference_id: Optional[str] = None) -> InventoryTransaction:
    previous = inventory.total_stock

    if transaction_type == TransactionType.STOCK_IN:
        new_stock = previous + quantity
    elif transaction_type == TransactionType.ADJUSTMENT:
        new_stock = quantity   # absolute value
    elif transaction_type == TransactionType.STOCK_OUT:
        new_stock = previous - quantity
        if new_stock < 0:
            raise BadRequestError("Insufficient stock — stock cannot go negative")
    elif transaction_type == TransactionType.ORDER_DEDUCTED:
        new_stock = previous - quantity
        if new_stock < 0:
            raise BadRequestError("Insufficient stock for order deduction")
    elif transaction_type == TransactionType.ORDER_RESTORED:
        new_stock = previous + quantity
    elif transaction_type == TransactionType.RESERVED:
        # Reserve: increase reserved_stock, do not change total_stock
        inventory.reserved_stock = min(inventory.reserved_stock + quantity, inventory.total_stock)
        db.commit()
        db.refresh(inventory)
        # Record transaction with no change to total_stock
        txn = InventoryTransaction(
            inventory_id=inventory.id,
            transaction_type=transaction_type.value,
            quantity=quantity,
            previous_stock=previous,
            new_stock=inventory.total_stock,
            notes=notes,
            admin_id=admin_id,
            reference_id=reference_id,
        )
        db.add(txn)
        db.commit()
        db.refresh(txn)
        return txn
    elif transaction_type == TransactionType.RELEASED:
        # Release: decrease reserved_stock
        inventory.reserved_stock = max(0, inventory.reserved_stock - quantity)
        db.commit()
        db.refresh(inventory)
        txn = InventoryTransaction(
            inventory_id=inventory.id,
            transaction_type=transaction_type.value,
            quantity=quantity,
            previous_stock=previous,
            new_stock=inventory.total_stock,
            notes=notes,
            admin_id=admin_id,
            reference_id=reference_id,
        )
        db.add(txn)
        db.commit()
        db.refresh(txn)
        return txn
    else:
        new_stock = previous + quantity

    inventory.total_stock = new_stock
    txn = InventoryTransaction(
        inventory_id=inventory.id,
        transaction_type=transaction_type.value,
        quantity=quantity,
        previous_stock=previous,
        new_stock=new_stock,
        notes=notes,
        admin_id=admin_id,
        reference_id=reference_id,
    )
    db.add(txn)
    db.commit()
    db.refresh(inventory)
    db.refresh(txn)
    return txn


def update_threshold(db: Session, inventory: Inventory, threshold: int) -> Inventory:
    inventory.low_stock_threshold = threshold
    db.commit()
    db.refresh(inventory)
    return inventory


def get_inventory_history(db: Session, inventory_id: int,
                          page: int, page_size: int) -> Tuple[List[InventoryTransaction], int]:
    q = db.query(InventoryTransaction).filter(InventoryTransaction.inventory_id == inventory_id)
    total = q.count()
    items = q.order_by(InventoryTransaction.created_at.desc()) \
             .offset((page - 1) * page_size).limit(page_size).all()
    return items, total
