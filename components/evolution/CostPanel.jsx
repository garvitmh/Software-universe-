"use client";

import React from "react";
import { motion } from "framer-motion";

export default function CostPanel({ cost }) {
  const costMetrics = [
    {
      label: "Infrastructure Bill",
      value: cost.infra,
      color: "var(--brand)",
      description: "Hosting costs, database services, caching instances, and CDN bandwidth."
    },
    {
      label: "Operational Overhead",
      value: cost.operational,
      color: "var(--amber)",
      description: "Effort to maintain servers, monitor alarms, configure backups, and orchestrate deployments."
    },
    {
      label: "Team Cognitive Load",
      value: cost.cognitive,
      color: "rgb(239, 68, 68)",
      description: "How difficult it is for a new developer to understand the codebase and debug system issues."
    }
  ];

  return (
    <div className="card" style={{ padding: "20px 24px", display: "flex", flexDirection: "column", gap: "16px" }}>
      <div>
        <span className="eyebrow" style={{ color: "var(--brand)" }}>Complexity Price</span>
        <h3 style={{ margin: "2px 0 0 0", fontSize: "18px" }}>Cost Dimensions</h3>
        <p style={{ margin: "4px 0 0 0", fontSize: "12px", color: "var(--muted)" }}>
          Higher scale brings scalability, but it increases costs and complexity.
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
        {costMetrics.map((m) => (
          <div key={m.label} style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <span style={{ fontSize: "13px", fontWeight: "700", color: "var(--ink)" }}>{m.label}</span>
              <span style={{ fontSize: "13px", fontWeight: "800", color: m.color, fontFamily: "JetBrains Mono, monospace" }}>
                {m.value}%
              </span>
            </div>
            
            {/* Progress Bar */}
            <div style={{ height: "6px", borderRadius: "999px", background: "var(--bg-2)", overflow: "hidden" }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${m.value}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                style={{
                  height: "100%",
                  borderRadius: "999px",
                  background: m.color
                }}
              />
            </div>

            <span style={{ fontSize: "10px", color: "var(--muted)", lineHeight: "1.4" }}>
              {m.description}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
