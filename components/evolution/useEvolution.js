"use client";

import { useState, useEffect, useRef } from "react";
import { EVOLUTION_STAGES } from "./EvolutionSchema";

export function useEvolutionState() {
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const timerRef = useRef(null);

  const currentStage = EVOLUTION_STAGES[currentStageIndex];
  const previousStage = currentStageIndex > 0 ? EVOLUTION_STAGES[currentStageIndex - 1] : null;

  const goNext = () => {
    setCurrentStageIndex((prev) => Math.min(prev + 1, EVOLUTION_STAGES.length - 1));
  };

  const goPrevious = () => {
    setCurrentStageIndex((prev) => Math.max(prev - 1, 0));
  };

  const jumpToStage = (stageIdOrIndex) => {
    if (typeof stageIdOrIndex === "number") {
      if (stageIdOrIndex >= 0 && stageIdOrIndex < EVOLUTION_STAGES.length) {
        setCurrentStageIndex(stageIdOrIndex);
      }
    } else {
      const idx = EVOLUTION_STAGES.findIndex((s) => s.id === stageIdOrIndex);
      if (idx !== -1) {
        setCurrentStageIndex(idx);
      }
    }
  };

  const resetPlayer = () => {
    setCurrentStageIndex(0);
    setIsPlaying(false);
  };

  const togglePlay = () => {
    setIsPlaying((prev) => !prev);
  };

  // Autoplay handler
  useEffect(() => {
    if (isPlaying) {
      const intervalTime = 6000 / speed; // 6 seconds per stage divided by speed
      timerRef.current = setInterval(() => {
        setCurrentStageIndex((prev) => {
          if (prev >= EVOLUTION_STAGES.length - 1) {
            setIsPlaying(false); // Stop playing at end
            return prev;
          }
          return prev + 1;
        });
      }, intervalTime);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isPlaying, speed]);

  return {
    currentStageIndex,
    currentStage,
    previousStage,
    isPlaying,
    speed,
    stagesCount: EVOLUTION_STAGES.length,
    stages: EVOLUTION_STAGES,
    goNext,
    goPrevious,
    jumpToStage,
    resetPlayer,
    togglePlay,
    setSpeed
  };
}
