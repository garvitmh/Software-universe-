"use client";

import React from "react";
import { useProfessor } from "./ProfessorContext";

export default function ShowBurgerFarmCode({ tintColors }) {
  const { currentConcept, currentWorld } = useProfessor();
  if (!currentConcept) return null;

  const colors = tintColors[currentWorld] || { main: "var(--brand)", soft: "var(--brand-soft)", dark: "var(--brand-2)" };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <h4 style={{ fontSize: 13, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--muted)", margin: "0 0 4px" }}>
        Burger Farm Implementation Anchors
      </h4>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {currentConcept.burgerFarmFiles.map((file, idx) => (
          <div
            key={idx}
            style={{
              background: "var(--bg-2)",
              border: "1px solid var(--hairline)",
              borderRadius: 12,
              padding: "14px 18px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 16
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
              <div style={{ fontWeight: 700, color: "var(--ink)", fontSize: 14, fontFamily: "monospace" }}>
                {file.name}
              </div>
              <div style={{ color: "var(--muted)", fontSize: 11, fontFamily: "monospace", wordBreak: "break-all" }}>
                {file.path}
              </div>
            </div>

            <a
              href={`file:///${file.path}`}
              style={{
                fontSize: 12,
                fontWeight: 600,
                color: colors.dark,
                background: colors.soft,
                padding: "6px 12px",
                borderRadius: 8,
                textDecoration: "none",
                border: `1px solid ${colors.main}`,
                transition: "all 0.2s"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-1px)";
                e.currentTarget.style.boxShadow = `0 4px 12px ${colors.soft}`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "none";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              Open File 🔎
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
