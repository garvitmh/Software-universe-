"use client";

import React from "react";
import { motion } from "framer-motion";

// Visual coordinates dictionary for all possible trace components
export const NODE_POSITIONS = {
  // Client & Apps
  "Checkout Screen View": { x: 80, y: 200, emoji: "📱", color: "var(--pop-blue)" },
  "Login Screen View": { x: 80, y: 200, emoji: "🔑", color: "var(--pop-blue)" },
  "Order State Provider": { x: 190, y: 200, emoji: "🧠", color: "var(--pop-blue)" },
  "Auth State Provider": { x: 190, y: 200, emoji: "🧠", color: "var(--pop-blue)" },
  "Order Client Service API": { x: 300, y: 200, emoji: "📡", color: "var(--pop-blue)" },
  "Auth Client Service API": { x: 300, y: 200, emoji: "📡", color: "var(--pop-blue)" },
  
  // API Gateway & Routers
  "POST /orders": { x: 410, y: 200, emoji: "🌐", color: "var(--brand)" },
  "POST /auth/login": { x: 410, y: 200, emoji: "🌐", color: "var(--brand)" },
  "Order Router Controller": { x: 530, y: 200, emoji: "🎛️", color: "var(--brand)" },
  "Auth Router Controller": { x: 530, y: 200, emoji: "🎛️", color: "var(--brand)" },
  
  // Payments & Databases
  "Payment Business Service": { x: 650, y: 110, emoji: "💼", color: "var(--pop-purple)" },
  "Stripe Payment Gateway": { x: 790, y: 110, emoji: "💳", color: "var(--pop-pink)" },
  "Checkout Error Widget": { x: 790, y: 200, emoji: "🚨", color: "var(--pink)" },
  
  "Order SQL Repository": { x: 650, y: 200, emoji: "📥", color: "var(--teal)" },
  "PostgreSQL Database Writer": { x: 770, y: 200, emoji: "💾", color: "var(--teal)" },
  "Redis Memory Cache": { x: 680, y: 290, emoji: "⚡", color: "var(--pop-yellow)" },

  // Events & Queues
  "OrderCreated Event Emit": { x: 650, y: 290, emoji: "📣", color: "var(--pop-purple)" },
  "BullMQ Redis Queue Broker": { x: 770, y: 290, emoji: "📬", color: "var(--pop-purple)" },
  
  // Workers & Sinks
  "BullMQ Notification Worker": { x: 890, y: 290, emoji: "👷‍♂️", color: "var(--pop-purple)" },
  "Twilio SMS Dispatcher": { x: 1010, y: 290, emoji: "📱", color: "var(--pop-pink)" },
  "Kitchen POS Thermal Printer": { x: 890, y: 200, emoji: "🖨️", color: "var(--teal)" },
  "Admin Dashboard Panel": { x: 890, y: 110, emoji: "📊", color: "var(--pop-blue)" }
};

export default function FlowCanvas({ spans, currentTime, activeNodeId }) {
  // Filter out spans that haven't started yet in the timeline
  const activeSpans = spans.filter(s => currentTime >= s.startTime);

  return (
    <div style={{
      position: "relative",
      width: "100%",
      height: "420px",
      backgroundColor: "var(--surface-warm)",
      borderRadius: "16px",
      border: "1.5px solid var(--hairline-2)",
      overflow: "auto",
      boxShadow: "var(--shadow) inset"
    }} className="no-scrollbar">
      
      <svg style={{
        position: "absolute",
        left: 0,
        top: 0,
        width: "1120px",
        height: "420px",
        pointerEvents: "none"
      }}>
        {/* Draw connectors (Edges) */}
        {spans.map((span) => {
          if (!span.parentId) return null;
          const parent = spans.find(p => p.id === span.parentId);
          if (!parent) return null;

          const startNode = NODE_POSITIONS[parent.name] || { x: 0, y: 0 };
          const endNode = NODE_POSITIONS[span.name] || { x: 0, y: 0 };

          // Determine connection active status
          const isFired = currentTime >= span.startTime;
          const isCompleted = currentTime >= span.endTime;

          return (
            <g key={`edge-${span.id}`}>
              {/* Underlay connection line */}
              <line
                x1={startNode.x}
                y1={startNode.y}
                x2={endNode.x}
                y2={endNode.y}
                stroke={isCompleted ? "var(--hairline-2)" : isFired ? "var(--brand-soft)" : "rgba(0,0,0,0.05)"}
                strokeWidth={isFired ? "3" : "2"}
                transition={{ duration: 0.2 }}
              />

              {/* Animated edge pulse if active */}
              {isFired && !isCompleted && (
                <motion.line
                  x1={startNode.x}
                  y1={startNode.y}
                  x2={endNode.x}
                  y2={endNode.y}
                  stroke={span.status === "FAILED" || span.status === "TIMEOUT" ? "var(--pink)" : "var(--brand)"}
                  strokeWidth="3.5"
                  strokeDasharray="6, 12"
                  animate={{ strokeDashoffset: [-36, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                />
              )}
            </g>
          );
        })}

        {/* Animated packet circles flying along edges */}
        {spans.map((span) => {
          if (!span.parentId) return null;
          const parent = spans.find(p => p.id === span.parentId);
          if (!parent) return null;

          const startNode = NODE_POSITIONS[parent.name] || { x: 0, y: 0 };
          const endNode = NODE_POSITIONS[span.name] || { x: 0, y: 0 };

          const duration = span.endTime - span.startTime;
          const elapsed = currentTime - span.startTime;
          
          if (elapsed < 0 || elapsed > duration) return null;

          // Interpolate coordinate position
          const ratio = elapsed / Math.max(1, duration);
          const packetX = startNode.x + (endNode.x - startNode.x) * ratio;
          const packetY = startNode.y + (endNode.y - startNode.y) * ratio;

          return (
            <circle
              key={`packet-${span.id}`}
              cx={packetX}
              cy={packetY}
              r="6"
              fill={span.status === "FAILED" || span.status === "TIMEOUT" ? "var(--pop-pink)" : "var(--brand)"}
              style={{
                filter: `drop-shadow(0 0 6px ${span.status === "FAILED" ? "var(--pop-pink)" : "var(--brand)"})`
              }}
            />
          );
        })}
      </svg>

      {/* Render Node Cards Layer */}
      <div style={{ position: "absolute", left: 0, top: 0, width: "1120px", height: "420px", pointerEvents: "auto" }}>
        {spans.map((span) => {
          const pos = NODE_POSITIONS[span.name];
          if (!pos) return null;

          const isFired = currentTime >= span.startTime;
          const isCompleted = currentTime >= span.endTime;
          const isProcessing = isFired && !isCompleted;
          
          let glowColor = "transparent";
          let borderStyle = "1.5px solid var(--hairline-2)";

          if (isProcessing) {
            glowColor = span.status === "FAILED" || span.status === "TIMEOUT" ? "rgba(255, 77, 141, 0.4)" : "rgba(99, 102, 241, 0.4)";
            borderStyle = `2.5px solid ${span.status === "FAILED" ? "var(--pop-pink)" : "var(--brand)"}`;
          } else if (isCompleted) {
            glowColor = span.status === "FAILED" || span.status === "TIMEOUT" ? "rgba(255, 77, 141, 0.15)" : "rgba(47, 191, 113, 0.15)";
            borderStyle = `1.5px solid ${span.status === "FAILED" ? "var(--pop-pink)" : "var(--pop-lime)"}`;
          }

          const isActiveInspector = activeNodeId === span.id;

          return (
            <motion.div
              key={span.id}
              style={{
                position: "absolute",
                left: pos.x - 30, // Centered
                top: pos.y - 30,  // Centered
                width: "60px",
                height: "60px",
                borderRadius: "50%",
                backgroundColor: "var(--surface)",
                border: isActiveInspector ? "3.5px solid var(--pop-purple)" : borderStyle,
                boxShadow: `0 0 16px ${glowColor}, var(--shadow)`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "24px",
                cursor: "pointer",
                userSelect: "none"
              }}
              whileHover={{ scale: 1.15 }}
              title={`${span.name} (${span.type})`}
            >
              {pos.emoji}

              {/* Status dot badge */}
              {isFired && (
                <div style={{
                  position: "absolute",
                  right: "-2px",
                  top: "-2px",
                  width: "12px",
                  height: "12px",
                  borderRadius: "50%",
                  backgroundColor: isCompleted ? (span.status === "FAILED" || span.status === "TIMEOUT" ? "var(--pop-pink)" : "var(--pop-lime)") : "var(--pop-yellow)",
                  border: "2px solid var(--surface)"
                }} />
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
