"use client";

import React from "react";
import { AnimatePresence } from "framer-motion";
import NodeCard from "./NodeCard";
import ConnectionLine from "./ConnectionLine";

export default function TopologyAnimator({ topology }) {
  // Helper to locate node by id
  const findNode = (id) => topology.nodes.find((n) => n.id === id);

  return (
    <div className="card" style={{
      padding: "24px",
      minHeight: "360px",
      flex: 1,
      display: "flex",
      flexDirection: "column",
      gap: "12px",
      background: "var(--surface)",
      position: "relative"
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", zIndex: 10 }}>
        <div>
          <span className="eyebrow" style={{ color: "var(--brand)" }}>Infrastructure Map</span>
          <h3 style={{ margin: "2px 0 0 0", fontSize: "18px" }}>Live Topology Blueprint</h3>
        </div>
        <div style={{ display: "flex", gap: "8px", fontSize: "11px", color: "var(--muted)", fontWeight: "600" }}>
          <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            <span style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "var(--teal)" }} />
            Healthy
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            <span style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "var(--amber)" }} />
            Stressed
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            <span style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "rgb(239, 68, 68)" }} />
            Bottleneck
          </span>
        </div>
      </div>

      {/* Blueprint Canvas Container */}
      <div style={{
        flex: 1,
        width: "100%",
        minHeight: "320px",
        borderRadius: "12px",
        backgroundColor: "var(--bg)",
        border: "1px solid var(--hairline-2)",
        position: "relative",
        overflow: "hidden",
        /* Subtle blueprint grid effect */
        backgroundImage: "radial-gradient(var(--hairline-2) 1px, transparent 0)",
        backgroundSize: "20px 20px"
      }}>
        {/* SVG Links */}
        <AnimatePresence>
          {topology.links.map((link, idx) => {
            const fromNode = findNode(link.from);
            const toNode = findNode(link.to);
            if (!fromNode || !toNode) return null;
            return (
              <ConnectionLine
                key={`${link.from}-${link.to}`}
                fromNode={fromNode}
                toNode={toNode}
                type={link.type}
              />
            );
          })}
        </AnimatePresence>

        {/* Absolute Node Cards */}
        <AnimatePresence>
          {topology.nodes.map((node) => (
            <NodeCard
              key={node.id}
              label={node.label}
              type={node.type}
              status={node.status}
              x={node.x}
              y={node.y}
            />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
