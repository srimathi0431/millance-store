"""customer otp fields, cart_items table, wishlist_items table

Revision ID: 004
Revises: 003
Create Date: 2026-08-18 12:00:00.000000

Changes:
  - customers: add phone_otp, otp_expires_at, otp_verified,
               refresh_token_hash, refresh_token_exp,
               make phone UNIQUE
  - new table: cart_items
  - new table: wishlist_items
"""

from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa

revision: str = "004"
down_revision: Union[str, None] = "003"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ── customers: new OTP + refresh token columns ─────────────────────────
    op.add_column("customers", sa.Column("phone_otp",          sa.String(10),               nullable=True))
    op.add_column("customers", sa.Column("otp_expires_at",     sa.DateTime(timezone=True),  nullable=True))
    op.add_column("customers", sa.Column("otp_verified",       sa.Boolean(),                nullable=False, server_default=sa.text("false")))
    op.add_column("customers", sa.Column("refresh_token_hash", sa.String(255),              nullable=True))
    op.add_column("customers", sa.Column("refresh_token_exp",  sa.DateTime(timezone=True),  nullable=True))

    # Make phone unique (allow NULL — only non-null values are constrained)
    op.create_index("ix_customers_phone", "customers", ["phone"], unique=True)

    # ── cart_items ──────────────────────────────────────────────────────────
    op.create_table(
        "cart_items",
        sa.Column("id",          sa.Integer(),  autoincrement=True, nullable=False),
        sa.Column("customer_id", sa.Integer(),  sa.ForeignKey("customers.id", ondelete="CASCADE"), nullable=False),
        sa.Column("product_id",  sa.Integer(),  sa.ForeignKey("products.id",  ondelete="CASCADE"), nullable=False),
        sa.Column("variant_id",  sa.Integer(),  sa.ForeignKey("product_variants.id", ondelete="SET NULL"), nullable=True),
        sa.Column("quantity",    sa.Integer(),  nullable=False, server_default=sa.text("1")),
        sa.Column("added_at",    sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.Column("updated_at",  sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_cart_items_customer_id", "cart_items", ["customer_id"])
    op.create_index("ix_cart_items_product_id",  "cart_items", ["product_id"])
    # Ensure one row per customer+product+variant combination
    op.create_index("uq_cart_customer_product_variant", "cart_items",
                    ["customer_id", "product_id", "variant_id"], unique=True)

    # ── wishlist_items ──────────────────────────────────────────────────────
    op.create_table(
        "wishlist_items",
        sa.Column("id",          sa.Integer(), autoincrement=True, nullable=False),
        sa.Column("customer_id", sa.Integer(), sa.ForeignKey("customers.id", ondelete="CASCADE"), nullable=False),
        sa.Column("product_id",  sa.Integer(), sa.ForeignKey("products.id",  ondelete="CASCADE"), nullable=False),
        sa.Column("added_at",    sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_wishlist_customer_id", "wishlist_items", ["customer_id"])
    # One product per customer wishlist
    op.create_index("uq_wishlist_customer_product", "wishlist_items",
                    ["customer_id", "product_id"], unique=True)


def downgrade() -> None:
    op.drop_index("uq_wishlist_customer_product",      table_name="wishlist_items")
    op.drop_index("ix_wishlist_customer_id",           table_name="wishlist_items")
    op.drop_table("wishlist_items")

    op.drop_index("uq_cart_customer_product_variant",  table_name="cart_items")
    op.drop_index("ix_cart_items_product_id",          table_name="cart_items")
    op.drop_index("ix_cart_items_customer_id",         table_name="cart_items")
    op.drop_table("cart_items")

    op.drop_index("ix_customers_phone",                table_name="customers")
    op.drop_column("customers", "refresh_token_exp")
    op.drop_column("customers", "refresh_token_hash")
    op.drop_column("customers", "otp_verified")
    op.drop_column("customers", "otp_expires_at")
    op.drop_column("customers", "phone_otp")
