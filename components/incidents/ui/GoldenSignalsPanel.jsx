"use client";

import React from "react";
import { motion } from "framer-motion";
import { useIncidentContext } from "../IncidentContext";

function SignalCard({ label, value, unit, sublabel, color, icon, index }) {
  return (
    <motion.div
      style={{
        background: "var(--surface)",
        border: `1px solid ${color}33`,
        borderRadius: "12px",
        padding: "16px",
        display: "flex",
        flexDirection: "column",
        gap: "6px",
        position: "relative",
        overflow: "hidden"
      }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.06 }}
    >
      <div style={{ position: "absolute", top: 0, right: 0, width: "60px", height: "60px",
        background: `${color}10`, borderRadius: "0 12px 0 60px" }} />
      <span style={{ fontSize: "20px" }}>{icon}</span>
      <span style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.07em", color: "var(--muted)", fontWeight: "600" }}>
        {label}
      </span>
      <div style={{ display: "flex", alignItems: "baseline", gap: "4px" }}>
        <span style={{ fontSize: "28px", fontWeight: "800", color, fontFamily: "JetBrains Mono, monospace", lineHeight: 1 }}>
          {value}
        </span>
        <span style={{ fontSize: "12px", color: "var(--muted)", fontWeight: "600" }}>{unit}</span>
      </div>
      {sublabel && (
        <span style={{ fontSize: "11px", color: "var(--faint)" }}>{sublabel}</span>
      )}
    </motion.div>
  );
}

export default function GoldenSignalsPanel() {
  const { metrics, status } = useIncidentContext();

  const isUnhealthy = status === "ACTIVE" || status === "MITIGATING";

  const latencyColor = metrics.p99 > 2000 ? "var(--pop-pink)" : metrics.p99 > 500 ? "#F97316" : "var(--teal)";
  const errorColor = metrics.errorRate > 5 ? "var(--pop-pink)" : metrics.errorRate > 1 ? "#F97316" : "var(--teal)";
  const cpuColor = metrics.cpu > 90 ? "var(--pop-pink)" : metrics.cpu > 70 ? "#F97316" : "var(--teal)";
  const queueColor = metrics.queueDepth > 100 ? "var(--pop-pink)" : metrics.queueDepth > 20 ? "#F97316" : "var(--teal)";

  return (
    <div className="card" style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "14px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <span className="eyebrow" style={{ color: "var(--muted)" }}>The Four Golden Signals</span>
          <h3 style={{ margin: "2px 0 0 0", fontSize: "16px" }}>Latency · Traffic · Errors · Saturation</h3>
        </div>
        {isUnhealthy && (
          <motion.span
            animate={{ opacity: [1, 0.4, 1] }}
            transition={{ duration: 1.2, repeat: Infinity }}
            style={{ fontSize: "11px", fontWeight: "700", color: "var(--pop-pink)",
              background: "rgba(255,77,141,0.1)", padding: "3px 10px", borderRadius: "999px",
              border: "1px solid rgba(255,77,141,0.3)" }}
          >
            ● LIVE
          </motion.span>
        )}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "12px" }}>
        <SignalCard
          label="P99 Latency"
          value={metrics.p99 >= 1000 ? (metrics.p99 / 1000).toFixed(1) : metrics.p99}
          unit={metrics.p99 >= 1000 ? "s" : "ms"}
          sublabel={`P95: ${metrics.p95}ms · P50: ${metrics.latency}ms`}
          color={latencyColor}
          icon="⏱️"
          index={0}
        />
        <SignalCard
          label="Request Rate"
          value={metrics.requestRate}
          unit="req/s"
          sublabel="Inbound traffic"
          color="var(--pop-blue)"
          icon="📶"
          index={1}
        />
        <SignalCard
          label="Error Rate"
          value={metrics.errorRate}
          unit="%"
          sublabel={metrics.errorRate > 5 ? "⚠ Above SLO threshold" : "Within SLO"}
          color={errorColor}
          icon="🔴"
          index={2}
        />
        <SignalCard
          label="CPU Saturation"
          value={metrics.cpu}
          unit="%"
          sublabel={`Memory: ${metrics.memory}%`}
          color={cpuColor}
          icon="🔥"
          index={3}
        />
        <SignalCard
          label="Queue Depth"
          value={metrics.queueDepth}
          unit="jobs"
          sublabel="BullMQ backlog"
          color={queueColor}
          icon="📦"
          index={4}
        />
      </div>
    </div>
  );
}
