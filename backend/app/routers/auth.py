from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.auth.dependencies import get_current_user
from app.database.connection import get_db
from app.models.user import User
from app.schemas.auth import AuthResponse, LoginRequest, SignupRequest
from app.schemas.common import MessageResponse
from app.schemas.user import UserRead
from app.services.auth_service import (
    AuthServiceError,
    authenticate_user,
    create_token_for_user,
    register_user,
    user_to_read,
)

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/signup", response_model=AuthResponse, status_code=status.HTTP_201_CREATED)
def signup(data: SignupRequest, db: Session = Depends(get_db)) -> AuthResponse:
    try:
        user = register_user(db, data)
    except AuthServiceError as exc:
        raise HTTPException(status_code=exc.status_code, detail=exc.message) from exc
    return AuthResponse(user=user_to_read(user), token=create_token_for_user(user))


@router.post("/login", response_model=AuthResponse)
def login(data: LoginRequest, db: Session = Depends(get_db)) -> AuthResponse:
    try:
        user = authenticate_user(db, data.email, data.password)
    except AuthServiceError as exc:
        raise HTTPException(status_code=exc.status_code, detail=exc.message) from exc
    return AuthResponse(user=user_to_read(user), token=create_token_for_user(user))


@router.post("/logout", response_model=MessageResponse)
def logout(_: User = Depends(get_current_user)) -> MessageResponse:
    return MessageResponse(message="Logged out successfully")


@router.get("/me", response_model=UserRead)
def me(current_user: User = Depends(get_current_user)) -> UserRead:
    return user_to_read(current_user)
