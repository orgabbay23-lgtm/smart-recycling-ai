# אימון מחדש של מודלי EfficientNetV2 (Waste + Freshness)

מסמך הנחיה לאימון מחדש בקאגל ולהטמעה אחר־כך באפליקציה.

---

## 1. למה היה צריך לתקן (האבחון)

המודלים הקודמים בתיקייה הזו היו **מנוונים** — החזירו פלט כמעט קבוע (~50%) לכל
תמונה, בלי קשר לתוכן. נבדק מול תמונות מתויגות אמיתיות מהריפו:

| מודל | פלט על כל תמונה | מסקנה |
|------|------------------|--------|
| Waste (2 מוצאים) | `idx0-prob ≈ 0.507` (טווח 0.503–0.509) על זכוכית/מתכת/נייר/פלסטיק **וגם** אוכל | לא מבחין בכלום |
| Freshness (מוצא יחיד) | `sigmoid ≈ 0.49–0.53` על fresh ו-rotten כאחד | לא מבחין בכלום |

(להשוואה: אותו pipeline על EfficientNetV2-S עם משקלי ImageNet החזיר תחזיות מגוונות והגיוניות — כלומר הקוד תקין, המשקלים המאומנים היו מקולקלים.)

**שורש הבעיה:** הקוד הישן עשה
`num_classes = len(datasets.ImageFolder(DATA_DIR).classes)` עם `DATA_DIR` ברמה הלא־נכונה בעץ:

- **Waste** → `ImageFolder` קלט את `['TEST','TRAIN']` בתור 2 ה"קטגוריות". המודל ניסה ללמוד את המשימה הבלתי־אפשרית "האם התמונה בתיקיית train או test" → קרס לפלט קבוע ~50%.
- **Freshness** → `ImageFolder` מצא **תיקייה אחת בלבד** → מוצא יחיד, בלי שום סיגנל לימוד.

---

## 2. מה תוקן בנוטבוקים

שני הנוטבוקים נכתבו מחדש (`waste/waste-model_notebook.ipynb`,
`freshness/freshness-model__notebook.ipynb`). השינויים העיקריים:

1. **גילוי קטגוריות אוטומטי ועמיד** — במקום `ImageFolder(DATA_DIR)`, הקוד עובר על כל עץ הדאטהסט ולוקח את **תיקיית־האב הישירה של כל תמונה** בתור הקטגוריה שלה. זה:
   - ממזג אוטומטית `TRAIN/` ו-`TEST/` (גם `TRAIN/O` וגם `TEST/O` → קטגוריה `O`),
   - מתעלם מתיקיות split/wrapper כך שלא ייהפכו לקטגוריות מזויפות.
2. **בדיקות שפיות שעוצרות אימון מקולקל** (`assert`):
   - חייב להיות `num_classes >= 2`,
   - שם קטגוריה לא יכול להיות `train/test/val/...`,
   - לכל קטגוריה לפחות 10 תמונות.
   - הקוד **מדפיס כמות תמונות לכל קטגוריה** לפני האימון — כך רואים מיד אם משהו לא תקין.
3. **Freshness בינארי** — `COLLAPSE_FRESH_ROTTEN = True` ממזג תיקיות לפי־פרי (כמו `freshapple`, `rottenbanana`) ל-`['fresh','rotten']`. אם המבנה כבר `fresh/rotten` — נשאר אותו דבר.
4. **Waste קריא** — `O → Organic`, `R → Recyclable` (סדר אינדקסים נשמר).
5. **Checkpoint שמתאר את עצמו** — נשמר `dict` עם
   `model_state_dict, classes, arch, img_size, normalization, val_accuracy, task`.
   כך ההטמעה באפליקציה לא צריכה לנחש שמות/סדר קטגוריות.
6. **הערכה אוטומטית בסוף** — classification report, מטריצת בלבול (PNG), ו**אזהרה גדולה אם ה-accuracy קרוב לרמת ניחוש** (רשת ביטחון נוספת נגד מודל מקולקל).
7. **תקין ל-T4** — Mixed Precision (AMP) עם API מודרני + fallback, `BATCH_SIZE=32` בטוח ל-384px, early stopping, מגבלת זמן 11 שעות.

> כל הלוגיקה נבדקה מקומית: מבני techsash (split), per-fruit, fresh/rotten פשוט — כולם זוהו נכון; ותרחישי הבאג (קטגוריה אחת / מעט תמונות) הפעילו את ה-`assert` כצפוי. הריצה המלאה (data→model→train→eval) רצה מקצה לקצה.

---

## 3. איך מריצים בקאגל (T4)

לכל אחד מהנוטבוקים בנפרד:

1. **New Notebook** → העלה/הדבק את ה-`.ipynb`.
2. **Add Input** → צרף את הדאטהסט:
   - Waste: `sumn2u/garbage-classification-v2` (רב-קטגוריות, ~19k תמונות, ~10 מחלקות)
   - Freshness: `ulnnproject/food-freshness-dataset`
3. **Settings** מימין:
   - **Accelerator = GPU T4 x1**
   - **Internet = On** (נדרש פעם אחת כדי להוריד את משקלי ImageNet של EfficientNetV2-S)
4. **Run All**. בדוק בפלט של תא 2 שהקטגוריות והכמויות הגיוניות, ובסוף שה-accuracy גבוה בבירור מרמת ניחוש.
5. אם נתיב הדאטהסט שונה אצלך — שנה את `DEFAULT_DATA_DIR` בתא 1 (הקוד גם מנסה לזהות אוטומטית את הדאטהסט היחיד שמצורף).

אם יש **OOM** ב-T4 — הורד `BATCH_SIZE` ל-16, או `IMG_SIZE` ל-224 (גם מאיץ אימון פי ~3).

---

## 4. מה להחזיר לי להטמעה

מטאב **Output** של כל נוטבוק:

- `efficientnetv2_waste_best.pth` + `efficientnetv2_freshness_best.pth`
- `confusion_matrix_waste.png` + `confusion_matrix_freshness.png`
- `classification_report_waste.txt` + `classification_report_freshness.txt`
- הדפסת `Classes (index order)` ושורת ה-`Validation accuracy` מכל נוטבוק.

עם אלה אשלים את ההטמעה: עדכון `backend/inference.py` לקרוא את ה-checkpoint
שמתאר את עצמו (EfficientNetV2-S + img_size + normalization), עדכון
`backend/config.py` (קטגוריות + המלצות פח/רעננות), והחלפת הטבלאות, ה-accuracy
ומטריצות הבלבול בדף ה-About + הוספת פירוט איך אומנו המודלים (EfficientNetV2-S,
50 epochs מקס׳ עם early stopping, AdamW 1e-4, AMP, 384px וכו').

---

## 5. קטגוריות ה-Waste (רב-קטגוריות)

נבחר דאטהסט רב-קטגוריות: **`sumn2u/garbage-classification-v2`** (~19k תמונות, ~10
מחלקות — כמו battery, biological, cardboard, clothes, glass, metal, paper,
plastic, shoes, trash). השמות נקבעים אוטומטית משמות התיקיות, וה-checkpoint שומר
אותם, כך שאחרי האימון אדע בדיוק אילו קטגוריות יש ואבנה לפיהן את המלצות הפח באפליקציה.

חלופה אם תרצה 12 מחלקות: `mostafaabla/garbage-classification` — אז רק לשנות
`DEFAULT_DATA_DIR = "/kaggle/input/garbage-classification"` בתא 1. הנוטבוק זהה,
תומך בכל מספר קטגוריות.

> בזמן ההטמעה אצטרך למפות כל קטגוריה לפח/המלצה (למשל glass→זכוכית, battery→פסולת
> אלקטרונית/מסוכנת, biological→אורגני/קומפוסט). אעשה זאת לפי רשימת הקטגוריות
> המדויקת שתחזור מהאימון.
