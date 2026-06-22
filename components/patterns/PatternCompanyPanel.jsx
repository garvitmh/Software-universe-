"use client";

import React from "react";
import { motion } from "framer-motion";

export default function PatternCompanyPanel({ companies }) {
  return (
    <div className="card" style={{ padding: "24px 28px", display: "flex", flexDirection: "column", gap: "16px" }}>
      <div>
        <span className="eyebrow" style={{ color: "var(--brand)" }}>Industry Practice</span>
        <h3 style={{ margin: "2px 0 0 0", fontSize: "18px" }}>Production Adoption</h3>
        <p style={{ margin: "4px 0 0 0", fontSize: "12px", color: "var(--muted)" }}>
          Real production rationales from global tech platforms.
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {companies.map((c) => (
          <div
            key={c.name}
            style={{
              padding: "16px",
              background: "var(--bg-2)",
              border: "1px solid var(--hairline)",
              borderRadius: "10px",
              display: "flex",
              alignItems: "flex-start",
              gap: "14px"
            }}
          >
            {/* Logo placeholder */}
            <div style={{
              width: "36px",
              height: "36px",
              borderRadius: "8px",
              background: "var(--brand)",
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: "bold",
              fontSize: "14px",
              flexShrink: 0
            }}>
              {c.name.substring(0, 2).toUpperCase()}
            </div>
            <div>
              <div style={{ fontSize: "13px", fontWeight: "800", color: "var(--ink)" }}>{c.name}</div>
              <p style={{ margin: "4px 0 0 0", fontSize: "12px", color: "var(--muted)", lineHeight: "1.5" }}>
                {c.rationale}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
