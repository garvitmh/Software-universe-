// components/planet-scale/LatencyPanel.jsx

import React from "react";
import { usePlanetScale } from "./usePlanetScale";

export default function LatencyPanel() {
  const { regionTelemetry } = usePlanetScale();

  return (
    <div className="card" style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "16px" }}>
      <div>
        <span className="eyebrow" style={{ color: "var(--brand)" }}>Physics & Distance</span>
        <h3 style={{ margin: "2px 0 0 0" }}>Regional Latency Telemetry</h3>
        <p style={{ margin: "4px 0 0 0", fontSize: "12px", color: "var(--muted)" }}>
          Geography dictates minimum delay. Packets cannot exceed the speed of light in fiber optic cables.
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {Object.values(regionTelemetry).map(reg => {
          const p50 = Math.round(reg.readLatency);
          const p95 = Math.round(reg.avgLatency);
          const p99 = Math.round(reg.avgLatency * 1.35 + (reg.errors * 2));

          return (
            <div
              key={reg.id}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "6px",
                padding: "10px",
                borderRadius: "8px",
                backgroundColor: "var(--bg-2)",
                border: "1px solid var(--hairline-2)"
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "13px", fontWeight: "700" }}>{reg.name}</span>
                <span className="pill" style={{
                  backgroundColor: reg.status === "Critical" ? "var(--pink-soft)" : "var(--brand-soft)",
                  color: reg.status === "Critical" ? "var(--pink)" : "var(--brand-2)",
                  fontSize: "10px",
                  fontWeight: "700"
                }}>
                  {reg.status}
                </span>
              </div>

              {reg.status === "Critical" ? (
                <div style={{ fontSize: "12px", color: "var(--pink)", fontWeight: "600" }}>
                  Offline: Latency Infinite (∞ ms)
                </div>
              ) : (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px", fontSize: "11px" }}>
                  <div>
                    <span style={{ color: "var(--muted)", display: "block" }}>P50 (Median)</span>
                    <span style={{ fontWeight: "700", fontSize: "13px" }}>{p50}ms</span>
                  </div>
                  <div>
                    <span style={{ color: "var(--muted)", display: "block" }}>P95 (Slow)</span>
                    <span style={{ fontWeight: "700", fontSize: "13px", color: p95 > 100 ? "var(--amber)" : "var(--ink)" }}>{p95}ms</span>
                  </div>
                  <div>
                    <span style={{ color: "var(--muted)", display: "block" }}>P99 (Worst)</span>
                    <span style={{ fontWeight: "700", fontSize: "13px", color: p99 > 200 ? "var(--pink)" : "var(--ink)" }}>{p99}ms</span>
                  </div>
                </div>
              )}

              {/* Latency Bar visualization */}
              <div style={{ width: "100%", height: "4px", backgroundColor: "var(--hairline-2)", borderRadius: "2px", overflow: "hidden" }}>
                <div style={{
                  width: reg.status === "Critical" ? "0%" : `${Math.min(100, (p95 / 350) * 100)}%`,
                  height: "100%",
                  backgroundColor: p95 > 150 ? "var(--pink)" : p95 > 80 ? "var(--amber)" : "var(--brand)",
                  transition: "width 0.4s ease"
                }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
