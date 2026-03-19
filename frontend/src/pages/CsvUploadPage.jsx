import { useState, useRef } from "react";
import axios from "axios";

function CsvUploadPage() {
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);

  const handleFileSelect = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile && selectedFile.name.endsWith(".csv")) {
      setFile(selectedFile);
      setError("");
    } else {
      setError("Please select a valid CSV file");
      setFile(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a CSV file first");
      return;
    }

    setIsLoading(true);
    setError("");
    setResults(null);

    try {
      // Call the predict-csv endpoint with the file path
      // For now, we'll use a default path if the endpoint expects it
      // In production, you might want to upload the file to the backend first
      const response = await axios.post("http://localhost:8000/api/predict-csv", {
        csv_path: "data/students_mental_health_survey.csv",
        limit: 100,
      });

      setResults(response.data);
    } catch (err) {
      console.error("Error uploading file:", err);
      setError(err.response?.data?.detail || "Failed to process CSV file. Check backend API.");
    } finally {
      setIsLoading(false);
    }
  };

  const downloadResults = (format) => {
    if (!results) return;

    if (format === "csv") {
      // Generate CSV from results
      let csv = "Row Index,Burnout Score,Risk Level,Sleep Hours,Study Hours,Screen Time,Stress Level,Mood Level\n";
      results.predictions.forEach((pred) => {
        csv += `${pred.row_index},${pred.burnout_score},${pred.risk_level},${pred.derived_inputs.sleep_hours},${pred.derived_inputs.study_hours},${pred.derived_inputs.screen_time},${pred.derived_inputs.stress_level},${pred.derived_inputs.mood_level}\n`;
      });

      const blob = new Blob([csv], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "burnout_predictions.csv";
      a.click();
      window.URL.revokeObjectURL(url);
    } else if (format === "json") {
      // Download results as JSON
      const json = JSON.stringify(results, null, 2);
      const blob = new Blob([json], { type: "application/json" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "burnout_predictions.json";
      a.click();
      window.URL.revokeObjectURL(url);
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1>Batch Prediction from CSV</h1>
        <p>Upload a CSV file with student data to perform batch burnout predictions and analyze cohort-level patterns.</p>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="card elevated" style={{ marginBottom: "2rem" }}>
        <h3>Upload CSV File</h3>
        <p style={{ color: "var(--text-secondary)", marginTop: "-0.5rem", marginBottom: "1.5rem" }}>
          File should contain columns: CGPA, Financial_Stress, Semester_Credit_Load, Sleep_Quality, Physical_Activity, Diet_Quality, Social_Support
        </p>

        <div
          style={{
            border: "2px dashed var(--border)",
            borderRadius: "8px",
            padding: "2rem",
            textAlign: "center",
            cursor: "pointer",
            transition: "all 0.2s ease",
            background: file ? "var(--success-bg)" : "var(--surface-alt)",
          }}
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            e.currentTarget.style.background = "var(--accent)";
            e.currentTarget.style.color = "white";
          }}
          onDragLeave={(e) => {
            e.currentTarget.style.background = file ? "var(--success-bg)" : "var(--surface-alt)";
            e.currentTarget.style.color = "inherit";
          }}
          onDrop={(e) => {
            e.preventDefault();
            const droppedFile = e.dataTransfer.files[0];
            if (droppedFile && droppedFile.name.endsWith(".csv")) {
              setFile(droppedFile);
              setError("");
            }
          }}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            onChange={handleFileSelect}
            style={{ display: "none" }}
          />
          {file ? (
            <>
              <p style={{ fontSize: "1.1rem", fontWeight: "600", marginBottom: "0.5rem" }}>✅ {file.name}</p>
              <p style={{ color: "var(--text-secondary)", margin: "0" }}>Ready to upload</p>
            </>
          ) : (
            <>
              <p style={{ fontSize: "1.1rem", fontWeight: "600", marginBottom: "0.5rem" }}>📁 Drag & drop your CSV here</p>
              <p style={{ color: "var(--text-secondary)", margin: "0" }}>or click to select a file</p>
            </>
          )}
        </div>

        <div style={{ marginTop: "1.5rem", display: "flex", gap: "0.75rem" }}>
          <button className="btn" onClick={handleUpload} disabled={!file || isLoading}>
            {isLoading ? "Processing..." : "Analyze Dataset"}
          </button>
          {file && (
            <button
              className="btn btn-secondary"
              onClick={() => {
                setFile(null);
                if (fileInputRef.current) fileInputRef.current.value = "";
              }}
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Demo Mode Notice */}
      <div className="alert alert-info">
        <strong>Demo Mode:</strong> Currently configured to analyze the default students_mental_health_survey.csv dataset. 
        To upload custom files, enable file upload backend support.
      </div>

      {/* Results Section */}
      {results && (
        <div>
          <div className="section-title">Batch Prediction Results</div>

          {/* Summary Stats */}
          <div className="card elevated">
            <h3>Summary Statistics</h3>
            <div className="grid-4">
              <div className="metric-card">
                <div className="metric-label">Processed</div>
                <div className="metric-value">{results.rows_processed}</div>
              </div>
              <div className="metric-card">
                <div className="metric-label">Avg Score</div>
                <div className="metric-value">{results.summary.mean_burnout_score.toFixed(1)}</div>
              </div>
              <div className="metric-card">
                <div className="metric-label">High Risk</div>
                <div className="metric-value" style={{ color: "var(--error)" }}>
                  {(results.summary.high_risk_ratio * 100).toFixed(1)}%
                </div>
              </div>
              <div className="metric-card">
                <div className="metric-label">Moderate Risk</div>
                <div className="metric-value" style={{ color: "var(--warning)" }}>
                  {(results.summary.moderate_risk_ratio * 100).toFixed(1)}%
                </div>
              </div>
            </div>
          </div>

          {/* Risk Distribution Breakdown */}
          <div className="card elevated" style={{ marginTop: "1.5rem" }}>
            <h3>Risk Distribution</h3>
            <table className="comparison-table">
              <thead>
                <tr>
                  <th>Risk Level</th>
                  <th>Count</th>
                  <th>Percentage</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>High</strong></td>
                  <td>{Math.round(results.summary.high_risk_ratio * results.rows_processed)}</td>
                  <td>{(results.summary.high_risk_ratio * 100).toFixed(1)}%</td>
                  <td><span className="badge badge-error">Needs Intervention</span></td>
                </tr>
                <tr>
                  <td><strong>Moderate</strong></td>
                  <td>{Math.round(results.summary.moderate_risk_ratio * results.rows_processed)}</td>
                  <td>{(results.summary.moderate_risk_ratio * 100).toFixed(1)}%</td>
                  <td><span className="badge badge-warning">Monitor</span></td>
                </tr>
                <tr>
                  <td><strong>Low</strong></td>
                  <td>{Math.round(results.summary.low_risk_ratio * results.rows_processed)}</td>
                  <td>{(results.summary.low_risk_ratio * 100).toFixed(1)}%</td>
                  <td><span className="badge badge-success">Healthy</span></td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Sample Predictions */}
          <div className="card elevated" style={{ marginTop: "1.5rem" }}>
            <h3>Sample Predictions (First 10)</h3>
            <table className="comparison-table">
              <thead>
                <tr>
                  <th>Row</th>
                  <th>Score</th>
                  <th>Risk</th>
                  <th>Sleep Hours</th>
                  <th>Study Hours</th>
                  <th>Stress Level</th>
                </tr>
              </thead>
              <tbody>
                {results.predictions.slice(0, 10).map((pred, idx) => (
                  <tr key={idx}>
                    <td>{pred.row_index}</td>
                    <td><strong>{pred.burnout_score}</strong></td>
                    <td>
                      <span className={`badge ${
                        pred.risk_level === "high" ? "badge-error" : 
                        pred.risk_level === "moderate" ? "badge-warning" : 
                        "badge-success"
                      }`}>
                        {pred.risk_level.charAt(0).toUpperCase() + pred.risk_level.slice(1)}
                      </span>
                    </td>
                    <td>{pred.derived_inputs.sleep_hours.toFixed(1)}</td>
                    <td>{pred.derived_inputs.study_hours.toFixed(1)}</td>
                    <td>{pred.derived_inputs.stress_level.toFixed(1)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Export Options */}
          <div className="card elevated" style={{ marginTop: "1.5rem" }}>
            <h3>Export Results</h3>
            <p style={{ color: "var(--text-secondary)" }}>Download predictions in your preferred format</p>
            <div style={{ display: "flex", gap: "0.75rem", marginTop: "1rem" }}>
              <button className="btn" onClick={() => downloadResults("csv")}>
                📥 Download CSV
              </button>
              <button className="btn" onClick={() => downloadResults("json")}>
                📥 Download JSON
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CsvUploadPage;
