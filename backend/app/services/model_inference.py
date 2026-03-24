from __future__ import annotations

from functools import lru_cache
from pathlib import Path
from typing import Any, Dict, List, Optional

import joblib
import pandas as pd

MODEL_LABEL_TO_RISK = {
    "low": "low",
    "moderate": "moderate",
    "high": "high",
}

REQUIRED_FEATURES = [
    "CGPA",
    "Financial_Stress",
    "Semester_Credit_Load",
    "Sleep_Quality",
    "Physical_Activity",
    "Diet_Quality",
    "Social_Support",
]


def _backend_root() -> Path:
    return Path(__file__).resolve().parents[2]


def _normalize_label(label: object) -> str:
    if label is None:
        return "moderate"
    normalized = str(label).strip().lower()
    return MODEL_LABEL_TO_RISK.get(normalized, "moderate")


def _score_from_risk_and_confidence(risk: str, confidence: float) -> float:
    confidence = max(0.0, min(1.0, confidence))
    if risk == "high":
        return round(70.0 + 30.0 * confidence, 2)
    if risk == "moderate":
        return round(35.0 + 30.0 * confidence, 2)
    return round(30.0 * (1.0 - confidence), 2)


@lru_cache(maxsize=1)
def load_best_model() -> Optional[Any]:
    model_path = _backend_root() / "research" / "outputs" / "models" / "burnout_best_model.joblib"
    if not model_path.exists():
        return None
    return joblib.load(model_path)


def can_use_model(df: pd.DataFrame) -> bool:
    return all(feature in df.columns for feature in REQUIRED_FEATURES)


def predict_risk_batch(df: pd.DataFrame) -> Optional[List[Dict[str, float | str]]]:
    model = load_best_model()
    if model is None or not can_use_model(df):
        return None

    features = df[REQUIRED_FEATURES].copy()
    labels = model.predict(features)

    proba = None
    classes = None
    if hasattr(model, "predict_proba"):
        proba = model.predict_proba(features)
        classes = [str(item) for item in getattr(model, "classes_", [])]

    results: List[Dict[str, float | str]] = []
    for idx, label in enumerate(labels):
        risk = _normalize_label(label)
        confidence = 0.5

        if proba is not None and classes:
            target = str(label)
            if target in classes:
                class_index = classes.index(target)
                confidence = float(proba[idx][class_index])

        score = _score_from_risk_and_confidence(risk, confidence)
        results.append(
            {
                "risk_level": risk,
                "burnout_score": score,
                "model_confidence": round(confidence, 4),
            }
        )

    return results
