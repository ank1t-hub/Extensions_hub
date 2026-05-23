from fastapi import APIRouter, Depends, File, Form, HTTPException, Query, UploadFile, status
from sqlalchemy.orm import Session

from app.auth.dependencies import get_current_user, require_roles
from app.database.connection import get_db
from app.models.user import User, UserRole
from app.schemas.category import CategoryRead
from app.schemas.common import PaginatedResponse
from app.schemas.extension import ExtensionDetailRead, ExtensionListItem, ExtensionUpdate
from app.services.extension_service import (
    ExtensionServiceError,
    _to_detail,
    create_extension,
    delete_extension,
    get_extension,
    list_extensions,
    update_extension,
)

router = APIRouter(prefix="/extensions", tags=["extensions"])


@router.get("/categories/list", response_model=list[CategoryRead])
def list_categories(db: Session = Depends(get_db)) -> list:
    from sqlalchemy import select

    from app.models.category import Category

    return list(db.scalars(select(Category).order_by(Category.name)).all())


@router.get("", response_model=PaginatedResponse[ExtensionListItem])
def get_extensions(
    q: str | None = None,
    category: str | None = None,
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
) -> PaginatedResponse[ExtensionListItem]:
    items, total = list_extensions(db, q=q, category=category, page=page, limit=limit)
    return PaginatedResponse(items=items, total=total, page=page, limit=limit)


@router.get("/{extension_id}", response_model=ExtensionDetailRead)
def get_extension_detail(extension_id: str, db: Session = Depends(get_db)) -> ExtensionDetailRead:
    try:
        extension = get_extension(db, extension_id)
    except ExtensionServiceError as exc:
        raise HTTPException(status_code=exc.status_code, detail=exc.message) from exc
    return _to_detail(extension)


@router.post(
    "",
    response_model=ExtensionDetailRead,
    status_code=status.HTTP_201_CREATED,
)
async def post_extension(
    title: str = Form(...),
    description: str = Form(...),
    version: str = Form(...),
    changelog: str | None = Form(None),
    category_slugs: str = Form(""),
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(UserRole.developer, UserRole.admin)),
) -> ExtensionDetailRead:
    slugs = [s.strip() for s in category_slugs.split(",") if s.strip()]
    try:
        return await create_extension(
            db,
            author=current_user,
            title=title,
            description=description,
            version=version,
            changelog=changelog,
            category_slugs=slugs,
            file=file,
        )
    except ExtensionServiceError as exc:
        raise HTTPException(status_code=exc.status_code, detail=exc.message) from exc


@router.put("/{extension_id}", response_model=ExtensionDetailRead)
def put_extension(
    extension_id: str,
    data: ExtensionUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> ExtensionDetailRead:
    try:
        extension = get_extension(db, extension_id)
        return update_extension(db, extension=extension, user=current_user, data=data)
    except ExtensionServiceError as exc:
        raise HTTPException(status_code=exc.status_code, detail=exc.message) from exc


@router.delete("/{extension_id}", status_code=status.HTTP_204_NO_CONTENT)
def remove_extension(
    extension_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> None:
    try:
        extension = get_extension(db, extension_id)
        delete_extension(db, extension=extension, user=current_user)
    except ExtensionServiceError as exc:
        raise HTTPException(status_code=exc.status_code, detail=exc.message) from exc
