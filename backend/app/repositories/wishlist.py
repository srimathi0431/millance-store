from sqlalchemy.orm import Session, joinedload
from typing import Optional, List

from app.models.user import WishlistItem
from app.models.product import Product, ProductImage


def get_wishlist(db: Session, customer_id: int) -> List[WishlistItem]:
    return (
        db.query(WishlistItem)
        .options(
            joinedload(WishlistItem.product).joinedload(Product.images),
        )
        .filter(WishlistItem.customer_id == customer_id)
        .order_by(WishlistItem.added_at.desc())
        .all()
    )


def get_item(db: Session, customer_id: int,
             product_id: int) -> Optional[WishlistItem]:
    return db.query(WishlistItem).filter(
        WishlistItem.customer_id == customer_id,
        WishlistItem.product_id  == product_id,
    ).first()


def add_item(db: Session, customer_id: int, product_id: int) -> WishlistItem:
    item = WishlistItem(customer_id=customer_id, product_id=product_id)
    db.add(item)
    db.commit()
    db.refresh(item)
    return item


def remove_item(db: Session, item: WishlistItem) -> None:
    db.delete(item)
    db.commit()


def clear_wishlist(db: Session, customer_id: int) -> None:
    db.query(WishlistItem).filter(WishlistItem.customer_id == customer_id).delete()
    db.commit()
