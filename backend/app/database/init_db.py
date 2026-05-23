from app.database.base import Base
from app.database.connection import engine
from app.models import (  # noqa: F401 — register metadata
    Category,
    Documentation,
    Extension,
    ExtensionVersion,
    User,
)


def init_db() -> None:
    Base.metadata.create_all(bind=engine)
