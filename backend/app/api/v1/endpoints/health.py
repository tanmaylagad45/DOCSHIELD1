"""
Health and diagnostics endpoint.
"""

from datetime import datetime, timezone
from fastapi import APIRouter, status, Response
from app.core.config import settings
from app.core.database import check_db_connected
from app.schemas.health import HealthResponse

router = APIRouter()


@router.get(
    "/health",
    response_model=HealthResponse,
    summary="Service Health Check",
    description="Validates application operational state, database connectivity, and environment metadata.",
)
def get_health(response: Response) -> HealthResponse:
    db_connected = check_db_connected()
    if not db_connected:
        response.status_code = status.HTTP_503_SERVICE_UNAVAILABLE

    return HealthResponse(
        status="healthy" if db_connected else "degraded",
        version="1.0.0",
        environment=settings.ENVIRONMENT,
        database="connected" if db_connected else "disconnected",
        timestamp=datetime.now(timezone.utc),
    )
