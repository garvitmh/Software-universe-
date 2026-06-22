"use client";

import React from "react";
import { useProfessor } from "./ProfessorContext";

export default function ExplainDeep({ tintColors }) {
  const { currentConcept, currentWorld } = useProfessor();
  if (!currentConcept) return null;

  const colors = tintColors[currentWorld] || { main: "var(--brand)", soft: "var(--brand-soft)", dark: "var(--brand-2)" };

  const sections = [
    { title: "Problem", text: currentConcept.deepExplanation.problem, emoji: "🚨", color: "#F38BA8" },
    { title: "Solution", text: currentConcept.deepExplanation.solution, emoji: "💡", color: "#A6E3A1" },
    { title: "Tradeoffs", text: currentConcept.deepExplanation.tradeoffs, emoji: "⚖️", color: "#F9E2AF" },
    { title: "Failure Modes", text: currentConcept.deepExplanation.failures, emoji: "💥", color: "#FAB387" },
    { title: "Scaling Implications", text: currentConcept.deepExplanation.scaling, emoji: "🚀", color: "#89DCEB" }
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <h4 style={{ fontSize: 13, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--muted)", margin: "0 0 4px" }}>
        Staff Engineer Blueprint
      </h4>

      <div style={{ display: "flex", flexDirection: "column", position: "relative" }}>
        {/* Visual vertical connector line */}
        <div
          style={{
            position: "absolute",
            left: 20,
            top: 24,
            bottom: 24,
            width: 2,
            background: "var(--hairline-2)",
            zIndex: 1
          }}
        />

        {sections.map((sec, idx) => (
          <div key={idx} style={{ display: "flex", gap: 16, marginBottom: idx === sections.length - 1 ? 0 : 20, zIndex: 2 }}>
            {/* Step circle indicator */}
            <div
              style={{
                width: 42,
                height: 42,
                borderRadius: "50%",
                background: "var(--surface)",
                border: `1.5px solid ${colors.main}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 18,
                boxShadow: "0 4px 10px rgba(0,0,0,0.03)",
                flexShrink: 0
              }}
            >
              {sec.emoji}
            </div>

            {/* Content card */}
            <div
              style={{
                flex: 1,
                background: "var(--bg-2)",
                border: "1px solid var(--hairline)",
                borderRadius: 12,
                padding: "14px 16px",
                display: "flex",
                flexDirection: "column",
                gap: 4
              }}
            >
              <h5 style={{ fontSize: 13, fontWeight: 700, color: sec.color, margin: 0, textTransform: "uppercase", letterSpacing: "0.04em" }}>
                {sec.title}
              </h5>
              <p style={{ fontSize: 13.5, color: "var(--ink-2)", lineHeight: 1.5, margin: 0, fontFamily: "Inter" }}>
                {sec.text}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
