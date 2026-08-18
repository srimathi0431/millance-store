from pydantic import BaseModel
from typing import List, Optional
from decimal import Decimal


class RevenueStats(BaseModel):
    total_revenue: Decimal
    today_revenue: Decimal
    weekly_revenue: Decimal
    monthly_revenue: Decimal


class OrderStats(BaseModel):
    total_orders: int
    today_orders: int
    pending_orders: int
    confirmed_orders: int
    processing_orders: int
    shipped_orders: int
    delivered_orders: int
    cancelled_orders: int


class ProductStats(BaseModel):
    total_products: int
    active_products: int
    low_stock_products: int
    out_of_stock_products: int


class CustomerStats(BaseModel):
    total_customers: int
    active_customers: int
    new_today: int


class SalesDataPoint(BaseModel):
    label: str
    revenue: Decimal
    orders: int


class TopProduct(BaseModel):
    product_id: int
    product_name: str
    total_sold: int
    total_revenue: Decimal


class RecentOrder(BaseModel):
    id: int
    order_number: str
    customer_id: Optional[int]
    status: str
    total_amount: Decimal
    created_at: str


class DashboardResponse(BaseModel):
    revenue: RevenueStats
    orders: OrderStats
    products: ProductStats
    customers: CustomerStats
    recent_orders: List[RecentOrder]
    top_products: List[TopProduct]
