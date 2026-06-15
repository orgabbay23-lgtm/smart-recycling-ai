from fastapi import APIRouter, UploadFile, HTTPException
from backend.inference import predict_image
from backend.config import (
    FRESHNESS_RECOMMENDATIONS,
    FRESHNESS_CONFIDENCE_THRESHOLD,
    STORAGE_TIP,
    RECIPE_SUGGESTION,
    SAFETY_TIP,
)
from backend.database import record_scan

router = APIRouter()

ALLOWED_CONTENT_TYPES = {"image/jpeg", "image/png", "image/webp", "image/gif"}

@router.post("/predict/freshness")
async def predict_freshness(file: UploadFile):
    if file.content_type not in ALLOWED_CONTENT_TYPES:
        raise HTTPException(
            status_code=400,
            detail=f"Please upload an image file (this one was {file.content_type}).",
        )

    image_bytes = await file.read()
    label, confidence = predict_image(image_bytes, "freshness")
    recommendation = FRESHNESS_RECOMMENDATIONS[label]

    record_scan("freshness", label, confidence, image_bytes)

    response = {
        "label": label,
        "confidence": confidence,
        "recommendation": recommendation,
    }

    # --- Smart Food Waste Assistant & Safety Warning ---
    if label == "fresh":
        if confidence >= FRESHNESS_CONFIDENCE_THRESHOLD:
            # Rule A: firmly fresh -> storage advice
            response["storage_tip"] = STORAGE_TIP
        else:
            # Rule B: borderline overripe / softening -> recipe ideas
            response["recipe_suggestion"] = RECIPE_SUGGESTION
    elif label == "rotten":
        # Rule C: rotten -> safety isolation warning
        response["safety_tip"] = SAFETY_TIP

    return response
