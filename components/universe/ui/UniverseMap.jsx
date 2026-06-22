"use client";

import React, { useState } from "react";
import { useUniverse } from "../UniverseContext";
import { motion, AnimatePresence } from "framer-motion";

export default function UniverseMap() {
  const { state } = useUniverse();
  const mastery = state.learner.mastery || {};
  const [selectedNode, setSelectedNode] = useState(null);

  // Nodes definition with coordinates
  const nodes = [
    // Column 1: Learning Layer (x: 100)
    { id: "payments", label: "Payments World", layer: "LEARNING", x: 100, y: 80, mastery: mastery.jwt || 85, confidence: 75, icon: "💳", detail: "Authentication tokens, payment flows, Ledger balance consistency." },
    { id: "orders", label: "Orders World", layer: "LEARNING", x: 100, y: 200, mastery: mastery.queues || 70, confidence: 65, icon: "📦", detail: "Checkout states, inventory reservation, synchronous path flows." },
    { id: "observability", label: "Observability World", layer: "LEARNING", x: 100, y: 320, mastery: mastery.observability || 45, confidence: 55, icon: "📊", detail: "SRE Golden Signals, metrics, spans tracing, alerts configurations." },

    // Column 2: Architecture Layer (x: 350)
    { id: "queues", label: "Job Queues", layer: "ARCHITECTURE", x: 350, y: 80, mastery: mastery.queues || 70, confidence: 65, icon: "📬", detail: "BullMQ asynchronous tasks queues, jobs serialization brokers." },
    { id: "retries", label: "Retries & Backoff", layer: "ARCHITECTURE", x: 350, y: 200, mastery: mastery.retries || 82, confidence: 80, icon: "🔁", detail: "Exponential retry limits, backoffs with random jitter parameters." },
    { id: "constraints", label: "System Constraints", layer: "ARCHITECTURE", x: 350, y: 320, mastery: 88, confidence: 90, icon: "🧱", detail: "Developer headcounts limits, team bandwidth, infrastructure budgets." },

    // Column 3: Runtime Layer (x: 600)
    { id: "incidents", label: "SRE Outages", layer: "RUNTIME", x: 600, y: 80, mastery: 92, confidence: 85, icon: "🔥", detail: "Outages simulation, root cause evidence mapping, blast radius analysis." },
    { id: "scenarios", label: "What-If Realities", layer: "RUNTIME", x: 600, y: 200, mastery: 80, confidence: 75, icon: "🔮", detail: "Scale forecasting, performance bottlenecks profiling, database replicas." },
    { id: "case_studies", label: "Enterprise Cases", layer: "RUNTIME", x: 600, y: 320, mastery: 75, confidence: 70, icon: "🏛️", detail: "Comparative architectural analysis of Stripe, Netflix, Uber, and Shopify." }
  ];

  // Connections (edges) definition
  const connections = [
    { from: "payments", to: "queues" },
    { from: "orders", to: "retries" },
    { from: "observability", to: "constraints" },
    { from: "queues", to: "incidents" },
    { from: "retries", to: "scenarios" },
    { from: "constraints", to: "case_studies" }
  ];

  return (
    <motion.div
      className="card"
      style={{ padding: "26px", display: "flex", flexDirection: "column", gap: "20px", overflow: "hidden" }}
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div>
        <span className="eyebrow" style={{ color: "var(--brand)" }}>Systems Constellation</span>
        <h3 style={{ margin: "4px 0 0 0", fontSize: "22px" }}>Software Universe Map</h3>
      </div>

      <p style={{ fontSize: "14px", color: "var(--muted)", margin: 0 }}>
        An interactive constellation of your Software Universe. Green glowing nodes represent mastered domains, orange represent active bottlenecks, and clicked nodes reveal diagnostic specs.
      </p>

      {/* Map Canvas */}
      <div style={{
        position: "relative",
        width: "100%",
        height: "400px",
        background: "var(--bg-2)",
        borderRadius: "14px",
        border: "1.5px solid var(--hairline-2)",
        overflow: "auto"
      }} className="no-scrollbar">
        
        {/* SVG Connectors Canvas */}
        <svg style={{ position: "absolute", left: 0, top: 0, width: "700px", height: "400px", zIndex: 0, pointerEvents: "none" }}>
          {connections.map((conn, idx) => {
            const start = nodes.find(n => n.id === conn.from);
            const end = nodes.find(n => n.id === conn.to);
            if (!start || !end) return null;

            return (
              <g key={idx}>
                {/* Background connector line */}
                <line
                  x1={start.x}
                  y1={start.y}
                  x2={end.x}
                  y2={end.y}
                  stroke="var(--hairline-2)"
                  strokeWidth="3"
                />
                {/* Animated progress pulse line */}
                <motion.line
                  x1={start.x}
                  y1={start.y}
                  x2={end.x}
                  y2={end.y}
                  stroke="var(--brand)"
                  strokeWidth="3"
                  strokeDasharray="6, 12"
                  animate={{ strokeDashoffset: [-36, 0] }}
                  transition={{ repeat: Infinity, duration: 2.5, ease: "linear" }}
                />
              </g>
            );
          })}
        </svg>

        {/* Nodes layer */}
        <div style={{ position: "absolute", left: 0, top: 0, width: "700px", height: "400px", zIndex: 1 }}>
          {nodes.map(node => {
            const isMastered = node.mastery >= 80;
            const isWeak = node.mastery < 40;
            const glowColor = isMastered ? "rgba(47, 191, 113, 0.4)" : isWeak ? "rgba(255, 178, 62, 0.4)" : "rgba(99, 102, 241, 0.2)";

            return (
              <motion.div
                key={node.id}
                whileHover={{ scale: 1.12 }}
                onClick={() => setSelectedNode(node)}
                style={{
                  position: "absolute",
                  left: node.x - 30, // center offset
                  top: node.y - 30,  // center offset
                  width: "60px",
                  height: "60px",
                  borderRadius: "50%",
                  backgroundColor: "var(--surface)",
                  border: `2.5px solid ${isMastered ? "var(--pop-lime)" : isWeak ? "var(--pop-yellow)" : "var(--brand)"}`,
                  boxShadow: `0 0 16px ${glowColor}, var(--shadow)`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "24px",
                  cursor: "pointer",
                  userSelect: "none"
                }}
              >
                {node.icon}
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Node Detail Inspector Panel */}
      <AnimatePresence>
        {selectedNode && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            style={{
              padding: "16px",
              borderRadius: "12px",
              background: "var(--surface-warm)",
              border: "1.5px solid var(--hairline-2)",
              marginTop: "10px"
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
              <h4 style={{ margin: 0, fontSize: "16px", fontWeight: "700", color: "var(--ink)" }}>
                {selectedNode.icon} {selectedNode.label}
              </h4>
              <button
                onClick={() => setSelectedNode(null)}
                style={{ background: "none", border: "none", color: "var(--muted)", cursor: "pointer", fontSize: "16px" }}
              >
                ✕
              </button>
            </div>
            <p style={{ fontSize: "13px", color: "var(--ink-2)", margin: "0 0 12px 0", lineHeight: "1.5" }}>
              {selectedNode.detail}
            </p>
            <div style={{ display: "flex", gap: "16px", fontSize: "12.5px" }}>
              <div><strong>Layer:</strong> {selectedNode.layer}</div>
              <div><strong>Mastery:</strong> {selectedNode.mastery}%</div>
              <div><strong>Confidence:</strong> {selectedNode.confidence}%</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
