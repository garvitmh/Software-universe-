"use client";

import React from "react";

export default function CuriosityPanel({ curiosity = {} }) {
  const history = curiosity.history || [
    { topic: "payment", timestamp: Date.now() - 86400000, details: { note: "webhook signature checking" } }
  ];

  return (
    <div className="obs-card" style={{ gridColumn: "span 6", maxHeight: 300, overflowY: "auto" }}>
      <div className="obs-card-title">
        <span>Curiosity Exploration</span>
        <span style={{ color: "#94E2D5" }}>Research Tracks</span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 10 }}>
        {history.map((item, idx) => (
          <div key={idx} style={{
            padding: 10,
            background: "rgba(148, 226, 213, 0.04)",
            border: "1px solid rgba(148, 226, 213, 0.12)",
            borderRadius: 8,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
          }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: "#94E2D5", textTransform: "uppercase" }}>
                {item.topic}
              </span>
              <span style={{ fontSize: 11, color: "var(--obs-muted)" }}>
                Interacted with curiosity card.
              </span>
            </div>
            <span style={{ fontSize: 9.5, color: "var(--obs-muted)" }}>
              {new Date(item.timestamp).toLocaleDateString()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
