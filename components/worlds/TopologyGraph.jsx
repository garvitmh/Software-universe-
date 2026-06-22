"use client";

import React from "react";
import { Edge, Node } from "@/components/order-journey/GraphHelpers";
import { TOPOLOGY_CONTENT } from "./topology-content";

export default function TopologyGraph({ worldSlug, scale }) {
  const data = TOPOLOGY_CONTENT[worldSlug]?.[scale];
  if (!data) {
    return (
      <div style={{ height: 260, display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg-2)", borderRadius: 14, border: "1px solid var(--hairline-2)", color: "var(--muted)", fontSize: 13 }}>
        No topology visualization available for scale level: {scale}
      </div>
    );
  }

  // Make all links active so they animate and pulse beautifully!
  const activeLinks = data.edges.map(e => `${e.from}->${e.to}`);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h5 style={{ fontSize: 11, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.05em", margin: 0 }}>
          🖥️ System Architecture Topology ({scale === "10" ? "Startup" : scale === "100k" ? "Scale" : "Enterprise"})
        </h5>
        <div style={{ display: "flex", gap: 10, fontSize: 10, fontWeight: 600, color: "var(--muted)" }}>
          <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--teal)", display: "inline-block" }} /> 
            Active Data Stream
          </span>
        </div>
      </div>
      
      <svg 
        width="100%" 
        height="260" 
        viewBox="0 0 600 240" 
        style={{ 
          background: "var(--bg-2)", 
          borderRadius: 14, 
          border: "1px solid var(--hairline-2)",
          boxShadow: "inset 0 2px 4px rgba(0,0,0,0.02)"
        }}
      >
        {/* Draw Edges first (underneath nodes) */}
        {data.edges.map((edge, i) => {
          const fromNode = data.nodes.find(n => n.id === edge.from);
          const toNode = data.nodes.find(n => n.id === edge.to);
          if (!fromNode || !toNode) return null;
          
          return (
            <Edge
              key={`edge-${i}`}
              x1={fromNode.x}
              y1={fromNode.y}
              x2={toNode.x}
              y2={toNode.y}
              from={edge.from}
              to={edge.to}
              activeLinks={activeLinks}
              errorLink={null}
            />
          );
        })}

        {/* Draw Nodes on top */}
        {data.nodes.map((node) => (
          <Node
            key={node.id}
            x={node.x}
            y={node.y}
            label={node.label}
            icon={node.icon}
            id={node.id}
            activeLinks={activeLinks}
            errorLink={null}
          />
        ))}
      </svg>
    </div>
  );
}
