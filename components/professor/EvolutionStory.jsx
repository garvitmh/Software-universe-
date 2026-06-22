"use client";

import React, { useState } from "react";
import { useProfessor } from "./ProfessorContext";
import { motion, AnimatePresence } from "framer-motion";

export default function EvolutionStory({ tintColors }) {
  const { currentConcept, currentWorld } = useProfessor();
  const [activeTierIdx, setActiveTierIdx] = useState(0);

  if (!currentConcept || !currentConcept.evolutionStory) return null;

  const colors = tintColors[currentWorld] || { main: "var(--brand)", soft: "var(--brand-soft)", dark: "var(--brand-2)" };
  const currentTier = currentConcept.evolutionStory[activeTierIdx];

  // Helper to enrich evolution details dynamically for visual chains of constraints
  const getConstraintChain = (tier, idx) => {
    // Basic defaults mapping to the schema data
    const chain = {
      problem: tier.problem,
      solution: tier.solution,
      tradeoff: "Resource utilization increases; requires monitoring load metrics.",
      newProblem: "Next scale tier will hit resource boundaries.",
      resolution: "Requires upgrading system topology."
    };

    // Specific enrichments for realistic constraints modeling
    if (currentWorld === "order") {
      if (idx === 0) {
        chain.tradeoff = "Highly coupled. If the DB slows down, the entire app freezes.";
        chain.newProblem = "Traffic spike locks the tables, blocking new checkouts.";
        chain.resolution = "Add a connection pooler to prevent thread starvation.";
      } else if (idx === 1) {
        chain.tradeoff = "Connection limit overhead on Postgres.";
        chain.newProblem = "Checkout queries bottleneck waiting for available database handles.";
        chain.resolution = "Introduce Redis Lists to buffer and defer DB writes.";
      } else if (idx === 2) {
        chain.tradeoff = "Eventual consistency (orders take a few hundred milliseconds to write).";
        chain.newProblem = "Users refresh checkout and don't see their order immediately.";
        chain.resolution = "Serve order status reads from Redis cache while queue drains.";
      } else if (idx === 3) {
        chain.tradeoff = "Worker thread limits and CPU overhead under peak ingestion spikes.";
        chain.newProblem = "Ingestion queue bottlenecks; RabbitMQ/Kafka server memory overflows.";
        chain.resolution = "Implement rate limiting, backpressure policies, and auto-scaling workers.";
      }
    } else if (currentWorld === "payment") {
      if (idx === 0) {
        chain.tradeoff = "Synchronous thread blocks client during network wait.";
        chain.newProblem = "If the client loses internet, payment confirmation is dropped.";
        chain.resolution = "Implement server-to-server gateway webhooks.";
      } else if (idx === 1) {
        chain.tradeoff = "Delayed processing. Webhooks queue before updating client.";
        chain.newProblem = "Spike loads backlog the event processing worker pool.";
        chain.resolution = "Deploy webhook signature caching and distributed workers.";
      } else if (idx === 2) {
        chain.tradeoff = "Edge latency checks. Verifying signature on every edge node.";
        chain.newProblem = "CPU exhaustion under burst attacks (DDoS webhook route).";
        chain.resolution = "Implement Cloudflare gatekeeping and signature checking.";
      } else if (idx === 3) {
        chain.tradeoff = "Consistency drift due to missing gateway events.";
        chain.newProblem = "Reconciliation requires parsing millions of banking rows daily.";
        chain.resolution = "Automate bank feed reconciliations via cron ledger comparisons.";
      }
    } else if (currentWorld === "analytics") {
      if (idx === 0) {
        chain.tradeoff = "Locks database tables, stalling primary checkouts.";
        chain.newProblem = "High traffic checkout locks cause reporting timeouts.";
        chain.resolution = "Add Read Replicas to handle analytical queries.";
      } else if (idx === 1) {
        chain.tradeoff = "Eventual consistency due to replication delay (lag).";
        chain.newProblem = "Manager sees stale order totals for up to 5 seconds.";
        chain.resolution = "Optimize queries; aggregate metrics periodically.";
      } else if (idx === 2) {
        chain.tradeoff = "Storage space and memory bottleneck on DB server.";
        chain.newProblem = "Relational database fails to process historical trends exceeding terabytes.";
        chain.resolution = "Stream transaction logs via Change Data Capture into a data warehouse.";
      } else if (idx === 3) {
        chain.tradeoff = "High warehouse querying costs and complex pipeline syncs.";
        chain.newProblem = "BigQuery queries process gigabytes per scan, raising cloud bills.";
        chain.resolution = "Implement incremental tables, partition tables, and pre-aggregate reporting views.";
      }
    }

    return chain;
  };

  const chain = getConstraintChain(currentTier, activeTierIdx);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <h4 style={{ fontSize: 13, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--muted)", margin: "0 0 4px" }}>
        System Evolution Path
      </h4>

      {/* Horizon scaling selection tab */}
      <div style={{ display: "flex", background: "var(--bg-2)", border: "1px solid var(--hairline)", borderRadius: 10, padding: 4, gap: 4 }}>
        {currentConcept.evolutionStory.map((tier, idx) => (
          <button
            key={idx}
            onClick={() => setActiveTierIdx(idx)}
            style={{
              flex: 1,
              padding: "8px 4px",
              fontSize: 11,
              fontWeight: 700,
              borderRadius: 6,
              border: "none",
              cursor: "pointer",
              background: activeTierIdx === idx ? colors.main : "transparent",
              color: activeTierIdx === idx ? "#11111B" : "var(--ink-2)",
              transition: "all 0.2s"
            }}
          >
            {tier.users}
          </button>
        ))}
      </div>

      {/* Constraints Chain Visualization */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTierIdx}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          style={{ display: "flex", flexDirection: "column", gap: 14 }}
        >
          {/* 1. Problem Card */}
          <div style={{ background: "rgba(243, 139, 168, 0.03)", border: "1px solid #F38BA8", borderRadius: 12, padding: "12px 14px" }}>
            <span style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", color: "#F38BA8", display: "block", marginBottom: 3 }}>
              ⚠️ Scale Constraint / Problem
            </span>
            <div style={{ fontSize: 13.5, color: "var(--ink)", lineHeight: 1.4, fontFamily: "Inter" }}>
              {chain.problem}
            </div>
          </div>

          {/* Connection arrow */}
          <div style={{ display: "flex", justifyContent: "center", margin: "-6px 0", color: "var(--muted)" }}>
            ⬇️
          </div>

          {/* 2. Solution Card */}
          <div style={{ background: "rgba(166, 227, 161, 0.03)", border: "1px solid #A6E3A1", borderRadius: 12, padding: "12px 14px" }}>
            <span style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", color: "#A6E3A1", display: "block", marginBottom: 3 }}>
              🛠️ Applied Engineering Solution
            </span>
            <div style={{ fontSize: 13.5, color: "var(--ink)", lineHeight: 1.4, fontWeight: 600, fontFamily: "Inter" }}>
              {chain.solution}
            </div>
          </div>

          {/* Connection arrow */}
          <div style={{ display: "flex", justifyContent: "center", margin: "-6px 0", color: "var(--muted)" }}>
            ⬇️
          </div>

          {/* 3. Tradeoff / New Problem Card */}
          <div style={{ background: "rgba(250, 179, 135, 0.03)", border: "1px solid #FAB387", borderRadius: 12, padding: "12px 14px" }}>
            <span style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", color: "#FAB387", display: "block", marginBottom: 3 }}>
              ⚖️ Resulting Tradeoff & New Constraint
            </span>
            <div style={{ fontSize: 13, color: "var(--ink-2)", lineHeight: 1.4, marginBottom: 8, fontFamily: "Inter" }}>
              {chain.tradeoff}
            </div>
            <div style={{ fontSize: 13.5, color: "var(--ink)", lineHeight: 1.4, borderTop: "1px dashed var(--hairline-2)", paddingTop: 8, fontFamily: "Inter" }}>
              <strong style={{ color: "#F9E2AF" }}>New Bottleneck: </strong>{chain.newProblem}
            </div>
          </div>

          {/* Connection arrow */}
          {activeTierIdx < currentConcept.evolutionStory.length - 1 && (
            <div style={{ display: "flex", justifyContent: "center", margin: "-6px 0", color: "var(--muted)" }}>
              ⬇️
            </div>
          )}

          {/* 4. Next Step recommendation */}
          {activeTierIdx < currentConcept.evolutionStory.length - 1 && (
            <div style={{ background: "var(--surface)", border: "1px dashed var(--hairline)", borderRadius: 12, padding: "10px 14px", textAlign: "center", fontSize: 12.5, color: "var(--ink-2)" }}>
              ⚡ Next Tier (<strong>{currentConcept.evolutionStory[activeTierIdx + 1].users}</strong>): {chain.resolution}
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
