# 📋 TODO — Smart Recycling & Food Waste Prevention System

> Last updated: March 2026  
> Workflow: All implementation is done via **Codex CLI** from inside the local repository.

---

## ✅ Phase 0 — Project Setup & Planning (DONE)

- [x] Create GitHub repository with project structure
- [x] Add .gitignore and .gitkeep placeholders
- [x] Upload project proposal to `docs/`
- [x] Write and refine README.md to match current project state
- [x] Submit repository link via Moodle
- [x] Install and verify Codex CLI locally

---

## 🔲 Phase 1 — Data Preparation

- [ ] Download Garbage Classification V2 dataset → `datasets/raw/`
- [ ] Download TACO dataset → `datasets/raw/`
- [ ] Download Mendeley FruitVision dataset → `datasets/raw/`
- [ ] Write preprocessing script: resize, normalize, noise reduction (OpenCV)
- [ ] Split datasets into train / validation / test sets
- [ ] Save processed data to `datasets/processed/`
- [ ] Document dataset statistics in a notebook (`notebooks/`)

---

## 🔲 Phase 2 — Model Development (Waste Classifier)

- [ ] Implement base CNN architecture (ResNet/MobileNet) in PyTorch
- [ ] Create training loop with loss function and optimizer
- [ ] Train waste classification model on Garbage Classification V2
- [ ] Evaluate model: confusion matrix, precision, recall
- [ ] Fine-tune with TACO dataset for real-world robustness
- [ ] Save best checkpoint → `models/checkpoints/`
- [ ] Log experiment results → `experiments/logs/`

---

## 🔲 Phase 3 — Model Development (Freshness Detector)

- [ ] Adapt CNN architecture for freshness detection (Fresh / Half-Fresh / Rotten)
- [ ] Train freshness model on Mendeley FruitVision dataset
- [ ] Evaluate model: target ≥ 85% accuracy on Fresh vs. Rotten
- [ ] Experiment with multi-task learning (identify fruit type + freshness)
- [ ] Save best checkpoint → `models/checkpoints/`
- [ ] Log experiment results → `experiments/logs/`

---

## 🔲 Phase 4 — Backend Development

- [ ] Set up FastAPI project structure in `backend/`
- [ ] Implement image upload endpoint (POST)
- [ ] Implement inference service: load model, preprocess, predict
- [ ] Add routing logic: waste mode vs. freshness mode
- [ ] Connect PostgreSQL for user data and scan history
- [ ] Add authentication (JWT / OAuth2)
- [ ] Write unit tests with PyTest

---

## 🔲 Phase 5 — Frontend (Web App)

- [ ] Initialize React project with Vite + TailwindCSS in `frontend/`
- [ ] Build camera capture page (using browser MediaDevices API)
- [ ] Build result display page (bin color / freshness label + confidence)
- [ ] Implement scan history view
- [ ] Ensure responsive design (works on mobile browsers + desktop)
- [ ] Connect frontend to backend API

---

## 🔲 Phase 6 — Integration & Testing

- [ ] Dockerize backend for consistent deployment
- [ ] End-to-end test: image capture → API → model → result
- [ ] Test under various lighting conditions (UAT)
- [ ] Performance test: verify < 2 second latency
- [ ] Concurrency test: 100+ simultaneous requests

---

## 🔲 Phase 7 — Export & Documentation

- [ ] Export final models → `models/exported/`
- [ ] Update README.md to reflect completed implementation
- [ ] Write final project report
- [ ] Prepare demo video / presentation
- [ ] Final commit and tag release version

---

## 💡 Future Enhancements (Post-Submission)

- [ ] "Report Incorrect Result" button for user feedback
- [ ] Retraining pipeline using user-submitted images from S3
- [ ] Add more produce types to freshness model
- [ ] Multilingual support (Hebrew / English)
