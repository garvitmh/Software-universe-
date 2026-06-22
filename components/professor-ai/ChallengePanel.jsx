// components/professor-ai/ChallengePanel.jsx

import React from "react";
import { getChallengeForTopic } from "./ChallengeEngine.js";

export default function ChallengePanel({ topic }) {
  const challenge = getChallengeForTopic(topic);

  return (
    <div className="card" style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "12px" }}>
      <div>
        <span className="eyebrow" style={{ color: "var(--brand)" }}>Active Drill</span>
        <h3 style={{ margin: "2px 0 0 0" }}>Scenario Challenge</h3>
      </div>

      <div style={{
        padding: "14px",
        borderRadius: "10px",
        backgroundColor: "var(--bg-2)",
        border: "1px solid var(--hairline-2)",
        display: "flex",
        flexDirection: "column",
        gap: "8px"
      }}>
        <span style={{ fontSize: "14px", fontWeight: "700" }}>{challenge.title}</span>
        <p style={{ margin: 0, fontSize: "11px", color: "var(--ink-2)", lineHeight: "1.4" }}>
          {challenge.scenario}
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginTop: "4px" }}>
          {challenge.questions.map((q, idx) => (
            <div key={idx} style={{ display: "flex", gap: "6px", fontSize: "11px", alignItems: "flex-start" }}>
              <span style={{ color: "var(--brand)", fontWeight: "bold" }}>Q{idx+1}:</span>
              <span style={{ color: "var(--ink-2)" }}>{q}</span>
            </div>
          ))}
        </div>

        <div style={{ borderLeft: "3px solid var(--amber)", paddingLeft: "8px", fontSize: "10px", color: "var(--amber)", fontWeight: "600", marginTop: "4px" }}>
          💡 Hint: {challenge.hint}
        </div>
      </div>
    </div>
  );
}
