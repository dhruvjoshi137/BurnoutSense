from typing import Dict

import numpy as np
import pandas as pd

from app.services.abi import classify_risk, compute_abi


RNG = np.random.default_rng(seed=42)


def simulate_dataset(rows: int = 200) -> pd.DataFrame:
    data = pd.DataFrame(
        {
            "sleep_hours": RNG.uniform(3.5, 9.0, size=rows).round(2),
            "study_hours": RNG.uniform(1.0, 12.0, size=rows).round(2),
            "screen_time": RNG.uniform(2.0, 14.0, size=rows).round(2),
            "stress_level": RNG.integers(1, 6, size=rows),
            "mood_level": RNG.integers(1, 6, size=rows),
        }
    )

    scores = []
    risks = []
    for record in data.to_dict(orient="records"):
        score, _ = compute_abi(**record)
        scores.append(score)
        risks.append(classify_risk(score))

    data["burnout_score"] = np.array(scores)
    data["risk_level"] = np.array(risks)
    return data


def summarize_dataset(df: pd.DataFrame) -> Dict[str, float]:
    return {
        "mean_burnout_score": round(float(df["burnout_score"].mean()), 2),
        "high_risk_ratio": round(float((df["risk_level"] == "high").mean()), 3),
        "moderate_risk_ratio": round(float((df["risk_level"] == "moderate").mean()), 3),
        "low_risk_ratio": round(float((df["risk_level"] == "low").mean()), 3),
    }
