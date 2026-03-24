# BurnoutSense User Authentication & Daily Progress Tracking

## What's New

You now have a complete user account system with daily burnout tracking and personalized risk monitoring.

### New Features

1. **User Authentication**
   - Sign up with email and password
   - Secure login with JWT tokens
   - Token persists in localStorage for seamless sessions

2. **Daily Check-In Panel**
   - Log daily behavioral signals: sleep, study time, screen time, stress, mood
   - Optional notes for context
   - Automatic burnout score calculation using ABI (Academic Burnout Index)
   - Same prediction engine as the Predict page, but now stored historically

3. **Personal Burnout Trend**
   - View your burnout score history over time
   - See how your risk level changes day-to-day
   - Track improvements and identify patterns

4. **Risk Summary Dashboard**
   - **Latest Score & Risk Level**: Today's burnout assessment at a glance
   - **Total Entries**: How many days you've logged
   - **7-Day Average**: Your burnout trend over the past week
   - **High-Risk Alert**: If 3+ entries in last 7 days were "high risk," you'll see a support message

5. **Early Warning System**
   - If your burnout score increases for 3 consecutive days, an alert warns you to reduce load
   - If you have 3+ high-risk entries in the last 7 days, escalation guidance is shown with support resources

## Getting Started

### 1. Open the App
- Frontend: **http://localhost:5173**
- Backend API: **http://localhost:8000/docs** (interactive Swagger UI)

### 2. Create Your Account
- Click **"Login / Signup"** in the navbar
- Choose **Sign Up**
- Enter: full name, email, password (min 8 characters)
- Click **Create Account**

### 3. Log Your First Entry
- You're auto-logged in after signup
- The **My Panel** tab opens with a daily check-in form
- Enter your behavioral data:
  - Sleep Hours: 0–24 (decimal, e.g., 7.5)
  - Study Hours: 0–24
  - Screen Time: 0–24
  - Stress Level: 1–5 (1 = low, 5 = high)
  - Mood Level: 1–5 (1 = low/sad, 5 = high/happy)
  - Notes: Optional reflection (up to 1000 chars)
- Click **Save Today's Entry**

### 4. View Your Trend

After 2+ entries, your trend chart shows burnout score over time. The summary cards display:
- **Latest Risk**: Your current risk classification (Low, Moderate, High)
- **7-Day Avg**: Average burnout score for the past 7 days
- **High-Risk Count**: How many times you've been at high risk recently

## API Endpoints

All endpoints require the `Authorization: Bearer <token>` header (auto-added by the frontend).

### Authentication
- `POST /api/auth/signup` - Create new account
- `POST /api/auth/login` - Login with email/password
- `GET /api/auth/me` - Get current user profile

### Daily Progress
- `POST /api/progress` - Create or update today's entry
- `GET /api/progress` - List all entries (optional: `from_date`, `to_date` query params)
- `GET /api/progress/latest` - Get most recent entry
- `GET /api/progress/summary` - Get risk summary (total entries, latest score, 7-day avg, trend)

### Example: Create Daily Entry
```bash
curl -X POST http://localhost:8000/api/progress \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "sleep_hours": 7.5,
    "study_hours": 5,
    "screen_time": 6,
    "stress_level": 3,
    "mood_level": 4,
    "notes": "Felt good today, got enough rest"
  }'
```

## Data Storage

- **Database**: SQLite (`burnoutsense.db` in the backend root)
  - Auto-created tables: `users`, `daily_progress`
  - Passwords are bcrypt hashed
  - One entry per user per day (updates if you log twice)

- **Frontend**: JWT token stored in `localStorage` for persistence across page reloads

## Logout & Session

- Click **Logout** button in navbar to clear token and sign out
- Token expires after 60 minutes of inactivity (configurable via `ACCESS_TOKEN_EXPIRE_MINUTES` env var)
- You can auto-login by keeping the tab open; token refreshes on each successful API call

## Security Notes

- Passwords are never stored in plain text (bcrypt with salt)
- JWT tokens are signed and verified server-side
- Tokens are stored in localStorage (accessible via JS, so keep HTTPS in production)
- Use `SECRET_KEY` environment variable in production (defaults to dev key for testing)

## Future Enhancements

Potential integrations:
- **Intervention Tracking**: Mark which recommendations you followed and rate effectiveness
- **Journaling**: Optional daily reflections with sentiment analysis
- **Notifications**: Push alerts if risk rises or escalation conditions met
- **Export**: Download your data as CSV or PDF report
- **Goal Setting**: Personal wellness goals tied to burnout reduction

## Troubleshooting

**"Invalid email or password"**
- Double-check email spelling (case-insensitive)
- Ensure password is correct (min 8 chars)

**"Email already registered"**
- You've already signed up with that email
- Use Login instead, or sign up with a different email

**"Could not save your progress"**
- Check the browser console for error details
- Ensure backend API is running
- Token may have expired; try logging out and back in

**Charts not showing**
- You need at least 2 entries to see trends
- Continue logging daily checks

## Running Servers

### Backend (FastAPI on port 8000)
```bash
cd backend
.\.venc\Scripts\Activate.ps1  # or source venv/bin/activate on macOS/Linux
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Frontend (Vite on port 5173)
```bash
cd frontend
npm run dev
```

Open browser: **http://localhost:5173**
