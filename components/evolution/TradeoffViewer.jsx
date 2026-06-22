"use client";

import React from "react";
import { motion } from "framer-motion";

export default function TradeoffViewer({ tradeoffs }) {
  const complexityColors = {
    LOW: { bg: "rgba(16, 185, 129, 0.1)", text: "rgb(16, 185, 129)" },
    MEDIUM: { bg: "rgba(245, 158, 11, 0.1)", text: "rgb(245, 158, 11)" },
    HIGH: { bg: "rgba(239, 68, 68, 0.1)", text: "rgb(239, 68, 68)" }
  };

  const compStyle = complexityColors[tradeoffs.complexity] || complexityColors.LOW;

  return (
    <div className="card" style={{ padding: "20px 24px", display: "flex", flexDirection: "column", gap: "16px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <span className="eyebrow" style={{ color: "var(--brand)" }}>Architectural Dilemma</span>
          <h3 style={{ margin: "2px 0 0 0", fontSize: "18px" }}>Trade-off Assessment</h3>
        </div>
        <span style={{
          fontSize: "11px",
          fontWeight: "700",
          padding: "4px 10px",
          borderRadius: "999px",
          backgroundColor: compStyle.bg,
          color: compStyle.text,
          border: `1px solid ${compStyle.text}20`
        }}>
          Complexity: {tradeoffs.complexity}
        </span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }} className="tradeoffs-grid">
        {/* Gain Card */}
        <motion.div
          whileHover={{ y: -2 }}
          style={{
            padding: "16px",
            background: "rgba(16, 185, 129, 0.04)",
            border: "1px solid rgba(16, 185, 129, 0.15)",
            borderRadius: "12px",
            display: "flex",
            flexDirection: "column",
            gap: "8px"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontSize: "16px" }}>🟩</span>
            <span style={{ fontSize: "12px", fontWeight: "700", color: "rgb(16, 185, 129)", textTransform: "uppercase" }}>Gains</span>
          </div>
          <p style={{ margin: 0, fontSize: "13px", color: "var(--ink-2)", lineHeight: "1.5" }}>
            {tradeoffs.gain}
          </p>
        </motion.div>

        {/* Loss / Cost Card */}
        <motion.div
          whileHover={{ y: -2 }}
          style={{
            padding: "16px",
            background: "rgba(239, 68, 68, 0.04)",
            border: "1px solid rgba(239, 68, 68, 0.15)",
            borderRadius: "12px",
            display: "flex",
            flexDirection: "column",
            gap: "8px"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontSize: "16px" }}>🟥</span>
            <span style={{ fontSize: "12px", fontWeight: "700", color: "rgb(239, 68, 68)", textTransform: "uppercase" }}>Costs & Risks</span>
          </div>
          <p style={{ margin: 0, fontSize: "13px", color: "var(--ink-2)", lineHeight: "1.5" }}>
            {tradeoffs.loss}
          </p>
        </motion.div>
      </div>
    </div>
  );
}
