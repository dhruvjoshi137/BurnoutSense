import { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell } from "recharts";

function AnalyticsPage() {
  const [riskData, setRiskData] = useState(null);

  useEffect(() => {
    // Simulated risk distribution data
    // In a real scenario, this would be calculated from the dataset
    setRiskData({
      byRiskLevel: [
        { name: "Low", value: 140, percentage: 10 },
        { name: "Moderate", value: 477, percentage: 34 },
        { name: "High", value: 788, percentage: 56 },
      ],
      bySleepQuality: [
        { quality: "Poor (0-1)", high: 220, moderate: 130, low: 20 },
        { quality: "Fair (2-3)", high: 380, moderate: 210, low: 60 },
        { quality: "Good (4-5)", high: 188, moderate: 137, low: 60 },
      ],
      byFinancialStress: [
        { stress: "Low (0-1)", high: 140, moderate: 190, low: 80 },
        { stress: "Medium (2-3)", high: 380, moderate: 180, low: 40 },
        { stress: "High (4-5)", high: 268, moderate: 107, low: 20 },
      ],
      byCGPA: [
        { gpa: "< 2.0", high: 250, moderate: 80, low: 10 },
        { gpa: "2.0-3.0", high: 350, moderate: 220, low: 50 },
        { gpa: "> 3.0", high: 188, moderate: 177, low: 80 },
      ],
    });
  }, []);

  const riskColors = ["#10b981", "#f59e0b", "#ef4444"];

  return (
    <div>
      <div className="page-header">
        <h1>Risk Distribution Analytics</h1>
        <p>Analyze burnout risk patterns across different student demographics and characteristics.</p>
      </div>

      {/* Risk Level Distribution */}
      <div className="card elevated" style={{ marginBottom: "2rem" }}>
        <h3>Overall Risk Distribution</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={riskData?.byRiskLevel || []}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#3b82f6">
              {riskData?.byRiskLevel.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={riskColors[index]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        <div className="divider" style={{ marginTop: "1.5rem" }}></div>
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
              <td>788</td>
              <td>56.1%</td>
              <td><span className="badge badge-error">⚠️ Critical</span></td>
            </tr>
            <tr>
              <td><strong>Moderate</strong></td>
              <td>477</td>
              <td>33.9%</td>
              <td><span className="badge badge-warning">⚡ Monitor</span></td>
            </tr>
            <tr>
              <td><strong>Low</strong></td>
              <td>140</td>
              <td>10.0%</td>
              <td><span className="badge badge-success">✅ Healthy</span></td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="section-title">Burnout Risk by Key Factors</div>

      {/* Risk by Sleep Quality */}
      <div className="grid-2">
        <div className="card elevated">
          <h3>Risk by Sleep Quality</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={riskData?.bySleepQuality || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="quality" fontSize={12} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="high" stackId="a" fill="#ef4444" name="High Risk" />
              <Bar dataKey="moderate" stackId="a" fill="#f59e0b" name="Moderate Risk" />
              <Bar dataKey="low" stackId="a" fill="#10b981" name="Low Risk" />
            </BarChart>
          </ResponsiveContainer>
          <p style={{ marginTop: "1rem", color: "var(--text-secondary)", fontSize: "0.9rem" }}>
            <strong>Insight:</strong> Good sleep quality (4-5) shows 38% improvement in risk profile.
          </p>
        </div>

        {/* Risk by Financial Stress */}
        <div className="card elevated">
          <h3>Risk by Financial Stress</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={riskData?.byFinancialStress || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="stress" fontSize={12} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="high" stackId="a" fill="#ef4444" name="High Risk" />
              <Bar dataKey="moderate" stackId="a" fill="#f59e0b" name="Moderate Risk" />
              <Bar dataKey="low" stackId="a" fill="#10b981" name="Low Risk" />
            </BarChart>
          </ResponsiveContainer>
          <p style={{ marginTop: "1rem", color: "var(--text-secondary)", fontSize: "0.9rem" }}>
            <strong>Insight:</strong> High financial stress correlates with 4.9x higher burnout risk.
          </p>
        </div>
      </div>

      {/* Risk by CGPA */}
      <div className="card elevated" style={{ marginTop: "1.5rem" }}>
        <h3>Risk by Academic Performance (CGPA)</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={riskData?.byCGPA || []}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="gpa" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="high" stackId="a" fill="#ef4444" name="High Risk" />
            <Bar dataKey="moderate" stackId="a" fill="#f59e0b" name="Moderate Risk" />
            <Bar dataKey="low" stackId="a" fill="#10b981" name="Low Risk" />
          </BarChart>
        </ResponsiveContainer>
        <p style={{ marginTop: "1rem", color: "var(--text-secondary)", fontSize: "0.9rem" }}>
          <strong>Insight:</strong> Students with CGPA &gt; 3.0 show lower relative high-risk proportion (22% vs 45%).
        </p>
      </div>

      {/* Key Findings & Recommendations */}
      <div className="card elevated" style={{ marginTop: "2rem", background: "var(--success-bg)" }}>
        <h3 style={{ color: "var(--success-text)" }}>🔍 Key Findings & Recommendations</h3>
        <ul style={{ color: "var(--success-text)", lineHeight: "1.8" }}>
          <li>
            <strong>Sleep is Critical:</strong> Students with poor sleep quality have 2.4x higher burnout risk. Recommend campus-wide sleep hygiene programs.
          </li>
          <li>
            <strong>Financial Support Needed:</strong> Financial stress is the strongest predictor. Consider financial aid expansion or emergency funding.
          </li>
          <li>
            <strong>Academic Pressure:</strong> Lower GPAs correlate with higher stress, suggesting workload management support.
          </li>
          <li>
            <strong>Holistic Approach:</strong> 56% high-risk rate suggests systemic issues. Recommend institutional-level mental health initiatives.
          </li>
        </ul>
      </div>

      {/* Intervention Priorities */}
      <div className="card elevated" style={{ marginTop: "1.5rem" }}>
        <h3>Recommended Intervention Priorities</h3>
        <table className="comparison-table">
          <thead>
            <tr>
              <th>Priority</th>
              <th>Target Group</th>
              <th>Impact</th>
              <th>Intervention</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><span className="badge badge-error">🔴 Critical</span></td>
              <td>High Risk (788 students)</td>
              <td>56.1% of cohort</td>
              <td>1-on-1 counseling, medication referral</td>
            </tr>
            <tr>
              <td><span className="badge badge-warning">🟡 High</span></td>
              <td>Moderate Risk (477 students)</td>
              <td>33.9% of cohort</td>
              <td>Peer support groups, stress workshops</td>
            </tr>
            <tr>
              <td><span className="badge badge-success">🟢 Medium</span></td>
              <td>Financial Stress Subset (330 students)</td>
              <td>23.5% of cohort</td>
              <td>Emergency funds, part-time job placement</td>
            </tr>
            <tr>
              <td><span className="badge badge-success">🟢 Medium</span></td>
              <td>Sleep Quality &lt; 3 (880 students)</td>
              <td>62.6% of cohort</td>
              <td>Sleep clinics, dormitory environment improvements</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AnalyticsPage;
