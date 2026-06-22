"use client";

import React from "react";
import { useUniverse } from "../UniverseContext";
import { motion } from "framer-motion";

export default function ArchitectJourney() {
  const { cognitiveState } = useUniverse();
  const milestones = cognitiveState.transformations?.milestones || [];
  const milestonesNames = milestones.map(m => m.name);

  const achievements = [
    {
      name: "First Queue Buffer",
      description: "Asynchronously buffer API transactions to decouple dependencies.",
      badge: "📬",
      key: "FIRST_QUEUE"
    },
    {
      name: "First Exponential Retry",
      description: "Configure retries with backoffs and jitter to prevent self-inflicted DDoS.",
      badge: "🔁",
      key: "FIRST_RETRY"
    },
    {
      name: "Tradeoff Analysis Mastery",
      description: "Weigh implementation simplicity against high-scale overhead.",
      badge: "⚖️",
      key: "Tradeoff Analysis Mastery"
    },
    {
      name: "Constraint Realization",
      description: "Recognize that developer bandwidth dominates over theoretical scale.",
      badge: "🧱",
      key: "Constraint Realization"
    },
    {
      name: "Blameless SRE Scribing",
      description: "Transition from diagnostic blame to structural SRE postmortems.",
      badge: "📝",
      key: "Blameless SRE Scribing"
    }
  ];

  return (
    <motion.div
      className="card"
      style={{ padding: "26px", display: "flex", flexDirection: "column", gap: "18px" }}
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div>
        <span className="eyebrow" style={{ color: "var(--brand)" }}>Apprentice Badges</span>
        <h3 style={{ margin: "4px 0 0 0", fontSize: "22px" }}>Architect Journey Achievements</h3>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
        {achievements.map((ach, i) => {
          // Check if unlocked. The first two are unlocked by default in mock initial state, others are checked from milestones.
          const isUnlocked = ach.key === "FIRST_QUEUE" || ach.key === "FIRST_RETRY" || milestonesNames.includes(ach.key);

          return (
            <div key={i} style={{
              display: "flex",
              gap: "12px",
              alignItems: "center",
              padding: "14px",
              borderRadius: "14px",
              background: isUnlocked ? "var(--surface)" : "var(--bg-2)",
              border: `1.5px solid ${isUnlocked ? "var(--hairline-2)" : "transparent"}`,
              opacity: isUnlocked ? 1 : 0.45,
              transition: "all 0.3s ease"
            }}>
              <div style={{
                fontSize: "24px",
                width: "48px",
                height: "48px",
                borderRadius: "10px",
                background: isUnlocked ? "var(--brand-soft)" : "var(--hairline-2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0
              }}>
                {ach.badge}
              </div>
              <div>
                <div style={{
                  fontSize: "13.5px",
                  fontWeight: "700",
                  color: isUnlocked ? "var(--ink)" : "var(--muted)"
                }}>
                  {ach.name} {isUnlocked && "✅"}
                </div>
                <div style={{ fontSize: "11px", color: "var(--muted)", lineHeight: "1.4", marginTop: "3px" }}>
                  {ach.description}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
