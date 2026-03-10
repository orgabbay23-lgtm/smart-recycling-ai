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
| 🥗 **Food Freshness Detection** | Detects whether food is fresh, half-fresh, or rotten | Freshness level + usage/disposal recommendation |

> 💡 The goal is to build a clean academic prototype that demonstrates how machine learning can be applied to real-world sustainability problems.

---

## 🎯 Project Goals

- Build a simple and understandable AI-based web application
- Apply computer vision to a real-world environmental problem
- Train image classification models for two practical tasks
- Create a user-friendly interface for image upload and prediction
- Present a complete end-to-end prototype suitable for an academic final project

---

## ✨ Core Features

### ♻️ Waste Classification
The user uploads an image of a waste item, and the system predicts whether it is:

- Plastic
- Glass
- Paper
- Metal

After classification, the system displays the **recommended recycling bin**.

### 🥗 Food Freshness Detection
The user uploads an image of food, and the system predicts whether it is:

- Fresh
- Half-Fresh
- Rotten

After prediction, the system displays a simple recommendation such as:

- Safe to use
- Use soon
- Discard

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
User uploads image
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

## 📁 Project Structure

```text
smart-recycling-ai/
│
├── frontend/          # React application
├── backend/           # FastAPI application
├── models/            # Trained model files and model-related code
├── datasets/          # Dataset references / prepared dataset structure
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

## 🗃️ Datasets

The project uses publicly available image datasets relevant to the two target tasks.

### ♻️ Waste Classification Dataset

Expected labeled categories:

* Plastic
* Glass
* Paper
* Metal

### 🥗 Food Freshness Dataset

Expected labeled categories:

* Fresh food
* Half-fresh food
* Rotten food

> 📚 The final selected datasets, preprocessing decisions, class balance, and limitations will be documented during implementation.

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

| Component              | Purpose                               | Status   |
| ---------------------- | ------------------------------------- | -------- |
| 🗄️ PostgreSQL         | Save scan history                     | Optional |
| ☁️ Cloud image storage | Save uploaded images if needed        | Optional |
| 📝 Feedback collection | Allow reporting incorrect predictions | Optional |

> 🚦 These features are **not required** for the first working version of the project.

---

## 📌 Current Status

The project is currently in the **planning and design phase**.

### ✅ Completed

* Project idea definition
* Functional and non-functional requirements
* System architecture planning
* Dataset research
* Academic documentation preparation

### ⏭️ Next Steps

* Finalize dataset selection
* Prepare datasets
* Train baseline models
* Build backend API
* Build frontend application
* Connect the full prediction flow

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

