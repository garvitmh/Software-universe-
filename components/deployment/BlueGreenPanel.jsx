"use client";

import React, { useState } from "react";

export default function BlueGreenPanel() {
  // States: 'blue' (blue environment active) | 'green' (green environment active)
  const [activeEnv, setActiveEnv] = useState("blue");
  const [isRouting, setIsRouting] = useState(false);
  const [routerLog, setRouterLog] = useState(["[Router] Traffic set to Blue (production)."]);

  const switchTraffic = (target) => {
    if (target === activeEnv) return;
    setIsRouting(true);
    setRouterLog(prev => [`[Router] Switching router gateway path to ${target.toUpperCase()} environment...`, ...prev]);

    setTimeout(() => {
      setActiveEnv(target);
      setIsRouting(false);
      setRouterLog(prev => [
        `✓ [Router] Traffic successfully rerouted to ${target.toUpperCase()}! Blue: ${target === "blue" ? "100%" : "0%"} | Green: ${target === "green" ? "100%" : "0%"}`,
        ...prev
      ]);
    }, 1000);
  };

  return (
    <div
      style={{
        background: "var(--surface)",
        border: "1px solid var(--hairline)",
        borderRadius: 16,
        padding: 20,
        display: "flex",
        flexDirection: "column",
        gap: 16,
        boxShadow: "var(--shadow)"
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ fontSize: 20 }}>🟢</span>
        <h3 style={{ fontSize: 16, fontWeight: 700, margin: 0, fontFamily: "monospace" }}>Blue-Green Deployments</h3>
      </div>

      <p style={{ fontSize: 12.5, color: "var(--ink-2)", lineHeight: 1.45, margin: 0 }}>
        <strong>Instant Failover.</strong> Maintains two identical environments. The new build is deployed to Green. Once verified, the load balancer router flips traffic from Blue to Green.
      </p>

      {/* Action buttons */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        <button
          onClick={() => switchTraffic("green")}
          disabled={isRouting || activeEnv === "green"}
          style={{
            background: isRouting || activeEnv === "green" ? "var(--faint)" : "linear-gradient(135deg, #2FBF71 0%, #2D7DF6 100%)",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            padding: "8px 12px",
            fontSize: 11.5,
            fontWeight: 700,
            cursor: isRouting || activeEnv === "green" ? "not-allowed" : "pointer"
          }}
        >
          🟢 Route to Green (v2)
        </button>

        <button
          onClick={() => switchTraffic("blue")}
          disabled={isRouting || activeEnv === "blue"}
          style={{
            background: isRouting || activeEnv === "blue" ? "var(--faint)" : "linear-gradient(135deg, #2D7DF6 0%, #7C5CFC 100%)",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            padding: "8px 12px",
            fontSize: 11.5,
            fontWeight: 700,
            cursor: isRouting || activeEnv === "blue" ? "not-allowed" : "pointer"
          }}
        >
          🔵 Rollback to Blue (v1)
        </button>
      </div>

      {/* Visual representation */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 16,
          background: "var(--bg-2)",
          padding: 14,
          borderRadius: 12,
          border: "1px solid var(--hairline-2)",
          position: "relative"
        }}
      >
        {/* Router bubble */}
        <div style={{ display: "flex", justifyContent: "center", position: "relative", zIndex: 2 }}>
          <div
            style={{
              padding: "6px 12px",
              borderRadius: 20,
              background: "#1E1E2E",
              border: `1.5px solid ${isRouting ? "#FAB387" : "var(--brand)"}`,
              fontSize: 11,
              fontFamily: "monospace",
              color: "#fff",
              textAlign: "center"
            }}
          >
            🔀 Router Node <br />
            Target: <strong style={{ color: activeEnv === "blue" ? "#89B4FA" : "#A6E3A1" }}>{activeEnv.toUpperCase()}</strong>
          </div>
        </div>

        {/* Environments split */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          {/* Blue env */}
          <div
            style={{
              border: `2px solid ${activeEnv === "blue" ? "#89B4FA" : "var(--hairline-2)"}`,
              borderRadius: 8,
              padding: 10,
              background: activeEnv === "blue" ? "rgba(137,180,250,0.05)" : "var(--surface)",
              textAlign: "center",
              opacity: activeEnv === "blue" ? 1 : 0.45,
              transition: "all 0.25s"
            }}
          >
            <span style={{ fontSize: 24 }}>🔵</span>
            <div style={{ fontSize: 12, fontWeight: 700, marginTop: 4 }}>Blue Environment</div>
            <div style={{ fontSize: 10, fontFamily: "monospace", color: "var(--muted)", marginTop: 2 }}>
              v1.0.0 | Active: {activeEnv === "blue" ? "100% Traffic" : "Idle"}
            </div>
          </div>

          {/* Green env */}
          <div
            style={{
              border: `2px solid ${activeEnv === "green" ? "#A6E3A1" : "var(--hairline-2)"}`,
              borderRadius: 8,
              padding: 10,
              background: activeEnv === "green" ? "rgba(166,227,161,0.05)" : "var(--surface)",
              textAlign: "center",
              opacity: activeEnv === "green" ? 1 : 0.45,
              transition: "all 0.25s"
            }}
          >
            <span style={{ fontSize: 24 }}>🟢</span>
            <div style={{ fontSize: 12, fontWeight: 700, marginTop: 4 }}>Green Environment</div>
            <div style={{ fontSize: 10, fontFamily: "monospace", color: "var(--muted)", marginTop: 2 }}>
              v2.0.0 | Active: {activeEnv === "green" ? "100% Traffic" : "Idle (Staging)"}
            </div>
          </div>
        </div>
      </div>

      {/* Router switch logs */}
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        <span style={{ fontSize: 10.5, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase" }}>Gateway Connection Log</span>
        <div
          style={{
            background: "#11111B",
            borderRadius: 8,
            padding: 10,
            maxHeight: 70,
            overflowY: "auto",
            fontFamily: "monospace",
            fontSize: 10.5,
            color: "#CDD6F4"
          }}
        >
          {routerLog.slice(0, 3).map((log, idx) => (
            <div key={idx} style={{ color: log.startsWith("✓") ? "#A6E3A1" : "#CDD6F4" }}>
              {log}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
