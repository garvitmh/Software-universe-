"use client";

import React from "react";
import { useUniverse } from "../UniverseContext";
import { motion } from "framer-motion";

export default function StrengthPanel() {
  const { cognitiveState } = useUniverse();
  
  // Collect strengths from reflection and architecture state
  const reflectionStrengths = cognitiveState.reflection?.strengths || [];
  const archStrengths = cognitiveState.architectureState?.strengths || [];
  
  // Deduplicate and combine
  const allStrengths = Array.from(new Set([...reflectionStrengths, ...archStrengths]));

  return (
    <motion.div
      className="card"
      style={{
        padding: "24px",
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        backgroundColor: "rgba(47, 191, 113, 0.03)",
        border: "1.5px solid rgba(47, 191, 113, 0.15)"
      }}
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      whileHover={{ scale: 1.01 }}
    >
      <div>
        <span className="eyebrow" style={{ color: "var(--pop-lime)" }}>SRE Strengths</span>
        <h3 style={{ margin: "4px 0 0 0", fontSize: "20px", color: "var(--teal)" }}>Active Capabilities</h3>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {allStrengths.length === 0 ? (
          <div style={{ fontSize: "13px", color: "var(--muted)" }}>No active strengths detected yet.</div>
        ) : (
          allStrengths.map((strength, idx) => (
            <div
              key={idx}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "10px",
                padding: "10px 12px",
                borderRadius: "8px",
                backgroundColor: "rgba(47, 191, 113, 0.08)",
                border: "1px solid rgba(47, 191, 113, 0.15)",
                fontSize: "13px",
                color: "var(--teal)",
                lineHeight: "1.5"
              }}
            >
              <span style={{ fontSize: "16px", flexShrink: 0 }}>🛡️</span>
              <span>{strength}</span>
            </div>
          ))
        )}
      </div>
    </motion.div>
  );
}
