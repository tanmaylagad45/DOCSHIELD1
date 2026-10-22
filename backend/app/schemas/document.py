"""
Document schemas for request and response validation.
"""

from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field, ConfigDict


class DocumentBase(BaseModel):
    filename: str = Field(..., max_length=255)
    mime_type: str = Field(..., max_length=100)
    document_type: str = Field(default="PASSPORT", description="Regulatory document classification")


class DocumentCreate(DocumentBase):
    file_size: int = Field(gt=0, description="Size in bytes")
    sha256: str = Field(..., min_length=64, max_length=64, description="Cryptographic SHA-256 digest")
    storage_path: str = Field(..., max_length=500, description="Filesystem or object storage reference")
    user_id: Optional[str] = None


class DocumentUpdate(BaseModel):
    status: Optional[str] = Field(None, description="Updated processing state")
    document_type: Optional[str] = None
    extracted_fields_count: Optional[int] = Field(None, ge=0)


class DocumentRead(BaseModel):
    id: str
    user_id: Optional[str] = None
    filename: str
    file_size: int
    mime_type: str
    document_type: str
    status: str
    sha256: str
    storage_path: str
    extracted_fields_count: int = 0
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)
