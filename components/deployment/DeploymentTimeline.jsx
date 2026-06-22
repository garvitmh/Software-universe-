"use client";

import React, { useState, useEffect } from "react";
import { DEPLOYMENT_SCHEMA } from "./DeploymentSchema";

export default function DeploymentTimeline() {
  const { timelineStages } = DEPLOYMENT_SCHEMA;
  const [activeStep, setActiveStep] = useState(-1);
  const [consoleLogs, setConsoleLogs] = useState(["[System] Pipeline idle. Awaiting push trigger."]);

  const triggerPipeline = () => {
    setActiveStep(0);
    setConsoleLogs(["[Git] Pushed commit 9c8b2f1 to main branch.", "[Git] Triggering GitHub Actions webhook event..."]);
  };

  useEffect(() => {
    if (activeStep === -1) return;

    const timeout = setTimeout(() => {
      if (activeStep === 0) {
        setActiveStep(1);
        setConsoleLogs(prev => [
          "[CI] Spinning up runner environment (ubuntu-latest)...",
          "[CI] Running ESLint code check... passed.",
          "[CI] Running Vitest suite (142 test assertions)... passed.",
          ...prev
        ]);
      } else if (activeStep === 1) {
        setActiveStep(2);
        setConsoleLogs(prev => [
          "[Docker] Initializing build context.",
          "[Docker] STEP 1/4 FROM node:18-alpine &rarr; Cache hit.",
          "[Docker] STEP 3/4 RUN npm install &rarr; Cache hit.",
          "[Docker] STEP 4/4 COPY src/ . &rarr; Layer manifest compiled: sha256:4a8df90.",
          ...prev
        ]);
      } else if (activeStep === 2) {
        setActiveStep(3);
        setConsoleLogs(prev => [
          "[Registry] Authenticating with AWS ECR registry...",
          "[Registry] Uploading image layer digests...",
          "[Registry] Successfully tagged: 123456789.dkr.ecr.us-east-1.amazonaws.com/bf-web:9c8b2f1",
          ...prev
        ]);
      } else if (activeStep === 3) {
        setActiveStep(4);
        setConsoleLogs(prev => [
          "[Deploy] Instructing Kubernetes api-server to update deployment.",
          "[Deploy] Desired state updated. Scaling up replica-set (v2)...",
          ...prev
        ]);
      } else if (activeStep === 4) {
        setActiveStep(5);
        setConsoleLogs(prev => [
          "[Health] Ticking liveness probes... GET /healthz &rarr; 200 OK",
          "[Health] Ticking readiness probes... GET /readyz &rarr; 200 OK",
          ...prev
        ]);
      } else if (activeStep === 5) {
        setActiveStep(-1);
        setConsoleLogs(prev => [
          "🎉 [Pipeline] Deployment successfully updated with zero downtime! Replicas healthy.",
          ...prev
        ]);
      }
    }, 2200);

    return () => clearTimeout(timeout);
  }, [activeStep]);

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
        <span style={{ fontSize: 20 }}>⛓️</span>
        <h3 style={{ fontSize: 16, fontWeight: 700, margin: 0, fontFamily: "monospace" }}>CI/CD Deployment Timeline</h3>
      </div>

      <p style={{ fontSize: 12.5, color: "var(--ink-2)", lineHeight: 1.45, margin: 0 }}>
        The CI/CD pipeline automates code validation, image packaging, and deployment schedules to ensure every commit is production-ready.
      </p>

      {/* Trigger build */}
      <button
        onClick={triggerPipeline}
        disabled={activeStep !== -1}
        style={{
          background: activeStep !== -1 ? "var(--faint)" : "linear-gradient(135deg, #7C5CFC 0%, #6366F1 100%)",
          color: "#fff",
          border: "none",
          borderRadius: 8,
          padding: "10px",
          fontSize: 12,
          fontWeight: 700,
          cursor: activeStep !== -1 ? "not-allowed" : "pointer",
          boxShadow: activeStep !== -1 ? "none" : "0 4px 12px rgba(124,92,252,0.2)"
        }}
      >
        {activeStep !== -1 ? "🚀 Deployment Pipeline Running..." : "🚀 Push Code to Production (Trigger CI/CD)"}
      </button>

      {/* Visual vertical pipeline steps */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 4 }}>
        {timelineStages.map((st, idx) => {
          const isCompleted = activeStep > idx || (activeStep === -1 && consoleLogs[0]?.startsWith("🎉"));
          const isCurrent = activeStep === idx;
          
          return (
            <div
              key={st.id}
              style={{
                display: "flex",
                gap: 12,
                alignItems: "flex-start",
                opacity: isCompleted ? 0.9 : isCurrent ? 1 : 0.4,
                transition: "opacity 0.25s"
              }}
            >
              {/* Step indicator circle */}
              <div
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: "50%",
                  border: isCompleted
                    ? "1.5px solid #A6E3A1"
                    : isCurrent
                    ? "1.5px solid var(--brand)"
                    : "1.5px solid var(--hairline-2)",
                  background: isCompleted
                    ? "#A6E3A1"
                    : isCurrent
                    ? "rgba(99,102,241,0.1)"
                    : "transparent",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 9.5,
                  fontWeight: 700,
                  color: isCompleted ? "#1E1E2E" : isCurrent ? "var(--brand)" : "var(--muted)",
                  flexShrink: 0,
                  marginTop: 2,
                  animation: isCurrent ? "pulse-border 1.5s infinite" : "none"
                }}
              >
                {isCompleted ? "✓" : idx + 1}
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <span style={{ fontSize: 12.5, fontWeight: 700, color: "var(--ink)" }}>{st.label}</span>
                <span style={{ fontSize: 10.5, color: "var(--ink-2)", lineHeight: 1.35 }}>{st.desc}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pipeline terminal log outputs */}
      <div style={{ display: "flex", flexDirection: "column", gap: 6, borderTop: "1px solid var(--hairline)", paddingTop: 14 }}>
        <span style={{ fontSize: 10.5, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase" }}>CI/CD Pipeline Runner Output</span>
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
          {consoleLogs.map((log, idx) => (
            <div key={idx} style={{ color: log.startsWith("🎉") || log.startsWith("✓") ? "#A6E3A1" : log.startsWith("❌") || log.startsWith("⚠️") ? "#F38BA8" : "#CDD6F4" }}>
              {log}
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes pulse-border {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
      `}</style>
    </div>
  );
}
