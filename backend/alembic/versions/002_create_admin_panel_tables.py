"""create admin panel tables

Revision ID: 002
Revises: 001
Create Date: 2026-08-12 01:00:00.000000

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa

revision: str = "002"
down_revision: Union[str, None] = "001"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    conn = op.get_bind()

    # ------------------------------------------------------------------ enums
    conn.execute(sa.text("""
        DO $$ BEGIN
            CREATE TYPE adminrole AS ENUM ('SUPER_ADMIN','ADMIN','MANAGER','STAFF');
        EXCEPTION WHEN duplicate_object THEN NULL; END $$;
    """))

    # ------------------------------------------------------------------ admins
    op.create_table(
        "admins",
        sa.Column("id", sa.Integer(), autoincrement=True, nullable=False),
        sa.Column("name", sa.String(255), nullable=False),
        sa.Column("email", sa.String(255), nullable=False),
        sa.Column("hashed_password", sa.String(255), nullable=False),
        sa.Column("role", sa.Text(), nullable=False, server_default="STAFF"),
        sa.Column("permissions", sa.JSON(), nullable=False, server_default="[]"),
        sa.Column("is_active", sa.Boolean(), nullable=False, server_default=sa.text("true")),
        sa.Column("last_login_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("password_reset_token", sa.String(255), nullable=True),
        sa.Column("password_reset_expires", sa.DateTime(timezone=True), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_admins_id", "admins", ["id"])
    op.create_index("ix_admins_email", "admins", ["email"], unique=True)
    # Drop default, cast to enum, restore default
    conn.execute(sa.text("ALTER TABLE admins ALTER COLUMN role DROP DEFAULT;"))
    conn.execute(sa.text("ALTER TABLE admins ALTER COLUMN role TYPE adminrole USING role::adminrole;"))
    conn.execute(sa.text("ALTER TABLE admins ALTER COLUMN role SET DEFAULT 'STAFF';"))

    # ------------------------------------------------------------------ admin_refresh_tokens
    op.create_table(
        "admin_refresh_tokens",
        sa.Column("id", sa.Integer(), autoincrement=True, nullable=False),
        sa.Column("admin_id", sa.Integer(), sa.ForeignKey("admins.id", ondelete="CASCADE"), nullable=False),
        sa.Column("token_hash", sa.String(255), nullable=False),
        sa.Column("expires_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("is_revoked", sa.Boolean(), nullable=False, server_default=sa.text("false")),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_admin_refresh_tokens_admin_id", "admin_refresh_tokens", ["admin_id"])
    op.create_index("ix_admin_refresh_tokens_token_hash", "admin_refresh_tokens", ["token_hash"], unique=True)

    # ------------------------------------------------------------------ categories
    op.create_table(
        "categories",
        sa.Column("id", sa.Integer(), autoincrement=True, nullable=False),
        sa.Column("name", sa.String(255), nullable=False),
        sa.Column("slug", sa.String(255), nullable=False),
        sa.Column("description", sa.Text(), nullable=True),
        sa.Column("image_url", sa.String(1000), nullable=True),
        sa.Column("parent_id", sa.Integer(), sa.ForeignKey("categories.id", ondelete="SET NULL"), nullable=True),
        sa.Column("is_active", sa.Boolean(), nullable=False, server_default=sa.text("true")),
        sa.Column("sort_order", sa.Integer(), nullable=False, server_default=sa.text("0")),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_categories_id", "categories", ["id"])
    op.create_index("ix_categories_name", "categories", ["name"], unique=True)
    op.create_index("ix_categories_slug", "categories", ["slug"], unique=True)
    op.create_index("ix_categories_parent_id", "categories", ["parent_id"])

    # ------------------------------------------------------------------ customers
    op.create_table(
        "customers",
        sa.Column("id", sa.Integer(), autoincrement=True, nullable=False),
        sa.Column("name", sa.String(255), nullable=False),
        sa.Column("email", sa.String(255), nullable=False),
        sa.Column("phone", sa.String(20), nullable=True),
        sa.Column("hashed_password", sa.String(255), nullable=True),
        sa.Column("is_active", sa.Boolean(), nullable=False, server_default=sa.text("true")),
        sa.Column("is_blocked", sa.Boolean(), nullable=False, server_default=sa.text("false")),
        sa.Column("email_verified", sa.Boolean(), nullable=False, server_default=sa.text("false")),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_customers_id", "customers", ["id"])
    op.create_index("ix_customers_email", "customers", ["email"], unique=True)

    # ------------------------------------------------------------------ customer_addresses
    op.create_table(
        "customer_addresses",
        sa.Column("id", sa.Integer(), autoincrement=True, nullable=False),
        sa.Column("customer_id", sa.Integer(), sa.ForeignKey("customers.id", ondelete="CASCADE"), nullable=False),
        sa.Column("name", sa.String(255), nullable=False),
        sa.Column("phone", sa.String(20), nullable=False),
        sa.Column("address_line1", sa.String(500), nullable=False),
        sa.Column("address_line2", sa.String(500), nullable=True),
        sa.Column("city", sa.String(100), nullable=False),
        sa.Column("state", sa.String(100), nullable=False),
        sa.Column("country", sa.String(100), nullable=False, server_default="India"),
        sa.Column("pincode", sa.String(20), nullable=False),
        sa.Column("is_default", sa.Boolean(), nullable=False, server_default=sa.text("false")),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_customer_addresses_customer_id", "customer_addresses", ["customer_id"])

    # ------------------------------------------------------------------ products
    op.create_table(
        "products",
        sa.Column("id", sa.Integer(), autoincrement=True, nullable=False),
        sa.Column("name", sa.String(500), nullable=False),
        sa.Column("slug", sa.String(500), nullable=False),
        sa.Column("description", sa.Text(), nullable=True),
        sa.Column("sku", sa.String(100), nullable=False),
        sa.Column("category_id", sa.Integer(), sa.ForeignKey("categories.id", ondelete="SET NULL"), nullable=True),
        sa.Column("brand", sa.String(255), nullable=True),
        sa.Column("price", sa.Numeric(12, 2), nullable=False),
        sa.Column("discount_price", sa.Numeric(12, 2), nullable=True),
        sa.Column("tax_percent", sa.Numeric(5, 2), nullable=False, server_default=sa.text("0")),
        sa.Column("weight", sa.Numeric(8, 3), nullable=True),
        sa.Column("dimensions", sa.String(100), nullable=True),
        sa.Column("status", sa.String(20), nullable=False, server_default="DRAFT"),
        sa.Column("is_featured", sa.Boolean(), nullable=False, server_default=sa.text("false")),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_products_id", "products", ["id"])
    op.create_index("ix_products_name", "products", ["name"])
    op.create_index("ix_products_sku", "products", ["sku"], unique=True)
    op.create_index("ix_products_slug", "products", ["slug"], unique=True)
    op.create_index("ix_products_category_id", "products", ["category_id"])

    # ------------------------------------------------------------------ product_images
    op.create_table(
        "product_images",
        sa.Column("id", sa.Integer(), autoincrement=True, nullable=False),
        sa.Column("product_id", sa.Integer(), sa.ForeignKey("products.id", ondelete="CASCADE"), nullable=False),
        sa.Column("image_url", sa.String(1000), nullable=False),
        sa.Column("alt_text", sa.String(255), nullable=True),
        sa.Column("is_primary", sa.Boolean(), nullable=False, server_default=sa.text("false")),
        sa.Column("sort_order", sa.Integer(), nullable=False, server_default=sa.text("0")),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_product_images_product_id", "product_images", ["product_id"])

    # ------------------------------------------------------------------ product_variants
    op.create_table(
        "product_variants",
        sa.Column("id", sa.Integer(), autoincrement=True, nullable=False),
        sa.Column("product_id", sa.Integer(), sa.ForeignKey("products.id", ondelete="CASCADE"), nullable=False),
        sa.Column("name", sa.String(255), nullable=False),
        sa.Column("sku", sa.String(100), nullable=False),
        sa.Column("price", sa.Numeric(12, 2), nullable=False),
        sa.Column("stock", sa.Integer(), nullable=False, server_default=sa.text("0")),
        sa.Column("attributes", sa.Text(), nullable=True),
        sa.Column("is_active", sa.Boolean(), nullable=False, server_default=sa.text("true")),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_product_variants_product_id", "product_variants", ["product_id"])
    op.create_index("ix_product_variants_sku", "product_variants", ["sku"], unique=True)

    # ------------------------------------------------------------------ inventory
    op.create_table(
        "inventory",
        sa.Column("id", sa.Integer(), autoincrement=True, nullable=False),
        sa.Column("product_id", sa.Integer(), sa.ForeignKey("products.id", ondelete="CASCADE"), nullable=False),
        sa.Column("total_stock", sa.Integer(), nullable=False, server_default=sa.text("0")),
        sa.Column("reserved_stock", sa.Integer(), nullable=False, server_default=sa.text("0")),
        sa.Column("low_stock_threshold", sa.Integer(), nullable=False, server_default=sa.text("10")),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("product_id"),
    )
    op.create_index("ix_inventory_product_id", "inventory", ["product_id"])

    # ------------------------------------------------------------------ inventory_transactions
    op.create_table(
        "inventory_transactions",
        sa.Column("id", sa.Integer(), autoincrement=True, nullable=False),
        sa.Column("inventory_id", sa.Integer(), sa.ForeignKey("inventory.id", ondelete="CASCADE"), nullable=False),
        sa.Column("transaction_type", sa.String(30), nullable=False),
        sa.Column("quantity", sa.Integer(), nullable=False),
        sa.Column("previous_stock", sa.Integer(), nullable=False),
        sa.Column("new_stock", sa.Integer(), nullable=False),
        sa.Column("reference_id", sa.String(100), nullable=True),
        sa.Column("notes", sa.Text(), nullable=True),
        sa.Column("admin_id", sa.Integer(), sa.ForeignKey("admins.id", ondelete="SET NULL"), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_inventory_transactions_inventory_id", "inventory_transactions", ["inventory_id"])

    # ------------------------------------------------------------------ coupons
    op.create_table(
        "coupons",
        sa.Column("id", sa.Integer(), autoincrement=True, nullable=False),
        sa.Column("code", sa.String(100), nullable=False),
        sa.Column("description", sa.Text(), nullable=True),
        sa.Column("discount_type", sa.String(20), nullable=False, server_default="PERCENTAGE"),
        sa.Column("discount_value", sa.Numeric(10, 2), nullable=False),
        sa.Column("min_order_amount", sa.Numeric(12, 2), nullable=False, server_default=sa.text("0")),
        sa.Column("max_discount_amount", sa.Numeric(12, 2), nullable=True),
        sa.Column("usage_limit", sa.Integer(), nullable=True),
        sa.Column("per_user_limit", sa.Integer(), nullable=False, server_default=sa.text("1")),
        sa.Column("used_count", sa.Integer(), nullable=False, server_default=sa.text("0")),
        sa.Column("is_active", sa.Boolean(), nullable=False, server_default=sa.text("true")),
        sa.Column("starts_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("expires_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_coupons_id", "coupons", ["id"])
    op.create_index("ix_coupons_code", "coupons", ["code"], unique=True)

    # ------------------------------------------------------------------ orders
    op.create_table(
        "orders",
        sa.Column("id", sa.Integer(), autoincrement=True, nullable=False),
        sa.Column("order_number", sa.String(50), nullable=False),
        sa.Column("customer_id", sa.Integer(), sa.ForeignKey("customers.id", ondelete="SET NULL"), nullable=True),
        sa.Column("status", sa.String(30), nullable=False, server_default="PENDING"),
        sa.Column("subtotal", sa.Numeric(12, 2), nullable=False),
        sa.Column("discount_amount", sa.Numeric(12, 2), nullable=False, server_default=sa.text("0")),
        sa.Column("tax_amount", sa.Numeric(12, 2), nullable=False, server_default=sa.text("0")),
        sa.Column("shipping_amount", sa.Numeric(12, 2), nullable=False, server_default=sa.text("0")),
        sa.Column("total_amount", sa.Numeric(12, 2), nullable=False),
        sa.Column("coupon_id", sa.Integer(), sa.ForeignKey("coupons.id", ondelete="SET NULL"), nullable=True),
        sa.Column("shipping_name", sa.String(255), nullable=True),
        sa.Column("shipping_phone", sa.String(20), nullable=True),
        sa.Column("shipping_address", sa.Text(), nullable=True),
        sa.Column("notes", sa.Text(), nullable=True),
        sa.Column("cancelled_reason", sa.Text(), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_orders_id", "orders", ["id"])
    op.create_index("ix_orders_order_number", "orders", ["order_number"], unique=True)
    op.create_index("ix_orders_customer_id", "orders", ["customer_id"])
    op.create_index("ix_orders_status", "orders", ["status"])

    # ------------------------------------------------------------------ order_items
    op.create_table(
        "order_items",
        sa.Column("id", sa.Integer(), autoincrement=True, nullable=False),
        sa.Column("order_id", sa.Integer(), sa.ForeignKey("orders.id", ondelete="CASCADE"), nullable=False),
        sa.Column("product_id", sa.Integer(), sa.ForeignKey("products.id", ondelete="SET NULL"), nullable=True),
        sa.Column("product_name", sa.String(500), nullable=False),
        sa.Column("product_sku", sa.String(100), nullable=False),
        sa.Column("variant_id", sa.Integer(), sa.ForeignKey("product_variants.id", ondelete="SET NULL"), nullable=True),
        sa.Column("quantity", sa.Integer(), nullable=False),
        sa.Column("unit_price", sa.Numeric(12, 2), nullable=False),
        sa.Column("discount_price", sa.Numeric(12, 2), nullable=True),
        sa.Column("tax_percent", sa.Numeric(5, 2), nullable=False, server_default=sa.text("0")),
        sa.Column("total_price", sa.Numeric(12, 2), nullable=False),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_order_items_order_id", "order_items", ["order_id"])

    # ------------------------------------------------------------------ payments
    op.create_table(
        "payments",
        sa.Column("id", sa.Integer(), autoincrement=True, nullable=False),
        sa.Column("order_id", sa.Integer(), sa.ForeignKey("orders.id", ondelete="CASCADE"), nullable=False),
        sa.Column("customer_id", sa.Integer(), sa.ForeignKey("customers.id", ondelete="SET NULL"), nullable=True),
        sa.Column("amount", sa.Numeric(12, 2), nullable=False),
        sa.Column("currency", sa.String(10), nullable=False, server_default="INR"),
        sa.Column("payment_method", sa.String(50), nullable=True),
        sa.Column("gateway", sa.String(50), nullable=True),
        sa.Column("transaction_id", sa.String(255), nullable=True),
        sa.Column("gateway_response", sa.Text(), nullable=True),
        sa.Column("status", sa.String(30), nullable=False, server_default="PENDING"),
        sa.Column("paid_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("order_id"),
    )
    op.create_index("ix_payments_id", "payments", ["id"])
    op.create_index("ix_payments_order_id", "payments", ["order_id"])
    op.create_index("ix_payments_transaction_id", "payments", ["transaction_id"])

    # ------------------------------------------------------------------ refunds
    op.create_table(
        "refunds",
        sa.Column("id", sa.Integer(), autoincrement=True, nullable=False),
        sa.Column("order_id", sa.Integer(), sa.ForeignKey("orders.id", ondelete="CASCADE"), nullable=False),
        sa.Column("payment_id", sa.Integer(), sa.ForeignKey("payments.id", ondelete="CASCADE"), nullable=False),
        sa.Column("admin_id", sa.Integer(), sa.ForeignKey("admins.id", ondelete="SET NULL"), nullable=True),
        sa.Column("amount", sa.Numeric(12, 2), nullable=False),
        sa.Column("reason", sa.Text(), nullable=True),
        sa.Column("status", sa.String(30), nullable=False, server_default="PENDING"),
        sa.Column("gateway_refund_id", sa.String(255), nullable=True),
        sa.Column("processed_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_refunds_order_id", "refunds", ["order_id"])
    op.create_index("ix_refunds_payment_id", "refunds", ["payment_id"])

    # ------------------------------------------------------------------ coupon_usage
    op.create_table(
        "coupon_usage",
        sa.Column("id", sa.Integer(), autoincrement=True, nullable=False),
        sa.Column("coupon_id", sa.Integer(), sa.ForeignKey("coupons.id", ondelete="CASCADE"), nullable=False),
        sa.Column("customer_id", sa.Integer(), sa.ForeignKey("customers.id", ondelete="CASCADE"), nullable=False),
        sa.Column("order_id", sa.Integer(), sa.ForeignKey("orders.id", ondelete="CASCADE"), nullable=False),
        sa.Column("discount_applied", sa.Numeric(12, 2), nullable=False),
        sa.Column("used_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_coupon_usage_coupon_id", "coupon_usage", ["coupon_id"])
    op.create_index("ix_coupon_usage_customer_id", "coupon_usage", ["customer_id"])

    # ------------------------------------------------------------------ reviews
    op.create_table(
        "reviews",
        sa.Column("id", sa.Integer(), autoincrement=True, nullable=False),
        sa.Column("product_id", sa.Integer(), sa.ForeignKey("products.id", ondelete="CASCADE"), nullable=False),
        sa.Column("customer_id", sa.Integer(), sa.ForeignKey("customers.id", ondelete="CASCADE"), nullable=False),
        sa.Column("rating", sa.Integer(), nullable=False),
        sa.Column("title", sa.String(255), nullable=True),
        sa.Column("body", sa.Text(), nullable=True),
        sa.Column("status", sa.String(20), nullable=False, server_default="PENDING"),
        sa.Column("is_verified_purchase", sa.Boolean(), nullable=False, server_default=sa.text("false")),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_reviews_product_id", "reviews", ["product_id"])
    op.create_index("ix_reviews_customer_id", "reviews", ["customer_id"])

    # ------------------------------------------------------------------ audit_logs
    op.create_table(
        "audit_logs",
        sa.Column("id", sa.Integer(), autoincrement=True, nullable=False),
        sa.Column("admin_id", sa.Integer(), sa.ForeignKey("admins.id", ondelete="SET NULL"), nullable=True),
        sa.Column("action", sa.String(100), nullable=False),
        sa.Column("entity_type", sa.String(100), nullable=True),
        sa.Column("entity_id", sa.String(100), nullable=True),
        sa.Column("old_value", sa.Text(), nullable=True),
        sa.Column("new_value", sa.Text(), nullable=True),
        sa.Column("ip_address", sa.String(45), nullable=True),
        sa.Column("user_agent", sa.String(500), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_audit_logs_admin_id", "audit_logs", ["admin_id"])
    op.create_index("ix_audit_logs_action", "audit_logs", ["action"])


def downgrade() -> None:
    op.drop_table("audit_logs")
    op.drop_table("coupon_usage")
    op.drop_table("reviews")
    op.drop_table("refunds")
    op.drop_table("payments")
    op.drop_table("order_items")
    op.drop_table("orders")
    op.drop_table("inventory_transactions")
    op.drop_table("inventory")
    op.drop_table("product_variants")
    op.drop_table("product_images")
    op.drop_table("products")
    op.drop_table("customer_addresses")
    op.drop_table("customers")
    op.drop_table("categories")
    op.drop_table("coupons")
    op.drop_table("admin_refresh_tokens")
    op.drop_table("admins")
    op.execute(sa.text("DROP TYPE IF EXISTS adminrole;"))
