"use client";

import React from "react";
import { motion } from "framer-motion";

export default function ArchitectureDiffPanel({ diff }) {
  return (
    <div className="card" style={{ padding: "20px 24px", display: "flex", flexDirection: "column", gap: "16px" }}>
      <div>
        <span className="eyebrow" style={{ color: "var(--brand)" }}>Infrastructure Changes</span>
        <h3 style={{ margin: "2px 0 0 0", fontSize: "18px" }}>Architecture Delta</h3>
        <p style={{ margin: "4px 0 0 0", fontSize: "12px", color: "var(--muted)" }}>
          The components added, deprecated, or introduced as risk vectors in this version.
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
        {/* Added Items (Green Diff Style) */}
        <div>
          <span style={{ fontSize: "11px", fontWeight: "700", color: "var(--muted)", textTransform: "uppercase" }}>
            +++ Added Components
          </span>
          <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginTop: "6px" }}>
            {diff.added.length === 0 ? (
              <div style={{ fontSize: "12px", color: "var(--faint)", fontStyle: "italic", paddingLeft: "10px" }}>
                No new components added.
              </div>
            ) : (
              diff.added.map((item) => (
                <div
                  key={item}
                  style={{
                    fontFamily: "JetBrains Mono, monospace",
                    fontSize: "12px",
                    background: "rgba(16, 185, 129, 0.06)",
                    border: "1px solid rgba(16, 185, 129, 0.15)",
                    color: "rgb(16, 185, 129)",
                    padding: "6px 12px",
                    borderRadius: "6px",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px"
                  }}
                >
                  <span style={{ fontWeight: "bold" }}>+</span>
                  {item}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Removed Items (Red Diff Style) */}
        <div>
          <span style={{ fontSize: "11px", fontWeight: "700", color: "var(--muted)", textTransform: "uppercase" }}>
            --- Removed / Deprecated
          </span>
          <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginTop: "6px" }}>
            {diff.removed.length === 0 ? (
              <div style={{ fontSize: "12px", color: "var(--faint)", fontStyle: "italic", paddingLeft: "10px" }}>
                No components deprecated.
              </div>
            ) : (
              diff.removed.map((item) => (
                <div
                  key={item}
                  style={{
                    fontFamily: "JetBrains Mono, monospace",
                    fontSize: "12px",
                    background: "rgba(239, 68, 68, 0.06)",
                    border: "1px solid rgba(239, 68, 68, 0.15)",
                    color: "rgb(239, 68, 68)",
                    padding: "6px 12px",
                    borderRadius: "6px",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px"
                  }}
                >
                  <span style={{ fontWeight: "bold" }}>-</span>
                  {item}
                </div>
              ))
            )}
          </div>
        </div>

        {/* New Risks Section */}
        <div>
          <span style={{ fontSize: "11px", fontWeight: "700", color: "var(--muted)", textTransform: "uppercase" }}>
            ⚠️ Newly Introduced Risks
          </span>
          <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginTop: "6px" }}>
            {diff.risks.length === 0 ? (
              <div style={{ fontSize: "12px", color: "var(--faint)", fontStyle: "italic", paddingLeft: "10px" }}>
                No new major operational risks.
              </div>
            ) : (
              diff.risks.map((risk) => (
                <div
                  key={risk}
                  style={{
                    fontSize: "12px",
                    background: "rgba(245, 158, 11, 0.05)",
                    border: "1px solid rgba(245, 158, 11, 0.15)",
                    color: "var(--amber)",
                    padding: "6px 12px",
                    borderRadius: "6px",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px"
                  }}
                >
                  <span style={{ fontSize: "14px" }}>⚠️</span>
                  {risk}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
