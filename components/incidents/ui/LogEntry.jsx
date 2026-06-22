"use client";

import React from "react";

const LEVEL_COLORS = {
  INFO: "var(--pop-blue)",
  WARN: "#F97316",
  ERROR: "var(--pop-pink)",
  CRITICAL: "#FF0000",
  FATAL: "#FF0000"
};

export default function LogEntry({ log, index = 0 }) {
  const level = (log.level || "INFO").toUpperCase();
  const color = LEVEL_COLORS[level] || "var(--muted)";

  const time = log.timestamp
    ? new Date(log.timestamp).toLocaleTimeString("en-US", { hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit" })
    : "00:00:00";

  return (
    <div
      style={{
        display: "flex",
        gap: "10px",
        padding: "3px 0",
        fontFamily: "JetBrains Mono, ui-monospace, monospace",
        fontSize: "12px",
        lineHeight: "1.5",
        borderBottom: "1px solid rgba(255,255,255,0.04)",
        animation: index === 0 ? "fadeIn 0.3s ease" : undefined
      }}
    >
      <span style={{ color: "rgba(148,163,184,0.5)", flexShrink: 0, minWidth: "72px" }}>
        {time}
      </span>
      <span style={{
        color, fontWeight: "700", flexShrink: 0, minWidth: "58px",
        textShadow: level === "ERROR" || level === "CRITICAL" || level === "FATAL" ? `0 0 8px ${color}60` : "none"
      }}>
        [{level}]
      </span>
      <span style={{ color: "rgba(148,163,184,0.7)", flexShrink: 0, minWidth: "100px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
        {log.service}
      </span>
      <span style={{
        color: level === "ERROR" || level === "CRITICAL" || level === "FATAL"
          ? "rgba(252,165,165,0.9)"
          : level === "WARN" ? "rgba(253,186,116,0.9)" : "rgba(226,232,240,0.8)",
        flex: 1,
        whiteSpace: "pre-wrap",
        wordBreak: "break-word"
      }}>
        {log.message}
      </span>
    </div>
  );
}
