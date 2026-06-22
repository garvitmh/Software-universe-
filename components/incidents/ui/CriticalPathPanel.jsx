"use client";

import React from "react";
import { motion } from "framer-motion";
import { useIncidentContext } from "../IncidentContext";

const CRITICAL_PATHS = {
  PAYMENT_TIMEOUT: [
    { node: "Payment Gateway", duration: 8400, contribution: 78 },
    { node: "Webhook Verification", duration: 1200, contribution: 11 },
    { node: "Order Database Write", duration: 850, contribution: 8 },
    { node: "Notification Dispatch", duration: 320, contribution: 3 }
  ],
  POSTGRES_SATURATION: [
    { node: "PostgreSQL Primary Write", duration: 9200, contribution: 82 },
    { node: "Prisma Connection Pool", duration: 1100, contribution: 10 },
    { node: "Admin Analytics Query", duration: 650, contribution: 6 },
    { node: "API Response", duration: 200, contribution: 2 }
  ],
  REDIS_FAILURE: [
    { node: "Redis Queue Broker", duration: 4500, contribution: 71 },
    { node: "BullMQ Worker Connection", duration: 980, contribution: 15 },
    { node: "Notification Retry Loop", duration: 720, contribution: 11 },
    { node: "POS Print Queue", duration: 200, contribution: 3 }
  ]
};

export default function CriticalPathPanel() {
  const { incidentType } = useIncidentContext();
  const paths = CRITICAL_PATHS[incidentType] || CRITICAL_PATHS.PAYMENT_TIMEOUT;
  const maxDuration = Math.max(...paths.map(p => p.duration));

  return (
    <div className="card" style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "14px" }}>
      <div>
        <span className="eyebrow" style={{ color: "var(--muted)" }}>Bottleneck Analysis</span>
        <h3 style={{ margin: "2px 0 0 0", fontSize: "16px" }}>Critical Path</h3>
        <p style={{ margin: "4px 0 0 0", fontSize: "12px", color: "var(--faint)" }}>
          Operations contributing most to total request latency
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {paths.map((path, idx) => (
          <motion.div
            key={path.node}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: idx * 0.07 }}
            style={{ display: "flex", flexDirection: "column", gap: "4px" }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <span style={{
                  width: "18px", height: "18px", borderRadius: "4px",
                  background: idx === 0 ? "rgba(255,77,141,0.15)" : "var(--bg-2)",
                  color: idx === 0 ? "var(--pop-pink)" : "var(--muted)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "10px", fontWeight: "800", flexShrink: 0
                }}>
                  {idx + 1}
                </span>
                <span style={{ fontSize: "13px", fontWeight: idx === 0 ? "700" : "500", color: idx === 0 ? "var(--ink)" : "var(--ink-2)" }}>
                  {path.node}
                </span>
                {idx === 0 && (
                  <span style={{ fontSize: "10px", padding: "1px 6px", borderRadius: "4px", background: "rgba(255,77,141,0.1)", color: "var(--pop-pink)", fontWeight: "700", border: "1px solid rgba(255,77,141,0.3)" }}>
                    BOTTLENECK
                  </span>
                )}
              </div>
              <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                <span style={{ fontSize: "11px", fontFamily: "JetBrains Mono, monospace", color: "var(--muted)" }}>
                  {path.duration}ms
                </span>
                <span style={{ fontSize: "11px", fontWeight: "700", color: idx === 0 ? "var(--pop-pink)" : "var(--ink-2)" }}>
                  {path.contribution}%
                </span>
              </div>
            </div>
            {/* Contribution bar */}
            <div style={{ height: "6px", borderRadius: "3px", background: "var(--bg-2)", overflow: "hidden" }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${path.contribution}%` }}
                transition={{ duration: 0.5, delay: idx * 0.07 + 0.2 }}
                style={{
                  height: "100%",
                  borderRadius: "3px",
                  background: idx === 0
                    ? "var(--pop-pink)"
                    : idx === 1 ? "#F97316"
                    : idx === 2 ? "var(--amber)"
                    : "var(--muted)"
                }}
              />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
