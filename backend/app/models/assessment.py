"""
Assessment database model representing AI and cryptographic verification results.
"""

import uuid
from typing import Optional, Any, Dict, TYPE_CHECKING
from sqlalchemy import String, Float, Boolean, JSON, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.models.base import Base, TimestampMixin

if TYPE_CHECKING:
    from app.models.document import Document


class Assessment(Base, TimestampMixin):
    __tablename__ = "assessments"

    id: Mapped[str] = mapped_column(
        String(36),
        primary_key=True,
        default=lambda: str(uuid.uuid4()),
    )
    document_id: Mapped[str] = mapped_column(
        String(36),
        ForeignKey("documents.id", ondelete="CASCADE"),
        index=True,
        nullable=False,
    )
    status: Mapped[str] = mapped_column(
        String(50),
        default="PENDING",  # PENDING, IN_PROGRESS, COMPLETED, FAILED, REVIEW_REQUIRED
        index=True,
        nullable=False,
    )
    authenticity_score: Mapped[Optional[float]] = mapped_column(
        Float,
        nullable=True,
    )
    recommendation: Mapped[Optional[str]] = mapped_column(
        String(50),
        nullable=True,  # ACCEPT, MANUAL_REVIEW_REQUIRED, REJECT
    )
    result_data: Mapped[Optional[Dict[str, Any]]] = mapped_column(
        JSON,
        nullable=True,
    )
    is_demo: Mapped[bool] = mapped_column(
        Boolean,
        default=False,
        nullable=False,
    )

    # Relationship
    document: Mapped["Document"] = relationship(
        "Document",
        back_populates="assessments",
    )

    def __repr__(self) -> str:
        return f"<Assessment(id='{self.id}', document_id='{self.document_id}', status='{self.status}', score={self.authenticity_score})>"
