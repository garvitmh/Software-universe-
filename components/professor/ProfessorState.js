import { useState } from "react";
import { createInitialLearner, updateLearner } from "./LearnerModel";

export function useProfessorState(initialWorldSlug) {
  const [learner, setLearner] = useState(createInitialLearner());
  const [currentWorld, setCurrentWorld] = useState(initialWorldSlug);
  const [activeTab, setActiveTab] = useState("mentalModel");

  const handleQuestionAnswered = (question, isCorrect) => {
    setLearner((prev) => updateLearner(prev, question, isCorrect));
  };

  return {
    learner,
    currentWorld,
    setCurrentWorld,
    activeTab,
    setActiveTab,
    handleQuestionAnswered,
    explainSimplerFlag: learner.flags.includes("EXPLAIN_SIMPLER"),
    currentDifficulty: learner.currentLevel
  };
}
