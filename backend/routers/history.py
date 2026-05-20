from fastapi import APIRouter
from backend.database import get_recent_scans

router = APIRouter()


@router.get("/history")
def get_history():
    return get_recent_scans(limit=20)
