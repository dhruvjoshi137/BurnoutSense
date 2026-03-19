const defaultValues = {
  sleep_hours: 7,
  study_hours: 5,
  screen_time: 6,
  stress_level: 3,
  mood_level: 3,
};

function BehaviorForm({ values, onChange, onSubmit, isLoading }) {
  return (
    <form onSubmit={onSubmit}>
      <div className="form-group">
        <label className="form-label">Sleep Hours</label>
        <input
          type="number"
          min="0"
          max="24"
          step="0.1"
          name="sleep_hours"
          value={values.sleep_hours}
          onChange={onChange}
          required
        />
      </div>

      <div className="form-group">
        <label className="form-label">Study Hours</label>
        <input
          type="number"
          min="0"
          max="24"
          step="0.1"
          name="study_hours"
          value={values.study_hours}
          onChange={onChange}
          required
        />
      </div>

      <div className="form-group">
        <label className="form-label">Screen Time</label>
        <input
          type="number"
          min="0"
          max="24"
          step="0.1"
          name="screen_time"
          value={values.screen_time}
          onChange={onChange}
          required
        />
      </div>

      <div className="form-group">
        <label className="form-label">Stress Level (1-5)</label>
        <input
          type="number"
          min="1"
          max="5"
          step="1"
          name="stress_level"
          value={values.stress_level}
          onChange={onChange}
          required
        />
      </div>

      <div className="form-group">
        <label className="form-label">Mood Level (1-5)</label>
        <input
          type="number"
          min="1"
          max="5"
          step="1"
          name="mood_level"
          value={values.mood_level}
          onChange={onChange}
          required
        />
      </div>

      <div style={{ display: "flex", gap: "0.75rem", marginTop: "1.5rem" }}>
        <button type="submit" className="btn" disabled={isLoading}>
          {isLoading ? "Analyzing..." : "Predict Burnout"}
        </button>

        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => {
            onChange({ target: { name: "sleep_hours", value: defaultValues.sleep_hours } });
            onChange({ target: { name: "study_hours", value: defaultValues.study_hours } });
            onChange({ target: { name: "screen_time", value: defaultValues.screen_time } });
            onChange({ target: { name: "stress_level", value: defaultValues.stress_level } });
            onChange({ target: { name: "mood_level", value: defaultValues.mood_level } });
          }}
        >
          Reset
        </button>
      </div>
    </form>
  );
}

export default BehaviorForm;
