function RiskCard({ prediction }) {
  if (!prediction) {
    return (
      <section>
        <p style={{ color: "var(--text-muted)", textAlign: "center" }}>
          Submit inputs to see ABI prediction.
        </p>
      </section>
    );
  }

  const riskClass = prediction.risk_level;
  const riskColors = {
    low: "badge-success",
    moderate: "badge-warning",
    high: "badge-error",
  };

  return (
    <section>
      <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
        <h3 style={{ marginBottom: "0.5rem" }}>Academic Burnout Index</h3>
        <div style={{ fontSize: "3.5rem", fontWeight: "800", color: "var(--accent)", margin: "1rem 0" }}>
          {prediction.burnout_score}
        </div>
        <span className={`badge ${riskColors[riskClass]}`}>
          {prediction.risk_level.charAt(0).toUpperCase() + prediction.risk_level.slice(1)} Risk
        </span>
      </div>

      <div className="divider"></div>

      <h4 style={{ marginBottom: "1rem" }}>Score Components</h4>
      <div className="grid-2">
        {Object.entries(prediction.abi_components).map(([key, value]) => (
          <div key={key} style={{ padding: "0.75rem", background: "var(--surface-alt)", borderRadius: "8px" }}>
            <div style={{ fontSize: "0.85rem", color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: "600", marginBottom: "0.25rem" }}>
              {key.replaceAll("_", " ")}
            </div>
            <div style={{ fontSize: "1.5rem", fontWeight: "700", color: "var(--accent)" }}>
              {value}
            </div>
          </div>
        ))}
      </div>

      <div className="alert alert-info" style={{ marginTop: "1.5rem" }}>
        <strong>Note:</strong> ABI scores range from 0-100. Higher scores indicate greater burnout risk.
      </div>
    </section>
  );
}

export default RiskCard;
