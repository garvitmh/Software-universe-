"use client";

import React, { useState } from "react";

export default function FailureRecoveryPanel() {
  const [activeScenario, setActiveScenario] = useState(null); // 'oom' | 'bad_image' | 'no_secret'
  const [isProcessing, setIsProcessing] = useState(false);
  const [recoveryLog, setRecoveryLog] = useState(["[System] Node-agent healthy. Watching container groups."]);
  const [podStatus, setPodStatus] = useState("HEALTHY");

  const runScenario = (id) => {
    setActiveScenario(id);
    setIsProcessing(true);

    if (id === "oom") {
      setPodStatus("CRASHED");
      setRecoveryLog([
        "⚠️ [Alert] Container OOMKilled! Memory limit (512MB) exceeded. SIGKILL dispatched.",
        "📢 [Router] Detached pod-1 from active load balancer pool. Traffic share set to 0%."
      ]);

      // Restart loop
      setTimeout(() => {
        setPodStatus("RESTARTING");
        setRecoveryLog(prev => ["⚙️ [Scheduler] Re-scheduling container pod-1. Spinning fresh sandbox...", ...prev]);

        setTimeout(() => {
          setPodStatus("HEALTHY");
          setIsProcessing(false);
          setRecoveryLog(prev => [
            "✓ [Probe] Readiness checks passed. Pod-1 ready to serve traffic.",
            "📢 [Router] Restored pod-1 traffic allocation back to 25%. System recovered.",
            ...prev
          ]);
        }, 1500);
      }, 1500);
    } else if (id === "bad_image") {
      setPodStatus("CRASHED");
      setRecoveryLog([
        "⚠️ [Alert] Pod-1 status set to ImagePullBackOff.",
        "❌ [Fatal] Failed to pull image burger-farm:v3.0.1 (not found in registry).",
        "📢 [Router] Detached pod-1 from active load balancer pool. Traffic: 0%."
      ]);

      setTimeout(() => {
        setRecoveryLog(prev => [
          "📢 [Deploy] Rolling restart failed. Halted scheduling loop to prevent infinite crash loops.",
          "🚨 [Alert] Operator paging triggered: 'ImagePullBackOff outage warning'. Manual rollback required.",
          ...prev
        ]);
        setIsProcessing(false);
      }, 2000);
    } else if (id === "no_secret") {
      setPodStatus("CRASHED");
      setRecoveryLog([
        "⚠️ [Alert] Pod-1 status set to CrashLoopBackOff.",
        "❌ [Fatal] DB connection string undefined. Environment secret invalid.",
        "📢 [Router] Detached pod-1 from active load balancer pool. Traffic: 0%."
      ]);

      setTimeout(() => {
        setRecoveryLog(prev => [
          "📢 [Deploy] Controller attempting restart (Retry count: 1/5)...",
          "❌ [Fatal] Connection check failed on startup. Exited with code 1.",
          "🚨 [Alert] Paging pager duty: 'CrashLoopBackOff database credentials'.",
          ...prev
        ]);
        setIsProcessing(false);
      }, 2000);
    }
  };

  const manualRecover = () => {
    setPodStatus("HEALTHY");
    setActiveScenario(null);
    setIsProcessing(false);
    setRecoveryLog(["✓ Config variables restored. Operator rolled back image and database credentials.", "✓ All nodes healthy."]);
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
        <span style={{ fontSize: 20 }}>🛠️</span>
        <h3 style={{ fontSize: 16, fontWeight: 700, margin: 0, fontFamily: "monospace" }}>Chaos Outage Recovery</h3>
      </div>

      <p style={{ fontSize: 12.5, color: "var(--ink-2)", lineHeight: 1.45, margin: 0 }}>
        Distributed systems fail. Test how scheduler orchestration isolates damaged pods, reroutes user traffic, and signals operator alerts.
      </p>

      {/* Selector buttons */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <span style={{ fontSize: 10.5, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase" }}>
          Arm Failure Scenario
        </span>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          <button
            onClick={() => runScenario("oom")}
            disabled={isProcessing || podStatus !== "HEALTHY"}
            style={{
              background: "var(--bg-2)",
              border: "1.5px solid var(--hairline-2)",
              color: "var(--ink)",
              borderRadius: 8,
              padding: "6px",
              fontSize: 10.5,
              fontWeight: 700,
              cursor: isProcessing || podStatus !== "HEALTHY" ? "not-allowed" : "pointer"
            }}
          >
            🔥 Container OOM (SIGKILL)
          </button>
          <button
            onClick={() => runScenario("bad_image")}
            disabled={isProcessing || podStatus !== "HEALTHY"}
            style={{
              background: "var(--bg-2)",
              border: "1.5px solid var(--hairline-2)",
              color: "var(--ink)",
              borderRadius: 8,
              padding: "6px",
              fontSize: 10.5,
              fontWeight: 700,
              cursor: isProcessing || podStatus !== "HEALTHY" ? "not-allowed" : "pointer"
            }}
          >
            ❌ Bad Image Name
          </button>
        </div>
      </div>

      {/* Recover buttons */}
      {podStatus !== "HEALTHY" && !isProcessing && (
        <button
          onClick={manualRecover}
          style={{
            background: "#A6E3A1",
            color: "#1E1E2E",
            border: "none",
            borderRadius: 8,
            padding: "10px",
            fontSize: 12,
            fontWeight: 700,
            cursor: "pointer"
          }}
        >
          🔧 Rollback & Fix Secrets (Operator Rescue)
        </button>
      )}

      {/* Visual health card */}
      <div
        style={{
          border: `1.5px solid ${podStatus === "HEALTHY" ? "#A6E3A1" : podStatus === "RESTARTING" ? "#CBA6F7" : "#F38BA8"}`,
          borderRadius: 10,
          background: "var(--surface)",
          padding: 12,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span style={{ fontSize: 12, fontWeight: 700 }}>Orchestrated Pod: bf-web-pod-1</span>
          <span style={{ fontSize: 10, color: "var(--muted)", marginTop: 2 }}>
            Version: {activeScenario === "bad_image" ? "v3.0.1" : "v2.0.0"}
          </span>
        </div>
        <span
          style={{
            fontSize: 11,
            fontWeight: 800,
            color: podStatus === "HEALTHY" ? "#A6E3A1" : podStatus === "RESTARTING" ? "#CBA6F7" : "#F38BA8"
          }}
        >
          {podStatus}
        </span>
      </div>

      {/* Recovery Timeline output */}
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        <span style={{ fontSize: 10.5, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase" }}>Recovery Event Stream</span>
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
          {recoveryLog.map((log, idx) => (
            <div key={idx} style={{ color: log.startsWith("⚠️") || log.startsWith("❌") ? "#F38BA8" : log.startsWith("✓") ? "#A6E3A1" : "#CDD6F4" }}>
              {log}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
