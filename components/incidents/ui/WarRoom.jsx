"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { IncidentProvider, useIncidentContext } from "../IncidentContext";

// UI Components
import IncidentPlaybackControls from "./IncidentPlaybackControls";
import IncidentSummaryCard from "./IncidentSummaryCard";
import SeverityBadge from "./SeverityBadge";
import GoldenSignalsPanel from "./GoldenSignalsPanel";
import MetricsDashboard from "./MetricsDashboard";
import AlertFeed from "./AlertFeed";
import LogConsole from "./LogConsole";
import TraceExplorer from "./TraceExplorer";
import CriticalPathPanel from "./CriticalPathPanel";
import RootCausePanel from "./RootCausePanel";
import BlastRadiusMap from "./BlastRadiusMap";
import MitigationPanel from "./MitigationPanel";
import RecoveryTimeline from "./RecoveryTimeline";
import DecisionTimeline from "./DecisionTimeline";
import PostmortemPanel from "./PostmortemPanel";
import LessonsLearnedPanel from "./LessonsLearnedPanel";

const INCIDENT_OPTIONS = [
  {
    id: "PAYMENT_TIMEOUT",
    title: "SEV1 · Payment Gateway Timeout",
    description: "Stripe API becomes unreachable. Checkout fails for 12,000+ customers.",
    icon: "💳",
    severity: "SEV1"
  },
  {
    id: "POSTGRES_SATURATION",
    title: "SEV1 · PostgreSQL Primary Saturated",
    description: "Analytics query locks the database. Orders, admin, and POS all dead.",
    icon: "🗄️",
    severity: "SEV1"
  },
  {
    id: "REDIS_FAILURE",
    title: "SEV2 · Redis OOM Crash",
    description: "BullMQ fills Redis RAM. Notifications and print queue go silent.",
    icon: "📦",
    severity: "SEV2"
  }
];

const TABS = [
  { id: "observe", label: "📊 Observe", description: "Metrics, Alerts, Logs, Traces" },
  { id: "diagnose", label: "🔍 Diagnose", description: "Root Cause, Blast Radius, Critical Path" },
  { id: "respond", label: "🛠 Respond", description: "Mitigations, Recovery" },
  { id: "review", label: "📋 Review", description: "Postmortem, Lessons" }
];

function IncidentSelector({ onSelect }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
      <div>
        <h2 style={{ margin: "0 0 4px 0", fontSize: "22px" }}>⚔️ Incident War Room</h2>
        <p style={{ margin: "0 0 20px 0", fontSize: "14px", color: "var(--ink-2)", maxWidth: "600px" }}>
          Choose a production incident to simulate. You'll take the role of an on-call SRE — 
          investigate the telemetry, find the root cause, and write the postmortem.
        </p>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "14px" }}>
        {INCIDENT_OPTIONS.map((inc, idx) => (
          <motion.button
            key={inc.id}
            onClick={() => onSelect(inc.id)}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: idx * 0.1 }}
            whileHover={{ y: -4, boxShadow: "0 12px 28px rgba(0,0,0,0.12)" }}
            style={{
              background: "var(--surface)",
              border: "1px solid var(--hairline)",
              borderRadius: "14px",
              padding: "20px",
              cursor: "pointer",
              textAlign: "left",
              display: "flex",
              flexDirection: "column",
              gap: "8px",
              transition: "box-shadow 0.2s ease"
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <span style={{ fontSize: "32px" }}>{inc.icon}</span>
              <SeverityBadge severity={inc.severity} />
            </div>
            <span style={{ fontSize: "14px", fontWeight: "700", color: "var(--ink)", lineHeight: "1.3" }}>
              {inc.title}
            </span>
            <span style={{ fontSize: "12px", color: "var(--ink-2)", lineHeight: "1.5" }}>
              {inc.description}
            </span>
            <span style={{
              marginTop: "4px", fontSize: "11px", fontWeight: "700", color: "var(--brand)",
              display: "flex", alignItems: "center", gap: "4px"
            }}>
              Start Simulation →
            </span>
          </motion.button>
        ))}
      </div>
    </div>
  );
}

function WarRoomContent() {
  const { incidentType, incident, status, selectIncident, activeStep } = useIncidentContext();
  const [activeTab, setActiveTab] = useState("observe");

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      {/* War Room Header */}
      <div style={{
        display: "flex", justifyContent: "space-between", alignItems: "flex-start",
        flexWrap: "wrap", gap: "12px",
        padding: "16px 20px",
        background: status === "RESOLVED"
          ? "linear-gradient(135deg, rgba(15,110,86,0.08), transparent)"
          : "linear-gradient(135deg, rgba(255,77,141,0.08), transparent)",
        borderRadius: "14px",
        border: `1px solid ${status === "RESOLVED" ? "rgba(15,110,86,0.15)" : "rgba(255,77,141,0.15)"}`
      }}>
        <div>
          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <SeverityBadge severity={incident?.severity || "SEV1"} />
            <h2 style={{ margin: "0", fontSize: "18px", color: "var(--ink)" }}>
              {incident?.id} · {incidentType.replace(/_/g, " ")}
            </h2>
          </div>
          <p style={{ margin: "4px 0 0 0", fontSize: "12px", color: "var(--faint)" }}>
            Burger Farm Production — Live Incident Simulation
          </p>
        </div>
        <button
          onClick={() => selectIncident(null)}
          style={{
            background: "var(--bg-2)", border: "1px solid var(--hairline)", borderRadius: "8px",
            padding: "6px 12px", fontSize: "12px", fontWeight: "600", cursor: "pointer",
            color: "var(--muted)"
          }}
        >
          ← Choose Different Incident
        </button>
      </div>

      {/* Incident Summary */}
      <IncidentSummaryCard />

      {/* Playback Controls */}
      <IncidentPlaybackControls />

      {/* Recovery Timeline */}
      <RecoveryTimeline />

      {/* Tab navigation */}
      <div style={{
        display: "flex", gap: "4px",
        background: "var(--bg-2)", padding: "4px",
        borderRadius: "12px", flexWrap: "wrap"
      }}>
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              flex: 1, minWidth: "100px",
              padding: "8px 12px", borderRadius: "9px", fontSize: "12px",
              fontWeight: activeTab === tab.id ? "700" : "500",
              cursor: "pointer", textAlign: "center",
              background: activeTab === tab.id ? "var(--surface)" : "transparent",
              color: activeTab === tab.id ? "var(--brand)" : "var(--muted)",
              border: activeTab === tab.id ? "1px solid var(--hairline)" : "1px solid transparent",
              boxShadow: activeTab === tab.id ? "0 1px 4px rgba(0,0,0,0.08)" : "none",
              transition: "all 0.2s ease"
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25 }}
          style={{ display: "flex", flexDirection: "column", gap: "14px" }}
        >
          {activeTab === "observe" && (
            <>
              <GoldenSignalsPanel />
              <MetricsDashboard />
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
                <AlertFeed />
                <TraceExplorer />
              </div>
              <LogConsole />
            </>
          )}

          {activeTab === "diagnose" && (
            <>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
                <RootCausePanel />
                <CriticalPathPanel />
              </div>
              <BlastRadiusMap />
            </>
          )}

          {activeTab === "respond" && (
            <>
              <MitigationPanel />
              <DecisionTimeline />
            </>
          )}

          {activeTab === "review" && (
            <>
              <PostmortemPanel />
              <LessonsLearnedPanel incidentType={incidentType} />
            </>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function WarRoomRouter() {
  const { incidentType, selectIncident } = useIncidentContext();

  if (!incidentType) {
    return <IncidentSelector onSelect={selectIncident} />;
  }

  return <WarRoomContent />;
}

// Public component — wraps the IncidentProvider
export default function WarRoom() {
  return (
    <IncidentProvider>
      <WarRoomRouter />
    </IncidentProvider>
  );
}
