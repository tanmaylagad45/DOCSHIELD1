"""
Comprehensive automated tests for secure document management (Milestone 4C).
Covers:
- Authenticated successful upload (PDF, PNG, JPEG)
- Unauthenticated rejection across all endpoints
- Listing and pagination with response headers
- Metadata retrieval (no physical storage path leakage)
- Secure download with attachment headers
- Document deletion (database record and storage file cleanup)
- Multi-user isolation (access, download, and delete protection)
- Extension whitelisting and signature mismatch detection
- Empty and oversized file rejection
- Path traversal defense
- CSRF protection on mutation endpoints
"""

import os
import hashlib
import pytest
from fastapi import status

VALID_PDF_BYTES = b"%PDF-1.4\n1 0 obj\n<<>>\nendobj\ntrailer\n<<>>\n%%EOF"
VALID_PNG_BYTES = b"\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00\x00\x00\x01\x00\x00\x00\x01\x08\x06\x00\x00\x00\x1f\x15c4\x00\x00\x00\nIDATx\x9cc\x00\x01\x00\x00\x05\x00\x01\r\n-\xb4\x00\x00\x00\x00IEND\xaeB`\x82"
VALID_JPEG_BYTES = b"\xff\xd8\xff\xe0\x00\x10JFIF\x00\x01\x01\x01\x00`\x00`\x00\x00\xff\xdb\x00C\x00\xff\xd9"


@pytest.fixture
def isolate_upload_dir(tmp_path, monkeypatch):
    """Directs settings.UPLOAD_DIR to a clean temporary directory for test isolation."""
    upload_path = str(tmp_path / "test_uploads")
    os.makedirs(upload_path, exist_ok=True)
    monkeypatch.setattr("app.core.config.settings.UPLOAD_DIR", upload_path)
    monkeypatch.setattr("app.core.storage.settings.UPLOAD_DIR", upload_path)
    return upload_path


def test_authenticated_upload_pdf(authenticated_client, isolate_upload_dir):
    """Validates successful upload of a valid PDF document with metadata registration."""
    files = {"file": ("my_passport.pdf", VALID_PDF_BYTES, "application/pdf")}
    data = {"document_type": "PASSPORT"}

    response = authenticated_client.post("/api/v1/documents/upload", files=files, data=data)
    assert response.status_code == status.HTTP_201_CREATED

    doc = response.json()
    assert doc["id"].startswith("DOC-")
    assert doc["filename"] == "my_passport.pdf"
    assert doc["mime_type"] == "application/pdf"
    assert doc["file_format"] == "PDF"
    assert doc["document_type"] == "PASSPORT"
    assert doc["status"] == "UPLOADED"
    assert doc["file_size"] == len(VALID_PDF_BYTES)
    assert doc["sha256"] == hashlib.sha256(VALID_PDF_BYTES).hexdigest()

    # Crucial security check: physical storage path must never be exposed
    assert "storage_path" not in doc
    assert "storage_filename" not in doc


def test_authenticated_upload_png_and_jpeg(authenticated_client, isolate_upload_dir):
    """Validates successful upload for PNG and JPEG image files."""
    # PNG
    png_resp = authenticated_client.post(
        "/api/v1/documents/upload",
        files={"file": ("id_front.png", VALID_PNG_BYTES, "image/png")},
        data={"document_type": "NATIONAL_ID"},
    )
    assert png_resp.status_code == status.HTTP_201_CREATED
    assert png_resp.json()["file_format"] == "PNG"
    assert png_resp.json()["mime_type"] == "image/png"

    # JPEG
    jpeg_resp = authenticated_client.post(
        "/api/v1/documents/upload",
        files={"file": ("driver_license.jpg", VALID_JPEG_BYTES, "image/jpeg")},
        data={"document_type": "DRIVING_LICENSE"},
    )
    assert jpeg_resp.status_code == status.HTTP_201_CREATED
    assert jpeg_resp.json()["file_format"] == "JPEG"
    assert jpeg_resp.json()["mime_type"] == "image/jpeg"


def test_unauthenticated_requests_rejected(client, isolate_upload_dir):
    """Validates that all document endpoints reject unauthenticated requests with 401."""
    # Upload
    files = {"file": ("doc.pdf", VALID_PDF_BYTES, "application/pdf")}
    assert client.post("/api/v1/documents/upload", files=files).status_code == status.HTTP_401_UNAUTHORIZED

    # List
    assert client.get("/api/v1/documents").status_code == status.HTTP_401_UNAUTHORIZED

    # Get
    assert client.get("/api/v1/documents/DOC-12345678").status_code == status.HTTP_401_UNAUTHORIZED

    # Download
    assert client.get("/api/v1/documents/DOC-12345678/download").status_code == status.HTTP_401_UNAUTHORIZED

    # Delete
    assert client.delete("/api/v1/documents/DOC-12345678").status_code == status.HTTP_401_UNAUTHORIZED


def test_documents_listing_and_pagination(authenticated_client, isolate_upload_dir):
    """Validates document listing, pagination headers, and filtering."""
    # Upload 3 test documents
    for i in range(3):
        authenticated_client.post(
            "/api/v1/documents/upload",
            files={"file": (f"doc_{i}.pdf", VALID_PDF_BYTES, "application/pdf")},
            data={"document_type": "PASSPORT" if i < 2 else "UTILITY_BILL"},
        )

    # Page 1 (limit 2)
    p1_resp = authenticated_client.get("/api/v1/documents?page=1&page_size=2")
    assert p1_resp.status_code == status.HTTP_200_OK
    items = p1_resp.json()
    assert len(items) == 2
    assert p1_resp.headers["X-Total-Count"] == "3"
    assert p1_resp.headers["X-Page"] == "1"
    assert p1_resp.headers["X-Total-Pages"] == "2"

    # Page 2 (limit 2)
    p2_resp = authenticated_client.get("/api/v1/documents?page=2&page_size=2")
    assert p2_resp.status_code == status.HTTP_200_OK
    assert len(p2_resp.json()) == 1

    # Filter by classification
    filtered_resp = authenticated_client.get("/api/v1/documents?type=UTILITY_BILL")
    assert filtered_resp.status_code == status.HTTP_200_OK
    assert len(filtered_resp.json()) == 1
    assert filtered_resp.json()[0]["document_type"] == "UTILITY_BILL"


def test_get_document_metadata(authenticated_client, isolate_upload_dir):
    """Validates retrieving specific document metadata by ID."""
    upload_resp = authenticated_client.post(
        "/api/v1/documents/upload",
        files={"file": ("sample.pdf", VALID_PDF_BYTES, "application/pdf")},
    )
    doc_id = upload_resp.json()["id"]

    get_resp = authenticated_client.get(f"/api/v1/documents/{doc_id}")
    assert get_resp.status_code == status.HTTP_200_OK
    data = get_resp.json()
    assert data["id"] == doc_id
    assert data["filename"] == "sample.pdf"
    assert "storage_path" not in data


def test_download_document(authenticated_client, isolate_upload_dir):
    """Validates document binary download with safe attachment disposition."""
    upload_resp = authenticated_client.post(
        "/api/v1/documents/upload",
        files={"file": ("verified_specimen.pdf", VALID_PDF_BYTES, "application/pdf")},
    )
    doc_id = upload_resp.json()["id"]

    dl_resp = authenticated_client.get(f"/api/v1/documents/{doc_id}/download")
    assert dl_resp.status_code == status.HTTP_200_OK
    assert dl_resp.content == VALID_PDF_BYTES
    assert 'attachment; filename="verified_specimen.pdf"' in dl_resp.headers["Content-Disposition"]
    assert dl_resp.headers["X-Content-Type-Options"] == "nosniff"


def test_delete_document_cleans_db_and_storage(authenticated_client, isolate_upload_dir):
    """Validates that document deletion removes both the database record and storage file."""
    upload_resp = authenticated_client.post(
        "/api/v1/documents/upload",
        files={"file": ("to_delete.pdf", VALID_PDF_BYTES, "application/pdf")},
    )
    doc_id = upload_resp.json()["id"]

    # Verify physical file exists in isolated storage
    stored_files_before = os.listdir(isolate_upload_dir)
    assert len(stored_files_before) == 1

    # Delete
    del_resp = authenticated_client.delete(f"/api/v1/documents/{doc_id}")
    assert del_resp.status_code == status.HTTP_200_OK
    assert del_resp.json()["success"] is True

    # Verify record is gone from DB
    assert authenticated_client.get(f"/api/v1/documents/{doc_id}").status_code == status.HTTP_404_NOT_FOUND

    # Verify physical file is cleaned up from storage directory
    stored_files_after = os.listdir(isolate_upload_dir)
    assert len(stored_files_after) == 0


def test_user_isolation_document_access(client, authenticated_client, isolate_upload_dir):
    """
    Validates that User B cannot list, retrieve, download, or delete User A's documents.
    Returns 404 to avoid leaking existence across accounts.
    """
    # 1. User A (authenticated_client) uploads document
    upload_resp = authenticated_client.post(
        "/api/v1/documents/upload",
        files={"file": ("alice_secret.pdf", VALID_PDF_BYTES, "application/pdf")},
    )
    doc_id = upload_resp.json()["id"]

    # 2. Register and authenticate as User B (Bob)
    client.post(
        "/api/v1/auth/register",
        json={
            "email": "operator.bob@docshield.ai",
            "password": "ValidPassword456!",
            "full_name": "Bob Operator",
            "role": "OPERATOR",
        },
    )
    login_resp = client.post(
        "/api/v1/auth/login",
        json={"email": "operator.bob@docshield.ai", "password": "ValidPassword456!"},
    )
    csrf_token = login_resp.json()["csrf_token"]
    client.headers["x-csrf-token"] = csrf_token

    # 3. User B cannot see User A's document in list
    b_list = client.get("/api/v1/documents").json()
    assert not any(d["id"] == doc_id for d in b_list)

    # 4. User B cannot retrieve metadata (returns 404, not 403, preventing enumeration)
    assert client.get(f"/api/v1/documents/{doc_id}").status_code == status.HTTP_404_NOT_FOUND

    # 5. User B cannot download document
    assert client.get(f"/api/v1/documents/{doc_id}/download").status_code == status.HTTP_404_NOT_FOUND

    # 6. User B cannot delete document
    assert client.delete(f"/api/v1/documents/{doc_id}").status_code == status.HTTP_404_NOT_FOUND


def test_unsupported_file_extension(authenticated_client, isolate_upload_dir):
    """Validates that unsupported file extensions are rejected."""
    files = {"file": ("malicious.exe", b"MZ\x90\x00\x03\x00\x00\x00", "application/octet-stream")}
    resp = authenticated_client.post("/api/v1/documents/upload", files=files)
    assert resp.status_code == status.HTTP_400_BAD_REQUEST
    assert "Unsupported file extension" in resp.json()["error"]["message"]


def test_mismatched_file_signature(authenticated_client, isolate_upload_dir):
    """
    Validates rejection when file extension does not match binary signature
    (e.g., claiming to be a PNG while containing random text).
    """
    fake_png = b"This is just plain text, not a PNG file!"
    files = {"file": ("fake_credential.png", fake_png, "image/png")}
    resp = authenticated_client.post("/api/v1/documents/upload", files=files)
    assert resp.status_code == status.HTTP_400_BAD_REQUEST
    assert "Invalid file format or malformed file signature" in resp.json()["error"]["message"]


def test_empty_file_rejected(authenticated_client, isolate_upload_dir):
    """Validates rejection of 0-byte empty files."""
    files = {"file": ("empty.pdf", b"", "application/pdf")}
    resp = authenticated_client.post("/api/v1/documents/upload", files=files)
    assert resp.status_code == status.HTTP_400_BAD_REQUEST
    assert "empty" in resp.json()["error"]["message"].lower()


def test_oversized_file_rejected_and_cleaned_up(authenticated_client, isolate_upload_dir, monkeypatch):
    """Validates rejection of files exceeding the size limit and ensures no partial file remains."""
    # Temporarily set max limit to 1 KB for test
    monkeypatch.setattr("app.core.config.settings.MAX_UPLOAD_SIZE_BYTES", 1024)

    oversized_data = VALID_PDF_BYTES + (b"X" * 2048)
    files = {"file": ("large_doc.pdf", oversized_data, "application/pdf")}

    resp = authenticated_client.post("/api/v1/documents/upload", files=files)
    assert resp.status_code == status.HTTP_413_REQUEST_ENTITY_TOO_LARGE

    # Ensure no partial file was left in storage
    assert len(os.listdir(isolate_upload_dir)) == 0


def test_path_traversal_sanitized(authenticated_client, isolate_upload_dir):
    """Validates that path traversal sequences in filenames are completely sanitized."""
    files = {"file": ("../../../../etc/passwd.pdf", VALID_PDF_BYTES, "application/pdf")}
    resp = authenticated_client.post("/api/v1/documents/upload", files=files)
    assert resp.status_code == status.HTTP_201_CREATED
    assert resp.json()["filename"] == "passwd.pdf"


def test_csrf_protection_on_upload_and_delete(client, auth_user, isolate_upload_dir):
    """Validates that state-changing document requests fail with 403 if CSRF token is missing or invalid."""
    # Login to acquire session cookie without setting X-CSRF-Token header
    client.post(
        "/api/v1/auth/login",
        json={"email": "operator.alice@docshield.ai", "password": "ValidPassword123!"},
    )

    # Attempt upload without CSRF header
    files = {"file": ("test.pdf", VALID_PDF_BYTES, "application/pdf")}
    upload_resp = client.post("/api/v1/documents/upload", files=files)
    assert upload_resp.status_code == status.HTTP_403_FORBIDDEN

    # Attempt delete without CSRF header
    del_resp = client.delete("/api/v1/documents/DOC-FAKE1234")
    assert del_resp.status_code == status.HTTP_403_FORBIDDEN
