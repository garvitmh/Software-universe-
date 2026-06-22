"use client";

import React, { useState, useEffect, useRef } from "react";

export default function POSSim() {
  const [printerOnline, setPrinterOnline] = useState(true);
  const [queue, setQueue] = useState([]);
  const [printedJobs, setPrintedJobs] = useState([
    { id: "101", items: "1x Double Farm Burger, 1x Fries", time: "Just now" }
  ]);
  const [currentPrintingId, setCurrentPrintingId] = useState(null);
  const [orderSeq, setOrderSeq] = useState(102);
  const [statusText, setStatusText] = useState("Kitchen printer idle. Ready to receive jobs.");

  const timerRef = useRef(null);

  // Simulate ticket generation from orders
  const generateOrder = () => {
    const nextId = orderSeq.toString();
    setOrderSeq(n => n + 1);
    const burgers = ["Farmhouse Special", "Double Spicy Paneer", "Crispy Chicken Deluxe", "Cheesy Mushroom Classic"];
    const sides = ["Fries", "Onion Rings", "Veg Nuggets", "Peri Peri Bites"];
    const randomBurger = burgers[Math.floor(Math.random() * burgers.length)];
    const randomSide = sides[Math.floor(Math.random() * sides.length)];
    
    const newJob = {
      id: nextId,
      items: `1x ${randomBurger}, 1x ${randomSide}`,
      retries: 0,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    };

    setQueue(prev => [...prev, newJob]);
    setStatusText(`New order #${nextId} received and queued.`);
  };

  // Queue runner
  useEffect(() => {
    if (timerRef.current) return;

    const processQueue = () => {
      if (queue.length === 0) {
        timerRef.current = null;
        return;
      }

      if (!printerOnline) {
        setStatusText("⚠️ Printer OFFLINE. Print jobs are buffering in the Redis queue.");
        timerRef.current = null;
        return;
      }

      // Process the first job in the queue
      const job = queue[0];
      setCurrentPrintingId(job.id);
      setStatusText(`Printing ticket #${job.id}...`);

      // Simulate a print delay of 1.5 seconds
      timerRef.current = setTimeout(() => {
        setPrintedJobs(prev => [
          { id: job.id, items: job.items, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) },
          ...prev.slice(0, 4)
        ]);
        setQueue(prev => prev.slice(1));
        setCurrentPrintingId(null);
        setStatusText(`Ticket #${job.id} printed successfully!`);
        timerRef.current = null;
      }, 1500);
    };

    processQueue();
  }, [queue, printerOnline]);

  const togglePrinter = () => {
    setPrinterOnline(prev => {
      const next = !prev;
      if (next) {
        setStatusText("Printer came back ONLINE. Processing buffered jobs...");
      } else {
        if (timerRef.current) {
          clearTimeout(timerRef.current);
          timerRef.current = null;
        }
        setCurrentPrintingId(null);
        setStatusText("🚨 Printer disconnected! Print jobs are now buffering.");
      }
      return next;
    });
  };

  const clearJobs = () => {
    setPrintedJobs([]);
    setQueue([]);
    setCurrentPrintingId(null);
    setStatusText("POS Queue cleared.");
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <p style={{ fontSize: 13, color: "var(--ink-2)", lineHeight: 1.45, margin: 0 }}>
        Simulate an asynchronous kitchen printing queue. When the printer goes offline, Redis buffers tickets to prevent double-printing or missing tickets.
      </p>

      {/* Control Buttons */}
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        <button onClick={generateOrder} className="btn btn-primary">➕ Generate Order</button>
        <button 
          onClick={togglePrinter} 
          className="btn" 
          style={{ 
            background: printerOnline ? "var(--bg-2)" : "var(--pop-pink)", 
            color: printerOnline ? "var(--ink)" : "#fff",
            border: "none"
          }}
        >
          {printerOnline ? "🔌 Set Printer Offline" : "🔌 Set Printer Online"}
        </button>
        <button onClick={clearJobs} className="btn btn-ghost" style={{ marginLeft: "auto" }}>Clear</button>
      </div>

      {/* Interactive Printer Graphic */}
      <div 
        style={{ 
          background: "var(--surface-warm)", 
          border: "1px solid var(--hairline-2)", 
          borderRadius: 14, 
          padding: 20, 
          display: "flex", 
          flexDirection: "column", 
          alignItems: "center",
          position: "relative",
          minHeight: 180,
          justifyContent: "center"
        }}
      >
        {/* Printer Chassis */}
        <div 
          style={{ 
            width: 120, 
            height: 90, 
            background: printerOnline ? "#2C3E50" : "#7F8C8D", 
            borderRadius: "10px 10px 4px 4px", 
            borderBottom: "6px solid #1A252F",
            position: "relative",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
            transition: "background 0.3s ease"
          }}
        >
          {/* Status light */}
          <span 
            style={{ 
              position: "absolute", 
              top: 10, 
              right: 10, 
              width: 8, 
              height: 8, 
              borderRadius: "50%", 
              background: printerOnline ? (currentPrintingId ? "#F39C12" : "#2ECC71") : "#E74C3C",
              boxShadow: `0 0 8px ${printerOnline ? (currentPrintingId ? "#F39C12" : "#2ECC71") : "#E74C3C"}`
            }} 
          />

          {/* Paper Slot */}
          <div style={{ width: 90, height: 6, background: "#111", marginTop: 28, borderRadius: 2 }} />

          {/* Label text */}
          <span style={{ fontSize: 9, color: "#BDC3C7", fontFamily: "JetBrains Mono", marginTop: 10 }}>KITCHEN_1</span>

          {/* Printing paper rolling out */}
          {currentPrintingId && (
            <div 
              style={{
                position: "absolute",
                top: 34,
                width: 76,
                background: "#fff",
                border: "1px solid var(--hairline)",
                borderTop: "none",
                borderRadius: "0 0 6px 6px",
                padding: "8px 6px",
                boxShadow: "0 4px 6px rgba(0,0,0,0.15)",
                fontFamily: "JetBrains Mono",
                fontSize: 8,
                color: "#111",
                animation: "rollout 1.5s infinite linear",
                textAlign: "center"
              }}
            >
              <div>ORDER #{currentPrintingId}</div>
              <div style={{ borderBottom: "1px dashed #7f8c8d", margin: "4px 0" }} />
              <div>PRINTING...</div>
            </div>
          )}
        </div>

        <style>{`
          @keyframes rollout {
            0% { height: 10px; opacity: 0.7; }
            50% { height: 35px; opacity: 1; }
            100% { height: 42px; opacity: 0.9; }
          }
        `}</style>
      </div>

      {/* Queued Jobs in Redis */}
      <div>
        <span className="eyebrow" style={{ display: "flex", justifyContent: "space-between" }}>
          <span>Redis Print Buffer Queue ({queue.length} jobs)</span>
          {queue.length > 3 && <span style={{ color: "var(--brand)", fontWeight: 700 }}>⚠️ Buffer High!</span>}
        </span>
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
          {queue.length === 0 ? (
            <span style={{ fontSize: 12, color: "var(--faint)", textAlign: "center", display: "block", padding: "10px 0" }}>
              Queue is empty. All jobs sent to printer.
            </span>
          ) : (
            queue.map((item, idx) => (
              <div 
                key={item.id} 
                style={{ 
                  display: "flex", 
                  justifyContent: "space-between", 
                  alignItems: "center", 
                  background: idx === 0 && printerOnline ? "rgba(47, 191, 113, 0.08)" : "var(--surface)", 
                  padding: "8px 12px", 
                  borderRadius: 8, 
                  border: `1px solid ${idx === 0 && printerOnline ? "var(--teal)" : "var(--hairline)"}` 
                }}
              >
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: "var(--ink)" }}>Order #{item.id}</span>
                  <span style={{ fontSize: 11, color: "var(--muted)" }}>{item.items}</span>
                </div>
                <span style={{ fontSize: 10.5, fontFamily: "JetBrains Mono", color: "var(--muted)" }}>
                  {idx === 0 && printerOnline ? "⚡ Sending..." : "⏱️ Buffered"}
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Printed Tickets Log */}
      <div>
        <span className="eyebrow">Printed Tickets (Kitchen Log)</span>
        <div 
          style={{ 
            marginTop: 8, 
            background: "var(--bg-2)", 
            border: "1px solid var(--hairline-2)", 
            borderRadius: 12, 
            padding: 12, 
            maxHeight: 160, 
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            gap: 6
          }}
        >
          {printedJobs.length === 0 ? (
            <span style={{ fontSize: 12, color: "var(--faint)", textAlign: "center", display: "block", padding: "10px 0" }}>No printed tickets yet.</span>
          ) : (
            printedJobs.map((item) => (
              <div 
                key={item.id} 
                style={{ 
                  display: "flex", 
                  justifyContent: "space-between", 
                  alignItems: "center", 
                  background: "var(--surface)", 
                  padding: "8px 12px", 
                  borderRadius: 8, 
                  border: "1px solid var(--hairline)" 
                }}
              >
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: "var(--teal)" }}>✓ Ticket #{item.id}</span>
                  <span style={{ fontSize: 11, color: "var(--ink-2)" }}>{item.items}</span>
                </div>
                <span style={{ fontSize: 10.5, color: "var(--muted)" }}>Printed at {item.time}</span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Status Bar */}
      <div 
        style={{ 
          background: "var(--surface-warm)", 
          border: "1px solid var(--hairline)", 
          borderRadius: 10, 
          padding: "10px 14px", 
          fontSize: 12.5, 
          color: "var(--ink)",
          display: "flex",
          alignItems: "center",
          gap: 8
        }}
      >
        <span style={{ width: 6, height: 6, borderRadius: "50%", background: printerOnline ? "var(--teal)" : "var(--brand)", display: "inline-block" }} />
        {statusText}
      </div>
    </div>
  );
}
