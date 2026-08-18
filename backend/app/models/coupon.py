import enum
from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text, ForeignKey, Numeric
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from db.base import Base


class DiscountType(str, enum.Enum):
    PERCENTAGE = "PERCENTAGE"
    FIXED = "FIXED"


class Coupon(Base):
    __tablename__ = "coupons"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    code = Column(String(100), unique=True, nullable=False, index=True)
    description = Column(Text, nullable=True)
    discount_type = Column(String(20), nullable=False, default=DiscountType.PERCENTAGE)
    discount_value = Column(Numeric(10, 2), nullable=False)
    min_order_amount = Column(Numeric(12, 2), default=0, nullable=False)
    max_discount_amount = Column(Numeric(12, 2), nullable=True)
    usage_limit = Column(Integer, nullable=True)          # total uses allowed (null = unlimited)
    per_user_limit = Column(Integer, default=1, nullable=False)
    used_count = Column(Integer, default=0, nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)
    starts_at = Column(DateTime(timezone=True), nullable=True)
    expires_at = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

    usages = relationship("CouponUsage", back_populates="coupon", cascade="all, delete-orphan")
    orders = relationship("Order", back_populates="coupon" if False else None)


class CouponUsage(Base):
    __tablename__ = "coupon_usage"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    coupon_id = Column(Integer, ForeignKey("coupons.id", ondelete="CASCADE"), nullable=False, index=True)
    customer_id = Column(Integer, ForeignKey("customers.id", ondelete="CASCADE"), nullable=False, index=True)
    order_id = Column(Integer, ForeignKey("orders.id", ondelete="CASCADE"), nullable=False)
    discount_applied = Column(Numeric(12, 2), nullable=False)
    used_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    coupon = relationship("Coupon", back_populates="usages")
