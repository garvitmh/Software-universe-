"use client";

import React from "react";
import { motion } from "framer-motion";

export default function PatternFailurePanel({ patternName, failureModes }) {
  return (
    <div className="card" style={{ padding: "24px 28px", display: "flex", flexDirection: "column", gap: "16px" }}>
      <div>
        <span className="eyebrow" style={{ color: "rgb(239, 68, 68)" }}>Warning System</span>
        <h3 style={{ margin: "2px 0 0 0", fontSize: "18px" }}>When {patternName} Becomes Dangerous</h3>
        <p style={{ margin: "4px 0 0 0", fontSize: "12px", color: "var(--muted)" }}>
          Patterns are not silver bullets. Under poor configuration or severe load, the pattern itself can trigger cascades.
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
        {failureModes.map((fm) => (
          <motion.div
            key={fm.title}
            whileHover={{ scale: 1.01 }}
            style={{
              padding: "16px 20px",
              background: "rgba(239, 68, 68, 0.03)",
              border: "1px solid rgba(239, 68, 68, 0.15)",
              borderRadius: "12px",
              display: "flex",
              flexDirection: "column",
              gap: "6px"
            }}
          >
            <span style={{ fontSize: "13px", fontWeight: "700", color: "rgb(239, 68, 68)" }}>
              ⚠️ Poison Vector: {fm.title}
            </span>
            <p style={{ margin: 0, fontSize: "12px", color: "var(--ink-2)", lineHeight: "1.5" }}>
              {fm.description}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
