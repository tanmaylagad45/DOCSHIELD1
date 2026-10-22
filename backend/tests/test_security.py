"""
Tests for security utilities, Argon2 hashing, and credential isolation.
"""

import pytest
from app.core.security import hash_password, verify_password, normalize_email
from app.models.user import User
from app.schemas.user import UserRead


def test_argon2_hashing_and_verification():
    plain = "SuperSecurePassword123!"
    hashed = hash_password(plain)

    # Argon2id produces a recognized format starting with $argon2id$
    assert hashed.startswith("$argon2id$")
    assert verify_password(plain, hashed) is True
    assert verify_password("WrongPassword123!", hashed) is False


def test_empty_password_rejection():
    with pytest.raises(ValueError):
        hash_password("")


def test_email_normalization():
    raw_email = "  Operator.Alice@DocShield.AI  "
    normalized = normalize_email(raw_email)
    assert normalized == "operator.alice@docshield.ai"


def test_user_schema_never_exposes_password_hash():
    user = User(
        id="user-uuid-1234",
        email="operator@docshield.ai",
        password_hash="$argon2id$v=19$m=65536,t=3,p=4$secret_hash",
        full_name="Alice Operator",
        role="OPERATOR",
        is_active=True,
    )
    user_read = UserRead.model_validate(user)
    dumped = user_read.model_dump()

    assert "password_hash" not in dumped
    assert "password" not in dumped
    assert dumped["email"] == "operator@docshield.ai"
