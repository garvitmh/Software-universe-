"use client";

import React, { useState } from "react";

export default function CardSpotlight({
  children,
  className = "",
  style = {},
  glowColor = "rgba(99, 102, 241, 0.15)", // Default indigo brand glow
  glowRadius = 300,
  ...props
}) {
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setCoords({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`card ${className}`}
      style={{
        position: "relative",
        overflow: "hidden",
        cursor: "pointer",
        ...style
      }}
      {...props}
    >
      {/* Spotlight overlay */}
      {isHovered && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            pointerEvents: "none",
            background: `radial-gradient(${glowRadius}px circle at ${coords.x}px ${coords.y}px, ${glowColor}, transparent 80%)`,
            zIndex: 0,
            transition: "opacity 0.2s ease"
          }}
        />
      )}
      
      {/* Content wrapper */}
      <div style={{ position: "relative", zIndex: 1 }}>
        {children}
      </div>
    </div>
  );
}
