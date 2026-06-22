"use client";

import React from "react";

export default function ArchitectMomentsPanel({ moments = [] }) {
  const list = moments.length > 0 ? moments : [
    { timestamp: Date.now() - 3600000, concept: "order", note: "Designed high availability JWT failover logic for microservices." },
    { timestamp: Date.now() - 86400000 * 2, concept: "payment", note: "Created a redundant payment webhook signature checking pipeline using local cache validations." }
  ];

  return (
    <div className="obs-card" style={{ gridColumn: "span 6", maxHeight: 400, overflowY: "auto" }}>
      <div className="obs-card-title">
        <span>Architect Transformations</span>
        <span style={{ color: "#CBA6F7" }}>Design Achievements</span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 10 }}>
        {list.map((mom, idx) => (
          <div key={idx} style={{
            padding: "12px",
            background: "rgba(203, 166, 247, 0.05)",
            border: "1px solid rgba(203, 166, 247, 0.15)",
            borderRadius: 10,
            display: "flex",
            flexDirection: "column",
            gap: 6
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 11, fontWeight: 800, textTransform: "uppercase", color: "#CBA6F7" }}>
                {mom.concept}
              </span>
              <span style={{ fontSize: 9, color: "var(--obs-muted)" }}>
                {new Date(mom.timestamp).toLocaleDateString()}
              </span>
            </div>
            <p style={{ margin: 0, fontSize: 12.5, color: "var(--obs-text)", lineHeight: 1.45 }}>
              {mom.note}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
