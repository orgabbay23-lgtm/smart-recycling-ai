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
| ♻️ **Waste Classification** | Detects whether an item belongs to plastic, glass, paper, or metal | Predicted class + recycling recommendation |
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
The user captures an image of a waste item, and the system predicts whether it is:

- Plastic
- Glass
- Paper
- Metal

After classification, the system displays the **recommended recycling bin**.

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

## 📌 Current MVP Scope

The current MVP is intentionally small and focused.

### Included in the current MVP

* Two modes:

  * Recycle Scan
  * Freshness Scan
* Camera-based capture in the browser
* One-image-per-scan flow
* Waste classes:

  * Plastic
  * Glass
  * Paper
  * Metal
* Freshness classes:

  * Fresh
  * Rotten
* Simple FastAPI backend with 2 prediction endpoints
* Simple frontend pages for the demo

### Not included in the current MVP

* Login / authentication
* Database
* Scan history
* Cloud image storage
* Report incorrect result
* Continuous live inference
* Additional fruit types beyond Apple and Banana for training
* Additional waste categories beyond the selected four classes

---

## 🗃️ Datasets

The project uses publicly available image datasets relevant to the two target tasks.

### ♻️ Waste Classification Dataset

Selected dataset:

* **Garbage Classification V2**

Final MVP classes:

* Plastic
* Glass
* Paper
* Metal

### 🥗 Food Freshness Dataset

Selected dataset:

* **Mendeley FruitVision**

Final MVP scope:

* Fruit types used for training:

  * Apple
  * Banana
* Final labels:

  * Fresh
  * Rotten

> 📚 The processed datasets are balanced subsets prepared specifically for the MVP.

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
├── frontend/          # React application
├── backend/           # FastAPI application
├── models/            # Trained model files and model-related code
├── datasets/          # Raw and processed datasets
├── scripts/           # Dataset preparation and future utility scripts
├── docs/              # Project documents, notes, and diagrams
├── README.md
└── TODO.md
```

> 🧩 The project structure is intentionally kept small, clean, and easy to understand.

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

The project is currently in the **dataset-prepared stage**.

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

### ⏭️ Next Steps

* Train baseline waste model
* Train baseline freshness model
* Build backend API
* Build frontend application
* Connect the full prediction flow
* Test the end-to-end demo

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

