"use client";

import React from "react";
import { motion } from "framer-motion";

export default function PatternProblemPanel({ patternName, problem }) {
  return (
    <div className="card" style={{ padding: "24px 28px", display: "flex", flexDirection: "column", gap: "16px" }}>
      <div>
        <span className="eyebrow" style={{ color: "rgb(239, 68, 68)" }}>The Architectural Pain</span>
        <h3 style={{ margin: "2px 0 0 0", fontSize: "18px" }}>Why does {patternName} exist?</h3>
      </div>

      <motion.div
        initial={{ opacity: 0, x: -8 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4 }}
        style={{
          display: "flex",
          gap: "16px",
          background: "rgba(239, 68, 68, 0.04)",
          border: "1px solid rgba(239, 68, 68, 0.12)",
          padding: "20px",
          borderRadius: "12px",
          alignItems: "flex-start"
        }}
      >
        <span style={{ fontSize: "28px", userSelect: "none" }}>🔥</span>
        <div style={{ flex: 1 }}>
          <span style={{
            fontSize: "11px",
            fontWeight: "800",
            color: "rgb(239, 68, 68)",
            textTransform: "uppercase",
            letterSpacing: "0.06em"
          }}>
            Outage Vector / Bottleneck
          </span>
          <p style={{
            margin: "6px 0 0 0",
            fontSize: "14px",
            lineHeight: "1.6",
            color: "var(--ink-2)",
            fontWeight: "500"
          }}>
            {problem}
          </p>
        </div>
      </motion.div>
    </div>
  );
}
