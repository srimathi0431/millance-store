"""
Customer authentication dependency — mirrors admin dependencies.py but for customers.
Reads Bearer token, validates it is a customer access token, returns Customer object.
"""
from fastapi import Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from typing import Optional

from db.database import get_db
from app.core.security import decode_token
from app.core.exceptions import UnauthorizedError
from app.models.user import Customer

bearer_scheme = HTTPBearer(auto_error=False)


def get_current_customer(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(bearer_scheme),
    db: Session = Depends(get_db),
) -> Customer:
    if not credentials:
        raise UnauthorizedError("Authentication required")
    payload = decode_token(credentials.credentials)
    if not payload or payload.get("type") != "customer_access":
        raise UnauthorizedError("Invalid or expired token")
    customer_id = payload.get("sub")
    if not customer_id:
        raise UnauthorizedError("Invalid token payload")
    customer = db.query(Customer).filter(
        Customer.id == int(customer_id),
        Customer.is_active == True,
        Customer.is_blocked == False,
    ).first()
    if not customer:
        raise UnauthorizedError("Account not found, deactivated or blocked")
    return customer


def get_optional_customer(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(bearer_scheme),
    db: Session = Depends(get_db),
) -> Optional[Customer]:
    """Returns customer if token present, else None — for public endpoints that benefit from auth."""
    if not credentials:
        return None
    try:
        return get_current_customer(credentials, db)
    except Exception:
        return None
