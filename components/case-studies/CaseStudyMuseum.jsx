"use client";

import React, { useState, useMemo } from "react";
import { useCaseStudyMuseumState } from "./useCaseStudyMuseum";

// Subcomponents
import CompanyCard from "./CompanyCard";
import CaseStudyPlayer from "./CaseStudyPlayer";
import CompanyComparisonPanel from "./CompanyComparisonPanel";
import MuseumMap from "./MuseumMap";

export default function CaseStudyMuseum() {
  const museum = useCaseStudyMuseumState();
  const {
    selectedCompanyId,
    selectedCompany,
    compareIds,
    activeTimelineIndex,
    isPlayingTimeline,
    playbackSpeed,
    allCompanies,
    selectCompany,
    toggleCompare,
    resetComparison,
    setTimelineIndex,
    togglePlayTimeline,
    setPlaybackSpeed
  } = museum;

  const [searchQuery, setSearchQuery] = useState("");
  const [activeEra, setActiveEra] = useState("ALL");

  const eras = ["ALL", "2001 - 2005", "2008 - 2012", "2014 - 2018", "2015 - Present"];

  const filteredCompanies = useMemo(() => {
    return allCompanies.filter((c) => {
      const matchesSearch = searchQuery === "" ||
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.originalProblem.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesEra = activeEra === "ALL" || c.era === activeEra;
      return matchesSearch && matchesEra;
    });
  }, [allCompanies, searchQuery, activeEra]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px", width: "100%" }}>
      {/* Page Header */}
      <div className="card" style={{ padding: "20px 24px", display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: "16px" }}>
        <div>
          <span className="eyebrow" style={{ color: "var(--brand)" }}>Case Studies Exhibit</span>
          <h2 style={{ margin: "2px 0 0 0", fontSize: "24px", fontFamily: "Fraunces" }}>
            Enterprise Case Study Museum
          </h2>
          <p style={{ margin: "4px 0 0 0", fontSize: "13px", color: "var(--muted)", maxWidth: "720px" }}>
            Step inside real history. Explore the architecture transformations of global tech platforms.
            Analyze the failures, trace their timelines, and draw direct engineering lessons for the Burger Farm monorepo.
          </p>
        </div>
      </div>

      {/* Interactive Museum Floor Map */}
      <MuseumMap selectedId={selectedCompanyId} onSelect={selectCompany} />

      {/* Search and Era Filters */}
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
          placeholder="🔍 Search company exhibits (e.g. Netflix, Stripe)..."
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
            outline: "none"
          }}
        />

        {/* Era filters */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
          {eras.map((era) => (
            <button
              key={era}
              onClick={() => setActiveEra(era)}
              style={{
                padding: "6px 12px",
                borderRadius: "8px",
                fontSize: "11px",
                fontWeight: "700",
                cursor: "pointer",
                background: activeEra === era ? "var(--brand)" : "var(--surface)",
                color: activeEra === era ? "#fff" : "var(--muted)",
                border: `1px solid ${activeEra === era ? "var(--brand)" : "var(--hairline)"}`,
                transition: "all 0.15s ease"
              }}
            >
              {era}
            </button>
          ))}
        </div>
      </div>

      {/* Main split work-view */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "minmax(320px, 4fr) minmax(320px, 8fr)",
        gap: "24px"
      }} className="museum-split-grid">
        
        {/* Left Column: Exhibit Cards list */}
        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }} className="museum-cards-list">
          <div style={{ fontSize: "11px", fontWeight: "700", color: "var(--muted)", textTransform: "uppercase" }}>
            Exhibits Directory ({filteredCompanies.length})
          </div>
          {filteredCompanies.length === 0 ? (
            <div style={{ padding: "40px", textAlign: "center", color: "var(--faint)", fontSize: "13px" }}>
              No company exhibits match your filters.
            </div>
          ) : (
            filteredCompanies.map((c) => (
              <CompanyCard
                key={c.id}
                company={c}
                isSelected={selectedCompanyId === c.id}
                isComparing={compareIds.includes(c.id)}
                onSelect={selectCompany}
                onToggleCompare={toggleCompare}
              />
            ))
          )}
        </div>

        {/* Right Column: Case Study Timeline & Panels */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }} className="museum-details-column">
          <CaseStudyPlayer
            company={selectedCompany}
            activeTimelineIndex={activeTimelineIndex}
            onTimelineChange={setTimelineIndex}
            isPlaying={isPlayingTimeline}
            togglePlay={togglePlayTimeline}
            speed={playbackSpeed}
            setSpeed={setPlaybackSpeed}
          />
        </div>

      </div>

      {/* Side-by-side comparison matrix */}
      <CompanyComparisonPanel
        compareIds={compareIds}
        toggleCompare={toggleCompare}
        resetComparison={resetComparison}
      />
    </div>
  );
}
