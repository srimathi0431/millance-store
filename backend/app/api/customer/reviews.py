from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from db.database import get_db
from app.core.exceptions import success_response
from app.core.customer_dependencies import get_current_customer
from app.schemas.customer_api import ReviewCreateRequest, PublicReviewOut
from app.services import customer_api as svc

router = APIRouter(prefix="/api/customer/reviews", tags=["Customer Reviews"])


@router.post("", summary="Submit a product review (auth required)")
def submit_review(
    data: ReviewCreateRequest,
    db: Session = Depends(get_db),
    customer=Depends(get_current_customer),
):
    review = svc.submit_review(db, customer, data)
    return success_response(
        data=PublicReviewOut.model_validate({
            "id":                   review.id,
            "rating":               review.rating,
            "title":                review.title,
            "body":                 review.body,
            "customer_name":        customer.name,
            "is_verified_purchase": review.is_verified_purchase,
            "created_at":           review.created_at,
        }).model_dump(),
        message="Review submitted. It will appear once approved by the team.",
    )
