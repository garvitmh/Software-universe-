"use client";

import React from "react";
import { motion } from "framer-motion";

const CONSTRAINTS = [
  { id: "users_10", label: "Single Node Monolith", description: "Zero overhead, single server host." },
  { id: "users_100", label: "Single-Thread Blocking", description: "Main server thread blocked by notifications." },
  { id: "users_1k", label: "DB Connection Pool", description: "Postgres primary choked by connection limits." },
  { id: "users_10k", label: "DB Read Saturation", description: "Too many repeated SQL read transactions." },
  { id: "users_100k", label: "DB Write IOPS Limit", description: "Writes conflict with reads on the primary." },
  { id: "users_1m", label: "Shard Lockouts & Latency", description: "Single primary cannot hold global write volume." }
];

export default function ConstraintTimeline({ currentStageId }) {
  const currentIdx = CONSTRAINTS.findIndex(c => c.id === currentStageId);

  return (
    <div className="card" style={{ padding: "20px 24px", display: "flex", flexDirection: "column", gap: "16px" }}>
      <div>
        <span className="eyebrow" style={{ color: "var(--brand)" }}>Theory of Constraints</span>
        <h3 style={{ margin: "2px 0 0 0", fontSize: "18px" }}>Dominant Bottleneck Progress</h3>
        <p style={{ margin: "4px 0 0 0", fontSize: "12px", color: "var(--muted)" }}>
          Every architecture is limited by a single bottleneck. Relieving one bottleneck shifts pressure to the next.
        </p>
      </div>

      <div style={{
        display: "flex",
        flexDirection: "column",
        gap: "12px"
      }}>
        {CONSTRAINTS.map((c, idx) => {
          const isActive = c.id === currentStageId;
          const isPassed = idx < currentIdx;

          return (
            <motion.div
              key={c.id}
              animate={{
                backgroundColor: isActive ? "rgba(249, 115, 22, 0.08)" : "transparent",
                borderColor: isActive ? "var(--brand)" : "var(--hairline)",
                scale: isActive ? 1.01 : 1
              }}
              transition={{ duration: 0.3 }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "14px",
                padding: "12px 16px",
                borderRadius: "10px",
                border: "1px solid var(--hairline)",
                position: "relative",
                overflow: "hidden"
              }}
            >
              {/* Highlight bar */}
              {isActive && (
                <div style={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  bottom: 0,
                  width: "4px",
                  backgroundColor: "var(--brand)"
                }} />
              )}

              {/* Status bullet */}
              <div style={{
                width: "24px",
                height: "24px",
                borderRadius: "50%",
                backgroundColor: isActive ? "var(--brand)" : isPassed ? "var(--brand-soft)" : "var(--bg-2)",
                border: `1px solid ${isActive ? "var(--brand)" : "var(--hairline-2)"}`,
                color: isActive ? "#fff" : isPassed ? "var(--brand-2)" : "var(--faint)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "11px",
                fontWeight: "bold",
                boxShadow: isActive ? "0 0 8px var(--brand)" : "none"
              }}>
                {idx + 1}
              </div>

              {/* Text */}
              <div style={{ flex: 1 }}>
                <div style={{
                  fontSize: "13px",
                  fontWeight: "700",
                  color: isActive ? "var(--brand-2)" : isPassed ? "var(--ink)" : "var(--muted)"
                }}>
                  {c.label}
                </div>
                <div style={{
                  fontSize: "11px",
                  color: isActive ? "var(--ink-2)" : "var(--muted)",
                  marginTop: "2px"
                }}>
                  {c.description}
                </div>
              </div>

              {/* State label */}
              <span style={{
                fontSize: "10px",
                fontWeight: "700",
                textTransform: "uppercase",
                padding: "2px 8px",
                borderRadius: "999px",
                background: isActive ? "var(--brand-soft)" : "var(--bg-2)",
                color: isActive ? "var(--brand-2)" : "var(--muted)"
              }}>
                {isActive ? "Critical" : isPassed ? "Resolved" : "Upcoming"}
              </span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
