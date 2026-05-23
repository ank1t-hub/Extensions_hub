from datetime import datetime

from sqlalchemy import Boolean, DateTime, ForeignKey, String, Text, UniqueConstraint, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.base import Base
from app.models.mixins import UUIDPrimaryKeyMixin


class ExtensionVersion(UUIDPrimaryKeyMixin, Base):
    __tablename__ = "extension_versions"
    __table_args__ = (
        UniqueConstraint("extension_id", "version", name="uq_extension_version"),
    )

    extension_id: Mapped[str] = mapped_column(
        String(36),
        ForeignKey("extensions.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    version: Mapped[str] = mapped_column(String(50), nullable=False)
    changelog: Mapped[str | None] = mapped_column(Text, nullable=True)
    file_path: Mapped[str] = mapped_column(String(512), nullable=False)
    is_latest: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        server_default=func.now(),
        nullable=False,
    )

    extension: Mapped["Extension"] = relationship("Extension", back_populates="versions")
