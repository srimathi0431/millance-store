from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import Optional

from db.database import get_db
from app.core.dependencies import get_current_admin, require_permission
from app.core.exceptions import success_response
from app.schemas.product import (
    ProductCreate, ProductUpdate, ProductStatusUpdate,
    ProductOut, ProductListOut, ProductImageCreate,
    ProductVariantCreate, ProductVariantUpdate, ProductVariantOut,
)
from app.schemas.common import paginate
from app.services import product as product_svc

router = APIRouter(prefix="/api/admin/products", tags=["Admin Products"])


# ── Product CRUD ─────────────────────────────────────────
@router.get("", summary="List products")
def list_products(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    search: Optional[str] = Query(None),
    category_id: Optional[int] = Query(None),
    status: Optional[str] = Query(None),
    is_featured: Optional[bool] = Query(None),
    min_price: Optional[float] = Query(None),
    max_price: Optional[float] = Query(None),
    sort_by: str = Query("created_at"),
    sort_order: str = Query("desc", enum=["asc", "desc"]),
    db: Session = Depends(get_db),
    admin=Depends(require_permission("products.view")),
):
    items, total = product_svc.list_products(
        db, page, page_size,
        search=search, category_id=category_id, status=status,
        is_featured=is_featured, min_price=min_price, max_price=max_price,
        sort_by=sort_by, sort_order=sort_order,
    )
    return success_response(
        data=paginate([ProductListOut.model_validate(i) for i in items], total, page, page_size),
        message="Products loaded"
    )


@router.post("", status_code=201, summary="Create product")
def create_product(
    payload: ProductCreate,
    db: Session = Depends(get_db),
    admin=Depends(require_permission("products.create")),
):
    product = product_svc.create_product(db, payload, admin)
    return success_response(data=ProductOut.model_validate(product), message="Product created")


@router.get("/{product_id}", summary="Get product detail")
def get_product(
    product_id: int,
    db: Session = Depends(get_db),
    admin=Depends(require_permission("products.view")),
):
    product = product_svc.get_product(db, product_id)
    return success_response(data=ProductOut.model_validate(product), message="Product loaded")


@router.put("/{product_id}", summary="Update product (status excluded — use PATCH /status)")
def update_product(
    product_id: int,
    payload: ProductUpdate,
    db: Session = Depends(get_db),
    admin=Depends(require_permission("products.update")),
):
    product = product_svc.update_product(db, product_id, payload, admin)
    return success_response(data=ProductOut.model_validate(product), message="Product updated")


@router.patch("/{product_id}/status", summary="Update product status only")
def update_status(
    product_id: int,
    payload: ProductStatusUpdate,
    db: Session = Depends(get_db),
    admin=Depends(require_permission("products.update")),
):
    product = product_svc.update_product_status(db, product_id, payload, admin)
    return success_response(data=ProductOut.model_validate(product), message="Product status updated")


@router.delete("/{product_id}", status_code=204, summary="Delete product")
def delete_product(
    product_id: int,
    db: Session = Depends(get_db),
    admin=Depends(require_permission("products.delete")),
):
    product_svc.delete_product(db, product_id, admin)


# ── Image endpoints ──────────────────────────────────────
@router.post("/{product_id}/images", status_code=201, summary="Add product image URL")
def add_image(
    product_id: int,
    payload: ProductImageCreate,
    db: Session = Depends(get_db),
    admin=Depends(require_permission("products.update")),
):
    img = product_svc.add_image(
        db, product_id, payload.image_url,
        payload.alt_text, payload.is_primary, payload.sort_order, admin
    )
    return success_response(data={"id": img.id, "image_url": img.image_url, "is_primary": img.is_primary}, message="Image added")


@router.delete("/{product_id}/images/{image_id}", status_code=204, summary="Delete product image")
def delete_image(
    product_id: int,
    image_id: int,
    db: Session = Depends(get_db),
    admin=Depends(require_permission("products.update")),
):
    product_svc.delete_image(db, product_id, image_id, admin)


@router.patch("/{product_id}/images/{image_id}/primary", summary="Set primary image")
def set_primary(
    product_id: int,
    image_id: int,
    db: Session = Depends(get_db),
    admin=Depends(require_permission("products.update")),
):
    img = product_svc.set_primary_image(db, product_id, image_id, admin)
    return success_response(data={"id": img.id, "is_primary": img.is_primary}, message="Primary image set")


# ── Variant endpoints ────────────────────────────────────
@router.post("/{product_id}/variants", status_code=201, summary="Add variant to product")
def create_variant(
    product_id: int,
    payload: ProductVariantCreate,
    db: Session = Depends(get_db),
    admin=Depends(require_permission("products.update")),
):
    variant = product_svc.create_variant(db, product_id, payload, admin)
    return success_response(data=ProductVariantOut.model_validate(variant), message="Variant created")


@router.put("/{product_id}/variants/{variant_id}", summary="Update variant")
def update_variant(
    product_id: int,
    variant_id: int,
    payload: ProductVariantUpdate,
    db: Session = Depends(get_db),
    admin=Depends(require_permission("products.update")),
):
    variant = product_svc.update_variant(db, product_id, variant_id, payload, admin)
    return success_response(data=ProductVariantOut.model_validate(variant), message="Variant updated")


@router.delete("/{product_id}/variants/{variant_id}", status_code=204, summary="Delete variant")
def delete_variant(
    product_id: int,
    variant_id: int,
    db: Session = Depends(get_db),
    admin=Depends(require_permission("products.delete")),
):
    product_svc.delete_variant(db, product_id, variant_id, admin)
