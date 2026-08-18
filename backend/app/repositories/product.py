from sqlalchemy.orm import Session
from sqlalchemy import func, or_
from typing import Optional, Tuple, List

from app.models.product import Product, ProductImage, ProductVariant, ProductStatus
from app.models.inventory import Inventory


def slugify(text: str) -> str:
    import re
    s = text.lower().strip()
    s = re.sub(r"[^\w\s-]", "", s)
    s = re.sub(r"[\s_-]+", "-", s)
    return re.sub(r"^-+|-+$", "", s)


def get_product_by_id(db: Session, product_id: int) -> Optional[Product]:
    return db.query(Product).filter(Product.id == product_id).first()


def get_product_by_sku(db: Session, sku: str) -> Optional[Product]:
    return db.query(Product).filter(Product.sku == sku).first()


def list_products(
    db: Session, page: int, page_size: int,
    search: Optional[str] = None,
    category_id: Optional[int] = None,
    status: Optional[str] = None,
    is_featured: Optional[bool] = None,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
    sort_by: str = "created_at",
    sort_order: str = "desc",
) -> Tuple[List[Product], int]:
    q = db.query(Product)
    if search:
        q = q.filter(or_(Product.name.ilike(f"%{search}%"), Product.sku.ilike(f"%{search}%")))
    if category_id:
        q = q.filter(Product.category_id == category_id)
    if status:
        q = q.filter(Product.status == status)
    if is_featured is not None:
        q = q.filter(Product.is_featured == is_featured)
    if min_price is not None:
        q = q.filter(Product.price >= min_price)
    if max_price is not None:
        q = q.filter(Product.price <= max_price)
    total = q.count()
    col = getattr(Product, sort_by, Product.created_at)
    q = q.order_by(col.desc() if sort_order == "desc" else col.asc())
    items = q.offset((page - 1) * page_size).limit(page_size).all()
    return items, total


def create_product(db: Session, data: dict) -> Product:
    base_slug = slugify(data["name"])
    slug = base_slug
    counter = 1
    while db.query(Product).filter(Product.slug == slug).first():
        slug = f"{base_slug}-{counter}"
        counter += 1
    product = Product(**data, slug=slug)
    db.add(product)
    db.flush()
    inventory = Inventory(product_id=product.id)
    db.add(inventory)
    db.commit()
    db.refresh(product)
    return product


def update_product(db: Session, product: Product, data: dict) -> Product:
    for k, v in data.items():
        if v is not None:
            setattr(product, k, v)
    db.commit()
    db.refresh(product)
    return product


def delete_product(db: Session, product: Product) -> None:
    db.delete(product)
    db.commit()


# ── Images ───────────────────────────────────────────────
def add_product_image(db: Session, product_id: int, image_url: str,
                      alt_text: Optional[str], is_primary: bool, sort_order: int) -> ProductImage:
    if is_primary:
        db.query(ProductImage).filter(ProductImage.product_id == product_id).update({"is_primary": False})
    img = ProductImage(product_id=product_id, image_url=image_url,
                       alt_text=alt_text, is_primary=is_primary, sort_order=sort_order)
    db.add(img)
    db.commit()
    db.refresh(img)
    return img


def get_product_image(db: Session, image_id: int) -> Optional[ProductImage]:
    return db.query(ProductImage).filter(ProductImage.id == image_id).first()


def delete_product_image(db: Session, image: ProductImage) -> None:
    db.delete(image)
    db.commit()


def set_primary_image(db: Session, product_id: int, image_id: int) -> Optional[ProductImage]:
    db.query(ProductImage).filter(ProductImage.product_id == product_id).update({"is_primary": False})
    img = db.query(ProductImage).filter(
        ProductImage.id == image_id, ProductImage.product_id == product_id
    ).first()
    if img:
        img.is_primary = True
        db.commit()
        db.refresh(img)
    return img


# ── Variants ─────────────────────────────────────────────
def get_variant_by_id(db: Session, variant_id: int) -> Optional[ProductVariant]:
    return db.query(ProductVariant).filter(ProductVariant.id == variant_id).first()


def get_variant_by_sku(db: Session, sku: str) -> Optional[ProductVariant]:
    return db.query(ProductVariant).filter(ProductVariant.sku == sku).first()


def create_variant(db: Session, product_id: int, data: dict) -> ProductVariant:
    variant = ProductVariant(product_id=product_id, **data)
    db.add(variant)
    db.commit()
    db.refresh(variant)
    return variant


def update_variant(db: Session, variant: ProductVariant, data: dict) -> ProductVariant:
    for k, v in data.items():
        if v is not None:
            setattr(variant, k, v)
    db.commit()
    db.refresh(variant)
    return variant


def delete_variant(db: Session, variant: ProductVariant) -> None:
    db.delete(variant)
    db.commit()
