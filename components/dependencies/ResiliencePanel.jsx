"use client";

import React from "react";

export default function ResiliencePanel({ config, updateConfig }) {
  const toggles = [
    {
      key: "retries",
      title: "Automatic Retries",
      desc: "Retries failing requests 3 times with exponential backoff. Mitigates transient errors.",
      emoji: "🔄"
    },
    {
      key: "circuitBreaker",
      title: "Circuit Breakers",
      desc: "Trips open when failures exceed 50%, returning fast fallbacks and protecting thread pools.",
      emoji: "🔌"
    },
    {
      key: "fallbacks",
      title: "Graceful Fallbacks",
      desc: "Serves cached data or limited functionality (e.g. oversell orders) instead of throwing 500s.",
      emoji: "🛡️"
    },
    {
      key: "dlq",
      title: "Dead Letter Queue (DLQ)",
      desc: "Pipes failed async tasks to a secondary broker for manual inspection rather than dropping them.",
      emoji: "📥"
    }
  ];

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
        <span style={{ fontSize: 20 }}>🛡️</span>
        <h3 style={{ fontSize: 16, fontWeight: 700, margin: 0, fontFamily: "monospace" }}>Resilience Safeguards</h3>
      </div>

      <p style={{ fontSize: 12.5, color: "var(--ink-2)", lineHeight: 1.45, margin: 0 }}>
        Activate architectural mitigation strategies. Watch how they intercept cascading failure paths in real-time.
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 4 }}>
        {toggles.map((t) => {
          const isEnabled = config[t.key];
          return (
            <div
              key={t.key}
              style={{
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-between",
                gap: 12,
                padding: "10px 12px",
                borderRadius: 10,
                background: isEnabled ? "var(--surface-warm)" : "var(--bg-2)",
                border: isEnabled ? "1.5px solid var(--brand)" : "1px solid var(--hairline-2)",
                transition: "all 0.2s"
              }}
            >
              <div style={{ display: "flex", gap: 10, flex: 1 }}>
                <span style={{ fontSize: 18, marginTop: 2 }}>{t.emoji}</span>
                <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  <span style={{ fontSize: 12.5, fontWeight: 700, color: "var(--ink)" }}>{t.title}</span>
                  <span style={{ fontSize: 10.5, color: "var(--ink-2)", lineHeight: 1.35 }}>{t.desc}</span>
                </div>
              </div>

              {/* Toggle Switch */}
              <button
                onClick={() => updateConfig(t.key, !isEnabled)}
                style={{
                  width: 44,
                  height: 22,
                  borderRadius: 11,
                  background: isEnabled ? "var(--brand)" : "var(--faint)",
                  border: "none",
                  position: "relative",
                  cursor: "pointer",
                  transition: "background-color 0.2s",
                  flexShrink: 0,
                  marginTop: 2
                }}
              >
                <span
                  style={{
                    width: 16,
                    height: 16,
                    borderRadius: "50%",
                    background: "#fff",
                    position: "absolute",
                    top: 3,
                    left: isEnabled ? 25 : 3,
                    transition: "left 0.2s cubic-bezier(0.3, 1.5, 0.7, 1)",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.2)"
                  }}
                />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
