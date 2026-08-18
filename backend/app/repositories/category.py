from sqlalchemy.orm import Session
from typing import Optional, Tuple, List
import re

from app.models.category import Category


def slugify(text: str) -> str:
    s = text.lower().strip()
    s = re.sub(r"[^\w\s-]", "", s)
    s = re.sub(r"[\s_-]+", "-", s)
    return re.sub(r"^-+|-+$", "", s)


def get_category_by_id(db: Session, category_id: int) -> Optional[Category]:
    return db.query(Category).filter(Category.id == category_id).first()


def get_category_by_name(db: Session, name: str) -> Optional[Category]:
    return db.query(Category).filter(Category.name == name).first()


def list_categories(db: Session, page: int, page_size: int,
                    search: Optional[str] = None,
                    is_active: Optional[bool] = None) -> Tuple[List[Category], int]:
    q = db.query(Category)
    if search:
        q = q.filter(Category.name.ilike(f"%{search}%"))
    if is_active is not None:
        q = q.filter(Category.is_active == is_active)
    total = q.count()
    items = q.order_by(Category.sort_order.asc(), Category.name.asc()) \
             .offset((page - 1) * page_size).limit(page_size).all()
    return items, total


def create_category(db: Session, data: dict) -> Category:
    base_slug = slugify(data["name"])
    slug = base_slug
    counter = 1
    while db.query(Category).filter(Category.slug == slug).first():
        slug = f"{base_slug}-{counter}"
        counter += 1
    cat = Category(**data, slug=slug)
    db.add(cat)
    db.commit()
    db.refresh(cat)
    return cat


def update_category(db: Session, category: Category, data: dict) -> Category:
    for k, v in data.items():
        if v is not None:
            setattr(category, k, v)
    db.commit()
    db.refresh(category)
    return category


def delete_category(db: Session, category: Category) -> None:
    db.delete(category)
    db.commit()


def category_has_products(db: Session, category_id: int) -> bool:
    from app.models.product import Product
    return db.query(Product).filter(
        Product.category_id == category_id,
        Product.status == "ACTIVE"
    ).count() > 0
