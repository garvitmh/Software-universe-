// components/professor-ai/ProfessorControls.jsx

import React from "react";
import { PROFESSOR_MODES } from "./ProfessorModes.js";

export default function ProfessorControls({ activeMode, onChangeMode }) {
  return (
    <div className="card" style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "16px" }}>
      <div>
        <span className="eyebrow" style={{ color: "var(--brand)" }}>Steering</span>
        <h3 style={{ margin: "2px 0 0 0" }}>Professor Personality Controller</h3>
        <p style={{ margin: "4px 0 0 0", fontSize: "12px", color: "var(--muted)" }}>
          Swap the pedagogical mode configuration to adjust focus areas and explanations.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }} className="ways-grid">
        {Object.values(PROFESSOR_MODES).map((mode) => {
          const selected = activeMode.id === mode.id;
          return (
            <button
              key={mode.id}
              onClick={() => onChangeMode(mode)}
              style={{
                display: "flex",
                gap: "8px",
                alignItems: "center",
                padding: "8px 12px",
                borderRadius: "8px",
                backgroundColor: selected ? "var(--brand-soft)" : "var(--bg-2)",
                border: selected ? "1.5px solid var(--brand)" : "1px solid var(--hairline-2)",
                color: selected ? "var(--brand-2)" : "var(--ink-2)",
                fontWeight: "700",
                fontSize: "11px",
                cursor: "pointer",
                textAlign: "left",
                transition: "all 0.2s ease"
              }}
              title={mode.tagline}
            >
              <span>{mode.icon}</span>
              <span>{mode.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
