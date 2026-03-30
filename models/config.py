"""
Central configuration for preprocessing and data loading.
All preprocessing decisions (image size, normalization, paths) live here
so every script uses the same values.
"""

import os

# --- Image preprocessing ---
IMAGE_SIZE = 224  # Standard input size for ResNet / MobileNet
BATCH_SIZE = 32

# ImageNet normalization (matches pretrained torchvision weights)
NORMALIZATION_MEAN = [0.485, 0.456, 0.406]
NORMALIZATION_STD = [0.229, 0.224, 0.225]

# --- Dataset paths ---
_PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

WASTE_DATASET_PATH = os.path.join(_PROJECT_ROOT, "datasets", "waste", "processed")
FRESHNESS_DATASET_PATH = os.path.join(_PROJECT_ROOT, "datasets", "freshness", "processed")
