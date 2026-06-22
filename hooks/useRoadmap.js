"use client";

import { useUniverse } from "../components/universe/UniverseContext";

export function useRoadmap() {
  const { cognitiveState } = useUniverse();
  return {
    roadmap: cognitiveState.futureRoadmap
  };
}
