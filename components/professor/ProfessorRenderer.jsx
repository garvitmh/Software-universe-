"use client";

import React from "react";
import { ProfessorProvider, useProfessor } from "./ProfessorContext";
import MentalModelPanel from "./MentalModelPanel";
import ExplainSimple from "./ExplainSimple";
import ExplainDeep from "./ExplainDeep";
import ShowFailures from "./ShowFailures";
import ShowAlternatives from "./ShowAlternatives";
import ShowTradeoffs from "./ShowTradeoffs";
import ShowGiants from "./ShowGiants";
import ShowBurgerFarmCode from "./ShowBurgerFarmCode";
import QuestionEngine from "./QuestionEngine";
import EvolutionStory from "./EvolutionStory";
import { motion, AnimatePresence } from "framer-motion";
import { 
  SparklesIcon, 
  BrainIcon, 
  CpuIcon, 
  AlertCircleIcon, 
  GitBranchIcon, 
  LineChartIcon, 
  BuildingIcon, 
  TerminalIcon, 
  FlameIcon, 
  ActivityIcon,
  GraduationCapIcon 
} from "@/components/ui/Icons";

function ProfessorDrawerContent() {
  const { selectedTab, setSelectedTab, currentConcept, currentWorld } = useProfessor();

  if (!currentConcept) return null;

  const tintColors = {
    brand: { main: "var(--brand)", soft: "var(--brand-soft)", dark: "var(--brand-2)" },
    amber: { main: "var(--amber)", soft: "rgba(245, 158, 11, 0.08)", dark: "#B45309" },
    teal: { main: "var(--teal)", soft: "var(--teal-soft)", dark: "#0F6E56" },
    purple: { main: "#8B5CF6", soft: "rgba(139, 92, 246, 0.08)", dark: "#5B21B6" },
    blue: { main: "#3B82F6", soft: "rgba(59, 130, 246, 0.08)", dark: "#1D4ED8" },
    rose: { main: "#F43F5E", soft: "rgba(244, 63, 94, 0.08)", dark: "#BE123C" },
    indigo: { main: "#6366F1", soft: "rgba(99, 102, 241, 0.08)", dark: "#4338CA" }
  };

  const colors = tintColors[currentWorld] || tintColors.brand;

  const tabsList = [
    { key: "mentalModel", label: "Mental Model", icon: SparklesIcon },
    { key: "simple", label: "Explain Simple", icon: BrainIcon },
    { key: "deep", label: "Explain Deep", icon: CpuIcon },
    { key: "failures", label: "Show Failures", icon: AlertCircleIcon },
    { key: "alternatives", label: "Alternatives", icon: GitBranchIcon },
    { key: "tradeoffs", label: "Tradeoffs", icon: LineChartIcon },
    { key: "giants", label: "Show Giants", icon: BuildingIcon },
    { key: "code", label: "Burger Code", icon: TerminalIcon },
    { key: "questions", label: "Grill Me", icon: FlameIcon },
    { key: "evolution", label: "Evolution Story", icon: ActivityIcon }
  ];

  const renderActiveTab = () => {
    switch (selectedTab) {
      case "mentalModel":
        return <MentalModelPanel tintColors={tintColors} />;
      case "simple":
        return <ExplainSimple tintColors={tintColors} />;
      case "deep":
        return <ExplainDeep tintColors={tintColors} />;
      case "failures":
        return <ShowFailures tintColors={tintColors} />;
      case "alternatives":
        return <ShowAlternatives tintColors={tintColors} />;
      case "tradeoffs":
        return <ShowTradeoffs tintColors={tintColors} />;
      case "giants":
        return <ShowGiants tintColors={tintColors} />;
      case "code":
        return <ShowBurgerFarmCode tintColors={tintColors} />;
      case "questions":
        return <QuestionEngine tintColors={tintColors} />;
      case "evolution":
        return <EvolutionStory tintColors={tintColors} />;
      default:
        return <MentalModelPanel tintColors={tintColors} />;
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 18,
        borderTop: "1px dashed var(--hairline-2)",
        paddingTop: 20,
        marginTop: "auto"
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <GraduationCapIcon size={20} style={{ color: colors.main }} />
        <h4 style={{ fontSize: 13.5, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--ink)", margin: 0 }}>
          Software Universe AI Professor
        </h4>
      </div>

      {/* Tabs Selector Bar */}
      <div
        style={{
          display: "flex",
          gap: 6,
          overflowX: "auto",
          paddingBottom: 6,
          scrollbarWidth: "none",
          msOverflowStyle: "none"
        }}
        className="professor-tabs-scroll"
      >
        {tabsList.map((tb) => {
          const isActive = selectedTab === tb.key;
          const IconComponent = tb.icon;
          return (
            <button
              key={tb.key}
              onClick={() => setSelectedTab(tb.key)}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "8px 12px",
                borderRadius: 8,
                fontSize: 12.5,
                fontWeight: 600,
                cursor: "pointer",
                border: isActive ? `1.5px solid ${colors.main}` : "1px solid var(--hairline-2)",
                background: isActive ? colors.soft : "var(--surface)",
                color: isActive ? colors.dark : "var(--ink-2)",
                transition: "all 0.2s",
                whiteSpace: "nowrap",
                flexShrink: 0
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.borderColor = colors.main;
                  e.currentTarget.style.color = colors.dark;
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.borderColor = "var(--hairline-2)";
                  e.currentTarget.style.color = "var(--ink-2)";
                }
              }}
            >
              <IconComponent size={14} />
              <span>{tb.label}</span>
            </button>
          );
        })}
      </div>

      {/* Dynamic Tab Content Viewer */}
      <div style={{ minHeight: 180, position: "relative" }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedTab}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.22, ease: "easeInOut" }}
          >
            {renderActiveTab()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

export default function ProfessorRenderer({ worldSlug }) {
  return (
    <ProfessorProvider initialWorldSlug={worldSlug}>
      <ProfessorDrawerContent />
    </ProfessorProvider>
  );
}
