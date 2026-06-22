"use client";

import React from "react";
import SpanTree from "./SpanTree";
import { useIncidentContext } from "../IncidentContext";

export default function TraceExplorer() {
  const { traces } = useIncidentContext();

  // Build a hierarchical trace from the flat list
  const buildTree = (spans) => {
    if (!spans || spans.length === 0) return [];

    const roots = [];
    // For simulation purposes, nest spans based on index (each becomes child of previous)
    const processedSpans = spans.map(s => ({ ...s, children: [] }));

    processedSpans.forEach((span, idx) => {
      if (idx === 0) {
        roots.push(span);
      } else {
        // Nest under the previous span (simulates a call chain)
        processedSpans[idx - 1].children = [span];
      }
    });

    return roots;
  };

  const tree = buildTree(traces);
  const totalDuration = traces.reduce((sum, s) => sum + (s.duration || 0), 0);
  const hasFailure = traces.some(s => s.status === "FAILED" || s.status === "TIMEOUT");

  return (
    <div className="card" style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "14px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "8px" }}>
        <div>
          <span className="eyebrow" style={{ color: "var(--muted)" }}>Jaeger-style</span>
          <h3 style={{ margin: "2px 0 0 0", fontSize: "16px" }}>Trace Explorer</h3>
          <p style={{ margin: "4px 0 0 0", fontSize: "12px", color: "var(--faint)" }}>
            Request propagation tree — {traces.length} spans
          </p>
        </div>
        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          <span style={{ fontSize: "12px", fontFamily: "JetBrains Mono, monospace", fontWeight: "700", color: "var(--muted)" }}>
            Total: {totalDuration}ms
          </span>
          {hasFailure && (
            <span style={{
              fontSize: "11px", fontWeight: "700", color: "var(--pop-pink)",
              background: "rgba(255,77,141,0.1)", padding: "2px 8px", borderRadius: "999px",
              border: "1px solid rgba(255,77,141,0.3)"
            }}>
              ⚠ Failures detected
            </span>
          )}
        </div>
      </div>

      {/* Trace header row */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr auto",
        padding: "6px 10px",
        borderRadius: "6px",
        background: "var(--bg-2)",
        fontSize: "10px",
        fontWeight: "700",
        color: "var(--muted)",
        textTransform: "uppercase",
        letterSpacing: "0.07em"
      }}>
        <span>Span / Service</span>
        <span>Duration</span>
      </div>

      {/* Span tree */}
      <div style={{
        border: "1px solid var(--hairline)",
        borderRadius: "8px",
        overflow: "hidden",
        background: "var(--surface-warm)"
      }}>
        {tree.map((root, idx) => (
          <SpanTree key={idx} span={root} depth={0} />
        ))}
      </div>
    </div>
  );
}
