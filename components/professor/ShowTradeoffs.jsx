"use client";

import React from "react";
import { useProfessor } from "./ProfessorContext";

export default function ShowTradeoffs({ tintColors }) {
  const { currentConcept, currentWorld } = useProfessor();
  if (!currentConcept) return null;

  const colors = tintColors[currentWorld] || { main: "var(--brand)", soft: "var(--brand-soft)", dark: "var(--brand-2)" };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <h4 style={{ fontSize: 13, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--muted)", margin: "0 0 4px" }}>
        Tradeoff Matrix
      </h4>

      <div style={{ overflow: "hidden", borderRadius: 12, border: "1px solid var(--hairline)", background: "var(--bg-2)" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13.5 }}>
          <thead>
            <tr style={{ background: "var(--surface)", borderBottom: "1px solid var(--hairline)" }}>
              <th style={{ padding: "12px 16px", textAlign: "left", fontWeight: 700, color: "var(--ink)" }}>Metric Dimension</th>
              <th style={{ padding: "12px 16px", textAlign: "left", fontWeight: 700, color: colors.dark }}>Engineering Tradeoff</th>
            </tr>
          </thead>
          <tbody>
            {currentConcept.tradeoffs.map((item, idx) => (
              <tr
                key={idx}
                style={{
                  borderBottom: idx === currentConcept.tradeoffs.length - 1 ? "none" : "1px solid var(--hairline)",
                  transition: "background 0.2s"
                }}
                className="tradeoff-row"
              >
                <td style={{ padding: "14px 16px", fontWeight: 600, color: "var(--ink)", width: "40%" }}>{item.metric}</td>
                <td style={{ padding: "14px 16px", color: "var(--ink-2)", lineHeight: 1.5, fontFamily: "Inter" }}>{item.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
