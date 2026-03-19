from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parents[3]
BACKEND_ROOT = Path(__file__).resolve().parents[2]

DEFAULT_DATASET_PATH = BACKEND_ROOT / "data" / "student_burnout.csv"
FALLBACK_DATASET_PATHS = [
    BACKEND_ROOT / "data" / "students_mental_health_survey.csv",
]
OUTPUT_ROOT = BACKEND_ROOT / "research" / "outputs"
FIGURES_DIR = OUTPUT_ROOT / "figures"
MODELS_DIR = OUTPUT_ROOT / "models"
REPORTS_DIR = OUTPUT_ROOT / "reports"

SELECTED_FEATURES = [
    "CGPA",
    "Financial_Stress",
    "Semester_Credit_Load",
    "Sleep_Quality",
    "Physical_Activity",
    "Diet_Quality",
    "Social_Support",
]

NUMERIC_FEATURES = [
    "CGPA",
    "Financial_Stress",
    "Semester_Credit_Load",
]

CATEGORICAL_FEATURES = [
    "Sleep_Quality",
    "Physical_Activity",
    "Diet_Quality",
    "Social_Support",
]
