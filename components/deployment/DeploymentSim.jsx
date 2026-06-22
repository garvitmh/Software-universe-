"use client";

import React, { useState, useEffect } from "react";
import ContainerNode from "./ContainerNode";
import DeploymentTimeline from "./DeploymentTimeline";
import ImageLayer from "./ImageLayer";
import VolumePanel from "./VolumePanel";
import EnvironmentPanel from "./EnvironmentPanel";
import HealthCheckPanel from "./HealthCheckPanel";
import LoadBalancerPanel from "./LoadBalancerPanel";
import RollingDeployPanel from "./RollingDeployPanel";
import BlueGreenPanel from "./BlueGreenPanel";
import CanaryPanel from "./CanaryPanel";
import KubernetesPanel from "./KubernetesPanel";
import FailureRecoveryPanel from "./FailureRecoveryPanel";
import MetricsPanel from "./MetricsPanel";
import { motion, AnimatePresence } from "framer-motion";

export default function DeploymentSim() {
  // Sidebar Main Tabs
  const [activeTab, setActiveTab] = useState("pipeline");
  // Sub-tabs inside "deployments" tab
  const [deploySubTab, setDeploySubTab] = useState("rolling");

  // Replicas pool state for the live left pipeline panel
  const [replicas, setReplicas] = useState([
    { id: 1, name: "bf-web-pod-1", version: "v1.0.0", status: "HEALTHY", traffic: 33, conns: 3, errors: 0 },
    { id: 2, name: "bf-web-pod-2", version: "v1.0.0", status: "HEALTHY", traffic: 33, conns: 2, errors: 0 },
    { id: 3, name: "bf-web-pod-3", version: "v1.0.0", status: "HEALTHY", traffic: 34, conns: 4, errors: 0 }
  ]);

  // Handle manual/automatic pod crashes in left pipeline
  const togglePodCrash = (id) => {
    setReplicas(prev => {
      return prev.map(p => {
        if (p.id === id) {
          const nextStatus = p.status === "HEALTHY" ? "CRASHED" : "HEALTHY";
          const nextErrors = nextStatus === "CRASHED" ? p.errors + 1 : p.errors;
          return { ...p, status: nextStatus, errors: nextErrors, traffic: nextStatus === "CRASHED" ? 0 : 33 };
        }
        return p;
      });
    });
  };

  // Rebalance active traffic shares when a pod crashes/recovers
  useEffect(() => {
    setReplicas(prev => {
      const activePods = prev.filter(p => p.status === "HEALTHY" || p.status === "DEGRADED");
      const activeCount = activePods.length;
      
      if (activeCount === 0) {
        return prev.map(p => ({ ...p, traffic: 0 }));
      }
      
      const share = Math.floor(100 / activeCount);
      return prev.map(p => {
        if (p.status === "HEALTHY" || p.status === "DEGRADED") {
          return { ...p, traffic: share };
        }
        return { ...p, traffic: 0 };
      });
    });
  }, [replicas.map(p => p.status).join(",")]);

  // Simulate active request flows every second
  useEffect(() => {
    const interval = setInterval(() => {
      setReplicas(prev => {
        return prev.map(p => {
          if (p.status === "HEALTHY") {
            const jitter = Math.floor(Math.random() * 3) - 1; // -1 to +1
            return { ...p, conns: Math.max(1, p.conns + jitter) };
          }
          return p;
        });
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* World header */}
      <div>
        <span className="pill" style={{ background: "rgba(244, 63, 94, 0.08)", color: "#F43F5E", marginBottom: 8 }}>
          Phase 4 · Deployment World
        </span>
        <h2 style={{ fontSize: 30, fontWeight: 700, letterSpacing: "-0.01em", margin: 0 }}>
          Live Production Pipeline Sandbox
        </h2>
        <p style={{ fontSize: 14.5, color: "var(--ink-2)", marginTop: 6, maxWidth: 800 }}>
          Interact with the live cluster pipeline on the left. Toggle configuration variable cards, inspect cached build layers, and trigger rollout updates on the right.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: 24 }} className="deployment-grid">
        {/* Left Column: Visual Pipeline Canvas */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div
            style={{
              background: "var(--surface-warm)",
              border: "1px solid var(--hairline)",
              borderRadius: 20,
              padding: "20px 24px",
              boxShadow: "inset 0 0 20px rgba(0,0,0,0.02)",
              display: "flex",
              flexDirection: "column",
              gap: 20,
              position: "relative",
              overflow: "hidden",
              minHeight: 550
            }}
          >
            {/* Grid background */}
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundImage: "radial-gradient(var(--hairline) 1px, transparent 1px)",
                backgroundSize: "20px 20px",
                opacity: 0.5,
                pointerEvents: "none"
              }}
            />

            {/* Pipeline Stage 1: Build source trigger */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", position: "relative", zIndex: 2 }}>
              <div
                style={{
                  background: "var(--surface)",
                  border: "1.5px solid var(--hairline-2)",
                  borderRadius: 12,
                  padding: "10px 14px",
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  boxShadow: "var(--shadow)"
                }}
              >
                <span style={{ fontSize: 22 }}>💻</span>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <span style={{ fontSize: 12, fontWeight: 700 }}>Git Repo (bf-app)</span>
                  <span style={{ fontSize: 9.5, color: "var(--muted)", fontFamily: "monospace" }}>commit: 9c8b2f1</span>
                </div>
              </div>

              {/* Connecting animated arrow */}
              <div style={{ flex: 1, height: 2, borderBottom: "2px dashed var(--brand)", position: "relative", margin: "0 14px" }}>
                <span
                  style={{
                    position: "absolute",
                    top: -5,
                    left: "50%",
                    fontSize: 10,
                    animation: "flow-right 2s linear infinite"
                  }}
                >
                  🚀
                </span>
              </div>

              <div
                style={{
                  background: "var(--surface)",
                  border: "1.5px solid var(--hairline-2)",
                  borderRadius: 12,
                  padding: "10px 14px",
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  boxShadow: "var(--shadow)"
                }}
              >
                <span style={{ fontSize: 22 }}>🐳</span>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <span style={{ fontSize: 12, fontWeight: 700 }}>Docker Registry</span>
                  <span style={{ fontSize: 9.5, color: "var(--muted)", fontFamily: "monospace" }}>bf-web:latest</span>
                </div>
              </div>
            </div>

            {/* Pipeline Stage 2: Load Balancer */}
            <div style={{ display: "flex", justifyContent: "center", position: "relative", zIndex: 2, margin: "10px 0" }}>
              <div
                style={{
                  background: "#1E1E2E",
                  border: "1.5px solid var(--brand)",
                  borderRadius: 14,
                  padding: "12px 20px",
                  textAlign: "center",
                  color: "#fff",
                  boxShadow: "0 4px 14px rgba(124, 92, 252, 0.25)"
                }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 4 }}>
                  <span style={{ fontSize: 16 }}>⚖️</span>
                  <span style={{ fontSize: 12, fontWeight: 700, fontFamily: "monospace" }}>Load Balancer (Ingress)</span>
                </div>
                <span style={{ fontSize: 9.5, color: "rgba(255,255,255,0.6)" }}>
                  Algorithm: Round Robin | Active traffic routing
                </span>
              </div>
            </div>

            {/* Pipeline Stage 3: Replica Pods Pool */}
            <div style={{ display: "flex", flexDirection: "column", gap: 10, position: "relative", zIndex: 2 }}>
              <span style={{ fontSize: 11, fontWeight: 800, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                Target Container Pods ({replicas.length})
              </span>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
                {replicas.map(p => (
                  <ContainerNode
                    key={p.id}
                    id={p.id}
                    name={p.name}
                    version={p.version}
                    status={p.status}
                    trafficShare={p.traffic}
                    errorCount={p.errors}
                    activeConnections={p.conns}
                    onClick={() => togglePodCrash(p.id)}
                  />
                ))}
              </div>
            </div>

            {/* Instruction footnote */}
            <div
              style={{
                textAlign: "center",
                fontSize: 11,
                color: "var(--muted)",
                background: "rgba(0,0,0,0.03)",
                padding: "8px 10px",
                borderRadius: 10,
                marginTop: "auto",
                border: "1px dashed var(--hairline-2)",
                zIndex: 2
              }}
            >
              💡 <strong>Interactive Outage:</strong> Click any container pod above to crash its runtime. Watch the load balancer instantly redirect traffic to the remaining healthy pods!
            </div>
          </div>
        </div>

        {/* Right Column: Sidebar tabs switchboard */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Main Tab Select list */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: 4,
              background: "var(--bg-2)",
              border: "1px solid var(--hairline-2)",
              borderRadius: 10,
              padding: 3
            }}
          >
            {[
              { id: "pipeline", label: "🏗️ Pipeline" },
              { id: "runtime", label: "⚙️ Runtime" },
              { id: "routing", label: "⚖️ Routing" }
            ].map(tab => {
              const isSelected = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    background: isSelected ? "var(--surface)" : "transparent",
                    color: isSelected ? "var(--ink)" : "var(--muted)",
                    border: "none",
                    borderRadius: 8,
                    padding: "8px 0",
                    fontSize: 11,
                    fontWeight: 700,
                    cursor: "pointer",
                    transition: "all 0.15s"
                  }}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 4,
              background: "var(--bg-2)",
              border: "1px solid var(--hairline-2)",
              borderRadius: 10,
              padding: 3
            }}
          >
            {[
              { id: "deployments", label: "🚀 Deploy Strategies" },
              { id: "chaos", label: "💥 Chaos Probes" }
            ].map(tab => {
              const isSelected = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    background: isSelected ? "var(--surface)" : "transparent",
                    color: isSelected ? "var(--ink)" : "var(--muted)",
                    border: "none",
                    borderRadius: 8,
                    padding: "8px 0",
                    fontSize: 11,
                    fontWeight: 700,
                    cursor: "pointer",
                    transition: "all 0.15s"
                  }}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Tab contents viewport */}
          <div style={{ position: "relative", minHeight: 460 }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.18, ease: "easeInOut" }}
              >
                {activeTab === "pipeline" && (
                  <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                    <DeploymentTimeline />
                    <ImageLayer />
                  </div>
                )}
                
                {activeTab === "runtime" && (
                  <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                    <VolumePanel />
                    <EnvironmentPanel />
                    <KubernetesPanel />
                  </div>
                )}

                {activeTab === "routing" && (
                  <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                    <LoadBalancerPanel />
                    <MetricsPanel />
                  </div>
                )}

                {activeTab === "deployments" && (
                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {/* Sub-tabs for rollouts */}
                    <div style={{ display: "flex", gap: 4, background: "var(--bg-2)", padding: 3, borderRadius: 8, border: "1px solid var(--hairline-2)" }}>
                      {[
                        { id: "rolling", label: "Rolling" },
                        { id: "bluegreen", label: "Blue-Green" },
                        { id: "canary", label: "Canary" }
                      ].map(st => (
                        <button
                          key={st.id}
                          onClick={() => setDeploySubTab(st.id)}
                          style={{
                            flex: 1,
                            background: deploySubTab === st.id ? "var(--surface)" : "transparent",
                            color: deploySubTab === st.id ? "var(--ink)" : "var(--muted)",
                            border: "none",
                            borderRadius: 6,
                            padding: "6px 0",
                            fontSize: 10.5,
                            fontWeight: 700,
                            cursor: "pointer"
                          }}
                        >
                          {st.label}
                        </button>
                      ))}
                    </div>

                    {deploySubTab === "rolling" && <RollingDeployPanel />}
                    {deploySubTab === "bluegreen" && <BlueGreenPanel />}
                    {deploySubTab === "canary" && <CanaryPanel />}
                  </div>
                )}

                {activeTab === "chaos" && (
                  <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                    <HealthCheckPanel />
                    <FailureRecoveryPanel />
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes flow-right {
          0% { left: 0%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { left: 90%; opacity: 0; }
        }
      `}</style>
    </div>
  );
}
