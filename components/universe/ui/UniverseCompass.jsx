"use client";

import React from "react";
import { useUniverse } from "../UniverseContext";
import { motion } from "framer-motion";

export default function UniverseCompass() {
  const { cognitiveState } = useUniverse();
  const roadmap = cognitiveState.futureRoadmap || { immediate: [], shortTerm: [], longTerm: [] };

  const containerVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, staggerChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 100 } }
  };

  return (
    <motion.div
      className="card"
      style={{ padding: "24px", minHeight: "350px", position: "relative", overflow: "hidden" }}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
        <div>
          <span className="eyebrow">Navigation Engine</span>
          <h3 style={{ margin: "4px 0 0 0", fontSize: "22px" }}>Learning Compass</h3>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <span className="pill" style={{ background: "var(--teal-soft)", color: "var(--teal)" }}>
            <span className="tag-dot" style={{ backgroundColor: "var(--teal)" }}></span> GPS Connected
          </span>
        </div>
      </div>

      <p style={{ fontSize: "14px", color: "var(--muted)", marginBottom: "24px" }}>
        Your personalized architectural learning path. Follow the tracks to earn systems thinking capabilities.
      </p>

      {/* Visual Roadmap Path */}
      <div style={{ display: "flex", flexDirection: "column", gap: "30px", position: "relative" }}>
        {/* Connector vertical line */}
        <div style={{
          position: "absolute",
          left: "23px",
          top: "15px",
          bottom: "15px",
          width: "3px",
          background: "linear-gradient(to bottom, var(--pop-pink), var(--brand), var(--pop-blue))",
          zIndex: 0
        }} />

        {/* Section: Immediate */}
        <motion.div variants={itemVariants} style={{ display: "flex", gap: "16px", zIndex: 1 }}>
          <div style={{
            width: "48px",
            height: "48px",
            borderRadius: "50%",
            backgroundColor: "var(--bg-2)",
            border: "3px solid var(--pop-pink)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: "bold",
            color: "var(--pop-pink)",
            fontSize: "14px",
            flexShrink: 0
          }}>
            NOW
          </div>
          <div style={{ flex: 1 }}>
            <h4 style={{ fontSize: "16px", fontWeight: "600", margin: "2px 0 6px 0", color: "var(--ink)" }}>
              Immediate Tracks (Active Bottlenecks)
            </h4>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {roadmap.immediate.map((topic, i) => (
                <span key={i} className="chip3d" style={{ borderColor: "var(--hairline-2)", fontSize: "12px" }}>
                  {topic}
                </span>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Section: Short Term */}
        <motion.div variants={itemVariants} style={{ display: "flex", gap: "16px", zIndex: 1 }}>
          <div style={{
            width: "48px",
            height: "48px",
            borderRadius: "50%",
            backgroundColor: "var(--bg-2)",
            border: "3px solid var(--brand)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: "bold",
            color: "var(--brand)",
            fontSize: "14px",
            flexShrink: 0
          }}>
            NEXT
          </div>
          <div style={{ flex: 1 }}>
            <h4 style={{ fontSize: "16px", fontWeight: "600", margin: "2px 0 6px 0", color: "var(--ink)" }}>
              Short-Term Junctions (SRE & Decisions)
            </h4>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {roadmap.shortTerm.map((topic, i) => (
                <span key={i} className="chip3d" style={{ borderColor: "var(--hairline-2)", fontSize: "12px" }}>
                  {topic}
                </span>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Section: Long Term */}
        <motion.div variants={itemVariants} style={{ display: "flex", gap: "16px", zIndex: 1 }}>
          <div style={{
            width: "48px",
            height: "48px",
            borderRadius: "50%",
            backgroundColor: "var(--bg-2)",
            border: "3px solid var(--pop-blue)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: "bold",
            color: "var(--pop-blue)",
            fontSize: "14px",
            flexShrink: 0
          }}>
            PLANET
          </div>
          <div style={{ flex: 1 }}>
            <h4 style={{ fontSize: "16px", fontWeight: "600", margin: "2px 0 6px 0", color: "var(--ink)" }}>
              Long-Term Horizons (Distributed Scale)
            </h4>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {roadmap.longTerm.map((topic, i) => (
                <span key={i} className="chip3d" style={{ borderColor: "var(--hairline-2)", fontSize: "12px" }}>
                  {topic}
                </span>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
