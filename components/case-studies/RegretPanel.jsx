"use client";

import React from "react";
import { motion } from "framer-motion";

export default function RegretPanel({ regrets }) {
  return (
    <div className="card" style={{ padding: "20px 24px", display: "flex", flexDirection: "column", gap: "12px" }}>
      <div>
        <span className="eyebrow" style={{ color: "var(--amber)" }}>Architectural Hindsight</span>
        <h3 style={{ margin: "2px 0 0 0", fontSize: "18px" }}>Post-Adoption Regrets</h3>
      </div>
      <motion.div
        initial={{ opacity: 0, x: -8 }}
        animate={{ opacity: 1, x: 0 }}
        style={{
          display: "flex",
          gap: "14px",
          background: "rgba(245, 158, 11, 0.04)",
          border: "1px solid rgba(245, 158, 11, 0.15)",
          padding: "16px 20px",
          borderRadius: "12px",
          alignItems: "flex-start"
        }}
      >
        <span style={{ fontSize: "24px" }}>🤔</span>
        <div style={{ flex: 1 }}>
          <span style={{ fontSize: "10px", fontWeight: "800", color: "var(--amber)", textTransform: "uppercase" }}>
            The Complexity Cost
          </span>
          <p style={{ margin: "4px 0 0 0", fontSize: "13.5px", lineHeight: "1.6", color: "var(--ink-2)", fontWeight: "500" }}>
            {regrets}
          </p>
        </div>
      </motion.div>
    </div>
  );
}
