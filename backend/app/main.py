"""
FastAPI Application Entry Point for DocShield Document Intelligence.
"""

from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException

from app.core.config import settings
from app.core.database import engine, check_db_connected
from app.core.errors import (
    DocShieldException,
    http_exception_handler,
    validation_exception_handler,
    custom_exception_handler,
    general_exception_handler,
)
from app.models.base import Base
from app.api.v1.router import api_router
from app.api.v1.endpoints.health import router as health_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Application lifespan manager.
    Initializes database tables on development startup if they do not exist.
    """
    # Create tables if not present (in addition to Alembic migrations)
    Base.metadata.create_all(bind=engine)
    yield
    # Cleanup actions on shutdown (if any)


app = FastAPI(
    title=settings.PROJECT_NAME,
    version="1.0.0",
    description=(
        "DocShield provides AI-powered document intelligence, document validation, "
        "authenticity assessment, and regulatory compliance verification."
    ),
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    lifespan=lifespan,
)

# CORS Middleware restricted to designated frontend origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

# Centralized Exception Handlers
app.add_exception_handler(StarletteHTTPException, http_exception_handler)
app.add_exception_handler(RequestValidationError, validation_exception_handler)
app.add_exception_handler(DocShieldException, custom_exception_handler)
app.add_exception_handler(Exception, general_exception_handler)

from app.api.v1.endpoints.auth import router as auth_router
from app.api.v1.endpoints.documents import router as documents_router

# Health endpoint at /api/health (direct) and versioned at /api/v1/health
app.include_router(health_router, prefix="/api", tags=["Health"])

# Direct compatibility for /api/auth routes
app.include_router(auth_router, prefix="/api", tags=["Authentication"])

# Direct compatibility for /api/documents routes
app.include_router(documents_router, prefix="/api", tags=["Documents"])

# Versioned API routes
app.include_router(api_router, prefix=settings.API_V1_STR)


@app.get("/", tags=["Root"])
def root_status():
    """
    Root status endpoint providing service identity and links to documentation.
    """
    return {
        "service": settings.PROJECT_NAME,
        "version": "1.0.0",
        "status": "operational",
        "docs": "/docs",
        "redoc": "/redoc",
        "api_v1": settings.API_V1_STR,
    }
