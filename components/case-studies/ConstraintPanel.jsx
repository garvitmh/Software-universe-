"use client";

import React from "react";
import { motion } from "framer-motion";

export default function ConstraintPanel({ originalProblem }) {
  return (
    <div className="card" style={{ padding: "20px 24px", display: "flex", flexDirection: "column", gap: "12px" }}>
      <div>
        <span className="eyebrow" style={{ color: "var(--brand)" }}>Scaling Limits</span>
        <h3 style={{ margin: "2px 0 0 0", fontSize: "18px" }}>Original System Constraints</h3>
      </div>
      <motion.div
        initial={{ opacity: 0, x: -8 }}
        animate={{ opacity: 1, x: 0 }}
        style={{
          display: "flex",
          gap: "14px",
          background: "rgba(249, 115, 22, 0.04)",
          border: "1px solid rgba(249, 115, 22, 0.15)",
          padding: "16px 20px",
          borderRadius: "12px",
          alignItems: "flex-start"
        }}
      >
        <span style={{ fontSize: "24px" }}>📉</span>
        <div style={{ flex: 1 }}>
          <span style={{ fontSize: "10px", fontWeight: "800", color: "var(--brand)", textTransform: "uppercase" }}>
            The Bottleneck Force
          </span>
          <p style={{ margin: "4px 0 0 0", fontSize: "13.5px", lineHeight: "1.6", color: "var(--ink-2)", fontWeight: "500" }}>
            {originalProblem}
          </p>
        </div>
      </motion.div>
    </div>
  );
}
