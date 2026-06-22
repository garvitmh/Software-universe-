"use client";

import React from "react";
import { motion } from "framer-motion";

export default function ScalePanel({ scale, name }) {
  return (
    <div className="card" style={{ padding: "20px 24px", display: "flex", flexDirection: "column", gap: "12px" }}>
      <div>
        <span className="eyebrow" style={{ color: "var(--brand)" }}>Telemetry Scale</span>
        <h3 style={{ margin: "2px 0 0 0", fontSize: "18px" }}>Active Workload Scale</h3>
      </div>
      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        style={{
          background: "var(--bg-2)",
          border: "1px solid var(--hairline)",
          padding: "20px",
          borderRadius: "12px",
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          gap: "6px"
        }}
      >
        <span style={{ fontSize: "11px", color: "var(--muted)", textTransform: "uppercase", fontWeight: "600" }}>
          {name} Live Throughput Capacity
        </span>
        <div style={{
          fontSize: "24px",
          fontWeight: "800",
          color: "var(--brand-2)",
          fontFamily: "Fraunces, Georgia, serif"
        }}>
          {scale}
        </div>
      </motion.div>
    </div>
  );
}
