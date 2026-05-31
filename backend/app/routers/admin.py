from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.auth.dependencies import RequireAdmin
from app.database.connection import get_db
from app.models.user import User, UserRole
from app.models.extension import Extension
from app.schemas.user import UserRead, UserAdminUpdate
from app.schemas.common import MessageResponse
from app.services.extension_service import delete_extension, get_extension, ExtensionServiceError

router = APIRouter(prefix="/admin", tags=["admin"], dependencies=[RequireAdmin])

@router.get("/users", response_model=list[UserRead])
def list_users(
    role: UserRole | None = None,
    is_active: bool | None = None,
    db: Session = Depends(get_db),
) -> list[UserRead]:
    stmt = select(User)
    if role is not None:
        stmt = stmt.where(User.role == role)
    if is_active is not None:
        stmt = stmt.where(User.is_active == is_active)
    
    users = db.scalars(stmt.order_by(User.created_at.desc())).all()
    return [UserRead.model_validate(u) for u in users]

@router.patch("/users/{user_id}", response_model=UserRead)
def update_user_status(
    user_id: str,
    data: UserAdminUpdate,
    db: Session = Depends(get_db),
) -> UserRead:
    user = db.scalar(select(User).where(User.id == user_id))
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    if data.role is not None:
        user.role = data.role
    if data.is_active is not None:
        user.is_active = data.is_active
        
    db.commit()
    db.refresh(user)
    return UserRead.model_validate(user)

@router.delete("/extensions/{extension_id}", status_code=status.HTTP_204_NO_CONTENT)
def admin_remove_extension(
    extension_id: str,
    db: Session = Depends(get_db),
    admin_user: User = Depends(RequireAdmin),
) -> None:
    try:
        extension = get_extension(db, extension_id)
        # Admins bypass author checks, delete_extension checks user.role == UserRole.admin and permits it!
        delete_extension(db, extension=extension, user=admin_user)
    except ExtensionServiceError as exc:
        raise HTTPException(status_code=exc.status_code, detail=exc.message) from exc
