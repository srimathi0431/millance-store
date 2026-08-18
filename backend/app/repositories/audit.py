from sqlalchemy.orm import Session
from typing import Optional
import json

from app.models.audit import AuditLog


def log_action(
    db: Session,
    action: str,
    admin_id: Optional[int] = None,
    entity_type: Optional[str] = None,
    entity_id: Optional[str] = None,
    old_value: Optional[dict] = None,
    new_value: Optional[dict] = None,
    ip_address: Optional[str] = None,
    user_agent: Optional[str] = None,
) -> None:
    entry = AuditLog(
        admin_id=admin_id,
        action=action,
        entity_type=entity_type,
        entity_id=str(entity_id) if entity_id is not None else None,
        old_value=json.dumps(old_value) if old_value else None,
        new_value=json.dumps(new_value) if new_value else None,
        ip_address=ip_address,
        user_agent=user_agent,
    )
    db.add(entry)
    db.commit()
