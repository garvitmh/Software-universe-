"use client";

import React, { useState } from "react";

export default function EnvironmentPanel() {
  const [injectError, setInjectError] = useState(false);
  const [deployState, setDeployState] = useState("idle"); // 'idle' | 'starting' | 'healthy' | 'crashed'
  const [logs, setLogs] = useState([]);

  const handleDeploy = () => {
    setDeployState("starting");
    setLogs(["[1/3] Reading environment manifest...", "[2/3] Initializing Prisma database client..."]);

    setTimeout(() => {
      if (injectError) {
        setDeployState("crashed");
        setLogs(prev => [
          ...prev,
          "❌ [Fatal] process.env.STRIPE_API_KEY is undefined!",
          "❌ [Fatal] Webhook signature validator failed to initialize.",
          "⚠️ Container crashed. Process exited with code 1. Status: CrashLoopBackOff."
        ]);
      } else {
        setDeployState("healthy");
        setLogs(prev => [
          ...prev,
          "✓ Database connection established successfully.",
          "✓ Stripe webhook keys verified.",
          "🚀 Server initialized on port 3000. Status: Running."
        ]);
      }
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
        <span style={{ fontSize: 20 }}>🔑</span>
        <h3 style={{ fontSize: 16, fontWeight: 700, margin: 0, fontFamily: "monospace" }}>Environment Secrets</h3>
      </div>

      <p style={{ fontSize: 12.5, color: "var(--ink-2)", lineHeight: 1.45, margin: 0 }}>
        Never hardcode API keys or passwords inside Docker images. Inject them dynamically at runtime using environment variables or Secrets vaults.
      </p>

      {/* Config parameters grid */}
      <div style={{ background: "var(--bg-2)", border: "1px solid var(--hairline-2)", borderRadius: 10, padding: 12 }}>
        <span style={{ fontSize: 9.5, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", display: "block", marginBottom: 6 }}>
          Container .env Bindings
        </span>

        <div style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 11, fontFamily: "monospace" }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ color: "#89B4FA" }}>PORT</span>
            <span>3000</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ color: "#89B4FA" }}>DATABASE_URL</span>
            <span style={{ wordBreak: "break-all" }}>postgresql://db:5432/orders</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ color: "#89B4FA" }}>JWT_SECRET</span>
            <span>hs256_bf_********</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ color: "#89B4FA" }}>STRIPE_API_KEY</span>
            {injectError ? (
              <span style={{ color: "#F38BA8", fontWeight: 700 }}>[MISSING]</span>
            ) : (
              <span>sk_live_********</span>
            )}
          </div>
        </div>
      </div>

      {/* Outage Toggle */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "var(--surface-warm)", padding: "10px 14px", borderRadius: 10, border: "1px solid var(--hairline-2)" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <span style={{ fontSize: 12.5, fontWeight: 700 }}>Simulate Config Error</span>
          <span style={{ fontSize: 10, color: "var(--muted)" }}>Omits Stripe key to trigger crash on boot</span>
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
          {injectError ? "Error Armed" : "Safe Config"}
        </button>
      </div>

      {/* Deploy Actions */}
      <button
        onClick={handleDeploy}
        disabled={deployState === "starting"}
        style={{
          background: "linear-gradient(135deg, #7C5CFC 0%, #6366F1 100%)",
          color: "#fff",
          border: "none",
          borderRadius: 8,
          padding: "10px",
          fontSize: 12,
          fontWeight: 700,
          cursor: "pointer",
          boxShadow: "0 4px 12px rgba(124, 92, 252, 0.2)"
        }}
      >
        {deployState === "starting" ? "Booting Pod..." : "⚡ Deploy Container"}
      </button>

      {/* Deployment console & state indicator */}
      {deployState !== "idle" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 8, borderTop: "1px solid var(--hairline)", paddingTop: 14 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 10.5, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase" }}>Runtime Container State</span>
            <span
              style={{
                fontSize: 10,
                fontWeight: 800,
                color: deployState === "healthy" ? "#A6E3A1" : deployState === "crashed" ? "#F38BA8" : "#89B4FA",
                textTransform: "uppercase"
              }}
            >
              {deployState}
            </span>
          </div>

          <div
            style={{
              background: "#11111B",
              borderRadius: 8,
              padding: 10,
              fontFamily: "monospace",
              fontSize: 10.5,
              color: "#CDD6F4",
              display: "flex",
              flexDirection: "column",
              gap: 4
            }}
          >
            {logs.map((log, idx) => (
              <div key={idx} style={{ color: log.startsWith("❌") || log.startsWith("⚠️") ? "#F38BA8" : log.startsWith("✓") ? "#A6E3A1" : "#CDD6F4" }}>
                {log}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
