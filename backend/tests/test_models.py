"""
Tests for SQLAlchemy models, constraints, and cascade deletion relationships.
"""

import pytest
from sqlalchemy.exc import IntegrityError
from app.models.user import User
from app.models.document import Document, generate_document_id
from app.models.assessment import Assessment
from app.models.audit import AuditLog


def test_user_email_uniqueness_constraint(db_session):
    user1 = User(email="unique@docshield.local", password_hash="hash1")
    user2 = User(email="unique@docshield.local", password_hash="hash2")

    db_session.add(user1)
    db_session.flush()

    db_session.add(user2)
    with pytest.raises(IntegrityError):
        db_session.flush()


def test_document_defaults_and_id_generation(db_session):
    doc = Document(
        filename="passport_scan.pdf",
        file_size=2048576,
        mime_type="application/pdf",
        sha256="e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
        storage_path="uploads/passport_scan.pdf",
    )
    db_session.add(doc)
    db_session.flush()

    assert doc.id.startswith("DOC-")
    assert doc.status == "UPLOADED"
    assert doc.extracted_fields_count == 0
    assert doc.created_at is not None


def test_assessment_is_demo_isolation(db_session):
    doc = Document(
        filename="license.jpg",
        file_size=102400,
        mime_type="image/jpeg",
        sha256="a" * 64,
        storage_path="uploads/license.jpg",
    )
    db_session.add(doc)
    db_session.flush()

    real_assessment = Assessment(
        document_id=doc.id,
        status="COMPLETED",
        authenticity_score=94.5,
        is_demo=False,
    )
    demo_assessment = Assessment(
        document_id=doc.id,
        status="COMPLETED",
        authenticity_score=99.0,
        is_demo=True,
    )
    db_session.add_all([real_assessment, demo_assessment])
    db_session.flush()

    assert real_assessment.is_demo is False
    assert demo_assessment.is_demo is True


def test_cascade_delete_document_deletes_assessments(db_session):
    doc = Document(
        filename="cascade_test.pdf",
        file_size=512,
        mime_type="application/pdf",
        sha256="b" * 64,
        storage_path="uploads/cascade_test.pdf",
    )
    db_session.add(doc)
    db_session.flush()

    assessment = Assessment(
        document_id=doc.id,
        status="PENDING",
    )
    db_session.add(assessment)
    db_session.flush()

    assessment_id = assessment.id

    # Delete parent document
    db_session.delete(doc)
    db_session.flush()

    # Verify child assessment was automatically cascade deleted
    found = db_session.query(Assessment).filter(Assessment.id == assessment_id).first()
    assert found is None


def test_audit_log_creation(db_session):
    audit = AuditLog(
        entity_type="DOCUMENT",
        entity_id="DOC-TEST-123",
        action="UPLOAD",
        actor="operator@docshield.local",
        details={"fileSize": 1024, "documentType": "PASSPORT"},
    )
    db_session.add(audit)
    db_session.flush()

    assert audit.id is not None
    assert audit.timestamp is not None
    assert audit.details["documentType"] == "PASSPORT"
