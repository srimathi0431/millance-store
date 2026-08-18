from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from db.database import get_db
from app.core.exceptions import success_response
from app.core.customer_dependencies import get_current_customer
from app.schemas.customer_api import WishlistItemOut
from app.services import customer_api as svc

router = APIRouter(prefix="/api/customer/wishlist", tags=["Customer Wishlist"])


@router.get("", summary="Get my wishlist")
def get_wishlist(
    db: Session = Depends(get_db),
    customer=Depends(get_current_customer),
):
    items = svc.get_wishlist(db, customer)
    out   = [WishlistItemOut.model_validate(i).model_dump() for i in items]
    return success_response(data=out, message="Wishlist loaded")


@router.post("/{product_id}", summary="Add product to wishlist")
def add_to_wishlist(
    product_id: int,
    db: Session = Depends(get_db),
    customer=Depends(get_current_customer),
):
    items = svc.add_to_wishlist(db, customer, product_id)
    out   = [WishlistItemOut.model_validate(i).model_dump() for i in items]
    return success_response(data=out, message="Added to wishlist")


@router.delete("/{product_id}", summary="Remove product from wishlist")
def remove_from_wishlist(
    product_id: int,
    db: Session = Depends(get_db),
    customer=Depends(get_current_customer),
):
    items = svc.remove_from_wishlist(db, customer, product_id)
    out   = [WishlistItemOut.model_validate(i).model_dump() for i in items]
    return success_response(data=out, message="Removed from wishlist")
