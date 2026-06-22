"use client";

import { useIncidentContext } from "../components/incidents/IncidentContext";

export default function useAlerts() {
  const context = useIncidentContext();
  return {
    alerts: context.alerts
  };
}
