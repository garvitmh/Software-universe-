// components/professor-ai/ProfessorAvatar.jsx

import React from "react";
import { motion } from "framer-motion";

export default function ProfessorAvatar({ state = "Listening" }) {
  // Determine eye and mouth shapes based on state
  const getAvatarFace = () => {
    switch (state) {
      case "Thinking":
        return {
          eyes: "👁️ 👁️",
          mouth: "⚫",
          bg: "var(--brand-soft)",
          border: "2px dashed var(--brand)",
          emoji: "🤔"
        };
      case "Teaching":
        return {
          eyes: "🎓 🎓",
          mouth: "👄",
          bg: "var(--brand-soft)",
          border: "2.5px solid var(--brand)",
          emoji: "🧙‍♂️"
        };
      case "Celebrating":
        return {
          eyes: "✨ ✨",
          mouth: "😆",
          bg: "var(--teal-soft)",
          border: "2px solid var(--teal)",
          emoji: "🎉"
        };
      case "Curious":
        return {
          eyes: "🧐 🧐",
          mouth: "o",
          bg: "var(--amber-soft)",
          border: "2px solid var(--amber)",
          emoji: "🧐"
        };
      case "Listening":
      default:
        return {
          eyes: "👀",
          mouth: "〰️",
          bg: "var(--bg-2)",
          border: "1px solid var(--hairline-2)",
          emoji: "💬"
        };
    }
  };

  const face = getAvatarFace();

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
      {/* Floating Animated Head */}
      <motion.div
        style={{
          width: "80px",
          height: "80px",
          borderRadius: "50%",
          backgroundColor: face.bg,
          border: face.border,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          boxShadow: "0 8px 24px rgba(0, 0, 0, 0.06)"
        }}
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        <span style={{ fontSize: "28px" }}>{face.emoji}</span>

        {/* Pulse ring when teaching/listening */}
        {(state === "Listening" || state === "Teaching") && (
          <motion.div
            style={{
              position: "absolute",
              width: "100%",
              height: "100%",
              borderRadius: "50%",
              border: "1px solid var(--brand)",
              opacity: 0.4
            }}
            animate={{ scale: [1, 1.3, 1], opacity: [0.4, 0, 0.4] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        )}
      </motion.div>
      <span className="eyebrow" style={{ color: "var(--brand)", fontSize: "11px", fontWeight: "700" }}>
        STATUS: {state.toUpperCase()}
      </span>
    </div>
  );
}
