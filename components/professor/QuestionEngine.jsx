"use client";

import React, { useState, useEffect } from "react";
import { useProfessor } from "./ProfessorContext";
import QuestionHistory from "./QuestionHistory";
import { getMasteryLevel } from "./ConceptMasteryEngine";
import { generateNextQuestion } from "./QuestionGenerator";
import * as graph from "./KnowledgeGraph";

export default function QuestionEngine({ tintColors }) {
  const {
    currentConcept,
    currentWorld,
    currentDifficulty,
    handleQuestionAnswered,
    explainSimplerFlag,
    persistScore,
    learner
  } = useProfessor();

  const [selectedIdx, setSelectedIdx] = useState(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [activeQuestion, setActiveQuestion] = useState(null);

  const colors = tintColors[currentWorld] || { main: "var(--brand)", soft: "var(--brand-soft)", dark: "var(--brand-2)" };

  // Sync active question dynamically using the QuestionGenerator
  useEffect(() => {
    if (currentConcept && currentConcept.questions) {
      const nextPayload = generateNextQuestion(
        learner,
        learner.conceptMastery || {},
        graph,
        currentConcept
      );
      
      if (nextPayload && nextPayload.question) {
        setActiveQuestion(nextPayload.question);
      } else {
        setActiveQuestion(currentConcept.questions[0]);
      }
      
      // Reset state for new question
      setSelectedIdx(null);
      setHasSubmitted(false);
    }
  }, [currentDifficulty, currentConcept, learner]);

  if (!currentConcept || !activeQuestion) return null;

  const handleOptionClick = (idx) => {
    if (hasSubmitted) return;
    setSelectedIdx(idx);
  };

  const handleSubmit = () => {
    if (selectedIdx === null || hasSubmitted) return;
    setHasSubmitted(true);

    const isCorrect = selectedIdx === activeQuestion.answerIdx;
    
    // Save to transcript history
    persistScore(activeQuestion.id, currentDifficulty, isCorrect ? 1 : 0);

    // Update LearnerModel (which handles difficulty, confidence, streaks, history, flags)
    setTimeout(() => {
      handleQuestionAnswered(activeQuestion, isCorrect);
    }, 2500);
  };

  const isCorrect = selectedIdx === activeQuestion.answerIdx;

  const conceptMastery = learner.conceptMastery || {};
  const currentMasteryState = conceptMastery[currentWorld] || {
    mastery: 10,
    confidence: 30,
    attempts: 0,
    correctAnswers: 0,
    streak: 0
  };
  const levelBadge = getMasteryLevel(currentMasteryState.mastery);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {/* Concept Mastery Dashboard */}
      <div style={{
        padding: "16px",
        background: "var(--surface-2)",
        borderRadius: 12,
        border: "1px solid var(--hairline-2)",
        display: "flex",
        flexDirection: "column",
        gap: 12
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <span style={{ fontSize: 10, fontWeight: 600, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Concept Mastery
            </span>
            <span style={{ fontSize: 14, fontWeight: 700, color: "var(--ink)" }}>
              {currentConcept.name}
            </span>
          </div>
          <span style={{
            fontSize: 9.5,
            fontWeight: 800,
            padding: "3px 8px",
            borderRadius: 6,
            background: colors.main,
            color: "#11111B",
            boxShadow: `0 0 10px ${colors.main}33`
          }}>
            {levelBadge}
          </span>
        </div>

        {/* Dual Progress Bars */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          {/* Mastery Score */}
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, fontWeight: 600 }}>
              <span style={{ color: "var(--ink-2)" }}>Mastery Score</span>
              <span style={{ color: colors.main }}>{currentMasteryState.mastery}%</span>
            </div>
            <div style={{ height: 6, width: "100%", background: "var(--hairline)", borderRadius: 3, overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${currentMasteryState.mastery}%`, background: colors.main, transition: "width 0.4s ease-out" }} />
            </div>
          </div>

          {/* Confidence Score */}
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, fontWeight: 600 }}>
              <span style={{ color: "var(--ink-2)" }}>Confidence</span>
              <span style={{ color: "#3B82F6" }}>{currentMasteryState.confidence}%</span>
            </div>
            <div style={{ height: 6, width: "100%", background: "var(--hairline)", borderRadius: 3, overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${currentMasteryState.confidence}%`, background: "#3B82F6", transition: "width 0.4s ease-out" }} />
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div style={{ display: "flex", gap: 16, fontSize: 11, color: "var(--muted)", borderTop: "1px dashed var(--hairline-2)", paddingTop: 10 }}>
          <span>Attempts: <strong>{currentMasteryState.attempts}</strong></span>
          <span>Correct: <strong>{currentMasteryState.correctAnswers}</strong></span>
          <span>Streak: <strong>{currentMasteryState.streak} 🔥</strong></span>
        </div>

        {/* Recommendations */}
        {learner.recommendedConcepts && learner.recommendedConcepts.length > 0 && (
          <div style={{
            marginTop: 4,
            padding: "8px 10px",
            background: "rgba(245, 158, 11, 0.05)",
            border: "1px solid rgba(245, 158, 11, 0.15)",
            borderRadius: 8,
            fontSize: 11.5,
            color: "var(--amber)",
            display: "flex",
            flexDirection: "column",
            gap: 4
          }}>
            <span style={{ fontWeight: 700 }}>💡 Study Recommendations:</span>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {learner.recommendedConcepts.map(rec => (
                <span key={rec} style={{
                  padding: "1px 6px",
                  borderRadius: 4,
                  background: "rgba(245, 158, 11, 0.12)",
                  fontSize: 10,
                  fontWeight: 600,
                  textTransform: "uppercase"
                }}>
                  {rec}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {explainSimplerFlag && (
        <div style={{ padding: "12px", background: "rgba(243, 139, 168, 0.1)", border: "1px solid #F38BA8", borderRadius: 8, color: "#F38BA8", fontSize: 13, fontWeight: 600 }}>
          💡 It seems you might be struggling with this concept. The Professor recommends checking the <strong>Mental Model</strong> or <strong>Explain Simpler</strong> tabs!
        </div>
      )}
      
      {/* Quiz Card Header */}
      <div style={{ display: "flex", alignItems: "center", justifySpaceBetween: "space-between", justifyContent: "space-between", borderBottom: "1px solid var(--hairline)", paddingBottom: 8 }}>
        <h4 style={{ fontSize: 13, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--muted)", margin: 0 }}>
          Grill Me Interactive
        </h4>
        <div style={{ display: "flex", gap: 4 }}>
          {["Beginner", "Intermediate", "Senior", "Staff", "Architect"].map((diff) => (
            <span
              key={diff}
              style={{
                fontSize: 9,
                fontWeight: 700,
                padding: "2px 6px",
                borderRadius: 4,
                background: currentDifficulty === diff ? colors.main : "var(--surface)",
                color: currentDifficulty === diff ? "#11111B" : "var(--ink-2)",
                border: currentDifficulty === diff ? "none" : "1px solid var(--hairline)"
              }}
            >
              {diff}
            </span>
          ))}
        </div>
      </div>

      {/* Question Text */}
      <div style={{ fontSize: 14, fontWeight: 600, color: "var(--ink)", lineHeight: 1.5, fontFamily: "Inter" }}>
        {activeQuestion.text}
      </div>

      {/* Option Buttons List */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {activeQuestion.options.map((opt, idx) => {
          let btnStyle = {
            width: "100%",
            textAlign: "left",
            padding: "12px 14px",
            borderRadius: 10,
            border: "1px solid var(--hairline-2)",
            background: "var(--surface)",
            color: "var(--ink-2)",
            fontSize: 13,
            cursor: "pointer",
            transition: "all 0.15s",
            fontFamily: "Inter"
          };

          if (selectedIdx === idx) {
            btnStyle.borderColor = colors.main;
            btnStyle.background = colors.soft;
            btnStyle.color = colors.dark;
            btnStyle.fontWeight = 600;
          }

          if (hasSubmitted) {
            btnStyle.cursor = "default";
            if (idx === activeQuestion.answerIdx) {
              btnStyle.borderColor = "#A6E3A1"; // Green for correct answer
              btnStyle.background = "rgba(166, 227, 161, 0.08)";
              btnStyle.color = "#A6E3A1";
              btnStyle.fontWeight = 700;
            } else if (selectedIdx === idx) {
              btnStyle.borderColor = "#F38BA8"; // Red for chosen incorrect answer
              btnStyle.background = "rgba(243, 139, 168, 0.08)";
              btnStyle.color = "#F38BA8";
            }
          }

          return (
            <button
              key={idx}
              onClick={() => handleOptionClick(idx)}
              style={btnStyle}
              onMouseEnter={(e) => {
                if (!hasSubmitted && selectedIdx !== idx) {
                  e.currentTarget.style.borderColor = colors.main;
                  e.currentTarget.style.color = colors.dark;
                }
              }}
              onMouseLeave={(e) => {
                if (!hasSubmitted && selectedIdx !== idx) {
                  e.currentTarget.style.borderColor = "var(--hairline-2)";
                  e.currentTarget.style.color = "var(--ink-2)";
                }
              }}
            >
              <span style={{ marginRight: 8, opacity: 0.5 }}>{String.fromCharCode(65 + idx)}.</span>
              {opt}
            </button>
          );
        })}
      </div>

      {/* Action / Feedback row */}
      {!hasSubmitted ? (
        <button
          onClick={handleSubmit}
          disabled={selectedIdx === null}
          style={{
            width: "100%",
            padding: "10px",
            borderRadius: 8,
            border: "none",
            fontSize: 13,
            fontWeight: 700,
            cursor: selectedIdx === null ? "not-allowed" : "pointer",
            background: selectedIdx === null ? "var(--hairline-2)" : colors.main,
            color: selectedIdx === null ? "var(--muted)" : "#11111B",
            transition: "all 0.2s"
          }}
        >
          Submit Answer
        </button>
      ) : (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 8,
            padding: "12px 14px",
            borderRadius: 10,
            background: isCorrect ? "rgba(166, 227, 161, 0.04)" : "rgba(243, 139, 168, 0.04)",
            border: `1px solid ${isCorrect ? "#A6E3A1" : "#F38BA8"}`
          }}
        >
          <div style={{ fontSize: 13, fontWeight: 700, color: isCorrect ? "#A6E3A1" : "#F38BA8" }}>
            {isCorrect ? "🎉 CORRECT!" : "❌ INCORRECT"}
          </div>
          <div style={{ fontSize: 12.5, color: "var(--ink-2)", lineHeight: 1.5, fontFamily: "Inter" }}>
            {activeQuestion.explanation}
          </div>
          <div style={{ fontSize: 10, color: "var(--muted)", fontStyle: "italic", borderTop: "1px dashed var(--hairline-2)", paddingTop: 6 }}>
            {isCorrect ? "Updating Learner Model..." : "Updating Learner Model..."}
          </div>
        </div>
      )}

      {/* Cumulative attempts history panel */}
      <QuestionHistory tintColors={tintColors} />
    </div>
  );
}
