from sqlalchemy.orm import Session, joinedload
from typing import Optional, List

from app.models.user import CartItem
from app.models.product import Product, ProductImage
from app.models.inventory import Inventory


def get_cart(db: Session, customer_id: int) -> List[CartItem]:
    return (
        db.query(CartItem)
        .options(
            joinedload(CartItem.product).joinedload(Product.images),
            joinedload(CartItem.product).joinedload(Product.inventory),
            joinedload(CartItem.variant),
        )
        .filter(CartItem.customer_id == customer_id)
        .order_by(CartItem.added_at.desc())
        .all()
    )


def get_cart_item(db: Session, customer_id: int, product_id: int,
                  variant_id: Optional[int] = None) -> Optional[CartItem]:
    q = db.query(CartItem).filter(
        CartItem.customer_id == customer_id,
        CartItem.product_id  == product_id,
    )
    if variant_id is not None:
        q = q.filter(CartItem.variant_id == variant_id)
    else:
        q = q.filter(CartItem.variant_id == None)
    return q.first()


def get_cart_item_by_id(db: Session, item_id: int,
                        customer_id: int) -> Optional[CartItem]:
    return db.query(CartItem).filter(
        CartItem.id == item_id,
        CartItem.customer_id == customer_id,
    ).first()


def upsert_cart_item(db: Session, customer_id: int, product_id: int,
                     quantity: int, variant_id: Optional[int] = None) -> CartItem:
    item = get_cart_item(db, customer_id, product_id, variant_id)
    if item:
        item.quantity = quantity
    else:
        item = CartItem(
            customer_id=customer_id,
            product_id=product_id,
            variant_id=variant_id,
            quantity=quantity,
        )
        db.add(item)
    db.commit()
    db.refresh(item)
    return item


def remove_cart_item(db: Session, item: CartItem) -> None:
    db.delete(item)
    db.commit()


def clear_cart(db: Session, customer_id: int) -> None:
    db.query(CartItem).filter(CartItem.customer_id == customer_id).delete()
    db.commit()
