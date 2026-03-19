from typing import Dict, List

from pydantic import BaseModel, Field


class BehavioralInput(BaseModel):
    sleep_hours: float = Field(..., ge=0, le=24, description="Average daily sleep hours")
    study_hours: float = Field(..., ge=0, le=24, description="Average daily study hours")
    screen_time: float = Field(..., ge=0, le=24, description="Average daily screen time hours")
    stress_level: int = Field(..., ge=1, le=5, description="Self-reported stress level (1-5)")
    mood_level: int = Field(..., ge=1, le=5, description="Self-reported mood level (1-5)")


class RecommendationBundle(BaseModel):
    hobbies: List[str]
    motivational_quotes: List[str]
    books: List[str]
    anime_or_movies: List[str]


class BurnoutPrediction(BaseModel):
    burnout_score: float
    risk_level: str
    abi_components: Dict[str, float]
    recommendations: RecommendationBundle


class CsvPredictionRequest(BaseModel):
    csv_path: str = Field(
        default="data/student_burnout.csv",
        description="Path to CSV with student records. Relative paths are resolved from backend root.",
    )
    limit: int = Field(default=500, ge=1, le=10000)


class CsvPredictionRow(BaseModel):
    row_index: int
    burnout_score: float
    risk_level: str
    abi_components: Dict[str, float]
    derived_inputs: Dict[str, float]


class CsvPredictionResponse(BaseModel):
    rows_processed: int
    summary: Dict[str, float]
    predictions: List[CsvPredictionRow]


class SimulationResponse(BaseModel):
    rows: int
    sample: List[Dict[str, float]]
