"""
Document management endpoints.
Enforces authentication, user isolation, secure file storage, and CSRF protection.
"""

import os
from typing import List, Optional
from fastapi import (
    APIRouter,
    Depends,
    Query,
    Request,
    Response,
    UploadFile,
    File,
    Form,
    status,
)
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from sqlalchemy import select, func

from app.core.database import get_db
from app.core.errors import EntityNotFoundError, DocShieldException
from app.core.auth import get_current_user, verify_csrf
from app.core.storage import (
    save_upload_stream,
    resolve_storage_path,
    remove_storage_file,
)
from app.models.user import User
from app.models.document import Document
from app.schemas.document import (
    DocumentCreate,
    DocumentRead,
    DocumentDeleteResponse,
)

router = APIRouter(prefix="/documents", tags=["Documents"])


@router.get(
    "",
    response_model=List[DocumentRead],
    summary="List Documents",
    description="Returns ingested document records belonging to the authenticated user with pagination support.",
)
def list_documents(
    response: Response,
    status_filter: Optional[str] = Query(None, alias="status"),
    document_type: Optional[str] = Query(None, alias="type"),
    page: int = Query(1, ge=1, description="Page number (1-indexed)"),
    page_size: int = Query(50, ge=1, le=100, description="Items per page"),
    skip: Optional[int] = Query(None, ge=0, description="Explicit record offset"),
    limit: Optional[int] = Query(None, ge=1, le=100, description="Explicit record limit"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> List[DocumentRead]:
    # Calculate offset and limit
    actual_skip = skip if skip is not None else (page - 1) * page_size
    actual_limit = limit if limit is not None else page_size

    # Enforce user isolation: only query documents owned by the authenticated user
    base_query = select(Document).where(Document.user_id == current_user.id)

    if status_filter:
        base_query = base_query.where(Document.status == status_filter)
    if document_type:
        base_query = base_query.where(Document.document_type == document_type)

    # Compute total count for pagination headers
    total_count = db.execute(
        select(func.count()).select_from(base_query.subquery())
    ).scalar_one()

    # Query paginated records
    paged_stmt = (
        base_query.offset(actual_skip)
        .limit(actual_limit)
        .order_by(Document.created_at.desc())
    )
    docs = list(db.execute(paged_stmt).scalars().all())

    # Set standard pagination response headers
    total_pages = (total_count + actual_limit - 1) // actual_limit if total_count > 0 else 1
    response.headers["X-Total-Count"] = str(total_count)
    response.headers["X-Page"] = str(page)
    response.headers["X-Page-Size"] = str(actual_limit)
    response.headers["X-Total-Pages"] = str(total_pages)

    return docs


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
    # Enforce user isolation: 404 if not owned by current user (prevents enumeration)
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
    "/upload",
    response_model=DocumentRead,
    status_code=status.HTTP_201_CREATED,
    summary="Upload Document File",
    description="Securely uploads a document specimen (PDF, PNG, JPEG), validates magic bytes, streams to isolated storage, and registers metadata.",
    dependencies=[Depends(verify_csrf)],
)
async def upload_document_file(
    file: UploadFile = File(..., description="Document file binary (PDF, PNG, JPEG, max 10MB)"),
    document_type: str = Form("PASSPORT", description="Regulatory document classification"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> DocumentRead:
    return await _process_and_save_upload(
        file=file,
        document_type=document_type,
        current_user=current_user,
        db=db,
    )


@router.post(
    "",
    response_model=DocumentRead,
    status_code=status.HTTP_201_CREATED,
    summary="Upload Document or Register Metadata",
    description="Accepts multipart/form-data for real binary upload, or application/json for metadata registration.",
    dependencies=[Depends(verify_csrf)],
)
async def create_or_upload_document(
    request: Request,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> DocumentRead:
    content_type = request.headers.get("content-type", "")

    if "multipart/form-data" in content_type:
        form = await request.form()
        uploaded_file = form.get("file")
        if not uploaded_file or not isinstance(uploaded_file, UploadFile):
            raise DocShieldException(
                message="Multipart request missing required 'file' binary field.",
                status_code=status.HTTP_400_BAD_REQUEST,
            )
        doc_type_raw = form.get("document_type", "PASSPORT")
        document_type = str(doc_type_raw) if doc_type_raw else "PASSPORT"

        return await _process_and_save_upload(
            file=uploaded_file,
            document_type=document_type,
            current_user=current_user,
            db=db,
        )
    elif "application/json" in content_type:
        body = await request.json()
        doc_in = DocumentCreate(**body)
        doc = Document(
            user_id=current_user.id,
            filename=doc_in.filename,
            file_size=doc_in.file_size,
            mime_type=doc_in.mime_type,
            document_type=doc_in.document_type.upper(),
            status="UPLOADED",
            sha256=doc_in.sha256,
            storage_path=doc_in.storage_path,
            extracted_fields_count=0,
        )
        db.add(doc)
        db.commit()
        db.refresh(doc)
        return doc
    else:
        raise DocShieldException(
            message="Content-Type must be 'multipart/form-data' or 'application/json'.",
            status_code=status.HTTP_415_UNSUPPORTED_MEDIA_TYPE,
        )


async def _process_and_save_upload(
    file: UploadFile,
    document_type: str,
    current_user: User,
    db: Session,
) -> DocumentRead:
    """
    Internal pipeline helper to stream upload, validate signatures, and record in DB.
    """
    (
        sanitized_filename,
        storage_filename,
        file_size,
        sha256_hash,
        mime_type,
        file_format,
    ) = await save_upload_stream(file)

    # Clean document type tag
    clean_doc_type = document_type.strip().upper() if document_type else "PASSPORT"

    doc = Document(
        user_id=current_user.id,
        filename=sanitized_filename,
        file_size=file_size,
        mime_type=mime_type,
        file_format=file_format,
        document_type=clean_doc_type,
        status="UPLOADED",
        sha256=sha256_hash,
        storage_filename=storage_filename,
        storage_path=storage_filename,  # Stored as storage filename reference
        extracted_fields_count=0,
    )

    try:
        db.add(doc)
        db.commit()
        db.refresh(doc)
    except Exception:
        db.rollback()
        # Clean up storage file on database commit failure
        remove_storage_file(storage_filename, storage_filename)
        raise

    return doc


@router.get(
    "/{document_id}/download",
    summary="Download Document File",
    description="Streams the authentic binary document for the owner with safe attachment headers.",
)
def download_document(
    document_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    # Enforce user isolation: 404 if not found or belongs to another user
    doc = db.execute(
        select(Document).where(
            Document.id == document_id,
            Document.user_id == current_user.id,
        )
    ).scalar_one_or_none()

    if not doc:
        raise EntityNotFoundError("Document", document_id)

    file_path = resolve_storage_path(doc.storage_filename, doc.storage_path)
    if not file_path or not os.path.exists(file_path):
        raise EntityNotFoundError("Document Storage File", document_id)

    # Safe attachment download preventing browser execution
    return FileResponse(
        path=file_path,
        filename=doc.filename,
        media_type=doc.mime_type,
        headers={
            "Content-Disposition": f'attachment; filename="{doc.filename}"',
            "X-Content-Type-Options": "nosniff",
            "Cache-Control": "private, no-cache, no-store, must-revalidate",
        },
    )


@router.delete(
    "/{document_id}",
    response_model=DocumentDeleteResponse,
    summary="Delete Document",
    description="Permanently deletes the document record and removes the file binary from storage.",
    dependencies=[Depends(verify_csrf)],
)
def delete_document(
    document_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> DocumentDeleteResponse:
    # Enforce user isolation: 404 if not found or belongs to another user
    doc = db.execute(
        select(Document).where(
            Document.id == document_id,
            Document.user_id == current_user.id,
        )
    ).scalar_one_or_none()

    if not doc:
        raise EntityNotFoundError("Document", document_id)

    # 1. Safely remove physical file from disk
    remove_storage_file(doc.storage_filename, doc.storage_path)

    # 2. Remove document record from database
    db.delete(doc)
    db.commit()

    return DocumentDeleteResponse(
        success=True,
        message=f"Document '{doc.filename}' ({document_id}) was successfully deleted.",
        id=document_id,
    )
