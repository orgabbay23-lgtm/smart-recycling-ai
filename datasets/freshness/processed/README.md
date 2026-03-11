# Freshness Processed Dataset

Source dataset: `datasets/freshness/raw/fruitvision/`

Selected MVP data:
- fruit types: `Apple`, `Banana`
- freshness labels kept from the raw data: `Fresh`, `Rotten`

Organization:
- `train/fresh`
- `train/rotten`
- `val/fresh`
- `val/rotten`
- `test/fresh`
- `test/rotten`

Apple and Banana images are merged under the final freshness classes `fresh` and `rotten`.

Balancing rule:
- count valid images for `Apple/Fresh`, `Apple/Rotten`, `Banana/Fresh`, and `Banana/Rotten`
- use the smallest subgroup count among those four subgroups as the target
- sample that same number from each subgroup so Apple and Banana stay balanced inside each final class
- merge the sampled images into the final classes `fresh` and `rotten`
- split the balanced data into `train`, `val`, and `test`

This processed dataset was created by copying a balanced subset from the raw dataset. The raw files were not modified.
