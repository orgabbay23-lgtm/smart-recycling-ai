from fastapi import APIRouter, UploadFile, HTTPException
from backend.inference import predict_image
from backend.config import WASTE_RECOMMENDATIONS
from backend.database import record_scan

router = APIRouter()

ALLOWED_CONTENT_TYPES = {"image/jpeg", "image/png", "image/webp", "image/gif"}

@router.post("/predict/waste")
async def predict_waste(file: UploadFile):
    if file.content_type not in ALLOWED_CONTENT_TYPES:
        raise HTTPException(
            status_code=400,
            detail=f"Please upload an image file (this one was {file.content_type}).",
        )

    image_bytes = await file.read()
    label, confidence = predict_image(image_bytes, "waste")
    recommendation = WASTE_RECOMMENDATIONS.get(label, "Check your local recycling guidelines")

    record_scan("waste", label, confidence, image_bytes)

    return {
        "label": label,
        "confidence": confidence,
        "recommendation": recommendation,
    }
