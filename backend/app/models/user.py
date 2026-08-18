from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text, ForeignKey, Numeric
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from db.base import Base


class Customer(Base):
    __tablename__ = "customers"

    id              = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name            = Column(String(255), nullable=False)
    email           = Column(String(255), unique=True, nullable=False, index=True)
    phone           = Column(String(20),  unique=True, nullable=True,  index=True)
    hashed_password = Column(String(255), nullable=True)
    is_active       = Column(Boolean, default=True,  nullable=False)
    is_blocked      = Column(Boolean, default=False, nullable=False)
    email_verified  = Column(Boolean, default=False, nullable=False)

    # OTP fields — used for phone-based login
    phone_otp         = Column(String(10),  nullable=True)
    otp_expires_at    = Column(DateTime(timezone=True), nullable=True)
    otp_verified      = Column(Boolean, default=False, nullable=False)

    # Customer refresh tokens
    refresh_token_hash = Column(String(255), nullable=True)
    refresh_token_exp  = Column(DateTime(timezone=True), nullable=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

    addresses = relationship("CustomerAddress", back_populates="customer", cascade="all, delete-orphan")
    orders    = relationship("Order",    back_populates="customer")
    reviews   = relationship("Review",   back_populates="customer")
    cart_items = relationship("CartItem", back_populates="customer", cascade="all, delete-orphan")
    wishlist   = relationship("WishlistItem", back_populates="customer", cascade="all, delete-orphan")


class CustomerAddress(Base):
    __tablename__ = "customer_addresses"

    id          = Column(Integer, primary_key=True, index=True, autoincrement=True)
    customer_id = Column(Integer, ForeignKey("customers.id", ondelete="CASCADE"), nullable=False, index=True)
    name          = Column(String(255), nullable=False)
    phone         = Column(String(20),  nullable=False)
    address_line1 = Column(String(500), nullable=False)
    address_line2 = Column(String(500), nullable=True)
    city          = Column(String(100), nullable=False)
    state         = Column(String(100), nullable=False)
    country       = Column(String(100), nullable=False, default="India")
    pincode       = Column(String(20),  nullable=False)
    is_default    = Column(Boolean, default=False, nullable=False)
    created_at    = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    customer = relationship("Customer", back_populates="addresses")


class CartItem(Base):
    """Server-side cart — one row per product+variant per customer."""
    __tablename__ = "cart_items"

    id          = Column(Integer, primary_key=True, index=True, autoincrement=True)
    customer_id = Column(Integer, ForeignKey("customers.id", ondelete="CASCADE"), nullable=False, index=True)
    product_id  = Column(Integer, ForeignKey("products.id", ondelete="CASCADE"), nullable=False)
    variant_id  = Column(Integer, ForeignKey("product_variants.id", ondelete="SET NULL"), nullable=True)
    quantity    = Column(Integer, nullable=False, default=1)
    added_at    = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at  = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

    customer = relationship("Customer", back_populates="cart_items")
    product  = relationship("Product")
    variant  = relationship("ProductVariant")


class WishlistItem(Base):
    """One row per product per customer."""
    __tablename__ = "wishlist_items"

    id          = Column(Integer, primary_key=True, index=True, autoincrement=True)
    customer_id = Column(Integer, ForeignKey("customers.id", ondelete="CASCADE"), nullable=False, index=True)
    product_id  = Column(Integer, ForeignKey("products.id", ondelete="CASCADE"), nullable=False)
    added_at    = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    customer = relationship("Customer", back_populates="wishlist")
    product  = relationship("Product")
