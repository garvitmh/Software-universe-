"use client";

import React, { useState, useEffect } from "react";

export default function RollingDeployPanel() {
  const [injectError, setInjectError] = useState(false);
  const [isDeploying, setIsDeploying] = useState(false);
  const [step, setStep] = useState(0); // 0 to 4
  const [rolloutLog, setRolloutLog] = useState(["[Deploy] Deployer listening. Desired state: 4 replicas."]);

  // Pods local list
  const [pods, setPods] = useState([
    { id: 1, version: "v1.0.0", status: "HEALTHY", traffic: 25 },
    { id: 2, version: "v1.0.0", status: "HEALTHY", traffic: 25 },
    { id: 3, version: "v1.0.0", status: "HEALTHY", traffic: 25 },
    { id: 4, version: "v1.0.0", status: "HEALTHY", traffic: 25 }
  ]);

  const triggerRollout = () => {
    setIsDeploying(true);
    setStep(1);
    setRolloutLog(["[Deploy] Initializing rolling update. Target version: v2.0.0.", "[Deploy] Scheduling Pod 1 replacement (25% rollout)..."]);

    // Set Pod 1 to building/starting
    setPods(prev => {
      const next = [...prev];
      next[0] = { id: 1, version: "v2.0.0", status: "STARTING", traffic: 0 };
      next[1].traffic = 33;
      next[2].traffic = 33;
      next[3].traffic = 34;
      return next;
    });
  };

  const resetSimulator = () => {
    setStep(0);
    setIsDeploying(false);
    setPods([
      { id: 1, version: "v1.0.0", status: "HEALTHY", traffic: 25 },
      { id: 2, version: "v1.0.0", status: "HEALTHY", traffic: 25 },
      { id: 3, version: "v1.0.0", status: "HEALTHY", traffic: 25 },
      { id: 4, version: "v1.0.0", status: "HEALTHY", traffic: 25 }
    ]);
    setRolloutLog(["[Deploy] Simulator reset. Back to v1.0.0 baseline."]);
  };

  // Step transitions
  useEffect(() => {
    if (!isDeploying || step === 0) return;

    const timeout = setTimeout(() => {
      if (step === 1) {
        if (injectError) {
          // Failure branch!
          setPods(prev => {
            const next = [...prev];
            next[0] = { id: 1, version: "v2.0.0", status: "CRASHED", traffic: 0 };
            return next;
          });
          setRolloutLog(prev => [
            "🚨 [Error] Pod 1 readiness probe failed! Version v2.0.0 crash-looping.",
            "📢 [Deploy] Rolling update paused. Initiating auto-rollback...",
            ...prev
          ]);
          
          // Trigger rollback after a delay
          setTimeout(() => {
            setPods([
              { id: 1, version: "v1.0.0", status: "HEALTHY", traffic: 25 },
              { id: 2, version: "v1.0.0", status: "HEALTHY", traffic: 25 },
              { id: 3, version: "v1.0.0", status: "HEALTHY", traffic: 25 },
              { id: 4, version: "v1.0.0", status: "HEALTHY", traffic: 25 }
            ]);
            setRolloutLog(prev => [
              "✓ [Rollback] Pod 1 reverted to v1.0.0.",
              "✓ [Deploy] System fully recovered to healthy v1.0.0 state. Zero user requests dropped.",
              ...prev
            ]);
            setIsDeploying(false);
            setStep(0);
          }, 2400);
        } else {
          // Normal rollout Pod 1
          setPods(prev => {
            const next = [...prev];
            next[0].status = "HEALTHY";
            next[0].traffic = 25;
            next[1].traffic = 25;
            next[2].traffic = 25;
            next[3].traffic = 25;
            return next;
          });
          setRolloutLog(prev => [
            "✓ [Probe] Pod 1 readiness check passed. Exposing v2.0.0 to traffic.",
            "[Deploy] Scheduling Pod 2 replacement (50% rollout)...",
            ...prev
          ]);
          setStep(2);

          // Update Pod 2
          setTimeout(() => {
            setPods(prev => {
              const next = [...prev];
              next[1] = { id: 2, version: "v2.0.0", status: "STARTING", traffic: 0 };
              next[0].traffic = 33;
              next[2].traffic = 33;
              next[3].traffic = 34;
              return next;
            });
          }, 600);
        }
      } else if (step === 2) {
        // Normal rollout Pod 2
        setPods(prev => {
          const next = [...prev];
          next[1].status = "HEALTHY";
          next[0].traffic = 25;
          next[1].traffic = 25;
          next[2].traffic = 25;
          next[3].traffic = 25;
          return next;
        });
        setRolloutLog(prev => [
          "✓ [Probe] Pod 2 readiness check passed.",
          "[Deploy] Scheduling Pod 3 replacement (75% rollout)...",
          ...prev
        ]);
        setStep(3);

        // Update Pod 3
        setTimeout(() => {
          setPods(prev => {
            const next = [...prev];
            next[2] = { id: 3, version: "v2.0.0", status: "STARTING", traffic: 0 };
            next[0].traffic = 33;
            next[1].traffic = 33;
            next[3].traffic = 34;
            return next;
          });
        }, 600);
      } else if (step === 3) {
        // Normal rollout Pod 3
        setPods(prev => {
          const next = [...prev];
          next[2].status = "HEALTHY";
          next[0].traffic = 25;
          next[1].traffic = 25;
          next[2].traffic = 25;
          next[3].traffic = 25;
          return next;
        });
        setRolloutLog(prev => [
          "✓ [Probe] Pod 3 readiness check passed.",
          "[Deploy] Scheduling Pod 4 replacement (100% rollout)...",
          ...prev
        ]);
        setStep(4);

        // Update Pod 4
        setTimeout(() => {
          setPods(prev => {
            const next = [...prev];
            next[3] = { id: 4, version: "v2.0.0", status: "STARTING", traffic: 0 };
            next[0].traffic = 33;
            next[1].traffic = 33;
            next[2].traffic = 34;
            return next;
          });
        }, 600);
      } else if (step === 4) {
        // Normal rollout complete Pod 4
        setPods(prev => {
          const next = [...prev];
          next[3].status = "HEALTHY";
          next[0].traffic = 25;
          next[1].traffic = 25;
          next[2].traffic = 25;
          next[3].traffic = 25;
          return next;
        });
        setRolloutLog(prev => [
          "✓ [Probe] Pod 4 readiness check passed.",
          "🎉 [Deploy] Rolling update complete! Replicas updated: 4/4. Zero downtime achieved.",
          ...prev
        ]);
        setIsDeploying(false);
      }
    }, 2200);

    return () => clearTimeout(timeout);
  }, [step, isDeploying, injectError]);

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
          <span style={{ fontSize: 20 }}>🔄</span>
          <h3 style={{ fontSize: 16, fontWeight: 700, margin: 0, fontFamily: "monospace" }}>Rolling Deployments</h3>
        </div>
      </div>

      <p style={{ fontSize: 12.5, color: "var(--ink-2)", lineHeight: 1.45, margin: 0 }}>
        <strong>Zero-Downtime Rollouts.</strong> Replaces container replicas one-by-one. If a new container fails health checks, the deployment halts and rolls back.
      </p>

      {/* Outage Toggle */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "var(--surface-warm)", padding: "10px 14px", borderRadius: 10, border: "1px solid var(--hairline-2)" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <span style={{ fontSize: 12.5, fontWeight: 700 }}>Inject Bug in v2.0.0</span>
          <span style={{ fontSize: 10, color: "var(--muted)" }}>Forces new build to crash on deploy</span>
        </div>
        <button
          onClick={() => setInjectError(!injectError)}
          style={{
            background: injectError ? "#F38BA8" : "var(--bg-2)",
            color: injectError ? "#1E1E2E" : "var(--ink)",
            border: "none",
            borderRadius: 6,
            padding: "4px 10px",
            fontSize: 11,
            fontWeight: 700,
            cursor: "pointer"
          }}
        >
          {injectError ? "Error Armed" : "Safe Release"}
        </button>
      </div>

      {/* Action buttons */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        <button
          onClick={triggerRollout}
          disabled={isDeploying || step > 0}
          style={{
            background: isDeploying || step > 0 ? "var(--faint)" : "linear-gradient(135deg, #A6E3A1 0%, #2BB58F 100%)",
            color: isDeploying || step > 0 ? "var(--muted)" : "#1E1E2E",
            border: "none",
            borderRadius: 10,
            padding: "10px",
            fontSize: 12,
            fontWeight: 700,
            cursor: isDeploying || step > 0 ? "not-allowed" : "pointer"
          }}
        >
          🚀 Start v2 Rollout
        </button>

        <button
          onClick={resetSimulator}
          disabled={isDeploying}
          style={{
            background: "var(--surface)",
            border: "1.5px solid var(--hairline-2)",
            color: "var(--ink)",
            borderRadius: 10,
            padding: "10px",
            fontSize: 12,
            fontWeight: 700,
            cursor: isDeploying ? "not-allowed" : "pointer"
          }}
        >
          🔄 Reset Baseline
        </button>
      </div>

      {/* Pod grid visualization */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 4 }}>
        <span style={{ fontSize: 10.5, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase" }}>
          Replicas Pool States
        </span>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          {pods.map(p => {
            const isV2 = p.version === "v2.0.0";
            return (
              <div
                key={p.id}
                style={{
                  padding: 10,
                  borderRadius: 8,
                  background: "var(--bg-2)",
                  border: `1.5px solid ${
                    p.status === "CRASHED"
                      ? "#F38BA8"
                      : p.status === "STARTING"
                      ? "#89B4FA"
                      : isV2
                      ? "#A6E3A1"
                      : "var(--hairline-2)"
                  }`,
                  display: "flex",
                  flexDirection: "column",
                  gap: 4
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 11, fontWeight: 700, fontFamily: "monospace" }}>pod-{p.id}</span>
                  <span
                    style={{
                      fontSize: 8.5,
                      fontWeight: 800,
                      background: isV2 ? "rgba(166,227,161,0.1)" : "rgba(255,255,255,0.05)",
                      color: isV2 ? "#A6E3A1" : "var(--ink)",
                      padding: "1px 4px",
                      borderRadius: 4
                    }}
                  >
                    {p.version}
                  </span>
                </div>
                <div style={{ display: "flex", justifyBetween: "space-between", alignItems: "center", fontSize: 9.5, color: "var(--muted)", marginTop: 4 }}>
                  <span>State: <strong style={{ color: p.status === "CRASHED" ? "#F38BA8" : p.status === "STARTING" ? "#89B4FA" : "var(--ink)" }}>{p.status}</strong></span>
                  <span>Traffic: {p.traffic}%</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Deployment logs console */}
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        <span style={{ fontSize: 10.5, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase" }}>Deploy Console</span>
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
          {rolloutLog.slice(0, 6).map((log, idx) => (
            <div key={idx} style={{ color: log.includes("🚨") || log.includes("Error") ? "#F38BA8" : log.includes("✓") || log.includes("complete") ? "#A6E3A1" : "#CDD6F4" }}>
              {log}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
