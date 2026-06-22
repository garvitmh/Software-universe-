"use client";

import React from "react";
import { useProfessor } from "./ProfessorContext";

export default function ExplainSimple({ tintColors }) {
  const { currentConcept, currentWorld } = useProfessor();
  if (!currentConcept) return null;

  const colors = tintColors[currentWorld] || { main: "var(--brand)", soft: "var(--brand-soft)", dark: "var(--brand-2)" };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div
        style={{
          borderLeft: `4px solid ${colors.main}`,
          background: "var(--bg-2)",
          padding: "16px 20px",
          borderRadius: "0 12px 12px 0",
          boxShadow: "0 4px 12px rgba(0,0,0,0.02)"
        }}
      >
        <h4 style={{ fontSize: 13, textTransform: "uppercase", letterSpacing: "0.06em", color: colors.dark, margin: "0 0 8px" }}>
          The Concept in Plain English
        </h4>
        <p
          style={{
            fontSize: 14.5,
            color: "var(--ink-2)",
            lineHeight: 1.6,
            margin: 0,
            fontFamily: "Inter"
          }}
        >
          {currentConcept.simpleExplanation}
        </p>
      </div>
    </div>
  );
}
