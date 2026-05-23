from sqlalchemy import select
from sqlalchemy.orm import Session

from app.auth.jwt_handler import create_access_token
from app.auth.password import hash_password, verify_password
from app.models.user import User, UserRole
from app.schemas.auth import SignupRequest, TokenResponse
from app.schemas.user import UserRead


class AuthServiceError(Exception):
    def __init__(self, message: str, status_code: int = 400) -> None:
        self.message = message
        self.status_code = status_code
        super().__init__(message)


def register_user(db: Session, data: SignupRequest) -> User:
    if db.scalar(select(User).where(User.email == data.email)):
        raise AuthServiceError("Email already registered", 409)
    if db.scalar(select(User).where(User.username == data.username)):
        raise AuthServiceError("Username already taken", 409)

    user = User(
        username=data.username,
        email=data.email,
        password_hash=hash_password(data.password),
        role=UserRole.user,
        is_active=True,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def authenticate_user(db: Session, email: str, password: str) -> User:
    user = db.scalar(select(User).where(User.email == email))
    if not user or not verify_password(password, user.password_hash):
        raise AuthServiceError("Invalid email or password", 401)
    if not user.is_active:
        raise AuthServiceError("Account is disabled", 403)
    return user


def create_token_for_user(user: User) -> TokenResponse:
    token = create_access_token(
        subject=user.id,
        extra_claims={"email": user.email, "role": user.role.value},
    )
    return TokenResponse(access_token=token)


def user_to_read(user: User) -> UserRead:
    return UserRead.model_validate(user)
