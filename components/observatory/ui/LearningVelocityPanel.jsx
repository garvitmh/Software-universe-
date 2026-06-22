"use client";

import React from "react";

export default function LearningVelocityPanel({ velocity = {} }) {
  const qPerDay = velocity.questionsPerDay || 4;
  const cPerWeek = velocity.conceptsPerWeek || 1;
  const acc = velocity.acceleration || "stable";
  const plateau = velocity.plateauRisk || false;

  return (
    <div className="obs-card" style={{ gridColumn: "span 4" }}>
      <div className="obs-card-title">
        <span>Learning Velocity</span>
        <span style={{ color: "#A6E3A1" }}>Pace Indicators</span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 14, marginTop: 10 }}>
        {/* Dual metrics grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <span style={{ fontSize: 10, color: "var(--obs-muted)", textTransform: "uppercase" }}>Questions / 24h</span>
            <span style={{ fontSize: 22, fontWeight: 800, color: "#F8F9FC" }}>{qPerDay}</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <span style={{ fontSize: 10, color: "var(--obs-muted)", textTransform: "uppercase" }}>Concepts / 7d</span>
            <span style={{ fontSize: 22, fontWeight: 800, color: "#F8F9FC" }}>{cPerWeek}</span>
          </div>
        </div>

        {/* Acceleration & Plateau row */}
        <div style={{ display: "flex", flexDirection: "column", gap: 6, borderTop: "1px dashed var(--obs-border)", paddingTop: 10 }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11.5 }}>
            <span style={{ color: "var(--obs-muted)" }}>Velocity Acceleration:</span>
            <strong style={{ color: acc === "positive" ? "#A6E3A1" : "#89B4FA", textTransform: "capitalize" }}>{acc}</strong>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11.5 }}>
            <span style={{ color: "var(--obs-muted)" }}>Plateau Risk:</span>
            <strong style={{ color: plateau ? "#F38BA8" : "#A6E3A1" }}>{plateau ? "Warning" : "Minimal"}</strong>
          </div>
        </div>
      </div>
    </div>
  );
}
