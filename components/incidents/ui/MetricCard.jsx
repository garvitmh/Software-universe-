"use client";

import React from "react";
import { motion } from "framer-motion";

export default function MetricCard({ label, value, unit, history, color, sparkColor, index = 0 }) {
  // Simple inline sparkline using SVG
  const maxVal = Math.max(...(history || [1]), 1);
  const w = 100, h = 36;
  const pts = (history || []).map((v, i) => {
    const x = (i / Math.max(history.length - 1, 1)) * w;
    const y = h - (v / maxVal) * h;
    return `${x},${y}`;
  }).join(" ");

  return (
    <motion.div
      className="card"
      style={{
        padding: "14px 16px",
        display: "flex",
        flexDirection: "column",
        gap: "8px",
        borderLeft: `3px solid ${color || "var(--brand)"}`,
        background: "var(--surface)"
      }}
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      <span style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.07em", color: "var(--muted)", fontWeight: "600" }}>
        {label}
      </span>
      <div style={{ display: "flex", alignItems: "baseline", gap: "4px" }}>
        <span style={{ fontSize: "22px", fontWeight: "800", color: color || "var(--ink)", fontFamily: "JetBrains Mono, monospace", lineHeight: 1 }}>
          {typeof value === "number" ? value.toLocaleString() : value}
        </span>
        {unit && <span style={{ fontSize: "11px", color: "var(--muted)", fontWeight: "600" }}>{unit}</span>}
      </div>
      {history && history.length > 1 && (
        <svg width="100%" height={h} viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" style={{ overflow: "visible" }}>
          <defs>
            <linearGradient id={`grad-${label}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={sparkColor || color || "var(--brand)"} stopOpacity="0.3" />
              <stop offset="100%" stopColor={sparkColor || color || "var(--brand)"} stopOpacity="0" />
            </linearGradient>
          </defs>
          <polyline
            points={pts}
            fill="none"
            stroke={sparkColor || color || "var(--brand)"}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <polygon
            points={`0,${h} ${pts} ${w},${h}`}
            fill={`url(#grad-${label})`}
          />
        </svg>
      )}
    </motion.div>
  );
}
