"use client";

import React, { useState, useRef, useEffect } from "react";
import LogEntry from "./LogEntry";
import { useIncidentContext } from "../IncidentContext";

const LEVELS = ["ALL", "INFO", "WARN", "ERROR", "CRITICAL"];

export default function LogConsole() {
  const { logs } = useIncidentContext();
  const [filter, setFilter] = useState("ALL");
  const [search, setSearch] = useState("");
  const [autoScroll, setAutoScroll] = useState(true);
  const bottomRef = useRef(null);

  const filtered = logs.filter(log => {
    const levelMatch = filter === "ALL" || log.level?.toUpperCase() === filter;
    const searchMatch = !search || log.message?.toLowerCase().includes(search.toLowerCase()) || log.service?.toLowerCase().includes(search.toLowerCase());
    return levelMatch && searchMatch;
  });

  useEffect(() => {
    if (autoScroll && bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [filtered.length, autoScroll]);

  return (
    <div className="card" style={{ display: "flex", flexDirection: "column", gap: "0", overflow: "hidden" }}>
      {/* Header */}
      <div style={{
        padding: "14px 16px",
        background: "#0D1117",
        borderBottom: "1px solid #21262D",
        display: "flex",
        gap: "12px",
        flexWrap: "wrap",
        alignItems: "center"
      }}>
        <div>
          <span style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.1em", color: "#7D8590", fontWeight: "700" }}>Kibana</span>
          <h3 style={{ margin: "0", fontSize: "14px", color: "#E6EDF3", fontFamily: "JetBrains Mono, monospace" }}>
            📟 Log Console
          </h3>
        </div>
        <div style={{ flex: 1, display: "flex", gap: "8px", flexWrap: "wrap", marginLeft: "auto" }}>
          {/* Search */}
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search logs..."
            style={{
              background: "#161B22", border: "1px solid #30363D", borderRadius: "6px",
              color: "#E6EDF3", padding: "4px 10px", fontSize: "12px",
              fontFamily: "JetBrains Mono, monospace", outline: "none", minWidth: "160px"
            }}
          />
          {/* Level filter buttons */}
          <div style={{ display: "flex", gap: "4px" }}>
            {LEVELS.map(l => (
              <button
                key={l}
                onClick={() => setFilter(l)}
                style={{
                  padding: "3px 8px", borderRadius: "5px", fontSize: "10px",
                  fontWeight: "700", cursor: "pointer", border: "1px solid transparent",
                  fontFamily: "JetBrains Mono, monospace",
                  background: filter === l ? (
                    l === "ERROR" || l === "CRITICAL" ? "rgba(255,77,141,0.2)" :
                    l === "WARN" ? "rgba(249,115,22,0.2)" :
                    l === "INFO" ? "rgba(45,125,246,0.2)" : "#21262D"
                  ) : "transparent",
                  color: filter === l ? (
                    l === "ERROR" || l === "CRITICAL" ? "var(--pop-pink)" :
                    l === "WARN" ? "#F97316" :
                    l === "INFO" ? "var(--pop-blue)" : "#E6EDF3"
                  ) : "#7D8590",
                  borderColor: filter === l ? "currentColor" : "transparent"
                }}
              >
                {l}
              </button>
            ))}
          </div>
          {/* Auto-scroll toggle */}
          <button
            onClick={() => setAutoScroll(p => !p)}
            style={{
              padding: "3px 8px", borderRadius: "5px", fontSize: "10px", cursor: "pointer",
              background: autoScroll ? "rgba(47,191,113,0.15)" : "transparent",
              color: autoScroll ? "var(--pop-lime)" : "#7D8590",
              border: `1px solid ${autoScroll ? "rgba(47,191,113,0.3)" : "transparent"}`,
              fontWeight: "700"
            }}
          >
            {autoScroll ? "⬇ AUTO" : "MANUAL"}
          </button>
        </div>
      </div>

      {/* Log body */}
      <div style={{
        background: "#0D1117",
        padding: "10px 14px",
        height: "280px",
        overflowY: "auto",
        display: "flex",
        flexDirection: "column",
        gap: "0",
        scrollbarWidth: "thin",
        scrollbarColor: "#30363D #0D1117"
      }}>
        {filtered.length === 0 ? (
          <div style={{ color: "#7D8590", fontFamily: "JetBrains Mono, monospace", fontSize: "12px", margin: "auto", textAlign: "center" }}>
            <div style={{ fontSize: "24px", marginBottom: "8px" }}>📭</div>
            No logs match your filter.
          </div>
        ) : (
          filtered.map((log, idx) => (
            <LogEntry key={idx} log={log} index={filtered.length - 1 - idx} />
          ))
        )}
        <div ref={bottomRef} />
      </div>

      {/* Footer */}
      <div style={{
        padding: "6px 14px",
        background: "#161B22",
        borderTop: "1px solid #21262D",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
      }}>
        <span style={{ fontSize: "10px", color: "#7D8590", fontFamily: "JetBrains Mono, monospace" }}>
          {filtered.length} / {logs.length} entries
        </span>
        <span style={{ fontSize: "10px", color: "#7D8590" }}>
          {filter !== "ALL" && `Filtered by: ${filter}`}
        </span>
      </div>
    </div>
  );
}
