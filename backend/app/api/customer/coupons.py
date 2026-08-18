from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from db.database import get_db
from app.core.exceptions import success_response
from app.core.customer_dependencies import get_current_customer
from app.schemas.customer_api import CouponValidateRequest, CouponValidateResponse
from app.services import customer_api as svc

router = APIRouter(prefix="/api/customer/coupons", tags=["Customer Coupons"])


@router.post("/validate", summary="Validate a coupon code against a cart total")
def validate_coupon(
    data: CouponValidateRequest,
    db: Session = Depends(get_db),
    customer=Depends(get_current_customer),
):
    result = svc.validate_coupon(db, customer, data.code, data.cart_total)
    return success_response(
        data=CouponValidateResponse(**result).model_dump(),
        message=result["message"],
    )
