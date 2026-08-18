from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from db.database import get_db
from app.core.exceptions import success_response
from app.schemas.customer_api import PublicCategoryOut
from app.services import customer_api as svc

router = APIRouter(prefix="/api/customer/categories", tags=["Customer Categories"])


@router.get("", summary="List all active categories as a tree (no auth)")
def list_categories(db: Session = Depends(get_db)):
    tree = svc.list_categories(db)
    out  = [PublicCategoryOut.model_validate(c) for c in tree]
    return success_response(data=out, message="Categories loaded")
