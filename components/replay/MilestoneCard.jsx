// components/replay/MilestoneCard.jsx

import React from "react";
import { motion } from "framer-motion";

export default function MilestoneCard({ event }) {
  const dateStr = new Date(event.timestamp).toLocaleDateString();

  return (
    <div
      className="card"
      style={{
        padding: "18px",
        backgroundColor: "var(--brand-soft)",
        border: "1.5px solid var(--brand)",
        display: "flex",
        gap: "16px",
        borderRadius: "14px",
        position: "relative",
        overflow: "hidden",
        boxShadow: "0 6px 15px rgba(99, 102, 241, 0.08)"
      }}
    >
      {/* Animated Badge Icon */}
      <motion.div
        style={{
          width: "48px",
          height: "48px",
          borderRadius: "50%",
          backgroundColor: "var(--brand)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "22px",
          color: "#ffffff",
          flexShrink: 0
        }}
        animate={{ rotate: [0, 10, -10, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      >
        🏆
      </motion.div>

      <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: "10px", fontWeight: "800", color: "var(--brand-2)", letterSpacing: "0.06em", textTransform: "uppercase" }}>
            ⭐ Milestone Breakthrough
          </span>
          <span style={{ fontSize: "10px", color: "var(--brand-2)" }}>{dateStr}</span>
        </div>

        <h4 style={{ margin: "2px 0", fontSize: "16px", fontWeight: "700", color: "var(--brand-2)", fontFamily: "Fraunces" }}>
          {event.title}
        </h4>
        <p style={{ margin: 0, fontSize: "12px", color: "var(--ink-2)", lineHeight: "1.4" }}>
          {event.description}
        </p>
      </div>
    </div>
  );
}
