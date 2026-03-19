from __future__ import annotations

import json
from pathlib import Path

import joblib
from sklearn.model_selection import train_test_split

from src.config import (
    DEFAULT_DATASET_PATH,
    FALLBACK_DATASET_PATHS,
    FIGURES_DIR,
    MODELS_DIR,
    REPORTS_DIR,
)
from src.data_pipeline import build_burnout_targets, load_dataset, select_feature_matrix
from src.evaluation import evaluate_predictions
from src.inference import predict_new_student
from src.modeling import (
    build_logistic_regression_pipeline,
    build_random_forest_pipeline,
)
from src.visualization import generate_visualizations


def run_research_pipeline(dataset_path: Path | str = DEFAULT_DATASET_PATH) -> None:
    dataset_path = Path(dataset_path)
    if not dataset_path.exists():
        fallback_path = next((path for path in FALLBACK_DATASET_PATHS if path.exists()), None)
        if fallback_path is None:
            raise FileNotFoundError(f"Dataset not found: {dataset_path}")
        dataset_path = fallback_path

    MODELS_DIR.mkdir(parents=True, exist_ok=True)
    REPORTS_DIR.mkdir(parents=True, exist_ok=True)
    FIGURES_DIR.mkdir(parents=True, exist_ok=True)

    df = load_dataset(dataset_path)
    df = build_burnout_targets(df)

    x, y = select_feature_matrix(df)

    x_train, x_test, y_train, y_test = train_test_split(
        x,
        y,
        test_size=0.2,
        random_state=42,
        stratify=y if y.nunique() > 1 else None,
    )

    print("Training Random Forest...")
    rf_model = build_random_forest_pipeline()
    rf_model.fit(x_train, y_train)
    rf_pred = rf_model.predict(x_test)
    rf_metrics = evaluate_predictions(y_test, rf_pred)

    print("Training Logistic Regression...")
    lr_model = build_logistic_regression_pipeline()
    lr_model.fit(x_train, y_train)
    lr_pred = lr_model.predict(x_test)
    lr_metrics = evaluate_predictions(y_test, lr_pred)

    best_model = rf_model if rf_metrics["accuracy"] >= lr_metrics["accuracy"] else lr_model
    best_model_name = "Random Forest" if rf_metrics["accuracy"] >= lr_metrics["accuracy"] else "Logistic Regression"

    rf_model_path = MODELS_DIR / "burnout_random_forest.joblib"
    lr_model_path = MODELS_DIR / "burnout_logistic_regression.joblib"
    best_model_path = MODELS_DIR / "burnout_best_model.joblib"

    joblib.dump(rf_model, rf_model_path)
    joblib.dump(lr_model, lr_model_path)
    joblib.dump(best_model, best_model_path)

    metrics_comparison = {
        "random_forest": rf_metrics,
        "logistic_regression": lr_metrics,
        "best_model": best_model_name,
    }

    report_path = REPORTS_DIR / "evaluation_metrics.json"
    report_path.write_text(json.dumps(metrics_comparison, indent=2), encoding="utf-8")

    figure_paths = generate_visualizations(df, FIGURES_DIR)

    example_student = {
        "CGPA": 2.8,
        "Financial_Stress": 4,
        "Semester_Credit_Load": 24,
        "Sleep_Quality": "Poor",
        "Physical_Activity": "Low",
        "Diet_Quality": "Average",
        "Social_Support": "Low",
    }
    predicted_level = predict_new_student(best_model, example_student)

    print("\n" + "=" * 60)
    print("Pipeline completed.")
    print("=" * 60)
    print(f"Dataset used: {dataset_path}")
    print("\n=== Model Comparison ===")
    print(f"Random Forest Accuracy:     {rf_metrics['accuracy']}")
    print(f"Logistic Regression Accuracy: {lr_metrics['accuracy']}")
    print(f"Best Model Selected: {best_model_name}")
    print(f"\nModels saved:")
    print(f"  - {rf_model_path}")
    print(f"  - {lr_model_path}")
    print(f"  - {best_model_path}")
    print(f"\nMetrics report: {report_path}")
    print(f"\n=== {best_model_name} Details ===")
    if best_model_name == "Random Forest":
        metrics = rf_metrics
    else:
        metrics = lr_metrics
    print(f"Accuracy: {metrics['accuracy']}")
    print("Confusion Matrix:")
    for row in metrics["confusion_matrix"]:
        print(row)
    print("\nClassification Report:")
    print(metrics["classification_report"])
    print("\nGenerated Figures:")
    for path in figure_paths:
        print(f"  - {path}")
    print(f"\nExample Prediction ({best_model_name}): {predicted_level}")
    print("=" * 60)


if __name__ == "__main__":
    run_research_pipeline()
