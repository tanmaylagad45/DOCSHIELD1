"""
API v1 Router aggregation.
"""

from fastapi import APIRouter
from app.api.v1.endpoints import health, users, documents, assessments

api_router = APIRouter()

api_router.include_router(health.router, tags=["Health"])
api_router.include_router(users.router)
api_router.include_router(documents.router)
api_router.include_router(assessments.router)
