"""
Backend configuration: class names, recommendation mappings, and model paths.
"""

import os

# --- Model checkpoint paths ---
# EfficientNetV2-S models trained on Kaggle. The checkpoints are self-describing
# (they carry their own class list / image size), so inference reads the classes
# from the file; the lists below are only used for the recommendation lookup.
_PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
WASTE_MODEL_PATH = os.path.join(_PROJECT_ROOT, "models", "checkpoints", "efficientnetv2_waste_best.pth")
FRESHNESS_MODEL_PATH = os.path.join(_PROJECT_ROOT, "models", "checkpoints", "efficientnetv2_freshness_best.pth")

# --- Class names (informational; the source of truth is the checkpoint itself) ---
WASTE_CLASSES = [
    "battery", "biological", "cardboard", "clothes", "glass",
    "metal", "paper", "plastic", "shoes", "trash",
]
FRESHNESS_CLASSES = ["fresh", "rotten"]

# --- Recommendation mappings (per waste category -> disposal guidance) ---
WASTE_RECOMMENDATIONS = {
    "battery": "Battery & e-waste collection point — never bin (hazardous)",
    "biological": "Brown Bin — organic waste / compost",
    "cardboard": "Cardboard recycling cage — flatten boxes first",
    "clothes": "Textile donation bin",
    "glass": "Purple Bin — glass recycling",
    "metal": "Orange Bin — packaging recycling",
    "paper": "Blue Bin — paper recycling",
    "plastic": "Orange Bin — packaging recycling",
    "shoes": "Textile donation bin — tie pairs together",
    "trash": "General waste bin — not recyclable",
}

FRESHNESS_RECOMMENDATIONS = {
    "fresh": "Safe to eat or cook",
    "rotten": "Throw out or compost",
}

# --- Smart Food Waste Assistant & Safety Warning tips ---
# Confidence threshold above which a "fresh" result is considered firmly fresh.
# Below it, the fruit is treated as borderline overripe / starting to soften.
FRESHNESS_CONFIDENCE_THRESHOLD = 0.85

STORAGE_TIP = (
    "Keep your fruit somewhere cool and dry. Store bananas on their own — they "
    "make the fruit around them ripen much faster."
)

RECIPE_SUGGESTION = (
    "This fruit looks very ripe, or it's starting to soften! That makes it "
    "perfect for banana bread, smoothies, pancakes, or apple sauce. If you "
    "won't get to it soon, peel it and pop it in the freezer."
)

SAFETY_TIP = (
    "Move this away from the rest of your fruit right away, on the counter and "
    "in the fridge. Rotten fruit gives off a lot of ethylene gas and mold "
    "spores, which can quickly spoil the healthy food sitting next to it."
)
