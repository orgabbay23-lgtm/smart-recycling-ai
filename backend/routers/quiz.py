"""
Gamification: serve a random labelled image from the local datasets for the quiz.
"""

import base64
import os
import random

from fastapi import APIRouter, HTTPException

router = APIRouter()

_PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
_BACKEND_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

_IMAGE_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp"}

# Each item_type maps to processed dataset roots whose subfolders are categories.
# The tiny bundled sample keeps the hosted demo quiz working without shipping
# the multi-GB local training dataset.
_DATASET_ROOTS = {
    "waste": [
        os.path.join(_PROJECT_ROOT, "datasets", "waste", "processed"),
        os.path.join(_BACKEND_ROOT, "quiz_samples", "waste"),
    ],
    "freshness": [
        os.path.join(_PROJECT_ROOT, "datasets", "freshness", "processed"),
        os.path.join(_BACKEND_ROOT, "quiz_samples", "freshness"),
    ],
}


def _build_index() -> dict[str, list[dict]]:
    """Index every labelled image, grouped by item_type.

    Walks processed/<split>/<category>/<image>, deriving the category (the
    correct answer) from the folder name. Built once at import time.
    """
    index: dict[str, list[dict]] = {}
    for item_type, roots in _DATASET_ROOTS.items():
        items: list[dict] = []
        for root in roots:
            if not os.path.isdir(root):
                continue
            for split in os.listdir(root):
                split_dir = os.path.join(root, split)
                if not os.path.isdir(split_dir):
                    continue
                for category in os.listdir(split_dir):
                    category_dir = os.path.join(split_dir, category)
                    if not os.path.isdir(category_dir):
                        continue
                    for filename in os.listdir(category_dir):
                        if os.path.splitext(filename)[1].lower() in _IMAGE_EXTENSIONS:
                            items.append(
                                {
                                    "path": os.path.join(category_dir, filename),
                                    "correct_answer": category,
                                }
                            )
        if items:
            index[item_type] = items
    return index


_QUIZ_INDEX = _build_index()


@router.get("/quiz/random")
def random_quiz():
    # Pick item_type first so waste vs. freshness questions stay balanced
    # regardless of how many images each dataset holds.
    available_types = [t for t, items in _QUIZ_INDEX.items() if items]
    if not available_types:
        raise HTTPException(status_code=503, detail="No quiz images available.")

    item_type = random.choice(available_types)
    choice = random.choice(_QUIZ_INDEX[item_type])

    with open(choice["path"], "rb") as f:
        image_bytes = f.read()

    return {
        "image_base64": base64.b64encode(image_bytes).decode("ascii"),
        "item_type": item_type,
        "correct_answer": choice["correct_answer"],
    }
