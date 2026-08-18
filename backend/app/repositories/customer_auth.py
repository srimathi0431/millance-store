"""
Repository layer for customer authentication.
Handles OTP generation/verification, token storage, and customer lookup.
"""
import hashlib
import random
import string
from datetime import datetime, timezone, timedelta
from typing import Optional

from sqlalchemy.orm import Session
from app.models.user import Customer
from app.core.security import hash_password


# ── helpers ──────────────────────────────────────────────────────────────────

def _hash(token: str) -> str:
    return hashlib.sha256(token.encode()).hexdigest()


def _generate_otp(length: int = 6) -> str:
    return "".join(random.choices(string.digits, k=length))


# ── lookup ────────────────────────────────────────────────────────────────────

def get_by_phone(db: Session, phone: str) -> Optional[Customer]:
    return db.query(Customer).filter(Customer.phone == phone).first()


def get_by_email(db: Session, email: str) -> Optional[Customer]:
    return db.query(Customer).filter(Customer.email == email).first()


def get_by_id(db: Session, customer_id: int) -> Optional[Customer]:
    return db.query(Customer).filter(Customer.id == customer_id).first()


# ── registration ──────────────────────────────────────────────────────────────

def create_customer(db: Session, name: str, phone: str, email: Optional[str] = None) -> Customer:
    customer = Customer(
        name=name,
        phone=phone,
        email=email or f"{phone}@millance.store",  # placeholder email if not given
    )
    db.add(customer)
    db.commit()
    db.refresh(customer)
    return customer


# ── OTP ───────────────────────────────────────────────────────────────────────

def set_otp(db: Session, customer: Customer, ttl_minutes: int = 10) -> str:
    otp = _generate_otp()
    customer.phone_otp      = otp
    customer.otp_expires_at = datetime.now(timezone.utc) + timedelta(minutes=ttl_minutes)
    customer.otp_verified   = False
    db.commit()
    return otp


def verify_otp(db: Session, customer: Customer, otp: str) -> bool:
    now = datetime.now(timezone.utc)
    expires = customer.otp_expires_at
    if expires and expires.tzinfo is None:
        expires = expires.replace(tzinfo=timezone.utc)
    if (
        customer.phone_otp == otp
        and expires is not None
        and now < expires
    ):
        customer.otp_verified   = True
        customer.phone_otp      = None
        customer.otp_expires_at = None
        db.commit()
        return True
    return False


# ── refresh token (single-token per customer) ─────────────────────────────────

def store_refresh_token(db: Session, customer: Customer,
                        token: str, expires_at: datetime) -> None:
    customer.refresh_token_hash = _hash(token)
    customer.refresh_token_exp  = expires_at
    db.commit()


def validate_refresh_token(db: Session, customer: Customer, token: str) -> bool:
    now = datetime.now(timezone.utc)
    exp = customer.refresh_token_exp
    if exp and exp.tzinfo is None:
        exp = exp.replace(tzinfo=timezone.utc)
    return (
        customer.refresh_token_hash == _hash(token)
        and exp is not None
        and now < exp
    )


def revoke_refresh_token(db: Session, customer: Customer) -> None:
    customer.refresh_token_hash = None
    customer.refresh_token_exp  = None
    db.commit()


# ── profile update ────────────────────────────────────────────────────────────

def update_profile(db: Session, customer: Customer, **kwargs) -> Customer:
    for k, v in kwargs.items():
        if v is not None and hasattr(customer, k):
            setattr(customer, k, v)
    db.commit()
    db.refresh(customer)
    return customer
