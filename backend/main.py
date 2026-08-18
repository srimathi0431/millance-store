from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError
from sqlalchemy.exc import IntegrityError
from dotenv import load_dotenv

# Existing routes (preserved)
from routes.admin import router as legacy_admin_router
from routes.vendor import router as legacy_vendor_router

# Admin panel routes
from app.api.admin.auth.routes import router as auth_router
from app.api.admin.dashboard.routes import router as dashboard_router
from app.api.admin.products.routes import router as products_router
from app.api.admin.categories.routes import router as categories_router
from app.api.admin.inventory.routes import router as inventory_router
from app.api.admin.orders.routes import router as orders_router
from app.api.admin.customers.routes import router as customers_router
from app.api.admin.payments.routes import router as payments_router
from app.api.admin.coupons.routes import router as coupons_router
from app.api.admin.reviews.routes import router as reviews_router
from app.api.admin.reports.routes import router as reports_router

# Customer-facing routes
from app.api.customer.auth       import router as customer_auth_router
from app.api.customer.products   import router as customer_products_router
from app.api.customer.categories import router as customer_categories_router
from app.api.customer.addresses  import router as customer_addresses_router
from app.api.customer.cart       import router as customer_cart_router
from app.api.customer.coupons    import router as customer_coupons_router
from app.api.customer.orders     import router as customer_orders_router
from app.api.customer.reviews    import router as customer_reviews_router
from app.api.customer.wishlist   import router as customer_wishlist_router

# Exception handlers
from app.core.exceptions import (
    AppException, app_exception_handler,
    validation_exception_handler, integrity_error_handler,
    generic_exception_handler,
)

load_dotenv()

app = FastAPI(
    title="Millance Store API",
    description="E-Commerce Backend — Admin Panel + Customer App",
    version="2.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# ---------------------------------------------------------------------------
# Exception handlers
# ---------------------------------------------------------------------------
app.add_exception_handler(AppException, app_exception_handler)
app.add_exception_handler(RequestValidationError, validation_exception_handler)
app.add_exception_handler(IntegrityError, integrity_error_handler)
app.add_exception_handler(Exception, generic_exception_handler)

# ---------------------------------------------------------------------------
# CORS
# ---------------------------------------------------------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------------------------------------------------------
# Legacy routes (preserved)
# ---------------------------------------------------------------------------
app.include_router(legacy_admin_router)
app.include_router(legacy_vendor_router)

# ---------------------------------------------------------------------------
# Admin Panel routes  — /api/admin/...
# ---------------------------------------------------------------------------
app.include_router(auth_router)
app.include_router(dashboard_router)
app.include_router(products_router)
app.include_router(categories_router)
app.include_router(inventory_router)
app.include_router(orders_router)
app.include_router(customers_router)
app.include_router(payments_router)
app.include_router(coupons_router)
app.include_router(reviews_router)
app.include_router(reports_router)

# ---------------------------------------------------------------------------
# Customer App routes — /api/customer/...
# ---------------------------------------------------------------------------
app.include_router(customer_auth_router)
app.include_router(customer_products_router)
app.include_router(customer_categories_router)
app.include_router(customer_addresses_router)
app.include_router(customer_cart_router)
app.include_router(customer_coupons_router)
app.include_router(customer_orders_router)
app.include_router(customer_reviews_router)
app.include_router(customer_wishlist_router)


# ---------------------------------------------------------------------------
# Health
# ---------------------------------------------------------------------------
@app.get("/", tags=["Health"])
def root():
    return {"status": "ok", "message": "Millance Store API v2.0 running on port 8026"}


@app.get("/health", tags=["Health"])
def health():
    return {"status": "healthy"}


# ---------------------------------------------------------------------------
# Entry point
# ---------------------------------------------------------------------------
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8026, reload=True)
