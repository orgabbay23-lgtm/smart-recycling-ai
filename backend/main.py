"""
FastAPI application for Smart Recycling AI predictions.
"""

import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.routers import waste, freshness, history, quiz
from backend.database import init_db
from backend.config import WASTE_MODEL_PATH, FRESHNESS_MODEL_PATH

app = FastAPI(title="Smart Recycling AI")

init_db()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(waste.router)
app.include_router(freshness.router)
app.include_router(history.router)
app.include_router(quiz.router)


@app.get("/health")
def health():
    return {
        "status": "ok",
        "models": {
            "waste": os.path.exists(WASTE_MODEL_PATH),
            "freshness": os.path.exists(FRESHNESS_MODEL_PATH),
        },
    }
