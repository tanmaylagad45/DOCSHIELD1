"""
Document management endpoints.
Enforces authentication, user isolation, and CSRF protection.
"""

from typing import List, Optional
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session
from sqlalchemy import select

from app.core.database import get_db
from app.core.errors import EntityNotFoundError
from app.core.auth import get_current_user, verify_csrf
from app.models.user import User
from app.models.document import Document
from app.schemas.document import DocumentCreate, DocumentRead, DocumentUpdate

router = APIRouter(prefix="/documents", tags=["Documents"])


@router.get(
    "",
    response_model=List[DocumentRead],
    summary="List Documents",
    description="Returns ingested document records belonging to the authenticated user. Empty array by default.",
)
def list_documents(
    status_filter: Optional[str] = Query(None, alias="status"),
    document_type: Optional[str] = Query(None, alias="type"),
    skip: int = 0,
    limit: int = 50,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> List[DocumentRead]:
    # Enforce user isolation: only return documents owned by the authenticated user
    stmt = select(Document).where(Document.user_id == current_user.id)

    if status_filter:
        stmt = stmt.where(Document.status == status_filter)
    if document_type:
        stmt = stmt.where(Document.document_type == document_type)

    stmt = stmt.offset(skip).limit(limit).order_by(Document.created_at.desc())
    return list(db.execute(stmt).scalars().all())


@router.get(
    "/{document_id}",
    response_model=DocumentRead,
    summary="Get Document Details",
    description="Fetches document metadata and processing status. Ensures users only access their own documents.",
)
def get_document(
    document_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> DocumentRead:
    # Enforce user isolation
    doc = db.execute(
        select(Document).where(
            Document.id == document_id,
            Document.user_id == current_user.id,
        )
    ).scalar_one_or_none()

    if not doc:
        raise EntityNotFoundError("Document", document_id)
    return doc


@router.post(
    "",
    response_model=DocumentRead,
    status_code=status.HTTP_201_CREATED,
    summary="Register Document Metadata",
    description="Registers an ingested document metadata record bound to the authenticated user.",
    dependencies=[Depends(verify_csrf)],
)
def create_document(
    doc_in: DocumentCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> DocumentRead:
    doc = Document(
        user_id=current_user.id,  # Strictly bind to authenticated user
        filename=doc_in.filename,
        file_size=doc_in.file_size,
        mime_type=doc_in.mime_type,
        document_type=doc_in.document_type,
        status="UPLOADED",
        sha256=doc_in.sha256,
        storage_path=doc_in.storage_path,
        extracted_fields_count=0,
    )
    db.add(doc)
    db.commit()
    db.refresh(doc)
    return doc
