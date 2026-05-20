# ♻️ TODO — Smart Recycling and Food Waste Prevention System

## 🌿 Principles for This Project

* [x] Keep the project simple and easy to understand
* [x] Prefer clean and readable code over “advanced” architecture
* [x] Build only what is needed for the final demo
* [x] Write code only through Codex CLI

> **Legend**
>
> `**[Codex CLI]**` = task can be done through prompts to Codex CLI inside the local repository / terminal  
> no label = planning / research decision / academic writing choice / manual review task

---

## 🛠️ 1) Project Setup

* [x] Create GitHub repository
* [x] Add initial `README.md`
* [x] Define main folders:

  * [x] `frontend/`
  * [x] `backend/`
  * [x] `models/`
  * [x] `datasets/`
  * [x] `docs/`
* [x] Make sure folder names are final and consistent
* [x] **[Codex CLI]** Add simple `.gitignore`

---

## 📌 2) Requirements and Scope

* [x] Finalize functional requirements
* [x] Finalize non-functional requirements
* [x] Define the 2 main modes:

  * [x] Recycle Scan
  * [x] Freshness Scan
* [x] Define expected outputs:

  * [x] class label
  * [x] confidence score
  * [x] recommendation text
* [x] Define MVP scope
* [x] Define exact final demo flow
* [x] Decide to use camera-based capture for the MVP
* [x] Decide that the MVP freshness labels are only `Fresh` and `Rotten`
* [x] Decide that login / database / history are out of scope for the MVP

---

## 🗂️ 3) Dataset Work

### Waste Classification

* [x] Find dataset candidates
* [x] Choose final classes for MVP
* [x] **[Codex CLI]** Prepare raw dataset folder structure
* [x] **[Codex CLI]** Add dataset notes in raw folders
* [x] **[Codex CLI]** Organize processed dataset structure
* [x] **[Codex CLI]** Create preprocessing script for waste dataset
* [x] **[Codex CLI]** Build balanced processed waste dataset
* [x] **[Codex CLI]** Split into `train / validation / test`
* [x] Balance classes using the smallest relevant waste class size
* [ ] Manually review a sample of waste images for obvious bad or irrelevant examples

### Food Freshness

* [x] Find dataset candidates
* [x] Decide food categories in scope
* [x] Decide final fruit types for the MVP:
  * [x] Apple
  * [x] Banana
* [x] Decide final freshness labels for the MVP:
  * [x] Fresh
  * [x] Rotten
* [x] **[Codex CLI]** Prepare raw dataset folder structure
* [x] **[Codex CLI]** Add dataset notes in raw folders
* [x] **[Codex CLI]** Organize processed dataset structure
* [x] **[Codex CLI]** Create preprocessing script for freshness dataset
* [x] **[Codex CLI]** Build balanced processed freshness dataset
* [x] **[Codex CLI]** Split into `train / validation / test`
* [x] Balance final freshness classes using the smallest subgroup among:
  * [x] Apple/Fresh
  * [x] Apple/Rotten
  * [x] Banana/Fresh
  * [x] Banana/Rotten
* [ ] Manually review a sample of freshness images for obvious bad or irrelevant examples

### Preprocessing

* [x] **[Codex CLI]** Create preprocessing script/module for dataset preparation
* [x] **[Codex CLI]** Document dataset summary
* [x] **[Codex CLI]** Create preprocessing logic for model training (resize / tensor conversion / normalization)
* [x] **[Codex CLI]** Add normalization logic
* [x] **[Codex CLI]** Add simple augmentation
* [x] **[Codex CLI]** Save preprocessing decisions in one config/module

---

## 🧠 4) Model Development

### Waste Model

* [x] Choose one simple baseline model
* [x] **[Codex CLI]** Create training script for waste model
* [x] **[Codex CLI]** Train first version
* [x] **[Codex CLI]** Add validation/evaluation output
* [ ] **[Codex CLI]** Improve model if needed
* [x] **[Codex CLI]** Save best model

### Freshness Model

* [x] Choose one simple baseline model
* [x] **[Codex CLI]** Create training script for freshness model
* [ ] **[Codex CLI]** Train first version
* [x] **[Codex CLI]** Add validation/evaluation output
* [ ] **[Codex CLI]** Improve model if needed
* [x] **[Codex CLI]** Save best model

### Evaluation

* [x] **[Codex CLI]** Measure accuracy
* [x] **[Codex CLI]** Create confusion matrix
* [x] **[Codex CLI]** Save training/validation loss charts
* [x] Compare first vs final version
* [ ] Write short conclusions

---

## ⚙️ 5) Backend (FastAPI)

* [x] **[Codex CLI]** Create simple FastAPI project structure
* [x] **[Codex CLI]** Add health endpoint
* [x] **[Codex CLI]** Add `/predict/waste` endpoint
* [x] **[Codex CLI]** Add `/predict/freshness` endpoint
* [x] **[Codex CLI]** Add model loading logic
* [x] **[Codex CLI]** Add inference preprocessing
* [x] **[Codex CLI]** Return JSON with:

  * [x] **[Codex CLI]** predicted label
  * [x] **[Codex CLI]** confidence
  * [x] **[Codex CLI]** recommendation
* [x] **[Codex CLI]** Add simple validation for image upload / captured image input
* [x] **[Codex CLI]** Add clear error messages

---

## 🎨 6) Frontend (React + Vite + TailwindCSS)

### Basic App Structure

* [x] **[Codex CLI]** Initialize frontend project
* [x] **[Codex CLI]** Configure TailwindCSS
* [x] **[Codex CLI]** Create simple routing
* [x] **[Codex CLI]** Create shared layout
* [x] **[Codex CLI]** Create reusable button, card, and result components

### Pages

* [x] **[Codex CLI]** Create Home page
* [x] **[Codex CLI]** Create Recycle Scan page
* [x] **[Codex CLI]** Create Freshness Scan page
* [x] **[Codex CLI]** Create Results section/page
* [x] **[Codex CLI]** Create About the project page

### Camera Capture Flow

* [x] **[Codex CLI]** Add browser camera access
* [x] **[Codex CLI]** Show camera preview
* [x] **[Codex CLI]** Add capture button
* [x] **[Codex CLI]** Convert captured image into request payload
* [x] **[Codex CLI]** Send captured image to backend
* [x] **[Codex CLI]** Show loading state
* [x] **[Codex CLI]** Show result clearly
* [x] **[Codex CLI]** Show confidence
* [x] **[Codex CLI]** Show recommendation
* [x] **[Codex CLI]** Add “try again” button

### UI/UX

* [ ] **[Codex CLI]** Keep UI simple and clean
* [ ] **[Codex CLI]** Make app responsive
* [ ] **[Codex CLI]** Add basic error states
* [ ] **[Codex CLI]** Make texts easy to understand

---

## 🔗 7) Integration

* [x] **[Codex CLI]** Connect frontend to waste endpoint
* [x] **[Codex CLI]** Connect frontend to freshness endpoint
* [x] **[Codex CLI]** Test end-to-end waste flow
* [ ] **[Codex CLI]** Test end-to-end freshness flow
* [x] **[Codex CLI]** Handle failed API response in UI

---

## ✨ 8) Optional Features

### Database

* [ ] Decide whether to save scan history
* [x] **[Codex CLI]** If yes: create one simple table for scan history
* [x] **[Codex CLI]** If yes: connect backend to SQLite / database
* [x] **[Codex CLI]** Add fetch user history endpoint
* [x] **[Codex CLI]** Implement simple history UI in Frontend

### Cloud Storage

* [ ] Decide whether image saving is really needed
* [ ] **[Codex CLI]** If yes: add simple image storage solution

### Feedback Loop

* [ ] **[Codex CLI]** Add “Report Incorrect Result” button only if time allows

---

## ✅ 9) Testing

* [ ] Test model prediction on sample images
* [ ] **[Codex CLI]** Add backend endpoint tests
* [ ] **[Codex CLI]** Add frontend camera flow checks/tests
* [ ] Test full app manually with real images
* [ ] Check mobile and desktop view

---

## 🧹 10) Code Clarity and Maintainability

### General

* [ ] **[Codex CLI]** Keep files small and focused
* [ ] **[Codex CLI]** Give clear names to files, functions, and variables
* [ ] **[Codex CLI]** Add short comments only where really needed
* [ ] **[Codex CLI]** Avoid duplicate logic
* [ ] **[Codex CLI]** Keep constants in one place

### Frontend Organization

* [ ] **[Codex CLI]** Put shared UI components in one `components/` folder
* [ ] **[Codex CLI]** Put page files in one `pages/` folder
* [ ] **[Codex CLI]** Put API calls in one `services/` folder
* [ ] **[Codex CLI]** Put colors, labels, and UI constants in one `config/` or `constants/` file
* [x] **[Codex CLI]** Make button styles reusable from one component

### Backend Organization

* [x] **[Codex CLI]** Separate routes, model loading, preprocessing, and inference logic
* [ ] **[Codex CLI]** Keep request/response schemas in one place
* [ ] **[Codex CLI]** Keep label-to-recommendation mapping in one file
* [ ] **[Codex CLI]** Keep model paths in config file
* [ ] **[Codex CLI]** Avoid mixing training code with API code

### Easy Future Changes

* [x] **[Codex CLI]** Make it possible to change button color from one central file/component
* [ ] **[Codex CLI]** Make it possible to change result text from one mapping file
* [ ] **[Codex CLI]** Make it possible to change class labels without touching many files
* [ ] **[Codex CLI]** Make it possible to replace a model file without changing endpoint