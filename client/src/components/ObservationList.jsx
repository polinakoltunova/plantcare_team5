import React from "react";

const healthStatusColors = {
  healthy: "#2e7d32",
  needs_attention: "#ffb300",
  critical: "#d32f2f",

  "Хорошее": "#2e7d32",
  "Требует внимания": "#ffb300",
  "Плохое": "#d32f2f",
  "Критическое": "#d32f2f",
};

const statusLabels = {
  healthy: "Хорошее",
  needs_attention: "Требует внимания",
  critical: "Критическое",

  "Хорошее": "Хорошее",
  "Плохое": "Плохое",
  "Требует внимания": "Требует внимания",
  "Критическое": "Критическое",
};

export default function ObservationsList({ observations = [] }) {
  if (!Array.isArray(observations) || observations.length === 0) {
    return <p>Наблюдений пока нет.</p>;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "12px" }}>
      {observations.map((obs) => {
        const label = statusLabels[obs.health_status] || obs.health_status;
        const color = healthStatusColors[obs.health_status] || "#555";

        return (
          <div
            key={obs.id}
            style={{
              background: "var(--card-bg)",
              borderRadius: "12px",
              padding: "10px 14px",
              boxShadow: "0 2px 6px rgba(0,0,0,0.06)",
              borderLeft: `4px solid ${color}`,
            }}
          >
            <div style={{ marginBottom: "4px" }}>
              <strong>{obs.type || "Наблюдение"}:</strong>{" "}
              {obs.description}
            </div>

            <div
              style={{
                fontSize: "0.9rem",
                color,
                fontWeight: 500,
                display: "inline-flex",
                alignItems: "center",
                gap: "4px",
              }}
            >
              <span>●</span>
              <span>{label}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
