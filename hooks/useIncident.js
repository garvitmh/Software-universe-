"use client";

import { useIncidentContext } from "../components/incidents/IncidentContext";

export default function useIncident() {
  const context = useIncidentContext();
  return {
    incident: context.incident,
    status: context.status,
    activeStep: context.activeStep,
    steps: context.steps,
    isPlaying: context.isPlaying,
    speed: context.speed,
    selectIncident: context.selectIncident,
    setPlaybackStep: context.setPlaybackStep,
    togglePlay: context.togglePlay,
    stepForward: context.stepForward,
    stepBack: context.stepBack,
    resetSimulation: context.resetSimulation,
    setSpeed: context.setSpeed,
    rootCause: context.rootCause,
    regrets: context.regrets,
    mitigations: context.mitigations,
    blastRadius: context.blastRadius,
    postmortemTemplate: context.postmortemTemplate,
    postmortem: context.postmortem,
    submitPostmortem: context.submitPostmortem
  };
}
