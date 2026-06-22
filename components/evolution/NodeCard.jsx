"use client";

import React from "react";
import { motion } from "framer-motion";

const NODE_TYPES = {
  client: { icon: "💻", color: "var(--teal)", label: "Client" },
  lb: { icon: "🔀", color: "var(--pop-blue)", label: "Load Balancer" },
  api: { icon: "⚙️", color: "var(--brand)", label: "API App Server" },
  db: { icon: "🗄️", color: "var(--brand-2)", label: "SQL Database" },
  cache: { icon: "⚡", color: "var(--amber)", label: "Cache Storage" },
  queue: { icon: "📥", color: "var(--pop-pink)", label: "Message Queue" },
  worker: { icon: "👷", color: "var(--brand-soft)", label: "Task Worker" },
  replica: { icon: "📑", color: "var(--teal-soft)", label: "Read Replica" },
  cdn: { icon: "🌍", color: "var(--pop-blue)", label: "CDN Cache Edge" }
};

const STATE_EFFECTS = {
  healthy: {
    border: "1px solid var(--hairline)",
    background: "var(--surface)",
    glow: "rgba(16, 185, 129, 0.08)",
    pulse: 0
  },
  stressed: {
    border: "1px solid var(--amber)",
    background: "rgba(245, 158, 11, 0.05)",
    glow: "rgba(245, 158, 11, 0.25)",
    pulse: 2
  },
  bottleneck: {
    border: "1px solid rgb(239, 68, 68)",
    background: "rgba(239, 68, 68, 0.05)",
    glow: "rgba(239, 68, 68, 0.35)",
    pulse: 1
  }
};

export default function NodeCard({ label, type, status, x, y }) {
  const nodeConfig = NODE_TYPES[type] || NODE_TYPES.api;
  const stateConfig = STATE_EFFECTS[status] || STATE_EFFECTS.healthy;

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.8, opacity: 0 }}
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.4, type: "spring" }}
      style={{
        position: "absolute",
        left: `${x}%`,
        top: `${y}%`,
        transform: "translate(-50%, -50%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "6px",
        zIndex: 10,
        cursor: "pointer"
      }}
    >
      {/* Node Container */}
      <motion.div
        animate={{
          boxShadow: [
            `0 4px 12px rgba(0,0,0,0.06), 0 0 0px ${stateConfig.glow}`,
            `0 4px 16px rgba(0,0,0,0.08), 0 0 14px ${stateConfig.glow}`,
            `0 4px 12px rgba(0,0,0,0.06), 0 0 0px ${stateConfig.glow}`
          ]
        }}
        transition={{
          repeat: Infinity,
          duration: stateConfig.pulse === 1 ? 1.2 : stateConfig.pulse === 2 ? 2.5 : 0,
          ease: "easeInOut"
        }}
        style={{
          width: "48px",
          height: "48px",
          borderRadius: "14px",
          background: stateConfig.background,
          border: stateConfig.border,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "22px",
          position: "relative"
        }}
      >
        {nodeConfig.icon}

        {/* Status indicator pin */}
        {status !== "healthy" && (
          <span style={{
            position: "absolute",
            top: "-4px",
            right: "-4px",
            width: "10px",
            height: "10px",
            borderRadius: "50%",
            backgroundColor: status === "bottleneck" ? "rgb(239, 68, 68)" : "var(--amber)",
            boxShadow: `0 0 6px ${status === "bottleneck" ? "rgb(239, 68, 68)" : "var(--amber)"}`
          }} />
        )}
      </motion.div>

      {/* Label Box */}
      <div style={{
        background: "var(--surface)",
        border: "1px solid var(--hairline-2)",
        padding: "3px 8px",
        borderRadius: "6px",
        fontSize: "11px",
        fontWeight: "700",
        whiteSpace: "nowrap",
        color: "var(--ink)",
        boxShadow: "0 2px 6px rgba(0,0,0,0.04)"
      }}>
        {label}
      </div>
    </motion.div>
  );
}
