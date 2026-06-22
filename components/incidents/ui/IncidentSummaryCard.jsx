"use client";

import React from "react";
import SeverityBadge from "./SeverityBadge";

export default function IncidentSummaryCard({ incident, status, recovery }) {
  const getStatusBadge = () => {
    switch (status) {
      case "RESOLVED":
        return { bg: "var(--teal-soft)", color: "var(--teal)", label: "RESOLVED" };
      case "MITIGATING":
        return { bg: "var(--amber-soft)", color: "var(--amber)", label: "MITIGATING" };
      case "RECOVERING":
        return { bg: "rgba(45, 125, 246, 0.15)", color: "var(--pop-blue)", label: "RECOVERING" };
      case "ACTIVE":
      default:
        return { bg: "var(--pink-soft)", color: "var(--pink)", label: "ACTIVE" };
    }
  };

  const statusBadge = getStatusBadge();

  return (
    <div
      className="card"
      style={{
        padding: "20px",
        background: "var(--surface)",
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        height: "100%"
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "10px" }}>
        <div>
          <span className="eyebrow" style={{ color: "var(--muted)" }}>Incident Profile</span>
          <h3 style={{ margin: "4px 0", fontSize: "20px", fontFamily: "Fraunces" }}>
            {incident?.id || "INC-2026-XXX"}: {incident?.type?.replace("_", " ")}
          </h3>
        </div>
        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          <span
            style={{
              padding: "4px 10px",
              borderRadius: "6px",
              fontSize: "11px",
              fontWeight: "700",
              backgroundColor: statusBadge.bg,
              color: statusBadge.color,
              letterSpacing: "0.05em"
            }}
          >
            {statusBadge.label}
          </span>
          <SeverityBadge severity={incident?.severity || "SEV1"} />
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "12px",
          borderTop: "1px solid var(--hairline)",
          paddingTop: "14px",
          fontSize: "13px"
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
          <span style={{ color: "var(--muted)", textTransform: "uppercase", fontSize: "10px", letterSpacing: "0.05em" }}>Started At</span>
          <span style={{ fontWeight: "600", color: "var(--ink)" }}>
            {incident?.startedAt ? new Date(incident.startedAt).toLocaleTimeString() : "08:00:00 AM"}
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
          <span style={{ color: "var(--muted)", textTransform: "uppercase", fontSize: "10px", letterSpacing: "0.05em" }}>Impact Duration (MTTR)</span>
          <span style={{ fontWeight: "600", color: status === "RESOLVED" ? "var(--teal)" : "var(--pink)" }}>
            {status === "RESOLVED" ? recovery?.mttr || "38 minutes" : "Outage Ongoing..."}
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "2px", gridColumn: "1 / -1" }}>
          <span style={{ color: "var(--muted)", textTransform: "uppercase", fontSize: "10px", letterSpacing: "0.05em" }}>Affected Services</span>
          <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginTop: "4px" }}>
            {incident?.affectedSystems?.map((sys, idx) => (
              <span
                key={idx}
                className="pill"
                style={{
                  background: "var(--bg-2)",
                  color: "var(--ink-2)",
                  fontSize: "11px",
                  padding: "2px 8px"
                }}
              >
                {sys}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
