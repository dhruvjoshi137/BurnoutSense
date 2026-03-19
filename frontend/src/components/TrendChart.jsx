import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

function TrendChart({ history }) {
  return (
    <section>
      <h3 style={{ marginBottom: "1.5rem" }}>Burnout Score Trend</h3>
      {history.length === 0 ? (
        <p style={{ color: "var(--text-muted)", textAlign: "center", padding: "2rem 1rem" }}>
          No trend data yet. Run predictions to build timeline.
        </p>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={history} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="run" stroke="var(--text-secondary)" />
            <YAxis domain={[0, 100]} stroke="var(--text-secondary)" />
            <Tooltip
              contentStyle={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: "8px",
              }}
            />
            <Line
              type="monotone"
              dataKey="burnout_score"
              stroke="#3b82f6"
              strokeWidth={3}
              dot={{ fill: "#3b82f6", r: 5 }}
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </section>
  );
}

export default TrendChart;
