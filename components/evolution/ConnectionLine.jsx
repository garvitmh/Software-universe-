"use client";

import React from "react";
import { motion } from "framer-motion";

export default function ConnectionLine({ fromNode, toNode, type }) {
  if (!fromNode || !toNode) return null;

  // Convert percentage coordinates to string representation for SVG line attributes
  const x1 = `${fromNode.x}%`;
  const y1 = `${fromNode.y}%`;
  const x2 = `${toNode.x}%`;
  const y2 = `${toNode.y}%`;

  const styleConfigs = {
    sync: { stroke: "var(--brand)", dash: "6,6", speed: 2 },
    async: { stroke: "var(--pop-pink)", dash: "4,10", speed: 4 },
    replica: { stroke: "var(--teal)", dash: "8,5", speed: 3 },
    webhook: { stroke: "var(--pop-blue)", dash: "10,10", speed: 2.5 }
  };

  const style = styleConfigs[type] || styleConfigs.sync;

  return (
    <svg style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 5 }}>
      {/* Shadow background pipe */}
      <line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke="var(--bg-2)"
        strokeWidth="4"
        strokeLinecap="round"
        opacity="0.6"
      />
      {/* Active flows */}
      <motion.line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke={style.stroke}
        strokeWidth="2"
        strokeLinecap="round"
        strokeDasharray={style.dash}
        animate={{
          strokeDashoffset: [100, 0]
        }}
        transition={{
          repeat: Infinity,
          duration: style.speed,
          ease: "linear"
        }}
      />
    </svg>
  );
}
