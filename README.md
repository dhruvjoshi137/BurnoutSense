# BurnoutSense 🎓

A research-grade machine learning tool for assessing student burnout risk using the Academic Burnout Index (ABI). Features predictive models, batch analysis, and interactive visualizations.

## Overview

BurnoutSense combines machine learning (Random Forest & Logistic Regression) with a professional web interface to help educators and researchers identify students at risk of burnout. Built for the Student Burnout Research initiative, it provides:

- **Individual Predictions**: Calculate burnout scores and risk levels for individual students
- **Batch Analysis**: Upload CSV files and process hundreds of predictions instantly
- **Model Metrics**: View performance metrics (accuracy, precision, recall, F1) for both models
- **Research Visualizations**: Interactive charts showing stress-CGPA relationships and sleep quality impacts
- **Risk Analytics**: Aggregate burnout distribution analysis with intervention planning
- **Dark Mode**: Professional dark/light theme with persistent user preference
- **CSV/JSON Export**: Download predictions and analytics in multiple formats

## Tech Stack

**Frontend:**
- React 18.3 + Vite 6.4.1
- Axios for API communication
- Recharts for data visualization
- CSS variables for theming

**Backend:**
- FastAPI 0.115.8
- Uvicorn ASGI server
- Pydantic for data validation
- scikit-learn for ML models

**ML Models:**
- Random Forest Classifier (47.26% accuracy, 250 estimators)
- Logistic Regression baseline (34.59% accuracy)

## Prerequisites

Before you begin, ensure you have installed:

- **Python 3.10+** ([download](https://www.python.org/downloads/))
- **Node.js 18+** with npm ([download](https://nodejs.org/))
- **Git** ([download](https://git-scm.com/))

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/dhruvjoshi137/BurnoutSense.git
cd BurnoutSense
```

### 2. Backend Setup

#### Windows (PowerShell)
```powershell
cd backend
python -m venv .venc
.\.venc\Scripts\Activate.ps1
pip install -r requirements.txt
```

#### macOS/Linux (Bash)
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

### 3. Frontend Setup

```bash
cd ../frontend
npm install
```

## Running the Application

### Start the Backend Server

#### Windows (PowerShell)
```powershell
cd backend
.\.venc\Scripts\Activate.ps1
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

#### macOS/Linux (Bash)
```bash
cd backend
source venv/bin/activate
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

**Expected Output:**
```
INFO:     Application startup complete.
INFO:     Uvicorn running on http://0.0.0.0:8000
```

The API will be available at:
- `http://localhost:8000` - Health check
- `http://localhost:8000/api/predict` - Individual predictions (POST)
- `http://localhost:8000/api/metrics` - Model metrics (GET)
- `http://localhost:8000/api/visualizations` - Visualization endpoints (GET)
- `http://localhost:8000/docs` - Interactive API documentation (Swagger UI)

### Start the Frontend Dev Server

Open a **new terminal** in the `frontend` directory:

```bash
cd frontend
npm run dev
```

**Expected Output:**
```
  VITE v6.4.1  ready in 1234 ms

  ➜  Local:   http://localhost:5174/
```

### Access the Application

Open your browser and navigate to:
```
http://localhost:5174
```

## Usage

### Dashboard
View model performance metrics, dataset statistics, and research visualizations comparing stress levels, sleep quality, and financial stress impacts on burnout.

### Predict
Enter student behavioral data to get an individual burnout score and risk classification (Low/Moderate/High) with personalized recommendations.

**Input Fields:**
- Sleep Hours (0-12)
- Study Hours (0-12)
- Screen Time (0-12)
- Stress Level (0-10)
- Mood Level (0-10)

### Batch
Upload a CSV file with student data to process multiple predictions at once. Export results in CSV or JSON format.

**CSV Format:**
```csv
CGPA,Financial_Stress,Semester_Credit_Load,Sleep_Quality,Physical_Activity,Diet_Quality,Social_Support
3.8,2,15,4,3,4,4
3.5,4,18,2,1,3,3
```

### Analytics
View risk distribution across your cohort, interactive burnout breakdowns by demographics, and intervention planning recommendations.

### Dark Mode
Toggle between light and dark themes using the moon icon (🌙) in the navigation bar. Your preference is saved automatically.

## Project Structure

```
burnoutsense/
├── backend/
│   ├── app/
│   │   ├── main.py                 # FastAPI app initialization
│   │   ├── api/
│   │   │   └── routes/
│   │   │       └── predict.py      # Prediction endpoints
│   │   ├── models/
│   │   │   └── schemas.py          # Pydantic models
│   │   ├── services/
│   │   │   ├── abi.py             # Burnout Index calculations
│   │   │   ├── recommendations.py  # Generated recommendations
│   │   │   └── dataset_adapter.py  # CSV data transformation
│   │   └── data/
│   │       └── simulator.py        # Dataset simulation utilities
│   ├── research/
│   │   ├── outputs/
│   │   │   ├── reports/           # evaluation_metrics.json
│   │   │   └── figures/           # PNG visualizations
│   │   └── data/
│   │       └── students_mental_health_survey.csv
│   ├── requirements.txt            # Python dependencies
│   └── .venc/                      # Virtual environment
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx                # Main app layout with navigation
│   │   ├── index.css              # Global styles + dark mode
│   │   ├── pages/
│   │   │   ├── DashboardPage.jsx  # Model metrics & visualizations
│   │   │   ├── PredictPage.jsx    # Individual predictions
│   │   │   ├── CsvUploadPage.jsx  # Batch predictions
│   │   │   ├── AnalyticsPage.jsx  # Risk distribution analytics
│   │   │   └── ResearchPage.jsx   # Project documentation
│   │   ├── components/
│   │   │   └── SampleForm.jsx     # Reusable form component
│   │   └── services/
│   │       └── api.js             # Axios API client
│   ├── package.json               # npm dependencies
│   ├── vite.config.js             # Vite build config
│   └── node_modules/              # Dependencies
│
└── README.md                       # This file
```

## API Endpoints

### POST /api/predict
Get burnout prediction for a single student.

**Request:**
```json
{
  "sleep_hours": 7,
  "study_hours": 5,
  "screen_time": 6,
  "stress_level": 7,
  "mood_level": 6
}
```

**Response:**
```json
{
  "burnout_score": 45.2,
  "risk_level": "moderate",
  "abi_components": {
    "sleep_factor": 0.3,
    "stress_factor": 0.5,
    "mood_factor": 0.4
  },
  "recommendations": [
    "Increase sleep duration by 1-2 hours",
    "Try relaxation techniques"
  ]
}
```

### GET /api/metrics
Retrieve model performance metrics.

**Response:**
```json
{
  "random_forest": {
    "accuracy": 0.4726,
    "precision": 0.52,
    "recall": 0.47,
    "f1_score": 0.49,
    "confusion_matrix": [...]
  },
  "logistic_regression": {
    "accuracy": 0.3459,
    ...
  },
  "best_model": "random_forest"
}
```

### GET /api/visualizations
Get paths to model visualization images.

**Response:**
```json
{
  "stress_vs_cgpa": "/api/visualizations/stress_vs_cgpa.png",
  "sleep_quality_vs_burnout": "/api/visualizations/sleep_quality_vs_burnout.png",
  "financial_stress_vs_burnout": "/api/visualizations/financial_stress_vs_burnout.png"
}
```

### GET /api/visualizations/{filename}
Serve PNG visualization files.

### POST /api/predict-csv
Process batch predictions from a CSV file.

**Request:**
```json
{
  "csv_path": "data/students.csv",
  "limit": 100
}
```

**Response:**
```json
{
  "rows_processed": 100,
  "summary": {
    "mean_burnout_score": 48.5,
    "high_risk_ratio": 0.56,
    "moderate_risk_ratio": 0.34,
    "low_risk_ratio": 0.10
  },
  "predictions": [...]
}
```

## Troubleshooting

### Images Not Loading
If visualizations don't appear on the Dashboard:
1. Ensure the backend is running (`http://localhost:8000` returns 200)
2. Check that PNG files exist in `backend/research/outputs/figures/`
3. Refresh the browser and check browser console for errors

### Port Already in Use
If you get "Address already in use" error:

**Windows:**
```powershell
netstat -ano | findstr ":8000"
taskkill /PID <PID> /F
```

**macOS/Linux:**
```bash
lsof -i :8000
kill -9 <PID>
```

### Module Not Found Errors
Ensure you're in the correct virtual environment:

**Windows:**
```powershell
.\.venc\Scripts\Activate.ps1
```

**macOS/Linux:**
```bash
source venv/bin/activate
```

### CORS Issues
If frontend can't reach backend, verify:
- Backend is running on `http://localhost:8000`
- Frontend is running on `http://localhost:5174`
- CORS middleware is enabled in `app/main.py` (it is by default)

## Deployment

### Building for Production

**Frontend:**
```bash
cd frontend
npm run build
# Creates optimized dist/ folder
```

**Backend:**
```bash
# Update uvicorn command (remove --reload)
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000
```

### Docker (Optional)
Add Dockerfile and docker-compose.yml for containerized deployment.

## Development

### Adding New Predictions Features
1. Update `PredictPage.jsx` or `CsvUploadPage.jsx` for UI
2. Modify `app/services/abi.py` for burnout calculations
3. Update `app/models/schemas.py` for request/response models
4. Test via `/api/docs` or the frontend

### Creating New Analytics
1. Add chart in `AnalyticsPage.jsx` using Recharts
2. Calculate aggregated data from backend responses
3. Ensure dark mode compatibility (use CSS variables)

### Styling
- Global styles: `frontend/src/index.css`
- Dark mode: `:root[data-theme="dark"]` variables
- All colors use CSS custom properties for theme support

## Dataset

The project uses `students_mental_health_survey.csv` with 1,405 student records and 20 features. Key features used for predictions:
- CGPA (Cumulative Grade Point Average)
- Financial Stress Level
- Sleep Quality
- Physical Activity
- Diet Quality
- Social Support
- Semester Credit Load

## Model Performance

**Random Forest Classifier (Best Model)**
- Accuracy: 47.26%
- Precision: 52%
- Recall: 47%
- F1 Score: 49%

**Logistic Regression (Baseline)**
- Accuracy: 34.59%
- Precision: 38%
- Recall: 35%
- F1 Score: 36%

*Note: Class imbalance in the dataset (56% high burnout) explains lower recall. Model uses balanced class weights.*

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is part of academic research. See LICENSE file for details.

## Contact

For questions or support:
- Email: drv.sharmaxv@gmail.com
- GitHub Issues: [BurnoutSense Issues](https://github.com/dhruvjoshi137/BurnoutSense/issues)

## Acknowledgments

- Built with React, FastAPI, and scikit-learn
- Research dataset: Student Mental Health Survey
- Icons and design inspiration from modern web frameworks

---

**Last Updated:** March 2026  
**Status:** Production Ready ✅
