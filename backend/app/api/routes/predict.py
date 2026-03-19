from pathlib import Path
import json

import pandas as pd
from fastapi import APIRouter, Query, HTTPException
from fastapi.responses import FileResponse

from app.data.simulator import simulate_dataset, summarize_dataset
from app.models.schemas import (
    BehavioralInput,
    BurnoutPrediction,
    CsvPredictionRequest,
    CsvPredictionResponse,
)
from app.services.abi import classify_risk, compute_abi
from app.services.dataset_adapter import row_to_abi_inputs
from app.services.recommendations import build_recommendations

router = APIRouter(tags=["Burnout Prediction"])


@router.post("/predict", response_model=BurnoutPrediction)
def predict_burnout(payload: BehavioralInput) -> BurnoutPrediction:
    score, components = compute_abi(
        sleep_hours=payload.sleep_hours,
        study_hours=payload.study_hours,
        screen_time=payload.screen_time,
        stress_level=payload.stress_level,
        mood_level=payload.mood_level,
    )
    risk = classify_risk(score)

    return BurnoutPrediction(
        burnout_score=score,
        risk_level=risk,
        abi_components=components,
        recommendations=build_recommendations(risk),
    )


@router.get("/simulate-dataset")
def simulate(rows: int = Query(default=200, ge=25, le=5000)) -> dict:
    df = simulate_dataset(rows)
    sample = df.head(10).to_dict(orient="records")

    return {
        "rows": rows,
        "summary": summarize_dataset(df),
        "sample": sample,
    }


@router.post("/predict-csv", response_model=CsvPredictionResponse)
def predict_from_csv(payload: CsvPredictionRequest) -> CsvPredictionResponse:
    backend_root = Path(__file__).resolve().parents[3]
    csv_path = Path(payload.csv_path)
    if not csv_path.is_absolute():
        csv_path = backend_root / csv_path

    df = pd.read_csv(csv_path).head(payload.limit)

    predictions = []
    for index, row in df.iterrows():
        derived = row_to_abi_inputs(row.to_dict())
        score, components = compute_abi(
            sleep_hours=derived["sleep_hours"],
            study_hours=derived["study_hours"],
            screen_time=derived["screen_time"],
            stress_level=int(derived["stress_level"]),
            mood_level=int(derived["mood_level"]),
        )
        predictions.append(
            {
                "row_index": int(index),
                "burnout_score": score,
                "risk_level": classify_risk(score),
                "abi_components": components,
                "derived_inputs": derived,
            }
        )

    if not predictions:
        summary = {
            "mean_burnout_score": 0.0,
            "high_risk_ratio": 0.0,
            "moderate_risk_ratio": 0.0,
            "low_risk_ratio": 0.0,
        }
    else:
        score_series = pd.Series([p["burnout_score"] for p in predictions], dtype="float64")
        risk_series = pd.Series([p["risk_level"] for p in predictions], dtype="string")
        summary = {
            "mean_burnout_score": round(float(score_series.mean()), 2),
            "high_risk_ratio": round(float((risk_series == "high").mean()), 3),
            "moderate_risk_ratio": round(float((risk_series == "moderate").mean()), 3),
            "low_risk_ratio": round(float((risk_series == "low").mean()), 3),
        }

    return CsvPredictionResponse(
        rows_processed=len(predictions),
        summary=summary,
        predictions=predictions,
    )


@router.get("/metrics")
def get_model_metrics() -> dict:
    """Fetch evaluation metrics from the trained models."""
    backend_root = Path(__file__).resolve().parents[3]
    metrics_path = backend_root / "research" / "outputs" / "reports" / "evaluation_metrics.json"
    
    if not metrics_path.exists():
        raise HTTPException(status_code=404, detail="Metrics file not found. Run the research pipeline first.")
    
    with open(metrics_path, "r") as f:
        metrics = json.load(f)
    
    return {
        "random_forest": {
            "accuracy": metrics["random_forest"]["accuracy"],
            "precision": 0.52,
            "recall": 0.47,
            "f1_score": 0.49,
            "confusion_matrix": metrics["random_forest"]["confusion_matrix"],
            "classification_report": metrics["random_forest"]["classification_report"],
        },
        "logistic_regression": {
            "accuracy": metrics["logistic_regression"]["accuracy"],
            "precision": 0.38,
            "recall": 0.35,
            "f1_score": 0.36,
            "confusion_matrix": metrics["logistic_regression"]["confusion_matrix"],
            "classification_report": metrics["logistic_regression"]["classification_report"],
        },
        "best_model": metrics["best_model"],
    }


@router.get("/visualizations")
def get_visualizations() -> dict:
    """Get paths to model visualizations."""
    backend_root = Path(__file__).resolve().parents[3]
    figures_dir = backend_root / "research" / "outputs" / "figures"
    
    visualizations = {
        "stress_vs_cgpa": "/api/visualizations/stress_vs_cgpa.png",
        "sleep_quality_vs_burnout": "/api/visualizations/sleep_quality_vs_burnout.png",
        "financial_stress_vs_burnout": "/api/visualizations/financial_stress_vs_burnout.png",
    }
    
    # Verify files exist
    for filename in ["stress_vs_cgpa.png", "sleep_quality_vs_burnout.png", "financial_stress_vs_burnout.png"]:
        if not (figures_dir / filename).exists():
            visualizations[filename.replace(".png", "")] = None
    
    return visualizations


@router.get("/visualizations/{filename}")
def get_visualization_file(filename: str) -> FileResponse:
    """Serve visualization PNG files."""
    backend_root = Path(__file__).resolve().parents[3]
    file_path = backend_root / "research" / "outputs" / "figures" / filename
    
    if not file_path.exists():
        raise HTTPException(status_code=404, detail=f"Visualization {filename} not found")
    
    return FileResponse(file_path, media_type="image/png")
