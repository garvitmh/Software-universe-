"use client";

import React from "react";

export default function ConnectionEdge({ edge, fromNode, toNode, isCrashed, isHighlighted }) {
  if (!fromNode || !toNode) return null;

  // Calculate midpoint for labels
  const midX = (fromNode.x + toNode.x) / 2;
  const midY = (fromNode.y + toNode.y) / 2;

  // Map connection type styles (color, dash-array, speed)
  const getEdgeStyle = (type) => {
    switch (type) {
      case "synchronous":
        return {
          stroke: isCrashed ? "#F38BA8" : "#A6E3A1", // Green (healthy sync) or Red (broken sync)
          dashArray: "6,6",
          speed: "12s"
        };
      case "asynchronous":
        return {
          stroke: isCrashed ? "#89B4FA" : "#89DCEB", // Light blue (async)
          dashArray: "12,8",
          speed: "25s"
        };
      case "webhook":
        return {
          stroke: isCrashed ? "#FAB387" : "#FAB387", // Peach
          dashArray: "8,8",
          speed: "20s"
        };
      case "replica":
      case "database":
        return {
          stroke: isCrashed ? "#94E2D5" : "#94E2D5", // Teal
          dashArray: "4,8",
          speed: "35s"
        };
      default:
        return {
          stroke: "var(--hairline-2)",
          dashArray: "5,5",
          speed: "30s"
        };
    }
  };

  const style = getEdgeStyle(edge.type);

  // Determine path coordinates
  const pathData = `M ${fromNode.x} ${fromNode.y} L ${toNode.x} ${toNode.y}`;

  return (
    <g style={{ pointerEvents: "none" }}>
      {/* Background backing line */}
      <path
        d={pathData}
        fill="none"
        stroke={
          isCrashed
            ? "rgba(243, 139, 168, 0.2)"
            : isHighlighted
            ? "rgba(99, 102, 241, 0.3)"
            : "var(--hairline-2)"
        }
        strokeWidth={isHighlighted ? "5.5" : "3.5"}
        strokeLinecap="round"
        style={{ transition: "stroke 0.2s, stroke-width 0.2s" }}
      />

      {/* Animated Dash Overlay */}
      <path
        d={pathData}
        fill="none"
        stroke={isHighlighted && !isCrashed ? "var(--brand)" : style.stroke}
        strokeWidth={isHighlighted ? "3.5" : "2.5"}
        strokeDasharray={style.dashArray}
        strokeLinecap="round"
        style={{
          animation: isCrashed ? "none" : `dashFlow ${style.speed} linear infinite`,
          transition: "stroke 0.2s, stroke-width 0.2s"
        }}
      />

      {/* Connection Edge Label Badge */}
      <g transform={`translate(${midX}, ${midY})`}>
        <rect
          x="-55"
          y="-10"
          width="110"
          height="20"
          rx="5"
          fill="#1E1E2E"
          stroke={isCrashed ? "#F38BA8" : isHighlighted ? "var(--brand)" : "var(--hairline)"}
          strokeWidth="1.5"
          style={{ pointerEvents: "auto", transition: "stroke 0.2s" }}
        />
        <text
          fill={isCrashed ? "#F38BA8" : "var(--ink-2)"}
          fontSize="9"
          fontWeight="700"
          textAnchor="middle"
          y="3"
          style={{ fontFamily: "monospace", userSelect: "none" }}
        >
          {edge.label}
        </text>
      </g>

      <style>{`
        @keyframes dashFlow {
          from {
            stroke-dashoffset: 200;
          }
          to {
            stroke-dashoffset: 0;
          }
        }
      `}</style>
    </g>
  );
}
