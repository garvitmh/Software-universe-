"use client";

import React from "react";
import { useProfessor } from "./ProfessorContext";

export default function ShowFailures({ tintColors }) {
  const { currentConcept, currentWorld } = useProfessor();
  if (!currentConcept) return null;

  const colors = tintColors[currentWorld] || { main: "var(--brand)", soft: "var(--brand-soft)", dark: "var(--brand-2)" };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <h4 style={{ fontSize: 13, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--muted)", margin: "0 0 4px" }}>
        Disaster & Failure Scenarios
      </h4>

      <div
        style={{
          background: "rgba(243, 139, 168, 0.05)",
          border: "1.5px solid #F38BA8",
          borderRadius: 16,
          padding: "20px 18px",
          display: "flex",
          flexDirection: "column",
          gap: 12,
          boxShadow: "0 4px 16px rgba(243, 139, 168, 0.04)"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#F38BA8" }}>
          <span style={{ fontSize: 20 }}>💥</span>
          <h5 style={{ fontSize: 14, fontWeight: 700, margin: 0, textTransform: "uppercase", letterSpacing: "0.04em" }}>
            Critical Failure Mode
          </h5>
        </div>

        <p
          style={{
            fontSize: 14,
            color: "var(--ink-2)",
            lineHeight: 1.6,
            margin: 0,
            fontFamily: "Inter"
          }}
        >
          {currentConcept.failures}
        </p>
      </div>
    </div>
  );
}
