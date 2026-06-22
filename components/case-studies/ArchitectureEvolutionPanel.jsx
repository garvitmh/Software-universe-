"use client";

import React from "react";
import { motion } from "framer-motion";

export default function ArchitectureEvolutionPanel() {
  return (
    <div className="card" style={{ padding: "24px 28px", display: "flex", flexDirection: "column", gap: "16px" }}>
      <div>
        <span className="eyebrow" style={{ color: "var(--brand)" }}>Structural Topology</span>
        <h3 style={{ margin: "2px 0 0 0", fontSize: "18px" }}>Monolithic vs Distributed Architecture</h3>
      </div>

      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "24px"
      }} className="architecture-comparison-grid">
        
        {/* Monolith Container */}
        <div style={{
          background: "var(--bg)",
          border: "1px solid var(--hairline)",
          borderRadius: "14px",
          padding: "20px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "14px"
        }}>
          <h4 style={{ margin: 0, fontSize: "13px", fontWeight: "800", color: "var(--brand-2)" }}>The Monolith</h4>
          <div style={{
            width: "120px",
            height: "120px",
            borderRadius: "16px",
            background: "linear-gradient(135deg, var(--brand-soft), var(--brand))",
            border: "2px dashed var(--brand-2)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "6px",
            boxShadow: "0 8px 24px rgba(249,115,22,0.12)"
          }}>
            <span style={{ fontSize: "12px", fontWeight: "800", color: "#fff" }}>⚙️ App Layer</span>
            <span style={{ fontSize: "12px", fontWeight: "800", color: "#fff" }}>🗄️ Database</span>
            <span style={{ fontSize: "12px", fontWeight: "800", color: "#fff" }}>⚡ Memory Cache</span>
          </div>
          <span style={{ fontSize: "11px", color: "var(--muted)", textAlign: "center" }}>
            All operations share the same CPU, RAM, and Disk space. Simple to deploy, zero network latency, but highly fragile.
          </span>
        </div>

        {/* Distributed Container */}
        <div style={{
          background: "var(--bg)",
          border: "1px solid var(--hairline)",
          borderRadius: "14px",
          padding: "20px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "14px"
        }}>
          <h4 style={{ margin: 0, fontSize: "13px", fontWeight: "800", color: "var(--teal)" }}>Distributed Tier</h4>
          
          <div style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "10px",
            width: "100%"
          }}>
            {/* Load Balancer */}
            <div style={{ padding: "6px 14px", background: "var(--surface)", border: "1px solid var(--hairline)", borderRadius: "8px", fontSize: "11px", fontWeight: "700" }}>
              🔀 Load Balancer
            </div>

            {/* App Instances */}
            <div style={{ display: "flex", gap: "10px", justifyContent: "center", width: "100%" }}>
              <div style={{ padding: "8px 12px", background: "var(--brand-soft)", border: "1px solid var(--brand)", borderRadius: "8px", fontSize: "10px", fontWeight: "700", color: "var(--brand-2)" }}>
                ⚙️ Node #1
              </div>
              <div style={{ padding: "8px 12px", background: "var(--brand-soft)", border: "1px solid var(--brand)", borderRadius: "8px", fontSize: "10px", fontWeight: "700", color: "var(--brand-2)" }}>
                ⚙️ Node #2
              </div>
            </div>

            {/* Databases */}
            <div style={{ display: "flex", gap: "10px", justifyContent: "center", width: "100%" }}>
              <div style={{ padding: "8px 12px", background: "var(--surface)", border: "1px solid var(--hairline)", borderRadius: "8px", fontSize: "10px", fontWeight: "700" }}>
                🗄️ Primary
              </div>
              <div style={{ padding: "8px 12px", background: "var(--bg-2)", border: "1px solid var(--hairline-2)", borderRadius: "8px", fontSize: "10px", fontWeight: "700", color: "var(--muted)" }}>
                📑 Replica
              </div>
            </div>
          </div>

          <span style={{ fontSize: "11px", color: "var(--muted)", textAlign: "center" }}>
            Components are isolated and scale independently. Network hops add delays, but machine crashes do not kill the system.
          </span>
        </div>

      </div>
    </div>
  );
}
