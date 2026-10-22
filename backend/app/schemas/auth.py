"""
Authentication request and response validation schemas.
"""

from typing import Optional
from pydantic import BaseModel, EmailStr, Field
from app.schemas.user import UserRead


class UserRegisterRequest(BaseModel):
    email: EmailStr = Field(..., description="Valid work or corporate email address")
    password: str = Field(..., min_length=8, description="Plaintext password, securely hashed on server")
    full_name: Optional[str] = Field(None, max_length=255, description="Full legal or operator name")
    agree_terms: bool = Field(True, description="Terms acceptance verification")


class UserLoginRequest(BaseModel):
    email: EmailStr = Field(..., description="Registered account email")
    password: str = Field(..., description="Account authentication password")
    remember_me: bool = Field(False, description="Extend session duration to 7 days")


class AuthResponse(BaseModel):
    user: UserRead
    message: str = "Authenticated successfully."
    csrf_token: Optional[str] = Field(None, description="CSRF token for state-changing requests")


class CSRFResponse(BaseModel):
    csrf_token: str = Field(..., description="CSRF validation token")


class MessageResponse(BaseModel):
    message: str
