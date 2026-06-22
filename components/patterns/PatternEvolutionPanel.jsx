"use client";

import React from "react";
import { motion } from "framer-motion";

export default function PatternEvolutionPanel({ patternName, evolution }) {
  const steps = ["Startup", "Growth", "Scale", "Enterprise"];

  return (
    <div className="card" style={{ padding: "24px 28px", display: "flex", flexDirection: "column", gap: "16px" }}>
      <div>
        <span className="eyebrow" style={{ color: "var(--brand)" }}>Complexity Progression</span>
        <h3 style={{ margin: "2px 0 0 0", fontSize: "18px" }}>Earned Complexity: {patternName}</h3>
        <p style={{ margin: "4px 0 0 0", fontSize: "12px", color: "var(--muted)" }}>
          How the implementation grows from small startup workloads to global enterprise infrastructure.
        </p>
      </div>

      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "12px",
        flexWrap: "wrap",
        background: "var(--bg)",
        padding: "16px 20px",
        borderRadius: "12px",
        border: "1px solid var(--hairline-2)"
      }}>
        {evolution.map((tech, idx) => (
          <React.Fragment key={tech}>
            <div style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "4px",
              flex: 1,
              minWidth: "120px"
            }}>
              <span style={{
                fontSize: "10px",
                fontWeight: "700",
                color: "var(--brand-2)",
                textTransform: "uppercase",
                background: "var(--brand-soft)",
                padding: "2px 8px",
                borderRadius: "4px"
              }}>
                {steps[idx] || "Advanced"}
              </span>
              <span style={{
                fontSize: "13px",
                fontWeight: "700",
                color: "var(--ink)",
                textAlign: "center",
                marginTop: "4px"
              }}>
                {tech}
              </span>
            </div>
            {idx < evolution.length - 1 && (
              <div style={{
                fontSize: "18px",
                color: "var(--hairline)",
                fontWeight: "bold",
                userSelect: "none"
              }}>
                →
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
