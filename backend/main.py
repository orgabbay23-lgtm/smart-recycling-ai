"""
FastAPI application for Smart Recycling AI predictions.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.routers import waste, freshness

app = FastAPI(title="Smart Recycling AI")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(waste.router)
app.include_router(freshness.router)


@app.get("/health")
def health():
    return {"status": "ok"}
