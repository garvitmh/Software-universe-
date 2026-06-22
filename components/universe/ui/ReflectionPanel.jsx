"use client";

import React from "react";
import { useUniverse } from "../UniverseContext";
import { motion } from "framer-motion";

export default function ReflectionPanel() {
  const { cognitiveState } = useUniverse();
  const reflection = cognitiveState.reflection || { strengths: [], blindSpots: [], growthAreas: [], nextBreakthrough: "" };

  return (
    <motion.div
      className="card"
      style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "20px" }}
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <div>
        <span className="eyebrow" style={{ color: "var(--brand)" }}>Apprentice Audit</span>
        <h3 style={{ margin: "4px 0 0 0", fontSize: "22px" }}>Self Reflection</h3>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
        {/* Strengths Card */}
        <div style={{
          padding: "16px",
          borderRadius: "12px",
          backgroundColor: "rgba(47, 191, 113, 0.08)",
          border: "1.5px solid rgba(47, 191, 113, 0.2)"
        }}>
          <h4 style={{ margin: "0 0 10px 0", fontSize: "14px", fontWeight: "700", color: "var(--teal)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
            🟢 Mapped Strengths
          </h4>
          <ul style={{ margin: 0, paddingLeft: "16px", fontSize: "13px", color: "var(--ink-2)", lineHeight: "1.6" }}>
            {reflection.strengths.map((str, i) => (
              <li key={i} style={{ marginBottom: "6px" }}>{str}</li>
            ))}
          </ul>
        </div>

        {/* Blind Spots Card */}
        <div style={{
          padding: "16px",
          borderRadius: "12px",
          backgroundColor: "rgba(255, 178, 62, 0.08)",
          border: "1.5px solid rgba(255, 178, 62, 0.2)"
        }}>
          <h4 style={{ margin: "0 0 10px 0", fontSize: "14px", fontWeight: "700", color: "var(--amber)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
            🟠 Blind Spots
          </h4>
          <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginTop: "4px" }}>
            {reflection.blindSpots.map((spot, i) => (
              <span key={i} className="pill" style={{ background: "var(--amber-soft)", color: "var(--amber)", fontSize: "11px" }}>
                {spot}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Next Breakthrough & Growth areas */}
      <div style={{ borderTop: "1px solid var(--hairline)", paddingTop: "16px" }}>
        <h4 style={{ margin: "0 0 8px 0", fontSize: "14px", fontWeight: "600", color: "var(--muted)" }}>
          Next Breakthrough Milestone
        </h4>
        <div style={{
          padding: "14px 16px",
          borderRadius: "12px",
          background: "var(--grad-sunset)",
          color: "#ffffff",
          fontWeight: "700",
          fontSize: "15px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          boxShadow: "0 8px 20px -8px var(--pop-pink)"
        }}>
          <span>{reflection.nextBreakthrough}</span>
          <span style={{ fontSize: "18px" }}>🚀</span>
        </div>
      </div>
    </motion.div>
  );
}
