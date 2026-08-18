from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from db.database import get_db
from app.core.exceptions import success_response
from app.core.customer_dependencies import get_current_customer
from app.schemas.customer_api import CartAddRequest, CartUpdateRequest, CartOut
from app.services import customer_api as svc

router = APIRouter(prefix="/api/customer/cart", tags=["Customer Cart"])


@router.get("", summary="View cart")
def get_cart(
    db: Session = Depends(get_db),
    customer=Depends(get_current_customer),
):
    cart = svc.get_cart(db, customer)
    return success_response(data=cart, message="Cart loaded")


@router.post("", summary="Add item to cart (or update quantity if already exists)")
def add_to_cart(
    data: CartAddRequest,
    db: Session = Depends(get_db),
    customer=Depends(get_current_customer),
):
    cart = svc.add_to_cart(db, customer, data)
    return success_response(data=cart, message="Cart updated")


@router.patch("/{item_id}", summary="Update cart item quantity")
def update_item(
    item_id: int,
    data: CartUpdateRequest,
    db: Session = Depends(get_db),
    customer=Depends(get_current_customer),
):
    cart = svc.update_cart_item(db, customer, item_id, data)
    return success_response(data=cart, message="Cart updated")


@router.delete("/{item_id}", summary="Remove item from cart")
def remove_item(
    item_id: int,
    db: Session = Depends(get_db),
    customer=Depends(get_current_customer),
):
    cart = svc.remove_from_cart(db, customer, item_id)
    return success_response(data=cart, message="Item removed")


@router.delete("", summary="Clear entire cart")
def clear_cart(
    db: Session = Depends(get_db),
    customer=Depends(get_current_customer),
):
    svc.clear_cart_svc(db, customer)
    return success_response(message="Cart cleared")
