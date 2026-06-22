"use client";

import React from "react";
import { usePatternAtlasState } from "./usePatternAtlas";

// Subcomponents
import PatternCard from "./PatternCard";
import PatternProblemPanel from "./PatternProblemPanel";
import PatternSolutionPanel from "./PatternSolutionPanel";
import PatternFailurePanel from "./PatternFailurePanel";
import PatternTradeoffMatrix from "./PatternTradeoffMatrix";
import PatternEvolutionPanel from "./PatternEvolutionPanel";
import PatternCompanyPanel from "./PatternCompanyPanel";
import PatternComparisonPanel from "./PatternComparisonPanel";
import PatternDecisionTree from "./PatternDecisionTree";
import PatternTimeline from "./PatternTimeline";
import PatternConnectionsGraph from "./PatternConnectionsGraph";
import PatternPlayground from "./PatternPlayground";

export default function PatternAtlas() {
  const atlas = usePatternAtlasState();
  const {
    selectedPatternId,
    selectedPattern,
    selectedCategory,
    searchQuery,
    compareIds,
    categories,
    filteredPatterns,
    selectPattern,
    setSelectedCategory,
    setSearchQuery,
    toggleCompare,
    resetComparison
  } = atlas;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px", width: "100%" }}>
      {/* Header */}
      <div className="card" style={{ padding: "20px 24px", display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: "16px" }}>
        <div>
          <span className="eyebrow" style={{ color: "var(--brand)" }}>Design Catalog</span>
          <h2 style={{ margin: "2px 0 0 0", fontSize: "24px", fontFamily: "Fraunces" }}>
            Distributed Systems Pattern Atlas
          </h2>
          <p style={{ margin: "4px 0 0 0", fontSize: "13px", color: "var(--muted)", maxWidth: "720px" }}>
            Explore the architectural blueprints of reliable systems. Understand patterns not as static definitions
            to memorize, but as contextual trade-off responses to database loads, latencies, and transaction locks.
          </p>
        </div>
      </div>

      {/* Flagship Sandbox Simulator (Always on top to engage learners) */}
      <PatternPlayground />

      {/* Search and Category Filters */}
      <div style={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "space-between",
        alignItems: "center",
        gap: "16px",
        background: "var(--bg-2)",
        padding: "16px 20px",
        borderRadius: "14px",
        border: "1px solid var(--hairline-2)"
      }}>
        {/* Search */}
        <input
          type="text"
          placeholder="🔍 Search patterns (e.g. caches, sagas, retries)..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            flex: "1",
            minWidth: "260px",
            background: "var(--surface)",
            border: "1px solid var(--hairline)",
            borderRadius: "10px",
            padding: "10px 14px",
            fontSize: "13px",
            color: "var(--ink)",
            outline: "none",
            transition: "border 0.2s"
          }}
        />

        {/* Categories filters */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              style={{
                padding: "6px 12px",
                borderRadius: "8px",
                fontSize: "11px",
                fontWeight: "700",
                cursor: "pointer",
                background: selectedCategory === cat ? "var(--brand)" : "var(--surface)",
                color: selectedCategory === cat ? "#fff" : "var(--muted)",
                border: `1px solid ${selectedCategory === cat ? "var(--brand)" : "var(--hairline)"}`,
                transition: "all 0.15s ease"
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Main split work-view */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "minmax(320px, 4fr) minmax(320px, 8fr)",
        gap: "24px"
      }} className="atlas-split-grid">
        
        {/* Left Column: List of Cards */}
        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }} className="atlas-cards-list">
          <div style={{ fontSize: "11px", fontWeight: "700", color: "var(--muted)", textTransform: "uppercase" }}>
            Available Blueprints ({filteredPatterns.length})
          </div>
          {filteredPatterns.length === 0 ? (
            <div style={{ padding: "40px", textAlign: "center", color: "var(--faint)", fontSize: "13px" }}>
              No patterns match your active filters.
            </div>
          ) : (
            filteredPatterns.map((pat) => (
              <PatternCard
                key={pat.id}
                pattern={pat}
                isSelected={selectedPatternId === pat.id}
                isComparing={compareIds.includes(pat.id)}
                onSelect={selectPattern}
                onToggleCompare={toggleCompare}
              />
            ))
          )}
        </div>

        {/* Right Column: Active Pattern Details */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }} className="atlas-details-column">
          {/* Title row */}
          <div style={{ borderBottom: "2px solid var(--hairline)", paddingBottom: "10px" }}>
            <span style={{
              fontSize: "10px", fontWeight: "700", textTransform: "uppercase",
              padding: "2px 8px", borderRadius: "999px", background: "var(--brand-soft)", color: "var(--brand-2)"
            }}>
              {selectedPattern.category} Blueprint
            </span>
            <h3 style={{ margin: "6px 0 0 0", fontSize: "22px", fontFamily: "Fraunces" }}>{selectedPattern.name}</h3>
          </div>

          {/* Problem / Solution Panels */}
          <PatternProblemPanel
            patternName={selectedPattern.name}
            problem={selectedPattern.problem}
          />
          <PatternSolutionPanel
            patternName={selectedPattern.name}
            solution={selectedPattern.solution}
          />

          {/* Tradeoffs Matrix */}
          <PatternTradeoffMatrix
            tradeoffs={selectedPattern.tradeoffs}
            failureModes={selectedPattern.failureModes}
          />

          {/* Evolution Progression */}
          <PatternEvolutionPanel
            patternName={selectedPattern.name}
            evolution={selectedPattern.evolution}
          />

          {/* Downstream Failures Caution */}
          <PatternFailurePanel
            patternName={selectedPattern.name}
            failureModes={selectedPattern.failureModes}
          />

          {/* Company Case Studies */}
          <PatternCompanyPanel companies={selectedPattern.companies} />
        </div>

      </div>

      {/* Side-by-side comparison matrix */}
      <PatternComparisonPanel
        compareIds={compareIds}
        toggleCompare={toggleCompare}
        resetComparison={resetComparison}
      />

      {/* Node relationships graph */}
      <PatternConnectionsGraph onSelectNode={selectPattern} />

      {/* Interactive Decision Assistant */}
      <PatternDecisionTree selectPattern={selectPattern} />

      {/* Adoption Scale Timeline */}
      <PatternTimeline />
    </div>
  );
}
