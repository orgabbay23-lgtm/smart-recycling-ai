"""
Backend configuration: class names, recommendation mappings, and model paths.
"""

import os

# --- Model checkpoint paths ---
_PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
WASTE_MODEL_PATH = os.path.join(_PROJECT_ROOT, "models", "checkpoints", "best_waste_model.pth")
FRESHNESS_MODEL_PATH = os.path.join(_PROJECT_ROOT, "models", "checkpoints", "best_freshness_model.pth")

# --- Class names (must match the alphabetical folder order used during training) ---
WASTE_CLASSES = ["glass", "metal", "paper", "plastic"]
FRESHNESS_CLASSES = ["fresh", "rotten"]

# --- Recommendation mappings ---
WASTE_RECOMMENDATIONS = {
    "glass": "Purple Bin",
    "metal": "Orange Bin",
    "paper": "Blue Bin",
    "plastic": "Orange Bin",
}

FRESHNESS_RECOMMENDATIONS = {
    "fresh": "Safe to eat or cook",
    "rotten": "Discard or Compost",
}
