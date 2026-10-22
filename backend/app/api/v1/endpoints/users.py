"""
User management and registration endpoints.
"""

from typing import List
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from sqlalchemy import select
from app.core.database import get_db
from app.core.security import hash_password, normalize_email
from app.core.errors import ConflictError, EntityNotFoundError
from app.models.user import User
from app.schemas.user import UserCreate, UserRead

router = APIRouter(prefix="/users", tags=["Users"])


@router.post(
    "",
    response_model=UserRead,
    status_code=status.HTTP_201_CREATED,
    summary="Create User",
    description="Registers a new user record with Argon2 password hashing. Passwords are never stored in plaintext.",
)
def create_user(user_in: UserCreate, db: Session = Depends(get_db)) -> UserRead:
    normalized = normalize_email(user_in.email)

    existing = db.execute(select(User).where(User.email == normalized)).scalar_one_or_none()
    if existing:
        raise ConflictError(f"A user with email '{normalized}' already exists.", field="email")

    user = User(
        email=normalized,
        password_hash=hash_password(user_in.password),
        full_name=user_in.full_name,
        role=user_in.role,
        is_active=True,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


@router.get(
    "",
    response_model=List[UserRead],
    summary="List Users",
    description="Retrieves registered user accounts without exposing security credentials.",
)
def list_users(skip: int = 0, limit: int = 50, db: Session = Depends(get_db)) -> List[UserRead]:
    stmt = select(User).offset(skip).limit(limit)
    return list(db.execute(stmt).scalars().all())


@router.get(
    "/{user_id}",
    response_model=UserRead,
    summary="Get User By ID",
    description="Fetches user account metadata.",
)
def get_user(user_id: str, db: Session = Depends(get_db)) -> UserRead:
    user = db.execute(select(User).where(User.id == user_id)).scalar_one_or_none()
    if not user:
        raise EntityNotFoundError("User", user_id)
    return user
