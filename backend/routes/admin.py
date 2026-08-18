from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from db.database import get_db
from db.queries import get_user_by_email
from db.models import UserRole
from auth.utils import verify_password, create_access_token
from schemas import LoginRequest, TokenResponse

router = APIRouter(tags=["Admin"])


@router.post(
    "/admin",
    response_model=TokenResponse,
    summary="Admin Login",
    description="Authenticate with admin credentials and receive a JWT access token.",
)
def admin_login(payload: LoginRequest, db: Session = Depends(get_db)):
    """
    POST /admin

    Validates email + password against the admin user record.
    Returns a JWT on success, or 401 on invalid credentials.
    """
    user = get_user_by_email(db, payload.email)

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

    if user.role != UserRole.admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied: not an admin account",
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account is deactivated",
        )

    if not verify_password(payload.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

    token = create_access_token(data={"sub": user.email, "role": user.role.value, "id": user.id})

    return TokenResponse(
        access_token=token,
        token_type="bearer",
        role=user.role,
        email=user.email,
    )
