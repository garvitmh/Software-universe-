"use client";

import React from "react";
import { motion } from "framer-motion";
import { useIncidentContext } from "../IncidentContext";

export default function BlastRadiusMap() {
  const { blastRadius, activeStep } = useIncidentContext();
  const isActive = activeStep >= 1;

  const impacted = blastRadius?.impactedSystems || [];
  const healthy = blastRadius?.unaffectedSystems || [];
  const source = blastRadius?.source || "Core System";

  return (
    <div className="card" style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "14px" }}>
      <div>
        <span className="eyebrow" style={{ color: "var(--muted)" }}>Impact Analysis</span>
        <h3 style={{ margin: "2px 0 0 0", fontSize: "16px" }}>Blast Radius Map</h3>
        <p style={{ margin: "4px 0 0 0", fontSize: "12px", color: "var(--faint)" }}>
          Source: <strong style={{ color: "var(--ink-2)" }}>{source}</strong>
        </p>
      </div>

      {/* SVG blast radius visualization */}
      <div style={{ position: "relative", height: "180px", borderRadius: "10px", background: "var(--bg-2)", overflow: "hidden" }}>
        <svg width="100%" height="100%" viewBox="0 0 360 180" preserveAspectRatio="xMidYMid meet">
          {/* Center source node */}
          {isActive && (
            <>
              <motion.circle
                cx="180" cy="90" r="60"
                fill="rgba(255,77,141,0.05)"
                stroke="rgba(255,77,141,0.15)"
                strokeWidth="1"
                initial={{ r: 0 }}
                animate={{ r: [55, 70, 55] }}
                transition={{ duration: 2.5, repeat: Infinity }}
              />
              <motion.circle
                cx="180" cy="90" r="30"
                fill="rgba(255,77,141,0.1)"
                stroke="rgba(255,77,141,0.3)"
                strokeWidth="1.5"
                initial={{ r: 0 }}
                animate={{ r: 30 }}
                transition={{ duration: 0.4 }}
              />
            </>
          )}

          {/* Source label */}
          <circle cx="180" cy="90" r="20" fill={isActive ? "rgba(255,77,141,0.8)" : "var(--muted)"} />
          <text x="180" y="95" textAnchor="middle" fontSize="9" fill="white" fontWeight="700">
            {source.split(" ")[0]}
          </text>

          {/* Impacted nodes */}
          {impacted.map((sys, i) => {
            const angle = (i / impacted.length) * Math.PI - Math.PI / 4;
            const cx = 180 + 110 * Math.cos(angle);
            const cy = 90 + 70 * Math.sin(angle);
            return (
              <g key={sys}>
                {isActive && (
                  <motion.line
                    x1="180" y1="90" x2={cx} y2={cy}
                    stroke="rgba(255,77,141,0.4)" strokeWidth="1.5" strokeDasharray="4,3"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.5, delay: i * 0.15 }}
                  />
                )}
                <motion.circle
                  cx={cx} cy={cy} r="22"
                  fill="rgba(255,77,141,0.15)"
                  stroke="rgba(255,77,141,0.5)"
                  strokeWidth="1.5"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.35, delay: i * 0.12 + 0.2 }}
                />
                <text x={cx} y={cy - 4} textAnchor="middle" fontSize="8" fill="rgba(255,77,141,0.9)" fontWeight="700">
                  {sys.split(" ")[0]}
                </text>
                <text x={cx} y={cy + 6} textAnchor="middle" fontSize="7" fill="rgba(255,77,141,0.7)">
                  AFFECTED
                </text>
              </g>
            );
          })}

          {/* Healthy nodes */}
          {healthy.map((sys, i) => {
            const angle = (i / healthy.length) * Math.PI + Math.PI / 2;
            const cx = 180 + 110 * Math.cos(angle + Math.PI);
            const cy = 90 + 70 * Math.sin(angle + 0.5);
            return (
              <g key={sys}>
                <circle cx={cx} cy={cy} r="22" fill="rgba(15,110,86,0.15)" stroke="rgba(15,110,86,0.4)" strokeWidth="1.5" />
                <text x={cx} y={cy - 4} textAnchor="middle" fontSize="8" fill="rgba(15,110,86,0.9)" fontWeight="700">
                  {sys.split(" ")[0]}
                </text>
                <text x={cx} y={cy + 6} textAnchor="middle" fontSize="7" fill="rgba(15,110,86,0.7)">
                  HEALTHY
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Legend */}
      <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
        <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
          <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "rgba(255,77,141,0.8)" }} />
          <span style={{ fontSize: "11px", color: "var(--muted)" }}>Affected ({impacted.length})</span>
        </div>
        <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
          <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "rgba(15,110,86,0.7)" }} />
          <span style={{ fontSize: "11px", color: "var(--muted)" }}>Healthy ({healthy.length})</span>
        </div>
      </div>
    </div>
  );
}
