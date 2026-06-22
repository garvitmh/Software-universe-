"use client";

import React from "react";

export default function EventDetailsPanel({ activeEvent }) {
  if (!activeEvent) return null;

  return (
    <div className="card" style={{ padding: 24, display: "flex", flexDirection: "column", gap: 12, height: "100%" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ width: 34, height: 34, borderRadius: "50%", background: activeEvent.id === "POS_FAILURE" ? "#FBE0D2" : "var(--brand-soft)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>
          {activeEvent.id === "POS_FAILURE" ? "🚨" : "📝"}
        </span>
        <div>
          <h4 style={{ fontFamily: "Fraunces", fontSize: 20, fontWeight: 700, color: "var(--ink)", margin: 0 }}>{activeEvent.label}</h4>
          <p style={{ fontSize: 12, color: "var(--muted)", margin: 0 }}>System Event Log: {activeEvent.id}</p>
        </div>
      </div>
      <p style={{ fontSize: 14.5, color: "var(--ink-2)", lineHeight: 1.6, margin: 0 }}>
        <strong>Overview:</strong> {activeEvent.narration}
      </p>
      <p style={{ fontSize: 14, color: "var(--ink-3)", lineHeight: 1.55, margin: 0, background: "var(--bg-2)", padding: 12, borderRadius: 10, borderLeft: "4.5px solid var(--brand)" }}>
        {activeEvent.details}
      </p>
    </div>
  );
}
