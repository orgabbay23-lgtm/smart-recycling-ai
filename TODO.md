# TODO — Smart Recycling and Food Waste Prevention System

## Principles for This Project
- [x] Keep the project simple and easy to understand
- [x] Prefer clean and readable code over “advanced” architecture
- [x] Build only what is needed for the final demo
- [x] Write code only through Codex CLI

> **Legend**
> - `**[Codex CLI]**` = task should be done through prompts to Codex CLI inside the local repository
> - no label = planning / research / documentation / manual check task

---

## 1) Project Setup
- [x] Create GitHub repository
- [x] Add initial `README.md`
- [x] Define main folders:
  - [x] `frontend/`
  - [x] `backend/`
  - [x] `models/`
  - [x] `datasets/`
  - [x] `docs/`
- [ ] Make sure folder names are final and consistent
- [ ] **[Codex CLI]** Add simple `.gitignore`

---

## 2) Requirements and Scope
- [x] Finalize functional requirements
- [x] Finalize non-functional requirements
- [x] Define the 2 main modes:
  - [x] Recycle Scan
  - [x] Freshness Scan
- [x] Define expected outputs:
  - [x] class label
  - [x] confidence score
  - [x] recommendation text
- [x] Define MVP scope
- [ ] Define exact final demo flow

---

## 3) Dataset Work
### Waste Classification
- [x] Find dataset candidates
- [ ] Choose final classes for MVP
- [ ] Download the selected data
- [ ] Clean bad or irrelevant images
- [ ] Split into `train / validation / test`

### Food Freshness
- [x] Find dataset candidates
- [x] Decide food categories in scope
- [ ] Download the selected data
- [ ] Clean bad or irrelevant images
- [ ] Split into `train / validation / test`

### Preprocessing
- [ ] **[Codex CLI]** Create preprocessing script/module for fixed image resize
- [ ] **[Codex CLI]** Add normalization logic
- [ ] **[Codex CLI]** Add simple augmentation
- [ ] **[Codex CLI]** Save preprocessing decisions in one config/module
- [ ] Document dataset summary

---

## 4) Model Development
### Waste Model
- [ ] Choose one simple baseline model
- [ ] **[Codex CLI]** Create training script for waste model
- [ ] **[Codex CLI]** Train first version
- [ ] **[Codex CLI]** Add validation/evaluation output
- [ ] **[Codex CLI]** Improve model if needed
- [ ] **[Codex CLI]** Save best model

### Freshness Model
- [ ] Choose one simple baseline model
- [ ] **[Codex CLI]** Create training script for freshness model
- [ ] **[Codex CLI]** Train first version
- [ ] **[Codex CLI]** Add validation/evaluation output
- [ ] **[Codex CLI]** Improve model if needed
- [ ] **[Codex CLI]** Save best model

### Evaluation
- [ ] **[Codex CLI]** Measure accuracy
- [ ] **[Codex CLI]** Create confusion matrix
- [ ] Compare first vs final version
- [ ] Write short conclusions

---

## 5) Backend (FastAPI)
- [ ] **[Codex CLI]** Create simple FastAPI project structure
- [ ] **[Codex CLI]** Add health endpoint
- [ ] **[Codex CLI]** Add `/predict/waste` endpoint
- [ ] **[Codex CLI]** Add `/predict/freshness` endpoint
- [ ] **[Codex CLI]** Add model loading logic
- [ ] **[Codex CLI]** Add inference preprocessing
- [ ] **[Codex CLI]** Return JSON with:
  - [ ] predicted label
  - [ ] confidence
  - [ ] recommendation
- [ ] **[Codex CLI]** Add simple validation for image upload
- [ ] **[Codex CLI]** Add clear error messages

---

## 6) Frontend (React + Vite + TailwindCSS)
### Basic App Structure
- [ ] **[Codex CLI]** Initialize frontend project
- [ ] **[Codex CLI]** Configure TailwindCSS
- [ ] **[Codex CLI]** Create simple routing
- [ ] **[Codex CLI]** Create shared layout
- [ ] **[Codex CLI]** Create reusable button, card, and result components

### Pages
- [ ] **[Codex CLI]** Create Home page
- [ ] **[Codex CLI]** Create Recycle Scan page
- [ ] **[Codex CLI]** Create Freshness Scan page
- [ ] **[Codex CLI]** Create Results section/page
- [ ] **[Codex CLI]** Create About the project page

### Upload Flow
- [ ] **[Codex CLI]** Add image upload component
- [ ] **[Codex CLI]** Show image preview
- [ ] **[Codex CLI]** Send image to backend
- [ ] **[Codex CLI]** Show loading state
- [ ] **[Codex CLI]** Show result clearly
- [ ] **[Codex CLI]** Show confidence
- [ ] **[Codex CLI]** Show recommendation
- [ ] **[Codex CLI]** Add “try again” button

### UI/UX
- [ ] **[Codex CLI]** Keep UI simple and clean
- [ ] **[Codex CLI]** Make app responsive
- [ ] **[Codex CLI]** Add basic error states
- [ ] **[Codex CLI]** Make texts easy to understand

---

## 7) Integration
- [ ] **[Codex CLI]** Connect frontend to waste endpoint
- [ ] **[Codex CLI]** Connect frontend to freshness endpoint
- [ ] **[Codex CLI]** Test end-to-end waste flow
- [ ] **[Codex CLI]** Test end-to-end freshness flow
- [ ] **[Codex CLI]** Handle failed API response in UI

---

## 8) Optional Features
### Database
- [ ] Decide whether to save scan history
- [ ] **[Codex CLI]** If yes: create one simple table for scan history
- [ ] **[Codex CLI]** If yes: connect backend to PostgreSQL

### Cloud Storage
- [ ] Decide whether image saving is really needed
- [ ] **[Codex CLI]** If yes: add simple image storage solution

### Feedback Loop
- [ ] **[Codex CLI]** Add “Report Incorrect Result” button only if time allows

---

## 9) Testing
- [ ] Test model prediction on sample images
- [ ] **[Codex CLI]** Add backend endpoint tests
- [ ] **[Codex CLI]** Add frontend upload flow checks/tests
- [ ] Test full app manually with real images
- [ ] Check mobile and desktop view

---

## 10) Code Clarity and Maintainability
### General
- [ ] **[Codex CLI]** Keep files small and focused
- [ ] **[Codex CLI]** Give clear names to files, functions, and variables
- [ ] **[Codex CLI]** Add short comments only where really needed
- [ ] **[Codex CLI]** Avoid duplicate logic
- [ ] **[Codex CLI]** Keep constants in one place

### Frontend Organization
- [ ] **[Codex CLI]** Put shared UI components in one `components/` folder
- [ ] **[Codex CLI]** Put page files in one `pages/` folder
- [ ] **[Codex CLI]** Put API calls in one `services/` folder
- [ ] **[Codex CLI]** Put colors, labels, and UI constants in one `config/` or `constants/` file
- [ ] **[Codex CLI]** Make button styles reusable from one component

### Backend Organization
- [ ] **[Codex CLI]** Separate routes, model loading, preprocessing, and inference logic
- [ ] **[Codex CLI]** Keep request/response schemas in one place
- [ ] **[Codex CLI]** Keep label-to-recommendation mapping in one file
- [ ] **[Codex CLI]** Keep model paths in config file
- [ ] **[Codex CLI]** Avoid mixing training code with API code

### Easy Future Changes
- [ ] **[Codex CLI]** Make it possible to change button color from one central file/component
- [ ] **[Codex CLI]** Make it possible to change result text from one mapping file
- [ ] **[Codex CLI]** Make it possible to change class labels without touching many files
- [ ] **[Codex CLI]** Make it possible to replace a model file without changing endpoint logic

---

## 11) Documentation
- [x] Add project overview
- [x] Add architecture description
- [x] Document selected datasets
- [x] Document limitations
- [ ] **[Codex CLI]** Add local run instructions to `README.md`
- [ ] **[Codex CLI]** Add project structure explanation to `README.md`
- [ ] Add screenshots after UI is ready
- [ ] Add short explanation of how each main folder works

---

## 12) Academic Deliverables
- [x] Prepare abstract
- [x] Prepare introduction and motivation
- [x] Write literature review / related work
- [x] Write methodology
- [x] Write system design
- [x] Prepare references / bibliography
- [ ] Update final results section after experiments
- [ ] Prepare presentation slides
- [ ] Prepare live demo scenario

---

## 13) Final Submission Readiness
- [ ] **[Codex CLI]** Remove unused code/files
- [ ] Final README review
- [ ] Final manual testing
- [ ] Final GitHub cleanup
- [ ] Prepare submission package

---

## Milestones
### Milestone 1 — Planning
- [x] Requirements ready
- [x] Architecture ready
- [x] Dataset candidates selected

### Milestone 2 — Data + Models
- [ ] Final datasets ready
- [ ] Waste model works
- [ ] Freshness model works

### Milestone 3 — App
- [ ] Backend works
- [ ] Frontend works
- [ ] Full prediction flow works

### Milestone 4 — Submission
- [ ] Results documented
- [ ] Slides ready
- [ ] Demo ready