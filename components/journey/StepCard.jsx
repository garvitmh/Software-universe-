"use client";

import React from "react";
import { motion } from "framer-motion";

export default function StepCard({ step, isSelected, onClick }) {
  const { title, icon, desc, unlocked, completed, concept, requiredMastery, milestone } = step;

  // Visual status
  let statusColor = "var(--muted)";
  let statusBg = "var(--bg-2)";
  let statusBorder = "var(--hairline)";
  let statusBadge = "🔒 Locked";

  if (completed) {
    statusColor = "var(--teal)";
    statusBg = "rgba(47, 191, 113, 0.08)";
    statusBorder = "rgba(47, 191, 113, 0.25)";
    statusBadge = "✅ Completed";
  } else if (unlocked) {
    statusColor = "var(--brand-2)";
    statusBg = "var(--brand-soft)";
    statusBorder = "var(--brand)";
    statusBadge = "⚡ Active";
  }

  return (
    <motion.div
      onClick={onClick}
      className="card"
      style={{
        padding: "16px",
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        cursor: "pointer",
        border: `1.5px solid ${isSelected ? "var(--brand)" : statusBorder}`,
        backgroundColor: statusBg,
        boxShadow: isSelected ? "0 4px 14px rgba(99, 102, 241, 0.2)" : "var(--shadow)",
        position: "relative",
        opacity: unlocked ? 1 : 0.6,
        transition: "border-color 0.2s ease, background-color 0.2s ease",
        minWidth: "180px",
        flex: "1"
      }}
      whileHover={unlocked ? { scale: 1.03, y: -2 } : {}}
      whileTap={unlocked ? { scale: 0.98 } : {}}
    >
      {/* Upper row: icon and badge */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{
          fontSize: "24px",
          width: "42px",
          height: "42px",
          borderRadius: "10px",
          backgroundColor: "var(--surface)",
          border: "1px solid var(--hairline-2)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}>
          {icon}
        </div>
        <span style={{
          fontSize: "11px",
          fontWeight: "bold",
          color: statusColor,
          backgroundColor: "var(--surface)",
          padding: "3px 8px",
          borderRadius: "6px",
          border: `1px solid ${statusBorder}`
        }}>
          {statusBadge}
        </span>
      </div>

      {/* Title & Desc */}
      <div style={{ display: "flex", flexDirection: "column", gap: "2px", marginTop: "4px" }}>
        <h4 style={{ fontSize: "14.5px", fontWeight: "700", color: "var(--ink)", margin: 0 }}>
          {title}
        </h4>
        <p style={{ fontSize: "12px", color: "var(--ink-2)", lineHeight: "1.4", margin: 0, height: "40px", overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
          {desc}
        </p>
      </div>

      {/* Requirement footnotes */}
      <div style={{
        marginTop: "6px",
        borderTop: "1px solid var(--hairline)",
        paddingTop: "8px",
        fontSize: "10.5px",
        color: "var(--muted)",
        fontWeight: "500"
      }}>
        {milestone ? (
          <span>Req: {milestone.replace(/_/g, " ")}</span>
        ) : concept ? (
          <span>Req: {concept} &ge; {requiredMastery}%</span>
        ) : (
          <span>Req: None</span>
        )}
      </div>
    </motion.div>
  );
}
