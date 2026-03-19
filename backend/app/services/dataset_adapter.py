from typing import Dict


def _clip(value: float, lower: float, upper: float) -> float:
    return max(lower, min(upper, value))


def _to_float(value, default: float = 0.0) -> float:
    if value is None:
        return default
    if isinstance(value, str) and value.strip() == "":
        return default
    try:
        return float(value)
    except (TypeError, ValueError):
        return default


def _to_str(value, default: str = "") -> str:
    if value is None:
        return default
    return str(value).strip()


def _normalize_stress_level(raw_stress: float) -> int:
    # Dataset uses either 0-4 or 1-5; normalize to 1-5 expected by ABI.
    if raw_stress <= 4:
        raw_stress += 1
    return int(_clip(round(raw_stress), 1, 5))


def _sleep_quality_to_hours(sleep_quality: str) -> float:
    mapping = {
        "good": 7.5,
        "average": 6.0,
        "poor": 4.5,
        "very poor": 3.5,
        "excellent": 8.0,
    }
    return mapping.get(sleep_quality.lower(), 6.0)


def _semester_credits_to_study_hours(credits: float) -> float:
    # Rough daily estimate: weekly credits scaled to average daily study load.
    return _clip(credits / 3.0, 0.0, 16.0)


def _estimate_screen_time(row: Dict[str, object]) -> float:
    anxiety = _to_float(row.get("Anxiety_Score"), default=0.0)
    depression = _to_float(row.get("Depression_Score"), default=0.0)
    physical_activity = _to_str(row.get("Physical_Activity"), default="moderate").lower()
    substance_use = _to_str(row.get("Substance_Use"), default="never").lower()

    screen_time = 4.0 + 1.2 * anxiety + 1.2 * depression

    if physical_activity == "low":
        screen_time += 1.0
    elif physical_activity == "high":
        screen_time -= 0.5

    if substance_use in {"frequently", "regularly"}:
        screen_time += 0.8
    elif substance_use in {"occasionally", "sometimes"}:
        screen_time += 0.3

    return _clip(screen_time, 0.0, 14.0)


def _estimate_mood_level(row: Dict[str, object]) -> int:
    depression = _to_float(row.get("Depression_Score"), default=2.0)
    anxiety = _to_float(row.get("Anxiety_Score"), default=2.0)
    inverse_burden = 5.0 - round((depression + anxiety) / 2.0)
    return int(_clip(inverse_burden, 1, 5))


def row_to_abi_inputs(row: Dict[str, object]) -> Dict[str, float]:
    stress_raw = _to_float(row.get("Stress_Level"), default=2.0)
    sleep_quality = _to_str(row.get("Sleep_Quality"), default="average")
    credit_load = _to_float(row.get("Semester_Credit_Load"), default=18.0)

    derived = {
        "sleep_hours": round(_sleep_quality_to_hours(sleep_quality), 2),
        "study_hours": round(_semester_credits_to_study_hours(credit_load), 2),
        "screen_time": round(_estimate_screen_time(row), 2),
        "stress_level": float(_normalize_stress_level(stress_raw)),
        "mood_level": float(_estimate_mood_level(row)),
    }

    return derived
