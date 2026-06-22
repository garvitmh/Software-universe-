"use client";

import React from "react";
import { motion } from "framer-motion";
import { useIncidentContext } from "../IncidentContext";

const RISK_COLORS = {
  LOW: { color: "var(--teal)", bg: "var(--teal-soft)" },
  MEDIUM: { color: "var(--amber)", bg: "var(--amber-soft)" },
  HIGH: { color: "var(--pop-pink)", bg: "var(--pink-soft)" }
};

const MITIGATION_DETAILS = {
  PAYMENT_TIMEOUT: [
    { action: "Switch to Razorpay backup gateway", impact: "Checkout restored within 2min", risk: "LOW" },
    { action: "Enable local SQLite buffer checkouts", impact: "Orders queued offline", risk: "LOW" },
    { action: "Configure Stripe timeout flags (5000ms max)", impact: "Prevents thread exhaustion", risk: "MEDIUM" }
  ],
  POSTGRES_SATURATION: [
    { action: "Kill analytics query pid 20432", impact: "Immediate CPU relief", risk: "LOW" },
    { action: "Route reporting to read replica", impact: "Primary DB freed", risk: "LOW" },
    { action: "Install PgBouncer connection proxy", impact: "Long-term pool protection", risk: "MEDIUM" }
  ],
  REDIS_FAILURE: [
    { action: "Restart Redis cluster container", impact: "Workers reconnect", risk: "MEDIUM" },
    { action: "Set removeOnComplete limits on BullMQ", impact: "Prevents OOM recurrence", risk: "LOW" },
    { action: "Scale Redis RAM allocation", impact: "Increases OOM headroom", risk: "LOW" }
  ]
};

export default function MitigationPanel() {
  const { mitigations, incidentType, activeStep } = useIncidentContext();
  const detailedMitigations = MITIGATION_DETAILS[incidentType] || MITIGATION_DETAILS.PAYMENT_TIMEOUT;
  const isActive = activeStep >= 2;

  return (
    <div className="card" style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "14px" }}>
      <div>
        <span className="eyebrow" style={{ color: "var(--muted)" }}>SRE Playbook</span>
        <h3 style={{ margin: "2px 0 0 0", fontSize: "16px" }}>Mitigation Actions</h3>
        <p style={{ margin: "4px 0 0 0", fontSize: "12px", color: "var(--faint)" }}>
          Available remediation steps ordered by impact
        </p>
      </div>

      {!isActive ? (
        <div style={{ padding: "20px", textAlign: "center", background: "var(--bg-2)", borderRadius: "10px" }}>
          <span style={{ fontSize: "24px" }}>⏳</span>
          <p style={{ margin: "8px 0 0 0", fontSize: "12px", color: "var(--muted)" }}>
            Mitigations available after investigation phase
          </p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {detailedMitigations.map((m, idx) => {
            const risk = RISK_COLORS[m.risk] || RISK_COLORS.LOW;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.1 }}
                style={{
                  padding: "12px 14px",
                  borderRadius: "10px",
                  background: "var(--surface-warm)",
                  border: "1px solid var(--hairline)",
                  display: "flex",
                  flexDirection: "column",
                  gap: "6px"
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "8px" }}>
                  <div style={{ display: "flex", gap: "8px", alignItems: "flex-start" }}>
                    <span style={{ fontSize: "14px", marginTop: "1px" }}>
                      {idx === 0 ? "🚀" : idx === 1 ? "🔧" : "⚙️"}
                    </span>
                    <span style={{ fontSize: "13px", fontWeight: "700", color: "var(--ink)" }}>
                      {m.action}
                    </span>
                  </div>
                  <span style={{
                    fontSize: "10px", fontWeight: "700", padding: "2px 7px", borderRadius: "4px",
                    background: risk.bg, color: risk.color, flexShrink: 0
                  }}>
                    {m.risk} RISK
                  </span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", marginLeft: "22px" }}>
                  <span style={{ fontSize: "11px", color: "var(--teal)" }}>✓</span>
                  <span style={{ fontSize: "12px", color: "var(--ink-2)" }}>{m.impact}</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
