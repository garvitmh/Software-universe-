"use client";

import { useIncidentContext } from "../components/incidents/IncidentContext";

export default function useRecoveryTimeline() {
  const context = useIncidentContext();
  return {
    recovery: context.recovery
  };
}
