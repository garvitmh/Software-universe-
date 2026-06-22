// components/replay/BreakthroughPanel.jsx

import React from "react";
import { usePlanetScale } from "../planet-scale/usePlanetScale"; // we can reuse global styles or hook if needed, but let's keep it self-contained
import { detectBreakthroughs } from "./ReplayEngine";

export default function BreakthroughPanel({ events }) {
  const breakthroughs = detectBreakthroughs(events);

  return (
    <div className="card" style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "16px" }}>
      <div>
        <span className="eyebrow" style={{ color: "var(--brand)" }}>Realizations</span>
        <h3 style={{ margin: "2px 0 0 0" }}>Cognitive Breakthroughs</h3>
        <p style={{ margin: "4px 0 0 0", fontSize: "12px", color: "var(--muted)" }}>
          Key instances where previously complex concepts became intuitive.
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {breakthroughs.map((br, idx) => (
          <div
            key={idx}
            style={{
              padding: "12px",
              borderRadius: "8px",
              backgroundColor: "var(--bg-2)",
              border: "1px solid var(--teal)",
              borderLeft: "4px solid var(--teal)"
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
              <span style={{ fontSize: "12px", fontWeight: "700", color: "var(--teal)" }}>
                💡 Click! Unlocked
              </span>
              <span style={{ fontSize: "10px", color: "var(--muted)" }}>
                {new Date(br.timestamp).toLocaleDateString()}
              </span>
            </div>
            <span style={{ fontSize: "13px", fontWeight: "700", display: "block", marginBottom: "2px" }}>{br.title}</span>
            <p style={{ margin: 0, fontSize: "11px", color: "var(--ink-2)" }}>{br.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
