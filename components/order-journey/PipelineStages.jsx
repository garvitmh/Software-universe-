"use client";

import React from "react";
import { motion } from "framer-motion";

const PIPELINE_STAGES = [
  { id: "customer", label: "Customer", icon: "👤" },
  { id: "app", label: "App", icon: "📱" },
  { id: "backend", label: "Backend", icon: "🖥️" },
  { id: "payment", label: "Payment", icon: "💳" },
  { id: "database", label: "Database", icon: "💽" },
  { id: "pos", label: "POS Terminal", icon: "🖨️" },
  { id: "kitchen", label: "Kitchen", icon: "🔥" },
  { id: "delivery", label: "Delivery", icon: "🛵" }
];

export default function PipelineStages({ activeEvent, events, currentEventIdx, onStageSelect }) {
  const activeStage = activeEvent ? activeEvent.stage : null;
  const progress = events.length > 0 ? (currentEventIdx + 1) / events.length : 0;

  return (
    <div style={{ overflowX: "auto", paddingBottom: 6 }}>
      <div style={{ position: "relative", minWidth: 860, padding: "10px 0" }}>
        {/* Background connector line */}
        <div style={{ position: "absolute", top: 35, left: 40, right: 40, height: 3, background: "var(--hairline-2)", borderRadius: 2 }} />
        {/* Animated active progress line */}
        <motion.div
          style={{ position: "absolute", top: 35, left: 40, height: 3, background: "var(--brand)", borderRadius: 2, transformOrigin: "left" }}
          animate={{ width: `${progress * 100}%` }}
          transition={{ duration: 0.3 }}
        />
        <div style={{ display: "flex", justifyContent: "space-between", position: "relative" }}>
          {PIPELINE_STAGES.map((s, idx) => {
            const isPassed = activeEvent && idx <= PIPELINE_STAGES.findIndex(p => p.id === activeStage);
            const isCurrent = activeStage === s.id;
            const hasError = activeEvent?.errorLink && activeStage === s.id;
            
            let bg = "var(--surface)";
            let border = "1px solid var(--hairline-2)";
            let color = "var(--muted)";
            
            if (isCurrent) {
              bg = hasError ? "var(--pop-pink)" : "var(--brand-soft)";
              border = `2px solid ${hasError ? "var(--brand)" : "var(--brand)"}`;
              color = hasError ? "#fff" : "var(--brand-2)";
            } else if (isPassed) {
              bg = "var(--brand)";
              border = "2px solid var(--brand)";
              color = "#fff";
            }

            return (
              <button
                key={s.id}
                onClick={() => onStageSelect(s.id)}
                style={{ background: "none", border: "none", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 8, width: 95, padding: 0 }}
              >
                <span style={{ 
                  width: 50, height: 50, borderRadius: "50%", background: bg, border: border, color: color,
                  display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20,
                  boxShadow: isCurrent ? "0 0 0 4px var(--brand-soft)" : "var(--shadow)",
                  transition: "all 0.25s ease"
                }}>
                  {s.icon}
                </span>
                <span style={{ fontSize: 12, fontWeight: isCurrent ? 700 : 500, color: isCurrent ? "var(--brand-2)" : "var(--ink-2)" }}>{s.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
