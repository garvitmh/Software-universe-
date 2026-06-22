// components/replay/MistakePanel.jsx

import React from "react";
import { detectRepeatedMistakes } from "./ReplayEngine";
import { EVENT_TYPES } from "./ReplaySchema";

export default function MistakePanel({ events }) {
  const mistakes = events.filter(e => e.type === EVENT_TYPES.MISTAKE || e.type === EVENT_TYPES.MISCONCEPTION);
  const repeated = detectRepeatedMistakes(events);

  return (
    <div className="card" style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "16px" }}>
      <div>
        <span className="eyebrow" style={{ color: "var(--brand)" }}>Learning Scars</span>
        <h3 style={{ margin: "2px 0 0 0" }}>Misconceptions & Outage Lessons</h3>
        <p style={{ margin: "4px 0 0 0", fontSize: "12px", color: "var(--muted)" }}>
          Systems are built on scars. Every outage is a design lesson in disguise.
        </p>
      </div>

      {/* Repeated mistakes notice */}
      {repeated.length > 0 && (
        <div style={{
          padding: "10px 12px",
          borderRadius: "8px",
          backgroundColor: "var(--pink-soft)",
          border: "1.5px solid var(--pink)",
          fontSize: "11px",
          color: "var(--pink)"
        }}>
          ⚠️ <strong>Repeated Friction Hotspots:</strong> You struggled with <strong>{repeated[0].concept}</strong> ({repeated[0].count} times). Socratic recommendation: Review transactional queue isolation.
        </div>
      )}

      {/* Mistake list */}
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {mistakes.slice(0, 3).map((mis, idx) => (
          <div
            key={idx}
            style={{
              padding: "12px",
              borderRadius: "8px",
              backgroundColor: "var(--bg-2)",
              border: "1px solid var(--pink)",
              borderLeft: "4px solid var(--pink)"
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
              <span style={{ fontSize: "11px", fontWeight: "700", color: "var(--pink)" }}>
                {mis.type === EVENT_TYPES.MISCONCEPTION ? "💭 Misconception" : "💥 System Outage"}
              </span>
              <span style={{ fontSize: "10px", color: "var(--muted)" }}>
                {new Date(mis.timestamp).toLocaleDateString()}
              </span>
            </div>
            <span style={{ fontSize: "13px", fontWeight: "700", display: "block", marginBottom: "2px" }}>{mis.title}</span>
            <p style={{ margin: 0, fontSize: "11px", color: "var(--ink-2)" }}>{mis.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
