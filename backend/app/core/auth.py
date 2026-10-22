"""
Server-managed session authentication, cookie management, and CSRF protection.
"""

import secrets
from datetime import datetime, timezone, timedelta
from typing import Optional
from fastapi import Request, Response, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import select

from app.core.config import settings
from app.core.database import get_db
from app.models.user import User
from app.models.session import Session as DbSession


def set_auth_cookies(
    response: Response,
    session_token: str,
    csrf_token: str,
    remember_me: bool = False,
) -> None:
    """
    Sets secure HTTP-only session cookie and readable CSRF token cookie.
    """
    max_age_seconds = (
        settings.SESSION_REMEMBER_ME_DAYS * 86400
        if remember_me
        else settings.SESSION_EXPIRE_HOURS * 3600
    )

    # 1. Server-managed session cookie (Strictly HTTP-Only)
    response.set_cookie(
        key=settings.SESSION_COOKIE_NAME,
        value=session_token,
        max_age=max_age_seconds,
        expires=max_age_seconds,
        path="/",
        secure=settings.COOKIE_SECURE,
        httponly=True,  # Blocks JavaScript access (XSS defense)
        samesite=settings.COOKIE_SAMESITE,
    )

    # 2. CSRF cookie (Readable by frontend client for Double-Submit protection)
    response.set_cookie(
        key=settings.CSRF_COOKIE_NAME,
        value=csrf_token,
        max_age=max_age_seconds,
        expires=max_age_seconds,
        path="/",
        secure=settings.COOKIE_SECURE,
        httponly=False,  # Frontend reads to inject in X-CSRF-Token header
        samesite=settings.COOKIE_SAMESITE,
    )


def clear_auth_cookies(response: Response) -> None:
    """
    Clears both session and CSRF cookies on logout or invalidation.
    """
    response.delete_cookie(
        key=settings.SESSION_COOKIE_NAME,
        path="/",
        secure=settings.COOKIE_SECURE,
        httponly=True,
        samesite=settings.COOKIE_SAMESITE,
    )
    response.delete_cookie(
        key=settings.CSRF_COOKIE_NAME,
        path="/",
        secure=settings.COOKIE_SECURE,
        httponly=False,
        samesite=settings.COOKIE_SAMESITE,
    )


def get_session_token_from_request(request: Request) -> Optional[str]:
    """
    Retrieves the active session token from HTTP cookies (or Bearer Authorization header).
    """
    # 1. Cookie check (primary)
    token = request.cookies.get(settings.SESSION_COOKIE_NAME)
    if token:
        return token

    # 2. Authorization header fallback (useful for automated testing)
    auth_header = request.headers.get("Authorization")
    if auth_header and auth_header.startswith("Bearer "):
        return auth_header.split(" ", 1)[1].strip()

    return None


def get_current_user(
    request: Request,
    db: Session = Depends(get_db),
) -> User:
    """
    FastAPI dependency: Resolves the authenticated user from the active session.
    Enforces expiration checks and instant session revocation.
    """
    token = get_session_token_from_request(request)
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required. Please sign in.",
            headers={"WWW-Authenticate": "Cookie"},
        )

    # Query active session
    stmt = select(DbSession).where(
        DbSession.session_token == token,
        DbSession.is_revoked == False,
    )
    session_record = db.execute(stmt).scalar_one_or_none()

    if not session_record:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired session. Please sign in again.",
            headers={"WWW-Authenticate": "Cookie"},
        )

    # Check expiration
    now_utc = datetime.now(timezone.utc)
    expires_at = session_record.expires_at
    if expires_at.tzinfo is None:
        expires_at = expires_at.replace(tzinfo=timezone.utc)

    if expires_at < now_utc:
        session_record.is_revoked = True
        db.commit()
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Session has expired. Please sign in again.",
            headers={"WWW-Authenticate": "Cookie"},
        )

    # Load associated user
    user = db.get(User, session_record.user_id)
    if not user or not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User account is inactive or disabled.",
        )

    # Update last accessed timestamp
    session_record.last_accessed_at = now_utc
    db.commit()

    return user


def get_current_user_optional(
    request: Request,
    db: Session = Depends(get_db),
) -> Optional[User]:
    """
    Returns the authenticated user if a valid session exists, or None.
    """
    try:
        return get_current_user(request, db)
    except HTTPException:
        return None


def verify_csrf(request: Request) -> None:
    """
    FastAPI dependency: Enforces CSRF token validation for state-changing requests
    when authenticated via cookies.
    """
    # Only enforce on state-changing methods
    if request.method in ("GET", "HEAD", "OPTIONS"):
        return

    # Only enforce if request relies on cookie-based authentication
    if settings.SESSION_COOKIE_NAME not in request.cookies:
        return

    expected_csrf = request.cookies.get(settings.CSRF_COOKIE_NAME)
    provided_csrf = request.headers.get("x-csrf-token") or request.headers.get("X-CSRF-Token")

    if not expected_csrf or not provided_csrf:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="CSRF token validation failed. Missing CSRF token.",
        )

    if not secrets.compare_digest(expected_csrf, provided_csrf):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="CSRF token validation failed. Invalid CSRF token.",
        )
