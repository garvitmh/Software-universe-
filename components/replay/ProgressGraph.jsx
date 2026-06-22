// components/replay/ProgressGraph.jsx

import React from "react";

export default function ProgressGraph({ events }) {
  // Coordinates for a trend graph representing index growth over 10 points
  const points = [
    { label: "Launch", mastery: 10, confidence: 20, thinking: 10 },
    { label: "SQLite", mastery: 25, confidence: 15, thinking: 18 },
    { label: "BullMQ", mastery: 45, confidence: 35, thinking: 30 },
    { label: "Stripe", mastery: 52, confidence: 45, thinking: 42 },
    { label: "Idempotency", mastery: 65, confidence: 55, thinking: 60 },
    { label: "Failover", mastery: 85, confidence: 80, thinking: 85 }
  ];

  // Convert points to SVG coordinates
  const width = 500;
  const height = 180;
  const xOffset = width / (points.length - 1);

  const getPath = (key) => {
    return points.map((p, idx) => {
      const x = idx * xOffset;
      const y = height - (p[key] / 100) * height * 0.8 - 10;
      return `${idx === 0 ? "M" : "L"} ${x} ${y}`;
    }).join(" ");
  };

  return (
    <div className="card" style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "16px" }}>
      <div>
        <span className="eyebrow" style={{ color: "var(--brand)" }}>Metrics Trend</span>
        <h3 style={{ margin: "2px 0 0 0" }}>Cognitive Vector Progression</h3>
        <p style={{ margin: "4px 0 0 0", fontSize: "12px", color: "var(--muted)" }}>
          Tracks your growth curves across key architectural telemetry dimensions.
        </p>
      </div>

      <div style={{
        width: "100%",
        height: `${height}px`,
        backgroundColor: "var(--bg-2)",
        borderRadius: "8px",
        border: "1px solid var(--hairline-2)",
        position: "relative",
        padding: "10px"
      }}>
        <svg style={{ width: "100%", height: "100%" }} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
          {/* Grid lines */}
          <line x1={0} y1={height/2} x2={width} y2={height/2} stroke="var(--hairline-2)" strokeDasharray="3 3" />

          {/* Mastery Curve */}
          <path d={getPath("mastery")} fill="none" stroke="var(--brand)" strokeWidth={2.5} />
          {/* Confidence Curve */}
          <path d={getPath("confidence")} fill="none" stroke="var(--amber)" strokeWidth={2} strokeDasharray="2 2" />
          {/* Thinking Curve */}
          <path d={getPath("thinking")} fill="none" stroke="var(--teal)" strokeWidth={2} />
        </svg>
      </div>

      {/* Legend */}
      <div style={{ display: "flex", gap: "14px", fontSize: "10px", fontWeight: "700" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
          <div style={{ width: "12px", height: "3px", backgroundColor: "var(--brand)" }} />
          <span>Mastery</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
          <div style={{ width: "12px", height: "3px", backgroundColor: "var(--amber)", borderBottom: "1px dashed var(--amber)" }} />
          <span>Confidence</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
          <div style={{ width: "12px", height: "3px", backgroundColor: "var(--teal)" }} />
          <span>Architectural Thinking</span>
        </div>
      </div>
    </div>
  );
}
