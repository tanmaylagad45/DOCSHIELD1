"""
Security and password hashing utilities using Argon2.
Raw passwords are never stored, logged, or exposed in API responses.
"""

import re
import secrets
from typing import Optional
from argon2 import PasswordHasher
from argon2.exceptions import VerifyMismatchError, VerificationError, InvalidHashError

# Argon2id hasher with secure parameters (RFC 9106 recommended profile)
_hasher = PasswordHasher(
    time_cost=3,
    memory_cost=65536,  # 64 MiB
    parallelism=4,
    hash_len=32,
    salt_len=16,
)


def hash_password(password: str) -> str:
    """
    Hashes a plain-text password using the Argon2id algorithm.
    """
    if not password:
        raise ValueError("Password cannot be empty.")
    return _hasher.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Verifies a plain-text password against an Argon2id hash.
    Returns False on any mismatch or corrupted hash without raising exceptions.
    """
    if not plain_password or not hashed_password:
        return False
    try:
        return _hasher.verify(hashed_password, plain_password)
    except (VerifyMismatchError, VerificationError, InvalidHashError):
        return False


def needs_rehash(hashed_password: str) -> bool:
    """
    Checks if a password hash needs to be upgraded according to hasher parameters.
    """
    try:
        return _hasher.check_needs_rehash(hashed_password)
    except Exception:
        return True


def normalize_email(email: str) -> str:
    """
    Normalizes an email address to lowercase and strips extraneous whitespace.
    """
    if not email:
        raise ValueError("Email cannot be empty.")
    return email.strip().lower()


def generate_session_token() -> str:
    """
    Generates a cryptographically random 256-bit session token string.
    """
    return secrets.token_hex(32)


def generate_csrf_token() -> str:
    """
    Generates a cryptographically random 256-bit CSRF token string.
    """
    return secrets.token_hex(32)


def validate_password_strength(password: str) -> Optional[str]:
    """
    Enforces server-side password security requirements:
    - Minimum 8 characters
    - At least one uppercase letter [A-Z]
    - At least one lowercase letter [a-z]
    - At least one digit or special character
    Returns None if valid, or an error message describing the requirement.
    """
    if not password or len(password) < 8:
        return "Password must be at least 8 characters in length."
    if not re.search(r"[A-Z]", password):
        return "Password must contain at least one uppercase letter (A-Z)."
    if not re.search(r"[a-z]", password):
        return "Password must contain at least one lowercase letter (a-z)."
    if not re.search(r"[0-9!@#$%^&*(),.?\":{}|<>\-_+=]", password):
        return "Password must contain at least one number or special character."
    return None
