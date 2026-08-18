# Import all models so SQLAlchemy registers them on Base.metadata
from db.models import User, UserRole                        # existing
from app.models.admin import Admin, AdminRefreshToken, AdminRole
from app.models.category import Category
from app.models.product import Product, ProductImage, ProductVariant
from app.models.inventory import Inventory, InventoryTransaction
from app.models.user import Customer, CustomerAddress, CartItem, WishlistItem
from app.models.order import Order, OrderItem, OrderStatusHistory
from app.models.payment import Payment, Refund
from app.models.coupon import Coupon, CouponUsage
from app.models.review import Review
from app.models.audit import AuditLog

__all__ = [
    "User", "UserRole",
    "Admin", "AdminRefreshToken", "AdminRole",
    "Category",
    "Product", "ProductImage", "ProductVariant",
    "Inventory", "InventoryTransaction",
    "Customer", "CustomerAddress", "CartItem", "WishlistItem",
    "Order", "OrderItem", "OrderStatusHistory",
    "Payment", "Refund",
    "Coupon", "CouponUsage",
    "Review",
    "AuditLog",
]
