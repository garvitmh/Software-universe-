"use client";

import React from "react";
import { AnimatePresence } from "framer-motion";
import AlertCard from "./AlertCard";
import { useIncidentContext } from "../IncidentContext";

export default function AlertFeed() {
  const { alerts } = useIncidentContext();

  return (
    <div className="card" style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "12px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <span className="eyebrow" style={{ color: "var(--muted)" }}>PagerDuty</span>
          <h3 style={{ margin: "2px 0 0 0", fontSize: "16px" }}>Active Alerts</h3>
        </div>
        <span style={{
          fontSize: "12px", fontWeight: "700", padding: "3px 10px", borderRadius: "999px",
          background: alerts.length > 0 ? "rgba(255,77,141,0.15)" : "var(--teal-soft)",
          color: alerts.length > 0 ? "var(--pop-pink)" : "var(--teal)",
          border: `1px solid ${alerts.length > 0 ? "rgba(255,77,141,0.3)" : "rgba(15,110,86,0.2)"}`
        }}>
          {alerts.length > 0 ? `${alerts.length} FIRING` : "ALL CLEAR"}
        </span>
      </div>

      {alerts.length === 0 ? (
        <div style={{
          padding: "20px",
          textAlign: "center",
          borderRadius: "10px",
          background: "var(--teal-soft)",
          border: "1px solid rgba(15,110,86,0.2)"
        }}>
          <span style={{ fontSize: "24px" }}>✅</span>
          <p style={{ margin: "8px 0 0 0", fontSize: "13px", color: "var(--teal)", fontWeight: "600" }}>
            No alerts firing. System healthy.
          </p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <AnimatePresence>
            {[...alerts].reverse().map((alert, idx) => (
              <AlertCard key={alert.alert} alert={alert} index={idx} />
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
