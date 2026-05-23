from pathlib import Path

from fastapi import UploadFile

from app.config.settings import BACKEND_ROOT, get_settings
from app.utils.file_validation import read_upload_with_limit, safe_filename, validate_extension

settings = get_settings()


async def save_extension_file(
    *,
    extension_id: str,
    version: str,
    file: UploadFile,
) -> tuple[str, str]:
    """Save upload to disk. Returns (relative_path, safe_name)."""
    if not file.filename:
        raise ValueError("Filename is required")

    validate_extension(file.filename, settings.allowed_extension_set)
    safe_name = safe_filename(file.filename)

    dest_dir = settings.upload_path / extension_id / version
    dest_dir.mkdir(parents=True, exist_ok=True)
    dest_path = dest_dir / safe_name

    max_bytes = settings.max_upload_size_mb * 1024 * 1024
    content = await read_upload_with_limit(file, max_bytes)
    dest_path.write_bytes(content)

    relative = dest_path.relative_to(BACKEND_ROOT).as_posix()
    return relative, safe_name


def resolve_upload_path(relative_path: str) -> Path:
    path = (BACKEND_ROOT / relative_path).resolve()
    uploads_root = settings.upload_path.resolve()
    if not str(path).startswith(str(uploads_root)):
        raise ValueError("Invalid file path")
    return path


def delete_extension_files(extension_id: str) -> None:
    folder = settings.upload_path / extension_id
    if folder.exists():
        import shutil

        shutil.rmtree(folder)
