from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import Optional

from db.database import get_db
from app.core.dependencies import require_permission
from app.core.exceptions import success_response
from app.schemas.category import CategoryCreate, CategoryUpdate, CategoryStatusUpdate, CategoryOut
from app.schemas.common import paginate
from app.services import category as cat_svc

router = APIRouter(prefix="/api/admin/categories", tags=["Admin Categories"])


@router.get("", summary="List categories")
def list_categories(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    search: Optional[str] = Query(None),
    is_active: Optional[bool] = Query(None),
    db: Session = Depends(get_db),
    admin=Depends(require_permission("categories.view")),
):
    items, total = cat_svc.list_categories(db, page, page_size, search, is_active)
    return success_response(
        data=paginate([CategoryOut.model_validate(c) for c in items], total, page, page_size),
        message="Categories loaded"
    )


@router.post("", status_code=201, summary="Create category")
def create_category(
    payload: CategoryCreate,
    db: Session = Depends(get_db),
    admin=Depends(require_permission("categories.create")),
):
    cat = cat_svc.create_category(db, payload, admin)
    return success_response(data=CategoryOut.model_validate(cat), message="Category created")


@router.get("/{category_id}", summary="Get category detail")
def get_category(
    category_id: int,
    db: Session = Depends(get_db),
    admin=Depends(require_permission("categories.view")),
):
    cat = cat_svc.get_category(db, category_id)
    return success_response(data=CategoryOut.model_validate(cat), message="Category loaded")


@router.put("/{category_id}", summary="Update category")
def update_category(
    category_id: int,
    payload: CategoryUpdate,
    db: Session = Depends(get_db),
    admin=Depends(require_permission("categories.update")),
):
    cat = cat_svc.update_category(db, category_id, payload, admin)
    return success_response(data=CategoryOut.model_validate(cat), message="Category updated")


@router.patch("/{category_id}/status", summary="Update category status")
def update_status(
    category_id: int,
    payload: CategoryStatusUpdate,
    db: Session = Depends(get_db),
    admin=Depends(require_permission("categories.update")),
):
    cat = cat_svc.update_status(db, category_id, payload.is_active, admin)
    return success_response(data=CategoryOut.model_validate(cat), message="Category status updated")


@router.delete("/{category_id}", status_code=204, summary="Delete category")
def delete_category(
    category_id: int,
    db: Session = Depends(get_db),
    admin=Depends(require_permission("categories.delete")),
):
    cat_svc.delete_category(db, category_id, admin)
