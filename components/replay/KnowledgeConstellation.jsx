// components/replay/KnowledgeConstellation.jsx

import React from "react";
import { motion } from "framer-motion";

export default function KnowledgeConstellation({ events }) {
  // Define stars coordinates
  const stars = [
    { id: "modules", label: "Modules", x: 180, y: 140, type: "mastered" },
    { id: "transactions", label: "Transactions", x: 340, y: 220, type: "weak" },
    { id: "queues", label: "Queues", x: 480, y: 120, type: "mastered" },
    { id: "idempotency", label: "Idempotency", x: 480, y: 280, type: "mastered" },
    { id: "webhooks", label: "Webhooks", x: 640, y: 200, type: "weak" },
    { id: "latency", label: "Latency", x: 780, y: 100, type: "mastered" },
    { id: "failover", label: "Failover", x: 860, y: 240, type: "mastered" }
  ];

  const connections = [
    { from: "modules", to: "transactions" },
    { from: "transactions", to: "queues" },
    { from: "queues", to: "idempotency" },
    { from: "idempotency", to: "transactions" },
    { from: "queues", to: "webhooks" },
    { from: "webhooks", to: "latency" },
    { from: "latency", to: "failover" }
  ];

  return (
    <div className="card" style={{
      padding: "20px",
      display: "flex",
      flexDirection: "column",
      gap: "16px",
      position: "relative",
      overflow: "hidden"
    }}>
      <div>
        <span className="eyebrow" style={{ color: "var(--brand)" }}>Mind Map</span>
        <h3 style={{ margin: "2px 0 0 0" }}>Knowledge Constellation</h3>
        <p style={{ margin: "4px 0 0 0", fontSize: "12px", color: "var(--muted)" }}>
          Visual constellation of acquired skills. Mastered concepts shine bright; weak concepts stay dim.
        </p>
      </div>

      {/* SVG Mesh Canvas */}
      <div style={{
        width: "100%",
        height: "300px",
        backgroundColor: "var(--bg-2)",
        borderRadius: "12px",
        border: "1px solid var(--hairline-2)",
        position: "relative",
        overflow: "hidden"
      }}>
        {/* Space dust overlay */}
        <div style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: "radial-gradient(rgba(217, 119, 6, 0.05) 1px, transparent 1px)",
          backgroundSize: "16px 16px"
        }} />

        <svg style={{ width: "100%", height: "100%" }} viewBox="0 0 1000 360">
          {/* Connection Lines */}
          {connections.map((c, idx) => {
            const fromStar = stars.find(s => s.id === c.from);
            const toStar = stars.find(s => s.id === c.to);
            if (!fromStar || !toStar) return null;

            return (
              <line
                key={idx}
                x1={fromStar.x}
                y1={fromStar.y}
                x2={toStar.x}
                y2={toStar.y}
                stroke="var(--brand-soft)"
                strokeWidth={1.5}
                opacity={0.35}
              />
            );
          })}

          {/* Star Nodes */}
          {stars.map((s) => {
            const isMastered = s.type === "mastered";
            const starColor = isMastered ? "var(--brand)" : "var(--muted)";
            const radius = isMastered ? 7 : 4;

            return (
              <g key={s.id}>
                {isMastered && (
                  <motion.circle
                    cx={s.x}
                    cy={s.y}
                    r={radius * 2.2}
                    fill="var(--brand-soft)"
                    opacity={0.3}
                    animate={{ scale: [1, 1.4, 1] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  />
                )}
                <circle
                  cx={s.x}
                  cy={s.y}
                  r={radius}
                  fill={starColor}
                  stroke="var(--bg-1)"
                  strokeWidth={1.5}
                />
                <text
                  x={s.x}
                  y={s.y + (isMastered ? 20 : 16)}
                  textAnchor="middle"
                  fill="var(--ink)"
                  fontSize={10}
                  fontWeight={isMastered ? "bold" : "normal"}
                >
                  {s.label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}
