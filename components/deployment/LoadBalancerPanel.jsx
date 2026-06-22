"use client";

import React, { useState } from "react";
import { DEPLOYMENT_SCHEMA } from "./DeploymentSchema";

export default function LoadBalancerPanel() {
  const { algorithms } = DEPLOYMENT_SCHEMA;
  const [selectedAlgo, setSelectedAlgo] = useState("round-robin");
  const [activeUser, setActiveUser] = useState("User A");

  // Local state for pods connections
  const [pods, setPods] = useState([
    { id: 1, name: "bf-web-pod-1", conns: 2, weight: 3 },
    { id: 2, name: "bf-web-pod-2", conns: 4, weight: 1 },
    { id: 3, name: "bf-web-pod-3", conns: 1, weight: 1 }
  ]);

  const [lastAssignedIdx, setLastAssignedIdx] = useState(-1);
  const [routingLog, setRoutingLog] = useState(["[LB] Initialized load balancing router."]);

  // Routing algorithm selector logic
  const sendRequest = () => {
    let targetIdx = 0;

    if (selectedAlgo === "round-robin") {
      targetIdx = (lastAssignedIdx + 1) % pods.length;
      setLastAssignedIdx(targetIdx);
    } else if (selectedAlgo === "least-conn") {
      // Find pod with minimum connections
      let minConns = Infinity;
      pods.forEach((p, idx) => {
        if (p.conns < minConns) {
          minConns = p.conns;
          targetIdx = idx;
        }
      });
    } else if (selectedAlgo === "weighted") {
      // Direct load based on weight (Pod 1 has weight 3, others have 1)
      // We can mock weight load routing
      const rand = Math.random() * 5; // Total weight is 5 (3 + 1 + 1)
      if (rand < 3) targetIdx = 0;
      else if (rand < 4) targetIdx = 1;
      else targetIdx = 2;
    } else if (selectedAlgo === "sticky") {
      // Sticky session binds User A to Pod 1, User B to Pod 2
      if (activeUser === "User A") {
        targetIdx = 0;
      } else {
        targetIdx = 1;
      }
    }

    // Increment connection count for target pod
    setPods(prev => {
      const next = [...prev];
      next[targetIdx] = { ...next[targetIdx], conns: next[targetIdx].conns + 1 };
      return next;
    });

    const routeMsg = `[LB] Routed request from ${selectedAlgo === "sticky" ? activeUser : "Client"} &rarr; ${pods[targetIdx].name} (${selectedAlgo.replace("-", " ")}).`;
    setRoutingLog(prev => [routeMsg, ...prev]);

    // Decrement connection after request completion delay
    setTimeout(() => {
      setPods(prev => {
        const next = [...prev];
        next[targetIdx] = { ...next[targetIdx], conns: Math.max(0, next[targetIdx].conns - 1) };
        return next;
      });
    }, 1800);
  };

  const getAlgoDescription = (id) => {
    return algorithms.find(a => a.id === id)?.desc || "";
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
        <span style={{ fontSize: 20 }}>⚖️</span>
        <h3 style={{ fontSize: 16, fontWeight: 700, margin: 0, fontFamily: "monospace" }}>Load Balancer Routing</h3>
      </div>

      <p style={{ fontSize: 12.5, color: "var(--ink-2)", lineHeight: 1.45, margin: 0 }}>
        Load balancers distribute traffic across replica containers. Select an algorithm and send requests to watch routing decisions.
      </p>

      {/* Select algorithm tabs */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, background: "var(--bg-2)", padding: 4, borderRadius: 10, border: "1px solid var(--hairline-2)" }}>
        {algorithms.map((algo) => {
          const isSelected = selectedAlgo === algo.id;
          return (
            <button
              key={algo.id}
              onClick={() => setSelectedAlgo(algo.id)}
              style={{
                background: isSelected ? "var(--surface)" : "transparent",
                color: isSelected ? "var(--ink)" : "var(--muted)",
                border: "none",
                borderRadius: 6,
                padding: "6px 0",
                fontSize: 11,
                fontWeight: 700,
                cursor: "pointer",
                transition: "all 0.15s"
              }}
            >
              {algo.name}
            </button>
          );
        })}
      </div>

      {/* Algo descriptions info */}
      <div style={{ fontSize: 11.5, background: "var(--surface-warm)", padding: 10, borderRadius: 8, border: "1.5px solid var(--brand)", color: "var(--ink-2)", lineHeight: 1.4 }}>
        <strong>Algorithm logic:</strong> {getAlgoDescription(selectedAlgo)}
      </div>

      {/* Sticky User selection */}
      {selectedAlgo === "sticky" && (
        <div style={{ display: "flex", justifyBetween: "space-between", alignItems: "center", gap: 10, background: "var(--bg-2)", padding: "8px 12px", borderRadius: 8 }}>
          <span style={{ fontSize: 11, fontWeight: 700 }}>Choose Client Profile:</span>
          <div style={{ display: "flex", gap: 6 }}>
            {["User A", "User B"].map(usr => (
              <button
                key={usr}
                onClick={() => setActiveUser(usr)}
                style={{
                  background: activeUser === usr ? "var(--brand)" : "var(--surface)",
                  color: activeUser === usr ? "#fff" : "var(--ink)",
                  border: "1px solid var(--hairline-2)",
                  borderRadius: 4,
                  padding: "2px 8px",
                  fontSize: 10,
                  fontWeight: 700,
                  cursor: "pointer"
                }}
              >
                {usr}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Action triggers */}
      <button
        onClick={sendRequest}
        style={{
          background: "linear-gradient(135deg, #2D7DF6 0%, #7C5CFC 100%)",
          color: "#fff",
          border: "none",
          borderRadius: 8,
          padding: "10px",
          fontSize: 12,
          fontWeight: 700,
          cursor: "pointer",
          boxShadow: "0 4px 12px rgba(124,92,252,0.2)"
        }}
      >
        🛰️ Send Client API Request
      </button>

      {/* Pod connections display layout */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 4 }}>
        <span style={{ fontSize: 10.5, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase" }}>Backend Pod Target Replicas</span>

        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {pods.map((p) => {
            // Draw visual weight bar if algorithm is weighted
            return (
              <div
                key={p.id}
                style={{
                  padding: "8px 12px",
                  borderRadius: 8,
                  background: "var(--bg-2)",
                  border: "1px solid var(--hairline-2)",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center"
                }}
              >
                <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  <span style={{ fontSize: 12, fontWeight: 700, fontFamily: "monospace" }}>{p.name}</span>
                  {selectedAlgo === "weighted" && (
                    <span style={{ fontSize: 9, color: "var(--muted)" }}>Weight: {p.weight}x requests</span>
                  )}
                  {selectedAlgo === "sticky" && (
                    <span style={{ fontSize: 9, color: "var(--muted)" }}>
                      Sticky Session: {p.id === 1 ? "Binds User A" : p.id === 2 ? "Binds User B" : "No Sessions"}
                    </span>
                  )}
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
                    <span style={{ fontSize: 9, color: "var(--muted)", textTransform: "uppercase" }}>Conns</span>
                    <span style={{ fontSize: 12, fontWeight: 700, fontFamily: "monospace", color: "var(--brand)" }}>
                      {p.conns} active
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Routing logs */}
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        <span style={{ fontSize: 10.5, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase" }}>Load Balancer Logs</span>
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
          {routingLog.slice(0, 3).map((log, idx) => (
            <div key={idx} style={{ color: "#CDD6F4" }}>
              {log}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
