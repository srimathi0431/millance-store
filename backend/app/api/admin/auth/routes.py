from fastapi import APIRouter, Depends, Request, Header
from sqlalchemy.orm import Session
from typing import Optional

from db.database import get_db
from app.core.dependencies import get_current_admin, get_client_ip
from app.core.exceptions import success_response
from app.schemas.admin import (
    AdminLoginRequest, AdminLoginResponse, RefreshTokenRequest,
    ChangePasswordRequest, ForgotPasswordRequest, ResetPasswordRequest, AdminOut
)
from app.services import auth as auth_svc

router = APIRouter(prefix="/api/admin/auth", tags=["Admin Auth"])


@router.post("/login", response_model=AdminLoginResponse, summary="Admin login")
def login(
    payload: AdminLoginRequest,
    request: Request,
    db: Session = Depends(get_db),
):
    ip = get_client_ip(request.headers.get("x-forwarded-for"))
    ua = request.headers.get("user-agent", "")
    result = auth_svc.login(db, payload.email, payload.password, ip=ip, user_agent=ua)
    return result


@router.post("/refresh", response_model=AdminLoginResponse, summary="Refresh access token")
def refresh(payload: RefreshTokenRequest, db: Session = Depends(get_db)):
    return auth_svc.refresh(db, payload.refresh_token)


@router.post("/logout", summary="Admin logout")
def logout(
    payload: RefreshTokenRequest,
    request: Request,
    db: Session = Depends(get_db),
    admin=Depends(get_current_admin),
):
    ip = get_client_ip(request.headers.get("x-forwarded-for"))
    ua = request.headers.get("user-agent", "")
    auth_svc.logout(db, payload.refresh_token, admin, ip=ip, user_agent=ua)
    return success_response(message="Logged out successfully")


@router.get("/me", response_model=AdminOut, summary="Get current admin profile")
def me(admin=Depends(get_current_admin)):
    return admin


@router.post("/change-password", summary="Change admin password")
def change_password(
    payload: ChangePasswordRequest,
    request: Request,
    db: Session = Depends(get_db),
    admin=Depends(get_current_admin),
):
    ip = get_client_ip(request.headers.get("x-forwarded-for"))
    ua = request.headers.get("user-agent", "")
    auth_svc.change_password(db, admin, payload.current_password, payload.new_password, ip=ip, user_agent=ua)
    return success_response(message="Password changed successfully")


@router.post("/forgot-password", summary="Request password reset")
def forgot_password(payload: ForgotPasswordRequest, db: Session = Depends(get_db)):
    token = auth_svc.forgot_password(db, payload.email)
    # In production return generic message; returning token here for dev convenience
    return success_response(
        data={"reset_token": token},
        message="If this email exists, a reset link has been sent."
    )


@router.post("/reset-password", summary="Reset password with token")
def reset_password(payload: ResetPasswordRequest, db: Session = Depends(get_db)):
    auth_svc.reset_password(db, payload.token, payload.new_password)
    return success_response(message="Password reset successfully")
