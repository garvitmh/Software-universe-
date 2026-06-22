"use client";

import React from "react";
import { useUniverse } from "../UniverseContext";
import { motion } from "framer-motion";

export default function WeaknessPanel() {
  const { cognitiveState } = useUniverse();
  
  // Collect weaknesses from reflection (blind spots) and architecture state
  const blindSpots = cognitiveState.reflection?.blindSpots || [];
  const archWeaknesses = cognitiveState.architectureState?.weaknesses || [];
  
  // Format nicely
  const blindSpotItems = blindSpots.map(spot => `Conceptual blind spot: ${spot}`);
  const allWeaknesses = Array.from(new Set([...blindSpotItems, ...archWeaknesses]));

  return (
    <motion.div
      className="card"
      style={{
        padding: "24px",
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        backgroundColor: "rgba(255, 178, 62, 0.03)",
        border: "1.5px solid rgba(255, 178, 62, 0.15)"
      }}
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.35 }}
      whileHover={{ scale: 1.01 }}
    >
      <div>
        <span className="eyebrow" style={{ color: "var(--pop-yellow)" }}>Blind Spots</span>
        <h3 style={{ margin: "4px 0 0 0", fontSize: "20px", color: "var(--amber)" }}>Architectural Gaps</h3>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {allWeaknesses.length === 0 ? (
          <div style={{ fontSize: "13px", color: "var(--muted)" }}>All gaps resolved. Systems thinking status optimal.</div>
        ) : (
          allWeaknesses.map((weakness, idx) => (
            <div
              key={idx}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "10px",
                padding: "10px 12px",
                borderRadius: "8px",
                backgroundColor: "rgba(255, 178, 62, 0.08)",
                border: "1px solid rgba(255, 178, 62, 0.15)",
                fontSize: "13px",
                color: "var(--amber)",
                lineHeight: "1.5"
              }}
            >
              <span style={{ fontSize: "16px", flexShrink: 0 }}>⚠️</span>
              <span>{weakness}</span>
            </div>
          ))
        )}
      </div>
    </motion.div>
  );
}
