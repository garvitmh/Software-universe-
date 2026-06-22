"use client";

import React, { useState, useEffect } from "react";
import { useUniverse } from "../universe/UniverseContext";
import { evaluateAllJourneys } from "./JourneyController";

// Subcomponents
import JourneySidebar from "./JourneySidebar";
import JourneyProgress from "./JourneyProgress";
import StepCard from "./StepCard";
import JourneyNarrator from "./JourneyNarrator";

export default function JourneyMode() {
  const { state } = useUniverse();
  const [activeJourneyId, setActiveJourneyId] = useState("beginner");
  const [selectedStepId, setSelectedStepId] = useState(null);

  // Evaluate progress based on current context state
  const rawJourneysProgress = evaluateAllJourneys(state);

  // Enrich steps with current learner mastery levels
  const journeysProgress = {};
  Object.keys(rawJourneysProgress).forEach(key => {
    const jp = rawJourneysProgress[key];
    const stepsWithMastery = jp.steps.map(step => {
      let currentMastery = 0;
      if (step.concept) {
        currentMastery = state.learner?.mastery?.[step.concept] || 0;
      }
      return {
        ...step,
        currentMastery
      };
    });
    journeysProgress[key] = {
      ...jp,
      steps: stepsWithMastery
    };
  });

  const activeJourney = journeysProgress[activeJourneyId];

  // Auto-select active step when journey changes
  useEffect(() => {
    if (activeJourney) {
      const activeStep = activeJourney.steps[activeJourney.activeStepIndex];
      setSelectedStepId(activeStep ? activeStep.id : null);
    }
  }, [activeJourneyId]);

  const selectedStep = activeJourney?.steps.find(s => s.id === selectedStepId);

  return (
    <div style={{
      display: "flex",
      gap: "28px",
      alignItems: "stretch",
      width: "100%"
    }} className="ways-grid">
      {/* Sidebar: Lists journeys and progress */}
      <div style={{ flexShrink: 0 }}>
        <JourneySidebar
          journeysProgress={journeysProgress}
          activeJourneyId={activeJourneyId}
          onSelect={setActiveJourneyId}
        />
      </div>

      {/* Main Content Area */}
      <div style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        gap: "24px",
        minWidth: 0 // Prevents grid blowouts
      }}>
        {/* Journey Header & Progress Meter */}
        <JourneyProgress progress={activeJourney} />

        {/* Horizontal step map timeline */}
        <div className="card" style={{
          padding: "24px",
          display: "flex",
          flexDirection: "column",
          gap: "16px",
          overflow: "hidden"
        }}>
          <div>
            <span className="eyebrow" style={{ color: activeJourney?.color }}>Timeline Map</span>
            <h3 style={{ margin: "2px 0 0 0", fontSize: "18px", color: "var(--ink)" }}>Journey Steps</h3>
          </div>

          <div style={{
            display: "flex",
            gap: "20px",
            overflowX: "auto",
            padding: "10px 4px 16px 4px",
            position: "relative",
            alignItems: "stretch"
          }} className="no-scrollbar">
            
            {activeJourney?.steps.map((step, index) => {
              const isSelected = step.id === selectedStepId;
              
              return (
                <React.Fragment key={step.id}>
                  {/* Step Node Card */}
                  <div style={{ flex: "1 0 200px" }}>
                    <StepCard
                      step={step}
                      isSelected={isSelected}
                      onClick={() => setSelectedStepId(step.id)}
                    />
                  </div>

                  {/* Connector lines between cards */}
                  {index < activeJourney.steps.length - 1 && (
                    <div style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      alignSelf: "center",
                      padding: "0 4px"
                    }}>
                      <div style={{
                        width: "24px",
                        height: "3px",
                        backgroundColor: step.completed ? activeJourney.color : "var(--hairline-2)",
                        borderRadius: "1.5px",
                        opacity: step.completed ? 1 : 0.4
                      }} />
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* Narrative / Mentorship Dialogue Guidance */}
        <JourneyNarrator
          selectedStep={selectedStep}
          currentJourneyColor={activeJourney?.color}
        />
      </div>
    </div>
  );
}
