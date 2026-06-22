"use client";

import React from "react";
import { motion } from "framer-motion";

export default function PatternUsagePanel({ patterns }) {
  return (
    <div className="card" style={{ padding: "20px 24px", display: "flex", flexDirection: "column", gap: "16px" }}>
      <div>
        <span className="eyebrow" style={{ color: "var(--brand)" }}>Design Integration</span>
        <h3 style={{ margin: "2px 0 0 0", fontSize: "18px" }}>Signature Patterns Used</h3>
        <p style={{ margin: "4px 0 0 0", fontSize: "12px", color: "var(--muted)" }}>
          These architectural patterns were primary pillars of the company's scaling solution.
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {patterns.map((patId, idx) => (
          <motion.div
            key={patId}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: idx * 0.08 }}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              background: "var(--bg-2)",
              border: "1px solid var(--hairline-2)",
              padding: "10px 14px",
              borderRadius: "8px"
            }}
          >
            <span style={{ fontSize: "13px", fontWeight: "700", color: "var(--ink-2)", textTransform: "uppercase" }}>
              {patId.replace(/_/g, " ")}
            </span>
            <span style={{ fontSize: "11px", color: "var(--brand)", fontWeight: "600" }}>
              Atlas Verified ✓
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
