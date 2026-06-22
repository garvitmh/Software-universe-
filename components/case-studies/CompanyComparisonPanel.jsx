"use client";

import React from "react";
import { COMPANIES_DB } from "./CompanySchema";

export default function CompanyComparisonPanel({ compareIds, toggleCompare, resetComparison }) {
  const company1 = COMPANIES_DB.find((c) => c.id === compareIds[0]);
  const company2 = COMPANIES_DB.find((c) => c.id === compareIds[1]);

  if (compareIds.length < 2) {
    return (
      <div className="card" style={{ padding: "24px 28px", display: "flex", flexDirection: "column", gap: "12px", alignItems: "center", justifyContent: "center", minHeight: "180px", textAlign: "center" }}>
        <span style={{ fontSize: "36px" }}>🏛️</span>
        <h3 style={{ margin: "4px 0 0 0", fontSize: "16px", fontWeight: "700" }}>Compare Case Studies</h3>
        <p style={{ margin: "4px 0 0 0", fontSize: "12px", color: "var(--muted)", maxWidth: "420px" }}>
          Select the checkbox on the top right of any two company exhibits above to compare their scaling hurdles side-by-side.
        </p>
      </div>
    );
  }

  return (
    <div className="card" style={{ padding: "24px 28px", display: "flex", flexDirection: "column", gap: "20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <span className="eyebrow" style={{ color: "var(--brand)" }}>Scale Comparison</span>
          <h3 style={{ margin: "2px 0 0 0", fontSize: "18px" }}>Compare Architectures</h3>
        </div>
        <button
          onClick={resetComparison}
          style={{
            background: "var(--bg-2)", border: "1px solid var(--hairline)", borderRadius: "8px",
            padding: "6px 12px", fontSize: "11px", fontWeight: "700", cursor: "pointer",
            color: "var(--muted)"
          }}
        >
          Clear Comparison
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }} className="comparison-columns">
        {/* Column 1 */}
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <div style={{ borderBottom: "2px solid var(--brand)", paddingBottom: "6px" }}>
            <span style={{ fontSize: "11px", color: "var(--muted)", textTransform: "uppercase" }}>Exhibit A</span>
            <h4 style={{ margin: 0, fontSize: "16px", fontWeight: "800", color: "var(--brand-2)" }}>{company1.name}</h4>
          </div>
          <div>
            <strong style={{ fontSize: "12px", color: "var(--ink)" }}>Active scale:</strong>
            <p style={{ margin: "2px 0 0 0", fontSize: "12px", color: "var(--muted)", lineHeight: "1.4" }}>{company1.scale}</p>
          </div>
          <div>
            <strong style={{ fontSize: "12px", color: "var(--ink)" }}>Primary Problem:</strong>
            <p style={{ margin: "2px 0 0 0", fontSize: "12px", color: "var(--muted)", lineHeight: "1.4" }}>{company1.originalProblem}</p>
          </div>
          <div>
            <strong style={{ fontSize: "12px", color: "var(--ink)" }}>Outage Failures:</strong>
            <p style={{ margin: "2px 0 0 0", fontSize: "12px", color: "var(--muted)", lineHeight: "1.4" }}>{company1.failures}</p>
          </div>
          <div>
            <strong style={{ fontSize: "12px", color: "var(--ink)" }}>Target Architecture:</strong>
            <p style={{ margin: "2px 0 0 0", fontSize: "12px", color: "var(--muted)", lineHeight: "1.4" }}>{company1.architecture}</p>
          </div>
          <div>
            <strong style={{ fontSize: "12px", color: "var(--ink)" }}>Post-Adoption Regrets:</strong>
            <p style={{ margin: "2px 0 0 0", fontSize: "12px", color: "var(--muted)", lineHeight: "1.4" }}>{company1.regrets}</p>
          </div>
        </div>

        {/* Column 2 */}
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <div style={{ borderBottom: "2px solid var(--teal)", paddingBottom: "6px" }}>
            <span style={{ fontSize: "11px", color: "var(--muted)", textTransform: "uppercase" }}>Exhibit B</span>
            <h4 style={{ margin: 0, fontSize: "16px", fontWeight: "800", color: "var(--teal)" }}>{company2.name}</h4>
          </div>
          <div>
            <strong style={{ fontSize: "12px", color: "var(--ink)" }}>Active scale:</strong>
            <p style={{ margin: "2px 0 0 0", fontSize: "12px", color: "var(--muted)", lineHeight: "1.4" }}>{company2.scale}</p>
          </div>
          <div>
            <strong style={{ fontSize: "12px", color: "var(--ink)" }}>Primary Problem:</strong>
            <p style={{ margin: "2px 0 0 0", fontSize: "12px", color: "var(--muted)", lineHeight: "1.4" }}>{company2.originalProblem}</p>
          </div>
          <div>
            <strong style={{ fontSize: "12px", color: "var(--ink)" }}>Outage Failures:</strong>
            <p style={{ margin: "2px 0 0 0", fontSize: "12px", color: "var(--muted)", lineHeight: "1.4" }}>{company2.failures}</p>
          </div>
          <div>
            <strong style={{ fontSize: "12px", color: "var(--ink)" }}>Target Architecture:</strong>
            <p style={{ margin: "2px 0 0 0", fontSize: "12px", color: "var(--muted)", lineHeight: "1.4" }}>{company2.architecture}</p>
          </div>
          <div>
            <strong style={{ fontSize: "12px", color: "var(--ink)" }}>Post-Adoption Regrets:</strong>
            <p style={{ margin: "2px 0 0 0", fontSize: "12px", color: "var(--muted)", lineHeight: "1.4" }}>{company2.regrets}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
