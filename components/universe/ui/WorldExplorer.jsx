"use client";

import React from "react";
import { useUniverse } from "../UniverseContext";
import { motion } from "framer-motion";

export default function WorldExplorer() {
  const { state } = useUniverse();
  const mastery = state.learner.mastery || {};

  const worlds = [
    {
      name: "Orders World",
      description: "Checkout flows, local inventory locking, and transaction queues.",
      mastery: mastery.queues || 70,
      badge: "📦",
      incidents: 2
    },
    {
      name: "Payments World",
      description: "Third-party payment gateways, idempotency keys, and reconciliation ledgers.",
      mastery: mastery.jwt || 85,
      badge: "💳",
      incidents: 4
    },
    {
      name: "Security World",
      description: "JWT session signatures, access-refresh token cycles, and rate limiting.",
      badge: "🔒",
      mastery: mastery.jwt || 85,
      incidents: 1
    },
    {
      name: "Analytics World",
      description: "OLTP vs OLAP databases, read replica scaling routing, and metric pipelines.",
      badge: "📊",
      mastery: mastery.observability || 45,
      incidents: 2
    },
    {
      name: "Deployment World",
      description: "Docker packaging, Kubernetes pods scheduler, and blue-green releases.",
      badge: "☁️",
      mastery: mastery.deployments || 20,
      incidents: 3
    }
  ];

  return (
    <motion.div
      className="card"
      style={{ padding: "26px", display: "flex", flexDirection: "column", gap: "18px" }}
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div>
        <span className="eyebrow" style={{ color: "var(--brand)" }}>Active Laboratories</span>
        <h3 style={{ margin: "4px 0 0 0", fontSize: "22px" }}>World Explorer</h3>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {worlds.map((w, i) => (
          <div key={i} style={{
            padding: "16px",
            borderRadius: "14px",
            background: "var(--surface)",
            border: "1.5px solid var(--hairline)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "16px",
            flexWrap: "wrap"
          }}>
            <div style={{ display: "flex", gap: "12px", alignItems: "center", flex: "1 1 200px" }}>
              <span style={{ fontSize: "24px" }}>{w.badge}</span>
              <div>
                <h4 style={{ margin: 0, fontSize: "15px", fontWeight: "700", color: "var(--ink)" }}>{w.name}</h4>
                <p style={{ margin: "2px 0 0 0", fontSize: "12px", color: "var(--muted)", lineHeight: "1.4" }}>
                  {w.description}
                </p>
              </div>
            </div>

            {/* Mastery bar */}
            <div style={{ display: "flex", flexDirection: "column", gap: "4px", width: "120px", flexShrink: 0 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", fontWeight: "600", color: "var(--ink-2)" }}>
                <span>Mastery</span>
                <span>{w.mastery}%</span>
              </div>
              <div style={{ width: "100%", height: "6px", borderRadius: "3px", backgroundColor: "var(--bg-2)", overflow: "hidden" }}>
                <div style={{ width: `${w.mastery}%`, height: "100%", backgroundColor: "var(--brand)", borderRadius: "3px" }} />
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span className="pill" style={{ background: "var(--pink-soft)", color: "var(--pink)", fontSize: "11px" }}>
                {w.incidents} Incidents
              </span>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
