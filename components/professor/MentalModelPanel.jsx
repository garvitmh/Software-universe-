"use client";

import React from "react";
import { useProfessor } from "./ProfessorContext";

export default function MentalModelPanel({ tintColors }) {
  const { currentConcept, currentWorld } = useProfessor();
  if (!currentConcept) return null;

  const colors = tintColors[currentWorld] || { main: "var(--brand)", soft: "var(--brand-soft)", dark: "var(--brand-2)" };

  // Map icons for concept analogies
  const analogyIcons = {
    order: "🎟️",
    payment: "🏨",
    delivery: "🗺️",
    loyalty: "📓",
    security: "🏨",
    pos: "⏳",
    analytics: "🖨️"
  };

  const icon = analogyIcons[currentWorld] || "🧠";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div
        style={{
          background: `linear-gradient(135deg, ${colors.soft}, rgba(255,255,255,0.01))`,
          border: `1.5px solid ${colors.main}`,
          borderRadius: 16,
          padding: "24px 20px",
          boxShadow: `0 8px 32px ${colors.soft}`,
          position: "relative",
          overflow: "hidden"
        }}
      >
        <div style={{ display: "flex", alignItems: "flex-start", gap: 16 }}>
          <div
            style={{
              fontSize: 32,
              background: colors.soft,
              padding: 12,
              borderRadius: 12,
              border: `1px solid ${colors.main}`,
              lineHeight: 1
            }}
          >
            {icon}
          </div>
          <div>
            <h4 style={{ fontSize: 13, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--muted)", margin: "0 0 4px" }}>
              Analogy Mental Model
            </h4>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: "var(--ink)", margin: 0 }}>
              {currentConcept.mentalModel.analogy}
            </h3>
          </div>
        </div>

        <p
          style={{
            fontSize: 14.5,
            color: "var(--ink-2)",
            lineHeight: 1.6,
            marginTop: 18,
            marginBottom: 0,
            fontFamily: "Inter"
          }}
        >
          {currentConcept.mentalModel.explanation}
        </p>

        {/* Floating gradient accent */}
        <div
          style={{
            position: "absolute",
            bottom: -50,
            right: -50,
            width: 120,
            height: 120,
            borderRadius: "50%",
            background: colors.main,
            opacity: 0.08,
            filter: "blur(20px)",
            pointerEvents: "none"
          }}
        />
      </div>
    </div>
  );
}
