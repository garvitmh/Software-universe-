"use client";

import React from "react";
import { motion } from "framer-motion";

const STATUS_COLORS = {
  SUCCESS: { color: "var(--teal)", bg: "var(--teal-soft)", icon: "✓" },
  FAILED: { color: "var(--pop-pink)", bg: "var(--pink-soft)", icon: "✗" },
  RETRYING: { color: "#F97316", bg: "rgba(249,115,22,0.1)", icon: "↻" },
  TIMEOUT: { color: "var(--amber)", bg: "var(--amber-soft)", icon: "⏱" }
};

export function SpanTree({ span, depth = 0 }) {
  const statusStyle = STATUS_COLORS[span.status] || STATUS_COLORS.SUCCESS;

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3, delay: depth * 0.08 }}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          padding: "8px 10px",
          marginLeft: `${depth * 20}px`,
          borderLeft: depth > 0 ? `2px solid var(--hairline)` : "none",
          position: "relative"
        }}
      >
        {/* Connector line */}
        {depth > 0 && (
          <div style={{
            position: "absolute",
            left: "-1px",
            top: "50%",
            width: "12px",
            height: "1px",
            background: "var(--hairline)"
          }} />
        )}

        {/* Status icon */}
        <span style={{
          width: "22px", height: "22px", borderRadius: "5px",
          background: statusStyle.bg, color: statusStyle.color,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "11px", fontWeight: "800", flexShrink: 0
        }}>
          {statusStyle.icon}
        </span>

        {/* Span name */}
        <span style={{ fontSize: "13px", fontWeight: "600", color: "var(--ink)", flex: 1 }}>
          {span.name}
        </span>

        {/* Duration bar */}
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <div style={{
            height: "6px", borderRadius: "3px",
            width: `${Math.min(span.duration / 10, 120)}px`,
            background: statusStyle.color,
            opacity: 0.6
          }} />
          <span style={{
            fontSize: "11px", fontFamily: "JetBrains Mono, monospace",
            color: statusStyle.color, fontWeight: "700", minWidth: "50px", textAlign: "right"
          }}>
            {span.duration}ms
          </span>
          <span style={{
            fontSize: "10px", padding: "1px 6px", borderRadius: "4px",
            background: statusStyle.bg, color: statusStyle.color, fontWeight: "700"
          }}>
            {span.status}
          </span>
        </div>
      </motion.div>

      {/* Recursive children */}
      {span.children?.map((child, idx) => (
        <SpanTree key={idx} span={child} depth={depth + 1} />
      ))}
    </div>
  );
}

export default SpanTree;
