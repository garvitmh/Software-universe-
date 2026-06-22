"use client";

import React from "react";

export default function WeakPatternsPanel({ weakAreas = [], risks = {} }) {
  const list = weakAreas.length > 0 ? weakAreas : ["security"];
  const riskType = risks.riskType || "None";
  const severity = risks.severity || "LOW";
  const rec = risks.recommendation || "You are progressing beautifully.";

  return (
    <div className="obs-card" style={{ gridColumn: "span 6" }}>
      <div className="obs-card-title">
        <span>Risk & Warning Patterns</span>
        <span style={{ color: "#F38BA8" }}>Action Items</span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 10 }}>
        {/* Risk Badge and Recommendation */}
        {riskType !== "None" && (
          <div style={{
            padding: 12,
            background: "rgba(243, 139, 168, 0.05)",
            border: "1px solid rgba(243, 139, 168, 0.2)",
            borderRadius: 10,
            display: "flex",
            flexDirection: "column",
            gap: 4
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 12, fontWeight: 800, color: "#F38BA8" }}>⚠️ RISK DETECTED: {riskType.toUpperCase()}</span>
              <span className={`obs-badge obs-badge-${severity.toLowerCase()}`}>{severity}</span>
            </div>
            <p style={{ margin: 0, fontSize: 12, color: "var(--obs-text)", lineHeight: 1.4 }}>
              {rec}
            </p>
          </div>
        )}

        {/* Weak Concepts Grid */}
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: "var(--obs-muted)" }}>Weak Foundational Concepts:</span>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {list.map(concept => (
              <span key={concept} style={{
                padding: "4px 10px",
                borderRadius: 8,
                background: "rgba(243, 139, 168, 0.08)",
                border: "1px solid rgba(243, 139, 168, 0.2)",
                color: "#F38BA8",
                fontSize: 11,
                fontWeight: 700,
                textTransform: "uppercase"
              }}>
                {concept}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
