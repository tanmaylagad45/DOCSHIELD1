"""
Document database model representing ingested document specimens.
Files are persisted on the local filesystem or storage service; only metadata
and storage references are maintained in the database.
"""

import uuid
from typing import List, Optional, TYPE_CHECKING
from sqlalchemy import String, Integer, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.models.base import Base, TimestampMixin

if TYPE_CHECKING:
    from app.models.user import User
    from app.models.assessment import Assessment


def generate_document_id() -> str:
    """Generates a human-friendly document tracking identifier."""
    return f"DOC-{uuid.uuid4().hex[:8].upper()}"


class Document(Base, TimestampMixin):
    __tablename__ = "documents"

    id: Mapped[str] = mapped_column(
        String(36),
        primary_key=True,
        default=generate_document_id,
    )
    user_id: Mapped[Optional[str]] = mapped_column(
        String(36),
        ForeignKey("users.id", ondelete="CASCADE"),
        index=True,
        nullable=True,
    )
    filename: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )
    file_size: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
    )
    mime_type: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
    )
    document_type: Mapped[str] = mapped_column(
        String(50),
        default="PASSPORT",
        nullable=False,
    )
    status: Mapped[str] = mapped_column(
        String(50),
        default="UPLOADED",  # UPLOADED, PROCESSING, VERIFIED, FLAGGED, REJECTED, UNDER_REVIEW
        index=True,
        nullable=False,
    )
    sha256: Mapped[str] = mapped_column(
        String(64),
        index=True,
        nullable=False,
    )
    storage_path: Mapped[str] = mapped_column(
        String(500),
        nullable=False,
    )
    storage_filename: Mapped[Optional[str]] = mapped_column(
        String(255),
        nullable=True,
        index=True,
    )
    file_format: Mapped[Optional[str]] = mapped_column(
        String(20),
        nullable=True,
    )
    extracted_fields_count: Mapped[int] = mapped_column(
        Integer,
        default=0,
        nullable=False,
    )

    # Relationships
    owner: Mapped[Optional["User"]] = relationship(
        "User",
        back_populates="documents",
    )
    assessments: Mapped[List["Assessment"]] = relationship(
        "Assessment",
        back_populates="document",
        cascade="all, delete-orphan",
        passive_deletes=True,
    )

    def __repr__(self) -> str:
        return f"<Document(id='{self.id}', filename='{self.filename}', status='{self.status}')>"
