"use client";

import React, { useState } from "react";

export default function VolumePanel() {
  const [persistentCount, setPersistentCount] = useState(254);
  const [volatileCount, setVolatileCount] = useState(12);
  const [containerId, setContainerId] = useState("bf-web-7c89f2");
  const [isRestarting, setIsRestarting] = useState(false);
  const [actionLog, setActionLog] = useState(["[System] Storage attached: /data mounted to pv-burger-farm-db."]);

  const placeOrder = () => {
    setPersistentCount(prev => prev + 1);
    setVolatileCount(prev => prev + 1);
    setActionLog(prev => [
      `[Event] Order placed. Volatile state: ${volatileCount + 1}. Persistent volume state: ${persistentCount + 1}.`,
      ...prev
    ]);
  };

  const killContainer = () => {
    setIsRestarting(true);
    setActionLog(prev => ["⚠️ Container bf-web crashed! Initializing rescheduling sequence...", ...prev]);

    setTimeout(() => {
      // Simulate container reset
      const newId = `bf-web-${Math.random().toString(36).substring(2, 8)}`;
      setContainerId(newId);
      setVolatileCount(0); // Volatile state wiped!
      setIsRestarting(false);
      setActionLog(prev => [
        `✓ Pod ${newId} running. Volatile storage reset to 0! Persistent volume retained: ${persistentCount} orders.`,
        ...prev
      ]);
    }, 1200);
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
        <span style={{ fontSize: 20 }}>💾</span>
        <h3 style={{ fontSize: 16, fontWeight: 700, margin: 0, fontFamily: "monospace" }}>Volume Persistence</h3>
      </div>

      <p style={{ fontSize: 12.5, color: "var(--ink-2)", lineHeight: 1.45, margin: 0 }}>
        <strong>Containers are ephemeral.</strong> When a container crashes or is rescheduled, its internal filesystem is completely wiped. We mount Persistent Volumes (PV) to keep data safe across lifecycles.
      </p>

      {/* Buttons */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        <button
          onClick={placeOrder}
          disabled={isRestarting}
          style={{
            background: "var(--surface-warm)",
            border: "1.5px solid var(--hairline-2)",
            color: "var(--ink)",
            borderRadius: 10,
            padding: "8px 12px",
            fontSize: 12,
            fontWeight: 700,
            cursor: isRestarting ? "not-allowed" : "pointer"
          }}
        >
          🍔 Place Food Order
        </button>

        <button
          onClick={killContainer}
          disabled={isRestarting}
          style={{
            background: "linear-gradient(135deg, #FF4D8D 0%, #BE123C 100%)",
            color: "#fff",
            border: "none",
            borderRadius: 10,
            padding: "8px 12px",
            fontSize: 12,
            fontWeight: 700,
            cursor: isRestarting ? "not-allowed" : "pointer",
            boxShadow: "0 4px 12px rgba(243,139,168,0.2)"
          }}
        >
          💀 Kill Container
        </button>
      </div>

      {/* Visual Analogy mapping */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 12,
          background: "var(--bg-2)",
          padding: 14,
          borderRadius: 12,
          border: "1px solid var(--hairline-2)",
          position: "relative",
          minHeight: 140
        }}
      >
        {/* Volatile Box */}
        <div
          style={{
            border: "1.5px solid #FAB387",
            borderRadius: 8,
            padding: 10,
            background: "var(--surface)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            opacity: isRestarting ? 0.3 : 1,
            transition: "opacity 0.2s"
          }}
        >
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <span style={{ fontSize: 13 }}>🚚</span>
              <strong style={{ fontSize: 11, fontFamily: "monospace" }}>{containerId}</strong>
            </div>
            <p style={{ fontSize: 9.5, color: "var(--muted)", marginTop: 4 }}>Volatile container filesystem (Scratch files)</p>
          </div>
          <div style={{ fontSize: 11, fontWeight: 700, marginTop: 10 }}>
            Orders in local cache: <span style={{ color: "#FAB387", fontFamily: "monospace" }}>{volatileCount}</span>
          </div>
        </div>

        {/* Persistent Box */}
        <div
          style={{
            border: "1.5px solid #A6E3A1",
            borderRadius: 8,
            padding: 10,
            background: "var(--surface)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between"
          }}
        >
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <span style={{ fontSize: 13 }}>🏪</span>
              <strong style={{ fontSize: 11, fontFamily: "monospace" }}>pv-database</strong>
            </div>
            <p style={{ fontSize: 9.5, color: "var(--muted)", marginTop: 4 }}>Persistent Volume (Host SSD mount)</p>
          </div>
          <div style={{ fontSize: 11, fontWeight: 700, marginTop: 10 }}>
            Orders in volume: <span style={{ color: "#A6E3A1", fontFamily: "monospace" }}>{persistentCount}</span>
          </div>
        </div>

        {/* Analogy helper tag */}
        <div
          style={{
            gridColumn: "span 2",
            textAlign: "center",
            fontSize: 10.5,
            color: "var(--muted)",
            borderTop: "1px dashed var(--hairline-2)",
            paddingTop: 8,
            marginTop: 4
          }}
        >
          <strong>Food Truck Analogy:</strong> Towing away a damaged truck (Volatile Container) wipes its dashboard logs, but the ingredients shed (Persistent Volume) remains intact.
        </div>
      </div>

      {/* Activity logs */}
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        <span style={{ fontSize: 10.5, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase" }}>Mount Logger</span>
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
          {actionLog.slice(0, 3).map((log, idx) => (
            <div key={idx} style={{ color: log.startsWith("⚠️") ? "#F38BA8" : log.startsWith("✓") ? "#A6E3A1" : "#CDD6F4" }}>
              {log}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
