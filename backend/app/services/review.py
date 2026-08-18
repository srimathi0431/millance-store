from sqlalchemy.orm import Session

from app.repositories import review as review_repo
from app.repositories import audit as audit_repo
from app.core.exceptions import NotFoundError
from app.schemas.review import ReviewStatusUpdate
from app.models.admin import Admin


def list_reviews(db, page, page_size, **filters):
    page_size = min(page_size, 100)
    return review_repo.list_reviews(db, page, page_size, **filters)


def get_review(db: Session, review_id: int):
    r = review_repo.get_review_by_id(db, review_id)
    if not r:
        raise NotFoundError(f"Review {review_id} not found")
    return r


def update_status(db: Session, review_id: int, data: ReviewStatusUpdate, admin: Admin):
    r = get_review(db, review_id)
    updated = review_repo.update_review_status(db, r, data.status.value)
    audit_repo.log_action(db, "REVIEW_STATUS_UPDATED", admin_id=admin.id,
                          entity_type="review", entity_id=review_id,
                          new_value={"status": data.status.value})
    return updated


def delete_review(db: Session, review_id: int, admin: Admin):
    r = get_review(db, review_id)
    audit_repo.log_action(db, "REVIEW_DELETED", admin_id=admin.id,
                          entity_type="review", entity_id=review_id)
    review_repo.delete_review(db, r)
