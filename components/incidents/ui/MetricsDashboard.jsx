"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import MetricCard from "./MetricCard";
import { useIncidentContext } from "../IncidentContext";

export default function MetricsDashboard() {
  const { metricsHistory } = useIncidentContext();

  const latencyHistory = metricsHistory.map(h => h.latency);
  const errorHistory = metricsHistory.map(h => h.errorRate);
  const cpuHistory = metricsHistory.map(h => h.cpu);
  const memHistory = metricsHistory.map(h => h.memory);
  const queueHistory = metricsHistory.map(h => h.queueDepth);

  const latest = metricsHistory[metricsHistory.length - 1] || {};

  return (
    <div className="card" style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "14px" }}>
      <div>
        <span className="eyebrow" style={{ color: "var(--muted)" }}>Grafana-Style Charts</span>
        <h3 style={{ margin: "2px 0 0 0", fontSize: "16px" }}>Metrics Dashboard</h3>
        <p style={{ margin: "4px 0 0 0", fontSize: "12px", color: "var(--faint)" }}>
          Historical data points across incident timeline
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "12px" }}>
        <MetricCard
          label="Avg Latency"
          value={latest.latency || 0}
          unit="ms"
          history={latencyHistory}
          color={latest.latency > 1000 ? "var(--pop-pink)" : latest.latency > 300 ? "#F97316" : "var(--teal)"}
          index={0}
        />
        <MetricCard
          label="Error Rate"
          value={`${latest.errorRate || 0}%`}
          history={errorHistory}
          color={latest.errorRate > 5 ? "var(--pop-pink)" : latest.errorRate > 1 ? "#F97316" : "var(--teal)"}
          index={1}
        />
        <MetricCard
          label="CPU"
          value={`${latest.cpu || 0}%`}
          history={cpuHistory}
          color={latest.cpu > 90 ? "var(--pop-pink)" : latest.cpu > 70 ? "#F97316" : "var(--pop-blue)"}
          index={2}
        />
        <MetricCard
          label="Memory"
          value={`${latest.memory || 0}%`}
          history={memHistory}
          color={latest.memory > 90 ? "var(--pop-pink)" : latest.memory > 70 ? "#F97316" : "var(--pop-purple)"}
          index={3}
        />
        <MetricCard
          label="Queue Depth"
          value={latest.queueDepth || 0}
          unit="jobs"
          history={queueHistory}
          color={latest.queueDepth > 100 ? "var(--pop-pink)" : latest.queueDepth > 20 ? "#F97316" : "var(--pop-lime)"}
          index={4}
        />
      </div>

      {/* Timeline labels */}
      <div style={{ display: "flex", justifyContent: "space-between", padding: "4px 0 0 0", borderTop: "1px solid var(--hairline)" }}>
        {metricsHistory.map((h, i) => (
          <span key={i} style={{ fontSize: "10px", color: "var(--faint)", fontFamily: "JetBrains Mono, monospace" }}>
            {h.step}
          </span>
        ))}
      </div>
    </div>
  );
}
