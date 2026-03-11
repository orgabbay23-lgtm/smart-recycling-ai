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
* [ ] **[Codex CLI]** Create preprocessing logic for model training (resize / tensor conversion / normalization)
* [ ] **[Codex CLI]** Add normalization logic
* [ ] **[Codex CLI]** Add simple augmentation
* [ ] **[Codex CLI]** Save preprocessing decisions in one config/module

---

## 🧠 4) Model Development

### Waste Model

* [ ] Choose one simple baseline model
* [ ] **[Codex CLI]** Create training script for waste model
* [ ] **[Codex CLI]** Train first version
* [ ] **[Codex CLI]** Add validation/evaluation output
* [ ] **[Codex CLI]** Improve model if needed
* [ ] **[Codex CLI]** Save best model

### Freshness Model

* [ ] Choose one simple baseline model
* [ ] **[Codex CLI]** Create training script for freshness model
* [ ] **[Codex CLI]** Train first version
* [ ] **[Codex CLI]** Add validation/evaluation output
* [ ] **[Codex CLI]** Improve model if needed
* [ ] **[Codex CLI]** Save best model

### Evaluation

* [ ] **[Codex CLI]** Measure accuracy
* [ ] **[Codex CLI]** Create confusion matrix
* [ ] Compare first vs final version
* [ ] Write short conclusions

---

## ⚙️ 5) Backend (FastAPI)

* [ ] **[Codex CLI]** Create simple FastAPI project structure
* [ ] **[Codex CLI]** Add health endpoint
* [ ] **[Codex CLI]** Add `/predict/waste` endpoint
* [ ] **[Codex CLI]** Add `/predict/freshness` endpoint
* [ ] **[Codex CLI]** Add model loading logic
* [ ] **[Codex CLI]** Add inference preprocessing
* [ ] **[Codex CLI]** Return JSON with:

  * [ ] **[Codex CLI]** predicted label
  * [ ] **[Codex CLI]** confidence
  * [ ] **[Codex CLI]** recommendation
* [ ] **[Codex CLI]** Add simple validation for image upload / captured image input
* [ ] **[Codex CLI]** Add clear error messages

---

## 🎨 6) Frontend (React + Vite + TailwindCSS)

### Basic App Structure

* [ ] **[Codex CLI]** Initialize frontend project
* [ ] **[Codex CLI]** Configure TailwindCSS
* [ ] **[Codex CLI]** Create simple routing
* [ ] **[Codex CLI]** Create shared layout
* [ ] **[Codex CLI]** Create reusable button, card, and result components

### Pages

* [ ] **[Codex CLI]** Create Home page
* [ ] **[Codex CLI]** Create Recycle Scan page
* [ ] **[Codex CLI]** Create Freshness Scan page
* [ ] **[Codex CLI]** Create Results section/page
* [ ] **[Codex CLI]** Create About the project page

### Camera Capture Flow

* [ ] **[Codex CLI]** Add browser camera access
* [ ] **[Codex CLI]** Show camera preview
* [ ] **[Codex CLI]** Add capture button
* [ ] **[Codex CLI]** Convert captured image into request payload
* [ ] **[Codex CLI]** Send captured image to backend
* [ ] **[Codex CLI]** Show loading state
* [ ] **[Codex CLI]** Show result clearly
* [ ] **[Codex CLI]** Show confidence
* [ ] **[Codex CLI]** Show recommendation
* [ ] **[Codex CLI]** Add “try again” button

### UI/UX

* [ ] **[Codex CLI]** Keep UI simple and clean
* [ ] **[Codex CLI]** Make app responsive
* [ ] **[Codex CLI]** Add basic error states
* [ ] **[Codex CLI]** Make texts easy to understand

---

## 🔗 7) Integration

* [ ] **[Codex CLI]** Connect frontend to waste endpoint
* [ ] **[Codex CLI]** Connect frontend to freshness endpoint
* [ ] **[Codex CLI]** Test end-to-end waste flow
* [ ] **[Codex CLI]** Test end-to-end freshness flow
* [ ] **[Codex CLI]** Handle failed API response in UI

---

## ✨ 8) Optional Features

### Database

* [ ] Decide whether to save scan history
* [ ] **[Codex CLI]** If yes: create one simple table for scan history
* [ ] **[Codex CLI]** If yes: connect backend to PostgreSQL

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
* [ ] **[Codex CLI]** Make button styles reusable from one component

### Backend Organization

* [ ] **[Codex CLI]** Separate routes, model loading, preprocessing, and inference logic
* [ ] **[Codex CLI]** Keep request/response schemas in one place
* [ ] **[Codex CLI]** Keep label-to-recommendation mapping in one file
* [ ] **[Codex CLI]** Keep model paths in config file
* [ ] **[Codex CLI]** Avoid mixing training code with API code

### Easy Future Changes

* [ ] **[Codex CLI]** Make it possible to change button color from one central file/component
* [ ] **[Codex CLI]** Make it possible to change result text from one mapping file
* [ ] **[Codex CLI]** Make it possible to change class labels without touching many files
* [ ] **[Codex CLI]** Make it possible to replace a model file without changing endpoint