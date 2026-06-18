# 🧠 Model Guide

Everything about the AI models in this project: which one the app uses now, which
one came before, where they were trained, and how we know they work.

---

## TL;DR

- **Current / final model:** **EfficientNetV2-S** (PyTorch), trained on Kaggle.
  Two of them — one for waste, one for freshness. **This is what the app uses.**
- **Previous / baseline model:** **ResNet18**, our first version. Kept on purpose
  so we can show progress. **Not used by the app anymore.**
- Models are saved as `.pth` files. They are large, so they are **not** stored in
  Git — they live in `models/checkpoints/` on disk.

---

## Which files are CURRENT vs HISTORICAL

| | Current (final) ✅ | Historical (baseline) 🕰️ |
|---|---|---|
| Architecture | EfficientNetV2-S | ResNet18 |
| Waste classes | 10 | 4 |
| Training code | [`models/new_models_efficientnetv2/`](../models/new_models_efficientnetv2/) (Kaggle notebooks) | [`models/train_waste.py`](../models/train_waste.py), [`models/train_freshness.py`](../models/train_freshness.py) |
| Saved weights | `models/checkpoints/efficientnetv2_waste_best.pth`, `efficientnetv2_freshness_best.pth` | `models/checkpoints/best_waste_model.pth`, `best_freshness_model.pth` |
| Metrics | [`models/new_models_efficientnetv2/*/classification_report_*.txt`](../models/new_models_efficientnetv2/) | [`experiments/logs/`](../experiments/logs/) |
| Used by the running app? | **Yes** | No |

The backend always loads the EfficientNetV2 files — see the paths in
[`backend/config.py`](../backend/config.py).

---

## The current model — EfficientNetV2-S

### What it is
EfficientNetV2-S is a modern, efficient image-classification network. We used
**transfer learning**: we started from a version that already learned to "see"
images (pretrained on ImageNet), then retrained it on our own categories. This
gets high accuracy without needing huge amounts of data or training time.

### How it was trained
- **Where:** Kaggle notebooks, on a free **T4 GPU**.
- **Image size:** 384×384, standard ImageNet normalization.
- **Optimizer:** AdamW, learning rate 1e-4, with mixed-precision (AMP) and early
  stopping.
- **Notebooks:** in [`models/new_models_efficientnetv2/`](../models/new_models_efficientnetv2/)
  (`waste/` and `freshness/` subfolders).
- A written explanation of *why* the models were retrained (and what was fixed
  from an earlier broken attempt) is in
  [`models/new_models_efficientnetv2/README_RETRAIN.md`](../models/new_models_efficientnetv2/README_RETRAIN.md).

### Self-describing checkpoints (a nice detail to mention)
Each saved `.pth` file stores not just the weights but also its **class list**,
**image size**, and **normalization**. So the backend doesn't hard-code any of
that — it reads it straight from the file. See
[`backend/inference.py`](../backend/inference.py). This means we can swap in a
retrained model without changing the backend code.

### Datasets used
| Task | Dataset | Notes |
|---|---|---|
| Waste | [Garbage Classification V2](https://www.kaggle.com/datasets/sumn2u/garbage-classification-v2) | ~19k images, 10 classes |
| Freshness | [Food Freshness Dataset](https://www.kaggle.com/datasets/ulnnproject/food-freshness-dataset) | fresh vs. rotten |

The exact dataset links also live next to each notebook in
`dataset_kaggle_link_*.txt`.

### The 10 waste categories
`battery`, `biological`, `cardboard`, `clothes`, `glass`, `metal`, `paper`,
`plastic`, `shoes`, `trash`. Each maps to a disposal recommendation in
[`backend/config.py`](../backend/config.py).

### The 2 freshness categories
`fresh`, `rotten`. The backend adds a smart tip on top of the prediction
(storage advice if firmly fresh, recipe ideas if borderline/overripe, a safety
warning if rotten) — see [`backend/routers/freshness.py`](../backend/routers/freshness.py).

### Results (held-out test set)

**Waste — overall accuracy ≈ 99.6%** (7,351 test images, 10 classes).
Per-class precision/recall are all ~0.98–1.00.
Full report: [`classification_report_waste.txt`](../models/new_models_efficientnetv2/waste/classification_report_waste.txt).

**Freshness — overall accuracy ≈ 98.8%** (14,264 test images).

| Class | Precision | Recall | F1 | Support |
|---|---|---|---|---|
| fresh | 0.988 | 0.994 | 0.991 | 9,469 |
| rotten | 0.989 | 0.977 | 0.983 | 4,795 |

Full report: [`classification_report_freshness.txt`](../models/new_models_efficientnetv2/freshness/classification_report_freshness.txt).

Confusion matrices are stored both next to the notebooks and in
[`frontend/public/metrics/`](../frontend/public/metrics/) (so the **About** page
can display them — the files without a `_v1` suffix are the current model).

---

## The previous model — ResNet18 (baseline)

This was our **first working version**, kept for comparison.

- **Architecture:** ResNet18, fine-tuned (final layer replaced).
- **Scope:** 4 waste classes (`glass`, `metal`, `paper`, `plastic`) and
  fresh/rotten for freshness.
- **Training code:** [`models/train_waste.py`](../models/train_waste.py) and
  [`models/train_freshness.py`](../models/train_freshness.py) (run locally), with
  helpers [`models/data_loader.py`](../models/data_loader.py) and
  [`models/evaluate_models.py`](../models/evaluate_models.py).
- **Results:** waste ≈ 92% (4 classes), freshness ≈ 98%. See
  [`experiments/logs/final_evaluation.txt`](../experiments/logs/final_evaluation.txt).
- The `_v1` confusion-matrix images in
  [`frontend/public/metrics/`](../frontend/public/metrics/) belong to this baseline.

### Why we moved on from it
The baseline only handled 4 waste categories and was less accurate. Switching to
EfficientNetV2-S let us cover **10 real-world categories** (including battery,
clothes, shoes, etc.) at much higher accuracy, which makes the recycling advice
far more useful. The **Previous Versions** page in the app
([`ModelComparison.jsx`](../frontend/src/pages/ModelComparison.jsx)) shows the two
side by side.

---

## Why the app uses the final model

1. **Higher accuracy** on a held-out test set (~99.6% vs ~92% on waste).
2. **More categories** (10 vs 4) → more realistic recycling guidance.
3. **Self-describing checkpoints** → the backend stays simple and easy to update.

---

## How to retrain (if asked)

You don't need to retrain for the demo — the trained `.pth` files are already on
disk. If you ever want to, the step-by-step Kaggle instructions are in
[`models/new_models_efficientnetv2/README_RETRAIN.md`](../models/new_models_efficientnetv2/README_RETRAIN.md).
After training, you download the new `.pth` from Kaggle and drop it into
`models/checkpoints/` with the same filename.
