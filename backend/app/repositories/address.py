from sqlalchemy.orm import Session
from typing import Optional, List

from app.models.user import CustomerAddress


def get_all(db: Session, customer_id: int) -> List[CustomerAddress]:
    return (
        db.query(CustomerAddress)
        .filter(CustomerAddress.customer_id == customer_id)
        .order_by(CustomerAddress.is_default.desc(), CustomerAddress.created_at.asc())
        .all()
    )


def get_by_id(db: Session, address_id: int,
              customer_id: int) -> Optional[CustomerAddress]:
    return db.query(CustomerAddress).filter(
        CustomerAddress.id          == address_id,
        CustomerAddress.customer_id == customer_id,
    ).first()


def create(db: Session, customer_id: int, **data) -> CustomerAddress:
    is_first = db.query(CustomerAddress).filter(
        CustomerAddress.customer_id == customer_id
    ).count() == 0
    addr = CustomerAddress(
        customer_id=customer_id,
        is_default=data.pop("is_default", False) or is_first,
        **data,
    )
    db.add(addr)
    db.commit()
    db.refresh(addr)
    return addr


def update(db: Session, addr: CustomerAddress, **data) -> CustomerAddress:
    for k, v in data.items():
        if v is not None and hasattr(addr, k):
            setattr(addr, k, v)
    db.commit()
    db.refresh(addr)
    return addr


def set_default(db: Session, customer_id: int, address_id: int) -> None:
    db.query(CustomerAddress).filter(
        CustomerAddress.customer_id == customer_id
    ).update({"is_default": False})
    db.query(CustomerAddress).filter(
        CustomerAddress.id == address_id
    ).update({"is_default": True})
    db.commit()


def delete(db: Session, addr: CustomerAddress) -> None:
    db.delete(addr)
    db.commit()
