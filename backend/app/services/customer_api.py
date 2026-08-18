"""
Service layer for all customer-facing operations.
"""
import string
import random
from datetime import datetime, timezone, timedelta
from decimal import Decimal
from typing import Optional, List, Tuple

from sqlalchemy.orm import Session
from sqlalchemy import func

from app.core.config import settings
from app.core.exceptions import (
    NotFoundError, BadRequestError, ConflictError, UnauthorizedError
)
from app.core.security import (
    create_token, decode_token, get_token_expires_in
)
from app.models.user import Customer, CartItem, WishlistItem
from app.models.product import Product, ProductImage
from app.models.category import Category
from app.models.order import Order, OrderItem, OrderStatus
from app.models.payment import Payment, PaymentStatus
from app.models.coupon import Coupon, CouponUsage, DiscountType
from app.models.inventory import Inventory, TransactionType
from app.models.review import Review

from app.repositories import customer_auth as auth_repo
from app.repositories import cart as cart_repo
from app.repositories import wishlist as wish_repo
from app.repositories import address as addr_repo
from app.repositories import inventory as inv_repo
from app.schemas.customer_api import (
    SendOTPRequest, VerifyOTPRequest, UpdateProfileRequest,
    AddressCreate, AddressUpdate,
    CartAddRequest, CartUpdateRequest,
    PlaceOrderRequest, ReviewCreateRequest,
)


# ─────────────────────────────────────────────────────────────────────────────
# Token helpers
# ─────────────────────────────────────────────────────────────────────────────

def _issue_tokens(db: Session, customer: Customer) -> dict:
    access  = create_token({"sub": str(customer.id)}, "customer_access",
                           settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    refresh = create_token({"sub": str(customer.id)}, "customer_refresh",
                           settings.REFRESH_TOKEN_EXPIRE_MINUTES)
    exp_at  = datetime.now(timezone.utc) + timedelta(minutes=settings.REFRESH_TOKEN_EXPIRE_MINUTES)
    auth_repo.store_refresh_token(db, customer, refresh, exp_at)
    return {
        "access_token":  access,
        "refresh_token": refresh,
        "token_type":    "bearer",
        "expires_in":    get_token_expires_in(),
    }


# ─────────────────────────────────────────────────────────────────────────────
# Auth
# ─────────────────────────────────────────────────────────────────────────────

def send_otp(db: Session, data: SendOTPRequest) -> dict:
    """
    Find or create customer by phone, generate OTP.
    Returns {"otp": "123456", "is_new": bool} — in production hide the OTP
    and send via SMS. We return it here for development/testing.
    """
    customer = auth_repo.get_by_phone(db, data.phone)
    is_new = False

    if not customer:
        if not data.name:
            raise BadRequestError("Name is required for first-time registration")
        customer = auth_repo.create_customer(db, name=data.name, phone=data.phone)
        is_new = True
    elif customer.is_blocked:
        raise UnauthorizedError("This account has been blocked. Contact support.")

    otp = auth_repo.set_otp(db, customer)
    # TODO: integrate SMS gateway (Twilio / MSG91) here — send `otp` to `data.phone`
    return {"message": "OTP sent", "otp": otp, "is_new": is_new}


def verify_otp(db: Session, data: VerifyOTPRequest) -> dict:
    customer = auth_repo.get_by_phone(db, data.phone)
    if not customer:
        raise NotFoundError("No account found for this phone number")
    if not auth_repo.verify_otp(db, customer, data.otp):
        raise BadRequestError("Invalid or expired OTP")
    return _issue_tokens(db, customer)


def refresh_token(db: Session, refresh_tok: str) -> dict:
    payload = decode_token(refresh_tok)
    if not payload or payload.get("type") != "customer_refresh":
        raise UnauthorizedError("Invalid or expired refresh token")
    customer = auth_repo.get_by_id(db, int(payload["sub"]))
    if not customer:
        raise UnauthorizedError("Account not found")
    if not auth_repo.validate_refresh_token(db, customer, refresh_tok):
        raise UnauthorizedError("Refresh token has been revoked or expired")
    auth_repo.revoke_refresh_token(db, customer)
    return _issue_tokens(db, customer)


def logout(db: Session, customer: Customer) -> None:
    auth_repo.revoke_refresh_token(db, customer)


def get_profile(customer: Customer) -> Customer:
    return customer


def update_profile(db: Session, customer: Customer, data: UpdateProfileRequest) -> Customer:
    return auth_repo.update_profile(db, customer,
                                    name=data.name, email=data.email)


# ─────────────────────────────────────────────────────────────────────────────
# Products (public)
# ─────────────────────────────────────────────────────────────────────────────

def _primary_image(product: Product) -> Optional[str]:
    for img in product.images:
        if img.is_primary:
            return img.image_url
    return product.images[0].image_url if product.images else None


def _rating_stats(db: Session, product_id: int) -> Tuple[Optional[float], int]:
    result = db.query(
        func.avg(Review.rating).label("avg"),
        func.count(Review.id).label("cnt"),
    ).filter(
        Review.product_id == product_id,
        Review.status == "APPROVED",
    ).first()
    avg = round(float(result.avg), 1) if result.avg else None
    return avg, result.cnt or 0


def list_products(
    db: Session,
    page: int = 1,
    page_size: int = 20,
    search: Optional[str] = None,
    category_id: Optional[int] = None,
    brand: Optional[str] = None,
    min_price: Optional[Decimal] = None,
    max_price: Optional[Decimal] = None,
    is_featured: Optional[bool] = None,
    sort_by: str = "created_at",
    sort_order: str = "desc",
) -> Tuple[List[dict], int]:
    from app.models.category import Category as Cat
    q = db.query(Product).filter(Product.status == "ACTIVE")

    if search:
        q = q.filter(
            Product.name.ilike(f"%{search}%") |
            Product.brand.ilike(f"%{search}%") |
            Product.description.ilike(f"%{search}%")
        )
    if category_id:
        # Include products from subcategories too
        sub_ids = [r.id for r in db.query(Cat.id).filter(Cat.parent_id == category_id).all()]
        all_ids = [category_id] + sub_ids
        q = q.filter(Product.category_id.in_(all_ids))
    if brand:
        q = q.filter(Product.brand.ilike(f"%{brand}%"))
    if min_price is not None:
        q = q.filter(Product.price >= min_price)
    if max_price is not None:
        q = q.filter(Product.price <= max_price)
    if is_featured is not None:
        q = q.filter(Product.is_featured == is_featured)

    total = q.count()
    col = getattr(Product, sort_by, Product.created_at)
    q = q.order_by(col.desc() if sort_order == "desc" else col.asc())
    products = q.offset((page - 1) * page_size).limit(page_size).all()

    # Build enriched list dicts
    result = []
    for p in products:
        avg, cnt = _rating_stats(db, p.id)
        cat_name = p.category.name if p.category else None
        result.append({
            "id": p.id, "name": p.name, "slug": p.slug,
            "brand": p.brand, "price": p.price,
            "discount_price": p.discount_price,
            "category_id": p.category_id, "category_name": cat_name,
            "is_featured": p.is_featured,
            "primary_image": _primary_image(p),
            "rating_avg": avg, "review_count": cnt,
        })
    return result, total


def get_product_detail(db: Session, product_id: int) -> dict:
    p = db.query(Product).filter(
        Product.id == product_id, Product.status == "ACTIVE"
    ).first()
    if not p:
        raise NotFoundError(f"Product {product_id} not found")

    inv = inv_repo.get_inventory_by_product(db, p.id)
    in_stock       = inv.available_stock > 0 if inv else False
    avail_stock    = inv.available_stock      if inv else 0
    avg, cnt       = _rating_stats(db, p.id)
    cat_name       = p.category.name if p.category else None

    return {
        "id": p.id, "name": p.name, "slug": p.slug,
        "description": p.description, "sku": p.sku,
        "brand": p.brand, "price": p.price,
        "discount_price": p.discount_price,
        "tax_percent": p.tax_percent,
        "weight": p.weight, "dimensions": p.dimensions,
        "category_id": p.category_id, "category_name": cat_name,
        "is_featured": p.is_featured,
        "images":   p.images,
        "variants": [v for v in p.variants if v.is_active],
        "in_stock":       in_stock,
        "available_stock": avail_stock,
        "rating_avg":  avg,
        "review_count": cnt,
    }


def get_product_by_slug(db: Session, slug: str) -> dict:
    p = db.query(Product).filter(
        Product.slug == slug, Product.status == "ACTIVE"
    ).first()
    if not p:
        raise NotFoundError(f"Product '{slug}' not found")
    return get_product_detail(db, p.id)


# ─────────────────────────────────────────────────────────────────────────────
# Categories (public)
# ─────────────────────────────────────────────────────────────────────────────

def list_categories(db: Session) -> List[dict]:
    """Return active categories as a tree (root → children)."""
    all_cats = db.query(Category).filter(Category.is_active == True)\
                 .order_by(Category.sort_order, Category.name).all()
    cat_map = {c.id: {
        "id": c.id, "name": c.name, "slug": c.slug,
        "description": c.description, "image_url": c.image_url,
        "parent_id": c.parent_id, "sort_order": c.sort_order,
        "children": [],
    } for c in all_cats}

    roots = []
    for node in cat_map.values():
        if node["parent_id"] and node["parent_id"] in cat_map:
            cat_map[node["parent_id"]]["children"].append(node)
        elif node["parent_id"] is None:
            roots.append(node)
    return roots


# ─────────────────────────────────────────────────────────────────────────────
# Addresses
# ─────────────────────────────────────────────────────────────────────────────

def list_addresses(db: Session, customer: Customer):
    return addr_repo.get_all(db, customer.id)


def add_address(db: Session, customer: Customer, data: AddressCreate):
    return addr_repo.create(db, customer.id, **data.model_dump())


def update_address(db: Session, customer: Customer,
                   address_id: int, data: AddressUpdate):
    addr = addr_repo.get_by_id(db, address_id, customer.id)
    if not addr:
        raise NotFoundError("Address not found")
    return addr_repo.update(db, addr, **data.model_dump(exclude_none=True))


def set_default_address(db: Session, customer: Customer, address_id: int):
    addr = addr_repo.get_by_id(db, address_id, customer.id)
    if not addr:
        raise NotFoundError("Address not found")
    addr_repo.set_default(db, customer.id, address_id)


def delete_address(db: Session, customer: Customer, address_id: int):
    addr = addr_repo.get_by_id(db, address_id, customer.id)
    if not addr:
        raise NotFoundError("Address not found")
    addr_repo.delete(db, addr)


# ─────────────────────────────────────────────────────────────────────────────
# Cart
# ─────────────────────────────────────────────────────────────────────────────

def _build_cart_item_out(item: CartItem, db: Session) -> dict:
    p   = item.product
    inv = inv_repo.get_inventory_by_product(db, p.id)
    avail = inv.available_stock if inv else 0
    price = item.variant.price if item.variant else p.discount_price or p.price
    return {
        "id":           item.id,
        "product_id":   p.id,
        "product_name": p.name,
        "product_slug": p.slug,
        "variant_id":   item.variant_id,
        "variant_name": item.variant.name if item.variant else None,
        "quantity":     item.quantity,
        "unit_price":   price,
        "subtotal":     price * item.quantity,
        "primary_image": _primary_image(p),
        "in_stock":     avail > 0,
        "available_stock": avail,
    }


def get_cart(db: Session, customer: Customer) -> dict:
    items     = cart_repo.get_cart(db, customer.id)
    item_dicts = [_build_cart_item_out(i, db) for i in items]
    subtotal  = sum(d["subtotal"] for d in item_dicts)
    return {
        "items":      item_dicts,
        "item_count": len(item_dicts),
        "total_qty":  sum(d["quantity"] for d in item_dicts),
        "subtotal":   subtotal,
        "total":      subtotal,
    }


def add_to_cart(db: Session, customer: Customer, data: CartAddRequest) -> dict:
    p = db.query(Product).filter(
        Product.id == data.product_id, Product.status == "ACTIVE"
    ).first()
    if not p:
        raise NotFoundError("Product not found or unavailable")

    inv = inv_repo.get_inventory_by_product(db, data.product_id)
    if not inv or inv.available_stock < data.quantity:
        raise BadRequestError(f"Insufficient stock. Available: {inv.available_stock if inv else 0}")

    cart_repo.upsert_cart_item(db, customer.id, data.product_id,
                               data.quantity, data.variant_id)
    return get_cart(db, customer)


def update_cart_item(db: Session, customer: Customer,
                     item_id: int, data: CartUpdateRequest) -> dict:
    item = cart_repo.get_cart_item_by_id(db, item_id, customer.id)
    if not item:
        raise NotFoundError("Cart item not found")
    inv = inv_repo.get_inventory_by_product(db, item.product_id)
    if inv and inv.available_stock < data.quantity:
        raise BadRequestError(f"Only {inv.available_stock} units available")
    item.quantity = data.quantity
    db.commit()
    return get_cart(db, customer)


def remove_from_cart(db: Session, customer: Customer, item_id: int) -> dict:
    item = cart_repo.get_cart_item_by_id(db, item_id, customer.id)
    if not item:
        raise NotFoundError("Cart item not found")
    cart_repo.remove_cart_item(db, item)
    return get_cart(db, customer)


def clear_cart_svc(db: Session, customer: Customer) -> None:
    cart_repo.clear_cart(db, customer.id)


# ─────────────────────────────────────────────────────────────────────────────
# Coupon validation
# ─────────────────────────────────────────────────────────────────────────────

def _calc_discount(coupon: Coupon, cart_total: Decimal) -> Decimal:
    if coupon.discount_type == DiscountType.PERCENTAGE:
        discount = cart_total * (Decimal(str(coupon.discount_value)) / 100)
        if coupon.max_discount_amount:
            discount = min(discount, Decimal(str(coupon.max_discount_amount)))
    else:
        discount = Decimal(str(coupon.discount_value))
    return min(discount, cart_total)


def validate_coupon(db: Session, customer: Customer,
                    code: str, cart_total: Decimal) -> dict:
    coupon = db.query(Coupon).filter(
        Coupon.code == code.upper().strip(),
        Coupon.is_active == True,
    ).first()

    now = datetime.now(timezone.utc)

    if not coupon:
        return {"valid": False, "code": code, "message": "Invalid coupon code",
                "discount_type": None, "discount_value": None,
                "discount_amount": None, "final_total": None}

    if coupon.starts_at and now < coupon.starts_at.replace(tzinfo=timezone.utc):
        return {"valid": False, "code": code, "message": "Coupon is not active yet",
                "discount_type": None, "discount_value": None,
                "discount_amount": None, "final_total": None}

    if coupon.expires_at and now > coupon.expires_at.replace(tzinfo=timezone.utc):
        return {"valid": False, "code": code, "message": "Coupon has expired",
                "discount_type": None, "discount_value": None,
                "discount_amount": None, "final_total": None}

    if coupon.usage_limit and coupon.used_count >= coupon.usage_limit:
        return {"valid": False, "code": code, "message": "Coupon usage limit reached",
                "discount_type": None, "discount_value": None,
                "discount_amount": None, "final_total": None}

    if cart_total < Decimal(str(coupon.min_order_amount)):
        return {"valid": False, "code": code,
                "message": f"Minimum order amount ₹{coupon.min_order_amount} required",
                "discount_type": None, "discount_value": None,
                "discount_amount": None, "final_total": None}

    # Per-user limit
    user_uses = db.query(func.count(CouponUsage.id)).filter(
        CouponUsage.coupon_id   == coupon.id,
        CouponUsage.customer_id == customer.id,
    ).scalar() or 0
    if user_uses >= coupon.per_user_limit:
        return {"valid": False, "code": code,
                "message": "You have already used this coupon",
                "discount_type": None, "discount_value": None,
                "discount_amount": None, "final_total": None}

    discount = _calc_discount(coupon, cart_total)
    return {
        "valid":           True,
        "code":            coupon.code,
        "discount_type":   coupon.discount_type,
        "discount_value":  coupon.discount_value,
        "discount_amount": discount,
        "final_total":     cart_total - discount,
        "message":         f"Coupon applied! You save ₹{discount:.0f}",
    }


# ─────────────────────────────────────────────────────────────────────────────
# Order placement
# ─────────────────────────────────────────────────────────────────────────────

def _generate_order_number() -> str:
    suffix = "".join(random.choices(string.digits, k=8))
    return f"MS{suffix}"


def place_order(db: Session, customer: Customer, data: PlaceOrderRequest) -> Order:
    # 1. Validate address
    addr = addr_repo.get_by_id(db, data.address_id, customer.id)
    if not addr:
        raise NotFoundError("Shipping address not found")

    # 2. Load cart
    cart_items = cart_repo.get_cart(db, customer.id)
    if not cart_items:
        raise BadRequestError("Cart is empty")

    # 3. Calculate totals + check stock
    subtotal = Decimal("0")
    line_items = []
    for ci in cart_items:
        p   = ci.product
        inv = inv_repo.get_inventory_by_product(db, p.id)
        if not inv or inv.available_stock < ci.quantity:
            raise BadRequestError(
                f"'{p.name}' has only {inv.available_stock if inv else 0} units in stock"
            )
        price = ci.variant.price if ci.variant else p.discount_price or p.price
        line_total = price * ci.quantity
        subtotal  += line_total
        line_items.append((ci, p, price, line_total))

    # 4. Apply coupon
    discount_amount = Decimal("0")
    coupon = None
    if data.coupon_code:
        result = validate_coupon(db, customer, data.coupon_code, subtotal)
        if not result["valid"]:
            raise BadRequestError(result["message"])
        discount_amount = result["discount_amount"]
        coupon = db.query(Coupon).filter(Coupon.code == data.coupon_code.upper().strip()).first()

    tax_amount      = Decimal("0")
    shipping_amount = Decimal("0")
    total_amount    = subtotal - discount_amount + tax_amount + shipping_amount

    # 5. Build shipping address string
    shipping_addr = (
        f"{addr.address_line1}"
        + (f", {addr.address_line2}" if addr.address_line2 else "")
        + f", {addr.city}, {addr.state} {addr.pincode}, {addr.country}"
    )

    # 6. Create order
    order = Order(
        order_number    = _generate_order_number(),
        customer_id     = customer.id,
        status          = OrderStatus.PENDING,
        subtotal        = subtotal,
        discount_amount = discount_amount,
        tax_amount      = tax_amount,
        shipping_amount = shipping_amount,
        total_amount    = total_amount,
        coupon_id       = coupon.id if coupon else None,
        shipping_name   = addr.name,
        shipping_phone  = addr.phone,
        shipping_address = shipping_addr,
        notes           = data.notes,
    )
    db.add(order)
    db.flush()  # get order.id

    # 7. Create order items + deduct inventory
    for ci, p, price, line_total in line_items:
        oi = OrderItem(
            order_id     = order.id,
            product_id   = p.id,
            product_name = p.name,
            product_sku  = p.sku,
            variant_id   = ci.variant_id,
            quantity     = ci.quantity,
            unit_price   = price,
            discount_price = p.discount_price,
            tax_percent  = p.tax_percent,
            total_price  = line_total,
        )
        db.add(oi)
        inv = inv_repo.get_inventory_by_product(db, p.id)
        inv_repo.adjust_stock(
            db, inv, TransactionType.ORDER_DEDUCTED,
            ci.quantity,
            f"Order #{order.order_number}",
            admin_id=None,
            reference_id=str(order.id),
        )

    # 8. Record coupon usage
    if coupon:
        usage = CouponUsage(
            coupon_id       = coupon.id,
            customer_id     = customer.id,
            order_id        = order.id,
            discount_applied = discount_amount,
        )
        db.add(usage)
        coupon.used_count += 1

    # 9. Create payment record (PENDING)
    payment = Payment(
        order_id       = order.id,
        customer_id    = customer.id,
        amount         = total_amount,
        payment_method = data.payment_method,
        status         = PaymentStatus.PENDING,
    )
    db.add(payment)

    # 10. Write first status history entry
    from app.models.order import OrderStatusHistory
    db.add(OrderStatusHistory(
        order_id    = order.id,
        from_status = None,
        to_status   = OrderStatus.PENDING,
        notes       = "Order placed by customer",
    ))

    # 11. Clear cart
    cart_repo.clear_cart(db, customer.id)

    db.commit()
    db.refresh(order)
    return order


# ─────────────────────────────────────────────────────────────────────────────
# Customer orders
# ─────────────────────────────────────────────────────────────────────────────

def list_customer_orders(
    db: Session, customer: Customer,
    page: int = 1, page_size: int = 10,
    status: Optional[str] = None,
) -> Tuple[List[Order], int]:
    q = db.query(Order).filter(Order.customer_id == customer.id)
    if status:
        q = q.filter(Order.status == status)
    total = q.count()
    orders = q.order_by(Order.created_at.desc())\
               .offset((page - 1) * page_size).limit(page_size).all()
    return orders, total


def get_customer_order(db: Session, customer: Customer, order_id: int) -> Order:
    from sqlalchemy.orm import joinedload as jl
    order = (
        db.query(Order)
        .options(jl(Order.items), jl(Order.history))
        .filter(Order.id == order_id, Order.customer_id == customer.id)
        .first()
    )
    if not order:
        raise NotFoundError("Order not found")
    return order


def request_return(db: Session, customer: Customer,
                   order_id: int, reason: str) -> Order:
    order = get_customer_order(db, customer, order_id)
    if order.status != OrderStatus.DELIVERED:
        raise BadRequestError("Only delivered orders can be returned")
    from app.models.order import OrderStatusHistory
    order.status        = OrderStatus.RETURN_REQUESTED
    order.return_reason = reason
    db.add(OrderStatusHistory(
        order_id    = order.id,
        from_status = OrderStatus.DELIVERED,
        to_status   = OrderStatus.RETURN_REQUESTED,
        notes       = reason,
    ))
    db.commit()
    db.refresh(order)
    return order


# ─────────────────────────────────────────────────────────────────────────────
# Reviews
# ─────────────────────────────────────────────────────────────────────────────

def list_product_reviews(
    db: Session, product_id: int,
    page: int = 1, page_size: int = 10,
) -> Tuple[List[dict], int]:
    p = db.query(Product).filter(Product.id == product_id).first()
    if not p:
        raise NotFoundError("Product not found")

    q = db.query(Review).filter(
        Review.product_id == product_id,
        Review.status == "APPROVED",
    )
    total   = q.count()
    reviews = q.order_by(Review.created_at.desc())\
                .offset((page - 1) * page_size).limit(page_size).all()

    result = []
    for r in reviews:
        cust = auth_repo.get_by_id(db, r.customer_id) if r.customer_id else None
        result.append({
            "id": r.id, "rating": r.rating,
            "title": r.title, "body": r.body,
            "customer_name": cust.name if cust else "Anonymous",
            "is_verified_purchase": r.is_verified_purchase,
            "created_at": r.created_at,
        })
    return result, total


def submit_review(db: Session, customer: Customer,
                  data: ReviewCreateRequest) -> Review:
    # Check product exists
    p = db.query(Product).filter(Product.id == data.product_id).first()
    if not p:
        raise NotFoundError("Product not found")

    # One review per customer per product
    existing = db.query(Review).filter(
        Review.product_id  == data.product_id,
        Review.customer_id == customer.id,
    ).first()
    if existing:
        raise ConflictError("You have already reviewed this product")

    # Verified purchase check
    delivered = db.query(Order).join(OrderItem).filter(
        Order.customer_id      == customer.id,
        Order.status           == OrderStatus.DELIVERED,
        OrderItem.product_id   == data.product_id,
    ).first()

    review = Review(
        product_id          = data.product_id,
        customer_id         = customer.id,
        rating              = data.rating,
        title               = data.title,
        body                = data.body,
        status              = "PENDING",   # admin must approve
        is_verified_purchase = bool(delivered),
    )
    db.add(review)
    db.commit()
    db.refresh(review)
    return review


# ─────────────────────────────────────────────────────────────────────────────
# Wishlist
# ─────────────────────────────────────────────────────────────────────────────

def get_wishlist(db: Session, customer: Customer) -> List[dict]:
    items = wish_repo.get_wishlist(db, customer.id)
    result = []
    for wi in items:
        p   = wi.product
        inv = inv_repo.get_inventory_by_product(db, p.id)
        result.append({
            "id":            wi.id,
            "product_id":    p.id,
            "product_name":  p.name,
            "product_slug":  p.slug,
            "price":         p.price,
            "discount_price": p.discount_price,
            "primary_image": _primary_image(p),
            "in_stock":      inv.available_stock > 0 if inv else False,
            "added_at":      wi.added_at,
        })
    return result


def add_to_wishlist(db: Session, customer: Customer, product_id: int) -> List[dict]:
    p = db.query(Product).filter(Product.id == product_id).first()
    if not p:
        raise NotFoundError("Product not found")
    existing = wish_repo.get_item(db, customer.id, product_id)
    if not existing:
        wish_repo.add_item(db, customer.id, product_id)
    return get_wishlist(db, customer)


def remove_from_wishlist(db: Session, customer: Customer,
                         product_id: int) -> List[dict]:
    item = wish_repo.get_item(db, customer.id, product_id)
    if item:
        wish_repo.remove_item(db, item)
    return get_wishlist(db, customer)
