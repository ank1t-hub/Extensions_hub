from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.auth.dependencies import get_current_user
from app.database.connection import get_db
from app.models.user import User
from app.schemas.documentation import DocumentationCreate, DocumentationRead, DocumentationUpdate
from app.services.documentation_service import (
    DocumentationServiceError,
    get_documentation,
    create_documentation,
    update_documentation,
)

router = APIRouter(prefix="/docs", tags=["documentation"])

@router.get("/{extension_id}", response_model=DocumentationRead)
def read_doc(extension_id: str, db: Session = Depends(get_db)) -> DocumentationRead:
    try:
        return get_documentation(db, extension_id)
    except DocumentationServiceError as exc:
        raise HTTPException(status_code=exc.status_code, detail=exc.message) from exc

@router.post("", response_model=DocumentationRead, status_code=status.HTTP_201_CREATED)
def post_doc(
    data: DocumentationCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> DocumentationRead:
    try:
        return create_documentation(
            db,
            extension_id=data.extension_id,
            markdown_content=data.markdown_content,
            user=current_user,
        )
    except DocumentationServiceError as exc:
        raise HTTPException(status_code=exc.status_code, detail=exc.message) from exc

@router.put("/{extension_id}", response_model=DocumentationRead)
def put_doc(
    extension_id: str,
    data: DocumentationUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> DocumentationRead:
    try:
        return update_documentation(
            db,
            extension_id=extension_id,
            markdown_content=data.markdown_content,
            user=current_user,
        )
    except DocumentationServiceError as exc:
        raise HTTPException(status_code=exc.status_code, detail=exc.message) from exc
