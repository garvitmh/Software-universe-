// components/planet-scale/MetricsPanel.jsx

import React from "react";
import { usePlanetScale } from "./usePlanetScale";

export default function MetricsPanel() {
  const { globalMetrics } = usePlanetScale();

  const items = [
    {
      title: "Requests / Sec",
      value: `${globalMetrics.rps.toLocaleString()} rps`,
      color: "var(--brand)"
    },
    {
      title: "Avg Latency",
      value: `${globalMetrics.latency} ms`,
      color: "var(--amber)"
    },
    {
      title: "Error Rate",
      value: `${globalMetrics.errors}%`,
      color: globalMetrics.errors > 5 ? "var(--pink)" : "var(--teal)"
    },
    {
      title: "System Availability",
      value: `${globalMetrics.availability}%`,
      color: globalMetrics.availability > 95 ? "var(--teal)" : "var(--pink)"
    }
  ];

  return (
    <div className="card" style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "16px" }}>
      <div>
        <span className="eyebrow" style={{ color: "var(--brand)" }}>Telemetry</span>
        <h3 style={{ margin: "2px 0 0 0" }}>Global Telemetry Dashboard</h3>
        <p style={{ margin: "4px 0 0 0", fontSize: "12px", color: "var(--muted)" }}>
          Real-time aggregated traffic metrics across all 7 server regions.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
        {items.map((it, idx) => (
          <div
            key={idx}
            style={{
              padding: "12px",
              borderRadius: "8px",
              backgroundColor: "var(--bg-2)",
              border: "1px solid var(--hairline-2)",
              display: "flex",
              flexDirection: "column",
              gap: "2px"
            }}
          >
            <span style={{ fontSize: "10px", color: "var(--muted)", textTransform: "uppercase" }}>
              {it.title}
            </span>
            <span style={{ fontSize: "18px", fontWeight: "800", color: it.color }}>
              {it.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
