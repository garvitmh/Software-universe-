"use client";

import React from "react";

export default function WorldProgressMap({ worldProgress = {} }) {
  const worlds = [
    { id: "security", label: "Security Foundations" },
    { id: "payment", label: "Payments Integration" },
    { id: "order", label: "Order Workflows" },
    { id: "loyalty", label: "Loyalty Ledgers" },
    { id: "pos", label: "POS Queues" },
    { id: "delivery", label: "Delivery Geo checking" },
    { id: "analytics", label: "Analytics Warehousing" }
  ];

  return (
    <div className="obs-card" style={{ gridColumn: "span 6" }}>
      <div className="obs-card-title">
        <span>World Progress Map</span>
        <span style={{ color: "#89B4FA" }}>World Map</span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 10 }}>
        {worlds.map(w => {
          const ratio = worldProgress[w.id] || 0.1;
          const percentage = Math.round(ratio * 100);
          return (
            <div key={w.id} style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, fontWeight: 600 }}>
                <span style={{ color: "var(--obs-text)" }}>{w.label}</span>
                <span style={{ color: "#89B4FA" }}>{percentage}%</span>
              </div>
              <div style={{ height: 6, width: "100%", background: "rgba(255,255,255,0.06)", borderRadius: 3, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${percentage}%`, background: "var(--grad-blue)", borderRadius: 3, transition: "width 0.4s ease-out" }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
