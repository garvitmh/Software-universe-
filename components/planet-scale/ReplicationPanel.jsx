// components/planet-scale/ReplicationPanel.jsx

import React from "react";
import { usePlanetScale } from "./usePlanetScale";
import { REGIONS } from "./PlanetSchema";

export default function ReplicationPanel() {
  const { regionTelemetry, primaryRegion, consistencyMode } = usePlanetScale();

  return (
    <div className="card" style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "16px" }}>
      <div>
        <span className="eyebrow" style={{ color: "var(--brand)" }}>Data Sync</span>
        <h3 style={{ margin: "2px 0 0 0" }}>Database Replication Lag</h3>
        <p style={{ margin: "4px 0 0 0", fontSize: "12px", color: "var(--muted)" }}>
          Replicas receive updates asynchronously. The lag is relative to distance and networking health.
        </p>
      </div>

      {/* Visual Primary -> Replica Flow diagram */}
      <div style={{
        padding: "16px",
        borderRadius: "10px",
        backgroundColor: "var(--bg-2)",
        border: "1px solid var(--hairline-2)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "12px"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ fontSize: "12px", fontWeight: "700" }}>Leader/Primary:</span>
          <span className="pill" style={{ backgroundColor: "var(--brand-soft)", color: "var(--brand-2)", fontWeight: "bold" }}>
            👑 {primaryRegion.toUpperCase()}
          </span>
        </div>

        {/* Dynamic Sync Flow Animation */}
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", justifyContent: "center" }}>
          {Object.keys(REGIONS).map(rId => {
            if (rId === primaryRegion) return null;
            const reg = REGIONS[rId];
            const telemetry = regionTelemetry[rId] || {};
            const lag = telemetry.replicationLag || 0;

            let lagColor = "var(--teal)";
            if (lag > 2000) lagColor = "var(--pink)";
            else if (lag > 200) lagColor = "var(--amber)";

            return (
              <div
                key={rId}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  padding: "6px 8px",
                  borderRadius: "6px",
                  backgroundColor: "var(--surface)",
                  border: "1px solid var(--hairline-2)",
                  fontSize: "11px",
                  minWidth: "75px"
                }}
              >
                <span style={{ fontWeight: "700" }}>{rId.toUpperCase()}</span>
                {consistencyMode === "strong" ? (
                  <span style={{ fontSize: "9px", color: "var(--teal)", fontWeight: "600" }}>0ms (sync)</span>
                ) : (
                  <span style={{ fontSize: "9px", color: lagColor, fontWeight: "700" }}>
                    {lag >= 1000 ? `${(lag / 1000).toFixed(1)}s` : `${lag}ms`}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div style={{ fontSize: "11px", color: "var(--muted)", lineHeight: "1.4" }}>
        {consistencyMode === "strong" ? (
          <div style={{ borderLeft: "3px solid var(--brand)", paddingLeft: "8px" }}>
            <strong>Strong Consensus (Raft/Paxos):</strong> Replicas are updated in-band during the write request. Replication lag is 0ms, but every write is slowed down by the round-trip latency to the farthest replica.
          </div>
        ) : (
          <div style={{ borderLeft: "3px solid var(--teal)", paddingLeft: "8px" }}>
            <strong>Async Replication:</strong> Writes commit instantly in the primary region, then logs stream in the background. Replicas have lag, but client writes are extremely fast.
          </div>
        )}
      </div>
    </div>
  );
}
