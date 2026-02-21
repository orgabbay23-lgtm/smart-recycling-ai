# Smart Recycling and Food Waste Prevention System

Final academic project proposal in Computer Vision and Data Science, focused on reducing household waste contamination and preventable food disposal.

## Current Status

This repository is currently in the **planning and design stage**.  
It contains project specification, scope definition, and repository scaffolding.  
**Implementation is in progress and has not yet been completed.**

## Motivation and Environmental Context

Household-level waste handling remains a major challenge: recyclable items are often discarded incorrectly, and edible food is frequently thrown away due to uncertainty about freshness. These behaviors increase landfill pressure and environmental impact.

This project is motivated by global sustainability concerns, including UNEP-reported trends in municipal waste generation and food waste. The objective is to design a practical AI-assisted decision tool that can support better disposal and consumption choices at home.

## Project Goals

- Design a unified Computer Vision framework for:
  - Waste material classification.
  - Food freshness detection.
- Build a reproducible ML pipeline suitable for academic evaluation.
- Define measurable performance goals for future implementation:
  - **Target accuracy**: >= 85% (per task, on held-out test data).
  - **Target latency**: < 2 seconds end-to-end inference per request.

These are intended targets, not current results.

## Planned System Architecture

The planned implementation follows a Client-Server architecture:

1. Client application captures and uploads an image.
2. Backend API (FastAPI) validates input and triggers inference.
3. Image preprocessing is handled with OpenCV.
4. Model inference is performed using PyTorch.
5. Prediction metadata is stored in PostgreSQL.
6. Image assets and model artifacts are stored in AWS S3.

Planned stack components:

- **API**: FastAPI
- **ML framework**: PyTorch
- **Image processing**: OpenCV
- **Database**: PostgreSQL
- **Object storage**: AWS S3

## Planned Model Design

The modeling approach is planned as two supervised classification pipelines:

- Waste category classifier.
- Food freshness classifier.

Planned architectural direction:

- Custom CNN baseline (`Conv -> BatchNorm -> ReLU -> Pool` blocks).
- ResNet-inspired variant with residual connections.
- Models to be trained from scratch within this project scope (no external vision APIs).

Planned evaluation metrics:

- Accuracy
- Precision
- Recall
- F1-score
- Confusion matrix analysis

## Planned Datasets

The project intends to use the following datasets:

- **Garbage Classification V2**
- **TACO (Trash Annotations in Context)**
- **FruitVision**

Final class mapping, preprocessing policy, and split strategy will be documented during implementation.

## Repository Structure

Folders are currently prepared as project scaffolding for upcoming development outputs:

- `backend/`: planned API service layer and inference orchestration code.
- `datasets/raw/`: planned storage for original source datasets.
- `datasets/processed/`: planned outputs of preprocessing and dataset preparation.
- `models/checkpoints/`: future training checkpoint outputs.
- `models/exported/`: future deployable model artifacts.
- `experiments/logs/`: planned experiment tracking and metric logs.
- `notebooks/`: exploratory analysis and research notebooks.
- `scripts/`: planned automation scripts for training/evaluation workflows.
- `docs/`: academic documentation and proposal materials.

## Development Roadmap

1. Finalize requirements, class taxonomy, and evaluation protocol.
2. Implement data ingestion and preprocessing pipeline.
3. Implement baseline CNN and ResNet-inspired models.
4. Run controlled experiments and compare model variants.
5. Integrate selected model into FastAPI backend.
6. Validate performance against project targets and document findings.

## Academic Scope

This repository supports a university-level final project with emphasis on:

- End-to-end system design for an applied Computer Vision problem.
- Methodological rigor in dataset handling, model development, and evaluation.
- Reproducibility, clear documentation, and evidence-based analysis of results.

At this stage, the repository should be interpreted as a proposal and development plan rather than a completed implementation.

## Getting Started

```bash
git clone https://github.com/orgabbay23-lgtm/smart-recycling-ai.git
cd smart-recycling-ai
```

## License

This project is licensed under the MIT License. See `LICENSE` for details.
