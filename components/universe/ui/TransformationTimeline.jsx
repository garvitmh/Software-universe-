"use client";

import React from "react";
import { useUniverse } from "../UniverseContext";
import { useTransformation } from "../../../hooks/useTransformation";
import { motion } from "framer-motion";

export default function TransformationTimeline() {
  const { cognitiveState } = useUniverse();
  const { milestones } = useTransformation();
  const currentStage = cognitiveState.learnerState?.stage || "BEGINNER";

  const stages = [
    { key: "BEGINNER", label: "Beginner" },
    { key: "APPRENTICE", label: "Apprentice" },
    { key: "PRACTITIONER", label: "Practitioner" },
    { key: "SENIOR", label: "Senior" },
    { key: "ARCHITECT", label: "Architect" },
    { key: "SYSTEM_THINKER", label: "System Thinker" }
  ];

  const currentIdx = stages.findIndex(s => s.key === currentStage);

  return (
    <motion.div
      className="card"
      style={{ padding: "26px", display: "flex", flexDirection: "column", gap: "22px" }}
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div>
        <span className="eyebrow" style={{ color: "var(--brand)" }}>Growth Chronicle</span>
        <h3 style={{ margin: "4px 0 0 0", fontSize: "22px" }}>Transformation Timeline</h3>
      </div>

      {/* Visual Timeline Nodes */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", position: "relative", padding: "10px 0" }}>
        {/* Horizontal connector line */}
        <div style={{
          position: "absolute",
          left: 0,
          right: 0,
          height: "4px",
          backgroundColor: "var(--hairline-2)",
          zIndex: 0
        }} />
        <div style={{
          position: "absolute",
          left: 0,
          width: `${(currentIdx / (stages.length - 1)) * 100}%`,
          height: "4px",
          background: "var(--grad-sunset)",
          zIndex: 0,
          transition: "width 0.4s ease"
        }} />

        {stages.map((stage, i) => {
          const isActive = i <= currentIdx;
          const isCurrent = i === currentIdx;

          return (
            <div key={stage.key} style={{ display: "flex", flexDirection: "column", alignItems: "center", position: "relative", zIndex: 1, width: "60px" }}>
              <motion.div
                whileHover={{ scale: 1.15 }}
                style={{
                  width: "28px",
                  height: "28px",
                  borderRadius: "50%",
                  backgroundColor: isCurrent ? "var(--pop-pink)" : isActive ? "var(--brand)" : "var(--bg-2)",
                  border: `3px solid ${isActive ? "#ffffff" : "var(--hairline-2)"}`,
                  boxShadow: isActive ? "0 4px 10px rgba(99, 102, 241, 0.4)" : "none",
                  cursor: "pointer",
                  transition: "background-color 0.3s ease"
                }}
              />
              <span style={{
                fontSize: "10.5px",
                fontWeight: isCurrent ? "700" : "600",
                color: isCurrent ? "var(--pop-pink)" : isActive ? "var(--ink)" : "var(--faint)",
                textAlign: "center",
                marginTop: "8px",
                whiteSpace: "nowrap",
                transition: "color 0.3s ease"
              }}>
                {stage.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Transformations milestones */}
      <div style={{ borderTop: "1px solid var(--hairline)", paddingTop: "18px" }}>
        <h4 style={{ margin: "0 0 12px 0", fontSize: "14px", fontWeight: "700", color: "var(--ink-2)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
          🏆 Active Milestones Reached
        </h4>
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {milestones.map((m, i) => (
            <div key={i} style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "10px 14px",
              borderRadius: "10px",
              background: "var(--surface-warm)",
              border: "1.5px solid var(--hairline)"
            }}>
              <span style={{ fontSize: "20px" }}>🎉</span>
              <div>
                <div style={{ fontSize: "13.5px", fontWeight: "700", color: "var(--ink)" }}>{m.name}</div>
                <div style={{ fontSize: "12px", color: "var(--muted)" }}>{m.detail}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
