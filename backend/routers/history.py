from fastapi import APIRouter, HTTPException
from backend.database import get_recent_scans, delete_scan

router = APIRouter()


@router.get("/history")
def get_history():
    return get_recent_scans(limit=20)


@router.delete("/history/{scan_id}")
def remove_history_item(scan_id: int):
    if not delete_scan(scan_id):
        raise HTTPException(status_code=404, detail="Scan not found")
    return {"deleted": scan_id}
