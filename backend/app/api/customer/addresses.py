from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from db.database import get_db
from app.core.exceptions import success_response
from app.core.customer_dependencies import get_current_customer
from app.schemas.customer_api import AddressCreate, AddressUpdate, AddressOut
from app.services import customer_api as svc

router = APIRouter(prefix="/api/customer/addresses", tags=["Customer Addresses"])


@router.get("", summary="List all addresses")
def list_addresses(
    db: Session = Depends(get_db),
    customer=Depends(get_current_customer),
):
    addrs = svc.list_addresses(db, customer)
    return success_response(
        data=[AddressOut.model_validate(a).model_dump() for a in addrs],
        message="Addresses loaded",
    )


@router.post("", summary="Add new address")
def add_address(
    data: AddressCreate,
    db: Session = Depends(get_db),
    customer=Depends(get_current_customer),
):
    addr = svc.add_address(db, customer, data)
    return success_response(
        data=AddressOut.model_validate(addr).model_dump(),
        message="Address added",
    )


@router.put("/{address_id}", summary="Update address")
def update_address(
    address_id: int,
    data: AddressUpdate,
    db: Session = Depends(get_db),
    customer=Depends(get_current_customer),
):
    addr = svc.update_address(db, customer, address_id, data)
    return success_response(
        data=AddressOut.model_validate(addr).model_dump(),
        message="Address updated",
    )


@router.patch("/{address_id}/default", summary="Set address as default")
def set_default(
    address_id: int,
    db: Session = Depends(get_db),
    customer=Depends(get_current_customer),
):
    svc.set_default_address(db, customer, address_id)
    return success_response(message="Default address updated")


@router.delete("/{address_id}", summary="Delete address")
def delete_address(
    address_id: int,
    db: Session = Depends(get_db),
    customer=Depends(get_current_customer),
):
    svc.delete_address(db, customer, address_id)
    return success_response(message="Address deleted")
