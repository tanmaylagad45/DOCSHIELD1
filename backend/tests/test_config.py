"""
Tests for configuration management and environment parsing.
"""

from app.core.config import Settings


def test_default_configuration_settings():
    settings = Settings()
    assert settings.PROJECT_NAME == "DocShield Document Intelligence API"
    assert settings.API_V1_STR == "/api/v1"
    assert "http://localhost:5173" in settings.CORS_ORIGINS
    assert settings.MAX_UPLOAD_SIZE_BYTES > 0


def test_cors_origins_string_parsing():
    settings_json = Settings(CORS_ORIGINS='["http://localhost:5173","http://localhost:8000"]')
    assert "http://localhost:5173" in settings_json.CORS_ORIGINS
    assert "http://localhost:8000" in settings_json.CORS_ORIGINS

    settings_csv = Settings(CORS_ORIGINS="http://localhost:5173, http://127.0.0.1:5173")
    assert "http://localhost:5173" in settings_csv.CORS_ORIGINS
    assert "http://127.0.0.1:5173" in settings_csv.CORS_ORIGINS
