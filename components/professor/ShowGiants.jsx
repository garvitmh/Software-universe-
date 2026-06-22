"use client";

import React from "react";
import { useProfessor } from "./ProfessorContext";

export default function ShowGiants({ tintColors }) {
  const { currentConcept, currentWorld } = useProfessor();
  if (!currentConcept) return null;

  const colors = tintColors[currentWorld] || { main: "var(--brand)", soft: "var(--brand-soft)", dark: "var(--brand-2)" };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <h4 style={{ fontSize: 13, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--muted)", margin: "0 0 4px" }}>
        Industry Case Studies
      </h4>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {currentConcept.giantExamples.map((giant, idx) => (
          <div
            key={idx}
            style={{
              background: "var(--bg-2)",
              border: "1px solid var(--hairline)",
              borderRadius: 14,
              padding: "16px 18px",
              display: "flex",
              flexDirection: "column",
              gap: 6
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 18 }}>🏢</span>
              <h5 style={{ fontSize: 14, fontWeight: 700, color: colors.dark, margin: 0 }}>
                {giant.company}
              </h5>
            </div>
            <p style={{ fontSize: 13.5, color: "var(--ink-2)", lineHeight: 1.5, margin: 0, fontFamily: "Inter" }}>
              {giant.detail}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
