from typing import Dict, Tuple


def _clip_0_100(value: float) -> float:
    return max(0.0, min(100.0, value))


def compute_abi(
    sleep_hours: float,
    study_hours: float,
    screen_time: float,
    stress_level: int,
    mood_level: int,
) -> Tuple[float, Dict[str, float]]:
    sleep_deficit = _clip_0_100(max(0.0, 8.0 - sleep_hours) * 12.5)
    screen_time_score = _clip_0_100((screen_time / 12.0) * 100.0)
    stress_score = _clip_0_100(((stress_level - 1) / 4.0) * 100.0)
    study_overload = _clip_0_100(max(0.0, study_hours - 6.0) * 12.5)

    abi_score = (
        0.35 * sleep_deficit
        + 0.25 * screen_time_score
        + 0.25 * stress_score
        + 0.15 * study_overload
    )
    final_score = _clip_0_100(abi_score)

    components = {
        "sleep_deficit": round(sleep_deficit, 2),
        "screen_time": round(screen_time_score, 2),
        "stress_level": round(stress_score, 2),
        "study_overload": round(study_overload, 2),
    }

    return round(final_score, 2), components


def classify_risk(score: float) -> str:
    if score <= 30:
        return "low"
    if score <= 60:
        return "moderate"
    return "high"
