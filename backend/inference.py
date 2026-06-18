"""
Model loading and inference logic for waste and freshness classification.

The models are EfficientNetV2-S checkpoints trained on Kaggle (GPU T4). Each
checkpoint is *self-describing*: besides the weights it carries the class list,
the input image size and the normalization used during training, so inference
preprocessing always matches training without hard-coding anything here.
"""

import io
from threading import Lock

from PIL import Image

from backend.config import WASTE_MODEL_PATH, FRESHNESS_MODEL_PATH

# ImageNet normalization is the fallback if a checkpoint omits it.
_DEFAULT_NORM = {"mean": [0.485, 0.456, 0.406], "std": [0.229, 0.224, 0.225]}
_DEFAULT_IMG_SIZE = 384


def _load_ml_dependencies():
    import torch
    import torch.nn as nn
    import torch.nn.functional as F
    from torchvision import models, transforms

    return torch, nn, F, models, transforms


def _build_efficientnet_v2_s(models, nn, num_classes: int):
    model = models.efficientnet_v2_s(weights=None)
    model.classifier[1] = nn.Linear(model.classifier[1].in_features, num_classes)
    return model


def _make_transform(transforms, img_size: int, norm: dict):
    return transforms.Compose([
        transforms.Resize(img_size),
        transforms.CenterCrop(img_size),
        transforms.ToTensor(),
        transforms.Normalize(mean=norm["mean"], std=norm["std"]),
    ])


class _Classifier:
    """A loaded model plus everything needed to run it (classes + transform)."""

    def __init__(self, checkpoint_path: str):
        torch, nn, F, models, transforms = _load_ml_dependencies()
        self._torch = torch
        self._F = F

        ckpt = torch.load(checkpoint_path, map_location="cpu")

        # Self-describing checkpoints are dicts; fall back gracefully otherwise.
        if isinstance(ckpt, dict) and "model_state_dict" in ckpt:
            state_dict = ckpt["model_state_dict"]
            self.classes = list(ckpt["classes"])
            img_size = int(ckpt.get("img_size", _DEFAULT_IMG_SIZE))
            norm = ckpt.get("normalization", _DEFAULT_NORM)
        else:
            # Raw state_dict: infer class count from the classifier weight shape.
            state_dict = ckpt
            num_classes = state_dict["classifier.1.weight"].shape[0]
            self.classes = [str(i) for i in range(num_classes)]
            img_size, norm = _DEFAULT_IMG_SIZE, _DEFAULT_NORM

        self.model = _build_efficientnet_v2_s(models, nn, len(self.classes))
        self.model.load_state_dict(state_dict)
        self.model.eval()
        self.transform = _make_transform(transforms, img_size, norm)

    def predict(self, image_bytes: bytes) -> tuple[str, float]:
        image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
        tensor = self.transform(image).unsqueeze(0)  # add batch dim
        with self._torch.no_grad():
            probabilities = self._F.softmax(self.model(tensor), dim=1)
            confidence, predicted_idx = probabilities.max(dim=1)
        return self.classes[predicted_idx.item()], round(confidence.item(), 4)


_MODEL_PATHS = {
    "waste": WASTE_MODEL_PATH,
    "freshness": FRESHNESS_MODEL_PATH,
}

_MODELS: dict[str, _Classifier | None] = {"waste": None, "freshness": None}
_MODEL_LOCKS = {"waste": Lock(), "freshness": Lock()}


def _get_model(task: str) -> _Classifier:
    if task not in _MODEL_PATHS:
        raise ValueError(f"Unknown task: {task}")

    if _MODELS[task] is None:
        with _MODEL_LOCKS[task]:
            if _MODELS[task] is None:
                _MODELS[task] = _Classifier(_MODEL_PATHS[task])
    return _MODELS[task]


def predict_image(image_bytes: bytes, task: str) -> tuple[str, float]:
    """
    Run inference on raw image bytes.

    Args:
        image_bytes: Raw bytes of the uploaded image.
        task: Either "waste" or "freshness".

    Returns:
        (predicted_label, confidence) tuple.
    """
    return _get_model(task).predict(image_bytes)
