"use client";

import React, { useState } from "react";
import OrderJourney from "@/components/OrderJourney";
import LoyaltyLedgerSim from "@/components/LoyaltyLedgerSim";
import SecuritySim from "@/components/SecuritySim";
import POSSim from "@/components/POSSim";
import AnalyticsSim from "@/components/AnalyticsSim";
import DeploymentSim from "@/components/deployment/DeploymentSim";

export default function SimulatorPanel({ simulatorName }) {
  if (simulatorName === "order") {
    return (
      <div className="card" style={{ padding: "24px", height: "100%", border: "1px solid var(--hairline)" }}>
        <h3 style={{ fontSize: 15, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--muted)", borderBottom: "1px solid var(--hairline)", paddingBottom: 10, marginBottom: 16 }}>
          🎮 Interactive Order Journey
        </h3>
        <OrderJourney />
      </div>
    );
  }

  if (simulatorName === "loyalty") {
    return (
      <div className="card" style={{ padding: "24px", height: "100%", border: "1px solid var(--hairline)" }}>
        <h3 style={{ fontSize: 15, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--muted)", borderBottom: "1px solid var(--hairline)", paddingBottom: 10, marginBottom: 16 }}>
          🎮 Loyalty Ledger & Idempotency
        </h3>
        <LoyaltyLedgerSim />
      </div>
    );
  }

  if (simulatorName === "security") {
    return (
      <div className="card" style={{ padding: "24px", height: "100%", border: "1px solid var(--hairline)" }}>
        <h3 style={{ fontSize: 15, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--muted)", borderBottom: "1px solid var(--hairline)", paddingBottom: 10, marginBottom: 16 }}>
          🔒 Stateful JWT & Security Sandbox
        </h3>
        <SecuritySim />
      </div>
    );
  }

  if (simulatorName === "pos") {
    return (
      <div className="card" style={{ padding: "24px", height: "100%", border: "1px solid var(--hairline)" }}>
        <h3 style={{ fontSize: 15, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--muted)", borderBottom: "1px solid var(--hairline)", paddingBottom: 10, marginBottom: 16 }}>
          🖨️ POS Print Buffer Queue
        </h3>
        <POSSim />
      </div>
    );
  }

  if (simulatorName === "analytics") {
    return (
      <div className="card" style={{ padding: "24px", height: "100%", border: "1px solid var(--hairline)" }}>
        <h3 style={{ fontSize: 15, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--muted)", borderBottom: "1px solid var(--hairline)", paddingBottom: 10, marginBottom: 16 }}>
          📊 OLTP vs OLAP Connection Pool
        </h3>
        <AnalyticsSim />
      </div>
    );
  }

  if (simulatorName === "deployment-explorer") {
    return (
      <div className="card" style={{ padding: "24px", height: "100%", border: "1px solid var(--hairline)" }}>
        <h3 style={{ fontSize: 15, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--muted)", borderBottom: "1px solid var(--hairline)", paddingBottom: 10, marginBottom: 16 }}>
          🚀 Live Deployment Simulator
        </h3>
        <DeploymentSim />
      </div>
    );
  }

  // Delivery World custom Geofencing Simulator (simulatorName = "none")
  return (
    <div className="card" style={{ padding: "24px", height: "100%", border: "1px solid var(--hairline)" }}>
      <h3 style={{ fontSize: 15, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--muted)", borderBottom: "1px solid var(--hairline)", paddingBottom: 10, marginBottom: 16 }}>
        🎮 Geofencing Boundary Simulator
      </h3>
      <GeofenceSim />
    </div>
  );
}

function GeofenceSim() {
  const [pin, setPin] = useState({ x: 150, y: 150 });
  const [apiLocked, setApiLocked] = useState(false);
  const [status, setStatus] = useState("Store location (Center)");

  const handleGridClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setPin({ x, y });

    if (apiLocked) {
      setStatus("🔴 Error: Google Maps API rate limit exhausted! Address check failed.");
      return;
    }

    const dist = Math.sqrt((x - 150) ** 2 + (y - 150) ** 2);
    if (dist <= 100) {
      setStatus(`🟢 Address Serviceable! Coordinates: (${x.toFixed(0)}, ${y.toFixed(0)}). Distance: ${(dist / 20).toFixed(2)} km.`);
    } else {
      setStatus(`🔴 Out of Bounds! Coordinates: (${x.toFixed(0)}, ${y.toFixed(0)}). Distance: ${(dist / 20).toFixed(2)} km (Limit is 5.00 km).`);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <p style={{ fontSize: 13, color: "var(--ink-2)", lineHeight: 1.45, margin: 0 }}>
        Click anywhere on the map grid below to simulate placing a delivery address pin. The server will calculate the service boundary.
      </p>

      {/* Grid Canvas */}
      <div 
        onClick={handleGridClick}
        style={{
          position: "relative",
          width: "100%",
          height: 260,
          background: "var(--bg-2)",
          borderRadius: 14,
          border: "1px solid var(--hairline-2)",
          cursor: "crosshair",
          overflow: "hidden"
        }}
      >
        {/* Grid lines */}
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(var(--hairline-2) 1.5px, transparent 1.5px)", backgroundSize: "16px 16px" }} />
        
        {/* Service Radius Boundary (Circle) */}
        <div 
          style={{
            position: "absolute",
            top: 50,
            left: "50%",
            transform: "translateX(-50%)",
            width: 200,
            height: 200,
            borderRadius: "50%",
            background: "rgba(15, 110, 86, 0.08)",
            border: "2px dashed var(--teal)",
            pointerEvents: "none"
          }}
        />

        {/* Store Center Pin */}
        <div 
          style={{
            position: "absolute",
            top: 146,
            left: 146,
            width: 8,
            height: 8,
            borderRadius: "50%",
            background: "var(--teal)",
            boxShadow: "0 0 0 4px rgba(15,110,86,0.3)"
          }}
        />

        {/* Clicked Address Pin */}
        <div 
          style={{
            position: "absolute",
            top: pin.y - 6,
            left: pin.x - 6,
            width: 12,
            height: 12,
            borderRadius: "50%",
            background: apiLocked ? "var(--pop-pink)" : "var(--brand)",
            border: "2px solid #fff",
            boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
            transition: "top 0.15s ease, left 0.15s ease",
            pointerEvents: "none"
          }}
        />
      </div>

      {/* API Lock Toggle */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "var(--surface-warm)", padding: "10px 14px", borderRadius: 10, border: "1px solid var(--hairline-2)" }}>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span style={{ fontSize: 12.5, fontWeight: 700, color: "var(--ink)" }}>Simulate Google Maps Outage</span>
          <span style={{ fontSize: 11, color: "var(--muted)" }}>Bypass local polygon cache to trigger rate limits</span>
        </div>
        <button
          onClick={() => {
            setApiLocked(!apiLocked);
            setStatus(apiLocked ? "Borders normal." : "🔴 Google Maps API rate limited. Try clicking map.");
          }}
          style={{
            background: apiLocked ? "var(--pop-pink)" : "var(--bg-2)",
            color: apiLocked ? "#fff" : "var(--ink)",
            border: "none", borderRadius: 8, padding: "6px 12px", fontSize: 12, fontWeight: 700, cursor: "pointer"
          }}
        >
          {apiLocked ? "API Offline" : "API Online"}
        </button>
      </div>

      {/* Status Alert */}
      <div 
        style={{ 
          background: apiLocked ? "#FBE0D2" : status.startsWith("🟢") ? "var(--teal-soft)" : "var(--surface-warm)", 
          border: `1px solid ${apiLocked ? "var(--brand)" : status.startsWith("🟢") ? "var(--teal)" : "var(--hairline)"}`, 
          borderRadius: 12, padding: 12, fontSize: 13, 
          color: apiLocked ? "var(--brand-2)" : status.startsWith("🟢") ? "var(--teal)" : "var(--ink-2)",
          minHeight: 42, display: "flex", alignItems: "center"
        }}
      >
        {status}
      </div>
    </div>
  );
}
