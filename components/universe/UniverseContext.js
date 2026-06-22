"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { think } from "./UniverseBrain";

const UniverseContext = createContext();

const INITIAL_MOCK_STATE = {
  learner: {
    confidence: 65,
    mastery: {
      jwt: 85,
      queues: 70,
      retries: 82,
      databases: 35,
      observability: 45,
      caching: 30,
      deployments: 20
    },
    history: [
      { theme: "observability" },
      { theme: "reliability" }
    ],
    milestones: ["FIRST_TRADEOFF", "FIRST_CONSTRAINT"],
    misconceptions: ["KAFKA_IS_ALWAYS_BETTER"]
  },
  codebase: {
    files: new Array(15),
    bottlenecks: ["Primary PostgreSQL write pool saturation"]
  },
  constraints: {
    dominant: "TEAM_SIZE (2 developers)"
  },
  runtime: {
    latency: 680,
    p95: 1400,
    p99: 4500,
    queueDepth: 120,
    errorRate: 3.2,
    alerts: ["Postgres Write CPU Spike SEV1"],
    traces: [
      { id: "span-1", name: "Checkout API Route", duration: 1200, status: "SUCCESS" }
    ],
    criticalPath: ["Checkout Screen", "Prisma Database transaction writer"]
  },
  traffic: 15000,
  recommendation: "BullMQ + PostgreSQL Read Replicas"
};

export function UniverseProvider({ children }) {
  const [state, setState] = useState(INITIAL_MOCK_STATE);
  const [cognitiveState, setCognitiveState] = useState(null);

  // Run the UniverseBrain think processor whenever state changes
  useEffect(() => {
    const output = think(state);
    setCognitiveState(output);
  }, [state]);

  const recordMilestone = (milestoneName) => {
    setState(prev => {
      const current = prev.learner.milestones || [];
      if (current.includes(milestoneName)) return prev;
      return {
        ...prev,
        learner: {
          ...prev.learner,
          milestones: [...current, milestoneName]
        }
      };
    });
  };

  const resolveMisconception = (misconceptionId) => {
    setState(prev => {
      const current = prev.learner.misconceptions || [];
      return {
        ...prev,
        learner: {
          ...prev.learner,
          misconceptions: current.filter(m => m !== misconceptionId)
        }
      };
    });
  };

  const updateConceptMastery = (conceptId, newMastery) => {
    setState(prev => ({
      ...prev,
      learner: {
        ...prev.learner,
        mastery: {
          ...prev.learner.mastery,
          [conceptId]: Math.max(0, Math.min(100, newMastery))
        }
      }
    }));
  };

  const updateTraffic = (newTraffic) => {
    setState(prev => ({
      ...prev,
      traffic: newTraffic
    }));
  };

  // Provide initial values while brain compiles on first render
  const value = {
    state,
    cognitiveState: cognitiveState || think(state),
    recordMilestone,
    resolveMisconception,
    updateConceptMastery,
    updateTraffic
  };

  return (
    <UniverseContext.Provider value={value}>
      {children}
    </UniverseContext.Provider>
  );
}

export function useUniverse() {
  const context = useContext(UniverseContext);
  if (!context) {
    throw new Error("useUniverse must be used within a UniverseProvider");
  }
  return context;
}
