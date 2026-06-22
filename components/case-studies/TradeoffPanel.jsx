"use client";

import React from "react";
import { motion } from "framer-motion";

export default function TradeoffPanel({ tradeoffs }) {
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
          <span className="eyebrow" style={{ color: "var(--brand)" }}>Design Compromises</span>
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
        {/* Gains */}
        <div style={{
          padding: "14px",
          background: "rgba(16, 185, 129, 0.04)",
          border: "1px solid rgba(16, 185, 129, 0.15)",
          borderRadius: "10px",
          display: "flex",
          flexDirection: "column",
          gap: "6px"
        }}>
          <span style={{ fontSize: "11px", fontWeight: "800", color: "rgb(16, 185, 129)", textTransform: "uppercase" }}>Gains Achieved</span>
          <p style={{ margin: 0, fontSize: "12px", color: "var(--ink-2)", lineHeight: "1.5" }}>
            {tradeoffs.gain}
          </p>
        </div>

        {/* Losses */}
        <div style={{
          padding: "14px",
          background: "rgba(239, 68, 68, 0.04)",
          border: "1px solid rgba(239, 68, 68, 0.15)",
          borderRadius: "10px",
          display: "flex",
          flexDirection: "column",
          gap: "6px"
        }}>
          <span style={{ fontSize: "11px", fontWeight: "800", color: "rgb(239, 68, 68)", textTransform: "uppercase" }}>Accepted Liabilities</span>
          <p style={{ margin: 0, fontSize: "12px", color: "var(--ink-2)", lineHeight: "1.5" }}>
            {tradeoffs.loss}
          </p>
        </div>
      </div>
    </div>
  );
}
