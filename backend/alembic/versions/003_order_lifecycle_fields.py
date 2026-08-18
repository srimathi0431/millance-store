"""add order lifecycle fields and status history table

Revision ID: 003
Revises: 002
Create Date: 2026-08-18 10:00:00.000000

Adds to orders table:
  - tracking_number
  - courier_name
  - confirmed_at
  - packed_at
  - dispatched_at
  - delivered_at
  - return_reason

Creates new table:
  - order_status_history
"""

from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa

revision: str = "003"
down_revision: Union[str, None] = "002"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ── New columns on orders ──────────────────────────────────────────────
    op.add_column("orders", sa.Column("tracking_number",  sa.String(100),              nullable=True))
    op.add_column("orders", sa.Column("courier_name",     sa.String(100),              nullable=True))
    op.add_column("orders", sa.Column("confirmed_at",     sa.DateTime(timezone=True),  nullable=True))
    op.add_column("orders", sa.Column("packed_at",        sa.DateTime(timezone=True),  nullable=True))
    op.add_column("orders", sa.Column("dispatched_at",    sa.DateTime(timezone=True),  nullable=True))
    op.add_column("orders", sa.Column("delivered_at",     sa.DateTime(timezone=True),  nullable=True))
    op.add_column("orders", sa.Column("return_reason",    sa.Text(),                   nullable=True))

    # Index for tracking number lookups (customer app needs this)
    op.create_index("ix_orders_tracking_number", "orders", ["tracking_number"])

    # ── order_status_history ───────────────────────────────────────────────
    op.create_table(
        "order_status_history",
        sa.Column("id",          sa.Integer(),                  autoincrement=True, nullable=False),
        sa.Column("order_id",    sa.Integer(),                  sa.ForeignKey("orders.id", ondelete="CASCADE"), nullable=False),
        sa.Column("from_status", sa.String(30),                 nullable=True),   # NULL for first PENDING row
        sa.Column("to_status",   sa.String(30),                 nullable=False),
        sa.Column("notes",       sa.Text(),                     nullable=True),
        sa.Column("changed_by",  sa.Integer(),                  sa.ForeignKey("admins.id", ondelete="SET NULL"), nullable=True),
        sa.Column("changed_at",  sa.DateTime(timezone=True),    server_default=sa.text("now()"), nullable=False),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_order_status_history_order_id",   "order_status_history", ["order_id"])
    op.create_index("ix_order_status_history_to_status",  "order_status_history", ["to_status"])
    op.create_index("ix_order_status_history_changed_at", "order_status_history", ["changed_at"])


def downgrade() -> None:
    # Drop history table first (references orders)
    op.drop_index("ix_order_status_history_changed_at", table_name="order_status_history")
    op.drop_index("ix_order_status_history_to_status",  table_name="order_status_history")
    op.drop_index("ix_order_status_history_order_id",   table_name="order_status_history")
    op.drop_table("order_status_history")

    # Drop columns added to orders
    op.drop_index("ix_orders_tracking_number", table_name="orders")
    op.drop_column("orders", "return_reason")
    op.drop_column("orders", "delivered_at")
    op.drop_column("orders", "dispatched_at")
    op.drop_column("orders", "packed_at")
    op.drop_column("orders", "confirmed_at")
    op.drop_column("orders", "courier_name")
    op.drop_column("orders", "tracking_number")
