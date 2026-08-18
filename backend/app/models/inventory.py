import enum
from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text, ForeignKey, Numeric
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from db.base import Base


class TransactionType(str, enum.Enum):
    STOCK_IN = "STOCK_IN"
    STOCK_OUT = "STOCK_OUT"
    ADJUSTMENT = "ADJUSTMENT"
    RESERVED = "RESERVED"
    RELEASED = "RELEASED"
    ORDER_DEDUCTED = "ORDER_DEDUCTED"
    ORDER_RESTORED = "ORDER_RESTORED"


class Inventory(Base):
    __tablename__ = "inventory"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    product_id = Column(Integer, ForeignKey("products.id", ondelete="CASCADE"), unique=True, nullable=False, index=True)
    total_stock = Column(Integer, default=0, nullable=False)
    reserved_stock = Column(Integer, default=0, nullable=False)
    low_stock_threshold = Column(Integer, default=10, nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

    product = relationship("Product", back_populates="inventory")
    transactions = relationship("InventoryTransaction", back_populates="inventory", cascade="all, delete-orphan")

    @property
    def available_stock(self) -> int:
        return max(0, self.total_stock - self.reserved_stock)

    @property
    def is_low_stock(self) -> bool:
        return self.available_stock <= self.low_stock_threshold and self.available_stock > 0

    @property
    def is_out_of_stock(self) -> bool:
        return self.available_stock <= 0


class InventoryTransaction(Base):
    __tablename__ = "inventory_transactions"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    inventory_id = Column(Integer, ForeignKey("inventory.id", ondelete="CASCADE"), nullable=False, index=True)
    transaction_type = Column(String(30), nullable=False)
    quantity = Column(Integer, nullable=False)
    previous_stock = Column(Integer, nullable=False)
    new_stock = Column(Integer, nullable=False)
    reference_id = Column(String(100), nullable=True)   # order id, etc.
    notes = Column(Text, nullable=True)
    admin_id = Column(Integer, ForeignKey("admins.id", ondelete="SET NULL"), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    inventory = relationship("Inventory", back_populates="transactions")
