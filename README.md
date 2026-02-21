# Smart Recycling and Food Waste Prevention System

Final academic project in Computer Vision and Data Science for automated household waste sorting and food freshness detection.

This system uses **custom-built CNN models trained from scratch** (including a ResNet-style variant implemented in-project) and does **not** rely on external vision APIs such as Google Vision or AWS Rekognition.

## Motivation and Environmental Impact

Households generate mixed waste streams where recyclable materials are frequently contaminated and discarded as landfill. In parallel, avoidable food waste is a major emissions source across production, transport, and decomposition stages. This project addresses both issues with one integrated vision platform:

- **Waste classification** to support correct disposal behavior at the point of decision.
- **Food freshness detection** to reduce premature disposal of edible food and improve consumption planning.

The problem is aligned with UNEP-reported global waste and food-loss pressures, where better classification and prevention at the household level can reduce landfill load, methane emissions, and resource loss.

## System Architecture

The platform follows a **Client-Server architecture** designed for practical deployment and iterative model improvement.

### Runtime Flow

1. Client captures an image (waste item or food item) and sends it to the API.
2. FastAPI backend validates request payload and dispatches inference pipeline.
3. OpenCV performs image preprocessing (resize, normalization, augmentation parity checks).
4. PyTorch model executes inference and returns class probabilities.
5. Results and metadata are written to PostgreSQL for analytics and auditing.
6. Raw images and model artifacts are stored in AWS S3 for traceability and retraining.
7. Client receives prediction, confidence score, and action recommendation.

### Core Components

- **Client layer**: mobile/web interface for image capture and user feedback.
- **API layer (FastAPI)**: inference endpoints, model version routing, validation.
- **ML layer (PyTorch + OpenCV)**: preprocessing, inference, evaluation utilities.
- **Data layer (PostgreSQL)**: predictions, feedback labels, model version logs.
- **Object storage (AWS S3)**: uploaded images, checkpoints, exported models, evaluation artifacts.

## Model Design

Two vision tasks are implemented with separate supervised pipelines:

- **Waste model**: multi-class classification for household material categories.
- **Freshness model**: multi-class/ordinal freshness state estimation for produce.

### Architecture Strategy

- Baseline custom CNN with stacked convolutional blocks (`Conv -> BatchNorm -> ReLU -> Pool`).
- ResNet-inspired architecture with residual connections to improve gradient flow and convergence stability.
- Final fully connected head with dropout regularization and softmax outputs.

### Training Approach

- Models are **implemented and trained from scratch** in PyTorch.
- No external inference APIs or pretrained cloud vision services are used.
- Standardized train/validation/test split and fixed random seeds for reproducibility.
- Checkpointing by best validation F1/accuracy with early stopping.

## Datasets Used

- **Garbage Classification V2**: labeled household waste categories for supervised waste sorting.
- **TACO (Trash Annotations in Context)**: real-world litter images for domain diversity and robustness.
- **FruitVision**: food produce imagery used for freshness-stage classification.

Dataset pipelines include class harmonization, imbalance analysis, augmentation policy, and consistent preprocessing across train and inference stages.

## Model Evaluation

Evaluation is performed per task and per class, not only at aggregate level.

### Primary Metrics

- Accuracy
- Precision (macro and weighted)
- Recall (macro and weighted)
- F1-score
- Confusion matrix analysis for error localization

### Evaluation Protocol

- Held-out test set evaluation after hyperparameter selection on validation set.
- Confusion matrix inspection to detect systematic confusion (for example: plastic vs. metal, ripe vs. overripe).
- Class-wise precision/recall used to guide targeted data collection and augmentation.

## Performance Goals

- **Prediction latency**: < 2 seconds end-to-end per request under nominal load.
- **Model accuracy**: > 85% on held-out test data for both primary tasks.
- **Service objective**: stable response quality under concurrent client requests.

## Technology Stack

- **Language**: Python
- **Deep Learning**: PyTorch
- **Image Processing**: OpenCV
- **API Framework**: FastAPI
- **Database**: PostgreSQL
- **Storage**: AWS S3
- **Experimentation**: Jupyter notebooks + scripted training/evaluation workflows
- **Version Control and Reproducibility**: Git, deterministic splits/seeds, artifacted checkpoints

## Project Structure and Layer Responsibilities

The repository is organized by functional responsibility, not only by file type:

- `backend/`: service layer for FastAPI endpoints, request validation, inference orchestration, and integration with PostgreSQL/S3.
- `datasets/raw/`: immutable source datasets before cleaning or relabeling.
- `datasets/processed/`: model-ready tensors/images and split manifests produced by preprocessing pipelines.
- `models/checkpoints/`: intermediate and best-performing training checkpoints used for recovery and comparison.
- `models/exported/`: deployable model artifacts for inference services.
- `experiments/logs/`: run-level training curves, metrics, and experiment diagnostics.
- `notebooks/`: exploratory analysis, error analysis, and controlled prototyping before pipeline hardening.
- `scripts/`: reproducible CLI pipelines for preprocessing, training, evaluation, and export.
- `docs/`: academic documentation, proposal material, methodology notes, and reporting assets.

## Future Work and Continuous Retraining Loop

The project roadmap includes a closed-loop learning lifecycle:

1. Collect new inference samples and optional user-corrected labels.
2. Validate and curate incoming data, then append to training pool.
3. Retrain candidate models on scheduled cycles.
4. Evaluate against the current production baseline using fixed benchmark sets.
5. Promote only models that improve target metrics and do not regress critical classes.
6. Deploy new model version and continue drift monitoring.

Planned extensions:

- Active learning for selecting high-value samples to label.
- Domain adaptation for lighting/background variability in household environments.
- Explainability support (saliency maps/class activation maps) for model transparency.

## License

This project is licensed under the MIT License. See `LICENSE` for details.
