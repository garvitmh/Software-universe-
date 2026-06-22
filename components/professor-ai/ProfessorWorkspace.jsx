// components/professor-ai/ProfessorWorkspace.jsx

import React, { useState } from "react";

export default function ProfessorWorkspace({ onSendMessage }) {
  const [input, setInput] = useState("");

  const suggestions = [
    "Explain queues using an analogy",
    "What are database replica tradeoffs?",
    "Tell the Stripe idempotency story",
    "Challenge me on cache outages",
    "Why does eventual consistency lag?"
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    onSendMessage(input);
    setInput("");
  };

  return (
    <div className="card" style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "16px" }}>
      <div>
        <span className="eyebrow" style={{ color: "var(--brand)" }}>Interface</span>
        <h3 style={{ margin: "2px 0 0 0" }}>Interactive Telemetry Terminal</h3>
      </div>

      {/* Suggested prompts list */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
        {suggestions.map((sug, idx) => (
          <button
            key={idx}
            onClick={() => onSendMessage(sug)}
            style={{
              padding: "4px 10px",
              fontSize: "10px",
              fontWeight: "600",
              borderRadius: "20px",
              backgroundColor: "var(--bg-2)",
              border: "1px solid var(--hairline-2)",
              cursor: "pointer",
              transition: "all 0.2s ease"
            }}
          >
            {sug}
          </button>
        ))}
      </div>

      {/* Chat input form */}
      <form onSubmit={handleSubmit} style={{ display: "flex", gap: "8px" }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about queues, caching, tradeoffs, or request a challenge..."
          style={{
            flex: 1,
            padding: "10px 14px",
            borderRadius: "8px",
            border: "1px solid var(--hairline-2)",
            backgroundColor: "var(--bg-2)",
            fontSize: "12px",
            outline: "none"
          }}
        />
        <button
          type="submit"
          style={{
            padding: "8px 16px",
            borderRadius: "8px",
            backgroundColor: "var(--brand)",
            color: "#ffffff",
            border: "none",
            fontWeight: "700",
            fontSize: "12px",
            cursor: "pointer"
          }}
        >
          SEND
        </button>
      </form>
    </div>
  );
}
