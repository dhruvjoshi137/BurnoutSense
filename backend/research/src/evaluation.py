from __future__ import annotations

from typing import Dict

import pandas as pd
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix


def evaluate_predictions(y_true: pd.Series, y_pred: pd.Series) -> Dict[str, object]:
    labels = ["Low", "Moderate", "High"]
    accuracy = accuracy_score(y_true, y_pred)
    conf_mat = confusion_matrix(y_true, y_pred, labels=labels)
    report = classification_report(y_true, y_pred, labels=labels, zero_division=0)

    return {
        "accuracy": round(float(accuracy), 4),
        "labels": labels,
        "confusion_matrix": conf_mat.tolist(),
        "classification_report": report,
    }
