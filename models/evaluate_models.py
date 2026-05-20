"""
Evaluation script for waste and freshness models.
Runs inference on the test set and prints classification report + confusion matrix.
"""

import torch
import torch.nn as nn
from torchvision import models
from sklearn.metrics import classification_report, confusion_matrix

import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import seaborn as sns

from models.config import WASTE_DATASET_PATH, FRESHNESS_DATASET_PATH
from models.data_loader import get_data_loaders

import os

CHECKPOINT_DIR = os.path.join(os.path.dirname(__file__), "checkpoints")
LOGS_DIR = os.path.join(os.path.dirname(__file__), "..", "experiments", "logs")


def evaluate_model(model_name, num_classes, dataset_path, checkpoint_path, slug):
    """Evaluate a trained model on the test split."""
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

    # Build model and load checkpoint
    model = models.resnet18(weights=None)
    model.fc = nn.Linear(model.fc.in_features, num_classes)
    model.load_state_dict(torch.load(checkpoint_path, map_location=device, weights_only=True))
    model.to(device)
    model.eval()

    # Get test loader
    loaders = get_data_loaders(dataset_path)
    test_loader = loaders["test"]
    class_names = test_loader.dataset.classes

    all_labels = []
    all_preds = []

    with torch.no_grad():
        for images, labels in test_loader:
            images = images.to(device)
            outputs = model(images)
            _, preds = torch.max(outputs, 1)
            all_labels.extend(labels.cpu().tolist())
            all_preds.extend(preds.cpu().tolist())

    report = classification_report(all_labels, all_preds, target_names=class_names)
    cm = confusion_matrix(all_labels, all_preds)

    print(f"\n{'='*60}")
    print(f"  {model_name} — Test Set Evaluation")
    print(f"{'='*60}\n")
    print(report)
    print("Confusion Matrix:")
    print(cm)
    print()

    os.makedirs(LOGS_DIR, exist_ok=True)

    # Save classification report to a text file
    report_path = os.path.join(LOGS_DIR, f"report_{slug}.txt")
    with open(report_path, "w") as f:
        f.write(f"{model_name} — Test Set Evaluation\n\n")
        f.write(report)
    print(f"Saved classification report to {report_path}")

    # Plot and save the confusion matrix as a heatmap
    plt.figure(figsize=(8, 6))
    sns.heatmap(
        cm,
        annot=True,
        fmt="d",
        cmap="Blues",
        xticklabels=class_names,
        yticklabels=class_names,
    )
    plt.xlabel("Predicted Label")
    plt.ylabel("True Label")
    plt.title(f"{model_name} — Confusion Matrix")
    plt.tight_layout()
    cm_path = os.path.join(LOGS_DIR, f"confusion_matrix_{slug}.png")
    plt.savefig(cm_path)
    plt.close()
    print(f"Saved confusion matrix plot to {cm_path}\n")


if __name__ == "__main__":
    evaluate_model(
        model_name="Waste Classification Model",
        num_classes=4,
        dataset_path=WASTE_DATASET_PATH,
        checkpoint_path=os.path.join(CHECKPOINT_DIR, "best_waste_model.pth"),
        slug="waste",
    )
    evaluate_model(
        model_name="Freshness Classification Model",
        num_classes=2,
        dataset_path=FRESHNESS_DATASET_PATH,
        checkpoint_path=os.path.join(CHECKPOINT_DIR, "best_freshness_model.pth"),
        slug="freshness",
    )
