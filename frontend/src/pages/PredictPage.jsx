import { useState } from "react";
import BehaviorForm from "../components/BehaviorForm";
import RiskCard from "../components/RiskCard";
import TrendChart from "../components/TrendChart";
import Recommendations from "../components/Recommendations";
import { predictBurnout } from "../services/api";

function PredictPage() {
  const [formData, setFormData] = useState({
    sleep_hours: 7,
    study_hours: 5,
    screen_time: 6,
    stress_level: 3,
    mood_level: 3,
  });
  const [prediction, setPrediction] = useState(null);
  const [trend, setTrend] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: Number(value),
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const result = await predictBurnout(formData);
      setPrediction(result);
      setTrend((prev) => [
        ...prev,
        {
          run: `Run ${prev.length + 1}`,
          burnout_score: result.burnout_score,
        },
      ]);
    } catch (requestError) {
      setError("Prediction failed. Check API server and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1>Student Burnout Prediction</h1>
        <p>
          Enter behavioral data to receive a personalized burnout risk assessment with recommendations
          for stress management.
        </p>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="grid-2">
        <div>
          <div className="card elevated">
            <h3 style={{ marginBottom: "1.5rem" }}>Behavioral Input</h3>
            <BehaviorForm
              values={formData}
              onChange={handleChange}
              onSubmit={handleSubmit}
              isLoading={isLoading}
            />
          </div>
        </div>

        <div>
          <div className="card elevated">
            <h3 style={{ marginBottom: "1.5rem" }}>Risk Assessment Result</h3>
            {prediction ? (
              <RiskCard prediction={prediction} />
            ) : (
              <div style={{ color: "var(--text-muted)", textAlign: "center", padding: "2rem 1rem" }}>
                <p>Submit the form to see your burnout risk assessment.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {trend.length > 0 && (
        <div style={{ marginTop: "2rem" }}>
          <div className="card elevated">
            <h3>Prediction History</h3>
            <TrendChart history={trend} />
          </div>
        </div>
      )}

      {prediction && (
        <div style={{ marginTop: "2rem" }}>
          <div className="card elevated">
            <h3>Personalized Recommendations</h3>
            <Recommendations prediction={prediction} />
          </div>
        </div>
      )}
    </div>
  );
}

export default PredictPage;
