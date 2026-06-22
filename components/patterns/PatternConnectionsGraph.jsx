"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";

const NODES = [
  { id: "retries", label: "Retries", x: 20, y: 30, desc: "Replays transient failures" },
  { id: "circuit_breakers", label: "Circuit Breakers", x: 50, y: 25, desc: "Fails fast under load" },
  { id: "bulkheads", label: "Bulkheads", x: 80, y: 30, desc: "Isolates pool resources" },
  { id: "dlq", label: "DLQ", x: 20, y: 75, desc: "Holds poison messages" },
  { id: "queues", label: "Queues", x: 50, y: 75, desc: "Buffers async tasks" },
  { id: "idempotency", label: "Idempotency", x: 80, y: 70, desc: "De-duplicates operations" }
];

const LINKS = [
  { from: "retries", to: "circuit_breakers" },
  { from: "circuit_breakers", to: "bulkheads" },
  { from: "retries", to: "idempotency" },
  { from: "queues", to: "dlq" },
  { from: "retries", to: "dlq" }
];

export default function PatternConnectionsGraph({ onSelectNode }) {
  const [hoveredNode, setHoveredNode] = useState(null);

  // Checks if a link connects to the hovered node
  const isLinkHighlighted = (link) => {
    if (!hoveredNode) return false;
    return link.from === hoveredNode || link.to === hoveredNode;
  };

  return (
    <div className="card" style={{ padding: "24px 28px", display: "flex", flexDirection: "column", gap: "16px" }}>
      <div>
        <span className="eyebrow" style={{ color: "var(--brand)" }}>Patterns Topology</span>
        <h3 style={{ margin: "2px 0 0 0", fontSize: "18px" }}>Connections Graph</h3>
        <p style={{ margin: "4px 0 0 0", fontSize: "12px", color: "var(--muted)" }}>
          Hover over any system design pattern node to see its dependencies and architectural linkages.
        </p>
      </div>

      {/* SVG Container */}
      <div style={{
        position: "relative",
        width: "100%",
        height: "260px",
        backgroundColor: "var(--bg)",
        border: "1px solid var(--hairline-2)",
        borderRadius: "12px",
        overflow: "hidden"
      }}>
        {/* Draw Connection Lines */}
        <svg style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}>
          {LINKS.map((link, idx) => {
            const fromNode = NODES.find((n) => n.id === link.from);
            const toNode = NODES.find((n) => n.id === link.to);
            if (!fromNode || !toNode) return null;

            const highlighted = isLinkHighlighted(link);

            return (
              <g key={idx}>
                {/* Background Shadow line */}
                <line
                  x1={`${fromNode.x}%`}
                  y1={`${fromNode.y}%`}
                  x2={`${toNode.x}%`}
                  y2={`${toNode.y}%`}
                  stroke="var(--bg-3)"
                  strokeWidth="3"
                  opacity="0.3"
                />
                {/* Active Flow Line */}
                <motion.line
                  x1={`${fromNode.x}%`}
                  y1={`${fromNode.y}%`}
                  x2={`${toNode.x}%`}
                  y2={`${toNode.y}%`}
                  stroke={highlighted ? "var(--brand)" : "var(--hairline)"}
                  strokeWidth={highlighted ? "2.5" : "1.5"}
                  strokeDasharray={highlighted ? "6,4" : "4,4"}
                  animate={highlighted ? { strokeDashoffset: [-20, 0] } : {}}
                  transition={{ repeat: Infinity, ease: "linear", duration: 1 }}
                />
              </g>
            );
          })}
        </svg>

        {/* Draw Nodes */}
        {NODES.map((node) => {
          const isHovered = hoveredNode === node.id;
          const isRelated = hoveredNode && LINKS.some(
            (l) => (l.from === hoveredNode && l.to === node.id) || (l.to === hoveredNode && l.from === node.id)
          );

          return (
            <motion.div
              key={node.id}
              onMouseEnter={() => setHoveredNode(node.id)}
              onMouseLeave={() => setHoveredNode(null)}
              onClick={() => onSelectNode(node.id)}
              whileHover={{ scale: 1.08 }}
              style={{
                position: "absolute",
                left: `${node.x}%`,
                top: `${node.y}%`,
                transform: "translate(-50%, -50%)",
                background: isHovered ? "var(--brand)" : isRelated ? "var(--brand-soft)" : "var(--surface)",
                border: `1.5px solid ${isHovered || isRelated ? "var(--brand)" : "var(--hairline)"}`,
                borderRadius: "10px",
                padding: "8px 14px",
                cursor: "pointer",
                boxShadow: isHovered ? "0 0 14px rgba(249, 115, 22, 0.4)" : "none",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                zIndex: 10,
                transition: "background 0.2s, border 0.2s"
              }}
            >
              <span style={{
                fontSize: "12px",
                fontWeight: "800",
                color: isHovered ? "#fff" : isRelated ? "var(--brand-2)" : "var(--ink)"
              }}>
                {node.label}
              </span>
              {isHovered && (
                <span style={{ fontSize: "9px", color: "rgba(255,255,255,0.8)", marginTop: "2px", whiteSpace: "nowrap" }}>
                  {node.desc}
                </span>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
