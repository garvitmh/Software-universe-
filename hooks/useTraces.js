"use client";

import { useIncidentContext } from "../components/incidents/IncidentContext";

export default function useTraces() {
  const context = useIncidentContext();
  return {
    traces: context.traces
  };
}
