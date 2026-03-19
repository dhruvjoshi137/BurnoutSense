from __future__ import annotations

from pathlib import Path
from typing import Tuple

import pandas as pd

from .config import SELECTED_FEATURES


def load_dataset(csv_path: Path | str) -> pd.DataFrame:
    return pd.read_csv(csv_path)


def build_burnout_targets(df: pd.DataFrame) -> pd.DataFrame:
    transformed = df.copy()
    transformed["Burnout_Score"] = (
        transformed["Stress_Level"].fillna(0)
        + transformed["Depression_Score"].fillna(0)
        + transformed["Anxiety_Score"].fillna(0)
    )

    def _score_to_category(score: float) -> str:
        if score <= 3:
            return "Low"
        if score <= 6:
            return "Moderate"
        return "High"

    transformed["Burnout_Category"] = transformed["Burnout_Score"].apply(_score_to_category)
    return transformed


def select_feature_matrix(df: pd.DataFrame) -> Tuple[pd.DataFrame, pd.Series]:
    x = df[SELECTED_FEATURES].copy()
    y = df["Burnout_Category"].copy()
    return x, y
