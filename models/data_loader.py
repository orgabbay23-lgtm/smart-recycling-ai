"""
Data loading utilities for model training.
Uses torchvision ImageFolder (expects train/val/test subdirectories
with one folder per class inside each split).
"""

import os

from torch.utils.data import DataLoader
from torchvision import datasets, transforms

from models.config import (
    BATCH_SIZE,
    IMAGE_SIZE,
    NORMALIZATION_MEAN,
    NORMALIZATION_STD,
)


def get_train_transforms():
    """Preprocessing pipeline for training (includes augmentation)."""
    return transforms.Compose([
        transforms.Resize((IMAGE_SIZE, IMAGE_SIZE)),
        transforms.RandomHorizontalFlip(),
        transforms.ToTensor(),
        transforms.Normalize(mean=NORMALIZATION_MEAN, std=NORMALIZATION_STD),
    ])


def get_val_test_transforms():
    """Preprocessing pipeline for validation and testing (no augmentation)."""
    return transforms.Compose([
        transforms.Resize((IMAGE_SIZE, IMAGE_SIZE)),
        transforms.ToTensor(),
        transforms.Normalize(mean=NORMALIZATION_MEAN, std=NORMALIZATION_STD),
    ])


def get_data_loaders(dataset_path):
    """
    Build DataLoaders for train, val, and test splits.

    Args:
        dataset_path: Root folder that contains train/, val/, and test/
                      subdirectories, each organised as ImageFolder.

    Returns:
        dict with keys 'train', 'val', 'test' mapping to DataLoaders.
    """
    split_transforms = {
        "train": get_train_transforms(),
        "val": get_val_test_transforms(),
        "test": get_val_test_transforms(),
    }

    loaders = {}
    for split, tfm in split_transforms.items():
        split_dir = os.path.join(dataset_path, split)
        dataset = datasets.ImageFolder(root=split_dir, transform=tfm)
        loaders[split] = DataLoader(
            dataset,
            batch_size=BATCH_SIZE,
            shuffle=(split == "train"),
            num_workers=0,  # safe default on Windows
        )

    return loaders
