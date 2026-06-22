// components/professor-ai/TeachingPanel.jsx

import React from "react";

export default function TeachingPanel({ strategy }) {
  const getStrategyDetails = () => {
    switch (strategy) {
      case "ANALOGY":
        return {
          name: "🍎 Analogy Mode",
          desc: "Translating distributed systems limits into everyday scenarios (e.g. keycards and buzzer pagers) to cement abstract ideas."
        };
      case "STORY":
        return {
          name: "📖 Folklore Storyteller",
          desc: "Reciting historical production incidents from Netflix or Stripe to illustrate the real-world utility of design patterns."
        };
      case "TRADEOFF":
        return {
          name: "📐 Tradeoff Analysis",
          desc: "Benchmarking budget, scale, and simplicity limits. Rejecting general Q&A to focus on constraints."
        };
      case "CHALLENGE":
        return {
          name: "🏆 Active Challenge",
          desc: "Steering queries towards scenario testing to confirm the learner can reason about systems pressure."
        };
      case "DEBUG":
        return {
          name: "🚨 SRE Incident Recovery",
          desc: "Providing step-by-step failover playbooks and diagnosing root causes from metric anomalies."
        };
      case "SOCRATIC":
      default:
        return {
          name: "💭 Socratic Interrogative",
          desc: "Formulating guided questions rather than direct copy-paste code snippets to stimulate active thinking."
        };
    }
  };

  const details = getStrategyDetails();

  return (
    <div className="card" style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "12px" }}>
      <div>
        <span className="eyebrow" style={{ color: "var(--brand)" }}>Pedagogy</span>
        <h3 style={{ margin: "2px 0 0 0" }}>Active Teaching Strategy</h3>
      </div>

      <div style={{
        padding: "12px",
        borderRadius: "8px",
        backgroundColor: "var(--bg-2)",
        border: "1px solid var(--hairline-2)",
        fontSize: "11px"
      }}>
        <div style={{ fontWeight: "700", marginBottom: "4px", color: "var(--brand-2)" }}>
          {details.name}
        </div>
        <p style={{ margin: 0, color: "var(--ink-2)", lineHeight: "1.4" }}>
          {details.desc}
        </p>
      </div>
    </div>
  );
}
