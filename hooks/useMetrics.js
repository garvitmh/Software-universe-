"use client";

import { useIncidentContext } from "../components/incidents/IncidentContext";

export default function useMetrics() {
  const context = useIncidentContext();
  return {
    metrics: context.metrics,
    metricsHistory: context.metricsHistory
  };
}
