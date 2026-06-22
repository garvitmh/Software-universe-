// components/planet-scale/ScaleTimelinePanel.jsx

import React from "react";
import { usePlanetScale } from "./usePlanetScale";
import { SCALES } from "./PlanetSchema";

export default function ScaleTimelinePanel() {
  const { scale, setScale } = usePlanetScale();

  const milestones = {
    "10k": "Local Datacenter. Focus: DB connections.",
    "100k": "Replica Offloads. Focus: Cache invalidation.",
    "1m": "Multi-Region. Focus: Async replication lag.",
    "10m": "Sharding & Queues. Focus: Data consistency.",
    "100m": "Global Multi-Master. Focus: Speed of light, CAP Partition."
  };

  return (
    <div className="card" style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "16px" }}>
      <div>
        <span className="eyebrow" style={{ color: "var(--brand)" }}>Telemetry Scope</span>
        <h3 style={{ margin: "2px 0 0 0" }}>System Growth Milestones</h3>
        <p style={{ margin: "4px 0 0 0", fontSize: "12px", color: "var(--muted)" }}>
          Select a scale step to see how volume changes the laws of architecture.
        </p>
      </div>

      {/* Horizontal timeline */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        position: "relative",
        padding: "10px 0",
        margin: "10px 0"
      }}>
        {/* Connection track */}
        <div style={{
          position: "absolute",
          left: 0,
          right: 0,
          height: "2px",
          backgroundColor: "var(--hairline-2)",
          zIndex: 1
        }} />

        {SCALES.map((s, idx) => {
          const isActive = scale === s.id;
          return (
            <button
              key={s.id}
              onClick={() => setScale(s.id)}
              style={{
                width: "28px",
                height: "28px",
                borderRadius: "50%",
                backgroundColor: isActive ? "var(--brand)" : "var(--bg-2)",
                border: isActive ? "3px solid var(--brand-soft)" : "1px solid var(--hairline-2)",
                zIndex: 2,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: "bold",
                fontSize: "9px",
                color: isActive ? "#ffffff" : "var(--muted)",
                boxShadow: isActive ? "0 0 8px var(--brand)" : "none",
                transition: "all 0.2s ease"
              }}
              title={s.labelFull}
            >
              {s.id.toUpperCase()}
            </button>
          );
        })}
      </div>

      {/* Detailed milestone card */}
      <div style={{
        padding: "12px",
        borderRadius: "8px",
        backgroundColor: "var(--bg-2)",
        border: "1px solid var(--hairline-2)",
        fontSize: "11px"
      }}>
        <div style={{ fontWeight: "700", marginBottom: "4px", color: "var(--brand-2)" }}>
          Active Scale constraints:
        </div>
        <p style={{ margin: 0, color: "var(--ink-2)", lineHeight: "1.4" }}>
          {milestones[scale]}
        </p>
      </div>
    </div>
  );
}
