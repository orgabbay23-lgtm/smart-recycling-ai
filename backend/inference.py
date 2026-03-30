"""
Model loading and inference logic for waste and freshness classification.
"""

import io

import torch
import torch.nn.functional as F
from torchvision import models, transforms
from PIL import Image

from backend.config import (
    WASTE_MODEL_PATH,
    FRESHNESS_MODEL_PATH,
    WASTE_CLASSES,
    FRESHNESS_CLASSES,
)

# --- Image transforms (same normalization as training) ---
_transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
])

# --- Model builders ---

def _build_resnet18(num_classes: int) -> models.ResNet:
    model = models.resnet18(weights=None)
    model.fc = torch.nn.Linear(model.fc.in_features, num_classes)
    return model


def _load_model(path: str, num_classes: int) -> models.ResNet:
    model = _build_resnet18(num_classes)
    model.load_state_dict(torch.load(path, map_location="cpu"))
    model.eval()
    return model


# Load both models once at import time
waste_model = _load_model(WASTE_MODEL_PATH, num_classes=len(WASTE_CLASSES))
freshness_model = _load_model(FRESHNESS_MODEL_PATH, num_classes=len(FRESHNESS_CLASSES))

_MODELS = {
    "waste": (waste_model, WASTE_CLASSES),
    "freshness": (freshness_model, FRESHNESS_CLASSES),
}


def predict_image(image_bytes: bytes, task: str) -> tuple[str, float]:
    """
    Run inference on raw image bytes.

    Args:
        image_bytes: Raw bytes of the uploaded image.
        task: Either "waste" or "freshness".

    Returns:
        (predicted_label, confidence) tuple.
    """
    model, class_names = _MODELS[task]

    image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    tensor = _transform(image).unsqueeze(0)  # add batch dim

    with torch.no_grad():
        logits = model(tensor)
        probabilities = F.softmax(logits, dim=1)
        confidence, predicted_idx = probabilities.max(dim=1)

    label = class_names[predicted_idx.item()]
    return label, round(confidence.item(), 4)
