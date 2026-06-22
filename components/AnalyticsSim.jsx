"use client";

import React, { useState, useEffect, useRef } from "react";

export default function AnalyticsSim() {
  const [routeToReplica, setRouteToReplica] = useState(false);
  const [oltpConnections, setOltpConnections] = useState(0);
  const [olapConnections, setOlapConnections] = useState(0);
  const [checkoutStatus, setCheckoutStatus] = useState([]); // Array of checkout statuses
  const [replicaLag, setReplicaLag] = useState(0.8); // Replication lag in seconds

  const oltpTimerRefs = useRef([]);
  const olapTimerRefs = useRef([]);

  // Increment replication lag slightly under load
  useEffect(() => {
    const totalConns = oltpConnections + olapConnections;
    setReplicaLag(parseFloat((0.5 + totalConns * 0.3).toFixed(1)));
  }, [oltpConnections, olapConnections]);

  const handleCheckout = () => {
    const checkId = Math.floor(Math.random() * 900 + 100);
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    
    // Add to checkout list
    setCheckoutStatus(prev => [{ id: checkId, status: "pending", time: timestamp, msg: "Acquiring connection..." }, ...prev.slice(0, 5)]);

    if (oltpConnections >= 5) {
      // Out of connections! Checkouts fail
      setTimeout(() => {
        setCheckoutStatus(prev => 
          prev.map(c => c.id === checkId 
            ? { ...c, status: "fail", msg: "🔴 Timeout: Connection pool exhausted!" } 
            : c
          )
        );
      }, 1000);
      return;
    }

    // Occupy a connection
    setOltpConnections(prev => prev + 1);

    setTimeout(() => {
      setOltpConnections(prev => Math.max(0, prev - 1));
      setCheckoutStatus(prev => 
        prev.map(c => c.id === checkId 
          ? { ...c, status: "success", msg: "🟢 Success: Checkout complete! Order created." } 
          : c
        )
      );
    }, 400); // Quick checkout query
  };

  const handleRunReport = () => {
    // If routing to replica, occupy OLAP connection. Else occupy OLTP connection.
    if (routeToReplica) {
      if (olapConnections >= 5) return; // Cap at 5
      setOlapConnections(prev => prev + 1);
      const timer = setTimeout(() => {
        setOlapConnections(prev => Math.max(0, prev - 1));
      }, 6000); // Analytics report takes 6 seconds
      olapTimerRefs.current.push(timer);
    } else {
      if (oltpConnections >= 5) return;
      setOltpConnections(prev => prev + 1);
      const timer = setTimeout(() => {
        setOltpConnections(prev => Math.max(0, prev - 1));
      }, 6000);
      oltpTimerRefs.current.push(timer);
    }
  };

  const handleReset = () => {
    oltpTimerRefs.current.forEach(clearTimeout);
    olapTimerRefs.current.forEach(clearTimeout);
    oltpTimerRefs.current = [];
    olapTimerRefs.current = [];
    setOltpConnections(0);
    setOlapConnections(0);
    setCheckoutStatus([]);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <p style={{ fontSize: 13, color: "var(--ink-2)", lineHeight: 1.45, margin: 0 }}>
        Simulate the performance bottleneck of running analytics queries on your checkout database. Toggle read replication to isolate reporting from transactional checkout.
      </p>

      {/* Database Routing Switch */}
      <div 
        style={{ 
          display: "flex", 
          alignItems: "center", 
          justifyContent: "space-between", 
          background: routeToReplica ? "var(--teal-soft)" : "var(--surface-warm)", 
          padding: "12px 16px", 
          borderRadius: 12, 
          border: `1.5px solid ${routeToReplica ? "var(--teal)" : "var(--hairline)"}`,
          transition: "all 0.25s ease"
        }}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: "var(--ink)" }}>Read Replica Routing (OLTP / OLAP Split)</span>
          <span style={{ fontSize: 11, color: "var(--muted)" }}>
            {routeToReplica ? "🟢 Analytics queries are routed to DB Read Replica" : "⚠️ Heavy reporting queries run directly on Write DB"}
          </span>
        </div>
        <button
          onClick={() => setRouteToReplica(!routeToReplica)}
          style={{
            background: routeToReplica ? "var(--teal)" : "var(--bg-2)",
            color: routeToReplica ? "#fff" : "var(--ink)",
            border: "none", borderRadius: 8, padding: "8px 14px", fontSize: 12, fontWeight: 700, cursor: "pointer",
            boxShadow: "var(--shadow)"
          }}
        >
          {routeToReplica ? "Replica Active" : "Primary Only"}
        </button>
      </div>

      {/* Database Connection Pools */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))", gap: 16 }}>
        
        {/* OLTP PRIMARY DATABASE POOL */}
        <div className="card" style={{ background: "var(--bg-2)", border: "1px solid var(--hairline)", padding: 14, borderRadius: 10 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 10 }}>
            <span style={{ fontSize: 11.5, fontWeight: 700, textTransform: "uppercase", color: "var(--muted)" }}>💽 OLTP Write DB</span>
            <span style={{ fontSize: 11, fontWeight: 600, color: oltpConnections >= 5 ? "var(--brand)" : "var(--teal)" }}>
              {oltpConnections} / 5 Pool Conns
            </span>
          </div>
          
          {/* Connection Indicators */}
          <div style={{ display: "flex", gap: 4, height: 16, background: "var(--surface)", borderRadius: 4, overflow: "hidden", padding: 2, border: "1px solid var(--hairline-2)" }}>
            {Array.from({ length: 5 }).map((_, i) => (
              <div 
                key={i} 
                style={{ 
                  flex: 1, 
                  background: i < oltpConnections ? (oltpConnections >= 5 ? "var(--brand)" : "var(--pop-lime)") : "transparent",
                  borderRadius: 2,
                  transition: "background 0.2s ease"
                }} 
              />
            ))}
          </div>

          <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 10, lineHeight: 1.4 }}>
            Processes checkouts & write transactions. {oltpConnections >= 5 && <span style={{ color: "var(--brand)", fontWeight: 700 }}>EXHAUSTED! Write queries will block.</span>}
          </div>
        </div>

        {/* OLAP READ REPLICA POOL */}
        <div className="card" style={{ background: "var(--bg-2)", border: "1px solid var(--hairline)", padding: 14, borderRadius: 10 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 10 }}>
            <span style={{ fontSize: 11.5, fontWeight: 700, textTransform: "uppercase", color: "var(--muted)" }}>📊 OLAP Read Replica</span>
            <span style={{ fontSize: 11, fontWeight: 600, color: "var(--teal)" }}>
              {olapConnections} / 5 Pool Conns
            </span>
          </div>
          
          {/* Connection Indicators */}
          <div style={{ display: "flex", gap: 4, height: 16, background: "var(--surface)", borderRadius: 4, overflow: "hidden", padding: 2, border: "1px solid var(--hairline-2)" }}>
            {Array.from({ length: 5 }).map((_, i) => (
              <div 
                key={i} 
                style={{ 
                  flex: 1, 
                  background: i < olapConnections ? "var(--teal)" : "transparent",
                  borderRadius: 2,
                  transition: "background 0.2s ease"
                }} 
              />
            ))}
          </div>

          <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 10, display: "flex", justifyContent: "space-between" }}>
            <span>Replication Lag: {replicaLag}s</span>
            <span>Read queries only.</span>
          </div>
        </div>

      </div>

      {/* Control Actions */}
      <div style={{ display: "flex", gap: 10 }}>
        <button 
          onClick={handleCheckout} 
          className="btn btn-primary" 
          style={{ flex: 1, height: 42 }}
        >
          💳 Place Order (Checkout)
        </button>
        <button 
          onClick={handleRunReport} 
          className="btn btn-ghost" 
          style={{ flex: 1, height: 42, border: "1px solid var(--hairline)" }}
        >
          📈 Run Heavy Analytics Report
        </button>
        <button onClick={handleReset} className="btn btn-ghost" style={{ padding: "0 12px" }}>↻</button>
      </div>

      {/* Checkout Pipeline Log */}
      <div>
        <span className="eyebrow">Checkout Transaction Log</span>
        <div 
          style={{ 
            marginTop: 8, 
            background: "var(--bg-2)", 
            border: "1px solid var(--hairline-2)", 
            borderRadius: 12, 
            padding: 12, 
            maxHeight: 140, 
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            gap: 6
          }}
        >
          {checkoutStatus.length === 0 ? (
            <span style={{ fontSize: 12, color: "var(--faint)", textAlign: "center", display: "block", padding: "10px 0" }}>
              No checkouts placed yet. Tap "Place Order" to start checkouts.
            </span>
          ) : (
            checkoutStatus.map((c) => (
              <div 
                key={c.id} 
                style={{ 
                  display: "flex", 
                  justifyContent: "space-between", 
                  alignItems: "center", 
                  background: c.status === "success" ? "var(--teal-soft)" : c.status === "fail" ? "#FBE0D2" : "var(--surface)", 
                  padding: "8px 12px", 
                  borderRadius: 8, 
                  border: `1px solid ${c.status === "success" ? "var(--teal)" : c.status === "fail" ? "var(--brand)" : "var(--hairline)"}` 
                }}
              >
                <span style={{ fontSize: 12, fontWeight: 700, color: "var(--ink)" }}>Order #{c.id}</span>
                <span style={{ fontSize: 11.5, fontFamily: "JetBrains Mono", color: c.status === "success" ? "var(--teal)" : c.status === "fail" ? "var(--brand-2)" : "var(--ink)" }}>
                  {c.msg}
                </span>
                <span style={{ fontSize: 10.5, color: "var(--muted)" }}>{c.time}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
