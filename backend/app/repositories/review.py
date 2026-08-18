from sqlalchemy.orm import Session
from typing import Optional, Tuple, List

from app.models.review import Review


def get_review_by_id(db: Session, review_id: int) -> Optional[Review]:
    return db.query(Review).filter(Review.id == review_id).first()


def list_reviews(db: Session, page: int, page_size: int,
                 status: Optional[str] = None,
                 product_id: Optional[int] = None,
                 customer_id: Optional[int] = None,
                 rating: Optional[int] = None) -> Tuple[List[Review], int]:
    q = db.query(Review)
    if status:
        q = q.filter(Review.status == status)
    if product_id:
        q = q.filter(Review.product_id == product_id)
    if customer_id:
        q = q.filter(Review.customer_id == customer_id)
    if rating:
        q = q.filter(Review.rating == rating)
    total = q.count()
    items = q.order_by(Review.created_at.desc()).offset((page - 1) * page_size).limit(page_size).all()
    return items, total


def update_review_status(db: Session, review: Review, status: str) -> Review:
    review.status = status
    db.commit()
    db.refresh(review)
    return review


def delete_review(db: Session, review: Review) -> None:
    db.delete(review)
    db.commit()
