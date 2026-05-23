from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class ExtensionVersionBase(BaseModel):
    version: str = Field(min_length=1, max_length=50)
    changelog: str | None = None


class ExtensionVersionCreate(ExtensionVersionBase):
    file_path: str = Field(min_length=1, max_length=512)


class ExtensionVersionRead(ExtensionVersionBase):
    model_config = ConfigDict(from_attributes=True)

    id: str
    extension_id: str
    file_path: str
    is_latest: bool
    created_at: datetime


class ExtensionBase(BaseModel):
    title: str = Field(min_length=1, max_length=200)
    description: str = Field(min_length=1)


class ExtensionCreate(ExtensionBase):
    version: str = Field(min_length=1, max_length=50)
    changelog: str | None = None
    category_slugs: list[str] = Field(default_factory=list)


class ExtensionUpdate(BaseModel):
    title: str | None = Field(default=None, min_length=1, max_length=200)
    description: str | None = Field(default=None, min_length=1)
    logo_path: str | None = Field(default=None, max_length=512)
    category_slugs: list[str] | None = None


class ExtensionRead(ExtensionBase):
    model_config = ConfigDict(from_attributes=True)

    id: str
    author_id: str
    download_count: int
    logo_path: str | None
    created_at: datetime
    updated_at: datetime


class ExtensionDetailRead(ExtensionRead):
    latest_version: str | None = None
    versions: list[ExtensionVersionRead] = Field(default_factory=list)
    category_slugs: list[str] = Field(default_factory=list)


class ExtensionListItem(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    title: str
    description: str
    download_count: int
    author_id: str
    latest_version: str | None = None
    logo_path: str | None = None
