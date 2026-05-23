from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.documentation import Documentation
from app.models.user import User
from app.services.extension_service import get_extension, assert_can_modify, ExtensionServiceError

class DocumentationServiceError(Exception):
    def __init__(self, message: str, status_code: int = 400) -> None:
        self.message = message
        self.status_code = status_code
        super().__init__(message)

def get_documentation(db: Session, extension_id: str) -> Documentation:
    try:
        get_extension(db, extension_id)
    except ExtensionServiceError as exc:
        raise DocumentationServiceError(exc.message, exc.status_code) from exc

    doc = db.scalar(
        select(Documentation).where(Documentation.extension_id == extension_id)
    )
    if not doc:
        doc = Documentation(extension_id=extension_id, markdown_content="")
        db.add(doc)
        db.commit()
        db.refresh(doc)
    return doc

def create_documentation(db: Session, extension_id: str, markdown_content: str, user: User) -> Documentation:
    try:
        extension = get_extension(db, extension_id)
        assert_can_modify(extension, user)
    except ExtensionServiceError as exc:
        raise DocumentationServiceError(exc.message, exc.status_code) from exc

    doc = db.scalar(
        select(Documentation).where(Documentation.extension_id == extension_id)
    )
    if doc and doc.markdown_content != "":
        raise DocumentationServiceError("Documentation already exists for this extension", 409)

    if not doc:
        doc = Documentation(extension_id=extension_id, markdown_content=markdown_content)
        db.add(doc)
    else:
        doc.markdown_content = markdown_content
    db.commit()
    db.refresh(doc)
    return doc

def update_documentation(db: Session, extension_id: str, markdown_content: str, user: User) -> Documentation:
    try:
        extension = get_extension(db, extension_id)
        assert_can_modify(extension, user)
    except ExtensionServiceError as exc:
        raise DocumentationServiceError(exc.message, exc.status_code) from exc

    doc = db.scalar(
        select(Documentation).where(Documentation.extension_id == extension_id)
    )
    if not doc:
        doc = Documentation(extension_id=extension_id, markdown_content=markdown_content)
        db.add(doc)
    else:
        doc.markdown_content = markdown_content
    db.commit()
    db.refresh(doc)
    return doc
