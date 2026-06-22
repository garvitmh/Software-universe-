// components/planet-scale/ConsistencyPanel.jsx

import React from "react";
import { usePlanetScale } from "./usePlanetScale";

export default function ConsistencyPanel() {
  const { consistencyMode, setConsistencyMode, globalMetrics, disasters } = usePlanetScale();

  const isDbLocked = disasters.includes("database_replication_lock");

  // Define details for each consistency level
  const options = [
    {
      id: "eventual",
      name: "Eventual Consistency",
      latency: "Low (15ms writes)",
      staleReads: "High (when replication lags)",
      description: "Writes return immediately. Replicas sync asynchronously. Users in other regions might read old data temporarily.",
      color: "var(--teal)"
    },
    {
      id: "read-your-writes",
      name: "Read-Your-Writes",
      latency: "Medium (Region RTT writes)",
      staleReads: "Zero for writer, Low for others",
      description: "Ensures the writer always sees their own updates immediately by routing reads to the leader, but other users lag.",
      color: "var(--amber)"
    },
    {
      id: "strong",
      name: "Strong Consistency (Linearizable)",
      latency: "High (consensus round-trips)",
      staleReads: "Zero stale reads",
      description: "Writes must block until a majority of global regions acknowledge. Guarantees fresh data but spikes latency.",
      color: "var(--brand)"
    }
  ];

  // Calculate simulated stale read rate
  let staleReadPercent = 0;
  if (consistencyMode === "eventual") {
    staleReadPercent = isDbLocked ? 85 : 12;
  } else if (consistencyMode === "read-your-writes") {
    staleReadPercent = isDbLocked ? 40 : 4;
  } else {
    staleReadPercent = 0;
  }

  return (
    <div className="card" style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "16px" }}>
      <div>
        <span className="eyebrow" style={{ color: "var(--brand)" }}>CAP Theorem</span>
        <h3 style={{ margin: "2px 0 0 0" }}>Consistency & Replication Mode</h3>
        <p style={{ margin: "4px 0 0 0", fontSize: "12px", color: "var(--muted)" }}>
          Configure how database updates propagate. Observe how locking replicas affects write latency.
        </p>
      </div>

      {/* Choice Buttons */}
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {options.map((opt) => {
          const selected = consistencyMode === opt.id;
          return (
            <button
              key={opt.id}
              onClick={() => setConsistencyMode(opt.id)}
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "10px",
                backgroundColor: selected ? "var(--brand-soft)" : "var(--bg-2)",
                border: selected ? "2px solid var(--brand)" : "1px solid var(--hairline-2)",
                textAlign: "left",
                cursor: "pointer",
                transition: "all 0.2s ease"
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                <span style={{ fontWeight: "700", fontSize: "13px", color: selected ? "var(--brand-2)" : "var(--ink)" }}>
                  {opt.name}
                </span>
                {selected && <span style={{ fontSize: "12px" }}>✓</span>}
              </div>
              <p style={{ margin: 0, fontSize: "11px", color: "var(--muted)", lineHeight: "1.4" }}>
                {opt.description}
              </p>
              <div style={{ display: "flex", gap: "10px", marginTop: "8px", fontSize: "10px", fontWeight: "600" }}>
                <span style={{ color: "var(--brand)" }}>Write Latency: {opt.latency}</span>
                <span style={{ color: opt.staleReads.includes("Zero") ? "var(--teal)" : "var(--pink)" }}>
                  Stale Reads: {opt.staleReads}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Live Telemetry Display */}
      <div style={{
        padding: "12px",
        borderRadius: "8px",
        backgroundColor: "var(--bg-2)",
        border: "1px solid var(--hairline-2)",
        display: "flex",
        flexDirection: "column",
        gap: "8px"
      }}>
        <span style={{ fontSize: "11px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--muted)" }}>
          Consistency Health Indicators
        </span>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
          <div>
            <span style={{ fontSize: "10px", color: "var(--muted)", display: "block" }}>Stale Read Rate</span>
            <span style={{ fontSize: "18px", fontWeight: "700", color: staleReadPercent > 10 ? "var(--pink)" : "var(--teal)" }}>
              {staleReadPercent}%
            </span>
          </div>
          <div>
            <span style={{ fontSize: "10px", color: "var(--muted)", display: "block" }}>Avg Write Delay</span>
            <span style={{ fontSize: "18px", fontWeight: "700", color: globalMetrics.latency > 100 ? "var(--amber)" : "var(--ink)" }}>
              {Math.round(globalMetrics.latency * 1.2)}ms
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
