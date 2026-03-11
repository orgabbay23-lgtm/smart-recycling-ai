# Waste Processed Dataset

Source dataset: `datasets/waste/raw/garbage_classification_v2/standardized_256/`

Selected MVP classes:
- `plastic`
- `glass`
- `paper`
- `metal`

Organization:
- `train/`
- `val/`
- `test/`

Each split contains one folder for each selected waste class.

Balancing rule:
- count valid images in the selected waste classes
- use the smallest selected class size as the target for every waste class
- split the balanced data into `train`, `val`, and `test`

This processed dataset was created by copying a balanced subset from the raw dataset. The raw files were not modified.
