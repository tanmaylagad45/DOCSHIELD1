"""
Assessment schemas for request and response validation.
"""

from datetime import datetime
from typing import Optional, Any, Dict
from pydantic import BaseModel, Field, ConfigDict


class AssessmentBase(BaseModel):
    document_id: str
    status: str = Field(default="PENDING", description="Pipeline state: PENDING, IN_PROGRESS, COMPLETED, FAILED, REVIEW_REQUIRED")
    authenticity_score: Optional[float] = Field(None, ge=0.0, le=100.0)
    recommendation: Optional[str] = Field(None, description="ACCEPT, MANUAL_REVIEW_REQUIRED, REJECT")
    result_data: Optional[Dict[str, Any]] = None
    is_demo: bool = Field(default=False, description="Flag identifying synthetic or demonstrative results")


class AssessmentCreate(AssessmentBase):
    pass


class AssessmentUpdate(BaseModel):
    status: Optional[str] = None
    authenticity_score: Optional[float] = Field(None, ge=0.0, le=100.0)
    recommendation: Optional[str] = None
    result_data: Optional[Dict[str, Any]] = None


class AssessmentRead(BaseModel):
    id: str
    document_id: str
    status: str
    authenticity_score: Optional[float] = None
    recommendation: Optional[str] = None
    result_data: Optional[Dict[str, Any]] = None
    is_demo: bool = False
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)
