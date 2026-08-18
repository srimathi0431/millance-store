from sqlalchemy.orm import Session

from app.repositories import category as cat_repo
from app.repositories import audit as audit_repo
from app.core.exceptions import NotFoundError, ConflictError, BadRequestError
from app.schemas.category import CategoryCreate, CategoryUpdate
from app.models.admin import Admin


def list_categories(db, page, page_size, search=None, is_active=None):
    page_size = min(page_size, 100)
    return cat_repo.list_categories(db, page, page_size, search, is_active)


def get_category(db: Session, category_id: int):
    cat = cat_repo.get_category_by_id(db, category_id)
    if not cat:
        raise NotFoundError(f"Category {category_id} not found")
    return cat


def create_category(db: Session, data: CategoryCreate, admin: Admin):
    if cat_repo.get_category_by_name(db, data.name):
        raise ConflictError(f"Category '{data.name}' already exists")
    if data.parent_id:
        parent = cat_repo.get_category_by_id(db, data.parent_id)
        if not parent:
            raise BadRequestError(f"Parent category {data.parent_id} not found")
    cat = cat_repo.create_category(db, data.model_dump())
    audit_repo.log_action(db, "CATEGORY_CREATED", admin_id=admin.id,
                          entity_type="category", entity_id=cat.id,
                          new_value={"name": cat.name})
    return cat


def update_category(db: Session, category_id: int, data: CategoryUpdate, admin: Admin):
    cat = get_category(db, category_id)
    if data.parent_id:
        if data.parent_id == category_id:
            raise BadRequestError("A category cannot be its own parent")
        parent = cat_repo.get_category_by_id(db, data.parent_id)
        if not parent:
            raise BadRequestError(f"Parent category {data.parent_id} not found")
    update_data = {k: v for k, v in data.model_dump().items() if v is not None}
    updated = cat_repo.update_category(db, cat, update_data)
    audit_repo.log_action(db, "CATEGORY_UPDATED", admin_id=admin.id,
                          entity_type="category", entity_id=category_id,
                          new_value=update_data)
    return updated


def update_status(db: Session, category_id: int, is_active: bool, admin: Admin):
    cat = get_category(db, category_id)
    cat_repo.update_category(db, cat, {"is_active": is_active})
    return cat


def delete_category(db: Session, category_id: int, admin: Admin):
    cat = get_category(db, category_id)
    if cat_repo.category_has_products(db, category_id):
        raise BadRequestError("Cannot delete category with active products")
    audit_repo.log_action(db, "CATEGORY_DELETED", admin_id=admin.id,
                          entity_type="category", entity_id=category_id,
                          old_value={"name": cat.name})
    cat_repo.delete_category(db, cat)
