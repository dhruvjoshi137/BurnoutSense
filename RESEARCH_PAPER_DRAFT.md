# BurnoutSense: A Hybrid Machine Learning and Academic Burnout Index Framework for Early Student Burnout Risk Assessment

## Abstract
Student burnout is a multidimensional challenge that affects academic performance, mental well-being, and long-term educational outcomes. This paper presents **BurnoutSense**, a research-oriented framework that combines a machine learning classification pipeline with an interpretable rule-based Academic Burnout Index (ABI) for operational risk screening. The system uses a student mental health survey dataset with **7,022 records** and constructs burnout labels from aggregated psychological indicators. We compare two supervised models, Random Forest and Logistic Regression, under a unified preprocessing workflow with imputation, encoding, and normalization. On a stratified 80/20 split, Random Forest achieved **45.69% accuracy** and **0.3249 macro-F1**, outperforming Logistic Regression (**34.59% accuracy**, **0.3197 macro-F1**). Beyond offline modeling, BurnoutSense integrates a FastAPI backend and React-based interface for individual prediction, batch analysis, visualization, and daily progress tracking. Results indicate that while predictive performance is moderate and class imbalance remains a challenge, the framework provides a practical basis for early warning and intervention support in educational environments.

**Keywords:** student burnout, educational data mining, risk classification, random forest, mental health analytics, early warning systems

## 1. Introduction
Burnout among students is increasingly recognized as a major barrier to sustained academic success. Factors such as high workload, poor sleep, financial stress, and limited social support often interact in non-linear ways, making manual screening difficult at scale. Educational institutions need tools that are both data-driven and explainable enough to support real interventions.

BurnoutSense addresses this need through a two-part approach:
1. A **machine learning pipeline** that predicts burnout category from student lifestyle and support features.
2. A **behavioral ABI scoring mechanism** that offers interpretable daily risk estimation from self-reported check-ins.

The objective of this work is not only to maximize classification performance, but also to deliver a deployable research prototype that bridges model output and practical monitoring workflows.

The key contributions of this paper are:
1. A reproducible burnout classification pipeline with feature preprocessing and model comparison.
2. A structured burnout-target construction method from stress, depression, and anxiety indicators.
3. An end-to-end system implementation that operationalizes both prediction and continuous risk tracking.
4. An empirical analysis of model behavior under class imbalance with actionable discussion of limitations and next steps.

## 2. Related Work
Prior work in educational data mining has explored prediction of academic outcomes, stress, and mental health risks using both traditional machine learning and deep learning approaches. Most studies report that psychosocial and behavioral signals, including sleep quality, stress, and social support, are strongly associated with burnout-related outcomes. Tree-based ensembles are frequently preferred for mixed-type tabular data, while linear models are used as transparent baselines.

This project aligns with that direction by using a structured tabular feature set and comparing an ensemble model against a linear baseline. Unlike purely offline studies, BurnoutSense extends into a usable application layer with API-driven prediction, cohort analytics, and temporal tracking. This practical integration is relevant for translational research where decision support matters as much as model metrics.

## 3. Dataset and Problem Formulation
### 3.1 Dataset
The study uses the `students_mental_health_survey.csv` dataset containing **7,022 rows** and **20 columns**. Burnout labels are not directly provided and are therefore constructed through a deterministic scoring process.

### 3.2 Target Construction
A composite burnout score is defined as:

\[
\text{Burnout\_Score} = \text{Stress\_Level} + \text{Depression\_Score} + \text{Anxiety\_Score}
\]

Burnout classes are assigned as:
1. **Low** for score \(\leq 3\)
2. **Moderate** for score \(4\) to \(6\)
3. **High** for score \(\geq 7\)

Observed class distribution:
1. **High:** 3,937
2. **Moderate:** 2,383
3. **Low:** 702

This distribution indicates a substantial class imbalance, especially for the Low class.

### 3.3 Feature Set
The model uses seven selected predictors:
1. CGPA
2. Financial_Stress
3. Semester_Credit_Load
4. Sleep_Quality
5. Physical_Activity
6. Diet_Quality
7. Social_Support

Numeric features: CGPA, Financial_Stress, Semester_Credit_Load.
Categorical features: Sleep_Quality, Physical_Activity, Diet_Quality, Social_Support.

## 4. Methodology
### 4.1 Preprocessing Pipeline
A `ColumnTransformer`-based pipeline is used:
1. **Numeric branch:** median imputation + standard scaling.
2. **Categorical branch:** most-frequent imputation + one-hot encoding (`handle_unknown='ignore'`).

This ensures robust handling of missing values and heterogeneous feature types.

### 4.2 Train-Test Protocol
Data is split into training and test partitions with:
1. Test size: 20%
2. Random state: 42
3. Stratification by burnout category

Approximately 1,405 samples are used for testing.

### 4.3 Model Configurations
Two models were evaluated:

1. **Random Forest Classifier**
- n_estimators = 500
- max_depth = 18
- min_samples_split = 4
- min_samples_leaf = 2
- max_features = sqrt
- class_weight = balanced
- random_state = 42

2. **Logistic Regression**
- solver = lbfgs
- max_iter = 1200
- C = 1.5
- class_weight = balanced
- random_state = 42

Best-model selection uses a tuple priority of `(macro-F1, accuracy)`.

### 4.4 ABI Risk Scoring for Operational Use
For daily user check-ins, an Academic Burnout Index is computed from sleep hours, study hours, screen time, and stress level, then clipped to [0, 100].

\[
\text{ABI} = 0.35\cdot\text{SleepDeficit} + 0.25\cdot\text{ScreenTimeScore} + 0.25\cdot\text{StressScore} + 0.15\cdot\text{StudyOverload}
\]

Risk bands:
1. Low: score \(\leq 30\)
2. Moderate: \(31\) to \(60\)
3. High: \(>60\)

This module improves interpretability for end users even when ML confidence is limited.

## 5. Results
### 5.1 Quantitative Performance
From `evaluation_metrics.json`:

| Model | Accuracy | Macro Precision | Macro Recall | Macro F1 |
|---|---:|---:|---:|---:|
| Random Forest | 0.4569 | 0.3270 | 0.3275 | 0.3249 |
| Logistic Regression | 0.3459 | 0.3633 | 0.3576 | 0.3197 |

Random Forest was selected as the best model due to higher macro-F1 and accuracy.

### 5.2 Class-wise Behavior
Random Forest confusion matrix (rows = true, columns = predicted for [Low, Moderate, High]):

\[
\begin{bmatrix}
8 & 50 & 82 \\
27 & 146 & 304 \\
47 & 253 & 488
\end{bmatrix}
\]

Interpretation:
1. The model performs comparatively better on the High class.
2. Low class recall is weak, likely due to minority representation and overlapping feature patterns.
3. Misclassification frequently shifts toward adjacent higher-risk categories.

### 5.3 Visual Analytical Outputs
The pipeline additionally generates three exploratory figures:
1. Stress Level vs CGPA scatter analysis
2. Sleep Quality vs Burnout category counts
3. Financial Stress vs Burnout boxplot by class

These visuals support model interpretation and communication with non-technical stakeholders.

## 6. System Implementation
BurnoutSense is implemented as an end-to-end full-stack research prototype:

1. **Backend:** FastAPI services for prediction, metrics retrieval, user authentication, and progress logging.
2. **Model services:** joblib-loaded artifacts for inference and recommendation generation.
3. **Frontend:** React + Vite interface for single prediction, CSV batch upload, analytics dashboards, and trend charts.
4. **Data persistence:** SQLite-based user and daily progress records for longitudinal tracking.

The architecture enables both one-time cohort analysis and repeated daily monitoring, which is important for early detection rather than retrospective reporting.

## 7. Discussion
The observed performance indicates that burnout classification from limited tabular behavior/support features is feasible but challenging. Macro-F1 around 0.32 suggests moderate discrimination across three classes, with the minority Low class remaining difficult to recover. This behavior is consistent with class imbalance and possible feature overlap among Moderate and High risk profiles.

Despite moderate predictive scores, the system has practical value in three ways:
1. It provides automated triage for large student populations.
2. It combines statistical prediction with transparent ABI components.
3. It supports longitudinal trend monitoring and early warning triggers.

These capabilities can help counselors and academic advisors prioritize interventions, especially when integrated with human review workflows.

## 8. Threats to Validity
1. **Construct validity:** Burnout labels are derived from a composite of stress, depression, and anxiety scores; they are not clinician-annotated burnout diagnoses.
2. **Internal validity:** Single train-test split may not capture full variance; k-fold cross-validation was not used in this version.
3. **External validity:** Generalization to other institutions, demographics, or cultural contexts is unverified.
4. **Class imbalance effects:** Minority-class learning remains limited despite class weighting.

## 9. Conclusion and Future Work
This paper presented BurnoutSense, a hybrid framework for student burnout risk assessment combining machine learning classification and an interpretable ABI scoring module. The Random Forest model outperformed Logistic Regression on the current dataset, but overall macro performance indicates room for improvement.

Future work will focus on:
1. Rebalancing strategies (SMOTE, focal loss alternatives, cost-sensitive tuning).
2. Cross-validation and calibration analysis.
3. Expanded feature space (attendance, coursework behavior, temporal patterns).
4. Model explainability modules (SHAP-based local and global explanations).
5. Prospective validation in real institutional settings with ethical oversight.

BurnoutSense demonstrates a practical and extensible foundation for data-informed student support systems where predictive modeling is coupled with interpretable risk monitoring.

## Acknowledgment
The authors acknowledge the Student Burnout Research initiative context and the development resources used for building the BurnoutSense prototype.

## References (Template - replace with your actual citations)
[1] Add key survey paper on student burnout and mental health analytics.

[2] Add foundational paper/book on educational data mining.

[3] Add source for Random Forest methodology.

[4] Add source for Logistic Regression in multi-class settings.

[5] Add paper on class imbalance handling in healthcare/education classification.

[6] Add source on early warning systems in higher education.

[7] Add source on interpretable AI and model transparency in student support contexts.

[8] Add ethical guidelines source for AI in mental health/education decision support.
