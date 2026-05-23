from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, Text, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.base import Base
from app.models.mixins import UUIDPrimaryKeyMixin


class Documentation(UUIDPrimaryKeyMixin, Base):
    __tablename__ = "documentation"

    extension_id: Mapped[str] = mapped_column(
        ForeignKey("extensions.id", ondelete="CASCADE"),
        unique=True,
        nullable=False,
        index=True,
    )
    markdown_content: Mapped[str] = mapped_column(Text, nullable=False, default="")
    updated_at: Mapped[datetime] = mapped_column(
        DateTime,
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )

    extension: Mapped["Extension"] = relationship("Extension", back_populates="documentation")
