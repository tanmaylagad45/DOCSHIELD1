"""
Authentication endpoints: Registration, Login, Logout, Session Validation (Me), and CSRF Token issuance.
"""

from datetime import datetime, timezone, timedelta
from fastapi import APIRouter, Depends, Response, Request, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import select

from app.core.config import settings
from app.core.database import get_db
from app.core.security import (
    hash_password,
    verify_password,
    normalize_email,
    generate_session_token,
    generate_csrf_token,
    validate_password_strength,
)
from app.core.auth import (
    set_auth_cookies,
    clear_auth_cookies,
    get_session_token_from_request,
    get_current_user,
    verify_csrf,
)
from app.core.errors import ConflictError
from app.models.user import User
from app.models.session import Session as DbSession
from app.models.audit import AuditLog
from app.schemas.user import UserRead
from app.schemas.auth import (
    UserRegisterRequest,
    UserLoginRequest,
    AuthResponse,
    CSRFResponse,
    MessageResponse,
)

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post(
    "/register",
    response_model=AuthResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Register New User Account",
    description="Registers a new operator account, hashes the password with Argon2, and initiates an authenticated session.",
)
def register(
    payload: UserRegisterRequest,
    response: Response,
    request: Request,
    db: Session = Depends(get_db),
) -> AuthResponse:
    # 1. Server-side password validation
    strength_error = validate_password_strength(payload.password)
    if strength_error:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=strength_error,
        )

    # 2. Email normalization
    normalized_email = normalize_email(payload.email)

    # 3. Duplicate check
    existing_user = db.execute(select(User).where(User.email == normalized_email)).scalar_one_or_none()
    if existing_user:
        raise ConflictError(
            message=f"An account with email '{normalized_email}' already exists.",
            field="email",
        )

    # 4. Create user with Argon2 password hash
    user = User(
        email=normalized_email,
        password_hash=hash_password(payload.password),
        full_name=payload.full_name.strip() if payload.full_name else None,
        role="OPERATOR",
        is_active=True,
    )
    db.add(user)
    db.flush()  # Flush to get user.id

    # 5. Create server-managed session
    now_utc = datetime.now(timezone.utc)
    expires_at = now_utc + timedelta(hours=settings.SESSION_EXPIRE_HOURS)
    session_token = generate_session_token()
    csrf_token = generate_csrf_token()

    session_record = DbSession(
        session_token=session_token,
        user_id=user.id,
        created_at=now_utc,
        expires_at=expires_at,
        last_accessed_at=now_utc,
        is_revoked=False,
        ip_address=request.client.host if request.client else None,
        user_agent=request.headers.get("user-agent", "")[:255],
    )
    db.add(session_record)

    # 6. Audit log entry
    audit = AuditLog(
        entity_type="AUTH",
        entity_id=user.id,
        action="REGISTER",
        actor=user.email,
        details={"email": user.email, "role": user.role},
    )
    db.add(audit)
    db.commit()
    db.refresh(user)

    # 7. Set secure cookies
    set_auth_cookies(response, session_token, csrf_token, remember_me=False)

    return AuthResponse(
        user=UserRead.model_validate(user),
        message="Account registered successfully.",
        csrf_token=csrf_token,
    )


@router.post(
    "/login",
    response_model=AuthResponse,
    summary="Sign In User",
    description="Validates credentials against stored Argon2 hash and establishes a server-managed session.",
)
def login(
    payload: UserLoginRequest,
    response: Response,
    request: Request,
    db: Session = Depends(get_db),
) -> AuthResponse:
    # 1. Normalize email
    try:
        normalized_email = normalize_email(payload.email)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password.",
            headers={"WWW-Authenticate": "Cookie"},
        )

    # 2. Query user
    user = db.execute(select(User).where(User.email == normalized_email)).scalar_one_or_none()

    # 3. Generic authentication check (avoids account enumeration)
    if not user or not user.is_active or not verify_password(payload.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password.",
            headers={"WWW-Authenticate": "Cookie"},
        )

    # 4. Create server-managed session
    now_utc = datetime.now(timezone.utc)
    duration_days = settings.SESSION_REMEMBER_ME_DAYS if payload.remember_me else 0
    duration_hours = 0 if payload.remember_me else settings.SESSION_EXPIRE_HOURS
    expires_at = now_utc + timedelta(days=duration_days, hours=duration_hours)

    session_token = generate_session_token()
    csrf_token = generate_csrf_token()

    session_record = DbSession(
        session_token=session_token,
        user_id=user.id,
        created_at=now_utc,
        expires_at=expires_at,
        last_accessed_at=now_utc,
        is_revoked=False,
        ip_address=request.client.host if request.client else None,
        user_agent=request.headers.get("user-agent", "")[:255],
    )
    db.add(session_record)

    # 5. Audit log
    audit = AuditLog(
        entity_type="AUTH",
        entity_id=user.id,
        action="LOGIN",
        actor=user.email,
        details={"remember_me": payload.remember_me},
    )
    db.add(audit)
    db.commit()
    db.refresh(user)

    # 6. Set secure cookies
    set_auth_cookies(response, session_token, csrf_token, remember_me=payload.remember_me)

    return AuthResponse(
        user=UserRead.model_validate(user),
        message="Sign in successful.",
        csrf_token=csrf_token,
    )


@router.post(
    "/logout",
    response_model=MessageResponse,
    summary="Sign Out User",
    description="Invalidates the server-managed session in the database and clears authentication cookies.",
    dependencies=[Depends(verify_csrf)],
)
def logout(
    request: Request,
    response: Response,
    db: Session = Depends(get_db),
) -> MessageResponse:
    token = get_session_token_from_request(request)
    if token:
        # Revoke session in database
        stmt = select(DbSession).where(DbSession.session_token == token)
        session_record = db.execute(stmt).scalar_one_or_none()
        if session_record:
            session_record.is_revoked = True
            audit = AuditLog(
                entity_type="AUTH",
                entity_id=session_record.user_id,
                action="LOGOUT",
                actor=f"user_id:{session_record.user_id}",
                details={"sessionId": session_record.id},
            )
            db.add(audit)
            db.commit()

    # Clear cookies on client
    clear_auth_cookies(response)
    return MessageResponse(message="Successfully signed out.")


@router.get(
    "/me",
    response_model=UserRead,
    summary="Get Current Authenticated User",
    description="Validates the active session and returns current account profile metadata.",
)
def get_current_user_profile(
    current_user: User = Depends(get_current_user),
) -> UserRead:
    return UserRead.model_validate(current_user)


@router.get(
    "/csrf",
    response_model=CSRFResponse,
    summary="Issue CSRF Token",
    description="Generates or refreshes a CSRF token for state-changing requests.",
)
def get_csrf_token(response: Response, request: Request) -> CSRFResponse:
    existing_csrf = request.cookies.get(settings.CSRF_COOKIE_NAME)
    csrf_token = existing_csrf or generate_csrf_token()

    response.set_cookie(
        key=settings.CSRF_COOKIE_NAME,
        value=csrf_token,
        max_age=settings.SESSION_EXPIRE_HOURS * 3600,
        path="/",
        secure=settings.COOKIE_SECURE,
        httponly=False,
        samesite=settings.COOKIE_SAMESITE,
    )
    return CSRFResponse(csrf_token=csrf_token)
