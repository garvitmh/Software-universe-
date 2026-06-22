"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PATTERNS_DB } from "./PatternSchema";

const TREE_NODES = {
  root: {
    question: "What is your primary system requirement right now?",
    options: [
      { text: "🛡️ Protect from outages / Transient failures", next: "resilience" },
      { text: "📈 Scale system load / Performance gains", next: "scaling" },
      { text: "🤝 Handle consistency / Multi-service writes", next: "consistency" }
    ]
  },
  resilience: {
    question: "What kind of failure are you trying to isolate or solve?",
    options: [
      { text: "Temporary network glitches & API hiccups", result: "retries" },
      { text: "Slow downstream services locking app threads", result: "circuit_breakers" },
      { text: "Slow tasks consuming all CPU/thread resources", result: "bulkheads" },
      { text: "Abusive clients spamming requests", result: "rate_limiting" }
    ]
  },
  scaling: {
    question: "What resource bottleneck are you experiencing?",
    options: [
      { text: "Web servers blocking during notification tasks", next: "async_processing" },
      { text: "Database read query overload", next: "reads_exhausted" },
      { text: "Database write capacity saturated", result: "sharding" }
    ]
  },
  async_processing: {
    question: "Do background tasks need to survive server restarts?",
    options: [
      { text: "Yes, tasks must persist even if nodes crash", result: "queues" },
      { text: "No, simple memory queues are fine", result: "workers" }
    ]
  },
  reads_exhausted: {
    question: "Is eventual consistency of a few seconds acceptable?",
    options: [
      { text: "Yes, temporary sync delays are fine", result: "read_replicas" },
      { text: "No, reads must be absolutely instant", result: "caching" }
    ]
  },
  consistency: {
    question: "What transaction or data consistency problem do you have?",
    options: [
      { text: "Guaranteeing message publication after database writes", result: "outbox" },
      { text: "Executing transactions across microservice boundaries", result: "saga" },
      { text: "Need full historical audit logs of all state changes", result: "event_sourcing" }
    ]
  }
};

export default function PatternDecisionTree({ selectPattern }) {
  const [currentNodeId, setCurrentNodeId] = useState("root");
  const [history, setHistory] = useState([]);
  const [recommendationId, setRecommendationId] = useState(null);

  const currentNode = TREE_NODES[currentNodeId];

  const handleOptionClick = (opt) => {
    if (opt.result) {
      setRecommendationId(opt.result);
      setHistory((prev) => [...prev, currentNodeId]);
      setCurrentNodeId(null);
    } else if (opt.next) {
      setHistory((prev) => [...prev, currentNodeId]);
      setCurrentNodeId(opt.next);
    }
  };

  const handleBack = () => {
    if (history.length > 0) {
      const prev = history[history.length - 1];
      setHistory((prevHist) => prevHist.slice(0, -1));
      setCurrentNodeId(prev);
      setRecommendationId(null);
    }
  };

  const handleReset = () => {
    setCurrentNodeId("root");
    setHistory([]);
    setRecommendationId(null);
  };

  const recommendedPattern = recommendationId
    ? PATTERNS_DB.find((p) => p.id === recommendationId)
    : null;

  return (
    <div className="card" style={{ padding: "24px 28px", display: "flex", flexDirection: "column", gap: "16px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <span className="eyebrow" style={{ color: "var(--brand)" }}>Interactive Assistant</span>
          <h3 style={{ margin: "2px 0 0 0", fontSize: "18px" }}>Architecture Decision Tree</h3>
        </div>
        {(history.length > 0) && (
          <div style={{ display: "flex", gap: "8px" }}>
            <button
              onClick={handleBack}
              style={{
                background: "var(--bg-2)", border: "1px solid var(--hairline)", borderRadius: "8px",
                padding: "6px 12px", fontSize: "11px", fontWeight: "700", cursor: "pointer",
                color: "var(--muted)"
              }}
            >
              ← Back
            </button>
            <button
              onClick={handleReset}
              style={{
                background: "var(--bg-2)", border: "1px solid var(--hairline)", borderRadius: "8px",
                padding: "6px 12px", fontSize: "11px", fontWeight: "700", cursor: "pointer",
                color: "var(--muted)"
              }}
            >
              Reset
            </button>
          </div>
        )}
      </div>

      <div style={{
        background: "var(--bg-2)",
        border: "1px solid var(--hairline-2)",
        borderRadius: "14px",
        padding: "24px",
        minHeight: "220px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center"
      }}>
        <AnimatePresence mode="wait">
          {currentNode && (
            <motion.div
              key={currentNodeId}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              style={{ display: "flex", flexDirection: "column", gap: "16px" }}
            >
              <h4 style={{ margin: 0, fontSize: "15px", color: "var(--ink)", textAlign: "center", lineHeight: "1.5" }}>
                {currentNode.question}
              </h4>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px", maxWidth: "480px", margin: "0 auto", width: "100%" }}>
                {currentNode.options.map((opt) => (
                  <motion.button
                    key={opt.text}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleOptionClick(opt)}
                    style={{
                      background: "var(--surface)",
                      border: "1px solid var(--hairline)",
                      borderRadius: "10px",
                      padding: "14px 18px",
                      fontSize: "13px",
                      fontWeight: "700",
                      color: "var(--ink-2)",
                      cursor: "pointer",
                      textAlign: "left"
                    }}
                  >
                    {opt.text}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {recommendedPattern && (
            <motion.div
              key={recommendationId}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "16px", textAlign: "center" }}
            >
              <span style={{ fontSize: "40px" }}>💡</span>
              <div>
                <span style={{ fontSize: "11px", fontWeight: "800", color: "var(--brand)", textTransform: "uppercase" }}>
                  Recommended Design Pattern
                </span>
                <h4 style={{ margin: "4px 0", fontSize: "18px", fontWeight: "800", color: "var(--brand-2)" }}>
                  {recommendedPattern.name}
                </h4>
                <p style={{ margin: "8px 0 0 0", fontSize: "12px", color: "var(--muted)", maxWidth: "480px", lineHeight: "1.6" }}>
                  {recommendedPattern.problem}
                </p>
              </div>
              <div style={{ display: "flex", gap: "10px" }}>
                <button
                  onClick={() => selectPattern(recommendedPattern.id)}
                  style={{
                    background: "var(--brand)", border: "none", borderRadius: "10px",
                    padding: "10px 18px", fontSize: "12px", fontWeight: "700", cursor: "pointer",
                    color: "#fff"
                  }}
                >
                  View Details in Atlas
                </button>
                <button
                  onClick={handleReset}
                  style={{
                    background: "var(--bg-3)", border: "1px solid var(--hairline)", borderRadius: "10px",
                    padding: "10px 18px", fontSize: "12px", fontWeight: "700", cursor: "pointer",
                    color: "var(--ink-2)"
                  }}
                >
                  Restart Assistant
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
