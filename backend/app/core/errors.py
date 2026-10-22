"""
Centralized error handling and standardized JSON error responses.
"""

from fastapi import Request, status
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException
import logging

logger = logging.getLogger("docshield.errors")


class DocShieldException(Exception):
    """Base application exception."""
    def __init__(self, message: str, status_code: int = status.HTTP_400_BAD_REQUEST, details: dict = None):
        super().__init__(message)
        self.message = message
        self.status_code = status_code
        self.details = details or {}


class EntityNotFoundError(DocShieldException):
    def __init__(self, entity_name: str, entity_id: str):
        super().__init__(
            message=f"{entity_name} with identifier '{entity_id}' was not found.",
            status_code=status.HTTP_404_NOT_FOUND,
            details={"entity": entity_name, "id": entity_id}
        )


class ConflictError(DocShieldException):
    def __init__(self, message: str, field: str = None):
        super().__init__(
            message=message,
            status_code=status.HTTP_409_CONFLICT,
            details={"field": field} if field else {}
        )


class InvalidFileError(DocShieldException):
    def __init__(self, message: str, details: dict = None):
        super().__init__(
            message=message,
            status_code=status.HTTP_400_BAD_REQUEST,
            details=details or {},
        )


class FileTooLargeError(DocShieldException):
    def __init__(self, max_bytes: int, actual_bytes: int = None):
        max_mb = max_bytes / (1024 * 1024)
        super().__init__(
            message=f"File exceeds maximum allowed upload size of {max_mb:.0f} MB.",
            status_code=getattr(status, "HTTP_413_CONTENT_TOO_LARGE", 413),
            details={"max_bytes": max_bytes, "actual_bytes": actual_bytes} if actual_bytes else {"max_bytes": max_bytes},
        )


async def http_exception_handler(request: Request, exc: StarletteHTTPException) -> JSONResponse:
    """
    Standardized handler for HTTPExceptions.
    """
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "error": {
                "code": exc.status_code,
                "message": exc.detail,
                "type": "HTTPException",
            }
        },
    )


async def validation_exception_handler(request: Request, exc: RequestValidationError) -> JSONResponse:
    """
    Standardized handler for Pydantic RequestValidationErrors.
    """
    formatted_errors = []
    for err in exc.errors():
        loc = " -> ".join(str(l) for l in err.get("loc", []))
        formatted_errors.append({
            "field": loc,
            "message": err.get("msg", "Invalid value"),
            "type": err.get("type", "value_error"),
        })

    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={
            "error": {
                "code": 422,
                "message": "Request validation failed.",
                "type": "ValidationError",
                "details": formatted_errors,
            }
        },
    )


async def custom_exception_handler(request: Request, exc: DocShieldException) -> JSONResponse:
    """
    Standardized handler for domain DocShieldExceptions.
    """
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "error": {
                "code": exc.status_code,
                "message": exc.message,
                "type": exc.__class__.__name__,
                "details": exc.details,
            }
        },
    )


async def general_exception_handler(request: Request, exc: Exception) -> JSONResponse:
    """
    Catch-all handler for unhandled internal exceptions.
    Prevents leakage of raw stack traces to clients while logging locally.
    """
    logger.exception("Unhandled server exception: %s", exc)
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "error": {
                "code": 500,
                "message": "An internal server error occurred.",
                "type": "InternalServerError",
            }
        },
    )
