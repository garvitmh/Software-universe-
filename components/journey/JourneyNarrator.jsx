"use client";

import React from "react";
import { motion } from "framer-motion";

export default function JourneyNarrator({ selectedStep, currentJourneyColor }) {
  if (!selectedStep) {
    return (
      <div className="card" style={{ padding: "24px", display: "flex", gap: "16px", alignItems: "center" }}>
        <span style={{ fontSize: "36px" }}>🧙‍♂️</span>
        <div style={{ fontSize: "14px", color: "var(--muted)" }}>
          Select any step card in the timeline map above to inspect details and hear the Chief Architect's coaching notes.
        </div>
      </div>
    );
  }

  const { title, icon, desc, unlocked, completed, concept, requiredMastery, milestone } = selectedStep;

  // Formulate coach advice
  let coachTitle = "Chief Architect's Instructions";
  let coachQuote = "";
  let actionHint = "";

  if (completed) {
    coachQuote = `Excellent work! You have successfully mastered the principles of '${title}'. This foundation allows us to scale up other systems.`;
    actionHint = "✓ Requirements fully satisfied. You can review this concept page or proceed to the next active node.";
  } else if (unlocked) {
    coachQuote = `You are currently stationed at '${title}'. To unlock and secure this node, we need to verify your conceptual comprehension.`;
    
    if (concept) {
      actionHint = `🎯 Action Required: Increase your '${concept}' concept mastery score to at least ${requiredMastery}% (Current: ${selectedStep.currentMastery || 0}%). Navigate to the Codex or complete challenges!`;
    } else if (milestone) {
      actionHint = `🎯 Action Required: Unlock the '${milestone.replace(/_/g, " ")}' milestone by answering related scenarios in the Challenge Arena.`;
    }
  } else {
    coachQuote = `This node is currently locked behind preceding constraints. Do not attempt to force high-scale configurations prematurely.`;
    
    if (concept) {
      actionHint = `🔒 Locked: Requires '${concept}' mastery at ${requiredMastery}% or above before we can activate this node.`;
    } else if (milestone) {
      actionHint = `🔒 Locked: Requires resolving the '${milestone.replace(/_/g, " ")}' milestone first.`;
    }
  }

  return (
    <motion.div
      className="card"
      style={{
        padding: "24px",
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        borderLeft: `4px solid ${currentJourneyColor || "var(--brand)"}`,
        backgroundColor: "var(--surface-warm)"
      }}
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
        <div style={{
          fontSize: "36px",
          width: "60px",
          height: "60px",
          borderRadius: "50%",
          backgroundColor: "var(--surface)",
          border: "1px solid var(--hairline-2)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "var(--shadow)",
          flexShrink: 0
        }}>
          🧙‍♂️
        </div>
        
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "6px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontSize: "14px", fontWeight: "700", color: "var(--ink)" }}>{coachTitle}</span>
            <span className="pill" style={{
              fontSize: "10px",
              padding: "2px 8px",
              background: completed ? "var(--teal-soft)" : unlocked ? "var(--brand-soft)" : "var(--bg-2)",
              color: completed ? "var(--teal)" : unlocked ? "var(--brand-2)" : "var(--faint)"
            }}>
              Node: {title}
            </span>
          </div>
          <p style={{ fontSize: "14.5px", color: "var(--ink-2)", fontStyle: "italic", margin: 0, lineHeight: "1.6" }}>
            "{coachQuote}"
          </p>
        </div>
      </div>

      <div style={{
        marginTop: "8px",
        padding: "12px 14px",
        borderRadius: "8px",
        backgroundColor: "var(--surface)",
        border: "1px solid var(--hairline)",
        fontSize: "13px",
        fontWeight: "600",
        color: completed ? "var(--teal)" : unlocked ? "var(--brand-2)" : "var(--muted)",
        display: "flex",
        alignItems: "center",
        gap: "8px"
      }}>
        <span style={{ fontSize: "16px" }}>{completed ? "💡" : unlocked ? "🎯" : "🔒"}</span>
        <span>{actionHint}</span>
      </div>
    </motion.div>
  );
}
