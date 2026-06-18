# 🎤 Demo & Presentation Guide

A simple script for showing **Smart Recycling AI** to a lecturer or reviewer.
The goal: tell a clear story, show the app working, and be ready for "where is
this in the code?" questions.

> Keep [CODE_MAP.md](CODE_MAP.md) open in a second tab. When asked where
> something lives, glance at it and open the file.

---

## Before the demo (5-minute checklist)

1. Start both servers:
   - **Windows:** double-click `start_app.bat`
   - **Mac/Linux:** run `./start_app.sh`
   - Or start them by hand (see the README "Run it locally" section).
2. Open the app: **http://localhost:3000**
3. Open the API docs in another tab: **http://localhost:8000/docs**
   (FastAPI's automatic, interactive API page — great to show.)
4. Have 2–3 test photos ready: a plastic bottle / cardboard box, and a fruit
   (one fresh, one overripe). Phone photos work fine.
5. Do one practice scan so the first scan in front of the lecturer is smooth.

---

## One-sentence pitch

> "It's a website where you take a photo of a piece of waste or a fruit, and an
> AI model tells you which recycling bin it belongs in — or whether the fruit is
> still good to eat — and gives you a helpful tip."

---

## Recommended demo order

| Step | Screen | What it demonstrates | What to say |
|---|---|---|---|
| 1 | **Home** (`/`) | The two main features | "The app does two things: recycling help and food-freshness checks." |
| 2 | **Scan Waste** (`/recycle`) | The core AI flow | "I upload a photo, the AI predicts the category and tells me the right bin." |
| 3 | **Check Freshness** (`/freshness`) | A second model + smart tips | "Same idea for food. If it's fresh it suggests storage; if it's overripe it suggests recipes; if it's rotten it warns me to throw it away." |
| 4 | **History** (`/history`) | The database in action | "Every scan is saved. Here are the recent ones with thumbnails." |
| 5 | **Statistics** (`/statistics`) | Reading from the database | "This summarizes what I've scanned so far." |
| 6 | **Play Quiz** (`/quiz`) | An engaging extra | "A small game that quizzes you using real dataset images." |
| 7 | **About** (`/about`) | The serious part | "This explains the models, shows the accuracy, the confusion matrices, and some of the actual code." |
| 8 | **Previous Versions** (`/previous-versions`) | Engineering maturity | "We didn't just build one model — we improved on a baseline. Here's the comparison." |

If you only have 3 minutes: do steps **2, 3, and 7**.

---

## What each screen is for (one line each)

- **Home** — friendly entry point with two buttons.
- **Scan Waste** — upload a waste photo → category + recycling bin recommendation.
- **Check Freshness** — upload a fruit photo → fresh/rotten + a smart tip.
- **History** — the last 20 scans, with small thumbnails; you can delete items.
- **Statistics** — counts and breakdowns built from the saved history.
- **Play Quiz** — a guessing game served from the labelled dataset.
- **About** — what the app is, how the models were trained, accuracy numbers,
  metric tables, confusion matrices, and example code.
- **Previous Versions** — the older ResNet18 baseline next to the current
  EfficientNetV2 model, so you can see the improvement.

---

## Common lecturer questions — short, honest answers

**"Where does the image go after I upload it?"**
The browser sends it to the backend API (`POST /predict/waste` or
`/predict/freshness`). See [`RecycleScan.jsx`](../frontend/src/pages/RecycleScan.jsx)
on the frontend and [`routers/waste.py`](../backend/routers/waste.py) on the backend.
The image is processed in memory — we don't store the full photo, only a tiny
thumbnail for the history list.

**"Where is the AI model loaded?"**
In [`backend/inference.py`](../backend/inference.py). Both models load once when
the server starts, so each prediction is fast.

**"Where did you train the model?"**
On Kaggle, using a free T4 GPU. The notebooks and results are in
[`models/new_models_efficientnetv2/`](../models/new_models_efficientnetv2/).
Full details in [MODEL_GUIDE.md](MODEL_GUIDE.md).

**"How do you know the model works?"**
We evaluated it on a held-out test set the model never saw during training.
The waste model scores about **99.6%** across 10 categories and the freshness
model about **98.8%**. The classification reports and confusion matrices are on
the **About** page and in
[`models/new_models_efficientnetv2/`](../models/new_models_efficientnetv2/).

**"Where are the recommendations (which bin) defined?"**
In [`backend/config.py`](../backend/config.py) — a simple mapping from each
category (e.g. `glass`) to a recommendation (e.g. "Purple Bin — glass recycling").
To change wording, you edit one dictionary.

**"What happens if the API fails?"**
The scan pages catch the error and show a friendly message ("We couldn't analyze
that image. Please try again.") instead of crashing. See the `try/catch` in
[`RecycleScan.jsx`](../frontend/src/pages/RecycleScan.jsx). Uploading a non-image
file returns a clear 400 error from the backend.

**"What is saved in history?"**
Only four small things per scan: the type (waste/freshness), the predicted label,
the confidence, the time, and a tiny 80×80 thumbnail. No accounts, no personal
data. See [`backend/database.py`](../backend/database.py).

**"Can this run online?"**
Yes. The frontend can go on Vercel and the backend on a service like Render or
Railway. We kept it local for the demo because the model files are large.
The full plan is in [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md).

**"Why two models instead of one?"**
They solve two different problems (sorting waste vs. judging freshness) with
different categories, so each is trained and evaluated separately.

**"What's the difference between the old and new model?"**
The baseline was ResNet18 on 4 waste classes. The final model is EfficientNetV2-S
on 10 waste classes with much higher accuracy. The **Previous Versions** page
shows them side by side.

---

## If something breaks live (stay calm)

- **Blank page / nothing loads:** check the frontend terminal is still running
  on port 3000.
- **Scan spins forever or errors:** the backend probably isn't running — check
  the backend terminal (port 8000) and reload.
- **"Failed to fetch":** the frontend can't reach the backend. Confirm both are
  running, then retry. Have a backup screenshot ready just in case.
