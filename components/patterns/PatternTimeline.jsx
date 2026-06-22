"use client";

import React from "react";
import { motion } from "framer-motion";

const TIMELINE_EVENTS = [
  { scale: "10 Users", pattern: "Single Node Monolith", prereq: "None", icon: "💻" },
  { scale: "100 Users", pattern: "Background Workers", prereq: "Single Monolith", icon: "👷" },
  { scale: "1,000 Users", pattern: "Load Balancer + Postgres", prereq: "Workers", icon: "🔀" },
  { scale: "10,000 Users", pattern: "Redis Cache & Durable Queues", prereq: "Postgres DB", icon: "⚡" },
  { scale: "100,000 Users", pattern: "Database Read Replicas", prereq: "Cache + Queues", icon: "📑" },
  { scale: "1,000,000 Users", pattern: "Database Sharding & Sagas", prereq: "Replicas + Queues", icon: "🗄️" }
];

export default function PatternTimeline() {
  return (
    <div className="card" style={{ padding: "24px 28px", display: "flex", flexDirection: "column", gap: "16px" }}>
      <div>
        <span className="eyebrow" style={{ color: "var(--brand)" }}>Scale Milestones</span>
        <h3 style={{ margin: "2px 0 0 0", fontSize: "18px" }}>Adoption Timeline & Prereqs</h3>
        <p style={{ margin: "4px 0 0 0", fontSize: "12px", color: "var(--muted)" }}>
          How patterns build upon each other. You cannot shard a database before you have even decoupled your reads.
        </p>
      </div>

      <div style={{
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        position: "relative"
      }}>
        {TIMELINE_EVENTS.map((e, idx) => (
          <motion.div
            key={e.pattern}
            whileHover={{ x: 4 }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "14px",
              padding: "12px 16px",
              background: "var(--bg-2)",
              borderRadius: "10px",
              border: "1px solid var(--hairline-2)"
            }}
          >
            <div style={{
              width: "36px",
              height: "36px",
              borderRadius: "8px",
              background: "var(--brand-soft)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "18px",
              flexShrink: 0
            }}>
              {e.icon}
            </div>

            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <span style={{ fontSize: "13px", fontWeight: "700", color: "var(--ink)" }}>{e.pattern}</span>
                <span style={{ fontSize: "11px", fontWeight: "700", color: "var(--brand)" }}>{e.scale}</span>
              </div>
              <div style={{ fontSize: "11px", color: "var(--muted)", marginTop: "2px" }}>
                Prerequisite: <strong style={{ color: "var(--ink-2)" }}>{e.prereq}</strong>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
