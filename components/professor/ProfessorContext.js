"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { CONCEPT_SCHEMA } from "./ConceptSchema";
import { useProfessorState } from "./ProfessorState";

const ProfessorContext = createContext();

export function ProfessorProvider({ children, initialWorldSlug }) {
  const state = useProfessorState(initialWorldSlug);
  const [questionScores, setQuestionScores] = useState({});

  // Fetch score history from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem("sw_professor_transcript");
      if (stored) {
        setQuestionScores(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Failed to load transcript from localStorage:", e);
    }
  }, []);

  const persistScore = (questionId, difficulty, score) => {
    const updated = {
      ...questionScores,
      [questionId]: {
        difficulty,
        score,
        timestamp: new Date().toISOString()
      }
    };
    setQuestionScores(updated);
    try {
      localStorage.setItem("sw_professor_transcript", JSON.stringify(updated));
    } catch (e) {
      console.error("Failed to save transcript to localStorage:", e);
    }
  };

  const currentConcept = CONCEPT_SCHEMA[state.currentWorld] || null;

  return (
    <ProfessorContext.Provider
      value={{
        ...state,
        selectedTab: state.activeTab,
        setSelectedTab: state.setActiveTab,
        currentConcept,
        questionScores,
        persistScore
      }}
    >
      {children}
    </ProfessorContext.Provider>
  );
}

export function useProfessor() {
  const context = useContext(ProfessorContext);
  if (!context) {
    throw new Error("useProfessor must be used within a ProfessorProvider");
  }
  return context;
}
