// components/professor-ai/ConversationTimeline.jsx

import React from "react";
import ProfessorMessage from "./ProfessorMessage.jsx";

export default function ConversationTimeline({ messages = [] }) {
  return (
    <div className="card" style={{
      padding: "20px",
      display: "flex",
      flexDirection: "column",
      gap: "16px",
      maxHeight: "340px",
      overflowY: "auto"
    }}>
      <div>
        <span className="eyebrow" style={{ color: "var(--brand)" }}>Session Logs</span>
        <h3 style={{ margin: "2px 0 0 0" }}>Conversation Chronicle</h3>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
        {messages.length === 0 ? (
          <div style={{ fontSize: "11px", color: "var(--muted)", fontStyle: "italic", textAlign: "center" }}>
            Start typing below to populate the chat history timeline.
          </div>
        ) : (
          messages.map((msg, idx) => (
            <ProfessorMessage key={idx} msg={msg} />
          ))
        )}
      </div>
    </div>
  );
}
