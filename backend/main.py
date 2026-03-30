"""
FastAPI application for Smart Recycling AI predictions.
"""

from fastapi import FastAPI, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from backend.inference import predict_image
from backend.config import WASTE_RECOMMENDATIONS, FRESHNESS_RECOMMENDATIONS

app = FastAPI(title="Smart Recycling AI")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

ALLOWED_CONTENT_TYPES = {"image/jpeg", "image/png", "image/webp", "image/gif"}


@app.get("/health")
def health():
    return {"status": "ok"}


async def _predict(file: UploadFile, task: str, recommendations: dict):
    if file.content_type not in ALLOWED_CONTENT_TYPES:
        raise HTTPException(
            status_code=400,
            detail=f"File must be an image. Got: {file.content_type}",
        )

    image_bytes = await file.read()
    label, confidence = predict_image(image_bytes, task)
    recommendation = recommendations[label]

    return {
        "label": label,
        "confidence": confidence,
        "recommendation": recommendation,
    }


@app.post("/predict/waste")
async def predict_waste(file: UploadFile):
    return await _predict(file, "waste", WASTE_RECOMMENDATIONS)


@app.post("/predict/freshness")
async def predict_freshness(file: UploadFile):
    return await _predict(file, "freshness", FRESHNESS_RECOMMENDATIONS)
