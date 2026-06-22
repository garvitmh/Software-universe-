"use client";

import React from "react";

export default function ContainerNode({ id, name, version, status, trafficShare, errorCount, activeConnections, onClick }) {
  const getStatusStyle = (state) => {
    switch (state) {
      case "BUILDING":
        return {
          borderColor: "#FAB387",
          glowColor: "rgba(250, 179, 135, 0.25)",
          dotColor: "#FAB387",
          label: "Building",
          animation: "border-spin 2s linear infinite"
        };
      case "STARTING":
        return {
          borderColor: "#89B4FA",
          glowColor: "rgba(137, 180, 250, 0.3)",
          dotColor: "#89B4FA",
          label: "Starting",
          animation: "pulse-blue 1.5s infinite"
        };
      case "HEALTHY":
        return {
          borderColor: "#A6E3A1",
          glowColor: "rgba(166, 227, 161, 0.25)",
          dotColor: "#A6E3A1",
          label: "Healthy",
          animation: "pulse-green 2s infinite ease-in-out"
        };
      case "DEGRADED":
        return {
          borderColor: "#F9E2AF",
          glowColor: "rgba(249, 226, 175, 0.3)",
          dotColor: "#F9E2AF",
          label: "Degraded",
          animation: "pulse-amber 1.2s infinite ease-in-out"
        };
      case "CRASHED":
        return {
          borderColor: "#F38BA8",
          glowColor: "rgba(243, 139, 168, 0.45)",
          dotColor: "#F38BA8",
          label: "Crashed",
          animation: "blink-red 0.6s infinite alternate",
          stripes: "repeating-linear-gradient(45deg, rgba(243, 139, 168, 0.05), rgba(243, 139, 168, 0.05) 10px, transparent 10px, transparent 20px)"
        };
      case "RESTARTING":
        return {
          borderColor: "#CBA6F7",
          glowColor: "rgba(203, 166, 247, 0.3)",
          dotColor: "#CBA6F7",
          label: "Restarting",
          animation: "pulse-purple 1s infinite alternate"
        };
      default:
        return {
          borderColor: "var(--hairline-2)",
          glowColor: "transparent",
          dotColor: "var(--muted)",
          label: "Stopped",
          animation: "none"
        };
    }
  };

  const styleConfig = getStatusStyle(status);

  return (
    <div
      onClick={onClick}
      style={{
        width: "100%",
        minHeight: 96,
        borderRadius: 14,
        border: `1.5px solid ${styleConfig.borderColor}`,
        background: styleConfig.stripes || "var(--surface)",
        boxShadow: `0 8px 24px -12px rgba(0,0,0,0.5), 0 0 14px ${styleConfig.glowColor}`,
        padding: "12px 16px",
        cursor: onClick ? "pointer" : "default",
        transition: "all 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
        userSelect: "none",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between"
      }}
      className="container-node-card"
    >
      {/* Node Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              backgroundColor: styleConfig.dotColor,
              display: "inline-block",
              animation: styleConfig.animation.includes(" ") ? styleConfig.animation : "none"
            }}
          />
          <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.04em", textTransform: "uppercase", color: styleConfig.dotColor }}>
            {styleConfig.label}
          </span>
        </div>
        <span style={{ fontSize: 9.5, fontWeight: 700, color: "var(--muted)", fontFamily: "monospace", padding: "1px 5px", background: "var(--bg-2)", borderRadius: 4 }}>
          {version || "v1.0.0"}
        </span>
      </div>

      {/* Container Content */}
      <div style={{ margin: "6px 0" }}>
        <h4 style={{ fontFamily: "monospace", fontSize: 13.5, fontWeight: 700, color: "var(--ink)", margin: 0 }}>
          {name || `pod-${id}`}
        </h4>
        <span style={{ fontSize: 9.5, color: "var(--muted)", fontFamily: "monospace" }}>
          ID: {id}
        </span>
      </div>

      {/* Telemetry Stats Footer */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid var(--hairline-2)", paddingTop: 8, marginTop: 4 }}>
        <div style={{ display: "flex", gap: 10 }}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: 8.5, color: "var(--muted)", textTransform: "uppercase" }}>Conns</span>
            <span style={{ fontSize: 11, fontWeight: 700, fontFamily: "monospace" }}>{status === "HEALTHY" || status === "DEGRADED" ? activeConnections : 0}</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: 8.5, color: "var(--muted)", textTransform: "uppercase" }}>Traffic</span>
            <span style={{ fontSize: 11, fontWeight: 700, fontFamily: "monospace" }}>{status === "HEALTHY" || status === "DEGRADED" ? `${trafficShare}%` : "0%"}</span>
          </div>
        </div>

        {errorCount > 0 && (
          <span style={{ fontSize: 9.5, fontWeight: 800, color: "#F38BA8", background: "rgba(243, 139, 168, 0.1)", padding: "1px 6px", borderRadius: 4 }}>
            ⚠️ {errorCount} errors
          </span>
        )}
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes pulse-blue {
          0%, 100% { transform: scale(1); opacity: 1; box-shadow: 0 0 0 0 rgba(137, 180, 250, 0.4); }
          50% { transform: scale(1.2); opacity: 0.8; box-shadow: 0 0 0 4px rgba(137, 180, 250, 0); }
        }
        @keyframes pulse-green {
          0%, 100% { transform: scale(1); opacity: 1; box-shadow: 0 0 0 0 rgba(166, 227, 161, 0.4); }
          50% { transform: scale(1.15); opacity: 0.8; box-shadow: 0 0 0 4px rgba(166, 227, 161, 0); }
        }
        @keyframes pulse-amber {
          0%, 100% { transform: scale(1); opacity: 1; box-shadow: 0 0 0 0 rgba(249, 226, 175, 0.4); }
          50% { transform: scale(1.2); opacity: 0.7; box-shadow: 0 0 0 4px rgba(249, 226, 175, 0); }
        }
        @keyframes pulse-purple {
          0%, 100% { transform: scale(1); opacity: 1; box-shadow: 0 0 0 0 rgba(203, 166, 247, 0.4); }
          50% { transform: scale(1.15); opacity: 0.8; box-shadow: 0 0 0 4px rgba(203, 166, 247, 0); }
        }
        @keyframes blink-red {
          0% { opacity: 0.4; }
          100% { opacity: 1; }
        }
      `}</style>
    </div>
  );
}
