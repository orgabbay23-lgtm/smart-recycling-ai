# 🗂️ Project Structure

A guided tour of the folders, written so anyone can find their way around.
This replaces the old `project_structure_report.txt` (which was out of date).

---

## Top level

```
smart-recycling-ai/
├── frontend/      React + Vite + Tailwind web app (what the user sees)
├── backend/       FastAPI server: the API + model inference + history database
├── models/        Model training code and saved model files (.pth)
├── scripts/       Dataset preparation & helper scripts
├── experiments/   Saved evaluation results for the older baseline model
├── datasets/      Image data (LOCAL ONLY — not in Git; large)
├── notebooks/     Empty placeholder (the real notebooks live under models/)
├── docs/          The guides you're reading now
├── README.md      Project overview + how to run it
├── requirements.txt   Python dependencies for the backend & training
├── start_app.bat / start_app.sh   One-click "start both servers" scripts
├── Commands.txt   Quick copy-paste run commands
├── Final MVP.md   Historical: the original minimum-scope plan
├── TODO.md        Historical: the original planning checklist
└── Smart_Recycling_Project_Document.pdf   The formal academic write-up
```

---

## `frontend/` — the website

```
frontend/
├── index.html
├── package.json            Dependencies & scripts (dev / build / preview)
├── vite.config.js          Dev server runs on port 3000
├── tailwind.config.js      Styling config
└── src/
    ├── App.jsx             Routes: which URL shows which page
    ├── main.jsx            App entry point
    ├── index.css           Global styles
    ├── pages/              One file per screen
    │   ├── Home.jsx
    │   ├── RecycleScan.jsx
    │   ├── FreshnessScan.jsx
    │   ├── History.jsx
    │   ├── Statistics.jsx
    │   ├── Quiz.jsx
    │   ├── About.jsx
    │   └── ModelComparison.jsx   ("Previous Versions" page)
    ├── components/         Reusable UI pieces
    │   ├── Layout.jsx      Top nav + page shell
    │   ├── ImageCapture.jsx   Camera/upload control
    │   ├── ScanResult.jsx  The result card
    │   ├── resultMeta.jsx  Wording/colors/icons per result
    │   ├── Button.jsx
    │   └── CodeExamples.jsx   Code snippets shown on the About page
    ├── services/
    │   └── api.js          The backend URL — one place all pages import
    └── (public/)
        └── public/metrics/   Confusion-matrix images shown in the app
```

---

## `backend/` — the API and the AI

```
backend/
├── main.py            Creates the FastAPI app, wires the routes, /health
├── inference.py       Loads the EfficientNetV2 models and runs predictions
├── config.py          Class names, recommendations, and model file paths
├── database.py        SQLite scan-history (save / list / delete)
├── routers/
│   ├── waste.py       POST /predict/waste
│   ├── freshness.py   POST /predict/freshness  (+ smart food tips)
│   ├── history.py     GET /history, DELETE /history/{id}
│   └── quiz.py        GET /quiz/random
└── scan_history.db    Local database file (auto-created; NOT in Git)
```

---

## `models/` — training code + saved models

```
models/
├── new_models_efficientnetv2/   ← CURRENT model (used by the app)
│   ├── README_RETRAIN.md        How/why the models were retrained
│   ├── waste/                   Notebook + report + confusion matrix
│   └── freshness/               Notebook + report + confusion matrix
├── train_waste.py               ← PREVIOUS baseline (ResNet18) training
├── train_freshness.py           ← PREVIOUS baseline (ResNet18) training
├── data_loader.py               Helpers for the baseline scripts
├── evaluate_models.py           Evaluation for the baseline scripts
├── config.py                    Dataset paths for the baseline scripts
├── checkpoints/                 Saved .pth model files (NOT in Git — large)
└── exported/                    Placeholder for any future exported models
```

See [MODEL_GUIDE.md](MODEL_GUIDE.md) for which files are current vs. historical.

---

## What is intentionally NOT in Git

These are generated locally or too large to store. `.gitignore` excludes them on
purpose, and the app/tooling recreates them:

| Item | Why it's not committed |
|---|---|
| `frontend/node_modules/` | Reinstalled with `npm install`. |
| `frontend/dist/` | Build output; rebuilt with `npm run build`. |
| `venv/` | Local Python environment; recreated from `requirements.txt`. |
| `__pycache__/` | Python bytecode cache. |
| `*.pth` model files | Large binaries; kept on disk in `models/checkpoints/`. |
| `datasets/` | Large image data; only needed for training and the quiz. |
| `backend/scan_history.db` | Local runtime data; created automatically. |

There is nothing missing from the repo — these are simply things that live on
your machine rather than in version control. See [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)
for how the large files are handled when going online.

---

## Where to read next

- [CODE_MAP.md](CODE_MAP.md) — "where is feature X in the code?"
- [DEMO_GUIDE.md](DEMO_GUIDE.md) — how to present it.
- [MODEL_GUIDE.md](MODEL_GUIDE.md) — the models in detail.
- [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) — putting it online.
