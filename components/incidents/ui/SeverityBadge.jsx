"use client";

import React from "react";
import { motion } from "framer-motion";

export default function SeverityBadge({ severity }) {
  const getBadgeStyles = () => {
    switch (severity) {
      case "SEV1":
        return {
          bg: "rgba(255, 77, 141, 0.15)",
          color: "var(--pop-pink)",
          border: "1px solid rgba(255, 77, 141, 0.3)",
          label: "SEV1 - Critical Outage"
        };
      case "SEV2":
        return {
          bg: "rgba(249, 115, 22, 0.15)",
          color: "#F97316",
          border: "1px solid rgba(249, 115, 22, 0.3)",
          label: "SEV2 - Major Outage"
        };
      case "SEV3":
        return {
          bg: "var(--amber-soft)",
          color: "var(--amber)",
          border: "1px solid rgba(133, 79, 11, 0.2)",
          label: "SEV3 - Active Degradation"
        };
      case "SEV4":
        return {
          bg: "rgba(45, 125, 246, 0.15)",
          color: "var(--pop-blue)",
          border: "1px solid rgba(45, 125, 246, 0.3)",
          label: "SEV4 - Minor Issue"
        };
      default:
        return {
          bg: "var(--bg-2)",
          color: "var(--muted)",
          border: "1px solid var(--hairline)",
          label: severity || "Unknown"
        };
    }
  };

  const styles = getBadgeStyles();

  if (severity === "SEV1") {
    return (
      <div style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}>
        <motion.span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            padding: "5px 12px",
            borderRadius: "999px",
            fontSize: "12px",
            fontWeight: "700",
            backgroundColor: styles.bg,
            color: styles.color,
            border: styles.border,
            textTransform: "uppercase",
            letterSpacing: "0.05em"
          }}
          animate={{
            boxShadow: [
              "0 0 0 0px rgba(255, 77, 141, 0)",
              "0 0 0 6px rgba(255, 77, 141, 0.25)",
              "0 0 0 0px rgba(255, 77, 141, 0)"
            ]
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <span
            style={{
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              backgroundColor: "var(--pop-pink)",
              display: "inline-block"
            }}
          />
          {styles.label}
        </motion.span>
      </div>
    );
  }

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "6px",
        padding: "5px 12px",
        borderRadius: "999px",
        fontSize: "12px",
        fontWeight: "700",
        backgroundColor: styles.bg,
        color: styles.color,
        border: styles.border,
        textTransform: "uppercase",
        letterSpacing: "0.05em"
      }}
    >
      <span
        style={{
          width: "8px",
          height: "8px",
          borderRadius: "50%",
          backgroundColor: styles.color,
          display: "inline-block"
        }}
      />
      {styles.label}
    </span>
  );
}
