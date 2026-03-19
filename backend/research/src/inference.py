from __future__ import annotations

from typing import Dict

import pandas as pd
from sklearn.pipeline import Pipeline

from .config import SELECTED_FEATURES


def predict_new_student(model: Pipeline, student_data: Dict[str, object]) -> str:
    row = {feature: student_data.get(feature) for feature in SELECTED_FEATURES}
    sample = pd.DataFrame([row])
    prediction = model.predict(sample)[0]
    return str(prediction)
