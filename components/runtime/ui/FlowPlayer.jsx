"use client";

import React, { useState, useEffect, useRef } from "react";
import { traceExecution } from "../CodeExecutionTracer";
import FlowCanvas from "./FlowCanvas";
import TimelineControls from "./TimelineControls";
import { motion, AnimatePresence } from "framer-motion";

export default function FlowPlayer() {
  const [trigger, setTrigger] = useState("PLACE_ORDER");
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(2); // default 2x speed
  const [selectedNodeId, setSelectedNodeId] = useState(null);

  // Get trace data based on trigger
  const trace = traceExecution(trigger);
  const totalDuration = trace.totalDuration || 1000;

  const animationRef = useRef(null);
  const lastTimeRef = useRef(null);

  // Animation frame loop for smooth playback
  useEffect(() => {
    if (isPlaying) {
      lastTimeRef.current = performance.now();
      
      const tick = () => {
        const now = performance.now();
        const delta = now - lastTimeRef.current;
        lastTimeRef.current = now;

        setCurrentTime(prev => {
          const next = prev + delta * speed;
          if (next >= totalDuration) {
            setIsPlaying(false);
            return totalDuration;
          }
          return Math.round(next);
        });

        animationRef.current = requestAnimationFrame(tick);
      };

      animationRef.current = requestAnimationFrame(tick);
    } else {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, speed, totalDuration]);

  // Handle trigger change: reset playback
  useEffect(() => {
    setCurrentTime(0);
    setIsPlaying(false);
    setSelectedNodeId(null);
  }, [trigger]);

  // Selected node details helper
  const selectedNode = trace.spans.find(s => s.id === selectedNodeId);

  // Compute timing breakdowns
  const breakdown = trace.latencyBreakdown || { compute: 0, io: 0, queue: 0, network: 0 };
  const breakdownTotal = Math.max(1, breakdown.total);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px", width: "100%" }}>
      {/* Upper header controls */}
      <div className="card" style={{ padding: "20px", display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: "16px" }}>
        <div>
          <span className="eyebrow" style={{ color: "var(--brand)" }}>Flow Player</span>
          <h3 style={{ margin: "4px 0 0 0", fontSize: "20px" }}>Request Execution Player</h3>
        </div>

        {/* Trigger Selectors */}
        <div style={{ display: "flex", gap: "10px" }}>
          {[
            { id: "PLACE_ORDER", label: "Place Order Flow" },
            { id: "LOGIN", label: "Login Flow" },
            { id: "PAYMENT_FAILURE", label: "Stripe Gateway Failure" }
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setTrigger(t.id)}
              style={{
                padding: "8px 16px",
                fontSize: "13.5px",
                fontWeight: "bold",
                borderRadius: "10px",
                cursor: "pointer",
                border: trigger === t.id ? "2.5px solid var(--brand)" : "1.5px solid var(--hairline-2)",
                backgroundColor: trigger === t.id ? "var(--brand-soft)" : "var(--surface)",
                color: trigger === t.id ? "var(--brand-2)" : "var(--ink-2)",
                transition: "all 0.2s ease"
              }}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: left Player, right Sidebar */}
      <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 8fr) minmax(0, 4fr)", gap: "28px" }} className="ways-grid">
        
        {/* Left Column: Canvas and Playback */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {/* Interactive Flow Canvas */}
          <FlowCanvas
            spans={trace.spans}
            currentTime={currentTime}
            activeNodeId={selectedNodeId}
          />

          {/* Timeline Controls */}
          <TimelineControls
            isPlaying={isPlaying}
            onTogglePlay={() => setIsPlaying(!isPlaying)}
            currentTime={currentTime}
            totalDuration={totalDuration}
            speed={speed}
            onChangeSpeed={setSpeed}
            onScrub={setCurrentTime}
          />

          {/* Quick instructions indicator */}
          <div style={{ fontSize: "12.5px", color: "var(--muted)", fontStyle: "italic", textAlign: "center" }}>
            💡 Hint: Press Play to watch glowing packets flow, scrub the slider to analyze specific timestamps, or click any node to inspect traces.
          </div>
        </div>

        {/* Right Column: Telemetry Sidebar Details */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          
          {/* Latency Segment breakdown (Browser Devtools style) */}
          <div className="card" style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "14px" }}>
            <h4 style={{ fontSize: "15px", fontWeight: "700", color: "var(--ink)" }}>Latency Segment Breakdown</h4>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {[
                { label: "Network Roundtrips", val: breakdown.network, color: "var(--pop-pink)", bg: "var(--pink-soft)" },
                { label: "Database Disk I/O", val: breakdown.io, color: "var(--teal)", bg: "var(--teal-soft)" },
                { label: "Background Queueing", val: breakdown.queue, color: "var(--pop-purple)", bg: "var(--purple-soft)" },
                { label: "CPU Compute Overhead", val: breakdown.compute, color: "var(--brand-2)", bg: "var(--brand-soft)" }
              ].map(seg => {
                const pct = Math.round((seg.val / breakdownTotal) * 100);
                return (
                  <div key={seg.label} style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", fontWeight: "600" }}>
                      <span style={{ color: "var(--ink-2)" }}>{seg.label}</span>
                      <span style={{ color: seg.color }}>{seg.val} ms ({pct}%)</span>
                    </div>
                    <div style={{ width: "100%", height: "8px", borderRadius: "4px", backgroundColor: "var(--bg-2)", overflow: "hidden" }}>
                      <div style={{ width: `${pct}%`, height: "100%", backgroundColor: seg.color }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Node detail inspector panel */}
          <div className="card" style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "14px", minHeight: "220px" }}>
            <h4 style={{ fontSize: "15px", fontWeight: "700", color: "var(--ink)" }}>Telemetry Node Inspector</h4>

            {!selectedNode ? (
              <div style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                flex: 1,
                textAlign: "center",
                color: "var(--faint)",
                fontSize: "13px",
                border: "1px dashed var(--hairline-2)",
                borderRadius: "10px",
                padding: "20px"
              }}>
                🔍 Click any node icon on the canvas to inspect its trace timing records and SRE data.
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ display: "flex", flexDirection: "column", gap: "12px" }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "15px", fontWeight: "700", color: "var(--brand-2)" }}>{selectedNode.name}</span>
                  <span className="pill" style={{
                    fontSize: "10px",
                    background: selectedNode.status === "FAILED" || selectedNode.status === "TIMEOUT" ? "var(--pink-soft)" : "var(--teal-soft)",
                    color: selectedNode.status === "FAILED" || selectedNode.status === "TIMEOUT" ? "var(--pink)" : "var(--teal)"
                  }}>
                    {selectedNode.status}
                  </span>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", fontSize: "12px", borderTop: "1px solid var(--hairline)", paddingTop: "10px" }}>
                  <div><strong>System:</strong> {selectedNode.system}</div>
                  <div><strong>Type:</strong> {selectedNode.type}</div>
                  <div><strong>Start Offset:</strong> {selectedNode.startTime} ms</div>
                  <div><strong>Duration:</strong> {selectedNode.duration} ms</div>
                </div>

                <div style={{
                  padding: "10px 12px",
                  borderRadius: "8px",
                  backgroundColor: "var(--bg-2)",
                  fontSize: "12.5px",
                  color: "var(--ink-2)",
                  lineHeight: "1.4"
                }}>
                  <strong>SRE Insight:</strong> Runs inside the {selectedNode.domain} domain, processing requests from {selectedNode.startTime}ms to {selectedNode.endTime}ms.
                </div>
              </motion.div>
            )}
          </div>

          {/* SRE Outage retry logs if PLACE_ORDER */}
          {trigger === "PLACE_ORDER" && (
            <div className="card" style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "10px" }}>
              <h4 style={{ fontSize: "15px", fontWeight: "700", color: "var(--ink)", margin: 0 }}>Outage Retries Log</h4>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {[
                  { title: "Attempt 1 (Stripe API)", time: "65ms", status: "TIMEOUT", desc: "API connection timed out after 400ms" },
                  { title: "Backoff Retry Delay", time: "490ms", status: "WAITING", desc: "Exponential backoff with jitter" },
                  { title: "Attempt 2 (Stripe API)", time: "500ms", status: "SUCCESS", desc: "Succeeded in 10ms" }
                ].map((log, idx) => (
                  <div key={idx} style={{
                    fontSize: "11.5px",
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "8px",
                    borderLeft: `2.5px solid ${log.status === "SUCCESS" ? "var(--pop-lime)" : log.status === "WAITING" ? "var(--pop-yellow)" : "var(--pop-pink)"}`,
                    paddingLeft: "8px"
                  }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: "700" }}>{log.title} <span style={{ color: "var(--muted)", fontWeight: "500" }}>({log.time})</span></div>
                      <div style={{ color: "var(--muted)", fontSize: "10.5px" }}>{log.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
