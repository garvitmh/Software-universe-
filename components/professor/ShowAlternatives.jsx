"use client";

import React from "react";
import { useProfessor } from "./ProfessorContext";

export default function ShowAlternatives({ tintColors }) {
  const { currentConcept, currentWorld } = useProfessor();
  if (!currentConcept) return null;

  const colors = tintColors[currentWorld] || { main: "var(--brand)", soft: "var(--brand-soft)", dark: "var(--brand-2)" };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <h4 style={{ fontSize: 13, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--muted)", margin: "0 0 4px" }}>
        Alternatives Explored
      </h4>

      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 12 }}>
        {currentConcept.alternatives.map((alt, idx) => (
          <div
            key={idx}
            style={{
              background: "var(--bg-2)",
              border: "1px solid var(--hairline)",
              borderRadius: 12,
              padding: "16px 18px",
              position: "relative"
            }}
          >
            <div
              style={{
                position: "absolute",
                top: 14,
                right: 16,
                fontSize: 10.5,
                fontWeight: 700,
                color: colors.dark,
                background: colors.soft,
                padding: "2px 6px",
                borderRadius: 4
              }}
            >
              Option #{idx + 1}
            </div>

            <h5 style={{ fontSize: 14, fontWeight: 700, color: "var(--ink)", margin: "0 0 6px" }}>
              {alt.name}
            </h5>
            <p style={{ fontSize: 13.5, color: "var(--ink-2)", lineHeight: 1.5, margin: 0, fontFamily: "Inter" }}>
              {alt.details}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
