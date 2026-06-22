"use client";

import { useUniverse } from "../components/universe/UniverseContext";

export function useArchitectMoments() {
  const { cognitiveState } = useUniverse();
  return {
    moments: cognitiveState.architectMoments
  };
}
