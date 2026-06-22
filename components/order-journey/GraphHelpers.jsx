"use client";

import React from "react";

export function Edge({ x1, y1, x2, y2, from, to, activeLinks, errorLink }) {
  const active = activeLinks.includes(`${from}->${to}`);
  const isErr = errorLink === `${from}->${to}`;
  
  let stroke = "var(--hairline-2)";
  let strokeWidth = 1.5;
  let dashArray = active ? "5 5" : "none";
  let filter = "none";

  if (isErr) {
    stroke = "var(--brand)";
    strokeWidth = 2.5;
    filter = "drop-shadow(0 0 2px var(--brand))";
  } else if (active) {
    stroke = "var(--teal)";
    strokeWidth = 2.5;
  }

  return (
    <g>
      <line
        x1={x1} y1={y1} x2={x2} y2={y2}
        stroke={stroke} strokeWidth={strokeWidth} strokeDasharray={dashArray}
        style={{ transition: "stroke 0.25s, stroke-width 0.25s", filter }}
      >
        {active && (
          <animate
            attributeName="stroke-dashoffset"
            values="30;0"
            dur="1s"
            repeatCount="indefinite"
          />
        )}
      </line>
      {/* Arrowhead */}
      <polygon
        points={`${x2},${y2} ${x2 - 6},${y2 - 3} ${x2 - 6},${y2 + 3}`}
        fill={isErr ? "var(--brand)" : active ? "var(--teal)" : "var(--hairline-2)"}
        transform={`rotate(${Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI} ${x2} ${y2})`}
        style={{ transition: "fill 0.25s" }}
      />
    </g>
  );
}

export function Node({ x, y, label, icon, id, activeLinks, errorLink }) {
  const isActive = activeLinks.some(link => link.startsWith(`${id}->`) || link.endsWith(`->${id}`));
  const isErr = activeLinks.includes(id) || errorLink?.includes(id);
  
  let bg = "var(--surface)";
  let border = "1px solid var(--hairline-2)";
  let strokeColor = "var(--hairline)";
  let textWeight = 500;

  if (isErr) {
    bg = "#FBE0D2";
    border = "1.5px solid var(--brand)";
    strokeColor = "var(--brand)";
  } else if (isActive) {
    bg = "var(--teal-soft)";
    border = "1.5px solid var(--teal)";
    strokeColor = "var(--teal)";
    textWeight = 700;
  }

  return (
    <g style={{ transition: "all 0.25s ease" }}>
      <rect
        x={x - 48} y={y - 18} width={96} height={36} rx={10}
        fill={bg} stroke={strokeColor} strokeWidth={isActive || isErr ? 2 : 1}
        style={{ filter: isActive ? "drop-shadow(0 4px 6px rgba(15,110,86,0.1))" : "var(--shadow)" }}
      />
      <text x={x} y={y - 3} textAnchor="middle" fontSize={11} fill="var(--ink)" fontWeight={textWeight}>
        {icon}
      </text>
      <text x={x} y={y + 11} textAnchor="middle" fontSize={9} fill="var(--ink-2)" fontWeight={textWeight}>
        {label}
      </text>
    </g>
  );
}
