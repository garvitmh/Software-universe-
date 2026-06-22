"use client";

import React, { useState } from "react";
import { useChallenges } from "../../../hooks/useChallenges";
import { motion, AnimatePresence } from "framer-motion";

export default function ChallengeArena() {
  const { challenges, submitAnswer } = useChallenges();
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [revealed, setRevealed] = useState(false);

  const activeChallenge = challenges ? challenges[0] : "No active challenge.";

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!answer.trim()) return;

    const res = submitAnswer(answer);
    setFeedback(res);
    setRevealed(true);
  };

  return (
    <motion.div
      className="card"
      style={{ padding: "26px", display: "flex", flexDirection: "column", gap: "18px" }}
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <span className="eyebrow" style={{ color: "var(--pop-pink)" }}>Challenge Arena</span>
          <h3 style={{ margin: "4px 0 0 0", fontSize: "22px" }}>Active Scenario Drill</h3>
        </div>
        <span className="pill" style={{ background: "var(--pink-soft)", color: "var(--pink)" }}>
          SEV1 Scale Drill
        </span>
      </div>

      <div style={{
        padding: "16px",
        borderRadius: "12px",
        background: "var(--bg-2)",
        border: "1.5px solid var(--hairline-2)",
        fontSize: "15px",
        fontWeight: "600",
        color: "var(--ink)",
        lineHeight: "1.5"
      }}>
        {activeChallenge}
      </div>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        <textarea
          placeholder="Type your system design justification here... Hint: mention team size limits, budgets, or specific technology tradeoffs (e.g. BullMQ simplicity) to unlock milestones!"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          rows={4}
          style={{
            width: "100%",
            padding: "12px",
            fontSize: "14px",
            borderRadius: "10px",
            border: "1.5px solid var(--hairline-2)",
            background: "var(--surface)",
            color: "var(--ink)",
            fontFamily: "inherit",
            resize: "vertical",
            outline: "none"
          }}
        />

        <div style={{ display: "flex", gap: "10px" }}>
          <button type="submit" className="btn btn-primary" style={{ background: "var(--brand)" }}>
            Submit Review
          </button>
          <button
            type="button"
            className="btn btn-ghost"
            onClick={() => {
              setRevealed(true);
              setFeedback({ success: true, unlockedConstraint: false, unlockedTradeoff: false });
            }}
          >
            Reveal Model Answer
          </button>
        </div>
      </form>

      <AnimatePresence>
        {revealed && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            style={{ overflow: "hidden", borderTop: "1px solid var(--hairline)", paddingTop: "16px", marginTop: "4px" }}
          >
            {feedback && (
              <div style={{ marginBottom: "16px" }}>
                {feedback.unlockedConstraint && (
                  <div className="pill" style={{ background: "var(--teal-soft)", color: "var(--teal)", marginRight: "8px", marginBottom: "8px" }}>
                    🎉 Unlocked: Constraint Thinking Milestone!
                  </div>
                )}
                {feedback.unlockedTradeoff && (
                  <div className="pill" style={{ background: "var(--teal-soft)", color: "var(--teal)", marginBottom: "8px" }}>
                    🎉 Unlocked: Tradeoff Evaluation Milestone!
                  </div>
                )}
              </div>
            )}

            <h4 style={{ margin: "0 0 6px 0", fontSize: "14px", fontWeight: "700", color: "var(--brand-2)" }}>
              Model Staff Engineer Explanation:
            </h4>
            <p style={{ fontSize: "13.5px", color: "var(--ink-2)", lineHeight: "1.6", margin: "0 0 12px 0" }}>
              Given Burger Farm's tight constraint of 2 developers, introducing Kafka introduces unnecessary complexity (ops configuration, partitions, message schema registries). BullMQ leverages your existing Redis session store to achieve message buffering, job retries, and rate limiting with zero extra hosting cost and minimal setup. Scale is earned by benchmarks, not by copying Netflix prematurely.
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginTop: "12px" }}>
              <div style={{ padding: "10px", borderRadius: "8px", background: "var(--bg-2)", fontSize: "12.5px" }}>
                <strong>Simple:</strong> Don't buy a semi-truck (Kafka) when a bicycle (BullMQ) is all you need to deliver a burger.
              </div>
              <div style={{ padding: "10px", borderRadius: "8px", background: "var(--bg-2)", fontSize: "12.5px" }}>
                <strong>Giants:</strong> Shopify scaled to $100M+ GMV on a single monolithic database before introducing database sharding.
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
