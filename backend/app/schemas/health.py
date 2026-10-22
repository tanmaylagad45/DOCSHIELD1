"""
Health check schema.
"""

from datetime import datetime
from pydantic import BaseModel, Field


class HealthResponse(BaseModel):
    status: str = Field(default="healthy", description="Application operational status")
    version: str = Field(default="1.0.0", description="API semantic version")
    environment: str = Field(default="development", description="Current operating environment")
    database: str = Field(default="connected", description="Database connection health")
    timestamp: datetime = Field(description="Server UTC timestamp")
