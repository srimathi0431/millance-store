from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from app.models.review import ReviewStatus


class ReviewOut(BaseModel):
    id: int
    product_id: int
    customer_id: int
    rating: int
    title: Optional[str]
    body: Optional[str]
    status: str
    is_verified_purchase: bool
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class ReviewStatusUpdate(BaseModel):
    status: ReviewStatus
