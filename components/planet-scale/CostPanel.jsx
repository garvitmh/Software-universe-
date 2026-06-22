// components/planet-scale/CostPanel.jsx

import React from "react";
import { usePlanetScale } from "./usePlanetScale";

export default function CostPanel() {
  const { globalMetrics, cdnEnabled, consistencyMode, scale } = usePlanetScale();

  // Compute breakdown percentages
  const infraCost = Math.round(globalMetrics.cost * 0.45);
  const storageCost = Math.round(globalMetrics.cost * 0.20);
  const bandwidthCost = Math.round(globalMetrics.cost * 0.25 * (consistencyMode === "strong" ? 1.5 : 1));
  const cdnCost = cdnEnabled ? Math.round(globalMetrics.cost * 0.10) : 0;
  const totalCost = infraCost + storageCost + bandwidthCost + cdnCost;

  return (
    <div className="card" style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "16px" }}>
      <div>
        <span className="eyebrow" style={{ color: "var(--brand)" }}>Economics</span>
        <h3 style={{ margin: "2px 0 0 0" }}>Operational Cost Ledger</h3>
        <p style={{ margin: "4px 0 0 0", fontSize: "12px", color: "var(--muted)" }}>
          Distributed replication and edge traffic are not free. High consistency increases consensus network billing.
        </p>
      </div>

      {/* Bill summary card */}
      <div style={{
        padding: "16px",
        borderRadius: "12px",
        backgroundColor: "var(--bg-2)",
        border: "1px solid var(--hairline-2)",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
      }}>
        <div>
          <span style={{ fontSize: "11px", color: "var(--muted)", display: "block" }}>Total Monthly Cost</span>
          <span style={{ fontSize: "24px", fontWeight: "700", color: "var(--ink)" }}>
            ${totalCost.toLocaleString()}
          </span>
        </div>
        <span className="pill" style={{ backgroundColor: "var(--brand-soft)", color: "var(--brand-2)", fontWeight: "bold" }}>
          Scale: {scale.toUpperCase()}
        </span>
      </div>

      {/* Breakdown list */}
      <div style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "12px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px dashed var(--hairline)", paddingBottom: "6px" }}>
          <span style={{ color: "var(--muted)" }}>🖥️ Computing & Server Nodes</span>
          <span style={{ fontWeight: "700" }}>${infraCost.toLocaleString()}</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px dashed var(--hairline)", paddingBottom: "6px" }}>
          <span style={{ color: "var(--muted)" }}>💾 Database Storage & Replicas</span>
          <span style={{ fontWeight: "700" }}>${storageCost.toLocaleString()}</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px dashed var(--hairline)", paddingBottom: "6px" }}>
          <span style={{ color: "var(--muted)" }}>🌐 Cross-Region Bandwidth</span>
          <span style={{ fontWeight: "700", color: consistencyMode === "strong" ? "var(--amber)" : "var(--ink)" }}>
            ${bandwidthCost.toLocaleString()}
          </span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px dashed var(--hairline)", paddingBottom: "6px" }}>
          <span style={{ color: "var(--muted)" }}>⚡ CDN Edge Routing Caches</span>
          <span style={{ fontWeight: "700" }}>${cdnCost.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
}
