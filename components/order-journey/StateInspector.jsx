"use client";

import React from "react";

export default function StateInspector({ state }) {
  if (!state) {
    return (
      <div style={{ display: "flex", height: "100%", minHeight: 220, alignItems: "center", justifyContent: "center", color: "var(--muted)", fontSize: 14, fontFamily: "monospace" }}>
        No active variables scope registered at this step.
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10, height: "100%", minHeight: 220 }}>
      <h5 style={{ fontSize: 12.5, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", margin: 0 }}>
        Active Variables Scope
      </h5>
      <pre style={{
        flex: 1, margin: 0, padding: 14, background: "var(--bg-2)", border: "1px solid var(--hairline)", borderRadius: 10,
        overflow: "auto", fontSize: 12, fontFamily: "JetBrains Mono, monospace", color: "var(--brand-2)", lineHeight: 1.5
      }}>
        {JSON.stringify(state, null, 2)}
      </pre>
    </div>
  );
}
