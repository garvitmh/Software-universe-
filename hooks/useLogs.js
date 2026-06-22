"use client";

import { useIncidentContext } from "../components/incidents/IncidentContext";

export default function useLogs() {
  const context = useIncidentContext();
  return {
    logs: context.logs
  };
}
