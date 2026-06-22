// components/professor-ai/AIProfessor.jsx

import React from "react";
import { useProfessorSession } from "./ProfessorSession.jsx";
import { buildResponsePlan } from "./ConversationEngine.js";
import { determineStrategy } from "./TeachingStrategyEngine.js";
import ProfessorAvatar from "./ProfessorAvatar.jsx";
import ProfessorControls from "./ProfessorControls.jsx";
import MemoryPanel from "./MemoryPanel.jsx";
import TeachingPanel from "./TeachingPanel.jsx";
import ConversationTimeline from "./ConversationTimeline.jsx";
import ProfessorWorkspace from "./ProfessorWorkspace.jsx";
import ConversationBubble from "./ConversationBubble.jsx";
import AnalogyPanel from "./AnalogyPanel.jsx";
import StoryPanel from "./StoryPanel.jsx";
import TradeoffPanel from "./TradeoffPanel.jsx";
import ChallengePanel from "./ChallengePanel.jsx";
import MisconceptionPanel from "./MisconceptionPanel.jsx";
import SocraticPanel from "./SocraticPanel.jsx";

export default function AIProfessor() {
  const {
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
    setAvatarState
  } = useProfessorSession();

  const handleSendMessage = (text) => {
    // 1. Add user message
    addMessage(text, "Apprentice");
    setAvatarState("Thinking");

    // 2. Process query in engine
    setTimeout(() => {
      const plan = buildResponsePlan(text, mode, memory);
      const activeStrat = determineStrategy(65, memory.confidence, plan.intent);

      setStrategy(activeStrat);
      setActiveTopic(plan.topic);
      changeMode(plan.mode);

      // 3. Generate professor text response
      let responseText = "";
      if (plan.intent === "ANALOGY") {
        responseText = `Let's break down "${plan.topic}" using a simple mental model. Check out the Analogy Panel! It explains how the concept functions without diving straight into complex syntax. What do you think about this analogy?`;
      } else if (plan.intent === "STORY") {
        responseText = `History is the greatest teacher. Look at the Stories Panel; it outlines Stripe/Netflix's real outages. We built this codebase in response to those exact failures.`;
      } else if (plan.intent === "TRADEOFF") {
        responseText = `In architecture, there are no solutions—only tradeoffs. Check the Tradeoff Panel. What resource budget are you willing to compromise for scalability here?`;
      } else if (plan.intent === "CHALLENGE") {
        responseText = `Time to test your systems thinking. I've loaded a scenario drill in the Challenge Panel. How would you solve this under pressure?`;
      } else if (plan.intent === "DEBUG") {
        responseText = `We have an active incident context. Let's trace the metrics, isolate the failing region, and initiate a replica promotive failover.`;
      } else {
        responseText = `Interesting question about ${plan.topic}. Let's examine it Socratically. Look at the Socratic inquiry prompts in the Socratic Panel. What constraint dominates your mind?`;
      }

      // 4. Add professor response
      addMessage(responseText, "Professor");
      setAvatarState("Teaching");

      setTimeout(() => {
        setAvatarState("Listening");
      }, 2000);
    }, 1200);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px", width: "100%" }}>
      {/* Banner */}
      <div className="card" style={{
        padding: "16px 20px",
        backgroundColor: "var(--surface)",
        borderLeft: "4px solid var(--brand)",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
      }}>
        <div>
          <span style={{ fontSize: "11px", color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
            Experience Layer
          </span>
          <h2 style={{ margin: "2px 0 0 0", fontSize: "18px", fontFamily: "Fraunces" }}>
            Socratic Systems Design Mentor (AI Professor)
          </h2>
        </div>
        <span className="pill" style={{ backgroundColor: "var(--brand-soft)", color: "var(--brand-2)", fontWeight: "bold" }}>
          Active Mode: {mode.name}
        </span>
      </div>

      {/* Main Dashboard Layout */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))",
        gap: "24px"
      }} className="ways-grid">
        
        {/* Left Column (Avatar, Controls, memory timelines) */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <div className="card" style={{ padding: "20px", display: "flex", justifyContent: "center" }}>
            <ProfessorAvatar state={avatarState} />
          </div>
          <ProfessorControls activeMode={mode} onChangeMode={changeMode} />
          <MemoryPanel memory={memory} />
          <TeachingPanel strategy={strategy} />
          <ConversationTimeline messages={messages} />
        </div>

        {/* Right Column (Dialogue bubble, Workspace, Concept cards) */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <ProfessorWorkspace onSendMessage={handleSendMessage} />

          {messages.length > 0 && (
            <ConversationBubble
              type={strategy}
              title={`Feynman dialogue on: ${activeTopic.toUpperCase()}`}
              text={messages[messages.length - 1].text}
            />
          )}

          <AnalogyPanel topic={activeTopic} />
          <StoryPanel topic={activeTopic} />
          <TradeoffPanel topic={activeTopic} />
          <ChallengePanel topic={activeTopic} />
          <MisconceptionPanel query={messages[messages.length - 2]?.text || ""} />
          <SocraticPanel topic={activeTopic} />
        </div>

      </div>
    </div>
  );
}
