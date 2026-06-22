"use client";

import React from "react";
import { motion } from "framer-motion";

export default function EvolutionStageCard({ stage }) {
  return (
    <div className="card" style={{ padding: "20px 24px", display: "flex", flexDirection: "column", gap: "14px" }}>
      <div>
        <span className="eyebrow" style={{ color: "var(--brand)" }}>Active Milestone</span>
        <h3 style={{ margin: "2px 0 0 0", fontSize: "20px" }}>{stage.label} Checklist</h3>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid var(--hairline)", paddingBottom: "8px" }}>
          <span style={{ fontSize: "12px", color: "var(--muted)" }}>Topology Design:</span>
          <span style={{ fontSize: "12px", fontWeight: "700", color: "var(--ink)" }}>{stage.architecture}</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid var(--hairline)", paddingBottom: "8px" }}>
          <span style={{ fontSize: "12px", color: "var(--muted)" }}>Simulated Scale:</span>
          <span style={{ fontSize: "12px", fontWeight: "700", color: "var(--brand-2)" }}>{stage.userCount.toLocaleString()} Users</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid var(--hairline)", paddingBottom: "8px" }}>
          <span style={{ fontSize: "12px", color: "var(--muted)" }}>Throughput load:</span>
          <span style={{ fontSize: "12px", fontWeight: "700", color: "var(--ink)" }}>{stage.rps}</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid var(--hairline)", paddingBottom: "8px" }}>
          <span style={{ fontSize: "12px", color: "var(--muted)" }}>Core Limitation:</span>
          <span style={{ fontSize: "12px", fontWeight: "700", color: "var(--pink)" }}>{stage.constraint}</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", paddingBottom: "4px" }}>
          <span style={{ fontSize: "12px", color: "var(--muted)" }}>Active Bottleneck:</span>
          <span style={{ fontSize: "12px", fontWeight: "700", color: "var(--amber)", textAlign: "right", maxWidth: "200px" }}>
            {stage.bottleneck}
          </span>
        </div>
      </div>
    </div>
  );
}
