from pathlib import Path

from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.services.extension_service import (
    ExtensionServiceError,
    get_download_version,
    increment_download_count,
)

router = APIRouter(prefix="/download", tags=["downloads"])


@router.get("/{extension_id}")
def download_extension(
    extension_id: str,
    version: str | None = None,
    db: Session = Depends(get_db),
) -> FileResponse:
    try:
        extension, ext_version, path = get_download_version(db, extension_id, version)
        increment_download_count(db, extension)
    except ExtensionServiceError as exc:
        raise HTTPException(status_code=exc.status_code, detail=exc.message) from exc

    filename = Path(path).name
    return FileResponse(
        path=path,
        filename=filename,
        media_type="application/octet-stream",
        headers={"X-Extension-Version": ext_version.version},
    )
