// components/replay/TransformationPanel.jsx

import React from "react";

export default function TransformationPanel({ events }) {
  // Check if user has transformation events to find active stage
  const hasTransformation = events.some(e => e.title.includes("Senior"));

  const stages = [
    { id: "vibe", name: "Vibe Coder", desc: "Copies snippets, hopes it compiles.", active: true },
    { id: "dev", name: "Developer", desc: "Understands databases, constructs loops.", active: true },
    { id: "eng", name: "Systems Engineer", desc: "Builds outbox queues, circuit breakers.", active: true },
    { id: "senior", name: "Senior Systems Engineer", desc: "Designs geo failover, analyzes latency.", active: hasTransformation },
    { id: "architect", name: "Architect / System Thinker", desc: "Balances team constraints, budget, and CAP tradeoffs.", active: false }
  ];

  return (
    <div className="card" style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "16px" }}>
      <div>
        <span className="eyebrow" style={{ color: "var(--brand)" }}>Ascension</span>
        <h3 style={{ margin: "2px 0 0 0" }}>Cognitive Transformation Stepper</h3>
        <p style={{ margin: "4px 0 0 0", fontSize: "12px", color: "var(--muted)" }}>
          Tracks your evolution from copy-pasting to trade-off balancing.
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {stages.map((st, idx) => (
          <div
            key={st.id}
            style={{
              display: "flex",
              gap: "12px",
              alignItems: "flex-start",
              opacity: st.active ? 1 : 0.45
            }}
          >
            <div style={{
              width: "22px",
              height: "22px",
              borderRadius: "50%",
              backgroundColor: st.active ? "var(--brand)" : "var(--hairline-2)",
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "11px",
              fontWeight: "700",
              marginTop: "2px"
            }}>
              {idx + 1}
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
              <span style={{
                fontSize: "13px",
                fontWeight: "700",
                color: st.active ? "var(--brand-2)" : "var(--ink-2)"
              }}>
                {st.name}
              </span>
              <span style={{ fontSize: "11px", color: "var(--muted)", lineHeight: "1.3" }}>
                {st.desc}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
