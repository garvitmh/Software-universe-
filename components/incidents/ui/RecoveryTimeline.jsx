"use client";

import React from "react";
import { motion } from "framer-motion";
import { useIncidentContext } from "../IncidentContext";

const MILESTONES = [
  { id: "Detection", icon: "🚨", description: "Alert fires, on-call paged" },
  { id: "Investigation", icon: "🔍", description: "Logs, traces, metrics analyzed" },
  { id: "Mitigation", icon: "🛠", description: "Remediation applied" },
  { id: "Verification", icon: "✅", description: "System health confirmed" },
  { id: "Resolved", icon: "🎉", description: "Incident closed, MTTR logged" }
];

const STEP_TO_STAGE = { 0: 0, 1: 1, 2: 2, 3: 2, 4: 4 };

export default function RecoveryTimeline() {
  const { activeStep, recovery } = useIncidentContext();
  const currentStageIndex = STEP_TO_STAGE[activeStep] ?? 0;

  return (
    <div className="card" style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "16px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <span className="eyebrow" style={{ color: "var(--muted)" }}>SRE Timeline</span>
          <h3 style={{ margin: "2px 0 0 0", fontSize: "16px" }}>Recovery Milestones</h3>
        </div>
        {activeStep === 4 && (
          <div style={{ textAlign: "right" }}>
            <span style={{ fontSize: "10px", color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>MTTR</span>
            <div style={{ fontSize: "18px", fontWeight: "800", color: "var(--teal)", fontFamily: "JetBrains Mono, monospace" }}>
              {recovery?.mttr || "38 min"}
            </div>
          </div>
        )}
      </div>

      {/* Horizontal timeline */}
      <div style={{ display: "flex", alignItems: "flex-start", gap: "0", overflowX: "auto" }}>
        {MILESTONES.map((milestone, idx) => {
          const isDone = idx <= currentStageIndex;
          const isCurrent = idx === currentStageIndex;

          return (
            <div key={milestone.id} style={{ display: "flex", alignItems: "flex-start", flex: 1, minWidth: "80px" }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px", flex: 1 }}>
                {/* Node */}
                <motion.div
                  animate={isCurrent ? { scale: [1, 1.15, 1] } : {}}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  style={{
                    width: "36px", height: "36px", borderRadius: "50%",
                    background: isDone
                      ? isCurrent ? "var(--brand)" : "var(--teal)"
                      : "var(--bg-2)",
                    border: isCurrent ? "3px solid var(--brand-soft)" : isDone ? "2px solid var(--teal)" : "2px solid var(--hairline-2)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "14px",
                    boxShadow: isCurrent ? "0 0 12px rgba(99,102,241,0.4)" : "none",
                    transition: "all 0.3s ease"
                  }}
                >
                  {isDone ? milestone.icon : <span style={{ fontSize: "12px", color: "var(--faint)", fontWeight: "700" }}>{idx + 1}</span>}
                </motion.div>
                {/* Label */}
                <div style={{ textAlign: "center" }}>
                  <span style={{
                    fontSize: "11px", fontWeight: isCurrent ? "700" : "600",
                    color: isCurrent ? "var(--brand)" : isDone ? "var(--teal)" : "var(--faint)"
                  }}>
                    {milestone.id}
                  </span>
                  <p style={{ margin: "2px 0 0 0", fontSize: "9px", color: "var(--faint)", lineHeight: 1.3 }}>
                    {milestone.description}
                  </p>
                </div>
              </div>

              {/* Connector line */}
              {idx < MILESTONES.length - 1 && (
                <div style={{
                  height: "2px",
                  flex: 1,
                  background: idx < currentStageIndex ? "var(--teal)" : "var(--hairline-2)",
                  marginTop: "18px",
                  transition: "background 0.5s ease"
                }} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
