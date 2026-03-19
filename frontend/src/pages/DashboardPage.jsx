import { useState, useEffect } from "react";
import axios from "axios";

function DashboardPage() {
  const [metrics, setMetrics] = useState(null);
  const [visualizations, setVisualizations] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch metrics from backend
        const metricsRes = await axios.get("http://localhost:8000/api/metrics");
        const vizsRes = await axios.get("http://localhost:8000/api/visualizations");
        
        setMetrics(metricsRes.data);
        // Convert relative paths to full URLs for image loading
        setVisualizations({
          stress_vs_cgpa: `http://localhost:8000${vizsRes.data.stress_vs_cgpa}`,
          sleep_quality_vs_burnout: `http://localhost:8000${vizsRes.data.sleep_quality_vs_burnout}`,
          financial_stress_vs_burnout: `http://localhost:8000${vizsRes.data.financial_stress_vs_burnout}`,
        });
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Could not fetch live metrics. Check if backend is running.");
        
        // Fallback to mock data for demo purposes
        setMetrics({
          randomForest: {
            accuracy: 0.4726,
            precision: 0.52,
            recall: 0.47,
            f1: 0.49,
            estimators: 250,
          },
          logisticRegression: {
            accuracy: 0.3459,
            precision: 0.38,
            recall: 0.35,
            f1: 0.36,
            maxIter: 500,
          },
          dataset: {
            totalSamples: 1405,
            trainSamples: 1123,
            testSamples: 282,
            features: 7,
          },
          classDistribution: {
            high: 788,
            moderate: 477,
            low: 140,
          },
        });
        setVisualizations({
          stress_vs_cgpa: "http://localhost:8000/api/visualizations/stress_vs_cgpa.png",
          sleep_quality_vs_burnout: "http://localhost:8000/api/visualizations/sleep_quality_vs_burnout.png",
          financial_stress_vs_burnout: "http://localhost:8000/api/visualizations/financial_stress_vs_burnout.png",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="loading"></div>;
  }

  return (
    <div>
      <div className="page-header">
        <h1>Model Performance Dashboard</h1>
        <p>Comparison of machine learning models trained on the student mental health dataset.</p>
      </div>

      {error && <div className="alert alert-warning">{error}</div>}
      <div className="section-title">Model Metrics Comparison</div>
      <div className="grid-2">
        <div className="card elevated">
          <h3>Random Forest Classifier</h3>
          <p style={{ color: "var(--text-secondary)", marginTop: "-0.5rem" }}>
            Best performing model (250 estimators)
          </p>
          <div className="divider"></div>

          <div className="grid-2">
            <div className="metric-card">
              <div className="metric-label">Accuracy</div>
              <div className="metric-value">47.26%</div>
            </div>
            <div className="metric-card">
              <div className="metric-label">Precision</div>
              <div className="metric-value">52%</div>
            </div>
            <div className="metric-card">
              <div className="metric-label">Recall</div>
              <div className="metric-value">47%</div>
            </div>
            <div className="metric-card">
              <div className="metric-label">F1 Score</div>
              <div className="metric-value">49%</div>
            </div>
          </div>

          <div style={{ marginTop: "1.5rem" }}>
            <span className="badge badge-success">Selected as Best Model</span>
          </div>
        </div>

        <div className="card elevated">
          <h3>Logistic Regression</h3>
          <p style={{ color: "var(--text-secondary)", marginTop: "-0.5rem" }}>
            Baseline linear model (max_iter=500)
          </p>
          <div className="divider"></div>

          <div className="grid-2">
            <div className="metric-card">
              <div className="metric-label">Accuracy</div>
              <div className="metric-value">34.59%</div>
            </div>
            <div className="metric-card">
              <div className="metric-label">Precision</div>
              <div className="metric-value">38%</div>
            </div>
            <div className="metric-card">
              <div className="metric-label">Recall</div>
              <div className="metric-value">35%</div>
            </div>
            <div className="metric-card">
              <div className="metric-label">F1 Score</div>
              <div className="metric-value">36%</div>
            </div>
          </div>

          <div style={{ marginTop: "1.5rem" }}>
            <span className="badge badge-info">Baseline Comparison</span>
          </div>
        </div>
      </div>

      {/* Dataset Overview */}
      <div className="section-title" style={{ marginTop: "2rem" }}>
        Dataset Overview
      </div>
      <div className="card">
        <div className="grid-4">
          <div className="metric-card">
            <div className="metric-label">Total Samples</div>
            <div className="metric-value">1,405</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Training Samples</div>
            <div className="metric-value">1,123</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Test Samples</div>
            <div className="metric-value">282</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Features</div>
            <div className="metric-value">7</div>
          </div>
        </div>

        <div className="divider" style={{ marginTop: "2rem" }}></div>

        <h3 style={{ marginTop: "1.5rem" }}>Class Distribution</h3>
        <table className="comparison-table">
          <thead>
            <tr>
              <th>Burnout Level</th>
              <th>Count</th>
              <th>Percentage</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <span className="badge badge-error">High</span>
              </td>
              <td>788</td>
              <td>56.1%</td>
            </tr>
            <tr>
              <td>
                <span className="badge badge-warning">Moderate</span>
              </td>
              <td>477</td>
              <td>33.9%</td>
            </tr>
            <tr>
              <td>
                <span className="badge badge-success">Low</span>
              </td>
              <td>140</td>
              <td>10.0%</td>
            </tr>
          </tbody>
        </table>

        <div className="alert alert-info" style={{ marginTop: "1.5rem" }}>
          <strong>Note:</strong> Class imbalance (high representation of "High" burnout) explains why
          recall is lower than precision. The Random Forest model has been trained with balanced class
          weights to mitigate this issue.
        </div>
      </div>

      {/* Selected Features */}
      <div className="section-title" style={{ marginTop: "2rem" }}>
        Selected Features
      </div>
      <div className="card">
        <table className="comparison-table">
          <thead>
            <tr>
              <th>Feature</th>
              <th>Type</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>CGPA</strong></td>
              <td>Numeric</td>
              <td>Cumulative Grade Point Average</td>
            </tr>
            <tr>
              <td><strong>Financial_Stress</strong></td>
              <td>Numeric</td>
              <td>Level of financial stress (0-5 scale)</td>
            </tr>
            <tr>
              <td><strong>Semester_Credit_Load</strong></td>
              <td>Numeric</td>
              <td>Course load per semester</td>
            </tr>
            <tr>
              <td><strong>Sleep_Quality</strong></td>
              <td>Numeric</td>
              <td>Sleep quality rating (0-5 scale)</td>
            </tr>
            <tr>
              <td><strong>Physical_Activity</strong></td>
              <td>Numeric</td>
              <td>Weekly physical activity (hours)</td>
            </tr>
            <tr>
              <td><strong>Diet_Quality</strong></td>
              <td>Numeric</td>
              <td>Diet quality rating (0-5 scale)</td>
            </tr>
            <tr>
              <td><strong>Social_Support</strong></td>
              <td>Numeric</td>
              <td>Social support level (0-5 scale)</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Model Visualizations */}
      {visualizations && (
        <div>
          <div className="section-title" style={{ marginTop: "2rem" }}>
            Model Visualizations
          </div>
          <div className="grid-2">
            {visualizations.stress_vs_cgpa && (
              <div className="card elevated">
                <h3>Stress vs. CGPA</h3>
                <img
                  src={visualizations.stress_vs_cgpa}
                  alt="Stress vs CGPA"
                  style={{ width: "100%", borderRadius: "8px", marginTop: "1rem" }}
                />
                <p style={{ marginTop: "1rem", color: "var(--text-secondary)", fontSize: "0.9rem" }}>
                  Shows the inverse relationship between stress levels and academic performance (CGPA).
                </p>
              </div>
            )}
            {visualizations.sleep_quality_vs_burnout && (
              <div className="card elevated">
                <h3>Sleep Quality vs. Burnout</h3>
                <img
                  src={visualizations.sleep_quality_vs_burnout}
                  alt="Sleep Quality vs Burnout"
                  style={{ width: "100%", borderRadius: "8px", marginTop: "1rem" }}
                />
                <p style={{ marginTop: "1rem", color: "var(--text-secondary)", fontSize: "0.9rem" }}>
                  Demonstrates the protective effect of quality sleep against burnout risk.
                </p>
              </div>
            )}
          </div>
          {visualizations.financial_stress_vs_burnout && (
            <div className="card elevated" style={{ marginTop: "1.5rem" }}>
              <h3>Financial Stress vs. Burnout</h3>
              <div style={{ display: "flex", justifyContent: "center" }}>
                <img
                  src={visualizations.financial_stress_vs_burnout}
                  alt="Financial Stress vs Burnout"
                  style={{ maxWidth: "600px", width: "100%", borderRadius: "8px", marginTop: "1rem" }}
                />
              </div>
              <p style={{ marginTop: "1rem", color: "var(--text-secondary)", fontSize: "0.9rem", textAlign: "center" }}>
                Illustrates the positive correlation between financial stress and burnout risk.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default DashboardPage;
