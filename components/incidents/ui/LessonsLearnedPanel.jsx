"use client";

import React from "react";
import { motion } from "framer-motion";

const PRIORITY_COLORS = {
  HIGH: { color: "var(--pop-pink)", bg: "var(--pink-soft)", border: "rgba(255,77,141,0.2)" },
  MEDIUM: { color: "var(--amber)", bg: "var(--amber-soft)", border: "rgba(133,79,11,0.2)" },
  LOW: { color: "var(--teal)", bg: "var(--teal-soft)", border: "rgba(15,110,86,0.2)" }
};

const LESSONS = {
  PAYMENT_TIMEOUT: [
    { lesson: "Introduce circuit breakers on all external gateway calls (Stripe, Razorpay, Twilio)", priority: "HIGH" },
    { lesson: "Monitor P95 checkout latency with tight alerting thresholds (< 800ms)", priority: "HIGH" },
    { lesson: "Add a secondary payment gateway fallback in all checkout flows", priority: "MEDIUM" },
    { lesson: "Set explicit connect and read timeout values in Stripe SDK configuration", priority: "MEDIUM" },
    { lesson: "Add chaos testing for third-party gateway failures in staging", priority: "LOW" }
  ],
  POSTGRES_SATURATION: [
    { lesson: "Route all analytics and reporting queries to read replica nodes — never primary", priority: "HIGH" },
    { lesson: "Install PgBouncer connection proxy pool to prevent connection exhaustion", priority: "HIGH" },
    { lesson: "Add database CPU and connection usage to Grafana alerts", priority: "MEDIUM" },
    { lesson: "Add query cost guards in admin panel (warn on > 5s queries)", priority: "MEDIUM" },
    { lesson: "Move monthly analytics to an async background job with rate limiting", priority: "LOW" }
  ],
  REDIS_FAILURE: [
    { lesson: "Set removeOnComplete and removeOnFail limits on all BullMQ queue definitions", priority: "HIGH" },
    { lesson: "Add Redis memory alerting at 75%, 85%, and 95% watermarks", priority: "HIGH" },
    { lesson: "Enable Redis AOF persistence and configure Sentinel failover replica", priority: "MEDIUM" },
    { lesson: "Scale Redis container RAM allocation with a safety headroom of 40%", priority: "MEDIUM" },
    { lesson: "Add BullMQ job backlog monitoring to observability dashboard", priority: "LOW" }
  ]
};

export default function LessonsLearnedPanel({ incidentType = "PAYMENT_TIMEOUT" }) {
  const lessons = LESSONS[incidentType] || LESSONS.PAYMENT_TIMEOUT;

  return (
    <div className="card" style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "14px" }}>
      <div>
        <span className="eyebrow" style={{ color: "var(--muted)" }}>Post-Incident Review</span>
        <h3 style={{ margin: "2px 0 0 0", fontSize: "16px" }}>Lessons Learned</h3>
        <p style={{ margin: "4px 0 0 0", fontSize: "12px", color: "var(--faint)" }}>
          Permanent improvements to prevent recurrence
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {lessons.map((item, idx) => {
          const style = PRIORITY_COLORS[item.priority] || PRIORITY_COLORS.LOW;
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.07 }}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "10px",
                padding: "10px 12px",
                borderRadius: "8px",
                background: style.bg,
                border: `1px solid ${style.border}`
              }}
            >
              <span style={{ fontSize: "14px", flexShrink: 0, marginTop: "1px" }}>
                {item.priority === "HIGH" ? "🔴" : item.priority === "MEDIUM" ? "🟡" : "🟢"}
              </span>
              <div style={{ flex: 1 }}>
                <span style={{ fontSize: "12px", color: "var(--ink-2)", lineHeight: "1.5" }}>
                  {item.lesson}
                </span>
              </div>
              <span style={{
                fontSize: "9px", fontWeight: "700", color: style.color,
                padding: "2px 6px", borderRadius: "4px", background: "rgba(255,255,255,0.5)",
                flexShrink: 0, letterSpacing: "0.05em"
              }}>
                {item.priority}
              </span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
