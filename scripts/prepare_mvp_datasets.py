"""
Prepare balanced processed datasets for the MVP.

Purpose:
- Create balanced train/val/test datasets for waste classification and food
  freshness classification without modifying the raw datasets.
- Use the largest balanced subset possible based on the smallest relevant class.

Input folders:
- datasets/waste/raw/garbage_classification_v2/
- datasets/freshness/raw/fruitvision/

Output folders:
- datasets/waste/processed/
- datasets/freshness/processed/

Split ratio:
- 70% train
- 15% val
- 15% test
"""

from pathlib import Path
import random
import shutil


RANDOM_SEED = 42
SPLITS = {"train": 0.70, "val": 0.15, "test": 0.15}
IMAGE_EXTENSIONS = {".jpg", ".jpeg", ".png", ".bmp", ".webp"}

WASTE_VARIANT = "standardized_256"
WASTE_CLASSES = ["plastic", "glass", "paper", "metal"]

FRESHNESS_FRUITS = ["Apple", "Banana"]
FRESHNESS_LABELS = ["Fresh", "Rotten"]
FRESHNESS_CLASS_MAP = {"Fresh": "fresh", "Rotten": "rotten"}

REPO_ROOT = Path(__file__).resolve().parents[1]
WASTE_RAW_ROOT = REPO_ROOT / "datasets" / "waste" / "raw" / "garbage_classification_v2"
WASTE_OUTPUT_ROOT = REPO_ROOT / "datasets" / "waste" / "processed"
FRESHNESS_RAW_ROOT = REPO_ROOT / "datasets" / "freshness" / "raw" / "fruitvision"
FRESHNESS_OUTPUT_ROOT = REPO_ROOT / "datasets" / "freshness" / "processed"


def is_image_file(path):
    return path.is_file() and path.suffix.lower() in IMAGE_EXTENSIONS


def list_image_files(folder):
    return sorted(path for path in folder.iterdir() if is_image_file(path))


def choose_subset(image_paths, subset_size, seed_key):
    shuffled_paths = list(image_paths)
    random.Random(f"{RANDOM_SEED}-{seed_key}").shuffle(shuffled_paths)
    return shuffled_paths[:subset_size]


def split_list(items, seed_key):
    shuffled_items = list(items)
    random.Random(f"{RANDOM_SEED}-{seed_key}-split").shuffle(shuffled_items)

    total_items = len(shuffled_items)
    train_count = int(total_items * SPLITS["train"])
    val_count = int(total_items * SPLITS["val"])
    test_count = total_items - train_count - val_count

    return {
        "train": shuffled_items[:train_count],
        "val": shuffled_items[train_count : train_count + val_count],
        "test": shuffled_items[train_count + val_count : train_count + val_count + test_count],
    }


def copy_split_files(split_files_by_name, destination_root, class_name, filename_prefix=None):
    copied_counts = {}

    for split_name, image_paths in split_files_by_name.items():
        target_folder = destination_root / split_name / class_name
        target_folder.mkdir(parents=True, exist_ok=True)

        for index, image_path in enumerate(image_paths, start=1):
            if filename_prefix:
                output_name = f"{filename_prefix}_{index:03d}_{image_path.name}"
            else:
                output_name = image_path.name

            output_path = target_folder / output_name
            if output_path.exists():
                raise ValueError(f"Refusing to overwrite existing file: {output_path}")

            shutil.copy2(image_path, output_path)

        copied_counts[split_name] = len(image_paths)

    return copied_counts


def reset_output_splits(output_root):
    for split_name in SPLITS:
        split_folder = output_root / split_name
        if split_folder.exists():
            shutil.rmtree(split_folder)


def resolve_fruitvision_label_folder(base_folder, expected_label):
    direct_images = list_image_files(base_folder)
    if direct_images:
        return base_folder

    child_directories = [path for path in base_folder.iterdir() if path.is_dir()]
    if len(child_directories) != 1:
        found_names = [path.name for path in child_directories]
        raise ValueError(
            f"Expected one nested folder inside '{base_folder}', found: {found_names}"
        )

    nested_folder = child_directories[0]
    if nested_folder.name.lower() != expected_label.lower():
        raise ValueError(
            f"Expected nested folder named '{expected_label}' inside '{base_folder}', "
            f"found '{nested_folder.name}'"
        )

    nested_images = list_image_files(nested_folder)
    if not nested_images:
        raise ValueError(f"No images found inside '{nested_folder}'")

    return nested_folder


def prepare_waste_dataset():
    source_root = WASTE_RAW_ROOT / WASTE_VARIANT
    if not source_root.exists():
        raise ValueError(f"Waste source folder does not exist: {source_root}")

    reset_output_splits(WASTE_OUTPUT_ROOT)

    found_counts = {}
    class_files = {}

    for class_name in WASTE_CLASSES:
        class_folder = source_root / class_name
        if not class_folder.exists():
            raise ValueError(f"Missing waste class folder: {class_folder}")

        image_paths = list_image_files(class_folder)
        if not image_paths:
            raise ValueError(f"No images found in waste class folder: {class_folder}")

        found_counts[class_name] = len(image_paths)
        class_files[class_name] = image_paths

    # Use the smallest relevant waste class so the final dataset stays balanced.
    subset_size = min(found_counts.values())
    selected_counts = {}
    copied_counts = {split_name: {} for split_name in SPLITS}

    for class_name, image_paths in class_files.items():
        selected_paths = choose_subset(image_paths, subset_size, f"waste-{class_name}")
        split_files_by_name = split_list(selected_paths, f"waste-{class_name}")
        split_counts = copy_split_files(split_files_by_name, WASTE_OUTPUT_ROOT, class_name)

        selected_counts[class_name] = len(selected_paths)
        for split_name, count in split_counts.items():
            copied_counts[split_name][class_name] = count

    return {
        "source_variant": WASTE_VARIANT,
        "found_counts": found_counts,
        "balanced_target_size": subset_size,
        "selected_counts": selected_counts,
        "copied_counts": copied_counts,
    }


def prepare_freshness_dataset():
    if not FRESHNESS_RAW_ROOT.exists():
        raise ValueError(f"Freshness source folder does not exist: {FRESHNESS_RAW_ROOT}")

    reset_output_splits(FRESHNESS_OUTPUT_ROOT)

    found_counts = {}
    subgroup_files = {}

    for fruit_name in FRESHNESS_FRUITS:
        for label_name in FRESHNESS_LABELS:
            label_folder = FRESHNESS_RAW_ROOT / fruit_name / label_name
            if not label_folder.exists():
                raise ValueError(f"Missing FruitVision folder: {label_folder}")

            image_folder = resolve_fruitvision_label_folder(label_folder, label_name)
            image_paths = list_image_files(image_folder)

            key = f"{fruit_name}/{label_name}"
            found_counts[key] = len(image_paths)
            subgroup_files[key] = image_paths

    # Use the smallest subgroup so both final classes and fruit types stay balanced.
    subgroup_target_size = min(found_counts.values())
    final_class_counts = {"fresh": 0, "rotten": 0}
    copied_counts = {split_name: {} for split_name in SPLITS}
    selected_counts = {"fresh": 0, "rotten": 0}

    for split_name in SPLITS:
        copied_counts[split_name] = {"fresh": 0, "rotten": 0}

    for fruit_name in FRESHNESS_FRUITS:
        for label_name in FRESHNESS_LABELS:
            key = f"{fruit_name}/{label_name}"
            final_class_name = FRESHNESS_CLASS_MAP[label_name]

            selected_paths = choose_subset(
                subgroup_files[key],
                subgroup_target_size,
                f"freshness-{fruit_name}-{label_name}",
            )
            split_files_by_name = split_list(
                selected_paths,
                f"freshness-{fruit_name}-{label_name}",
            )
            split_counts = copy_split_files(
                split_files_by_name,
                FRESHNESS_OUTPUT_ROOT,
                final_class_name,
                filename_prefix=f"{fruit_name.lower()}_{label_name.lower()}",
            )

            final_class_counts[final_class_name] += found_counts[key]
            selected_counts[final_class_name] += len(selected_paths)

            for split_name, count in split_counts.items():
                copied_counts[split_name][final_class_name] += count

    return {
        "found_counts": found_counts,
        "final_class_counts": final_class_counts,
        "balanced_target_size": subgroup_target_size,
        "selected_counts": selected_counts,
        "copied_counts": copied_counts,
    }


def print_summary(title, summary, selected_label):
    print()
    print(title)
    print("-" * len(title))

    source_variant = summary.get("source_variant")
    if source_variant:
        print(f"Source variant: {source_variant}")

    print("Images found:")
    for class_name, count in summary["found_counts"].items():
        print(f"  {class_name}: {count}")

    final_class_counts = summary.get("final_class_counts")
    if final_class_counts:
        print("Merged final class totals:")
        for class_name, count in final_class_counts.items():
            print(f"  {class_name}: {count}")

    balanced_target_size = summary.get("balanced_target_size")
    if balanced_target_size is not None:
        print(f"Balanced target size: {balanced_target_size}")

    print(selected_label)
    for class_name, count in summary["selected_counts"].items():
        print(f"  {class_name}: {count}")

    print("Copied into processed dataset:")
    for split_name, class_counts in summary["copied_counts"].items():
        for class_name, count in class_counts.items():
            print(f"  {split_name}/{class_name}: {count}")


def main():
    waste_summary = prepare_waste_dataset()
    freshness_summary = prepare_freshness_dataset()

    print_summary(
        "Waste Dataset Summary",
        waste_summary,
        "Images selected per class:",
    )
    print_summary(
        "Freshness Dataset Summary",
        freshness_summary,
        "Images selected per final class:",
    )


if __name__ == "__main__":
    main()
