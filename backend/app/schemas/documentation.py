from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class DocumentationBase(BaseModel):
    markdown_content: str = Field(default="")


class DocumentationCreate(DocumentationBase):
    extension_id: str


class DocumentationUpdate(BaseModel):
    markdown_content: str


class DocumentationRead(DocumentationBase):
    model_config = ConfigDict(from_attributes=True)

    id: str
    extension_id: str
    updated_at: datetime
