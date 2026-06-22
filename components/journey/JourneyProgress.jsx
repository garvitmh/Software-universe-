"use client";

import React from "react";
import { motion } from "framer-motion";

export default function JourneyProgress({ progress }) {
  if (!progress) return null;

  const { title, description, color, completedCount, totalSteps, percentage } = progress;

  return (
    <div className="card" style={{
      padding: "24px",
      display: "flex",
      flexDirection: "column",
      gap: "16px",
      background: `linear-gradient(135deg, var(--surface) 0%, var(--surface-warm) 100%)`,
      position: "relative",
      overflow: "hidden"
    }}>
      {/* Decorative colored glow on top right */}
      <div style={{
        position: "absolute",
        right: "-20px",
        top: "-20px",
        width: "120px",
        height: "120px",
        borderRadius: "50%",
        backgroundColor: color,
        opacity: 0.08,
        filter: "blur(20px)",
        pointerEvents: "none"
      }} />

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "16px" }}>
        <div>
          <span className="eyebrow" style={{ color: color }}>Active Track</span>
          <h2 style={{ fontSize: "24px", fontWeight: "600", color: "var(--ink)", margin: "4px 0" }}>{title}</h2>
          <p style={{ fontSize: "14px", color: "var(--muted)", margin: 0 }}>{description}</p>
        </div>

        <div style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
          gap: "2px"
        }}>
          <span style={{ fontSize: "28px", fontWeight: "700", color: color }}>
            {percentage}%
          </span>
          <span style={{ fontSize: "12px", color: "var(--muted)", fontWeight: "600" }}>
            {completedCount} / {totalSteps} Steps Complete
          </span>
        </div>
      </div>

      {/* Progress track */}
      <div style={{
        width: "100%",
        height: "10px",
        borderRadius: "5px",
        backgroundColor: "var(--bg-2)",
        overflow: "hidden",
        border: "1px solid var(--hairline)"
      }}>
        <motion.div
          style={{
            height: "100%",
            backgroundColor: color,
            borderRadius: "5px"
          }}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}
