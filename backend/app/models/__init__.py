"""
SQLAlchemy models package for DocShield.
All models are imported here for clean discovery by Alembic migrations.
"""

from app.models.base import Base, TimestampMixin
from app.models.user import User
from app.models.document import Document, generate_document_id
from app.models.assessment import Assessment
from app.models.audit import AuditLog

__all__ = [
    "Base",
    "TimestampMixin",
    "User",
    "Document",
    "generate_document_id",
    "Assessment",
    "AuditLog",
]
