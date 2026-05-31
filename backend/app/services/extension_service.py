from pathlib import Path

from fastapi import UploadFile
from sqlalchemy import func, or_, select
from sqlalchemy.orm import Session, selectinload

from app.models.category import Category
from app.models.documentation import Documentation
from app.models.extension import Extension
from app.models.extension_version import ExtensionVersion
from app.models.user import User, UserRole
from app.schemas.extension import (
    ExtensionDetailRead,
    ExtensionListItem,
    ExtensionUpdate,
    ExtensionVersionRead,
)
from app.services.upload_service import delete_extension_files, save_extension_file


class ExtensionServiceError(Exception):
    def __init__(self, message: str, status_code: int = 400) -> None:
        self.message = message
        self.status_code = status_code
        super().__init__(message)


def _latest_version(extension: Extension) -> ExtensionVersion | None:
    for version in extension.versions:
        if version.is_latest:
            return version
    return extension.versions[0] if extension.versions else None


def _category_slugs(extension: Extension) -> list[str]:
    return [c.slug for c in extension.categories]


def _to_list_item(extension: Extension) -> ExtensionListItem:
    latest = _latest_version(extension)
    return ExtensionListItem(
        id=extension.id,
        title=extension.title,
        description=extension.description,
        download_count=extension.download_count,
        author_id=extension.author_id,
        latest_version=latest.version if latest else None,
        logo_path=extension.logo_path,
    )


def _to_detail(extension: Extension) -> ExtensionDetailRead:
    latest = _latest_version(extension)
    return ExtensionDetailRead(
        id=extension.id,
        title=extension.title,
        description=extension.description,
        author_id=extension.author_id,
        download_count=extension.download_count,
        logo_path=extension.logo_path,
        created_at=extension.created_at,
        updated_at=extension.updated_at,
        latest_version=latest.version if latest else None,
        versions=[ExtensionVersionRead.model_validate(v) for v in extension.versions],
        category_slugs=_category_slugs(extension),
    )


def _load_extension_query():
    return select(Extension).options(
        selectinload(Extension.versions),
        selectinload(Extension.categories),
    )


def list_extensions(
    db: Session,
    *,
    q: str | None = None,
    category: str | None = None,
    page: int = 1,
    limit: int = 20,
) -> tuple[list[ExtensionListItem], int]:
    id_query = select(Extension.id)
    if category:
        id_query = id_query.join(Extension.categories).where(Category.slug == category)
    if q:
        pattern = f"%{q}%"
        id_query = id_query.where(
            or_(Extension.title.ilike(pattern), Extension.description.ilike(pattern))
        )

    total = db.scalar(select(func.count()).select_from(id_query.distinct().subquery())) or 0

    list_query = _load_extension_query()
    if category:
        list_query = list_query.join(Extension.categories).where(Category.slug == category)
    if q:
        pattern = f"%{q}%"
        list_query = list_query.where(
            or_(Extension.title.ilike(pattern), Extension.description.ilike(pattern))
        )

    offset = (page - 1) * limit
    rows = db.scalars(
        list_query.distinct().order_by(Extension.created_at.desc()).offset(offset).limit(limit)
    ).all()
    return [_to_list_item(ext) for ext in rows], total


def get_extension(db: Session, extension_id: str) -> Extension:
    extension = db.scalar(
        _load_extension_query().where(Extension.id == extension_id)
    )
    if not extension:
        raise ExtensionServiceError("Extension not found", 404)
    return extension


def get_categories_by_slugs(db: Session, slugs: list[str]) -> list[Category]:
    if not slugs:
        return []
    categories = list(db.scalars(select(Category).where(Category.slug.in_(slugs))).all())
    found = {c.slug for c in categories}
    missing = set(slugs) - found
    if missing:
        raise ExtensionServiceError(f"Unknown categories: {', '.join(sorted(missing))}", 400)
    return categories


def assert_can_modify(extension: Extension, user: User) -> None:
    if user.role == UserRole.admin:
        return
    if extension.author_id != user.id:
        raise ExtensionServiceError("Not allowed to modify this extension", 403)
    if user.role != UserRole.developer:
        raise ExtensionServiceError("Developer role required", 403)


async def create_extension(
    db: Session,
    *,
    author: User,
    title: str,
    description: str,
    version: str,
    changelog: str | None,
    category_slugs: list[str],
    file: UploadFile,
) -> ExtensionDetailRead:
    if author.role not in (UserRole.developer, UserRole.admin):
        raise ExtensionServiceError("Developer role required", 403)

    extension = Extension(
        title=title,
        description=description,
        author_id=author.id,
        download_count=0,
    )
    db.add(extension)
    db.flush()

    relative_path, _ = await save_extension_file(
        extension_id=extension.id,
        version=version,
        file=file,
    )

    ext_version = ExtensionVersion(
        extension_id=extension.id,
        version=version,
        changelog=changelog,
        file_path=relative_path,
        is_latest=True,
    )
    db.add(ext_version)
    db.add(Documentation(extension_id=extension.id, markdown_content=""))

    extension.categories = get_categories_by_slugs(db, category_slugs)
    db.commit()
    db.refresh(extension)
    extension = get_extension(db, extension.id)
    return _to_detail(extension)


def update_extension(
    db: Session,
    *,
    extension: Extension,
    user: User,
    data: ExtensionUpdate,
) -> ExtensionDetailRead:
    assert_can_modify(extension, user)

    if data.title is not None:
        extension.title = data.title
    if data.description is not None:
        extension.description = data.description
    if data.logo_path is not None:
        extension.logo_path = data.logo_path
    if data.category_slugs is not None:
        extension.categories = get_categories_by_slugs(db, data.category_slugs)

    db.commit()
    extension = get_extension(db, extension.id)
    return _to_detail(extension)


def delete_extension(db: Session, *, extension: Extension, user: User) -> None:
    assert_can_modify(extension, user)
    extension_id = extension.id
    db.delete(extension)
    db.commit()
    delete_extension_files(extension_id)


def get_download_version(
    db: Session,
    extension_id: str,
    version: str | None,
) -> tuple[Extension, ExtensionVersion, Path]:
    extension = get_extension(db, extension_id)
    if version:
        match = next((v for v in extension.versions if v.version == version), None)
        if not match:
            raise ExtensionServiceError("Version not found", 404)
        target = match
    else:
        target = _latest_version(extension)
        if not target:
            raise ExtensionServiceError("No version available for download", 404)

    from app.services.upload_service import resolve_upload_path

    path = resolve_upload_path(target.file_path)
    if not path.is_file():
        raise ExtensionServiceError("File not found on server", 404)
    return extension, target, path


def increment_download_count(db: Session, extension: Extension) -> None:
    extension.download_count += 1
    db.commit()


async def create_extension_version(
    db: Session,
    *,
    extension_id: str,
    version: str,
    changelog: str | None,
    file: UploadFile,
    user: User,
) -> ExtensionDetailRead:
    extension = get_extension(db, extension_id)
    assert_can_modify(extension, user)

    # Check if this version string already exists for this extension
    from sqlalchemy import and_
    existing = db.scalar(
        select(ExtensionVersion).where(
            and_(
                ExtensionVersion.extension_id == extension_id,
                ExtensionVersion.version == version,
            )
        )
    )
    if existing:
        raise ExtensionServiceError(f"Version {version} already exists for this extension", 400)

    # Mark all previous versions as not latest
    for v in extension.versions:
        v.is_latest = False

    # Save file
    relative_path, _ = await save_extension_file(
        extension_id=extension_id,
        version=version,
        file=file,
    )

    # Add new version
    ext_version = ExtensionVersion(
        extension_id=extension_id,
        version=version,
        changelog=changelog,
        file_path=relative_path,
        is_latest=True,
    )
    db.add(ext_version)
    db.commit()
    db.refresh(extension)

    extension = get_extension(db, extension_id)
    return _to_detail(extension)

