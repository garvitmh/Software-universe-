"use client";

import React from "react";

export default function ChaosMonkeyPanel({ services, nodeStates, toggleNodeState, triggerRandomHavoc, restoreAll }) {
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
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 20 }}>🐒</span>
          <h3 style={{ fontSize: 16, fontWeight: 700, margin: 0, fontFamily: "monospace" }}>Chaos Monkey</h3>
        </div>
        <span
          style={{
            fontSize: 10,
            fontWeight: 800,
            background: "rgba(243, 139, 168, 0.1)",
            color: "#F38BA8",
            padding: "2px 8px",
            borderRadius: 6,
            textTransform: "uppercase",
            letterSpacing: "0.06em"
          }}
        >
          Enabled
        </span>
      </div>

      <p style={{ fontSize: 12.5, color: "var(--ink-2)", lineHeight: 1.45, margin: 0 }}>
        Simulate real-world environment volatility. Manually crash services or run automated havoc simulations to watch how failure ripples through the graph.
      </p>

      {/* Action Buttons */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 4 }}>
        <button
          onClick={triggerRandomHavoc}
          style={{
            background: "linear-gradient(135deg, #FF4D8D 0%, #BE123C 100%)",
            color: "#fff",
            border: "none",
            borderRadius: 10,
            padding: "10px 14px",
            fontSize: 12,
            fontWeight: 700,
            cursor: "pointer",
            boxShadow: "0 4px 12px rgba(243, 139, 168, 0.25)",
            transition: "transform 0.15s, opacity 0.15s",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 6
          }}
          onMouseDown={(e) => { e.currentTarget.style.transform = "scale(0.97)"; }}
          onMouseUp={(e) => { e.currentTarget.style.transform = "scale(1)"; }}
        >
          <span>🔥</span> Inject Havoc
        </button>

        <button
          onClick={restoreAll}
          style={{
            background: "var(--surface)",
            border: "1.5px solid var(--hairline-2)",
            color: "var(--ink)",
            borderRadius: 10,
            padding: "10px 14px",
            fontSize: 12,
            fontWeight: 700,
            cursor: "pointer",
            transition: "all 0.15s",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 6
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "#A6E3A1";
            e.currentTarget.style.color = "#A6E3A1";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "var(--hairline-2)";
            e.currentTarget.style.color = "var(--ink)";
          }}
        >
          <span>💚</span> Heal System
        </button>
      </div>

      {/* Service Toggles list */}
      <div
        style={{
          borderTop: "1px solid var(--hairline)",
          paddingTop: 14,
          display: "flex",
          flexDirection: "column",
          gap: 10
        }}
      >
        <span style={{ fontSize: 10.5, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
          Service Nodes Status ({services.length})
        </span>

        <div style={{ display: "flex", flexDirection: "column", gap: 6, maxHeight: 180, overflowY: "auto", paddingRight: 4 }} className="monkey-list">
          {services.map((srv) => {
            const isCrashed = nodeStates[srv.id] === "crashed" || nodeStates[srv.id] === "collapsed";
            return (
              <div
                key={srv.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "8px 10px",
                  borderRadius: 8,
                  background: "var(--bg-2)",
                  border: "1px solid var(--hairline-2)"
                }}
              >
                <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  <span style={{ fontSize: 12, fontWeight: 700, fontFamily: "monospace" }}>{srv.name}</span>
                  <span style={{ fontSize: 9.5, color: "var(--muted)" }}>ID: {srv.id}</span>
                </div>

                {/* Custom Toggle Switch */}
                <button
                  onClick={() => toggleNodeState(srv.id)}
                  style={{
                    width: 48,
                    height: 24,
                    borderRadius: 12,
                    background: isCrashed ? "#F38BA8" : "#A6E3A1",
                    border: "none",
                    position: "relative",
                    cursor: "pointer",
                    transition: "background-color 0.2s"
                  }}
                >
                  <span
                    style={{
                      width: 18,
                      height: 18,
                      borderRadius: "50%",
                      background: "#fff",
                      position: "absolute",
                      top: 3,
                      left: isCrashed ? 27 : 3,
                      transition: "left 0.2s cubic-bezier(0.3, 1.5, 0.7, 1)",
                      boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 8.5
                    }}
                  >
                    {isCrashed ? "💀" : "⚡"}
                  </span>
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
