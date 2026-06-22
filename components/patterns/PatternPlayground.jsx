"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function PatternPlayground() {
  const [traffic, setTraffic] = useState(30);     // 0-100
  const [latency, setLatency] = useState(20);     // 0-100
  const [failures, setFailures] = useState(10);   // 0-100
  const [budget, setBudget] = useState(80);       // 0-100

  // Realtime computed metrics
  const [successRate, setSuccessRate] = useState(100);
  const [systemLoad, setSystemLoad] = useState(0);

  // Active patterns based on simulation state
  const activePatterns = [];
  if (latency > 30 && failures > 5) activePatterns.push({ id: "retries", name: "Exponential Retries", reason: "Compensating transient delay" });
  if (failures > 45) activePatterns.push({ id: "circuit_breakers", name: "Circuit Breakers", reason: "Trip state: protecting backend thread pools" });
  if (traffic > 55) activePatterns.push({ id: "queues", name: "Asynchronous Queues", reason: "Buffering checkout transaction backlogs" });
  if (traffic > 55 && failures > 30) activePatterns.push({ id: "dlq", name: "Dead Letter Queue", reason: "Isolating poison pills out of worker pool" });
  if (latency > 60) activePatterns.push({ id: "caching", name: "Redis Query Caching", reason: "Bypassing database lookups for speed" });
  if (traffic > 80 && budget > 60) activePatterns.push({ id: "read_replicas", name: "SQL Read Replicas", reason: "Splitting read transactions horizontally" });
  if (traffic > 85 && budget < 50) activePatterns.push({ id: "rate_limiting", name: "API Rate Limiting", reason: "Shedding load due to cost budget caps" });

  // Calculate success rates
  useEffect(() => {
    let baseSuccess = 100 - (failures * 0.8) - (latency * 0.2);
    
    // Patterns make the system resilient!
    const hasRetries = activePatterns.some(p => p.id === "retries");
    const hasBreaker = activePatterns.some(p => p.id === "circuit_breakers");
    const hasQueue = activePatterns.some(p => p.id === "queues");
    const hasLimiter = activePatterns.some(p => p.id === "rate_limiting");

    if (hasRetries) baseSuccess += (failures * 0.35); // Retries recover some failures
    if (hasBreaker) baseSuccess += (failures * 0.15); // Breaker prevents system cascade
    if (hasQueue) baseSuccess += (traffic * 0.1);      // Queue avoids immediate buffer drops
    if (hasLimiter) baseSuccess -= (traffic * 0.05);   // Limiter drops requests explicitly

    setSuccessRate(Math.min(100, Math.max(0, Math.round(baseSuccess))));
    setSystemLoad(Math.min(100, Math.round(traffic * 0.7 + latency * 0.3)));
  }, [traffic, latency, failures, budget, activePatterns]);

  return (
    <div className="card" style={{ padding: "24px 28px", display: "flex", flexDirection: "column", gap: "20px" }}>
      <div>
        <span className="eyebrow" style={{ color: "var(--brand)" }}>Telemetry Sandbox</span>
        <h3 style={{ margin: "2px 0 0 0", fontSize: "18px" }}>Pattern Sandbox & Micro-Simulator</h3>
        <p style={{ margin: "4px 0 0 0", fontSize: "12px", color: "var(--muted)" }}>
          Adjust the environmental metrics below. Watch how the system load shifts and which design patterns trigger automatically to protect system operations.
        </p>
      </div>

      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 1.2fr",
        gap: "24px"
      }} className="playground-grid">
        {/* Left Side: Controls/Sliders */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }} className="sliders-column">
          {/* Traffic */}
          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", fontWeight: "700" }}>
              <span>Traffic Load (RPS)</span>
              <span style={{ color: "var(--brand-2)" }}>{traffic}%</span>
            </div>
            <input
              type="range" min="0" max="100" value={traffic}
              onChange={(e) => setTraffic(Number(e.target.value))}
              style={{ width: "100%", accentColor: "var(--brand)", cursor: "pointer" }}
            />
          </div>

          {/* Latency */}
          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", fontWeight: "700" }}>
              <span>Network Latency</span>
              <span style={{ color: "var(--amber)" }}>{latency}ms</span>
            </div>
            <input
              type="range" min="0" max="100" value={latency}
              onChange={(e) => setLatency(Number(e.target.value))}
              style={{ width: "100%", accentColor: "var(--amber)", cursor: "pointer" }}
            />
          </div>

          {/* Failures */}
          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", fontWeight: "700" }}>
              <span>Downstream Failure Rate</span>
              <span style={{ color: "rgb(239, 68, 68)" }}>{failures}%</span>
            </div>
            <input
              type="range" min="0" max="100" value={failures}
              onChange={(e) => setFailures(Number(e.target.value))}
              style={{ width: "100%", accentColor: "rgb(239, 68, 68)", cursor: "pointer" }}
            />
          </div>

          {/* Budget */}
          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", fontWeight: "700" }}>
              <span>Infra Cost Budget Limit</span>
              <span style={{ color: "var(--pop-blue)" }}>{budget}%</span>
            </div>
            <input
              type="range" min="0" max="100" value={budget}
              onChange={(e) => setBudget(Number(e.target.value))}
              style={{ width: "100%", accentColor: "var(--pop-blue)", cursor: "pointer" }}
            />
          </div>
        </div>

        {/* Right Side: Simulation telemetry readout */}
        <div style={{
          background: "var(--bg)",
          border: "1px solid var(--hairline-2)",
          borderRadius: "14px",
          padding: "20px",
          display: "flex",
          flexDirection: "column",
          gap: "16px"
        }} className="simulator-readout">
          {/* Indicators row */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <div style={{ background: "var(--surface)", border: "1px solid var(--hairline)", padding: "10px 14px", borderRadius: "8px" }}>
              <span style={{ fontSize: "10px", color: "var(--muted)", textTransform: "uppercase" }}>Transaction Success</span>
              <div style={{ fontSize: "20px", fontWeight: "800", color: successRate > 80 ? "var(--teal)" : successRate > 55 ? "var(--amber)" : "rgb(239, 68, 68)", fontFamily: "JetBrains Mono, monospace" }}>
                {successRate}%
              </div>
            </div>
            <div style={{ background: "var(--surface)", border: "1px solid var(--hairline)", padding: "10px 14px", borderRadius: "8px" }}>
              <span style={{ fontSize: "10px", color: "var(--muted)", textTransform: "uppercase" }}>Overall Nodes Load</span>
              <div style={{ fontSize: "20px", fontWeight: "800", color: systemLoad > 80 ? "rgb(239, 68, 68)" : "var(--brand)", fontFamily: "JetBrains Mono, monospace" }}>
                {systemLoad}%
              </div>
            </div>
          </div>

          {/* Triggered patterns checklist */}
          <div>
            <span style={{ fontSize: "11px", fontWeight: "700", color: "var(--muted)", textTransform: "uppercase" }}>
              Active Protective Patterns ({activePatterns.length})
            </span>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "8px" }}>
              {activePatterns.length === 0 ? (
                <div style={{ fontSize: "12px", color: "var(--faint)", fontStyle: "italic", padding: "10px 0" }}>
                  System operating in normal baseline. No protective pattern active.
                </div>
              ) : (
                activePatterns.map((pat) => (
                  <motion.div
                    key={pat.id}
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    style={{
                      background: "var(--surface)",
                      borderLeft: "4px solid var(--brand)",
                      borderRight: "1px solid var(--hairline)",
                      borderTop: "1px solid var(--hairline)",
                      borderBottom: "1px solid var(--hairline)",
                      borderRadius: "6px",
                      padding: "8px 12px",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center"
                    }}
                  >
                    <div>
                      <div style={{ fontSize: "12px", fontWeight: "700", color: "var(--brand-2)" }}>{pat.name}</div>
                      <div style={{ fontSize: "10px", color: "var(--muted)", marginTop: "2px" }}>{pat.reason}</div>
                    </div>
                    <span style={{ fontSize: "14px" }}>🛡️</span>
                  </motion.div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
