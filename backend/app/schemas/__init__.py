"""
Pydantic schemas package for DocShield.
"""

from app.schemas.health import HealthResponse
from app.schemas.user import UserBase, UserCreate, UserRead, UserUpdate
from app.schemas.document import DocumentBase, DocumentCreate, DocumentRead, DocumentUpdate
from app.schemas.assessment import AssessmentBase, AssessmentCreate, AssessmentRead, AssessmentUpdate
from app.schemas.audit import AuditLogRead
from app.schemas.auth import (
    UserRegisterRequest,
    UserLoginRequest,
    AuthResponse,
    CSRFResponse,
    MessageResponse,
)

__all__ = [
    "HealthResponse",
    "UserBase",
    "UserCreate",
    "UserRead",
    "UserUpdate",
    "DocumentBase",
    "DocumentCreate",
    "DocumentRead",
    "DocumentUpdate",
    "AssessmentBase",
    "AssessmentCreate",
    "AssessmentRead",
    "AssessmentUpdate",
    "AuditLogRead",
    "UserRegisterRequest",
    "UserLoginRequest",
    "AuthResponse",
    "CSRFResponse",
    "MessageResponse",
]
