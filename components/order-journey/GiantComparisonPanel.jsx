"use client";

import React from "react";

export default function GiantComparisonPanel({ activeEvent }) {
  if (!activeEvent) return null;

  return (
    <div className="card" style={{ padding: 24, display: "flex", flexDirection: "column", gap: 12, border: "1px solid var(--blue)", height: "100%" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ fontSize: 20 }}>🏢</span>
        <h4 style={{ fontFamily: "Fraunces", fontSize: 18, fontWeight: 700, color: "var(--blue)", margin: 0 }}>How the Giants Do It</h4>
      </div>
      <p style={{ fontSize: 14, color: "var(--ink-2)", lineHeight: 1.6, margin: 0 }}>
        {activeEvent.giant}
      </p>
      <div style={{ marginTop: "auto", fontSize: 11.5, color: "var(--muted)", borderTop: "1px solid var(--hairline-2)", paddingTop: 10 }}>
        Real-world implementation architecture comparison with industry leaders.
      </div>
    </div>
  );
}
