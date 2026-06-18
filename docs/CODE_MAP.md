# 🗺️ Code Map — "Where is this in the code?"

This is a quick lookup table for the project. If someone asks *"where is X?"*,
find the row and open the file(s) listed. Paths are relative to the project root
(`smart-recycling-ai/`).

> New here? Read this together with [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md)
> (the folder layout) and [DEMO_GUIDE.md](DEMO_GUIDE.md) (how to present it).

---

## The 30-second mental model

```
You (browser)  →  React frontend  →  FastAPI backend  →  PyTorch model
                   (frontend/)        (backend/)          (.pth file)
                                            │
                                            └──→ SQLite scan history (backend/scan_history.db)
```

The frontend shows the pages and sends the photo. The backend runs the AI model
on the photo and sends back the answer. A small local database remembers each
scan so the History and Statistics pages have something to show.

---

## Frontend (what the user sees) — `frontend/src/`

| Feature / Question | What to show | File(s) |
|---|---|---|
| App routes (which page is which URL) | Router setup | [`frontend/src/App.jsx`](../frontend/src/App.jsx) |
| Top navigation bar + page shell | Shared layout | [`frontend/src/components/Layout.jsx`](../frontend/src/components/Layout.jsx) |
| Home / landing page | Entry screen | [`frontend/src/pages/Home.jsx`](../frontend/src/pages/Home.jsx) |
| Waste scan page | Upload + "Analyze Waste" | [`frontend/src/pages/RecycleScan.jsx`](../frontend/src/pages/RecycleScan.jsx) |
| Freshness scan page | Upload + "Analyze Food" | [`frontend/src/pages/FreshnessScan.jsx`](../frontend/src/pages/FreshnessScan.jsx) |
| Upload / camera component | Picks a photo (camera or file) | [`frontend/src/components/ImageCapture.jsx`](../frontend/src/components/ImageCapture.jsx) |
| Result card (label, confidence, tips) | Shows the AI answer | [`frontend/src/components/ScanResult.jsx`](../frontend/src/components/ScanResult.jsx) |
| Result wording / colors / icons | Per-result text & styling | [`frontend/src/components/resultMeta.jsx`](../frontend/src/components/resultMeta.jsx) |
| History page | Recent scans + delete | [`frontend/src/pages/History.jsx`](../frontend/src/pages/History.jsx) |
| Statistics page | Charts/counts of past scans | [`frontend/src/pages/Statistics.jsx`](../frontend/src/pages/Statistics.jsx) |
| Quiz game | "Guess the category" game | [`frontend/src/pages/Quiz.jsx`](../frontend/src/pages/Quiz.jsx) |
| About page | Project story + metrics tables | [`frontend/src/pages/About.jsx`](../frontend/src/pages/About.jsx) |
| Code snippets on the About page | Self-explaining code examples | [`frontend/src/components/CodeExamples.jsx`](../frontend/src/components/CodeExamples.jsx) |
| Model comparison page (old vs new) | "Previous Versions" page | [`frontend/src/pages/ModelComparison.jsx`](../frontend/src/pages/ModelComparison.jsx) |
| **Backend address (API URL)** | One place all pages import | [`frontend/src/services/api.js`](../frontend/src/services/api.js) |
| Reusable button | Button component | [`frontend/src/components/Button.jsx`](../frontend/src/components/Button.jsx) |

---

## Backend (the AI + the API) — `backend/`

| Feature / Question | What to show | File(s) |
|---|---|---|
| The web server / app entry point | Creates the API, wires routes | [`backend/main.py`](../backend/main.py) |
| **Model loading and prediction** | Loads the `.pth` model, runs it | [`backend/inference.py`](../backend/inference.py) |
| Labels, recommendations, model paths | Config / mappings | [`backend/config.py`](../backend/config.py) |
| Waste prediction API (`POST /predict/waste`) | FastAPI endpoint | [`backend/routers/waste.py`](../backend/routers/waste.py) |
| Freshness prediction API (`POST /predict/freshness`) | FastAPI endpoint | [`backend/routers/freshness.py`](../backend/routers/freshness.py) |
| Scan history API (`GET/DELETE /history`) | FastAPI endpoint | [`backend/routers/history.py`](../backend/routers/history.py) |
| Quiz API (`GET /quiz/random`) | Serves a random labelled image | [`backend/routers/quiz.py`](../backend/routers/quiz.py) |
| Health check (`GET /health`) | "Is the server up?" | [`backend/main.py`](../backend/main.py) |
| **Scan history database** | SQLite read/write | [`backend/database.py`](../backend/database.py) |
| The database file itself | Local data (auto-created, not in Git) | `backend/scan_history.db` |

---

## Models (training + the saved AI) — `models/`

| Feature / Question | What to show | File(s) |
|---|---|---|
| **Current model training** (final) | EfficientNetV2-S notebooks + reports | [`models/new_models_efficientnetv2/`](../models/new_models_efficientnetv2/) |
| Current saved model files (used by the app) | The two `.pth` files the backend loads | `models/checkpoints/efficientnetv2_waste_best.pth`, `models/checkpoints/efficientnetv2_freshness_best.pth` |
| **Previous baseline model** (older) | ResNet18 training scripts | [`models/train_waste.py`](../models/train_waste.py), [`models/train_freshness.py`](../models/train_freshness.py) |
| Baseline saved model files | The two older `.pth` files | `models/checkpoints/best_waste_model.pth`, `models/checkpoints/best_freshness_model.pth` |
| Baseline data loading / evaluation | Helper scripts for the old models | [`models/data_loader.py`](../models/data_loader.py), [`models/evaluate_models.py`](../models/evaluate_models.py), [`models/config.py`](../models/config.py) |

> The `.pth` model files are large and are **not** stored in Git (see `.gitignore`).
> They live on disk locally. See [MODEL_GUIDE.md](MODEL_GUIDE.md) for the full story.

---

## Results & metrics (proof the models work)

| Feature / Question | What to show | File(s) |
|---|---|---|
| Current model metrics (waste, 10 classes, ~99.6%) | Classification report | [`models/new_models_efficientnetv2/waste/classification_report_waste.txt`](../models/new_models_efficientnetv2/waste/classification_report_waste.txt) |
| Current model metrics (freshness, ~98.8%) | Classification report | [`models/new_models_efficientnetv2/freshness/classification_report_freshness.txt`](../models/new_models_efficientnetv2/freshness/classification_report_freshness.txt) |
| Confusion matrices shown in the app | Images used by the About/Comparison pages | [`frontend/public/metrics/`](../frontend/public/metrics/) |
| Baseline (older ResNet18) evaluation | Reports + matrices | [`experiments/logs/`](../experiments/logs/) |

---

## Data preparation & utilities — `scripts/`

| Feature / Question | What to show | File(s) |
|---|---|---|
| How datasets were balanced & split | Dataset prep script | [`scripts/prepare_mvp_datasets.py`](../scripts/prepare_mvp_datasets.py) |
| Copying metrics into the frontend | Helper script | [`scripts/copy_metrics.py`](../scripts/copy_metrics.py) |

> The `datasets/` folder is large and is **not** stored in Git. It exists locally
> for training and for the quiz. The app does not need it to make a prediction.

---

## The single most important flow (memorize this)

A waste scan, end to end:

1. User picks a photo — [`ImageCapture.jsx`](../frontend/src/components/ImageCapture.jsx)
2. User clicks "Analyze Waste" — [`RecycleScan.jsx`](../frontend/src/pages/RecycleScan.jsx) sends the photo to `POST /predict/waste`
3. The endpoint receives it — [`routers/waste.py`](../backend/routers/waste.py)
4. The model runs on the photo — [`inference.py`](../backend/inference.py)
5. The label is matched to a recycling tip — [`config.py`](../backend/config.py)
6. The scan is saved to history — [`database.py`](../backend/database.py)
7. The answer comes back and is shown — [`ScanResult.jsx`](../frontend/src/components/ScanResult.jsx)

Freshness works the same way through `routers/freshness.py`.
