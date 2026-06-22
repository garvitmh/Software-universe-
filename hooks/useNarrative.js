"use client";

import { useUniverse } from "../components/universe/UniverseContext";

export function useNarrative() {
  const { cognitiveState } = useUniverse();
  return {
    narrative: cognitiveState.narrative
  };
}
