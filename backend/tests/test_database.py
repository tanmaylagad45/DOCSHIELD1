"""
Tests for database engine, session lifecycle, and foreign key constraint enforcement.
"""

import pytest
from sqlalchemy import text
from sqlalchemy.exc import IntegrityError
from app.core.database import check_db_connected
from app.models.user import User
from app.models.document import Document
from app.models.assessment import Assessment


def test_database_connectivity_helper():
    assert check_db_connected() is True


def test_session_commit_and_query(db_session):
    test_user = User(
        email="test_session@docshield.local",
        password_hash="argon2id$mockhash",
        full_name="Session Test User",
    )
    db_session.add(test_user)
    db_session.flush()

    retrieved = db_session.query(User).filter(User.email == "test_session@docshield.local").one()
    assert retrieved.full_name == "Session Test User"


def test_sqlite_foreign_key_enforcement(db_session):
    """
    Verifies that SQLite PRAGMA foreign_keys=ON rejects orphan records with invalid foreign keys.
    """
    orphan_doc = Document(
        id="DOC-ORPHAN-TEST",
        user_id="non-existent-user-uuid",
        filename="unlinked.pdf",
        file_size=1024,
        mime_type="application/pdf",
        sha256="0" * 64,
        storage_path="uploads/unlinked.pdf",
    )
    db_session.add(orphan_doc)

    with pytest.raises(IntegrityError):
        db_session.flush()
