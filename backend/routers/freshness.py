from fastapi import APIRouter, UploadFile, HTTPException
from backend.inference import predict_image
from backend.config import FRESHNESS_RECOMMENDATIONS

router = APIRouter()

ALLOWED_CONTENT_TYPES = {"image/jpeg", "image/png", "image/webp", "image/gif"}

@router.post("/predict/freshness")
async def predict_freshness(file: UploadFile):
    if file.content_type not in ALLOWED_CONTENT_TYPES:
        raise HTTPException(
            status_code=400,
            detail=f"File must be an image. Got: {file.content_type}",
        )

    image_bytes = await file.read()
    label, confidence = predict_image(image_bytes, "freshness")
    recommendation = FRESHNESS_RECOMMENDATIONS[label]

    return {
        "label": label,
        "confidence": confidence,
        "recommendation": recommendation,
    }
