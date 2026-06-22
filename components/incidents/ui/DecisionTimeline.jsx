"use client";

import React from "react";
import { motion } from "framer-motion";
import { useIncidentContext } from "../IncidentContext";

const DECISIONS = {
  PAYMENT_TIMEOUT: [
    { time: "02:14", action: "Acknowledged PagerDuty alert", type: "ALERT" },
    { time: "02:20", action: "Reviewed Checkout API error logs", type: "INVESTIGATE" },
    { time: "02:31", action: "Confirmed Stripe gateway timeout root cause", type: "DIAGNOSE" },
    { time: "02:38", action: "Enabled Razorpay fallback gateway", type: "MITIGATE" },
    { time: "02:46", action: "Verified checkout success rate recovering", type: "VERIFY" }
  ],
  POSTGRES_SATURATION: [
    { time: "02:14", action: "Responded to DB CPU saturation alert", type: "ALERT" },
    { time: "02:25", action: "Connected to PostgreSQL admin console", type: "INVESTIGATE" },
    { time: "02:33", action: "Identified analytics query locking writes", type: "DIAGNOSE" },
    { time: "02:37", action: "Terminated query pid 20432", type: "MITIGATE" },
    { time: "02:48", action: "Routed reporting to read replica", type: "MITIGATE" }
  ],
  REDIS_FAILURE: [
    { time: "02:15", action: "Received BullMQ queue backlog alert", type: "ALERT" },
    { time: "02:22", action: "Checked Redis memory stats", type: "INVESTIGATE" },
    { time: "02:29", action: "Confirmed OOM crash from unlimited job history", type: "DIAGNOSE" },
    { time: "02:34", action: "Restarted Redis container", type: "MITIGATE" },
    { time: "02:40", action: "Applied removeOnComplete limits on BullMQ", type: "MITIGATE" }
  ]
};

const TYPE_STYLES = {
  ALERT: { color: "var(--pop-pink)", bg: "rgba(255,77,141,0.1)", icon: "🚨" },
  INVESTIGATE: { color: "var(--pop-blue)", bg: "rgba(45,125,246,0.1)", icon: "🔍" },
  DIAGNOSE: { color: "#F97316", bg: "rgba(249,115,22,0.1)", icon: "🧠" },
  MITIGATE: { color: "var(--teal)", bg: "var(--teal-soft)", icon: "🛠" },
  VERIFY: { color: "var(--pop-lime)", bg: "rgba(47,191,113,0.1)", icon: "✅" }
};

export default function DecisionTimeline() {
  const { incidentType, activeStep } = useIncidentContext();
  const decisions = DECISIONS[incidentType] || DECISIONS.PAYMENT_TIMEOUT;
  const visibleCount = Math.ceil((activeStep / 4) * decisions.length);
  const visible = decisions.slice(0, Math.max(visibleCount, 1));

  return (
    <div className="card" style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "14px" }}>
      <div>
        <span className="eyebrow" style={{ color: "var(--muted)" }}>On-Call Engineer Actions</span>
        <h3 style={{ margin: "2px 0 0 0", fontSize: "16px" }}>Decision Timeline</h3>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
        {visible.map((d, idx) => {
          const style = TYPE_STYLES[d.type] || TYPE_STYLES.INVESTIGATE;
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.35, delay: idx * 0.1 }}
              style={{ display: "flex", gap: "12px", position: "relative" }}
            >
              {/* Timeline line */}
              {idx < visible.length - 1 && (
                <div style={{
                  position: "absolute", left: "17px", top: "32px", width: "2px",
                  height: "calc(100% - 8px)", background: "var(--hairline)", zIndex: 0
                }} />
              )}
              {/* Icon bubble */}
              <div style={{
                width: "34px", height: "34px", borderRadius: "50%",
                background: style.bg, display: "flex", alignItems: "center",
                justifyContent: "center", fontSize: "14px", flexShrink: 0,
                border: `1px solid ${style.color}33`, zIndex: 1
              }}>
                {style.icon}
              </div>
              {/* Content */}
              <div style={{ padding: "6px 0 14px 0", flex: 1 }}>
                <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                  <span style={{ fontSize: "11px", fontFamily: "JetBrains Mono, monospace", color: "var(--muted)" }}>
                    {d.time}
                  </span>
                  <span style={{ fontSize: "10px", fontWeight: "700", color: style.color, padding: "1px 6px", borderRadius: "4px", background: style.bg }}>
                    {d.type}
                  </span>
                </div>
                <p style={{ margin: "4px 0 0 0", fontSize: "13px", color: "var(--ink-2)" }}>{d.action}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
