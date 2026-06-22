"use client";

import React from "react";
import { useUniverse } from "../UniverseContext";
import { motion } from "framer-motion";

export default function NextBreakthroughPanel() {
  const { cognitiveState } = useUniverse();
  const breakthrough = cognitiveState.reflection?.nextBreakthrough || "Technology tradeoff selection based on telemetry.";

  return (
    <motion.div
      className="card"
      style={{
        padding: "24px",
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        background: "var(--grad-sunset)",
        color: "#ffffff",
        position: "relative",
        overflow: "hidden",
        boxShadow: "0 12px 28px -8px var(--pop-pink)"
      }}
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      whileHover={{ scale: 1.02 }}
    >
      {/* Subtle Background Glow/Rocket Silhouette */}
      <div style={{
        position: "absolute",
        right: "-10px",
        bottom: "-10px",
        fontSize: "120px",
        opacity: 0.15,
        userSelect: "none",
        pointerEvents: "none"
      }}>
        🚀
      </div>

      <div>
        <span className="eyebrow" style={{ color: "#ffffff", opacity: 0.8, letterSpacing: "0.15em" }}>Current Target</span>
        <h3 style={{ margin: "4px 0 0 0", fontSize: "22px", color: "#ffffff" }}>Next Breakthrough</h3>
      </div>

      <div style={{ display: "flex", gap: "16px", alignItems: "center", zIndex: 1 }}>
        <p style={{ fontSize: "15px", fontWeight: "600", lineHeight: "1.6", margin: 0, flex: 1 }}>
          {breakthrough}
        </p>

        {/* Animated Rocket Badge */}
        <motion.div
          style={{
            width: "56px",
            height: "56px",
            borderRadius: "50%",
            backgroundColor: "rgba(255, 255, 255, 0.2)",
            border: "2px solid rgba(255, 255, 255, 0.4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "26px",
            flexShrink: 0
          }}
          animate={{
            y: [0, -6, 0]
          }}
          transition={{
            duration: 2.0,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          🚀
        </motion.div>
      </div>

      <div style={{
        fontSize: "11px",
        textTransform: "uppercase",
        letterSpacing: "0.08em",
        fontWeight: "bold",
        backgroundColor: "rgba(0, 0, 0, 0.2)",
        padding: "6px 12px",
        borderRadius: "8px",
        alignSelf: "flex-start",
        zIndex: 1
      }}>
        Mission Goal: Unlock Systems Thinker Stage
      </div>
    </motion.div>
  );
}
