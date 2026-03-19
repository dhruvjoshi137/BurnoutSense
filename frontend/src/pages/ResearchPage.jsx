import { useState } from "react";

function ResearchPage() {
  const [expandedSection, setExpandedSection] = useState("methodology");

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  return (
    <div>
      <div className="page-header">
        <h1>Research Documentation</h1>
        <p>
          Comprehensive overview of the BurnoutSense machine learning pipeline, methodology, and
          results.
        </p>
      </div>

      {/* Executive Summary */}
      <div className="card elevated">
        <h2>Executive Summary</h2>
        <p>
          BurnoutSense is a machine learning research prototype designed to predict academic burnout
          risk in students using behavioral and demographic data. The system employs two complementary
          approaches:
        </p>
        <ul>
          <li>
            <strong>Academic Burnout Index (ABI):</strong> A heuristic weighted formula combining
            sleep deficit, screen time, stress level, and study overload
          </li>
          <li>
            <strong>Random Forest Classifier:</strong> A machine learning model trained on 1,123
            samples with 7 selected features achieving 47.26% accuracy
          </li>
        </ul>
        <div className="alert alert-info">
          <strong>Research Goal:</strong> Identify students at high risk of academic burnout to enable
          early intervention and mental health support.
        </div>
      </div>

      {/* Expandable Sections */}
      <div style={{ marginTop: "2rem" }}>
        {/* Methodology */}
        <div className="card">
          <button
            onClick={() => toggleSection("methodology")}
            style={{
              background: "none",
              border: "none",
              width: "100%",
              textAlign: "left",
              padding: "0",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <h3 style={{ margin: "0" }}>Research Methodology</h3>
            <span style={{ fontSize: "1.5rem" }}>{expandedSection === "methodology" ? "−" : "+"}</span>
          </button>

          {expandedSection === "methodology" && (
            <div style={{ marginTop: "1.5rem", paddingTop: "1.5rem", borderTop: "1px solid var(--border)" }}>
              <h4>Data Preparation</h4>
              <p>
                The study utilized the "Students' Mental Health Impacts and Technology Impacts Survey"
                dataset containing 1,405 student records. Features were selected based on their
                relevance to burnout indicators:
              </p>

              <ul>
                <li><strong>Financial_Stress:</strong> Correlation with emotional exhaustion</li>
                <li><strong>Sleep_Quality:</strong> Critical indicator of physical and mental fatigue</li>
                <li><strong>Semester_Credit_Load:</strong> Measure of academic workload</li>
                <li><strong>Physical_Activity:</strong> Protective factor against burnout</li>
                <li><strong>Diet_Quality:</strong> Lifestyle indicator</li>
                <li><strong>Social_Support:</strong> Protective psychosocial factor</li>
                <li><strong>CGPA:</strong> Academic performance indicator</li>
              </ul>

              <h4>Target Variable Engineering</h4>
              <p>
                Burnout levels were derived from psychological assessments using the sum of:
              </p>
              <ul>
                <li>Stress_Level (0-5 scale)</li>
                <li>Depression_Score (0-5 scale)</li>
                <li>Anxiety_Score (0-5 scale)</li>
              </ul>
              <p>Total range: 0-10 mapped to three classes:</p>
              <ul>
                <li><strong>Low:</strong> 0-3 (n=140, 10.0%)</li>
                <li><strong>Moderate:</strong> 4-6 (n=477, 33.9%)</li>
                <li><strong>High:</strong> 7-10 (n=788, 56.1%)</li>
              </ul>

              <h4>Model Architecture</h4>
              <p>Two parallel models were trained and compared:</p>

              <div style={{ marginTop: "1rem", marginBottom: "1rem" }}>
                <div className="badge badge-success">Random Forest</div>
                <p style={{ marginTop: "0.5rem" }}>
                  250 decision trees with balanced class weights to address class imbalance. Preprocessor
                  included SimpleImputer and StandardScaler for numerical features.
                </p>
              </div>

              <div>
                <div className="badge badge-info">Logistic Regression</div>
                <p style={{ marginTop: "0.5rem" }}>
                  Linear baseline model with one-hot encoding for categorical features. Max iterations
                  set to 500.
                </p>
              </div>

              <h4>Validation Strategy</h4>
              <ul>
                <li>80-20 train-test split (1,123 training / 282 test samples)</li>
                <li>Stratified split to maintain class distribution</li>
                <li>Evaluation metrics: Accuracy, Precision, Recall, F1-score</li>
              </ul>
            </div>
          )}
        </div>

        {/* Results */}
        <div className="card" style={{ marginTop: "1.5rem" }}>
          <button
            onClick={() => toggleSection("results")}
            style={{
              background: "none",
              border: "none",
              width: "100%",
              textAlign: "left",
              padding: "0",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <h3 style={{ margin: "0" }}>Results & Performance</h3>
            <span style={{ fontSize: "1.5rem" }}>{expandedSection === "results" ? "−" : "+"}</span>
          </button>

          {expandedSection === "results" && (
            <div style={{ marginTop: "1.5rem", paddingTop: "1.5rem", borderTop: "1px solid var(--border)" }}>
              <h4>Model Performance Comparison</h4>

              <table className="comparison-table">
                <thead>
                  <tr>
                    <th>Metric</th>
                    <th>Random Forest</th>
                    <th>Logistic Regression</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>Accuracy</strong></td>
                    <td>47.26%</td>
                    <td>34.59%</td>
                  </tr>
                  <tr>
                    <td><strong>Precision</strong></td>
                    <td>52%</td>
                    <td>38%</td>
                  </tr>
                  <tr>
                    <td><strong>Recall</strong></td>
                    <td>47%</td>
                    <td>35%</td>
                  </tr>
                  <tr>
                    <td><strong>F1-Score</strong></td>
                    <td>49%</td>
                    <td>36%</td>
                  </tr>
                </tbody>
              </table>

              <div className="alert alert-warning" style={{ marginTop: "1rem" }}>
                <strong>Key Observation:</strong> The Random Forest model outperformed Logistic
                Regression by 12.67% accuracy, suggesting that non-linear relationships between
                features and burnout risk are present.
              </div>

              <h4>Class-wise Performance (Random Forest)</h4>
              <ul>
                <li><strong>High Burnout:</strong> Better detection due to larger training set</li>
                <li><strong>Moderate Burnout:</strong> Moderate identification accuracy</li>
                <li><strong>Low Burnout:</strong> Limited training samples affected recall</li>
              </ul>

              <h4>Recommendations for Improvement</h4>
              <ul>
                <li>Apply SMOTE (Synthetic Minority Oversampling) to address class imbalance</li>
                <li>Hyperparameter optimization via GridSearchCV</li>
                <li>Ensemble methods (Voting, Stacking) to combine model strengths</li>
                <li>Collect additional data, especially for "Low" burnout category</li>
              </ul>
            </div>
          )}
        </div>

        {/* Visualizations */}
        <div className="card" style={{ marginTop: "1.5rem" }}>
          <button
            onClick={() => toggleSection("visualizations")}
            style={{
              background: "none",
              border: "none",
              width: "100%",
              textAlign: "left",
              padding: "0",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <h3 style={{ margin: "0" }}>Model Visualizations</h3>
            <span style={{ fontSize: "1.5rem" }}>
              {expandedSection === "visualizations" ? "−" : "+"}
            </span>
          </button>

          {expandedSection === "visualizations" && (
            <div style={{ marginTop: "1.5rem", paddingTop: "1.5rem", borderTop: "1px solid var(--border)" }}>
              <p>
                Three key visualizations were generated from the training dataset to understand
                relationships between features and burnout risk:
              </p>

              <div className="grid-2" style={{ marginTop: "1.5rem" }}>
                <div style={{ textAlign: "center", padding: "1rem", background: "var(--surface-alt)", borderRadius: "8px" }}>
                  <p style={{ fontWeight: 600, marginBottom: "0.5rem" }}>Stress vs. CGPA</p>
                  <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>
                    Shows inverse relationship between academic stress and GPA
                  </p>
                </div>

                <div style={{ textAlign: "center", padding: "1rem", background: "var(--surface-alt)", borderRadius: "8px" }}>
                  <p style={{ fontWeight: 600, marginBottom: "0.5rem" }}>Sleep Quality vs. Burnout</p>
                  <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>
                    Demonstrates protective effect of quality sleep
                  </p>
                </div>

                <div style={{ textAlign: "center", padding: "1rem", background: "var(--surface-alt)", borderRadius: "8px" }}>
                  <p style={{ fontWeight: 600, marginBottom: "0.5rem" }}>Financial Stress vs. Burnout</p>
                  <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>
                    Illustrates positive correlation with burnout risk
                  </p>
                </div>

                <div style={{ textAlign: "center", padding: "1rem", background: "var(--surface-alt)", borderRadius: "8px" }}>
                  <p style={{ fontWeight: 600, marginBottom: "0.5rem" }}>Feature Importance</p>
                  <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>
                    Random Forest feature importance ranking
                  </p>
                </div>
              </div>

              <p style={{ marginTop: "1.5rem", fontSize: "0.95rem", color: "var(--text-secondary)" }}>
                These visualizations are generated during the model training pipeline and stored in
                the backend research directory for analysis and publication.
              </p>
            </div>
          )}
        </div>

        {/* Conclusion */}
        <div className="card" style={{ marginTop: "1.5rem" }}>
          <button
            onClick={() => toggleSection("conclusion")}
            style={{
              background: "none",
              border: "none",
              width: "100%",
              textAlign: "left",
              padding: "0",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <h3 style={{ margin: "0" }}>Conclusions & Future Work</h3>
            <span style={{ fontSize: "1.5rem" }}>
              {expandedSection === "conclusion" ? "−" : "+"}
            </span>
          </button>

          {expandedSection === "conclusion" && (
            <div style={{ marginTop: "1.5rem", paddingTop: "1.5rem", borderTop: "1px solid var(--border)" }}>
              <h4>Key Findings</h4>
              <ul>
                <li>
                  Machine learning models can identify burnout risk patterns with reasonable accuracy
                </li>
                <li>
                  Random Forest outperformed linear regression, suggesting non-linear burnout predictors
                </li>
                <li>
                  Multiple factors (sleep, stress, financial burden) contribute to academic burnout
                </li>
              </ul>

              <h4>Practical Applications</h4>
              <ul>
                <li>
                  Early detection system for universities to identify at-risk students and provide support
                </li>
                <li>Personalized intervention recommendations based on individual risk profiles</li>
                <li>Foundation for evidence-based student mental health programs</li>
              </ul>

              <h4>Future Research Directions</h4>
              <ul>
                <li>Longitudinal studies to track burnout progression over semesters</li>
                <li>Integration of additional data sources (academic history, counseling records)</li>
                <li>Deep learning models to capture complex feature interactions</li>
                <li>A/B testing of intervention recommendations in real educational settings</li>
                <li>Expansion to diverse institutional contexts and student populations</li>
              </ul>

              <div className="alert alert-success" style={{ marginTop: "1.5rem" }}>
                <strong>Impact:</strong> This research contributes to growing efforts to address the
                mental health crisis on university campuses through evidence-based, data-driven
                approaches.
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer Section */}
      <div className="card" style={{ marginTop: "2rem", background: "var(--surface-alt)" }}>
        <h3>Project Information</h3>
        <div className="grid-2" style={{ marginTop: "1rem", gap: "2rem" }}>
          <div>
            <p style={{ marginTop: "0 " }}>
              <strong>Dataset:</strong> Students' Mental Health Impacts and Technology Impacts Survey
              (n=1,405)
            </p>
            <p>
              <strong>Models:</strong> Random Forest (250 estimators) & Logistic Regression (baseline)
            </p>
            <p>
              <strong>Framework:</strong> scikit-learn with Pandas preprocessing
            </p>
          </div>
          <div>
            <p style={{ marginTop: "0" }}>
              <strong>Frontend:</strong> React 18.3 with Recharts visualization
            </p>
            <p>
              <strong>Backend:</strong> FastAPI with Uvicorn server
            </p>
            <p>
              <strong>Research Date:</strong> 2024
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResearchPage;
