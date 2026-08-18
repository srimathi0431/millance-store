from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import Optional

from db.database import get_db
from app.core.dependencies import require_permission
from app.core.exceptions import success_response
from app.schemas.review import ReviewOut, ReviewStatusUpdate
from app.schemas.common import paginate
from app.services import review as review_svc

router = APIRouter(prefix="/api/admin/reviews", tags=["Admin Reviews"])


@router.get("", summary="List reviews")
def list_reviews(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    status: Optional[str] = Query(None),
    product_id: Optional[int] = Query(None),
    customer_id: Optional[int] = Query(None),
    rating: Optional[int] = Query(None, ge=1, le=5),
    db: Session = Depends(get_db),
    admin=Depends(require_permission("reviews.view")),
):
    items, total = review_svc.list_reviews(
        db, page, page_size,
        status=status, product_id=product_id,
        customer_id=customer_id, rating=rating,
    )
    return success_response(
        data=paginate([ReviewOut.model_validate(r) for r in items], total, page, page_size),
        message="Reviews loaded"
    )


@router.get("/{review_id}", summary="Get review detail")
def get_review(
    review_id: int,
    db: Session = Depends(get_db),
    admin=Depends(require_permission("reviews.view")),
):
    r = review_svc.get_review(db, review_id)
    return success_response(data=ReviewOut.model_validate(r), message="Review loaded")


@router.patch("/{review_id}/status", summary="Approve/reject/hide review")
def update_status(
    review_id: int,
    payload: ReviewStatusUpdate,
    db: Session = Depends(get_db),
    admin=Depends(require_permission("reviews.update")),
):
    r = review_svc.update_status(db, review_id, payload, admin)
    return success_response(data=ReviewOut.model_validate(r), message="Review status updated")


@router.delete("/{review_id}", status_code=204, summary="Delete review")
def delete_review(
    review_id: int,
    db: Session = Depends(get_db),
    admin=Depends(require_permission("reviews.update")),
):
    review_svc.delete_review(db, review_id, admin)
