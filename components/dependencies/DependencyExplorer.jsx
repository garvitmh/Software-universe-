"use client";

import React, { useState, useEffect } from "react";
import { DEPENDENCY_SCHEMA } from "./DependencySchema";
import ConnectionEdge from "./ConnectionEdge";
import ServiceNode from "./ServiceNode";
import ChaosMonkeyPanel from "./ChaosMonkeyPanel";
import ResiliencePanel from "./ResiliencePanel";
import FailurePropagationPanel from "./FailurePropagationPanel";
import RecoveryTimeline from "./RecoveryTimeline";
import { motion, AnimatePresence } from "framer-motion";

export default function DependencyExplorer() {
  const { services, edges } = DEPENDENCY_SCHEMA;

  // Active user tab for sidebar controls
  const [activeTab, setActiveTab] = useState("chaos");

  // Resilience Configuration State
  const [resilienceConfig, setResilienceConfig] = useState({
    retries: true,
    circuitBreaker: false,
    fallbacks: false,
    dlq: false
  });

  // Track root crashes triggered by Chaos Monkey (manually clicked/injected)
  const [rawCrashes, setRawCrashes] = useState({});

  // Computed state of all nodes (healthy, degraded, crashed, collapsed)
  const [nodeStates, setNodeStates] = useState({});

  // Hover states for highlighting path interactions
  const [hoveredNodeId, setHoveredNodeId] = useState(null);

  // Update resilience config switch
  const updateResilienceConfig = (key, val) => {
    setResilienceConfig(prev => ({ ...prev, [key]: val }));
  };

  // Toggle a single node's root crash state
  const toggleNodeState = (nodeId) => {
    setRawCrashes(prev => {
      const next = { ...prev };
      if (next[nodeId] === "crashed") {
        delete next[nodeId];
      } else {
        next[nodeId] = "crashed";
      }
      return next;
    });
  };

  // Recover a single node (callback for timeline)
  const recoverNode = (nodeId) => {
    setRawCrashes(prev => {
      const next = { ...prev };
      delete next[nodeId];
      return next;
    });
  };

  // Pick a random healthy service and crash it
  const triggerRandomHavoc = () => {
    // Filter services that are currently healthy
    const healthyServices = services.filter(s => !rawCrashes[s.id]);
    if (healthyServices.length === 0) return;

    const randomIndex = Math.floor(Math.random() * healthyServices.length);
    const chosenNode = healthyServices[randomIndex].id;

    setRawCrashes(prev => ({
      ...prev,
      [chosenNode]: "crashed"
    }));
  };

  // Reset all systems to healthy
  const restoreAll = () => {
    setRawCrashes({});
  };

  // Re-calculate the network topology health propagation whenever raw crashes or resilience toggles change
  useEffect(() => {
    // Severity values to resolve multiple conflicts (worst state wins)
    const severity = {
      healthy: 0,
      degraded: 1,
      collapsed: 2,
      crashed: 3
    };

    // Initialize all states based on direct raw crashes
    const states = {};
    services.forEach(s => {
      states[s.id] = rawCrashes[s.id] ? "crashed" : "healthy";
    });

    // Run propagation loop iteratively to allow failure cascading downstream
    // A dependencies call edge (A calls B: from A to B)
    // If B fails, A is affected.
    let changed = true;
    let iterations = 0;
    const maxIterations = 5; // Prevent infinite loops in cyclic dependencies

    while (changed && iterations < maxIterations) {
      changed = false;
      iterations++;

      edges.forEach(edge => {
        const caller = edge.from;
        const dependency = edge.to;
        const depStatus = states[dependency];
        const currentCallerStatus = states[caller];

        // If dependency is crashed or collapsed, compute caller impact
        if (depStatus === "crashed" || depStatus === "collapsed") {
          let resolvedCallerStatus = "healthy";

          if (edge.sync) {
            // Synchronous blockages
            if (resilienceConfig.circuitBreaker) {
              // Circuit breaker intercepts the timeout, returns fast fallback (degraded)
              resolvedCallerStatus = "degraded";
            } else if (resilienceConfig.fallbacks && edge.fallback !== "None (order fails)") {
              // Graceful static fallback works
              resolvedCallerStatus = "degraded";
            } else {
              // No shield: synchronous blockage collapses the calling service thread pool
              resolvedCallerStatus = "collapsed";
            }
          } else {
            // Asynchronous queue channels
            if (resilienceConfig.dlq) {
              // Routed to dead letter queue: calling service is unaffected
              resolvedCallerStatus = "healthy";
            } else {
              // Queue overflows or drops messages: caller degrades slightly
              resolvedCallerStatus = "degraded";
            }
          }

          // If resolved caller status has higher severity than current, upgrade it
          if (severity[resolvedCallerStatus] > severity[currentCallerStatus]) {
            states[caller] = resolvedCallerStatus;
            changed = true;
          }
        }
      });
    }

    setNodeStates(states);
  }, [rawCrashes, resilienceConfig, services, edges]);

  // Determine if a connection edge is failing (either from or to is crashed/collapsed)
  const isEdgeFailing = (edge) => {
    const fromStatus = nodeStates[edge.from];
    const toStatus = nodeStates[edge.to];
    return fromStatus === "crashed" || fromStatus === "collapsed" || toStatus === "crashed" || toStatus === "collapsed";
  };

  // Determine if an edge is highlighted due to node hovers
  const isEdgeHighlighted = (edge) => {
    if (!hoveredNodeId) return false;
    return edge.from === hoveredNodeId || edge.to === hoveredNodeId;
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24, padding: "20px 0" }}>
      {/* Topology Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div>
          <span className="pill" style={{ background: "rgba(244, 63, 94, 0.08)", color: "#F43F5E", marginBottom: 8 }}>
            Interactive Sandbox
          </span>
          <h2 style={{ fontSize: 32, fontWeight: 700, letterSpacing: "-0.01em", margin: 0 }}>
            Dependency Explorer & Chaos Monkey
          </h2>
          <p style={{ fontSize: 14.5, color: "var(--ink-2)", marginTop: 6, maxWidth: 650 }}>
            Simulate network topology relationships. Toggle resilience layers to prevent cascading failure propagation across distributed microservices.
          </p>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 24 }} className="simulator-grid">
        {/* Left Column: Visual Canvas */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div
            style={{
              position: "relative",
              width: "100%",
              height: 550,
              background: "var(--surface-warm)",
              border: "1px solid var(--hairline)",
              borderRadius: 20,
              boxShadow: "inset 0 0 20px rgba(0,0,0,0.03)",
              overflow: "hidden"
            }}
          >
            {/* Grid Pattern Backing */}
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundImage: "radial-gradient(var(--hairline) 1px, transparent 1px)",
                backgroundSize: "20px 20px",
                opacity: 0.7,
                pointerEvents: "none"
              }}
            />

            {/* SVG Canvas for Connection Edges */}
            <svg
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                zIndex: 1,
                pointerEvents: "none"
              }}
            >
              {edges.map((edge, idx) => {
                const fromNode = services.find(s => s.id === edge.from);
                const toNode = services.find(s => s.id === edge.to);
                const isCrashed = isEdgeFailing(edge);
                const isHighlighted = isEdgeHighlighted(edge);

                return (
                  <ConnectionEdge
                    key={idx}
                    edge={edge}
                    fromNode={fromNode}
                    toNode={toNode}
                    isCrashed={isCrashed}
                    isHighlighted={isHighlighted}
                  />
                );
              })}
            </svg>

            {/* Service Node overlays */}
            {services.map((node) => {
              const status = nodeStates[node.id] || "healthy";
              const isActive = hoveredNodeId === node.id;
              const isHighlighted = hoveredNodeId && (hoveredNodeId === node.id || edges.some(e =>
                (e.from === hoveredNodeId && e.to === node.id) || (e.to === hoveredNodeId && e.from === node.id)
              ));

              return (
                <ServiceNode
                  key={node.id}
                  node={node}
                  status={status}
                  isActive={isActive}
                  isHighlighted={isHighlighted}
                  onClick={() => toggleNodeState(node.id)}
                  onMouseEnter={() => setHoveredNodeId(node.id)}
                  onMouseLeave={() => setHoveredNodeId(null)}
                />
              );
            })}
          </div>

          {/* Legend indicator bar */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              background: "var(--surface)",
              border: "1px solid var(--hairline)",
              borderRadius: 12,
              padding: "10px 16px",
              fontSize: 11.5,
              color: "var(--ink-2)",
              fontFamily: "monospace"
            }}
          >
            <div style={{ display: "flex", gap: 16 }}>
              <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ width: 12, height: 2, background: "#A6E3A1", display: "inline-block" }} /> Synchronous (Blocking)
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ width: 12, height: 2, borderBottom: "2px dashed #89DCEB", display: "inline-block" }} /> Asynchronous (Queued)
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ width: 12, height: 2, borderBottom: "2px dotted #FAB387", display: "inline-block" }} /> Webhook
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ width: 12, height: 2, borderBottom: "2px dotted #94E2D5", display: "inline-block" }} /> Db Replica
              </span>
            </div>
            <div style={{ color: "var(--muted)", fontStyle: "italic" }}>
              * Hover nodes to view connection bindings
            </div>
          </div>
        </div>

        {/* Right Column: Panel Controllers */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Sidebar Tab Menu */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr 1fr",
              gap: 4,
              background: "var(--bg-2)",
              border: "1px solid var(--hairline-2)",
              borderRadius: 10,
              padding: 3
            }}
          >
            {[
              { id: "chaos", label: "🐒 Chaos" },
              { id: "resilience", label: "🛡️ Safe" },
              { id: "blast", label: "💥 Blast" },
              { id: "timeline", label: "⏳ MTTR" }
            ].map((tab) => {
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

          {/* Tab Viewer panel */}
          <div style={{ position: "relative", minHeight: 400 }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                transition={{ duration: 0.18, ease: "easeInOut" }}
              >
                {activeTab === "chaos" && (
                  <ChaosMonkeyPanel
                    services={services}
                    nodeStates={nodeStates}
                    toggleNodeState={toggleNodeState}
                    triggerRandomHavoc={triggerRandomHavoc}
                    restoreAll={restoreAll}
                  />
                )}
                {activeTab === "resilience" && (
                  <ResiliencePanel
                    config={resilienceConfig}
                    updateConfig={updateResilienceConfig}
                  />
                )}
                {activeTab === "blast" && (
                  <FailurePropagationPanel
                    services={services}
                    edges={edges}
                    nodeStates={nodeStates}
                  />
                )}
                {activeTab === "timeline" && (
                  <RecoveryTimeline
                    nodeStates={nodeStates}
                    onRecoverNode={recoverNode}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
