from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from db.database import get_db
from app.core.exceptions import success_response
from app.core.customer_dependencies import get_current_customer
from app.schemas.customer_api import (
    SendOTPRequest, VerifyOTPRequest, RefreshTokenRequest,
    UpdateProfileRequest, TokenResponse, CustomerOut,
)
from app.services import customer_api as svc

router = APIRouter(prefix="/api/customer/auth", tags=["Customer Auth"])


@router.post("/send-otp", summary="Send OTP to phone number (register or login)")
def send_otp(data: SendOTPRequest, db: Session = Depends(get_db)):
    result = svc.send_otp(db, data)
    return success_response(data=result, message=result["message"])


@router.post("/verify-otp", summary="Verify OTP and get tokens")
def verify_otp(data: VerifyOTPRequest, db: Session = Depends(get_db)):
    tokens = svc.verify_otp(db, data)
    return success_response(data=tokens, message="Login successful")


@router.post("/refresh", summary="Refresh access token")
def refresh(data: RefreshTokenRequest, db: Session = Depends(get_db)):
    tokens = svc.refresh_token(db, data.refresh_token)
    return success_response(data=tokens, message="Token refreshed")


@router.post("/logout", summary="Logout — revoke refresh token")
def logout(
    db: Session = Depends(get_db),
    customer=Depends(get_current_customer),
):
    svc.logout(db, customer)
    return success_response(message="Logged out successfully")


@router.get("/me", summary="Get current customer profile")
def me(customer=Depends(get_current_customer)):
    return success_response(
        data=CustomerOut.model_validate(customer).model_dump(),
        message="Profile loaded",
    )


@router.patch("/me", summary="Update profile (name, email)")
def update_me(
    data: UpdateProfileRequest,
    db: Session = Depends(get_db),
    customer=Depends(get_current_customer),
):
    updated = svc.update_profile(db, customer, data)
    return success_response(
        data=CustomerOut.model_validate(updated).model_dump(),
        message="Profile updated",
    )
