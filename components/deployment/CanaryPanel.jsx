"use client";

import React, { useState, useEffect } from "react";

export default function CanaryPanel() {
  const [canaryTraffic, setCanaryTraffic] = useState(5); // 5% default
  const [errorRate, setErrorRate] = useState(0); // 0%
  const [isPromoting, setIsPromoting] = useState(false);
  const [canaryStatus, setCanaryStatus] = useState("canary_eval"); // 'canary_eval' | 'promoting' | 'rolled_back' | 'promoted'
  const [logs, setLogs] = useState(["[Canary] Single canary pod deployed. Routing 5% user traffic."]);

  const promoteCanary = () => {
    setIsPromoting(true);
    setCanaryStatus("promoting");
    setLogs(prev => ["📢 [Canary] Promoting Canary release... routing 25% traffic.", ...prev]);
    setCanaryTraffic(25);
  };

  const resetCanary = () => {
    setCanaryTraffic(5);
    setErrorRate(0);
    setCanaryStatus("canary_eval");
    setIsPromoting(false);
    setLogs(["[Canary] Re-initialized canary rollout. Baseline set: 5% traffic."]);
  };

  // Automated stepped promotion logic or check for error spike rollbacks
  useEffect(() => {
    if (canaryStatus !== "promoting") return;

    const timeout = setTimeout(() => {
      if (canaryTraffic === 25) {
        // Step to 50%
        setLogs(prev => ["✓ [Canary] 25% evaluation passed with 0% error rate.", "📢 [Canary] Promoting Canary to 50% traffic share...", ...prev]);
        setCanaryTraffic(50);
      } else if (canaryTraffic === 50) {
        if (errorRate > 5) {
          // System aborts!
          setCanaryStatus("rolled_back");
          setCanaryTraffic(0);
          setIsPromoting(false);
          setLogs(prev => [
            "🚨 [Telemetry] Alert: Error rate spiked to 12%! Threshold (5%) exceeded.",
            "📢 [Canary] Automatic release abort triggered! Routing 0% traffic to canary.",
            "✓ [Rollback] Restored 100% traffic to stable production v1.0.0. Blast radius isolated.",
            ...prev
          ]);
        } else {
          // Final promotion to 100%
          setLogs(prev => ["✓ [Canary] 50% evaluation passed. Promoting to 100% traffic...", ...prev]);
          setCanaryTraffic(100);
        }
      } else if (canaryTraffic === 100) {
        setCanaryStatus("promoted");
        setIsPromoting(false);
        setLogs(prev => [
          "🎉 [Canary] Rollout 100% complete! Old replicas scaled down. v2.0.0 is now active production.",
          ...prev
        ]);
      }
    }, 2000);

    return () => clearTimeout(timeout);
  }, [canaryTraffic, canaryStatus, errorRate]);

  // Inject errors
  const injectError = () => {
    setErrorRate(12);
    setLogs(prev => ["⚠️ [Telemetry] Simulated HTTP 500 error spike detected on Canary node.", ...prev]);
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
      <div style={{ display: "flex", alignItems: "center", justifyBetween: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 20 }}>🐤</span>
          <h3 style={{ fontSize: 16, fontWeight: 700, margin: 0, fontFamily: "monospace" }}>Canary Releases</h3>
        </div>
      </div>

      <p style={{ fontSize: 12.5, color: "var(--ink-2)", lineHeight: 1.45, margin: 0 }}>
        <strong>Blast-Radius Minimization.</strong> Routes a tiny fraction of live requests (e.g. 5%) to the new container. Automated telemetry rolls back instantly if error metrics spike.
      </p>

      {/* Outage injector buttons */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        <button
          onClick={injectError}
          disabled={canaryStatus === "rolled_back" || canaryStatus === "promoted"}
          style={{
            background: "linear-gradient(135deg, #FF4D8D 0%, #BE123C 100%)",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            padding: "8px 12px",
            fontSize: 11.5,
            fontWeight: 700,
            cursor: "pointer",
            boxShadow: "0 4px 12px rgba(243,139,168,0.2)"
          }}
        >
          💥 Inject Canary Errors
        </button>

        {canaryStatus === "rolled_back" || canaryStatus === "promoted" ? (
          <button
            onClick={resetCanary}
            style={{
              background: "var(--surface)",
              border: "1.5px solid var(--hairline-2)",
              color: "var(--ink)",
              borderRadius: 8,
              padding: "8px 12px",
              fontSize: 11.5,
              fontWeight: 700,
              cursor: "pointer"
            }}
          >
            🔄 Reset Canary
          </button>
        ) : (
          <button
            onClick={promoteCanary}
            disabled={isPromoting}
            style={{
              background: isPromoting ? "var(--faint)" : "linear-gradient(135deg, #7C5CFC 0%, #6366F1 100%)",
              color: "#fff",
              border: "none",
              borderRadius: 8,
              padding: "8px 12px",
              fontSize: 11.5,
              fontWeight: 700,
              cursor: isPromoting ? "not-allowed" : "pointer"
            }}
          >
            🚀 Promote Canary
          </button>
        )}
      </div>

      {/* Live Metrics dashboard */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, background: "var(--bg-2)", padding: 12, borderRadius: 10, border: "1px solid var(--hairline-2)" }}>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span style={{ fontSize: 9.5, color: "var(--muted)", textTransform: "uppercase" }}>Canary Traffic</span>
          <span style={{ fontSize: 16, fontWeight: 800, fontFamily: "monospace", color: "var(--brand)" }}>
            {canaryTraffic}%
          </span>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span style={{ fontSize: 9.5, color: "var(--muted)", textTransform: "uppercase" }}>Error rate</span>
          <span style={{ fontSize: 16, fontWeight: 800, fontFamily: "monospace", color: errorRate > 5 ? "#F38BA8" : "#A6E3A1" }}>
            {errorRate}%
          </span>
        </div>
      </div>

      {/* Visual map of traffic splitting */}
      <div
        style={{
          border: "1px solid var(--hairline-2)",
          borderRadius: 10,
          background: "var(--surface)",
          padding: 12,
          display: "flex",
          flexDirection: "column",
          gap: 10
        }}
      >
        <span style={{ fontSize: 10.5, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase" }}>Traffic Distribution</span>
        
        {/* Progress bars representing splits */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10.5, marginBottom: 4 }}>
              <span>Stable Replicas (v1.0.0)</span>
              <strong>{100 - canaryTraffic}%</strong>
            </div>
            <div style={{ height: 6, background: "rgba(255,255,255,0.05)", borderRadius: 3, overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${100 - canaryTraffic}%`, background: "#89B4FA", transition: "width 0.3s ease" }} />
            </div>
          </div>

          <div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10.5, marginBottom: 4 }}>
              <span>Canary Replica (v2.0.0)</span>
              <strong style={{ color: canaryStatus === "rolled_back" ? "#F38BA8" : "#A6E3A1" }}>{canaryTraffic}%</strong>
            </div>
            <div style={{ height: 6, background: "rgba(255,255,255,0.05)", borderRadius: 3, overflow: "hidden" }}>
              <div
                style={{
                  height: "100%",
                  width: `${canaryTraffic}%`,
                  background: canaryStatus === "rolled_back" ? "#F38BA8" : "#A6E3A1",
                  transition: "width 0.3s ease"
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Canary logs */}
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        <span style={{ fontSize: 10.5, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase" }}>Telemetry Logs</span>
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
          {logs.slice(0, 6).map((log, idx) => (
            <div key={idx} style={{ color: log.includes("🚨") || log.includes("Error") ? "#F38BA8" : log.includes("✓") || log.includes("complete") ? "#A6E3A1" : "#CDD6F4" }}>
              {log}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
