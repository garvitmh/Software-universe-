"use client";

import React from "react";
import { motion } from "framer-motion";

export default function CapabilityPanel({ capabilities }) {
  return (
    <div className="card" style={{ padding: "20px 24px", display: "flex", flexDirection: "column", gap: "16px" }}>
      <div>
        <span className="eyebrow" style={{ color: "var(--brand)" }}>Engineering Tools</span>
        <h3 style={{ margin: "2px 0 0 0", fontSize: "18px" }}>System Capabilities</h3>
        <p style={{ margin: "4px 0 0 0", fontSize: "12px", color: "var(--muted)" }}>
          Capabilities unlocked in this architectural milestone.
        </p>
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
        {capabilities.length === 0 ? (
          <span style={{ fontSize: "13px", color: "var(--muted)", fontStyle: "italic" }}>No specific scaling capabilities.</span>
        ) : (
          capabilities.map((cap, idx) => (
            <motion.div
              key={cap}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3, delay: idx * 0.08 }}
              whileHover={{ scale: 1.03 }}
              style={{
                background: "var(--brand-soft)",
                border: "1px solid rgba(249, 115, 22, 0.2)",
                borderRadius: "10px",
                padding: "10px 14px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                cursor: "default"
              }}
            >
              <span style={{ fontSize: "16px" }}>✨</span>
              <span style={{ fontSize: "12px", fontWeight: "700", color: "var(--brand-2)" }}>
                {cap}
              </span>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
