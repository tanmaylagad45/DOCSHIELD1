"""
Tests for centralized error handling and standardized response payloads.
"""

from fastapi import status


def test_standardized_404_error_response(client):
    response = client.get("/non-existent-endpoint-path")
    assert response.status_code == status.HTTP_404_NOT_FOUND
    data = response.json()
    assert "error" in data
    assert data["error"]["code"] == 404
    assert data["error"]["type"] == "HTTPException"


def test_standardized_422_validation_error_response(client):
    # Send empty payload to POST /api/v1/users which requires email and password
    response = client.post("/api/v1/users", json={})
    assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY
    data = response.json()
    assert "error" in data
    assert data["error"]["code"] == 422
    assert data["error"]["type"] == "ValidationError"
    assert len(data["error"]["details"]) > 0
