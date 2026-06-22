"use client";

import React from "react";
import ProfessorRenderer from "@/components/professor/ProfessorRenderer";

export default function CodexPanel({ codex, worldSlug, tint }) {
  return (
    <div className="card" style={{ padding: "28px 24px", height: "100%", display: "flex", flexDirection: "column", gap: 24, border: "1px solid var(--hairline)", position: "relative", overflow: "hidden" }}>
      <h3 style={{ fontSize: 16, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--muted)", borderBottom: "1px solid var(--hairline)", paddingBottom: 10, margin: 0 }}>
        📖 Codex Chapters
      </h3>
      
      <div className="prose" style={{ display: "flex", flexDirection: "column", gap: 18, marginBottom: 20 }}>
        {codex.map((sec, idx) => (
          <div key={idx}>
            <h4 style={{ fontSize: 16.5, fontWeight: 700, color: "var(--ink)", marginBottom: 6, fontFamily: "Inter" }}>
              {sec.heading}
            </h4>
            <p style={{ fontSize: 14.5, color: "var(--ink-2)", lineHeight: 1.6, margin: 0 }}>
              {sec.text}
            </p>
          </div>
        ))}
      </div>

      {/* AI Professor Renderer */}
      <ProfessorRenderer worldSlug={worldSlug} />
    </div>
  );
}
