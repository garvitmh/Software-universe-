// components/replay/LearningPathPanel.jsx

import React from "react";

export default function LearningPathPanel({ events }) {
  // Find concepts used in mock history
  const allConcepts = Array.from(new Set(events.flatMap(e => e.concepts)));

  return (
    <div className="card" style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "16px" }}>
      <div>
        <span className="eyebrow" style={{ color: "var(--brand)" }}>Study Path</span>
        <h3 style={{ margin: "2px 0 0 0" }}>Cognitive Journey Map</h3>
        <p style={{ margin: "4px 0 0 0", fontSize: "12px", color: "var(--muted)" }}>
          Tracks your navigation path from basic encapsulation to distributed consensus.
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        <div style={{
          padding: "12px",
          borderRadius: "8px",
          backgroundColor: "var(--bg-2)",
          border: "1px solid var(--hairline-2)",
          display: "flex",
          flexDirection: "column",
          gap: "6px"
        }}>
          <span style={{ fontSize: "10px", fontWeight: "700", textTransform: "uppercase", color: "var(--brand-2)" }}>
            🏁 Started Core Focus:
          </span>
          <span style={{ fontSize: "13px", fontWeight: "600" }}>
            Modular Foundations & Separation of Concerns
          </span>
        </div>

        <div style={{
          padding: "12px",
          borderRadius: "8px",
          backgroundColor: "var(--bg-2)",
          border: "1.5px solid var(--amber)",
          display: "flex",
          flexDirection: "column",
          gap: "6px"
        }}>
          <span style={{ fontSize: "10px", fontWeight: "700", textTransform: "uppercase", color: "var(--amber)" }}>
            ⚡ Current Active Focus:
          </span>
          <span style={{ fontSize: "13px", fontWeight: "600" }}>
            Replication Lag & PAC/CAP Theorem Tradeoffs
          </span>
        </div>

        <div style={{
          padding: "12px",
          borderRadius: "8px",
          backgroundColor: "var(--bg-2)",
          border: "1px solid var(--hairline-2)",
          display: "flex",
          flexDirection: "column",
          gap: "6px"
        }}>
          <span style={{ fontSize: "10px", fontWeight: "700", textTransform: "uppercase", color: "var(--muted)" }}>
            🎯 Next Target Breakthrough:
          </span>
          <span style={{ fontSize: "13px", fontWeight: "600", color: "var(--muted)" }}>
            Globally Consistent Active-Active Consensus
          </span>
        </div>
      </div>
    </div>
  );
}
