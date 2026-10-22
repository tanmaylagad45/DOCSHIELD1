"""
Comprehensive tests for real authentication, session lifecycle, CSRF protection,
and user isolation (Milestone 4B).
"""

from fastapi import status
from app.core.config import settings
from app.models.document import Document


def test_successful_registration(client):
    payload = {
        "email": "analyst.bob@docshield.ai",
        "password": "StrongPassword2026!",
        "full_name": "Bob Analyst",
        "agree_terms": True,
    }
    response = client.post("/api/v1/auth/register", json=payload)
    assert response.status_code == status.HTTP_201_CREATED
    data = response.json()

    # User validation
    assert data["user"]["email"] == "analyst.bob@docshield.ai"
    assert data["user"]["full_name"] == "Bob Analyst"
    assert "password_hash" not in data["user"]
    assert "password" not in data["user"]
    assert "csrf_token" in data

    # Verify cookies were set
    assert settings.SESSION_COOKIE_NAME in response.cookies
    assert settings.CSRF_COOKIE_NAME in response.cookies


def test_registration_duplicate_email(client):
    payload = {
        "email": "duplicate@docshield.ai",
        "password": "Password123!",
        "full_name": "First User",
    }
    resp1 = client.post("/api/v1/auth/register", json=payload)
    assert resp1.status_code == status.HTTP_201_CREATED

    # Second registration with identical email
    resp2 = client.post("/api/v1/auth/register", json=payload)
    assert resp2.status_code == status.HTTP_409_CONFLICT
    assert "already exists" in resp2.json()["error"]["message"]


def test_registration_weak_password_rejected(client):
    payload = {
        "email": "weakpass@docshield.ai",
        "password": "short",  # Too short, no uppercase, etc.
        "full_name": "Weak Pass User",
    }
    response = client.post("/api/v1/auth/register", json=payload)
    assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY


def test_login_success_and_cookie_generation(client, auth_user):
    payload = {
        "email": "operator.alice@docshield.ai",
        "password": "ValidPassword123!",
        "remember_me": True,
    }
    response = client.post("/api/v1/auth/login", json=payload)
    assert response.status_code == status.HTTP_200_OK
    data = response.json()

    assert data["user"]["email"] == "operator.alice@docshield.ai"
    assert "password_hash" not in data["user"]
    assert "csrf_token" in data
    assert settings.SESSION_COOKIE_NAME in response.cookies
    assert settings.CSRF_COOKIE_NAME in response.cookies


def test_login_invalid_password_returns_generic_401(client, auth_user):
    payload = {
        "email": "operator.alice@docshield.ai",
        "password": "WrongPassword123!",
    }
    response = client.post("/api/v1/auth/login", json=payload)
    assert response.status_code == status.HTTP_401_UNAUTHORIZED
    assert "Invalid email or password" in response.json()["error"]["message"]


def test_login_nonexistent_account_returns_generic_401(client):
    payload = {
        "email": "does.not.exist@docshield.ai",
        "password": "SomePassword123!",
    }
    response = client.post("/api/v1/auth/login", json=payload)
    assert response.status_code == status.HTTP_401_UNAUTHORIZED
    assert "Invalid email or password" in response.json()["error"]["message"]


def test_current_user_me_endpoint(authenticated_client):
    # Test versioned endpoint
    response = authenticated_client.get("/api/v1/auth/me")
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["email"] == "operator.alice@docshield.ai"
    assert "password_hash" not in data

    # Test direct /api/auth/me alias
    alias_resp = authenticated_client.get("/api/auth/me")
    assert alias_resp.status_code == status.HTTP_200_OK
    assert alias_resp.json()["email"] == "operator.alice@docshield.ai"


def test_current_user_unauthenticated_returns_401(client):
    response = client.get("/api/v1/auth/me")
    assert response.status_code == status.HTTP_401_UNAUTHORIZED


def test_logout_and_session_invalidation(client, auth_user):
    # 1. Login
    login_resp = client.post(
        "/api/v1/auth/login",
        json={"email": "operator.alice@docshield.ai", "password": "ValidPassword123!"},
    )
    assert login_resp.status_code == 200
    csrf_token = login_resp.json()["csrf_token"]

    # 2. Verify /me succeeds
    me_resp = client.get("/api/v1/auth/me")
    assert me_resp.status_code == 200

    # 3. Logout (with CSRF token header)
    logout_resp = client.post("/api/v1/auth/logout", headers={"x-csrf-token": csrf_token})
    assert logout_resp.status_code == status.HTTP_200_OK

    # 4. Subsequent call to /me should fail with 401
    after_logout_resp = client.get("/api/v1/auth/me")
    assert after_logout_resp.status_code == status.HTTP_401_UNAUTHORIZED


def test_csrf_protection_on_state_changing_request(client, auth_user):
    # 1. Login to establish cookie session
    login_resp = client.post(
        "/api/v1/auth/login",
        json={"email": "operator.alice@docshield.ai", "password": "ValidPassword123!"},
    )
    assert login_resp.status_code == 200
    valid_csrf = login_resp.json()["csrf_token"]

    doc_payload = {
        "filename": "csrf_test.pdf",
        "file_size": 2048,
        "mime_type": "application/pdf",
        "document_type": "PASSPORT",
        "sha256": "f" * 64,
        "storage_path": "uploads/csrf_test.pdf",
    }

    # 2. Attempt POST /api/v1/documents with missing CSRF header -> 403 Forbidden
    resp_no_csrf = client.post("/api/v1/documents", json=doc_payload)
    assert resp_no_csrf.status_code == status.HTTP_403_FORBIDDEN
    assert "CSRF token validation failed" in resp_no_csrf.json()["error"]["message"]

    # 3. Attempt POST with invalid/mismatched CSRF header -> 403 Forbidden
    resp_bad_csrf = client.post(
        "/api/v1/documents",
        json=doc_payload,
        headers={"x-csrf-token": "forged-invalid-csrf-token"},
    )
    assert resp_bad_csrf.status_code == status.HTTP_403_FORBIDDEN

    # 4. Attempt POST with valid matching CSRF header -> 201 Created
    resp_valid = client.post(
        "/api/v1/documents",
        json=doc_payload,
        headers={"x-csrf-token": valid_csrf},
    )
    assert resp_valid.status_code == status.HTTP_201_CREATED


def test_user_isolation_document_access(client, db_session):
    # 1. Register User A
    user_a_resp = client.post(
        "/api/v1/auth/register",
        json={"email": "usera@docshield.ai", "password": "PasswordA123!", "full_name": "User A"},
    )
    assert user_a_resp.status_code == 201
    csrf_a = user_a_resp.json()["csrf_token"]

    # 2. User A creates Document A
    doc_resp = client.post(
        "/api/v1/documents",
        json={
            "filename": "secret_doc_a.pdf",
            "file_size": 1024,
            "mime_type": "application/pdf",
            "document_type": "PASSPORT",
            "sha256": "1" * 64,
            "storage_path": "uploads/secret_doc_a.pdf",
        },
        headers={"x-csrf-token": csrf_a},
    )
    assert doc_resp.status_code == 201
    doc_a_id = doc_resp.json()["id"]

    # 3. Logout User A
    client.post("/api/v1/auth/logout", headers={"x-csrf-token": csrf_a})

    # 4. Register and Login User B
    user_b_resp = client.post(
        "/api/v1/auth/register",
        json={"email": "userb@docshield.ai", "password": "PasswordB123!", "full_name": "User B"},
    )
    assert user_b_resp.status_code == 201

    # 5. User B lists documents -> should be empty (User A's doc is isolated)
    b_docs_resp = client.get("/api/v1/documents")
    assert b_docs_resp.status_code == 200
    assert len(b_docs_resp.json()) == 0

    # 6. User B attempts to access Document A directly by ID -> 404 Not Found
    b_direct_resp = client.get(f"/api/v1/documents/{doc_a_id}")
    assert b_direct_resp.status_code == status.HTTP_404_NOT_FOUND
