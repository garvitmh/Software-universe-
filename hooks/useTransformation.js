"use client";

import { useUniverse } from "../components/universe/UniverseContext";

export function useTransformation() {
  const { cognitiveState } = useUniverse();
  return {
    milestones: cognitiveState.transformations.milestones,
    significance: cognitiveState.transformations.significance
  };
}
