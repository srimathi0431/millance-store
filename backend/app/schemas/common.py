from pydantic import BaseModel
from typing import Generic, TypeVar, Optional, List

T = TypeVar("T")


class PaginatedResponse(BaseModel, Generic[T]):
    items: List[T]
    page: int
    page_size: int
    total: int
    total_pages: int


class SuccessResponse(BaseModel):
    success: bool = True
    message: str = "Success"
    data: Optional[dict] = None


def paginate(items, total: int, page: int, page_size: int) -> dict:
    import math
    return {
        "items": items,
        "page": page,
        "page_size": page_size,
        "total": total,
        "total_pages": math.ceil(total / page_size) if page_size > 0 else 0,
    }
