// components/professor-ai/AnalogyPanel.jsx

import React from "react";
import { getAnalogy } from "./AnalogyEngine.js";

export default function AnalogyPanel({ topic }) {
  const analogy = getAnalogy(topic);

  return (
    <div className="card" style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "12px" }}>
      <div>
        <span className="eyebrow" style={{ color: "var(--brand)" }}>Mental Model</span>
        <h3 style={{ margin: "2px 0 0 0" }}>Feynman Analogy Card</h3>
      </div>

      <div style={{
        padding: "14px",
        borderRadius: "10px",
        backgroundColor: "var(--surface)",
        border: "1px solid var(--hairline-2)",
        display: "flex",
        flexDirection: "column",
        gap: "8px"
      }}>
        <span style={{ fontSize: "14px", fontWeight: "700", color: "var(--brand)" }}>
          {analogy.title}
        </span>
        <p style={{ margin: 0, fontSize: "11px", color: "var(--ink-2)", lineHeight: "1.5" }}>
          {analogy.description}
        </p>
        <div style={{ borderLeft: "3px solid var(--pink)", paddingLeft: "8px", fontSize: "10px", color: "var(--pink)", fontWeight: "600" }}>
          ⚠️ Limits/Drawback: {analogy.drawback}
        </div>
      </div>
    </div>
  );
}
