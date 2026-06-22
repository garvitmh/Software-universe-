// components/replay/ArchitectMomentPanel.jsx

import React from "react";
import { EVENT_TYPES } from "./ReplaySchema";

export default function ArchitectMomentPanel({ events }) {
  const moments = events.filter(e => e.type === EVENT_TYPES.ARCHITECT_MOMENT);

  return (
    <div className="card" style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "16px" }}>
      <div>
        <span className="eyebrow" style={{ color: "var(--brand)" }}>Ascension</span>
        <h3 style={{ margin: "2px 0 0 0" }}>Architect Moments</h3>
        <p style={{ margin: "4px 0 0 0", fontSize: "12px", color: "var(--muted)" }}>
          Milestones where code thinking shifted to systems thinking.
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {moments.map((mom, idx) => (
          <div
            key={idx}
            style={{
              padding: "14px",
              borderRadius: "10px",
              backgroundColor: "var(--brand-soft)",
              border: "1px solid var(--brand)",
              position: "relative"
            }}
          >
            <div style={{ position: "absolute", top: "10px", right: "12px", fontSize: "16px" }}>
              👑
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
              <span style={{ fontSize: "10px", fontWeight: "800", color: "var(--brand-2)", textTransform: "uppercase" }}>
                System Breakthrough
              </span>
              <span style={{ fontSize: "14px", fontWeight: "700", color: "var(--brand-2)" }}>{mom.title}</span>
              <p style={{ margin: "6px 0 0 0", fontSize: "11px", color: "var(--ink-2)", lineHeight: "1.4" }}>
                {mom.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
