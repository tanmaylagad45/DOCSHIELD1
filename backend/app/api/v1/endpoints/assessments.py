"""
Assessment and verification result endpoints.
"""

from typing import List, Optional
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session
from sqlalchemy import select
from app.core.database import get_db
from app.core.errors import EntityNotFoundError
from app.models.document import Document
from app.models.assessment import Assessment
from app.schemas.assessment import AssessmentCreate, AssessmentRead

router = APIRouter(prefix="/assessments", tags=["Assessments"])


@router.get(
    "",
    response_model=List[AssessmentRead],
    summary="List Assessments",
    description="Returns assessment records. Returns an empty array by default when no assessments exist.",
)
def list_assessments(
    document_id: Optional[str] = Query(None),
    status_filter: Optional[str] = Query(None, alias="status"),
    is_demo: Optional[bool] = Query(None),
    skip: int = 0,
    limit: int = 50,
    db: Session = Depends(get_db),
) -> List[AssessmentRead]:
    stmt = select(Assessment)
    if document_id:
        stmt = stmt.where(Assessment.document_id == document_id)
    if status_filter:
        stmt = stmt.where(Assessment.status == status_filter)
    if is_demo is not None:
        stmt = stmt.where(Assessment.is_demo == is_demo)

    stmt = stmt.offset(skip).limit(limit).order_by(Assessment.created_at.desc())
    return list(db.execute(stmt).scalars().all())


@router.get(
    "/{assessment_id}",
    response_model=AssessmentRead,
    summary="Get Assessment Details",
    description="Fetches verification assessment results, signals, and recommendation.",
)
def get_assessment(assessment_id: str, db: Session = Depends(get_db)) -> AssessmentRead:
    assessment = db.execute(select(Assessment).where(Assessment.id == assessment_id)).scalar_one_or_none()
    if not assessment:
        raise EntityNotFoundError("Assessment", assessment_id)
    return assessment


@router.post(
    "",
    response_model=AssessmentRead,
    status_code=status.HTTP_201_CREATED,
    summary="Create Assessment Record",
    description="Initializes a pending or evaluated verification assessment for a registered document.",
)
def create_assessment(assessment_in: AssessmentCreate, db: Session = Depends(get_db)) -> AssessmentRead:
    # Verify document exists
    doc = db.execute(select(Document).where(Document.id == assessment_in.document_id)).scalar_one_or_none()
    if not doc:
        raise EntityNotFoundError("Document", assessment_in.document_id)

    assessment = Assessment(
        document_id=assessment_in.document_id,
        status=assessment_in.status,
        authenticity_score=assessment_in.authenticity_score,
        recommendation=assessment_in.recommendation,
        result_data=assessment_in.result_data,
        is_demo=assessment_in.is_demo,
    )
    db.add(assessment)
    db.commit()
    db.refresh(assessment)
    return assessment
