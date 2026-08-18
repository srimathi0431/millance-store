"""
All Pydantic schemas for the customer-facing API.
Kept in one file to avoid circular imports.
"""
from pydantic import BaseModel, field_validator, EmailStr
from typing import Optional, List
from datetime import datetime
from decimal import Decimal


# ─────────────────────────────────────────────────────────────────────────────
# Auth
# ─────────────────────────────────────────────────────────────────────────────

class SendOTPRequest(BaseModel):
    phone: str
    name: Optional[str] = None      # required only for first-time registration

    @field_validator("phone")
    @classmethod
    def validate_phone(cls, v: str) -> str:
        v = v.strip()
        # Strip leading + and country code 91
        if v.startswith("+91"):
            v = v[3:]
        elif v.startswith("91") and len(v) == 12:
            v = v[2:]
        if not v.isdigit() or len(v) != 10:
            raise ValueError("Phone must be a valid 10-digit Indian mobile number")
        return v


class VerifyOTPRequest(BaseModel):
    phone: str
    otp: str

    @field_validator("phone")
    @classmethod
    def validate_phone(cls, v: str) -> str:
        v = v.strip()
        if v.startswith("+91"):
            v = v[3:]
        elif v.startswith("91") and len(v) == 12:
            v = v[2:]
        if not v.isdigit() or len(v) != 10:
            raise ValueError("Invalid phone number")
        return v


class TokenResponse(BaseModel):
    access_token:  str
    refresh_token: str
    token_type:    str = "bearer"
    expires_in:    int


class RefreshTokenRequest(BaseModel):
    refresh_token: str


class UpdateProfileRequest(BaseModel):
    name:  Optional[str]      = None
    email: Optional[str]      = None


class CustomerOut(BaseModel):
    id:             int
    name:           str
    email:          str
    phone:          Optional[str]
    is_active:      bool
    email_verified: bool
    created_at:     datetime

    model_config = {"from_attributes": True}


# ─────────────────────────────────────────────────────────────────────────────
# Address
# ─────────────────────────────────────────────────────────────────────────────

class AddressCreate(BaseModel):
    name:          str
    phone:         str
    address_line1: str
    address_line2: Optional[str] = None
    city:          str
    state:         str
    country:       str = "India"
    pincode:       str
    is_default:    bool = False


class AddressUpdate(BaseModel):
    name:          Optional[str] = None
    phone:         Optional[str] = None
    address_line1: Optional[str] = None
    address_line2: Optional[str] = None
    city:          Optional[str] = None
    state:         Optional[str] = None
    country:       Optional[str] = None
    pincode:       Optional[str] = None
    is_default:    Optional[bool] = None


class AddressOut(BaseModel):
    id:            int
    name:          str
    phone:         str
    address_line1: str
    address_line2: Optional[str]
    city:          str
    state:         str
    country:       str
    pincode:       str
    is_default:    bool
    created_at:    datetime

    model_config = {"from_attributes": True}


# ─────────────────────────────────────────────────────────────────────────────
# Products (public)
# ─────────────────────────────────────────────────────────────────────────────

class PublicImageOut(BaseModel):
    id:        int
    image_url: str
    alt_text:  Optional[str]
    is_primary: bool

    model_config = {"from_attributes": True}


class PublicVariantOut(BaseModel):
    id:         int
    name:       str
    sku:        str
    price:      Decimal
    stock:      int
    attributes: Optional[str]
    is_active:  bool

    model_config = {"from_attributes": True}


class PublicProductListOut(BaseModel):
    id:               int
    name:             str
    slug:             str
    brand:            Optional[str]
    price:            Decimal
    discount_price:   Optional[Decimal]
    category_id:      Optional[int]
    category_name:    Optional[str] = None
    is_featured:      bool
    primary_image:    Optional[str] = None   # URL of primary image
    rating_avg:       Optional[float] = None
    review_count:     int = 0

    model_config = {"from_attributes": True}


class PublicProductDetailOut(BaseModel):
    id:             int
    name:           str
    slug:           str
    description:    Optional[str]
    sku:            str
    brand:          Optional[str]
    price:          Decimal
    discount_price: Optional[Decimal]
    tax_percent:    Decimal
    weight:         Optional[Decimal]
    dimensions:     Optional[str]
    category_id:    Optional[int]
    category_name:  Optional[str] = None
    is_featured:    bool
    images:         List[PublicImageOut]   = []
    variants:       List[PublicVariantOut] = []
    in_stock:       bool = True
    available_stock: Optional[int] = None
    rating_avg:     Optional[float] = None
    review_count:   int = 0

    model_config = {"from_attributes": True}


# ─────────────────────────────────────────────────────────────────────────────
# Categories (public)
# ─────────────────────────────────────────────────────────────────────────────

class PublicCategoryOut(BaseModel):
    id:          int
    name:        str
    slug:        str
    description: Optional[str]
    image_url:   Optional[str]
    parent_id:   Optional[int]
    sort_order:  int
    children:    List["PublicCategoryOut"] = []

    model_config = {"from_attributes": True}


PublicCategoryOut.model_rebuild()


# ─────────────────────────────────────────────────────────────────────────────
# Cart
# ─────────────────────────────────────────────────────────────────────────────

class CartAddRequest(BaseModel):
    product_id: int
    variant_id: Optional[int] = None
    quantity:   int = 1

    @field_validator("quantity")
    @classmethod
    def positive_qty(cls, v: int) -> int:
        if v < 1:
            raise ValueError("Quantity must be at least 1")
        return v


class CartUpdateRequest(BaseModel):
    quantity: int

    @field_validator("quantity")
    @classmethod
    def positive_qty(cls, v: int) -> int:
        if v < 1:
            raise ValueError("Quantity must be at least 1")
        return v


class CartItemOut(BaseModel):
    id:             int
    product_id:     int
    product_name:   str
    product_slug:   str
    variant_id:     Optional[int]
    variant_name:   Optional[str]
    quantity:       int
    unit_price:     Decimal
    subtotal:       Decimal
    primary_image:  Optional[str]
    in_stock:       bool
    available_stock: int

    model_config = {"from_attributes": True}


class CartOut(BaseModel):
    items:        List[CartItemOut]
    item_count:   int
    total_qty:    int
    subtotal:     Decimal
    total:        Decimal


# ─────────────────────────────────────────────────────────────────────────────
# Coupon
# ─────────────────────────────────────────────────────────────────────────────

class CouponValidateRequest(BaseModel):
    code:          str
    cart_total:    Decimal


class CouponValidateResponse(BaseModel):
    valid:           bool
    code:            str
    discount_type:   Optional[str]
    discount_value:  Optional[Decimal]
    discount_amount: Optional[Decimal]
    final_total:     Optional[Decimal]
    message:         str


# ─────────────────────────────────────────────────────────────────────────────
# Order placement
# ─────────────────────────────────────────────────────────────────────────────

class PlaceOrderRequest(BaseModel):
    address_id:      int
    coupon_code:     Optional[str]  = None
    payment_method:  str            = "COD"   # COD | PREPAID
    notes:           Optional[str]  = None


class OrderItemPublicOut(BaseModel):
    id:            int
    product_id:    Optional[int]
    product_name:  str
    product_sku:   str
    variant_id:    Optional[int]
    quantity:      int
    unit_price:    Decimal
    total_price:   Decimal

    model_config = {"from_attributes": True}


class OrderStatusHistoryPublicOut(BaseModel):
    from_status: Optional[str]
    to_status:   str
    notes:       Optional[str]
    changed_at:  datetime

    model_config = {"from_attributes": True}


class CustomerOrderOut(BaseModel):
    id:               int
    order_number:     str
    status:           str
    subtotal:         Decimal
    discount_amount:  Decimal
    tax_amount:       Decimal
    shipping_amount:  Decimal
    total_amount:     Decimal
    shipping_name:    Optional[str]
    shipping_phone:   Optional[str]
    shipping_address: Optional[str]
    tracking_number:  Optional[str]
    courier_name:     Optional[str]
    cancelled_reason: Optional[str]
    return_reason:    Optional[str]
    notes:            Optional[str]
    confirmed_at:     Optional[datetime]
    packed_at:        Optional[datetime]
    dispatched_at:    Optional[datetime]
    delivered_at:     Optional[datetime]
    created_at:       datetime
    items:            List[OrderItemPublicOut]          = []
    history:          List[OrderStatusHistoryPublicOut] = []

    model_config = {"from_attributes": True}


class CustomerOrderListOut(BaseModel):
    id:              int
    order_number:    str
    status:          str
    total_amount:    Decimal
    item_count:      int = 0
    tracking_number: Optional[str]
    courier_name:    Optional[str]
    created_at:      datetime
    delivered_at:    Optional[datetime]

    model_config = {"from_attributes": True}


# ─────────────────────────────────────────────────────────────────────────────
# Reviews
# ─────────────────────────────────────────────────────────────────────────────

class ReviewCreateRequest(BaseModel):
    product_id: int
    rating:     int
    title:      Optional[str] = None
    body:       Optional[str] = None

    @field_validator("rating")
    @classmethod
    def valid_rating(cls, v: int) -> int:
        if not (1 <= v <= 5):
            raise ValueError("Rating must be between 1 and 5")
        return v


class PublicReviewOut(BaseModel):
    id:                   int
    rating:               int
    title:                Optional[str]
    body:                 Optional[str]
    customer_name:        Optional[str] = None
    is_verified_purchase: bool
    created_at:           datetime

    model_config = {"from_attributes": True}


# ─────────────────────────────────────────────────────────────────────────────
# Wishlist
# ─────────────────────────────────────────────────────────────────────────────

class WishlistItemOut(BaseModel):
    id:            int
    product_id:    int
    product_name:  str
    product_slug:  str
    price:         Decimal
    discount_price: Optional[Decimal]
    primary_image:  Optional[str]
    in_stock:       bool
    added_at:       datetime

    model_config = {"from_attributes": True}
