"use client";

import React from "react";
import { useUniverse } from "../UniverseContext";
import { useArchitectMoments } from "../../../hooks/useArchitectMoments";
import { motion } from "framer-motion";

export default function ArchitectMomentPanel() {
  const { cognitiveState } = useUniverse();
  const { moments } = useArchitectMoments();
  const milestones = cognitiveState.transformations?.milestones || [];

  // Map of moments to custom illustrations / emojis and colors
  const momentMeta = {
    "Tradeoff Analysis Mastery": {
      emoji: "⚖️",
      color: "var(--amber)",
      bgColor: "rgba(133, 79, 11, 0.08)",
      borderColor: "rgba(133, 79, 11, 0.2)"
    },
    "Constraint Realization": {
      emoji: "🧱",
      color: "var(--teal)",
      bgColor: "rgba(15, 110, 86, 0.08)",
      borderColor: "rgba(15, 110, 86, 0.2)"
    },
    "Blameless SRE Scribing": {
      emoji: "🛡️",
      color: "var(--pink)",
      bgColor: "rgba(153, 53, 86, 0.08)",
      borderColor: "rgba(153, 53, 86, 0.2)"
    },
    "Vibe Coding Foundations": {
      emoji: "👾",
      color: "var(--brand)",
      bgColor: "var(--brand-soft)",
      borderColor: "var(--hairline-2)"
    }
  };

  return (
    <motion.div
      className="card"
      style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "20px" }}
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.25 }}
    >
      <div>
        <span className="eyebrow" style={{ color: "var(--pop-purple)" }}>Hall of Realizations</span>
        <h3 style={{ margin: "4px 0 0 0", fontSize: "22px" }}>Architect Moments</h3>
      </div>

      <p style={{ fontSize: "14px", color: "var(--muted)", margin: 0 }}>
        Key milestones where your thinking shifted from code syntax to systems architecture.
      </p>

      {milestones.length === 0 ? (
        <div style={{
          padding: "20px",
          borderRadius: "12px",
          textAlign: "center",
          border: "1px dashed var(--hairline-2)",
          color: "var(--faint)",
          fontSize: "14px"
        }}>
          💡 Answer challenges in the Arena emphasizing tradeoffs or constraints to record your first Architect Moment.
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {milestones.map((m, idx) => {
            const meta = momentMeta[m.name] || {
              emoji: "⭐️",
              color: "var(--brand)",
              bgColor: "var(--brand-soft)",
              borderColor: "var(--hairline-2)"
            };

            return (
              <motion.div
                key={idx}
                style={{
                  padding: "16px",
                  borderRadius: "12px",
                  backgroundColor: meta.bgColor,
                  border: `1.5px solid ${meta.borderColor}`,
                  display: "flex",
                  alignItems: "center",
                  gap: "16px"
                }}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                whileHover={{ scale: 1.02 }}
              >
                <div style={{
                  fontSize: "24px",
                  width: "48px",
                  height: "48px",
                  borderRadius: "12px",
                  backgroundColor: "var(--surface)",
                  border: `1px solid ${meta.borderColor}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "var(--shadow)"
                }}>
                  {meta.emoji}
                </div>
                <div style={{ flex: 1 }}>
                  <h4 style={{ margin: "0 0 4px 0", fontSize: "15px", fontWeight: "700", color: meta.color }}>
                    {m.name}
                  </h4>
                  <p style={{ margin: 0, fontSize: "12.5px", color: "var(--ink-2)", lineHeight: "1.4" }}>
                    {m.detail}
                  </p>
                </div>
                <div style={{
                  fontSize: "11px",
                  fontWeight: "bold",
                  color: meta.color,
                  backgroundColor: "var(--surface)",
                  padding: "4px 8px",
                  borderRadius: "6px",
                  border: `1px solid ${meta.borderColor}`
                }}>
                  UNLOCKED
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
}
