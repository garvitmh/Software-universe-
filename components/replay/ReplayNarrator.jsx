// components/replay/ReplayNarrator.jsx

import React from "react";
import { buildNarrative } from "./ReplayEngine";

export default function ReplayNarrator({ events }) {
  const narrative = buildNarrative(events);

  return (
    <div className="card" style={{
      padding: "20px",
      backgroundColor: "var(--surface)",
      borderLeft: "4px solid var(--brand)",
      display: "flex",
      flexDirection: "column",
      gap: "10px"
    }}>
      <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
        <span style={{ fontSize: "20px" }}>🧙‍♂️</span>
        <div>
          <span style={{ fontSize: "11px", color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: "700" }}>
            Chief Architect Narrative
          </span>
          <h4 style={{ margin: 0, fontSize: "14px", fontWeight: "700" }}>Your Progression Biography</h4>
        </div>
      </div>

      <div style={{
        padding: "14px",
        borderRadius: "10px",
        backgroundColor: "var(--bg-2)",
        border: "1px solid var(--hairline-2)",
        fontSize: "12px",
        lineHeight: "1.6",
        color: "var(--ink-2)",
        position: "relative"
      }}>
        {/* Quote speech-bubble notch */}
        <div style={{
          position: "absolute",
          top: "-6px",
          left: "14px",
          width: "10px",
          height: "10px",
          backgroundColor: "var(--bg-2)",
          borderLeft: "1px solid var(--hairline-2)",
          borderTop: "1px solid var(--hairline-2)",
          transform: "rotate(45deg)"
        }} />
        
        {narrative}
      </div>
    </div>
  );
}
