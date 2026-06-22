"use client";

import React from "react";
import { motion } from "framer-motion";

const SEVERITY_COLORS = {
  SEV1: { bg: "rgba(255,77,141,0.12)", color: "var(--pop-pink)", border: "rgba(255,77,141,0.3)" },
  SEV2: { bg: "rgba(249,115,22,0.12)", color: "#F97316", border: "rgba(249,115,22,0.3)" },
  SEV3: { bg: "var(--amber-soft)", color: "var(--amber)", border: "rgba(133,79,11,0.2)" },
  SEV4: { bg: "rgba(45,125,246,0.12)", color: "var(--pop-blue)", border: "rgba(45,125,246,0.3)" }
};

export default function AlertCard({ alert, index = 0 }) {
  const sev = alert.severity || "SEV2";
  const colors = SEVERITY_COLORS[sev] || SEVERITY_COLORS.SEV2;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.35, delay: index * 0.08 }}
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: "12px",
        padding: "12px 14px",
        borderRadius: "10px",
        background: colors.bg,
        border: `1px solid ${colors.border}`
      }}
    >
      {/* Severity dot */}
      <div style={{ marginTop: "3px", flexShrink: 0 }}>
        {sev === "SEV1" ? (
          <motion.div
            animate={{ scale: [1, 1.3, 1], opacity: [1, 0.6, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
            style={{ width: "10px", height: "10px", borderRadius: "50%", backgroundColor: colors.color }}
          />
        ) : (
          <div style={{ width: "10px", height: "10px", borderRadius: "50%", backgroundColor: colors.color }} />
        )}
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
          <span style={{ fontSize: "13px", fontWeight: "700", color: colors.color }}>{alert.alert}</span>
          <span style={{
            fontSize: "10px", fontWeight: "700", padding: "2px 7px", borderRadius: "999px",
            background: colors.bg, color: colors.color, border: `1px solid ${colors.border}`,
            letterSpacing: "0.05em"
          }}>
            {sev}
          </span>
        </div>
        <div style={{ display: "flex", gap: "16px", marginTop: "4px", fontSize: "11px", color: "var(--muted)" }}>
          <span>Threshold: <strong style={{ color: "var(--ink-2)" }}>{alert.threshold}</strong></span>
          <span>Current: <strong style={{ color: colors.color }}>{alert.currentValue}</strong></span>
        </div>
      </div>
    </motion.div>
  );
}
