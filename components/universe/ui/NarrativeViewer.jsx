"use client";

import React from "react";
import { useUniverse } from "../UniverseContext";
import { motion } from "framer-motion";

export default function NarrativeViewer() {
  const { cognitiveState } = useUniverse();
  const narrative = cognitiveState.narrative || "Your architectural journey is unfolding...";

  return (
    <motion.div
      className="card"
      style={{
        padding: "28px",
        background: "var(--surface)",
        position: "relative",
        overflow: "hidden"
      }}
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Visual background ambient gradient */}
      <div style={{
        position: "absolute",
        right: "-80px",
        top: "-80px",
        width: "250px",
        height: "250px",
        borderRadius: "50%",
        background: "radial-gradient(circle, var(--grad-1), transparent 70%)",
        pointerEvents: "none",
        zIndex: 0
      }} />

      <div style={{ position: "relative", zIndex: 1 }}>
        <span className="eyebrow" style={{ color: "var(--brand)" }}>Staff Architect's Log</span>
        <h3 style={{ margin: "6px 0 16px 0", fontSize: "24px", fontFamily: "Fraunces, Georgia, serif" }}>
          Chronicle of Transformation
        </h3>

        <div style={{
          paddingLeft: "16px",
          borderLeft: "3px solid var(--pop-yellow)",
          fontSize: "16.5px",
          lineHeight: "1.7",
          color: "var(--ink-2)",
          fontStyle: "italic",
          marginBottom: "16px"
        }}>
          {narrative}
        </div>

        <div style={{ display: "flex", gap: "10px", marginTop: "24px", borderTop: "1px solid var(--hairline)", paddingTop: "18px" }}>
          <div style={{ flexShrink: 0 }}>
            <span style={{ fontSize: "20px" }}>💡</span>
          </div>
          <p style={{ fontSize: "13px", color: "var(--muted)", margin: 0, lineHeight: "1.5" }}>
            <strong>Architectural Insight:</strong> Real architects don't design for unlimited scalability. They build for the specific operational forces of today, while ensuring the code paths can adapt gracefully tomorrow.
          </p>
        </div>
      </div>
    </motion.div>
  );
}
