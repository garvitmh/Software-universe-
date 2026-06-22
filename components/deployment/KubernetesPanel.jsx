"use client";

import React from "react";
import { DEPLOYMENT_SCHEMA } from "./DeploymentSchema";

export default function KubernetesPanel() {
  const { k8sAnalogies } = DEPLOYMENT_SCHEMA;

  return (
    <div
      style={{
        background: "var(--surface)",
        border: "1px solid var(--hairline)",
        borderRadius: 16,
        padding: 20,
        display: "flex",
        flexDirection: "column",
        gap: 16,
        boxShadow: "var(--shadow)"
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ fontSize: 20 }}>☸️</span>
        <h3 style={{ fontSize: 16, fontWeight: 700, margin: 0, fontFamily: "monospace" }}>Kubernetes Analogy Model</h3>
      </div>

      <p style={{ fontSize: 12.5, color: "var(--ink-2)", lineHeight: 1.45, margin: 0 }}>
        Kubernetes can be intimidating. Use this restaurant analogy framework to build a clear mental model of how components interact.
      </p>

      {/* Grid of analogies */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }} className="k8s-grid">
        {k8sAnalogies.map((a, idx) => (
          <div
            key={idx}
            style={{
              padding: 12,
              borderRadius: 10,
              background: "var(--bg-2)",
              border: "1px solid var(--hairline-2)",
              display: "flex",
              gap: 10,
              alignItems: "flex-start",
              transition: "transform 0.2s",
              cursor: "default"
            }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; }}
          >
            <span style={{ fontSize: 24, padding: 4, background: "var(--surface)", borderRadius: 8 }}>
              {a.emoji}
            </span>
            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <span style={{ fontSize: 12.5, fontWeight: 800, color: "var(--ink)" }}>{a.title}</span>
              <span style={{ fontSize: 9.5, fontWeight: 700, color: "var(--brand)", textTransform: "uppercase" }}>{a.subtitle}</span>
              <span style={{ fontSize: 10.5, color: "var(--ink-2)", lineHeight: 1.35, marginTop: 4 }}>{a.desc}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
