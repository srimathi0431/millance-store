from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import Optional
from decimal import Decimal

from db.database import get_db
from app.core.exceptions import success_response
from app.schemas.common import paginate
from app.schemas.customer_api import (
    PublicProductListOut, PublicProductDetailOut, PublicReviewOut
)
from app.services import customer_api as svc

router = APIRouter(prefix="/api/customer/products", tags=["Customer Products"])


@router.get("", summary="List active products (no auth)")
def list_products(
    page:        int            = Query(1, ge=1),
    page_size:   int            = Query(20, ge=1, le=100),
    search:      Optional[str]  = Query(None),
    category_id: Optional[int]  = Query(None),
    brand:       Optional[str]  = Query(None),
    min_price:   Optional[Decimal] = Query(None),
    max_price:   Optional[Decimal] = Query(None),
    is_featured: Optional[bool] = Query(None),
    sort_by:     str            = Query("created_at"),
    sort_order:  str            = Query("desc", enum=["asc", "desc"]),
    db: Session = Depends(get_db),
):
    products, total = svc.list_products(
        db, page=page, page_size=page_size,
        search=search, category_id=category_id, brand=brand,
        min_price=min_price, max_price=max_price,
        is_featured=is_featured, sort_by=sort_by, sort_order=sort_order,
    )
    out = [PublicProductListOut.model_validate(p) for p in products]
    return success_response(
        data=paginate(out, total, page, page_size),
        message="Products loaded",
    )


@router.get("/featured", summary="Featured products")
def featured_products(
    limit: int = Query(10, ge=1, le=50),
    db: Session = Depends(get_db),
):
    products, total = svc.list_products(
        db, page=1, page_size=limit, is_featured=True
    )
    out = [PublicProductListOut.model_validate(p) for p in products]
    return success_response(data=out, message="Featured products loaded")


@router.get("/slug/{slug}", summary="Get product detail by slug (no auth)")
def get_by_slug(slug: str, db: Session = Depends(get_db)):
    detail = svc.get_product_by_slug(db, slug)
    out    = PublicProductDetailOut.model_validate(detail)
    return success_response(data=out.model_dump(), message="Product loaded")


@router.get("/{product_id}", summary="Get product detail by ID (no auth)")
def get_by_id(product_id: int, db: Session = Depends(get_db)):
    detail = svc.get_product_detail(db, product_id)
    out    = PublicProductDetailOut.model_validate(detail)
    return success_response(data=out.model_dump(), message="Product loaded")


@router.get("/{product_id}/reviews", summary="List approved reviews for a product")
def list_reviews(
    product_id: int,
    page:      int = Query(1,  ge=1),
    page_size: int = Query(10, ge=1, le=50),
    db: Session = Depends(get_db),
):
    reviews, total = svc.list_product_reviews(db, product_id, page, page_size)
    out = [PublicReviewOut.model_validate(r) for r in reviews]
    return success_response(
        data=paginate(out, total, page, page_size),
        message="Reviews loaded",
    )
