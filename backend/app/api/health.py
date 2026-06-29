from fastapi import APIRouter
from app.core.database import get_collection

router = APIRouter()

@router.get("/health")
async def health_check():
    collection = get_collection()
    return {
        "status": "healthy",
        "collection": collection.name,
        "total_chunks": collection.count(),
    }