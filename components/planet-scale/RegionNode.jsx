// components/planet-scale/RegionNode.jsx

import React from "react";
import { motion } from "framer-motion";

export default function RegionNode({ region, telemetry, isPrimary, isActive, onClick }) {
  const { users = 0, avgLatency = 0, status = "Healthy" } = telemetry;

  // Set colors based on status
  let statusColor = "var(--brand)";
  if (status === "Warning") statusColor = "var(--amber)";
  if (status === "Critical") statusColor = "var(--pink)";

  return (
    <div
      style={{
        position: "absolute",
        left: `${region.x}%`,
        top: `${region.y}%`,
        transform: "translate(-50%, -50%)",
        cursor: "pointer",
        zIndex: isActive ? 20 : 10,
        display: "flex",
        flexDirection: "column",
        alignItems: "center"
      }}
      onClick={onClick}
    >
      {/* Node Pulse Indicator */}
      <div style={{ position: "relative", width: "24px", height: "24px" }}>
        {status !== "Critical" && (
          <motion.div
            style={{
              position: "absolute",
              width: "100%",
              height: "100%",
              borderRadius: "50%",
              backgroundColor: statusColor,
              opacity: 0.4
            }}
            animate={{ scale: [1, 2.2, 1], opacity: [0.4, 0, 0.4] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        )}
        <div style={{
          width: "12px",
          height: "12px",
          borderRadius: "50%",
          backgroundColor: statusColor,
          border: "2px solid var(--bg-1)",
          position: "absolute",
          top: "6px",
          left: "6px",
          boxShadow: "0 0 10px rgba(0, 0, 0, 0.15)"
        }} />

        {isPrimary && (
          <div style={{
            position: "absolute",
            top: "-14px",
            left: "5px",
            fontSize: "10px",
            color: "var(--brand-2)",
            fontWeight: "bold",
            pointerEvents: "none"
          }} title="Primary Write Database DB">
            👑
          </div>
        )}
      </div>

      {/* Tiny Badge */}
      <div
        className="card"
        style={{
          marginTop: "4px",
          padding: "4px 8px",
          fontSize: "11px",
          display: "flex",
          flexDirection: "column",
          gap: "1px",
          alignItems: "center",
          backgroundColor: isActive ? "var(--brand-soft)" : "var(--surface)",
          border: isActive ? "1px solid var(--brand)" : "1px solid var(--hairline-2)",
          color: isActive ? "var(--brand-2)" : "var(--ink)",
          whiteSpace: "nowrap",
          borderRadius: "6px",
          boxShadow: "0 4px 10px rgba(0, 0, 0, 0.08)",
          transition: "all 0.2s ease"
        }}
      >
        <span style={{ fontWeight: "700", fontSize: "10px" }}>{region.id.toUpperCase()}</span>
        <span style={{ fontSize: "9px", color: "var(--muted)" }}>
          {status === "Critical" ? "DOWN" : `${(users / 1000).toFixed(1)}k users`}
        </span>
        {status !== "Critical" && (
          <span style={{ fontSize: "9px", fontWeight: "600", color: statusColor }}>
            {avgLatency}ms
          </span>
        )}
      </div>
    </div>
  );
}
