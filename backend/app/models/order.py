import enum
from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text, ForeignKey, Numeric
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from db.base import Base


class OrderStatus(str, enum.Enum):
    PENDING           = "PENDING"
    CONFIRMED         = "CONFIRMED"
    PROCESSING        = "PROCESSING"
    PACKED            = "PACKED"
    SHIPPED           = "SHIPPED"
    OUT_FOR_DELIVERY  = "OUT_FOR_DELIVERY"
    DELIVERED         = "DELIVERED"
    CANCELLED         = "CANCELLED"
    RETURN_REQUESTED  = "RETURN_REQUESTED"
    RETURNED          = "RETURNED"


# Valid status transitions — enforced in repository
ORDER_TRANSITIONS = {
    OrderStatus.PENDING:           [OrderStatus.CONFIRMED, OrderStatus.CANCELLED],
    OrderStatus.CONFIRMED:         [OrderStatus.PROCESSING, OrderStatus.CANCELLED],
    OrderStatus.PROCESSING:        [OrderStatus.PACKED, OrderStatus.CANCELLED],
    OrderStatus.PACKED:            [OrderStatus.SHIPPED],
    OrderStatus.SHIPPED:           [OrderStatus.OUT_FOR_DELIVERY],
    OrderStatus.OUT_FOR_DELIVERY:  [OrderStatus.DELIVERED],
    OrderStatus.DELIVERED:         [OrderStatus.RETURN_REQUESTED],
    OrderStatus.RETURN_REQUESTED:  [OrderStatus.RETURNED, OrderStatus.DELIVERED],
    OrderStatus.CANCELLED:         [],
    OrderStatus.RETURNED:          [],
}


class Order(Base):
    __tablename__ = "orders"

    id              = Column(Integer, primary_key=True, index=True, autoincrement=True)
    order_number    = Column(String(50),  unique=True, nullable=False, index=True)
    customer_id     = Column(Integer, ForeignKey("customers.id", ondelete="SET NULL"), nullable=True, index=True)
    status          = Column(String(30),  nullable=False, default=OrderStatus.PENDING)

    # Financials
    subtotal        = Column(Numeric(12, 2), nullable=False)
    discount_amount = Column(Numeric(12, 2), default=0, nullable=False)
    tax_amount      = Column(Numeric(12, 2), default=0, nullable=False)
    shipping_amount = Column(Numeric(12, 2), default=0, nullable=False)
    total_amount    = Column(Numeric(12, 2), nullable=False)
    coupon_id       = Column(Integer, ForeignKey("coupons.id", ondelete="SET NULL"), nullable=True)

    # Shipping address
    shipping_name    = Column(String(255), nullable=True)
    shipping_phone   = Column(String(20),  nullable=True)
    shipping_address = Column(Text, nullable=True)

    # Dispatch / tracking
    tracking_number  = Column(String(100), nullable=True, index=True)
    courier_name     = Column(String(100), nullable=True)

    # Stage timestamps (populated automatically on each transition)
    confirmed_at     = Column(DateTime(timezone=True), nullable=True)
    packed_at        = Column(DateTime(timezone=True), nullable=True)
    dispatched_at    = Column(DateTime(timezone=True), nullable=True)  # set when SHIPPED
    delivered_at     = Column(DateTime(timezone=True), nullable=True)

    # Misc
    notes            = Column(Text, nullable=True)
    cancelled_reason = Column(Text, nullable=True)
    return_reason    = Column(Text, nullable=True)

    created_at  = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at  = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

    # Relationships
    customer = relationship("Customer", back_populates="orders")
    items    = relationship("OrderItem",         back_populates="order", cascade="all, delete-orphan")
    payment  = relationship("Payment",           back_populates="order", uselist=False)
    refunds  = relationship("Refund",            back_populates="order")
    history  = relationship("OrderStatusHistory", back_populates="order",
                            cascade="all, delete-orphan", order_by="OrderStatusHistory.changed_at")


class OrderItem(Base):
    __tablename__ = "order_items"

    id           = Column(Integer, primary_key=True, index=True, autoincrement=True)
    order_id     = Column(Integer, ForeignKey("orders.id", ondelete="CASCADE"), nullable=False, index=True)
    product_id   = Column(Integer, ForeignKey("products.id", ondelete="SET NULL"), nullable=True)
    product_name = Column(String(500), nullable=False)   # snapshot at order time
    product_sku  = Column(String(100), nullable=False)   # snapshot at order time
    variant_id   = Column(Integer, ForeignKey("product_variants.id", ondelete="SET NULL"), nullable=True)
    quantity     = Column(Integer, nullable=False)
    unit_price   = Column(Numeric(12, 2), nullable=False)
    discount_price = Column(Numeric(12, 2), nullable=True)
    tax_percent  = Column(Numeric(5, 2), default=0, nullable=False)
    total_price  = Column(Numeric(12, 2), nullable=False)

    order   = relationship("Order",   back_populates="items")
    product = relationship("Product", back_populates="order_items")


class OrderStatusHistory(Base):
    """
    Immutable log — one row per status transition.
    Lets the separate customer app (and admin) show a full timeline.
    """
    __tablename__ = "order_status_history"

    id          = Column(Integer, primary_key=True, index=True, autoincrement=True)
    order_id    = Column(Integer, ForeignKey("orders.id", ondelete="CASCADE"), nullable=False, index=True)
    from_status = Column(String(30), nullable=True)   # NULL for the first PENDING entry
    to_status   = Column(String(30), nullable=False)
    notes       = Column(Text, nullable=True)
    changed_by  = Column(Integer, ForeignKey("admins.id", ondelete="SET NULL"), nullable=True)
    changed_at  = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    order = relationship("Order", back_populates="history")
