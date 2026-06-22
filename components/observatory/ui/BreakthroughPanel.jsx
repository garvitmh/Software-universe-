"use client";

import React from "react";

export default function BreakthroughPanel({ breakthroughs = [], misconceptions = [] }) {
  const bts = breakthroughs.length > 0 ? breakthroughs : [
    { timestamp: Date.now() - 3600000 * 3, concept: "order", note: "Understood row locks and status transitions via restaurant analogical models." }
  ];

  const mcs = misconceptions.length > 0 ? misconceptions : [
    { correctedAt: Date.now() - 3600000 * 5, concept: "security", misconception: "JWT payload encrypts user details" }
  ];

  return (
    <div className="obs-card" style={{ gridColumn: "span 6" }}>
      <div className="obs-card-title">
        <span>Breakthroughs & Misconceptions</span>
        <span style={{ color: "#A6E3A1" }}>Intuition Adjustments</span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginTop: 10 }}>
        {/* Breakthrough Column */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <h5 style={{ margin: 0, fontSize: 11, color: "#A6E3A1", textTransform: "uppercase", letterSpacing: "0.05em" }}>
            💡 Breakthroughs
          </h5>
          {bts.map((bt, idx) => (
            <div key={idx} style={{ padding: 10, background: "rgba(166, 227, 161, 0.04)", border: "1px solid rgba(166, 227, 161, 0.12)", borderRadius: 8, fontSize: 11.5 }}>
              <strong style={{ display: "block", color: "#F8F9FC", marginBottom: 2 }}>{bt.concept.toUpperCase()}</strong>
              <span style={{ color: "var(--obs-muted)" }}>{bt.note}</span>
            </div>
          ))}
        </div>

        {/* Misconception Column */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <h5 style={{ margin: 0, fontSize: 11, color: "#F9E2AF", textTransform: "uppercase", letterSpacing: "0.05em" }}>
            ❌ Corrected Beliefs
          </h5>
          {mcs.map((mc, idx) => (
            <div key={idx} style={{ padding: 10, background: "rgba(249, 226, 175, 0.04)", border: "1px solid rgba(249, 226, 175, 0.12)", borderRadius: 8, fontSize: 11.5 }}>
              <strong style={{ display: "block", color: "#F8F9FC", marginBottom: 2 }}>{mc.concept.toUpperCase()}</strong>
              <span style={{ color: "var(--obs-muted)" }}>Overcame misconception: <em>"{mc.misconception}"</em></span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
