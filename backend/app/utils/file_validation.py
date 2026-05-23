import re
from pathlib import Path

from fastapi import HTTPException, UploadFile, status

SAFE_FILENAME_PATTERN = re.compile(r"[^a-zA-Z0-9._-]+")


def safe_filename(original: str) -> str:
    name = Path(original).name
    cleaned = SAFE_FILENAME_PATTERN.sub("_", name).strip("._")
    return cleaned or "upload.bin"


def validate_extension(filename: str, allowed: set[str]) -> str:
    ext = Path(filename).suffix.lower()
    if ext not in allowed:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"File type not allowed. Allowed: {', '.join(sorted(allowed))}",
        )
    return ext


async def read_upload_with_limit(file: UploadFile, max_bytes: int) -> bytes:
    chunks: list[bytes] = []
    total = 0
    while True:
        chunk = await file.read(1024 * 1024)
        if not chunk:
            break
        total += len(chunk)
        if total > max_bytes:
            raise HTTPException(
                status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
                detail=f"File exceeds maximum size of {max_bytes // (1024 * 1024)} MB",
            )
        chunks.append(chunk)
    return b"".join(chunks)
