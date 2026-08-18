from sqlalchemy.orm import Session
from typing import Optional

from app.repositories import product as product_repo
from app.repositories import audit as audit_repo
from app.core.exceptions import NotFoundError, ConflictError, BadRequestError
from app.schemas.product import ProductCreate, ProductUpdate, ProductStatusUpdate, ProductVariantCreate, ProductVariantUpdate
from app.models.admin import Admin


def list_products(db: Session, page: int, page_size: int, **filters):
    page_size = min(page_size, 100)
    return product_repo.list_products(db, page, page_size, **filters)


def get_product(db: Session, product_id: int):
    p = product_repo.get_product_by_id(db, product_id)
    if not p:
        raise NotFoundError(f"Product {product_id} not found")
    return p


def create_product(db: Session, data: ProductCreate, admin: Admin):
    if product_repo.get_product_by_sku(db, data.sku):
        raise ConflictError(f"SKU '{data.sku}' already exists")
    product = product_repo.create_product(db, data.model_dump())
    audit_repo.log_action(db, "PRODUCT_CREATED", admin_id=admin.id,
                          entity_type="product", entity_id=product.id,
                          new_value={"name": product.name, "sku": product.sku})
    return product


def update_product(db: Session, product_id: int, data: ProductUpdate, admin: Admin):
    product = get_product(db, product_id)
    update_data = {k: v for k, v in data.model_dump().items() if v is not None}
    updated = product_repo.update_product(db, product, update_data)
    audit_repo.log_action(db, "PRODUCT_UPDATED", admin_id=admin.id,
                          entity_type="product", entity_id=product_id,
                          new_value=update_data)
    return updated


def update_product_status(db: Session, product_id: int, data: ProductStatusUpdate, admin: Admin):
    product = get_product(db, product_id)
    product_repo.update_product(db, product, {"status": data.status.value})
    audit_repo.log_action(db, "PRODUCT_STATUS_UPDATED", admin_id=admin.id,
                          entity_type="product", entity_id=product_id,
                          new_value={"status": data.status.value})
    return product


def delete_product(db: Session, product_id: int, admin: Admin):
    product = get_product(db, product_id)
    audit_repo.log_action(db, "PRODUCT_DELETED", admin_id=admin.id,
                          entity_type="product", entity_id=product_id,
                          old_value={"name": product.name, "sku": product.sku})
    product_repo.delete_product(db, product)


# ── Images ───────────────────────────────────────────────
def add_image(db, product_id, image_url, alt_text, is_primary, sort_order, admin):
    get_product(db, product_id)
    return product_repo.add_product_image(db, product_id, image_url, alt_text, is_primary, sort_order)


def delete_image(db, product_id, image_id, admin):
    get_product(db, product_id)
    img = product_repo.get_product_image(db, image_id)
    if not img or img.product_id != product_id:
        raise NotFoundError(f"Image {image_id} not found for product {product_id}")
    product_repo.delete_product_image(db, img)


def set_primary_image(db, product_id, image_id, admin):
    get_product(db, product_id)
    img = product_repo.set_primary_image(db, product_id, image_id)
    if not img:
        raise NotFoundError(f"Image {image_id} not found for product {product_id}")
    return img


# ── Variants ─────────────────────────────────────────────
def create_variant(db: Session, product_id: int, data: ProductVariantCreate, admin: Admin):
    get_product(db, product_id)
    if product_repo.get_variant_by_sku(db, data.sku):
        raise ConflictError(f"Variant SKU '{data.sku}' already exists")
    variant = product_repo.create_variant(db, product_id, data.model_dump())
    audit_repo.log_action(db, "VARIANT_CREATED", admin_id=admin.id,
                          entity_type="variant", entity_id=variant.id,
                          new_value={"sku": variant.sku, "product_id": product_id})
    return variant


def update_variant(db: Session, product_id: int, variant_id: int,
                   data: ProductVariantUpdate, admin: Admin):
    get_product(db, product_id)
    variant = product_repo.get_variant_by_id(db, variant_id)
    if not variant or variant.product_id != product_id:
        raise NotFoundError(f"Variant {variant_id} not found for product {product_id}")
    update_data = {k: v for k, v in data.model_dump().items() if v is not None}
    updated = product_repo.update_variant(db, variant, update_data)
    audit_repo.log_action(db, "VARIANT_UPDATED", admin_id=admin.id,
                          entity_type="variant", entity_id=variant_id,
                          new_value=update_data)
    return updated


def delete_variant(db: Session, product_id: int, variant_id: int, admin: Admin):
    get_product(db, product_id)
    variant = product_repo.get_variant_by_id(db, variant_id)
    if not variant or variant.product_id != product_id:
        raise NotFoundError(f"Variant {variant_id} not found for product {product_id}")
    audit_repo.log_action(db, "VARIANT_DELETED", admin_id=admin.id,
                          entity_type="variant", entity_id=variant_id)
    product_repo.delete_variant(db, variant)
