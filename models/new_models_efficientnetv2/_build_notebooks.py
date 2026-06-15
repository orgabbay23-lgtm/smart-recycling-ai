"""
Generator for the two corrected Kaggle training notebooks
(waste + freshness, EfficientNetV2-S).

Run once locally:  python _build_notebooks.py
It writes:
  waste/waste-model_notebook.ipynb
  freshness/freshness-model__notebook.ipynb

The notebooks are designed to be copied as-is into a Kaggle notebook
(GPU T4 x1, Internet ON). They auto-discover the real class folders,
merge any train/test split, and FAIL LOUDLY if the data looks
degenerate -- which is exactly the bug that produced the previous
constant-output models.
"""

import json
import os

# --------------------------------------------------------------------------
# Shared cell sources (Python). {placeholders} are filled per task.
# --------------------------------------------------------------------------

INTRO_MD = """\
# {title}

EfficientNetV2-S transfer-learning trainer (Kaggle, **GPU T4 x1**).

**How to run on Kaggle**
1. *Add Input* -> attach the dataset: `{dataset}`.
2. Settings: **Accelerator = GPU T4 x1**, **Internet = On**
   (Internet is needed once to download the ImageNet pretrained weights).
3. Run all cells top to bottom.

**What was fixed vs. the previous version**
The old notebook did `num_classes = len(ImageFolder(DATA_DIR).classes)` with a
`DATA_DIR` that pointed at the wrong level of the dataset tree. For waste it
picked up `['TEST','TRAIN']` as the two "classes" (an impossible task -> the
model collapsed to a constant ~50% output); for freshness it found a single
folder (no learning signal at all). This version **auto-discovers the true
class folders**, merges any train/test split, prints the per-class image
counts, and runs hard sanity checks that stop training if the setup is wrong.

The final cell evaluates the model, prints a classification report, saves a
confusion-matrix PNG, and **warns loudly if accuracy is near chance level**.
The saved `.pth` is self-describing (it stores the class list, architecture,
image size and normalization) so it drops straight into the app.
"""

CONFIG_SRC = """\
# ============================ 1. Config & imports ============================
import os, time, copy, random, json
from collections import defaultdict, Counter

import numpy as np
import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import Dataset, DataLoader
from torchvision import models, transforms
from torchvision.models import EfficientNet_V2_S_Weights
from PIL import Image, ImageFile
ImageFile.LOAD_TRUNCATED_IMAGES = True  # tolerate a few slightly-corrupt JPEGs

# ---- Task-specific config -------------------------------------------------
TASK             = "{task}"
DEFAULT_DATA_DIR = "{dataset_dir}"   # Kaggle mount path (auto-falls back if missing)
MODEL_SAVE_PATH  = "{save_path}"

# If True, per-item folders such as 'freshapple' / 'rottenbanana' are collapsed
# into a clean binary problem: ['fresh', 'rotten']. Leave False for waste.
COLLAPSE_FRESH_ROTTEN = {collapse}
# Optional rename of raw folder names -> readable labels (applied only if key exists).
CLASS_RENAME = {rename}

# ---- Hyperparameters ------------------------------------------------------
BATCH_SIZE    = 32        # safe for EfficientNetV2-S @384 on a 16GB T4; raise to 48/64 if no OOM
EPOCHS        = 50
LEARNING_RATE = 1e-4
WEIGHT_DECAY  = 1e-4
PATIENCE      = 7         # early stopping on val loss
MAX_TIME_SEC  = 11 * 60 * 60
VAL_SPLIT     = 0.2
IMG_SIZE      = 384       # EfficientNetV2-S default eval size (set 224 for ~3x faster train+infer)
SEED          = 42

random.seed(SEED); np.random.seed(SEED); torch.manual_seed(SEED)
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
torch.backends.cudnn.benchmark = True
print("Device:", device,
      "| GPU:", torch.cuda.get_device_name(0) if torch.cuda.is_available() else "CPU only")
"""

DISCOVER_SRC = """\
# ===================== 2. Discover classes + sanity checks ==================
# This is the core fix. We walk the dataset tree and treat the *immediate
# parent folder* of each image as its class. That automatically:
#   - merges TRAIN/ and TEST/ splits (TRAIN/O and TEST/O both map to class 'O')
#   - ignores split/wrapper folders so they never become fake "classes"
IMG_EXTS    = {".jpg", ".jpeg", ".png", ".bmp", ".webp", ".gif", ".tif", ".tiff"}
SPLIT_NAMES = {"train", "test", "val", "valid", "validation",
               "training", "testing", "dataset", "data", "images", "img"}

def resolve_data_dir(preferred, base="/kaggle/input"):
    if os.path.isdir(preferred):
        return preferred
    if os.path.isdir(base):
        subs = sorted(os.path.join(base, d) for d in os.listdir(base)
                      if os.path.isdir(os.path.join(base, d)))
        print("[warn] preferred path not found:", preferred)
        print("[info] datasets mounted under /kaggle/input:", [os.path.basename(s) for s in subs])
        if len(subs) == 1:
            print("[info] using the only mounted dataset:", subs[0]); return subs[0]
        if subs:
            print("[info] defaulting to first mounted dataset:", subs[0]); return subs[0]
    return preferred

DATA_DIR = resolve_data_dir(DEFAULT_DATA_DIR)
print("Using DATA_DIR:", DATA_DIR)

def discover_samples(base_dir):
    samples = []
    for root, dirs, files in os.walk(base_dir):
        dirs[:] = [d for d in dirs if not d.startswith(".") and not d.startswith("__")]
        imgs = [f for f in files if os.path.splitext(f)[1].lower() in IMG_EXTS]
        if not imgs:
            continue
        cls = os.path.basename(root)
        if cls.lower() in SPLIT_NAMES:   # images directly inside a split/wrapper -> not a class
            continue
        for f in imgs:
            samples.append((os.path.join(root, f), cls))
    return samples

raw_samples = discover_samples(DATA_DIR)
assert raw_samples, (f"No images found under {DATA_DIR}. "
                     "Check the dataset is attached and the path is correct.")

def map_class(name):
    if COLLAPSE_FRESH_ROTTEN:
        low = name.lower()
        if "fresh" in low:
            return "fresh"
        if any(t in low for t in ("rotten", "stale", "spoiled", "rotted", "bad")):
            return "rotten"
    return CLASS_RENAME.get(name, name)

samples     = [(p, map_class(c)) for (p, c) in raw_samples]
counts      = Counter(c for _, c in samples)
class_names = sorted(counts.keys())
class_to_idx = {c: i for i, c in enumerate(class_names)}
num_classes = len(class_names)

print("\\n=== Raw folder names discovered ===")
for c, n in sorted(Counter(c for _, c in raw_samples).items()):
    print(f"  {c:24s} {n}")
print("\\n=== Final classes used for training ===")
print("Total images:", len(samples), "| Num classes:", num_classes)
for c in class_names:
    print(f"  [{class_to_idx[c]}] {c:24s} {counts[c]} images")

# ---- Hard sanity checks: stop instead of training a broken model ----------
assert num_classes >= 2, (
    f"Only {num_classes} class found ({class_names}). Training needs >=2 classes. "
    "DATA_DIR is pointing one level too shallow/deep -- inspect the tree above.")
bad_split = [c for c in class_names if c.lower() in SPLIT_NAMES]
assert not bad_split, (
    f"Class names look like split folders {bad_split} -> DATA_DIR points at the "
    "split level, not the class level.")
assert min(counts.values()) >= 10, f"A class has too few images: {dict(counts)}"
print("\\n[OK] Sanity checks passed.")
"""

DATA_SRC = """\
# ===================== 3. Transforms, split, dataloaders ====================
MEAN = [0.485, 0.456, 0.406]
STD  = [0.229, 0.224, 0.225]

train_tf = transforms.Compose([
    transforms.RandomResizedCrop(IMG_SIZE, scale=(0.65, 1.0)),
    transforms.RandomHorizontalFlip(),
    transforms.ColorJitter(0.2, 0.2, 0.2),
    transforms.ToTensor(),
    transforms.Normalize(MEAN, STD),
])
eval_tf = transforms.Compose([
    transforms.Resize(IMG_SIZE),
    transforms.CenterCrop(IMG_SIZE),
    transforms.ToTensor(),
    transforms.Normalize(MEAN, STD),
])

# Stratified per-class split so every class appears in both train and val.
by_class = defaultdict(list)
for s in samples:
    by_class[s[1]].append(s)
train_samples, val_samples = [], []
for c, items in by_class.items():
    random.shuffle(items)
    n_val = max(1, int(len(items) * VAL_SPLIT))
    val_samples  += items[:n_val]
    train_samples += items[n_val:]
random.shuffle(train_samples)
print(f"Train: {len(train_samples)}  Val: {len(val_samples)}")

class FolderDataset(Dataset):
    def __init__(self, items, transform):
        self.items = items
        self.transform = transform
    def __len__(self):
        return len(self.items)
    def __getitem__(self, i):
        path, cls = self.items[i]
        try:
            img = Image.open(path).convert("RGB")
        except Exception:
            return self.__getitem__((i + 1) % len(self.items))  # skip unreadable file
        return self.transform(img), class_to_idx[cls]

train_loader = DataLoader(FolderDataset(train_samples, train_tf),
                          batch_size=BATCH_SIZE, shuffle=True,
                          num_workers=2, pin_memory=True)
val_loader   = DataLoader(FolderDataset(val_samples, eval_tf),
                          batch_size=BATCH_SIZE, shuffle=False,
                          num_workers=2, pin_memory=True)
"""

MODEL_SRC = """\
# ===================== 4. Model + mixed precision (AMP) =====================
weights = EfficientNet_V2_S_Weights.DEFAULT   # needs Internet ON the first time
model = models.efficientnet_v2_s(weights=weights)
model.classifier[1] = nn.Linear(model.classifier[1].in_features, num_classes)
model = model.to(device)

# Quick shape check before we spend hours training.
model.eval()
with torch.no_grad():
    out = model(torch.zeros(2, 3, IMG_SIZE, IMG_SIZE, device=device))
assert out.shape == (2, num_classes), f"Unexpected output shape {tuple(out.shape)}"
print("Model output shape OK:", tuple(out.shape))

criterion = nn.CrossEntropyLoss()
optimizer = optim.AdamW(model.parameters(), lr=LEARNING_RATE, weight_decay=WEIGHT_DECAY)

# Modern torch.amp API (great on T4), with a fallback for older torch builds.
try:
    from torch.amp import autocast, GradScaler
    scaler = GradScaler("cuda")
    def amp_ctx():
        return autocast("cuda")
except Exception:
    from torch.cuda.amp import autocast, GradScaler
    scaler = GradScaler()
    def amp_ctx():
        return autocast()
"""

TRAIN_SRC = """\
# ============================ 5. Training loop =============================
best_val_loss = float("inf")
best_val_acc  = 0.0
best_model_wts = copy.deepcopy(model.state_dict())
epochs_no_improve = 0
start_time = time.time()

for epoch in range(EPOCHS):
    t0 = time.time()
    print(f"\\nEpoch {epoch + 1}/{EPOCHS}\\n----------")

    model.train()
    run_loss = run_correct = n = 0
    for inputs, labels in train_loader:
        inputs = inputs.to(device, non_blocking=True)
        labels = labels.to(device, non_blocking=True)
        optimizer.zero_grad(set_to_none=True)
        with amp_ctx():
            outputs = model(inputs)
            loss = criterion(outputs, labels)
        scaler.scale(loss).backward()
        scaler.step(optimizer)
        scaler.update()
        run_loss    += loss.item() * inputs.size(0)
        run_correct += (outputs.argmax(1) == labels).sum().item()
        n           += inputs.size(0)
    tr_loss, tr_acc = run_loss / n, run_correct / n
    print(f"train  - loss {tr_loss:.4f}  acc {tr_acc:.4f}")

    model.eval()
    v_loss = v_correct = vn = 0
    with torch.no_grad():
        for inputs, labels in val_loader:
            inputs, labels = inputs.to(device), labels.to(device)
            outputs = model(inputs)
            loss = criterion(outputs, labels)
            v_loss    += loss.item() * inputs.size(0)
            v_correct += (outputs.argmax(1) == labels).sum().item()
            vn        += inputs.size(0)
    val_loss, val_acc = v_loss / vn, v_correct / vn
    print(f"val    - loss {val_loss:.4f}  acc {val_acc:.4f}")

    if val_loss < best_val_loss:
        best_val_loss, best_val_acc = val_loss, val_acc
        best_model_wts = copy.deepcopy(model.state_dict())
        epochs_no_improve = 0
        torch.save({
            "model_state_dict": best_model_wts,
            "classes": class_names,
            "arch": "efficientnet_v2_s",
            "img_size": IMG_SIZE,
            "normalization": {"mean": MEAN, "std": STD},
            "val_accuracy": best_val_acc,
            "val_loss": best_val_loss,
            "task": TASK,
        }, MODEL_SAVE_PATH)
        print(f">>> improved - checkpoint saved (val_acc {val_acc:.4f})")
    else:
        epochs_no_improve += 1
        print(f"no improvement {epochs_no_improve}/{PATIENCE}")
        if epochs_no_improve >= PATIENCE:
            print("\\n[!] Early stopping."); break

    if time.time() - start_time >= MAX_TIME_SEC:
        print("\\n[!] Reached 11h time budget; stopping."); break
    print(f"epoch time: {time.time() - t0:.0f}s")

print("\\n==============================")
print(f"Best val loss {best_val_loss:.4f} | best val acc {best_val_acc:.4f}")
print(f"Saved to {MODEL_SAVE_PATH}")
"""

EVAL_SRC = """\
# ================= 6. Evaluate: report + confusion matrix ==================
from sklearn.metrics import classification_report, confusion_matrix
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import seaborn as sns

model.load_state_dict(best_model_wts)
model.eval()
all_labels, all_preds = [], []
with torch.no_grad():
    for inputs, labels in val_loader:
        preds = model(inputs.to(device)).argmax(1).cpu().tolist()
        all_preds  += preds
        all_labels += labels.tolist()

print("\\n=== Classification report (validation) ===")
report = classification_report(all_labels, all_preds, target_names=class_names, digits=4)
print(report)
cm = confusion_matrix(all_labels, all_preds)
print("Confusion matrix:\\n", cm)

acc = float(np.mean(np.array(all_labels) == np.array(all_preds)))
chance = 1.0 / num_classes
print(f"\\nValidation accuracy: {acc:.4f}  (chance level ~{chance:.4f})")
if acc < chance * 1.25:
    print("\\n[!!!] WARNING: accuracy is near chance -- the model likely did NOT learn.\\n"
          "      Re-check the dataset path / class folders in cell 2 before using this model.")
else:
    print("[OK] Accuracy is clearly above chance -- the model learned to discriminate.")

with open(f"classification_report_{TASK}.txt", "w") as f:
    f.write(report)
plt.figure(figsize=(7, 6))
sns.heatmap(cm, annot=True, fmt="d", cmap="Blues",
            xticklabels=class_names, yticklabels=class_names)
plt.xlabel("Predicted"); plt.ylabel("True")
plt.title(f"{TASK.capitalize()} - Confusion Matrix (validation)")
plt.tight_layout()
plt.savefig(f"confusion_matrix_{TASK}.png", dpi=130)
plt.close()
print(f"\\nSaved confusion_matrix_{TASK}.png and classification_report_{TASK}.txt")
print("Classes (index order):", list(enumerate(class_names)))
print("\\nDownload from the Kaggle 'Output' tab:")
print(f"  - {MODEL_SAVE_PATH}")
print(f"  - confusion_matrix_{TASK}.png")
print(f"  - classification_report_{TASK}.txt")
"""


def _src(text):
    """nbformat wants source as a list of lines, each keeping its newline."""
    lines = text.splitlines(keepends=True)
    return lines


def code_cell(text, cid):
    return {
        "cell_type": "code",
        "execution_count": None,
        "id": cid,
        "metadata": {},
        "outputs": [],
        "source": _src(text),
    }


def md_cell(text, cid):
    return {"cell_type": "markdown", "id": cid, "metadata": {}, "source": _src(text)}


def build_notebook(task, title, dataset, dataset_dir, save_path, collapse, rename):
    fmt = dict(task=task, title=title, dataset=dataset, dataset_dir=dataset_dir,
               save_path=save_path, collapse=collapse, rename=rename)
    cells = [
        md_cell(INTRO_MD.format(**fmt), f"{task}-intro"),
        code_cell(CONFIG_SRC.format(**fmt), f"{task}-config"),
        code_cell(DISCOVER_SRC, f"{task}-discover"),
        code_cell(DATA_SRC, f"{task}-data"),
        code_cell(MODEL_SRC, f"{task}-model"),
        code_cell(TRAIN_SRC, f"{task}-train"),
        code_cell(EVAL_SRC, f"{task}-eval"),
    ]
    return {
        "cells": cells,
        "metadata": {
            "kernelspec": {"display_name": "Python 3", "language": "python", "name": "python3"},
            "language_info": {"name": "python"},
            "accelerator": "GPU",
        },
        "nbformat": 4,
        "nbformat_minor": 5,
    }


def main():
    here = os.path.dirname(os.path.abspath(__file__))

    waste = build_notebook(
        task="waste",
        title="Waste Classification - EfficientNetV2-S",
        dataset="sumn2u/garbage-classification-v2",
        dataset_dir="/kaggle/input/garbage-classification-v2",
        save_path="efficientnetv2_waste_best.pth",
        collapse=False,
        # Multi-class garbage dataset: class names come straight from the folders
        # (battery, biological, cardboard, clothes, glass, metal, paper, plastic, shoes, trash...).
        # No rename needed. To use the 12-class set instead, attach
        # mostafaabla/garbage-classification and point DEFAULT_DATA_DIR at it.
        rename={},
    )
    fresh = build_notebook(
        task="freshness",
        title="Food Freshness - EfficientNetV2-S",
        dataset="ulnnproject/food-freshness-dataset",
        dataset_dir="/kaggle/input/food-freshness-dataset",
        save_path="efficientnetv2_freshness_best.pth",
        collapse=True,
        rename={},
    )

    with open(os.path.join(here, "waste", "waste-model_notebook.ipynb"), "w", encoding="utf-8") as f:
        json.dump(waste, f, indent=1, ensure_ascii=False)
    with open(os.path.join(here, "freshness", "freshness-model__notebook.ipynb"), "w", encoding="utf-8") as f:
        json.dump(fresh, f, indent=1, ensure_ascii=False)

    print("Wrote waste/waste-model_notebook.ipynb")
    print("Wrote freshness/freshness-model__notebook.ipynb")


if __name__ == "__main__":
    main()
