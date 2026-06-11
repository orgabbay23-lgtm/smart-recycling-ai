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

# --- Smart Food Waste Assistant & Safety Warning tips ---
# Confidence threshold above which a "fresh" result is considered firmly fresh.
# Below it, the fruit is treated as borderline overripe / starting to soften.
FRESHNESS_CONFIDENCE_THRESHOLD = 0.85

STORAGE_TIP = (
    "Keep fruits (especially bananas) in a cool, dry place. Store bananas "
    "separately from other fruits to prevent rapid ripening."
)

RECIPE_SUGGESTION = (
    "This fruit appears to be very ripe or starting to soften! Perfect for "
    "making banana bread, fruit smoothies, pancakes, or apple sauce. Peel and "
    "freeze it if you won't eat it soon."
)

SAFETY_TIP = (
    "Isolate this item immediately from other fresh fruits in your kitchen or "
    "fridge. Rotten fruits release high levels of ethylene gas and mold spores, "
    "which will spoil nearby healthy food rapidly."
)
