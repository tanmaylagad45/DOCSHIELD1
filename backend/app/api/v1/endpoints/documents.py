"""
Document management endpoints.
"""

from typing import List, Optional
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session
from sqlalchemy import select
from app.core.database import get_db
from app.core.errors import EntityNotFoundError
from app.models.document import Document
from app.schemas.document import DocumentCreate, DocumentRead, DocumentUpdate

router = APIRouter(prefix="/documents", tags=["Documents"])


@router.get(
    "",
    response_model=List[DocumentRead],
    summary="List Documents",
    description="Returns ingested document records. Returns an empty array by default when no documents exist.",
)
def list_documents(
    status_filter: Optional[str] = Query(None, alias="status"),
    document_type: Optional[str] = Query(None, alias="type"),
    skip: int = 0,
    limit: int = 50,
    db: Session = Depends(get_db),
) -> List[DocumentRead]:
    stmt = select(Document)
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
    description="Fetches document metadata and processing status.",
)
def get_document(document_id: str, db: Session = Depends(get_db)) -> DocumentRead:
    doc = db.execute(select(Document).where(Document.id == document_id)).scalar_one_or_none()
    if not doc:
        raise EntityNotFoundError("Document", document_id)
    return doc


@router.post(
    "",
    response_model=DocumentRead,
    status_code=status.HTTP_201_CREATED,
    summary="Register Document Metadata",
    description="Registers an ingested document metadata record. Actual file bytes are stored on disk, not in the database.",
)
def create_document(doc_in: DocumentCreate, db: Session = Depends(get_db)) -> DocumentRead:
    doc = Document(
        user_id=doc_in.user_id,
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
