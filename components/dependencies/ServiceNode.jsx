"use client";

import React from "react";

export default function ServiceNode({ node, status, isActive, isHighlighted, onClick, onMouseEnter, onMouseLeave }) {
  // Determine styles based on status
  const getStatusConfig = (currentStatus) => {
    switch (currentStatus) {
      case "healthy":
        return {
          borderColor: "#A6E3A1",
          glowColor: "rgba(166, 227, 161, 0.25)",
          badgeBg: "rgba(166, 227, 161, 0.1)",
          badgeText: "#A6E3A1",
          dotColor: "#A6E3A1",
          label: "Healthy",
          animation: "pulse-slow 2s infinite ease-in-out"
        };
      case "degraded":
        return {
          borderColor: "#F9E2AF",
          glowColor: "rgba(249, 226, 175, 0.3)",
          badgeBg: "rgba(249, 226, 175, 0.1)",
          badgeText: "#F9E2AF",
          dotColor: "#F9E2AF",
          label: "Degraded",
          animation: "pulse-med 1.2s infinite ease-in-out"
        };
      case "crashed":
        return {
          borderColor: "#F38BA8",
          glowColor: "rgba(243, 139, 168, 0.4)",
          badgeBg: "rgba(243, 139, 168, 0.15)",
          badgeText: "#F38BA8",
          dotColor: "#F38BA8",
          label: "Crashed",
          animation: "blink-fast 0.6s infinite alternate"
        };
      case "collapsed":
        return {
          borderColor: "#11111B",
          glowColor: "rgba(243, 139, 168, 0.1)",
          badgeBg: "#11111B",
          badgeText: "#F38BA8",
          dotColor: "#585B70",
          label: "Deadlock",
          animation: "none",
          bgGradient: "linear-gradient(135deg, #181825 0%, #11111b 100%)"
        };
      default:
        return {
          borderColor: "var(--hairline-2)",
          glowColor: "transparent",
          badgeBg: "var(--surface)",
          badgeText: "var(--ink-2)",
          dotColor: "var(--muted)",
          label: "Unknown",
          animation: "none"
        };
    }
  };

  const statusConfig = getStatusConfig(status);

  // Criticality tags styling
  const getCriticalityConfig = (criticality) => {
    switch (criticality) {
      case "high":
        return { text: "CRITICAL", bg: "rgba(244, 63, 94, 0.1)", color: "#F43F5E" };
      case "medium":
        return { text: "MEDIUM", bg: "rgba(245, 158, 11, 0.1)", color: "var(--amber)" };
      case "low":
        return { text: "LOW", bg: "rgba(99, 102, 241, 0.1)", color: "var(--brand)" };
      default:
        return { text: "LOW", bg: "var(--bg-2)", color: "var(--muted)" };
    }
  };

  const critConfig = getCriticalityConfig(node.criticality);

  return (
    <div
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      style={{
        position: "absolute",
        left: node.x,
        top: node.y,
        transform: `translate(-50%, -50%) scale(${isActive ? 1.05 : 1})`,
        width: 180,
        minHeight: 90,
        borderRadius: 14,
        border: `1.5px solid ${isHighlighted ? "var(--brand)" : statusConfig.borderColor}`,
        background: statusConfig.bgGradient || "var(--surface)",
        boxShadow: isHighlighted
          ? "0 0 16px rgba(99, 102, 241, 0.4)"
          : `0 8px 24px -12px rgba(0,0,0,0.5), 0 0 14px ${statusConfig.glowColor}`,
        padding: "12px 14px",
        cursor: "pointer",
        transition: "all 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
        userSelect: "none",
        zIndex: isActive || isHighlighted ? 10 : 2,
        backdropFilter: "blur(8px)",
      }}
      className="service-node-card"
    >
      {/* Node Header Info */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
        {/* Status dot and label */}
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              backgroundColor: statusConfig.dotColor,
              display: "inline-block",
              animation: statusConfig.animation === "none" ? "none" : statusConfig.animation
            }}
          />
          <span
            style={{
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: "0.05em",
              textTransform: "uppercase",
              color: statusConfig.badgeText
            }}
          >
            {statusConfig.label}
          </span>
        </div>

        {/* Criticality Badge */}
        <span
          style={{
            fontSize: 9,
            fontWeight: 800,
            letterSpacing: "0.06em",
            padding: "2px 6px",
            borderRadius: 6,
            background: critConfig.bg,
            color: critConfig.color
          }}
        >
          {critConfig.text}
        </span>
      </div>

      {/* Node Name */}
      <h4
        style={{
          fontFamily: "monospace",
          fontSize: 13,
          fontWeight: 700,
          color: "var(--ink)",
          margin: "4px 0 2px 0",
          letterSpacing: "-0.01em"
        }}
      >
        {node.name}
      </h4>

      {/* Description */}
      <p
        style={{
          fontSize: 10.5,
          lineHeight: 1.35,
          color: "var(--ink-2)",
          opacity: status === "collapsed" ? 0.4 : 0.8,
          margin: 0
        }}
      >
        {node.desc}
      </p>

      {/* Hover visual details - small instruction */}
      {isActive && (
        <div
          style={{
            position: "absolute",
            bottom: -22,
            left: "50%",
            transform: "translateX(-50%)",
            background: "var(--ink)",
            color: "var(--bg)",
            fontSize: 9,
            fontWeight: 700,
            padding: "2px 6px",
            borderRadius: 4,
            whiteSpace: "nowrap",
            boxShadow: "var(--shadow)",
            pointerEvents: "none"
          }}
        >
          Click to crash/restart
        </div>
      )}

      {/* Custom keyframes injection */}
      <style>{`
        @keyframes pulse-slow {
          0%, 100% { transform: scale(1); opacity: 1; box-shadow: 0 0 0 0 rgba(166, 227, 161, 0.4); }
          50% { transform: scale(1.15); opacity: 0.8; box-shadow: 0 0 0 4px rgba(166, 227, 161, 0); }
        }
        @keyframes pulse-med {
          0%, 100% { transform: scale(1); opacity: 1; box-shadow: 0 0 0 0 rgba(249, 226, 175, 0.5); }
          50% { transform: scale(1.2); opacity: 0.7; box-shadow: 0 0 0 6px rgba(249, 226, 175, 0); }
        }
        @keyframes blink-fast {
          0% { opacity: 0.4; }
          100% { opacity: 1; }
        }
      `}</style>
    </div>
  );
}
