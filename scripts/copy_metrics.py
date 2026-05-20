"""
Copy the latest model evaluation plots into the frontend's public assets.

Purpose:
- Make the confusion matrix and training history plots produced during model
  evaluation/training available to the React frontend so they can be served as
  static images on the About page.

Source folder:
- experiments/logs/

Destination folder:
- frontend/public/metrics/  (created if it does not exist)

Files copied:
- confusion_matrix_*.png
- training_history_*.png
"""

from pathlib import Path
import shutil


REPO_ROOT = Path(__file__).resolve().parents[1]
LOGS_DIR = REPO_ROOT / "experiments" / "logs"
METRICS_DIR = REPO_ROOT / "frontend" / "public" / "metrics"

PLOT_PATTERNS = ["confusion_matrix_*.png", "training_history_*.png"]


def find_plot_files(source_dir):
    """Return the matching plot files, keeping only the newest per filename."""
    latest_by_name = {}

    for pattern in PLOT_PATTERNS:
        for path in source_dir.glob(pattern):
            if not path.is_file():
                continue
            existing = latest_by_name.get(path.name)
            if existing is None or path.stat().st_mtime > existing.stat().st_mtime:
                latest_by_name[path.name] = path

    return [latest_by_name[name] for name in sorted(latest_by_name)]


def copy_metrics():
    if not LOGS_DIR.exists():
        raise ValueError(f"Source folder does not exist: {LOGS_DIR}")

    plot_files = find_plot_files(LOGS_DIR)

    METRICS_DIR.mkdir(parents=True, exist_ok=True)

    copied = []
    for source_path in plot_files:
        destination_path = METRICS_DIR / source_path.name
        shutil.copy2(source_path, destination_path)
        copied.append(source_path.name)

    return copied


def main():
    copied = copy_metrics()

    print("Copy Metrics Summary")
    print("-" * len("Copy Metrics Summary"))
    print(f"Source: {LOGS_DIR}")
    print(f"Destination: {METRICS_DIR}")

    if not copied:
        print("No matching plot files found.")
        print(
            "Run 'python -m models.evaluate_models' (confusion matrices) and the "
            "training scripts (training history) to generate them first."
        )
        return

    print(f"Copied {len(copied)} file(s):")
    for name in copied:
        print(f"  {name}")


if __name__ == "__main__":
    main()
