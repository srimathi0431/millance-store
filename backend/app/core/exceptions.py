from fastapi import Request, status
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from sqlalchemy.exc import IntegrityError
import logging

logger = logging.getLogger(__name__)


# ---------------------------------------------------------------------------
# Custom exception classes
# ---------------------------------------------------------------------------

class AppException(Exception):
    def __init__(self, status_code: int, message: str, error_code: str = "APP_ERROR"):
        self.status_code = status_code
        self.message = message
        self.error_code = error_code


class NotFoundError(AppException):
    def __init__(self, message: str = "Resource not found"):
        super().__init__(404, message, "NOT_FOUND")


class UnauthorizedError(AppException):
    def __init__(self, message: str = "Unauthorized"):
        super().__init__(401, message, "UNAUTHORIZED")


class ForbiddenError(AppException):
    def __init__(self, message: str = "Forbidden"):
        super().__init__(403, message, "FORBIDDEN")


class ConflictError(AppException):
    def __init__(self, message: str = "Conflict"):
        super().__init__(409, message, "CONFLICT")


class ValidationError(AppException):
    def __init__(self, message: str = "Validation error"):
        super().__init__(422, message, "VALIDATION_ERROR")


class BadRequestError(AppException):
    def __init__(self, message: str = "Bad request"):
        super().__init__(400, message, "BAD_REQUEST")


# ---------------------------------------------------------------------------
# Response helpers
# ---------------------------------------------------------------------------

def error_response(status_code: int, message: str, error_code: str = "ERROR") -> JSONResponse:
    return JSONResponse(
        status_code=status_code,
        content={"success": False, "message": message, "error_code": error_code},
    )


def success_response(data=None, message: str = "Success", status_code: int = 200) -> dict:
    return {"success": True, "message": message, "data": data}


# ---------------------------------------------------------------------------
# Exception handlers to register on the FastAPI app
# ---------------------------------------------------------------------------

async def app_exception_handler(request: Request, exc: AppException):
    return error_response(exc.status_code, exc.message, exc.error_code)


async def validation_exception_handler(request: Request, exc: RequestValidationError):
    errors = []
    for e in exc.errors():
        field = ".".join(str(l) for l in e["loc"] if l != "body")
        errors.append({"field": field, "message": e["msg"]})
    return JSONResponse(
        status_code=422,
        content={
            "success": False,
            "message": "Validation failed",
            "error_code": "VALIDATION_ERROR",
            "errors": errors,
        },
    )


async def integrity_error_handler(request: Request, exc: IntegrityError):
    logger.error(f"DB integrity error: {exc}")
    msg = str(exc.orig) if exc.orig else "Database constraint violation"
    if "unique" in msg.lower() or "duplicate" in msg.lower():
        return error_response(409, "A record with this value already exists.", "DUPLICATE")
    return error_response(400, "Database constraint violation.", "INTEGRITY_ERROR")


async def generic_exception_handler(request: Request, exc: Exception):
    logger.exception(f"Unhandled exception: {exc}")
    return error_response(500, "An internal server error occurred.", "INTERNAL_ERROR")
