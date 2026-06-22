"use client";

import React, { useState, useEffect } from "react";

export default function MetricsPanel() {
  const [load, setLoad] = useState(20); // 20% baseline load slider
  const [cpu, setCpu] = useState(25);
  const [memory, setMemory] = useState(180); // MB
  const [latency, setLatency] = useState(14); // ms
  const [replicas, setReplicas] = useState(3);
  const [isAutoscaling, setIsAutoscaling] = useState(false);

  // Update telemetry values with load slider changes and minor random jitter
  useEffect(() => {
    const jitter = setInterval(() => {
      const randCpuJitter = Math.floor(Math.random() * 5) - 2; // -2% to +2%
      const randLatJitter = Math.floor(Math.random() * 4) - 2; // -2ms to +2ms
      
      // CPU scales proportionally with load slider
      const computedCpu = Math.min(100, Math.max(10, Math.floor(load * 1.2) + randCpuJitter));
      setCpu(computedCpu);

      // Memory scales slowly with load
      setMemory(Math.min(512, Math.floor(120 + load * 1.5)));

      // Latency grows exponentially at high loads
      const computedLatency = Math.floor(
        load > 80 
          ? 120 + (load - 80) * 12 + randLatJitter 
          : 12 + load * 0.4 + randLatJitter
      );
      setLatency(Math.max(5, computedLatency));

      // HPA Autoscaling trigger if CPU > 70%
      if (computedCpu > 70 && replicas === 3) {
        setIsAutoscaling(true);
        // Spin replica after delay
        setTimeout(() => {
          setReplicas(5);
          setIsAutoscaling(false);
        }, 3000);
      } else if (computedCpu <= 50 && replicas === 5) {
        setIsAutoscaling(true);
        // Cool down scale down replica
        setTimeout(() => {
          setReplicas(3);
          setIsAutoscaling(false);
        }, 3000);
      }
    }, 1000);

    return () => clearInterval(jitter);
  }, [load, replicas]);

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
        <span style={{ fontSize: 20 }}>📈</span>
        <h3 style={{ fontSize: 16, fontWeight: 700, margin: 0, fontFamily: "monospace" }}>Telemetry Metrics & HPA</h3>
      </div>

      <p style={{ fontSize: 12.5, color: "var(--ink-2)", lineHeight: 1.45, margin: 0 }}>
        <strong>Horizontal Pod Autoscaler (HPA)</strong> monitors CPU/Memory telemetry. When load surges past targets (e.g. 70% CPU), HPA automatically spins up replicas to handle traffic.
      </p>

      {/* Traffic load slider */}
      <div style={{ display: "flex", flexDirection: "column", gap: 6, background: "var(--bg-2)", padding: 12, borderRadius: 10, border: "1px solid var(--hairline-2)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, fontWeight: 700 }}>
          <span>Simulate Traffic Volume:</span>
          <span style={{ color: "var(--brand)" }}>{load * 20} requests/sec</span>
        </div>
        <input
          type="range"
          min="10"
          max="100"
          value={load}
          onChange={(e) => setLoad(Number(e.target.value))}
          style={{ width: "100%", cursor: "ew-resize" }}
        />
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 9.5, color: "var(--muted)" }}>
          <span>Low Load</span>
          <span>Surge Peak</span>
        </div>
      </div>

      {/* Telemetry metrics dials */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        {/* CPU */}
        <div style={{ background: "var(--bg-2)", border: "1px solid var(--hairline-2)", borderRadius: 10, padding: 10 }}>
          <div style={{ fontSize: 9.5, color: "var(--muted)", textTransform: "uppercase" }}>Average Pod CPU</div>
          <div style={{ fontSize: 18, fontWeight: 800, fontFamily: "monospace", color: cpu > 70 ? "#F38BA8" : "#A6E3A1", marginTop: 4 }}>
            {cpu}%
          </div>
          <div style={{ height: 4, background: "rgba(255,255,255,0.05)", borderRadius: 2, overflow: "hidden", marginTop: 8 }}>
            <div style={{ height: "100%", width: `${cpu}%`, background: cpu > 70 ? "#F38BA8" : "#A6E3A1", transition: "width 0.5s ease" }} />
          </div>
        </div>

        {/* Memory */}
        <div style={{ background: "var(--bg-2)", border: "1px solid var(--hairline-2)", borderRadius: 10, padding: 10 }}>
          <div style={{ fontSize: 9.5, color: "var(--muted)", textTransform: "uppercase" }}>Average Pod RAM</div>
          <div style={{ fontSize: 18, fontWeight: 800, fontFamily: "monospace", color: memory > 400 ? "#F38BA8" : "var(--ink)", marginTop: 4 }}>
            {memory} MB
          </div>
          <div style={{ height: 4, background: "rgba(255,255,255,0.05)", borderRadius: 2, overflow: "hidden", marginTop: 8 }}>
            <div style={{ height: "100%", width: `${(memory / 512) * 100}%`, background: "var(--brand)", transition: "width 0.5s ease" }} />
          </div>
        </div>

        {/* Latency */}
        <div style={{ background: "var(--bg-2)", border: "1px solid var(--hairline-2)", borderRadius: 10, padding: 10 }}>
          <div style={{ fontSize: 9.5, color: "var(--muted)", textTransform: "uppercase" }}>API Latency</div>
          <div style={{ fontSize: 18, fontWeight: 800, fontFamily: "monospace", color: latency > 100 ? "#F38BA8" : "var(--ink)", marginTop: 4 }}>
            {latency} ms
          </div>
        </div>

        {/* Active replicas */}
        <div style={{ background: "var(--bg-2)", border: "1px solid var(--hairline-2)", borderRadius: 10, padding: 10 }}>
          <div style={{ fontSize: 9.5, color: "var(--muted)", textTransform: "uppercase" }}>Active Pod Replicas</div>
          <div style={{ fontSize: 18, fontWeight: 800, fontFamily: "monospace", color: "var(--ink)", marginTop: 4 }}>
            {replicas} Pods
          </div>
        </div>
      </div>

      {/* Autoscale status notifications */}
      {isAutoscaling && (
        <div
          style={{
            border: "1.5px solid rgba(249, 226, 175, 0.3)",
            background: "rgba(249, 226, 175, 0.05)",
            color: "#F9E2AF",
            borderRadius: 10,
            padding: "8px 12px",
            fontSize: 11.5,
            textAlign: "center",
            fontFamily: "monospace",
            animation: "pulse-yellow 1.5s infinite"
          }}
        >
          {cpu > 70 ? "⚡ HPA: CPU threshold breached. Provisioning 2 new replicas..." : "⚡ HPA: Load cooling down. De-provisioning replicas..."}
        </div>
      )}

      <style>{`
        @keyframes pulse-yellow {
          0%, 100% { opacity: 0.8; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  );
}
