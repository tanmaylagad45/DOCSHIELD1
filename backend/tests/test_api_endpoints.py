"""
Tests for API v1 resource endpoints: Users, Documents, Assessments.
"""

from fastapi import status


def test_user_creation_and_listing(client):
    payload = {
        "email": "  NewOperator@DocShield.ai  ",
        "password": "CorrectHorseBatteryStaple123!",
        "full_name": "New Operator",
        "role": "OPERATOR",
    }
    response = client.post("/api/v1/users", json=payload)
    assert response.status_code == status.HTTP_201_CREATED
    data = response.json()
    assert data["email"] == "newoperator@docshield.ai"
    assert "password_hash" not in data
    assert "password" not in data

    # Verify duplicate email conflict returns 409
    dup_response = client.post("/api/v1/users", json=payload)
    assert dup_response.status_code == status.HTTP_409_CONFLICT
    err_data = dup_response.json()
    assert "already exists" in err_data["error"]["message"]


def test_documents_empty_by_default(client):
    """
    Validates clean zero-state data requirement:
    No documents exist by default.
    """
    response = client.get("/api/v1/documents")
    assert response.status_code == status.HTTP_200_OK
    assert response.json() == []


def test_document_not_found(client):
    response = client.get("/api/v1/documents/DOC-NONEXISTENT")
    assert response.status_code == status.HTTP_404_NOT_FOUND
    data = response.json()
    assert data["error"]["code"] == 404
    assert "DOC-NONEXISTENT" in data["error"]["message"]


def test_document_metadata_registration(client):
    payload = {
        "filename": "passport_scan.pdf",
        "file_size": 1048576,
        "mime_type": "application/pdf",
        "document_type": "PASSPORT",
        "sha256": "c" * 64,
        "storage_path": "uploads/passport_scan.pdf",
    }
    response = client.post("/api/v1/documents", json=payload)
    assert response.status_code == status.HTTP_201_CREATED
    data = response.json()
    assert data["id"].startswith("DOC-")
    assert data["status"] == "UPLOADED"
    assert data["filename"] == "passport_scan.pdf"


def test_assessments_empty_by_default(client):
    """
    Validates clean zero-state requirement:
    No assessments exist by default.
    """
    response = client.get("/api/v1/assessments")
    assert response.status_code == status.HTTP_200_OK
    assert response.json() == []


def test_assessment_not_found(client):
    response = client.get("/api/v1/assessments/non-existent-uuid")
    assert response.status_code == status.HTTP_404_NOT_FOUND
