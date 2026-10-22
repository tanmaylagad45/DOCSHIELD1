"""
Immutable audit log database model for tracking system and operator actions.
"""

import uuid
from datetime import datetime
from typing import Optional, Any, Dict
from sqlalchemy import String, JSON, DateTime, func
from sqlalchemy.orm import Mapped, mapped_column
from app.models.base import Base


class AuditLog(Base):
    __tablename__ = "audit_logs"

    id: Mapped[str] = mapped_column(
        String(36),
        primary_key=True,
        default=lambda: str(uuid.uuid4()),
    )
    entity_type: Mapped[str] = mapped_column(
        String(50),
        index=True,
        nullable=False,  # USER, DOCUMENT, ASSESSMENT, AUTH
    )
    entity_id: Mapped[str] = mapped_column(
        String(100),
        index=True,
        nullable=False,
    )
    action: Mapped[str] = mapped_column(
        String(50),
        nullable=False,  # UPLOAD, EVALUATE, STATUS_UPDATE, LOGIN
    )
    actor: Mapped[str] = mapped_column(
        String(255),
        nullable=False,  # Operator email, system, or anonymous
    )
    details: Mapped[Optional[Dict[str, Any]]] = mapped_column(
        JSON,
        nullable=True,
    )
    timestamp: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )

    def __repr__(self) -> str:
        return f"<AuditLog(id='{self.id}', action='{self.action}', entity='{self.entity_type}:{self.entity_id}')>"
