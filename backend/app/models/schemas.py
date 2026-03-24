from datetime import date, datetime
from typing import Dict, List, Optional

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
    prediction_source: Optional[str] = None
    model_confidence: Optional[float] = None


class CsvPredictionResponse(BaseModel):
    rows_processed: int
    summary: Dict[str, float]
    predictions: List[CsvPredictionRow]


class SimulationResponse(BaseModel):
    rows: int
    sample: List[Dict[str, float]]


class UserSignupRequest(BaseModel):
    full_name: str = Field(..., min_length=2, max_length=120)
    email: str = Field(..., min_length=5, max_length=255)
    password: str = Field(..., min_length=8, max_length=128)


class UserLoginRequest(BaseModel):
    email: str
    password: str


class UserProfile(BaseModel):
    id: int
    full_name: str
    email: str
    created_at: datetime


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserProfile


class DailyProgressCreateRequest(BehavioralInput):
    entry_date: Optional[date] = None
    notes: Optional[str] = Field(default=None, max_length=1000)


class DailyProgressResponse(BaseModel):
    id: int
    entry_date: date
    sleep_hours: float
    study_hours: float
    screen_time: float
    stress_level: int
    mood_level: int
    notes: Optional[str]
    burnout_score: float
    risk_level: str
    created_at: datetime


class RiskSummaryResponse(BaseModel):
    total_entries: int
    latest_score: Optional[float]
    latest_risk_level: Optional[str]
    avg_last_7_days: Optional[float]
    high_risk_count_last_7_days: int
    improving_trend: bool
