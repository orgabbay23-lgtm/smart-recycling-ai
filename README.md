# ♻️ Smart Recycling & Food Waste Prevention System

An AI-powered application that uses Computer Vision and Deep Learning to help users sort waste correctly and reduce food waste at home.

> **Project Status:** 📋 Planning & Design — architecture and models are defined, implementation has not started yet.

---

## 📌 About the Project

Household waste sorting is confusing — many recyclable materials end up in the wrong bin. At the same time, large amounts of food are thrown away simply because people can't tell if produce is still edible.

This project aims to solve both problems with a single **web application** (accessible from any device with a browser — no app store needed) powered by custom-trained Convolutional Neural Networks (CNNs):

1. **Waste Classification** — identify the material (plastic, glass, paper, etc.) and direct the user to the correct recycling bin.
2. **Freshness Detection** — classify fruits and vegetables as Fresh, Half-Fresh, or Rotten, and suggest what to do with them (eat now, cook immediately, or compost).

### What Makes This Project Different

- **Built from scratch** — we train our own Deep Learning models using PyTorch rather than relying on commercial APIs (Google Lens, AWS Rekognition, etc.).
- **Dual functionality** — combines recycling guidance with proactive food freshness detection in one app.
- **Consumer-focused** — designed for everyday home use, not industrial conveyor belts.

---

## 🏗️ Planned Architecture

The system follows a **Client-Server** design:

| Layer | Role | Planned Technology |
|-------|------|--------------------|
| **Web App** (Client) | Camera capture, UI, result display | React (Vite) + TailwindCSS |
| **API Gateway** | Auth, validation, routing | FastAPI (Python) |
| **Inference Service** | Image preprocessing + CNN prediction | PyTorch, OpenCV |
| **Database** | User data, scan history | PostgreSQL |
| **Image Storage** | Training dataset repository | AWS S3 |

### Inference Flow (Planned)

```
User scans item → App sends image → API validates →
Inference Service preprocesses (OpenCV) → CNN predicts class + confidence →
Result returned → App displays recommendation
```

---

## 🧠 Planned Model Details

| Component | Architecture | Purpose |
|-----------|-------------|---------|
| Waste Classifier | ResNet / MobileNet (CNN) | Classify materials: plastic, glass, paper, metal, etc. |
| Freshness Detector | ResNet / MobileNet (CNN) | Classify produce: Fresh, Half-Fresh, Rotten |

### Training Datasets

- [Garbage Classification V2](https://www.kaggle.com/datasets/sumn2u/garbage-classification-v2) — 19,762 images across 10 waste classes
- [TACO Dataset](http://tacodataset.org/) — litter detection in real-world conditions
- [Mendeley FruitVision](https://data.mendeley.com/datasets/xkbjx8959c/2) — fresh vs. rotten fruit images (apples, bananas, mangoes, oranges, grapes)

---

## 🎯 Performance Targets

These are **goals**, not yet achieved results:

| Metric | Target |
|--------|--------|
| Inference latency | < 2 seconds |
| Freshness detection accuracy | ≥ 85% |
| Backend concurrency | 100+ simultaneous requests |
| System uptime | 99% |

---

## 📁 Repository Structure

```
smart-recycling-ai/
├── backend/                  # Server-side code (planned)
├── frontend/                 # React web app (planned)
├── datasets/
│   ├── raw/                  # Original dataset files
│   └── processed/            # Preprocessed training data
├── docs/                     # Project proposal and documentation
├── experiments/
│   └── logs/                 # Training logs and experiment tracking
├── models/
│   ├── checkpoints/          # Model checkpoints during training
│   └── exported/             # Final exported models for inference
├── notebooks/                # Jupyter notebooks for exploration
├── scripts/                  # Utility and automation scripts
├── .gitignore
├── LICENSE
├── README.md
└── TODO.md
```

---

## 🛠️ Tech Stack (Planned)

**AI / ML:** Python, PyTorch, OpenCV  
**Backend:** FastAPI, PostgreSQL  
**Frontend:** React (Vite), TailwindCSS — responsive web app, works on any device via browser  
**Infrastructure:** Docker, AWS (EC2, S3)  
**Testing:** PyTest, Confusion Matrix evaluation, UAT in real conditions

---

## 👥 Team

| Name | Role |
|------|------|
| Or Gabbay | Co-developer — model training, backend |
| Daniel Yerichman | Co-developer — model training, backend |

---

## 📄 Documentation

The full project proposal, literature review, requirements specification, and detailed design document are available in the [`docs/`](docs/) folder.

---

## 📜 License

This project is licensed under the terms specified in the [LICENSE](LICENSE) file.
