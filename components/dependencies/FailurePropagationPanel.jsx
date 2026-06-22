"use client";

import React from "react";

export default function FailurePropagationPanel({ services, edges, nodeStates }) {
  // Let's compute direct root causes (manually crashed nodes) vs cascading collapses
  const crashedCount = Object.values(nodeStates).filter(s => s === "crashed").length;
  const collapsedCount = Object.values(nodeStates).filter(s => s === "collapsed").length;
  const degradedCount = Object.values(nodeStates).filter(s => s === "degraded").length;

  const totalIncidents = crashedCount + collapsedCount + degradedCount;

  // Let's analyze propagation chains
  // A propagates failure to B if A is crashed and B depends on A (i.e. edge from B to A)
  // Let's list active impact paths
  const activeImpacts = [];

  edges.forEach(edge => {
    const dependencyState = nodeStates[edge.to];
    const callerState = nodeStates[edge.from];

    if (dependencyState === "crashed" || dependencyState === "collapsed") {
      let impactType = "None (Buffered)";
      let color = "var(--ink-2)";
      let severity = "low";

      if (edge.sync) {
        if (edge.retryable && edge.fallback !== "None (order fails)") {
          impactType = `Degraded (${edge.fallback})`;
          color = "#F9E2AF";
          severity = "medium";
        } else {
          impactType = "Total Collapse (Blocking Call)";
          color = "#F38BA8";
          severity = "high";
        }
      } else {
        impactType = `Buffered (${edge.fallback || "Queue fallback"})`;
        color = "#89DCEB";
        severity = "low";
      }

      activeImpacts.push({
        edge,
        caller: services.find(s => s.id === edge.from)?.name || edge.from,
        dependency: services.find(s => s.id === edge.to)?.name || edge.to,
        impactType,
        color,
        severity
      });
    }
  });

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
        <span style={{ fontSize: 20 }}>💥</span>
        <h3 style={{ fontSize: 16, fontWeight: 700, margin: 0, fontFamily: "monospace" }}>Blast Radius Analysis</h3>
      </div>

      {/* Metrics Row */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
        <div style={{ background: "var(--bg-2)", border: "1px solid var(--hairline-2)", borderRadius: 10, padding: "8px 10px", textAlign: "center" }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase" }}>Root Crashes</div>
          <div style={{ fontSize: 18, fontWeight: 800, color: crashedCount > 0 ? "#F38BA8" : "var(--ink)" }}>{crashedCount}</div>
        </div>

        <div style={{ background: "var(--bg-2)", border: "1px solid var(--hairline-2)", borderRadius: 10, padding: "8px 10px", textAlign: "center" }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase" }}>Collapses</div>
          <div style={{ fontSize: 18, fontWeight: 800, color: collapsedCount > 0 ? "#F43F5E" : "var(--ink)" }}>{collapsedCount}</div>
        </div>

        <div style={{ background: "var(--bg-2)", border: "1px solid var(--hairline-2)", borderRadius: 10, padding: "8px 10px", textAlign: "center" }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase" }}>Degraded</div>
          <div style={{ fontSize: 18, fontWeight: 800, color: degradedCount > 0 ? "#F9E2AF" : "var(--ink)" }}>{degradedCount}</div>
        </div>
      </div>

      {/* Warnings & Active Incident Status */}
      {totalIncidents === 0 ? (
        <div
          style={{
            border: "1.5px solid rgba(166, 227, 161, 0.2)",
            background: "rgba(166, 227, 161, 0.05)",
            color: "#A6E3A1",
            borderRadius: 10,
            padding: "12px 14px",
            fontSize: 12.5,
            display: "flex",
            alignItems: "center",
            gap: 10
          }}
        >
          <span style={{ fontSize: 18 }}>🛡️</span>
          <span><strong>System Fully Operational:</strong> All dependencies are resolving synchronously and asynchronously without latency or packet loss.</span>
        </div>
      ) : collapsedCount > 0 ? (
        <div
          style={{
            border: "1.5px solid rgba(243, 139, 168, 0.3)",
            background: "rgba(243, 139, 168, 0.05)",
            color: "#F38BA8",
            borderRadius: 10,
            padding: "12px 14px",
            fontSize: 12.5,
            display: "flex",
            alignItems: "center",
            gap: 10
          }}
          className="alert-shake"
        >
          <span style={{ fontSize: 18 }}>🚨</span>
          <span><strong>CRITICAL COLLAPSE:</strong> Synchronous blockers have propagated failure downstream. Core flows are failing open or hard crashing.</span>
        </div>
      ) : (
        <div
          style={{
            border: "1.5px solid rgba(249, 226, 175, 0.3)",
            background: "rgba(249, 226, 175, 0.05)",
            color: "#F9E2AF",
            borderRadius: 10,
            padding: "12px 14px",
            fontSize: 12.5,
            display: "flex",
            alignItems: "center",
            gap: 10
          }}
        >
          <span style={{ fontSize: 18 }}>⚠️</span>
          <span><strong>DEGRADED OPERATIONS:</strong> Failures detected, but resilience mechanisms (circuit breakers, fallbacks) are shielding core systems.</span>
        </div>
      )}

      {/* Incident List */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <span style={{ fontSize: 10.5, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
          Active Propagation Paths ({activeImpacts.length})
        </span>

        {activeImpacts.length === 0 ? (
          <div style={{ fontSize: 12, color: "var(--muted)", fontStyle: "italic", textAlign: "center", padding: "10px 0" }}>
            No active failure propagation
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 8, maxHeight: 150, overflowY: "auto", paddingRight: 4 }}>
            {activeImpacts.map((imp, idx) => (
              <div
                key={idx}
                style={{
                  padding: 10,
                  borderRadius: 8,
                  background: "var(--bg-2)",
                  borderLeft: `3px solid ${imp.color}`,
                  display: "flex",
                  flexDirection: "column",
                  gap: 4
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 11, fontWeight: 700, fontFamily: "monospace" }}>
                    {imp.caller} &rarr; {imp.dependency}
                  </span>
                  <span
                    style={{
                      fontSize: 8.5,
                      fontWeight: 800,
                      background: "rgba(255,255,255,0.05)",
                      color: imp.color,
                      padding: "1px 5px",
                      borderRadius: 4,
                      textTransform: "uppercase"
                    }}
                  >
                    {imp.edge.type}
                  </span>
                </div>
                <div style={{ fontSize: 10.5, color: "var(--ink-2)", display: "flex", justifyContent: "space-between" }}>
                  <span>Impact: <strong style={{ color: imp.color }}>{imp.impactType}</strong></span>
                  <span>Fallback: <em>{imp.edge.fallback}</em></span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-2px); }
          75% { transform: translateX(2px); }
        }
        .alert-shake {
          animation: shake 0.4s ease-in-out infinite alternate;
        }
      `}</style>
    </div>
  );
}
