// components/professor-ai/ProfessorSession.jsx

import React, { useState, useEffect } from "react";
import { loadMemory, saveMemory } from "./ProfessorMemory.js";
import { PROFESSOR_MODES } from "./ProfessorModes.js";
import { determineStrategy } from "./TeachingStrategyEngine.js";

export function useProfessorSession() {
  const [mode, setMode] = useState(PROFESSOR_MODES.mentor);
  const [memory, setMemory] = useState(DEFAULT_MEMORY_STATE);
  const [strategy, setStrategy] = useState("GENERAL");
  const [activeTopic, setActiveTopic] = useState("general");
  const [messages, setMessages] = useState([]);
  const [avatarState, setAvatarState] = useState("Listening");

  useEffect(() => {
    const mem = loadMemory();
    setMemory(mem);
  }, []);

  const changeMode = (newMode) => {
    setMode(newMode);
    setAvatarState("Curious");
    setTimeout(() => setAvatarState("Listening"), 1000);
  };

  const addMessage = (text, sender = "Apprentice") => {
    const newMsg = {
      sender,
      text,
      timestamp: new Date().toISOString(),
      mode: mode.id
    };
    setMessages(prev => [...prev, newMsg]);
  };

  return {
    mode,
    memory,
    strategy,
    activeTopic,
    messages,
    avatarState,
    changeMode,
    addMessage,
    setStrategy,
    setActiveTopic,
    setAvatarState,
    setMemory
  };
}

const DEFAULT_MEMORY_STATE = {
  favoriteTopics: ["queues", "latency", "idempotency"],
  misconceptions: [],
  breakthroughs: [],
  confidence: 72,
  architectMoments: [],
  curiosity: { paymentsCount: 0, scaleCount: 0, incidentsCount: 0 }
};
