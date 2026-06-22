"use client";

import React from "react";
import { motion } from "framer-motion";

export default function PressurePanel({ pressures }) {
  const pressureMetrics = [
    { label: "Traffic Volume", value: pressures.traffic, icon: "📈", color: "var(--brand)" },
    { label: "Latency Pressure", value: pressures.latency, icon: "⏱️", color: "var(--amber)" },
    { label: "Availability Demand", value: pressures.availability, icon: "🟢", color: "var(--teal)" },
    { label: "Cost Constraints", value: pressures.cost, icon: "💳", color: "var(--muted)" },
    { label: "Team Size Limits", value: pressures.teamSize, icon: "👥", color: "var(--pop-pink)" }
  ];

  return (
    <div className="card" style={{ padding: "20px 24px", display: "flex", flexDirection: "column", gap: "16px" }}>
      <div>
        <span className="eyebrow" style={{ color: "var(--brand)" }}>Evolutionary Forces</span>
        <h3 style={{ margin: "2px 0 0 0", fontSize: "18px" }}>System Pressures</h3>
        <p style={{ margin: "4px 0 0 0", fontSize: "12px", color: "var(--muted)" }}>
          The active pressures forcing the organization to redesign the system architecture.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "10px" }}>
        {pressureMetrics.map((m) => (
          <div key={m.label} style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            background: "var(--bg-2)",
            padding: "8px 12px",
            borderRadius: "8px",
            border: "1px solid var(--hairline-2)"
          }}>
            <span style={{ fontSize: "16px" }}>{m.icon}</span>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <span style={{ fontSize: "11px", fontWeight: "700", color: "var(--ink-2)" }}>{m.label}</span>
                <span style={{ fontSize: "11px", fontWeight: "700", color: m.color }}>{m.value}/100</span>
              </div>
              <div style={{ height: "4px", borderRadius: "2px", background: "var(--hairline-2)", marginTop: "4px", overflow: "hidden" }}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${m.value}%` }}
                  transition={{ duration: 0.5 }}
                  style={{ height: "100%", background: m.color }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
