# ♻️ Smart Recycling and Food Waste Prevention System

<p align="center">
  <b>Final-Year B.Sc. Data Science Project</b><br>
  Deep Learning + Computer Vision for smarter recycling and food freshness detection
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Frontend-React%20%2B%20Vite-61DAFB?style=for-the-badge" alt="Frontend Badge" />
  <img src="https://img.shields.io/badge/Backend-FastAPI-009688?style=for-the-badge" alt="Backend Badge" />
  <img src="https://img.shields.io/badge/Models-PyTorch-EE4C2C?style=for-the-badge" alt="PyTorch Badge" />
  <img src="https://img.shields.io/badge/Focus-Computer%20Vision-6A5ACD?style=for-the-badge" alt="CV Badge" />
  <img src="https://img.shields.io/badge/Project-Academic%20Prototype-2E8B57?style=for-the-badge" alt="Academic Badge" />
</p>

---

## 🌍 Overview

This project presents a simple, practical, and easy-to-understand AI-based web application that helps users make better environmental decisions.

It focuses on **two main tasks**:

| Feature | What it does | Output |
|---|---|---|
| ♻️ **Waste Classification** | Detects an item's category across 10 types (battery, biological, cardboard, clothes, glass, metal, paper, plastic, shoes, trash) | Predicted class + recycling recommendation |
| 🥗 **Food Freshness Detection** | Detects whether food is fresh or rotten | Freshness level + usage/disposal recommendation |

> 💡 The goal is to build a clean academic prototype that demonstrates how machine learning can be applied to real-world sustainability problems.

---

## 🎯 Project Goals

- Build a simple and understandable AI-based web application
- Apply computer vision to a real-world environmental problem
- Train image classification models for two practical tasks
- Create a user-friendly interface for camera capture and prediction
- Present a complete end-to-end prototype suitable for an academic final project

---

## ✨ Core Features

### ♻️ Waste Classification
The user captures an image of a waste item, and the system predicts its category
across **10 classes**:

- battery
- biological
- cardboard
- clothes
- glass
- metal
- paper
- plastic
- shoes
- trash

After classification, the system displays the **recommended recycling bin** for
that category.

### 🥗 Food Freshness Detection
The user captures an image of food, and the system predicts whether it is:

- Fresh
- Rotten

After prediction, the system displays a simple recommendation such as:

- Safe to use
- Use soon
- Discard / Compost

---

## 🏗️ System Architecture

| Layer | Technology | Purpose |
|---|---|---|
| 🎨 Frontend | React + Vite + TailwindCSS | User interface |
| ⚙️ Backend | FastAPI | API and inference handling |
| 🧠 Models | PyTorch CNN models | Image classification |
| 🗂️ Datasets | Public image datasets | Training and evaluation |

### 🔄 High-Level Flow

```text
User opens scan page
      ↓
Frontend opens browser camera
      ↓
User captures one image
      ↓
Frontend sends request to backend
      ↓
Backend preprocesses image
      ↓
Model predicts class
      ↓
Backend returns result
      ↓
Frontend shows label + confidence + recommendation
````

### 📦 Returned Result

* **Predicted label**
* **Confidence score**
* **Recommendation text**

---

## 📌 What the App Does Today

The project started as a small MVP and has since grown into a fuller demo. The
original minimum-scope plan is preserved in [`Final MVP.md`](Final%20MVP.md) for
history; this is where things actually stand now.

### Included today

* **Two scan modes:** Recycle Scan and Freshness Scan
* **Camera or file upload** in the browser, one image per scan
* **Waste classification across 10 classes** (battery, biological, cardboard,
  clothes, glass, metal, paper, plastic, shoes, trash)
* **Freshness classification** (fresh / rotten) with smart food tips
  (storage / recipe / safety) on top of the prediction
* **Scan history** saved in a local SQLite database
* **Statistics page** summarizing past scans
* **Quiz game** built from labelled dataset images
* **About page** with model explanations, accuracy, and confusion matrices
* **Previous Versions page** comparing the baseline and final models
* A modular **FastAPI** backend serving the models

### Not included (out of scope)

* Login / user accounts
* Cloud image storage (only a tiny thumbnail is kept for the history list)
* "Report incorrect result" feedback loop
* Continuous live video inference

> 💡 The current models are the **EfficientNetV2-S** models. The earlier
> ResNet18 models (4 waste classes) are kept as a baseline — see
> [`docs/MODEL_GUIDE.md`](docs/MODEL_GUIDE.md).

---

## 🗃️ Datasets

The project uses publicly available image datasets for the two tasks.

### ♻️ Waste Classification

* **Final model (EfficientNetV2-S):** trained on
  [Garbage Classification V2](https://www.kaggle.com/datasets/sumn2u/garbage-classification-v2)
  (~19k images, 10 classes).
* **Baseline model (ResNet18):** trained on a smaller balanced 4-class subset
  (glass, metal, paper, plastic) prepared by
  [`scripts/prepare_mvp_datasets.py`](scripts/prepare_mvp_datasets.py).

### 🥗 Food Freshness

* **Final model (EfficientNetV2-S):** trained on the
  [Food Freshness Dataset](https://www.kaggle.com/datasets/ulnnproject/food-freshness-dataset)
  (fresh vs. rotten).
* **Baseline model (ResNet18):** trained on a balanced Apple/Banana subset of the
  Mendeley FruitVision dataset.

> 📚 The large `datasets/` folder is local only (not in Git). The final models
> were trained on Kaggle — see [`docs/MODEL_GUIDE.md`](docs/MODEL_GUIDE.md).

---

## 🧪 Current Dataset Preparation Status

The dataset preparation stage for the MVP has already been completed.

### Completed

* Raw dataset folders created and documented
* Processed dataset folders created
* Balanced subset selection implemented
* `train / val / test` splits generated
* Preprocessing script added:

  * `scripts/prepare_mvp_datasets.py`

### Processed dataset structure

* `datasets/waste/processed/train|val|test/{plastic,glass,paper,metal}`
* `datasets/freshness/processed/train|val|test/{fresh,rotten}`

### Balancing logic

* **Waste** is balanced using the smallest relevant waste class size
* **Freshness** is balanced using the smallest subgroup among:

  * Apple/Fresh
  * Apple/Rotten
  * Banana/Fresh
  * Banana/Rotten

This keeps the final freshness dataset balanced both:

* across final classes (`fresh` / `rotten`)
* and inside each class (`Apple` / `Banana`)

---

## 🧠 Model Development Plan

The project uses **simple CNN-based image classification models** as a starting point.

### Planned Workflow

1. Select a baseline model
2. Train the model on the prepared dataset
3. Evaluate performance on validation and test data
4. Improve only if needed
5. Save the final selected model for application integration

### Evaluation Focus

| Metric / Output    | Purpose                            |
| ------------------ | ---------------------------------- |
| Accuracy           | Measure overall performance        |
| Confusion Matrix   | Understand class-level mistakes    |
| Version Comparison | Compare baseline vs improved model |

---

## 🧩 Optional Components

These components are optional and will only be added if they support the final demo and remain manageable.

* Scan history
* Database integration
* Cloud image storage
* User feedback loop
* Additional classes or larger datasets
* Future deployment

---

## 🗂️ Repository Structure

```text
smart-recycling-ai/
├── frontend/      # React + Vite + Tailwind web app (the user interface)
├── backend/       # FastAPI server: API + model inference + history database
├── models/        # Model training code and saved model files (.pth)
├── scripts/       # Dataset preparation & helper scripts
├── experiments/   # Saved evaluation results for the baseline model
├── datasets/      # Image data (local only, not in Git)
├── docs/          # Guides: code map, demo, model, deployment, structure
├── README.md
├── requirements.txt
└── TODO.md
```

> 🧩 For a full walkthrough of every folder, see
> [`docs/PROJECT_STRUCTURE.md`](docs/PROJECT_STRUCTURE.md).

---

## 🚀 Run it Locally

You need **Python 3.10+** and **Node.js 18+**.

**One-click:** double-click `start_app.bat` (Windows) or run `./start_app.sh`
(Mac/Linux) to start both servers at once.

**Or start them by hand:**

```bash
# 1) Backend (from the project root)
python -m venv venv
venv\Scripts\activate          # Windows  (Mac/Linux: source venv/bin/activate)
pip install -r requirements.txt
python -m uvicorn backend.main:app --reload     # → http://localhost:8000

# 2) Frontend (in a second terminal)
cd frontend
npm install
npm run dev                     # → http://localhost:3000
```

Then open **http://localhost:3000**. The interactive API docs are at
**http://localhost:8000/docs**.

> The backend loads the EfficientNetV2 `.pth` model files from
> `models/checkpoints/`. These are large and not stored in Git — make sure they
> are present locally.

---

## 📖 Documentation

| Guide | What it covers |
|---|---|
| [docs/CODE_MAP.md](docs/CODE_MAP.md) | "Where is this in the code?" — a feature → file lookup table |
| [docs/DEMO_GUIDE.md](docs/DEMO_GUIDE.md) | How to present the project + likely questions and answers |
| [docs/MODEL_GUIDE.md](docs/MODEL_GUIDE.md) | The current vs. baseline models, training, datasets, metrics |
| [docs/DEPLOYMENT_GUIDE.md](docs/DEPLOYMENT_GUIDE.md) | How to put the app online (and why) |
| [docs/PROJECT_STRUCTURE.md](docs/PROJECT_STRUCTURE.md) | A guided tour of every folder |

---

## 🧼 Design Principles

This project is intentionally designed to remain:

* **Simple**
* **Readable**
* **Maintainable**
* **Academic-friendly**

### Main Principles

* Keep files small and focused
* Use clear names for files, functions, and variables
* Avoid unnecessary complexity
* Separate frontend, backend, and model logic clearly
* Centralize reusable constants, labels, and mappings
* Make future UI changes easy to perform

---

## 🎨 Frontend Maintainability

The frontend should be organized so that future design changes are simple and safe.

| Folder / Area             | Responsibility               |
| ------------------------- | ---------------------------- |
| `components/`             | Reusable UI components       |
| `pages/`                  | Main application pages       |
| `services/`               | API communication            |
| `constants/` or `config/` | Colors, labels, UI constants |

### Why this matters

This structure makes it easier to:

* change a button color
* update displayed text
* reuse components
* keep the UI consistent

---

## ⚙️ Backend Maintainability

The backend should separate responsibilities clearly.

| Area             | Responsibility                     |
| ---------------- | ---------------------------------- |
| `routes/`        | API endpoints                      |
| `preprocessing/` | Image preparation before inference |
| `inference/`     | Model prediction logic             |
| `config/`        | Labels, paths, and constants       |

### Why this matters

This makes the backend easier to:

* read
* test
* debug
* update later

---

## 📌 Current Status

The project currently has a **fully functional MVP** integrating trained PyTorch models, a FastAPI backend, and a React frontend.

### ✅ Completed

* Project idea definition
* Functional and non-functional requirements
* System architecture planning
* Dataset research
* Final MVP definition
* Raw dataset organization
* Processed dataset creation
* Balanced subset generation
* `train / val / test` dataset split
* Dataset preprocessing script creation
* Academic documentation preparation
* Trained baseline ResNet18 models for Waste and Freshness
* Upgraded to EfficientNetV2-S models trained on Kaggle (T4 GPU): Waste 10-class
  garbage classification (~99.6% val accuracy) and Freshness fresh/rotten (~98.8%)
* Evaluated models on held-out sets (classification reports + confusion matrices)
* Built modular FastAPI backend serving the models
* Built React + TailwindCSS frontend with browser camera integration
* Connected full end-to-end prediction flow
* Added scan history (SQLite), a statistics dashboard, and a quiz game
* Added an About page and a model-comparison ("Previous Versions") page

### ⏭️ Next Steps

* UI/UX refinements and error handling improvements
* Code cleanup and organization
* Adding final project documentation and screenshots

---

## 🛣️ Project Roadmap

| Milestone       | Focus                                       |
| --------------- | ------------------------------------------- |
| 🧠 **Phase 1**  | Requirements, planning, architecture        |
| 🗂️ **Phase 2** | Dataset preparation                         |
| 🤖 **Phase 3**  | Model training and evaluation               |
| ⚙️ **Phase 4**  | Backend and frontend development            |
| 🔗 **Phase 5**  | Full integration and testing                |
| 🎓 **Phase 6**  | Final demo, documentation, and presentation |

---

## 📚 Documentation

Project documentation should include:

* 📝 Project overview
* 🏗️ Architecture explanation
* 🗂️ Dataset choices
* ⚠️ Limitations
* 📊 Experiment results
* 🖼️ Application screenshots
* ✅ Final conclusions

---

## 🎓 Academic Scope

This project is intended as a **B.Sc. Data Science final project**.

### Focus Areas

* applying machine learning in a practical scenario
* building a clear and understandable prototype
* demonstrating end-to-end system design
* presenting results in a structured academic format

> 🎯 The goal is not to build a large-scale production system, but a solid, well-organized, and understandable academic project.

---

## 🚀 Future Work

Possible future improvements:

* support more waste categories
* support more food types
* improve model accuracy with larger datasets
* add user history and analytics
* deploy the system online

---

## 👨‍💻 Authors

| Name                 |
| -------------------- |
| **Or Gabbay**        |
| **Daniel Yerichman** |

---

## 💚 Final Note

This project combines **AI**, **environmental awareness**, and **practical usability** into one academic system.

It is designed to be:

* clear
* meaningful
* approachable
* easy to explain
* easy to maintain

> ♻️ Small, smart, and meaningful technology can still make a real difference.

