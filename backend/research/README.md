# BurnoutSense Research Pipeline

This module trains a burnout-level classifier from the student dataset using a modular research prototype workflow.

## Dataset
Expected default dataset location:
- `backend/data/student_burnout.csv`

## Target Construction
- `Burnout_Score = Stress_Level + Depression_Score + Anxiety_Score`
- Burnout levels:
  - 0-3: Low
  - 4-6: Moderate
  - 7+: High

## Feature Set
- CGPA
- Financial_Stress
- Semester_Credit_Load
- Sleep_Quality
- Physical_Activity
- Diet_Quality
- Social_Support

## Model
- RandomForestClassifier inside an sklearn Pipeline
- Missing values handled via SimpleImputer
- Categorical encoding via OneHotEncoder
- Numeric normalization via StandardScaler

## Run
From `backend/`:

```bash
python research/run_pipeline.py
```

## Outputs
- Model artifact: `research/outputs/models/burnout_random_forest.joblib`
- Evaluation report: `research/outputs/reports/evaluation_metrics.json`
- Visualizations in `research/outputs/figures/`:
  - stress_vs_cgpa.png
  - sleep_quality_vs_burnout.png
  - financial_stress_vs_burnout.png

## Inference
Use `predict_new_student` in `research/src/inference.py` for new student predictions.
