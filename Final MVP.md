## Final MVP Decision

The first working version of the project will include only:

- Two modes: Recycle Scan and Freshness Scan
- Camera-based capture in the browser (capture one image per scan, not continuous live inference)
- Output: predicted label, confidence, and recommendation
- Waste classes: Plastic, Paper, Glass, Metal
- Freshness classes: Fresh, Rotten
- Simple frontend pages: Home, Recycle Scan, Freshness Scan
- Simple FastAPI backend with 2 prediction endpoints

### Recycle Scan Flow
1. The user opens the Recycle Scan page
2. The browser camera is opened
3. The user captures one image
4. The image is sent to the waste prediction endpoint
5. The app returns:
   - predicted waste class
   - confidence score
   - recycling recommendation

### Freshness Scan Flow
1. The user opens the Freshness Scan page
2. The browser camera is opened
3. The user captures one image
4. The image is sent to the freshness prediction endpoint
5. The app returns:
   - freshness label
   - confidence score
   - recommendation

### Dataset Scope Used for the MVP

#### Waste Classification
- Selected dataset: Garbage Classification V2
- Final MVP classes: Plastic, Glass, Paper, Metal

#### Food Freshness
- Selected dataset: Mendeley FruitVision
- Final MVP food types: Apple, Banana
- Final MVP classes: Fresh, Rotten

### Dataset Preparation Status
- Raw dataset folders were created and documented
- A preprocessing script was created: `scripts/prepare_mvp_datasets.py`
- Balanced processed datasets were created under:
  - `datasets/waste/processed/`
  - `datasets/freshness/processed/`
- `train / val / test` splits were generated

### Current Freshness Balancing Rule
The freshness dataset is balanced using the smallest subgroup among:
- Apple/Fresh
- Apple/Rotten
- Banana/Fresh
- Banana/Rotten

This keeps both:
- Fresh vs Rotten balanced
- Apple vs Banana balanced inside each final class

Not included in the first MVP:
- Login/authentication
- Database
- Scan history
- Cloud storage
- Feedback/report incorrect result
- Continuous live inference on video
- Additional waste categories
- Additional fruit types
- Half-Fresh class