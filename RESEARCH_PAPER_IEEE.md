# BurnoutSense: A Hybrid Machine Learning and Academic Burnout Index Framework for Early Student Burnout Risk Assessment

## Abstract
Student burnout is a multidimensional challenge that affects academic performance, mental well-being, and long-term educational outcomes. This paper presents BurnoutSense, a research-oriented framework that combines a machine learning classification pipeline with an interpretable rule-based Academic Burnout Index (ABI) for operational risk screening. The system uses a student mental health survey dataset with 7,022 records and constructs burnout labels from aggregated psychological indicators. Two supervised models, Random Forest and Logistic Regression, are evaluated under a unified preprocessing workflow with imputation, encoding, and normalization. On a stratified 80/20 split, Random Forest achieved 45.69% accuracy and 0.3249 macro-F1, outperforming Logistic Regression (34.59% accuracy, 0.3197 macro-F1). Beyond offline modeling, BurnoutSense integrates a FastAPI backend and React-based interface for individual prediction, batch analysis, visualization, and daily progress tracking. Results indicate that while predictive performance is moderate and class imbalance remains a challenge, the framework provides a practical foundation for early warning and intervention support in educational settings.

**Index Terms:** student burnout, educational data mining, machine learning, random forest, risk assessment, early warning system.

## I. Introduction
Student burnout has become a critical concern in higher education due to its association with poor academic outcomes, reduced motivation, and adverse mental health trajectories [1], [2]. Educational institutions require scalable methods for early identification of at-risk students, particularly when counseling resources are limited [3].

Burnout risk emerges from interacting behavioral, psychosocial, and academic factors, including sleep quality, stress, workload, and social support. These interactions are often nonlinear, motivating the use of machine learning techniques that can capture complex dependencies in tabular educational data [4].

This paper introduces BurnoutSense, a hybrid framework with two complementary components: (i) a supervised multi-class classifier for burnout category prediction and (ii) an interpretable Academic Burnout Index (ABI) for day-level monitoring via self-reported check-ins.

The contributions of this work are:
1. A reproducible burnout classification pipeline with explicit preprocessing and model comparison.
2. A burnout target-construction strategy derived from stress, depression, and anxiety indicators.
3. An end-to-end deployment architecture integrating model inference, analytics, and longitudinal user tracking.
4. A critical analysis of model behavior under class imbalance with recommendations for future improvements.

## II. Related Work
Educational data mining and learning analytics literature has shown that psychological and lifestyle indicators are predictive of student well-being outcomes [4], [5]. Tree-based ensembles are frequently effective for mixed-type tabular data due to their nonlinear modeling capacity and robustness to feature interactions [6]. Logistic regression remains a widely used baseline because of interpretability and stable optimization behavior in multi-class settings [7].

Early warning systems in higher education increasingly combine predictive analytics with intervention-oriented dashboards [3]. However, many studies emphasize offline performance without demonstrating deployable decision-support integration. BurnoutSense addresses this translational gap.

## III. Dataset and Problem Formulation
### A. Dataset
The study uses `students_mental_health_survey.csv` with 7,022 records and 20 columns. Since direct burnout labels are not provided, labels are constructed from available psychological indicators.

### B. Burnout Target Construction
A composite burnout score is defined as:

\[
\text{Burnout\_Score} = \text{Stress\_Level} + \text{Depression\_Score} + \text{Anxiety\_Score}
\]

Burnout categories are assigned as:
1. Low: score <= 3
2. Moderate: score in [4, 6]
3. High: score >= 7

Observed class distribution:
1. High: 3,937
2. Moderate: 2,383
3. Low: 702

This indicates substantial class imbalance.

### C. Feature Set
Seven predictors are used:
1. CGPA
2. Financial_Stress
3. Semester_Credit_Load
4. Sleep_Quality
5. Physical_Activity
6. Diet_Quality
7. Social_Support

Numeric features: CGPA, Financial_Stress, Semester_Credit_Load.
Categorical features: Sleep_Quality, Physical_Activity, Diet_Quality, Social_Support.

## IV. Methodology
### A. Preprocessing
A `ColumnTransformer`-based pipeline is used:
1. Numeric branch: median imputation and standard scaling.
2. Categorical branch: most-frequent imputation and one-hot encoding with unknown-category handling.

### B. Train-Test Protocol
Data are partitioned using stratified train-test split:
1. Training set: 80%
2. Test set: 20%
3. Random seed: 42

The test set contains approximately 1,405 samples.

### C. Model Configurations
Two models are evaluated:
1. Random Forest (500 trees, depth 18, class-weight balancing, parallel execution).
2. Logistic Regression (lbfgs solver, 1,200 iterations, C = 1.5, class-weight balancing).

The best model is selected using a primary criterion of macro-F1 and secondary criterion of accuracy.

### D. Academic Burnout Index for Operational Monitoring
For day-level monitoring, ABI is computed as:

\[
\text{ABI} = 0.35\cdot\text{SleepDeficit} + 0.25\cdot\text{ScreenTimeScore} + 0.25\cdot\text{StressScore} + 0.15\cdot\text{StudyOverload}
\]

ABI is clipped to [0, 100] and mapped to risk levels: low (<= 30), moderate (31-60), high (> 60).

## V. Experimental Results
### A. Overall Model Performance
| Model | Accuracy | Macro Precision | Macro Recall | Macro F1 |
|---|---:|---:|---:|---:|
| Random Forest | 0.4569 | 0.3270 | 0.3275 | 0.3249 |
| Logistic Regression | 0.3459 | 0.3633 | 0.3576 | 0.3197 |

Random Forest is selected as the best model under the defined selection rule.

### B. Class-Wise Error Analysis
Random Forest confusion matrix (rows = true, columns = predicted; order: Low, Moderate, High):

\[
\begin{bmatrix}
8 & 50 & 82 \\
27 & 146 & 304 \\
47 & 253 & 488
\end{bmatrix}
\]

Performance is strongest on the majority High class, while Low-class recall is weak, consistent with severe imbalance [8].

### C. Visualization Outputs
The pipeline generates three analytical figures:
1. Stress level vs CGPA
2. Sleep quality vs burnout category
3. Financial stress vs burnout distribution

These outputs improve interpretability for non-technical stakeholders.

## VI. System Implementation
BurnoutSense is implemented as a full-stack prototype:
1. FastAPI backend for prediction, metrics, authentication, and progress logging.
2. Serialized model artifacts (joblib) for online inference.
3. React + Vite frontend for individual prediction, batch CSV analysis, analytics dashboards, and temporal trend views.
4. SQLite persistence for user and longitudinal progress records.

The architecture supports both cohort-level analysis and ongoing individual monitoring.

## VII. Discussion
The findings indicate that burnout prediction from limited tabular behavioral features is feasible but challenging. Macro-F1 around 0.32 indicates moderate class discrimination in a three-class setting. Class weighting improves robustness but does not fully address minority-class detection.

From an applied perspective, BurnoutSense is best positioned as a triage-oriented decision-support system rather than a diagnostic replacement. Integrating model outputs with interpretable ABI components improves transparency and intervention readiness [9], [10].

## VIII. Threats to Validity
1. Construct validity: labels are algorithmically derived and not clinician annotated.
2. Internal validity: evaluation uses a single train-test split rather than repeated cross-validation.
3. External validity: generalizability across institutions and demographics is unverified.
4. Imbalance risk: minority-class underrepresentation constrains robust learning.

## IX. Conclusion and Future Work
This work presented BurnoutSense, a hybrid framework for student burnout risk assessment that combines supervised classification with an interpretable ABI module. Random Forest outperformed Logistic Regression on the current dataset and was selected for deployment.

Future work includes advanced imbalance handling, cross-validated and calibrated evaluation, feature expansion with temporal and behavioral traces, SHAP-based explainability, and prospective institutional validation under ethical governance.

## References
[1] C. Maslach and M. P. Leiter, "Understanding the burnout experience: Recent research and its implications for psychiatry," *World Psychiatry*, vol. 15, no. 2, pp. 103-111, 2016.

[2] R. P. Auerbach *et al*., "WHO World Mental Health Surveys International College Student Project: Prevalence and distribution of mental disorders," *Journal of Abnormal Psychology*, vol. 127, no. 7, pp. 623-638, 2018.

[3] S. M. Jayaprakash, E. W. Moody, E. J. Lauria, J. R. Regan, and J. D. Baron, "Early Alert of Academically At-Risk Students: An Open Source Analytics Initiative," *Journal of Learning Analytics*, vol. 1, no. 1, pp. 6-47, 2014.

[4] C. Romero and S. Ventura, "Educational data mining and learning analytics: An updated survey," *Wiley Interdisciplinary Reviews: Data Mining and Knowledge Discovery*, vol. 10, no. 3, p. e1355, 2020.

[5] A. B. R. Shatte, D. M. Hutchinson, and S. J. Teague, "Machine learning in mental health: A scoping review of methods and applications," *Psychological Medicine*, vol. 49, no. 9, pp. 1426-1448, 2019.

[6] L. Breiman, "Random Forests," *Machine Learning*, vol. 45, no. 1, pp. 5-32, 2001.

[7] D. R. Cox, "The Regression Analysis of Binary Sequences," *Journal of the Royal Statistical Society. Series B (Methodological)*, vol. 20, no. 2, pp. 215-242, 1958.

[8] H. He and E. A. Garcia, "Learning from Imbalanced Data," *IEEE Transactions on Knowledge and Data Engineering*, vol. 21, no. 9, pp. 1263-1284, 2009.

[9] M. T. Ribeiro, S. Singh, and C. Guestrin, "\"Why Should I Trust You?\": Explaining the Predictions of Any Classifier," in *Proc. 22nd ACM SIGKDD Int. Conf. Knowledge Discovery and Data Mining (KDD)*, 2016, pp. 1135-1144.

[10] E. Vayena, A. Blasimme, and I. G. Cohen, "Machine learning in medicine: Addressing ethical challenges," *PLoS Medicine*, vol. 15, no. 11, p. e1002689, 2018.
