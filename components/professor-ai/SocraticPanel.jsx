// components/professor-ai/SocraticPanel.jsx

import React from "react";
import { getSocraticQuestion } from "./SocraticEngine.js";

export default function SocraticPanel({ topic }) {
  const question = getSocraticQuestion(topic);

  return (
    <div className="card" style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "12px" }}>
      <div>
        <span className="eyebrow" style={{ color: "var(--brand)" }}>Inquiry</span>
        <h3 style={{ margin: "2px 0 0 0" }}>Socratic Inquiry Prompt</h3>
      </div>

      <div style={{
        padding: "14px",
        borderRadius: "10px",
        backgroundColor: "var(--surface)",
        border: "1px solid var(--hairline-2)",
        display: "flex",
        flexDirection: "column",
        gap: "6px"
      }}>
        <span style={{ fontSize: "16px", color: "var(--brand)" }}>🤔</span>
        <p style={{ margin: 0, fontSize: "12px", fontWeight: "600", color: "var(--brand-2)", lineHeight: "1.4" }}>
          {question}
        </p>
      </div>
    </div>
  );
}
