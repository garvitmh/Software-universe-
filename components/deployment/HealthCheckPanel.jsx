"use client";

import React, { useState, useEffect } from "react";

export default function HealthCheckPanel() {
  const [startupEnabled, setStartupEnabled] = useState(true);
  const [readinessEnabled, setReadinessEnabled] = useState(true);
  const [livenessEnabled, setLivenessEnabled] = useState(true);

  // States: 'healthy' | 'db_locked' | 'deadlocked' | 'restarting'
  const [systemState, setSystemState] = useState("healthy");
  const [failCount, setFailCount] = useState(0);
  const [logs, setLogs] = useState(["[System] Startup probe passed.", "[System] Liveness and Readiness checks active."]);

  const triggerDbLock = () => {
    setSystemState("db_locked");
    setFailCount(0);
    setLogs(prev => ["⚠️ Analytical DB lock injected. Readiness checks failing...", ...prev]);
  };

  const triggerDeadlock = () => {
    setSystemState("deadlocked");
    setFailCount(0);
    setLogs(prev => ["⚠️ CPU Deadlock hang injected. Liveness checks unresponsive...", ...prev]);
  };

  const recoverSystem = () => {
    setSystemState("healthy");
    setFailCount(0);
    setLogs(prev => ["✓ System state manually restored to Healthy.", ...prev]);
  };

  // Run periodic simulated probe checks
  useEffect(() => {
    if (systemState === "restarting") return;

    const interval = setInterval(() => {
      if (systemState === "db_locked") {
        if (readinessEnabled) {
          setLogs(prev => ["readyz: GET /readyz &rarr; 🔴 HTTP 503 (Database connection timeout)", ...prev]);
          // Readiness fails: load balancer drops it, but K8s does NOT restart
          setLogs(prev => ["📢 [LoadBalancer] Removed pod from router pool. Traffic: 0%.", ...prev]);
        } else {
          setLogs(prev => ["readyz: (Disabled) - No traffic shielding in place!", ...prev]);
        }
      } else if (systemState === "deadlocked") {
        if (livenessEnabled) {
          setLogs(prev => [`healthz: GET /healthz &rarr; 🔴 TIMEOUT (Fail count: ${failCount + 1}/3)`, ...prev]);
          setFailCount(c => {
            const next = c + 1;
            if (next >= 3) {
              // Trigger automatic pod restart!
              setTimeout(() => {
                setSystemState("restarting");
                setLogs(prev => ["🚨 Liveness threshold exceeded. Kubernetes killing container and scheduling restart...", ...prev]);
                setTimeout(() => {
                  setSystemState("healthy");
                  setFailCount(0);
                  setLogs(prev => ["✓ New pod replica running. Health checks returned to green.", ...prev]);
                }, 2000);
              }, 400);
            }
            return next;
          });
        } else {
          setLogs(prev => ["healthz: (Disabled) - Server hung indefinitely. No auto-restart.", ...prev]);
        }
      } else {
        // Healthy ticks
        setLogs(prev => [
          `readyz: GET /readyz &rarr; 🟢 200 OK | healthz: GET /healthz &rarr; 🟢 200 OK`,
          ...prev
        ]);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [systemState, failCount, livenessEnabled, readinessEnabled]);

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
        <span style={{ fontSize: 20 }}>🩺</span>
        <h3 style={{ fontSize: 16, fontWeight: 700, margin: 0, fontFamily: "monospace" }}>Kubernetes Health Probes</h3>
      </div>

      <p style={{ fontSize: 12.5, color: "var(--ink-2)", lineHeight: 1.45, margin: 0 }}>
        Kubernetes monitors container runtime health through automated probes. Understanding the difference between Liveness and Readiness prevents outages.
      </p>

      {/* Probes active configuration */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, background: "var(--bg-2)", padding: 12, borderRadius: 10, border: "1px solid var(--hairline-2)" }}>
        <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11.5, cursor: "pointer" }}>
          <input type="checkbox" checked={readinessEnabled} onChange={(e) => setReadinessEnabled(e.target.checked)} />
          Readiness Probe
        </label>
        <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11.5, cursor: "pointer" }}>
          <input type="checkbox" checked={livenessEnabled} onChange={(e) => setLivenessEnabled(e.target.checked)} />
          Liveness Probe
        </label>
      </div>

      {/* Failure buttons */}
      <div style={{ display: "flex", gap: 10, width: "100%" }}>
        {systemState === "healthy" ? (
          <>
            <button
              onClick={triggerDbLock}
              style={{
                flex: 1,
                background: "var(--surface)",
                border: "1.5px solid var(--hairline-2)",
                color: "var(--ink)",
                borderRadius: 8,
                padding: "8px",
                fontSize: 11,
                fontWeight: 700,
                cursor: "pointer"
              }}
            >
              🔒 Lock Database (Readiness)
            </button>
            <button
              onClick={triggerDeadlock}
              style={{
                flex: 1,
                background: "linear-gradient(135deg, #FF4D8D 0%, #BE123C 100%)",
                color: "#fff",
                border: "none",
                borderRadius: 8,
                padding: "8px",
                fontSize: 11,
                fontWeight: 700,
                cursor: "pointer",
                boxShadow: "0 4px 12px rgba(243,139,168,0.2)"
              }}
            >
              💥 CPU Hang (Liveness)
            </button>
          </>
        ) : (
          <button
            onClick={recoverSystem}
            disabled={systemState === "restarting"}
            style={{
              width: "100%",
              background: "#A6E3A1",
              color: "#1E1E2E",
              border: "none",
              borderRadius: 8,
              padding: "10px",
              fontSize: 12,
              fontWeight: 700,
              cursor: systemState === "restarting" ? "not-allowed" : "pointer"
            }}
          >
            {systemState === "restarting" ? "Kubernetes Self-Healing Restarting Pod..." : "💚 Resolve Incident Manual"}
          </button>
        )}
      </div>

      {/* State display card */}
      <div
        style={{
          border: `1.5px solid ${
            systemState === "healthy"
              ? "#A6E3A1"
              : systemState === "restarting"
              ? "#CBA6F7"
              : systemState === "db_locked"
              ? "#F9E2AF"
              : "#F38BA8"
          }`,
          borderRadius: 10,
          background: "var(--surface)",
          padding: 10,
          fontSize: 12,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}
      >
        <span style={{ fontWeight: 700 }}>
          Pod Status:{" "}
          <span
            style={{
              color:
                systemState === "healthy"
                  ? "#A6E3A1"
                  : systemState === "restarting"
                  ? "#CBA6F7"
                  : systemState === "db_locked"
                  ? "#F9E2AF"
                  : "#F38BA8"
            }}
          >
            {systemState.toUpperCase()}
          </span>
        </span>

        <span style={{ fontSize: 10.5, color: "var(--muted)", fontFamily: "monospace" }}>
          {systemState === "db_locked" ? "TRAFFIC DISRUPTED (READINESS OUT)" : systemState === "deadlocked" ? "CRASH DETECTED" : "ONLINE"}
        </span>
      </div>

      {/* Live Probe log feeds */}
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        <span style={{ fontSize: 10.5, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase" }}>Probe Monitor Feed</span>
        <div
          style={{
            background: "#11111B",
            borderRadius: 8,
            padding: 10,
            maxHeight: 110,
            overflowY: "auto",
            fontFamily: "monospace",
            fontSize: 10.5,
            color: "#CDD6F4",
            display: "flex",
            flexDirection: "column",
            gap: 4
          }}
        >
          {logs.slice(0, 8).map((log, idx) => (
            <div key={idx} style={{ color: log.includes("🔴") || log.includes("🚨") || log.includes("⚠️") ? "#F38BA8" : log.includes("🟢") || log.includes("✓") ? "#A6E3A1" : "#CDD6F4" }}>
              {log}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
