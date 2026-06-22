"use client";

import { useUniverse } from "../components/universe/UniverseContext";

export function useChallenges() {
  const { cognitiveState, recordMilestone } = useUniverse();
  return {
    challenges: cognitiveState.challenges,
    submitAnswer: (answerText) => {
      // Simulate checking if the answer references constraints/tradeoffs
      const containsConstraints = /constraint|team size|budget|developer/i.test(answerText);
      const containsTradeoffs = /tradeoff|gain|sacrifice|complexity/i.test(answerText);
      
      if (containsConstraints) {
        recordMilestone("FIRST_CONSTRAINT");
      }
      if (containsTradeoffs) {
        recordMilestone("FIRST_TRADEOFF");
      }
      return {
        success: true,
        unlockedConstraint: containsConstraints,
        unlockedTradeoff: containsTradeoffs
      };
    }
  };
}
