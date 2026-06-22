"use client";

import React from "react";
import { motion } from "framer-motion";

export default function PatternTradeoffMatrix({ tradeoffs, failureModes }) {
  const cards = [
    {
      label: "Benefit",
      icon: "✅",
      desc: tradeoffs.gain,
      color: "var(--teal)"
    },
    {
      label: "Cost / Loss",
      icon: "💸",
      desc: tradeoffs.loss,
      color: "var(--brand)"
    },
    {
      label: "Complexity Tier",
      icon: "🧠",
      desc: `Rated as ${tradeoffs.complexity}. This pattern introduces new layers of code abstractions and operational dependencies to configure and monitor.`,
      color: "var(--pop-blue)"
    },
    {
      label: "Outage Risk",
      icon: "⚡",
      desc: failureModes[0]?.description || "Misconfiguration could cause unexpected system behaviors.",
      color: "rgb(239, 68, 68)"
    }
  ];

  return (
    <div className="card" style={{ padding: "24px 28px", display: "flex", flexDirection: "column", gap: "16px" }}>
      <div>
        <span className="eyebrow" style={{ color: "var(--brand)" }}>Systems Audit</span>
        <h3 style={{ margin: "2px 0 0 0", fontSize: "18px" }}>Trade-off Matrix</h3>
      </div>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        gap: "16px"
      }} className="matrix-cards-grid">
        {cards.map((c) => (
          <motion.div
            key={c.label}
            whileHover={{ y: -4 }}
            style={{
              padding: "16px",
              background: "var(--bg-2)",
              border: "1px solid var(--hairline)",
              borderRadius: "12px",
              display: "flex",
              flexDirection: "column",
              gap: "8px"
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "12px", fontWeight: "800", color: "var(--ink-2)", textTransform: "uppercase" }}>
                {c.label}
              </span>
              <span style={{ fontSize: "16px" }}>{c.icon}</span>
            </div>
            <p style={{ margin: 0, fontSize: "12px", color: "var(--muted)", lineHeight: "1.5" }}>
              {c.desc}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
