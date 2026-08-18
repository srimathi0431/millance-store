from pydantic import BaseModel, field_validator
from typing import Optional, List, Any
from datetime import datetime
from decimal import Decimal
from app.models.product import ProductStatus

CLOTHING_SIZES = ["XS", "S", "M", "L", "XL", "XXL", "XXXL", "Free Size"]


# ── Image schemas ────────────────────────────────────────
class ProductImageOut(BaseModel):
    id: int
    image_url: str
    alt_text: Optional[str]
    is_primary: bool
    sort_order: int

    model_config = {"from_attributes": True}


class ProductImageCreate(BaseModel):
    image_url: str
    alt_text: Optional[str] = None
    is_primary: bool = False
    sort_order: int = 0


# ── Variant schemas ──────────────────────────────────────
class ProductVariantOut(BaseModel):
    id: int
    name: str
    sku: str
    price: Decimal
    stock: int
    attributes: Optional[str]   # JSON string {"size":"M","color":"red"}
    is_active: bool

    model_config = {"from_attributes": True}


class ProductVariantCreate(BaseModel):
    name: str
    sku: str
    price: Decimal
    stock: int = 0
    attributes: Optional[str] = None   # JSON string
    is_active: bool = True

    @field_validator("sku")
    @classmethod
    def sku_not_empty(cls, v: str) -> str:
        if not v or not v.strip():
            raise ValueError("Variant SKU must not be empty")
        return v.strip().upper()

    @field_validator("price")
    @classmethod
    def price_positive(cls, v: Decimal) -> Decimal:
        if v <= 0:
            raise ValueError("Variant price must be greater than 0")
        return v

    @field_validator("stock")
    @classmethod
    def stock_non_negative(cls, v: int) -> int:
        if v < 0:
            raise ValueError("Stock must be >= 0")
        return v


class ProductVariantUpdate(BaseModel):
    name: Optional[str] = None
    price: Optional[Decimal] = None
    stock: Optional[int] = None
    attributes: Optional[str] = None
    is_active: Optional[bool] = None

    @field_validator("stock")
    @classmethod
    def stock_non_negative(cls, v: Optional[int]) -> Optional[int]:
        if v is not None and v < 0:
            raise ValueError("Stock must be >= 0")
        return v


# ── Product schemas ──────────────────────────────────────
class ProductCreate(BaseModel):
    name: str
    description: Optional[str] = None
    sku: str
    category_id: Optional[int] = None
    brand: Optional[str] = None
    price: Decimal
    discount_price: Optional[Decimal] = None
    tax_percent: Decimal = Decimal("0")
    weight: Optional[Decimal] = None
    dimensions: Optional[str] = None
    status: ProductStatus = ProductStatus.DRAFT
    is_featured: bool = False

    @field_validator("price")
    @classmethod
    def price_positive(cls, v: Decimal) -> Decimal:
        if v <= 0:
            raise ValueError("Price must be greater than 0")
        return v

    @field_validator("discount_price")
    @classmethod
    def discount_non_negative(cls, v: Optional[Decimal]) -> Optional[Decimal]:
        if v is not None and v < 0:
            raise ValueError("Discount price must be non-negative")
        return v

    @field_validator("sku")
    @classmethod
    def sku_not_empty(cls, v: str) -> str:
        if not v or not v.strip():
            raise ValueError("SKU must not be empty")
        return v.strip().upper()


class ProductUpdate(BaseModel):
    """PUT /api/admin/products/{id} — status is NOT here; use PATCH /{id}/status"""
    name: Optional[str] = None
    description: Optional[str] = None
    category_id: Optional[int] = None
    brand: Optional[str] = None
    price: Optional[Decimal] = None
    discount_price: Optional[Decimal] = None
    tax_percent: Optional[Decimal] = None
    weight: Optional[Decimal] = None
    dimensions: Optional[str] = None
    is_featured: Optional[bool] = None

    @field_validator("price")
    @classmethod
    def price_positive(cls, v: Optional[Decimal]) -> Optional[Decimal]:
        if v is not None and v <= 0:
            raise ValueError("Price must be greater than 0")
        return v


class ProductStatusUpdate(BaseModel):
    status: ProductStatus


class ProductOut(BaseModel):
    id: int
    name: str
    slug: str
    description: Optional[str]
    sku: str
    category_id: Optional[int]
    brand: Optional[str]
    price: Decimal
    discount_price: Optional[Decimal]
    tax_percent: Decimal
    weight: Optional[Decimal]
    dimensions: Optional[str]
    status: str
    is_featured: bool
    created_at: datetime
    updated_at: datetime
    images: List[ProductImageOut] = []
    variants: List[ProductVariantOut] = []

    model_config = {"from_attributes": True}


class ProductListOut(BaseModel):
    id: int
    name: str
    slug: str
    sku: str
    brand: Optional[str]
    category_id: Optional[int]
    price: Decimal
    discount_price: Optional[Decimal]
    status: str
    is_featured: bool
    created_at: datetime

    model_config = {"from_attributes": True}
