// components/professor-ai/MisconceptionPanel.jsx

import React from "react";
import { checkMisconceptions } from "./MisconceptionEngine.js";

export default function MisconceptionPanel({ query = "" }) {
  const mis = checkMisconceptions(query);

  if (!mis) {
    return (
      <div className="card" style={{ padding: "20px", fontSize: "11px", color: "var(--muted)", fontStyle: "italic", textAlign: "center" }}>
        💡 Type 'Is a read replica a backup?' or 'What is the difference between queue and retry?' to trigger conceptual corrections.
      </div>
    );
  }

  return (
    <div className="card" style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "12px" }}>
      <div>
        <span className="eyebrow" style={{ color: "var(--pink)" }}>Friction Point</span>
        <h3 style={{ margin: "2px 0 0 0" }}>Misconception Rectifier</h3>
      </div>

      <div style={{
        padding: "12px",
        borderRadius: "8px",
        backgroundColor: "var(--pink-soft)",
        border: "1.5px solid var(--pink)",
        display: "flex",
        flexDirection: "column",
        gap: "6px",
        fontSize: "11px"
      }}>
        <strong style={{ color: "var(--pink)" }}>
          Common Trap: {mis.misconception}
        </strong>
        <p style={{ margin: 0, color: "var(--ink-2)", lineHeight: "1.4" }}>
          {mis.correction}
        </p>
      </div>
    </div>
  );
}
