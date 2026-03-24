import { useEffect, useMemo, useState } from "react";
import TrendChart from "../components/TrendChart";
import { getDailyProgress, getRiskSummary, saveDailyProgress } from "../services/api";

const initialForm = {
  sleep_hours: 7,
  study_hours: 5,
  screen_time: 6,
  stress_level: 3,
  mood_level: 3,
  notes: "",
};

function UserPanelPage({ user }) {
  const [form, setForm] = useState(initialForm);
  const [history, setHistory] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const chartData = useMemo(
    () =>
      history.map((item) => ({
        run: item.entry_date,
        burnout_score: item.burnout_score,
      })),
    [history]
  );

  const warning = useMemo(() => {
    if (!history || history.length < 3) {
      return "";
    }

    const recent = history.slice(-3).map((item) => item.burnout_score);
    if (recent[2] > recent[1] && recent[1] > recent[0]) {
      return "Your burnout risk has increased for 3 consecutive entries. Consider reducing load and using support resources this week.";
    }

    return "";
  }, [history]);

  const refreshData = async () => {
    setError("");
    try {
      const [historyRes, summaryRes] = await Promise.all([getDailyProgress(), getRiskSummary()]);
      setHistory(historyRes);
      setSummary(summaryRes);
    } catch (requestError) {
      setError(requestError?.response?.data?.detail || "Could not load your progress data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "notes" ? value : Number(value),
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const saved = await saveDailyProgress(form);
      setSuccess(`Saved entry for ${saved.entry_date}. Score: ${saved.burnout_score} (${saved.risk_level})`);
      await refreshData();
    } catch (requestError) {
      setError(requestError?.response?.data?.detail || "Could not save your progress.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="loading"></div>;
  }

  return (
    <div>
      <div className="page-header">
        <h1>My Burnout Panel</h1>
        <p>
          Welcome, {user.full_name}. Log your daily wellbeing signals and monitor your personal burnout
          risk trajectory.
        </p>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}
      {warning && <div className="alert alert-warning">{warning}</div>}

      <div className="grid-2">
        <div className="card elevated">
          <h3 style={{ marginBottom: "1.25rem" }}>Daily Check-In</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Sleep Hours</label>
              <input type="number" min="0" max="24" step="0.1" name="sleep_hours" value={form.sleep_hours} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label className="form-label">Study Hours</label>
              <input type="number" min="0" max="24" step="0.1" name="study_hours" value={form.study_hours} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label className="form-label">Screen Time</label>
              <input type="number" min="0" max="24" step="0.1" name="screen_time" value={form.screen_time} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label className="form-label">Stress Level (1-5)</label>
              <input type="number" min="1" max="5" step="1" name="stress_level" value={form.stress_level} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label className="form-label">Mood Level (1-5)</label>
              <input type="number" min="1" max="5" step="1" name="mood_level" value={form.mood_level} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label className="form-label">Notes (optional)</label>
              <textarea name="notes" value={form.notes} onChange={handleChange} rows={4} maxLength={1000} />
            </div>

            <button type="submit" className="btn" disabled={saving}>
              {saving ? "Saving..." : "Save Today\'s Entry"}
            </button>
          </form>
        </div>

        <div className="card elevated">
          <h3 style={{ marginBottom: "1.25rem" }}>Personal Summary</h3>
          {summary ? (
            <div className="grid-2">
              <div className="metric-card">
                <div className="metric-label">Total Entries</div>
                <div className="metric-value" style={{ fontSize: "2rem" }}>{summary.total_entries}</div>
              </div>
              <div className="metric-card">
                <div className="metric-label">Latest Risk</div>
                <div className="metric-value" style={{ fontSize: "1.4rem", textTransform: "uppercase" }}>
                  {summary.latest_risk_level || "N/A"}
                </div>
              </div>
              <div className="metric-card">
                <div className="metric-label">Latest Score</div>
                <div className="metric-value" style={{ fontSize: "2rem" }}>{summary.latest_score ?? "N/A"}</div>
              </div>
              <div className="metric-card">
                <div className="metric-label">7-Day Avg</div>
                <div className="metric-value" style={{ fontSize: "2rem" }}>{summary.avg_last_7_days ?? "N/A"}</div>
              </div>
            </div>
          ) : (
            <p style={{ color: "var(--text-secondary)" }}>No summary available yet.</p>
          )}

          {summary?.high_risk_count_last_7_days >= 3 && (
            <div className="alert alert-warning" style={{ marginTop: "1rem" }}>
              High-risk entries are frequent this week. Please consider reaching out to a counselor,
              mentor, or trusted support person.
            </div>
          )}
        </div>
      </div>

      <div style={{ marginTop: "2rem" }}>
        <div className="card elevated">
          <h3>My Burnout Trend</h3>
          <TrendChart history={chartData} />
        </div>
      </div>
    </div>
  );
}

export default UserPanelPage;
