from sqlalchemy import ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.base import Base
from app.models.category import extension_categories
from app.models.mixins import TimestampMixin, UUIDPrimaryKeyMixin


class Extension(UUIDPrimaryKeyMixin, TimestampMixin, Base):
    __tablename__ = "extensions"

    title: Mapped[str] = mapped_column(String(200), nullable=False, index=True)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    author_id: Mapped[str] = mapped_column(
        String(36),
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    download_count: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    logo_path: Mapped[str | None] = mapped_column(String(512), nullable=True)

    author: Mapped["User"] = relationship("User", back_populates="extensions")
    versions: Mapped[list["ExtensionVersion"]] = relationship(
        "ExtensionVersion",
        back_populates="extension",
        cascade="all, delete-orphan",
        order_by="ExtensionVersion.created_at.desc()",
    )
    documentation: Mapped["Documentation | None"] = relationship(
        "Documentation",
        back_populates="extension",
        uselist=False,
        cascade="all, delete-orphan",
    )
    categories: Mapped[list["Category"]] = relationship(
        "Category",
        secondary=extension_categories,
        back_populates="extensions",
    )
