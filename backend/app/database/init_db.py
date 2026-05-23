"""Create tables when models exist (Phase 1)."""
from app.database.base import Base
from app.database.connection import engine


def init_db() -> None:
    # Import models here in Phase 1 so metadata is registered:
    # from app.models import user, extension, documentation  # noqa: F401
    Base.metadata.create_all(bind=engine)
