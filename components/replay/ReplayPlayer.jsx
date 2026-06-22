// components/replay/ReplayPlayer.jsx

import React from "react";
import SessionCard from "./SessionCard";
import MemoryCard from "./MemoryCard";
import MilestoneCard from "./MilestoneCard";
import { EVENT_TYPES } from "./ReplaySchema";

export default function ReplayPlayer({ event }) {
  if (!event) return null;

  switch (event.type) {
    case EVENT_TYPES.SESSION:
      return <SessionCard event={event} />;
    case EVENT_TYPES.QUESTION:
    case EVENT_TYPES.CURIOSITY:
    case EVENT_TYPES.MISTAKE:
    case EVENT_TYPES.MISCONCEPTION:
      return <MemoryCard event={event} />;
    case EVENT_TYPES.MILESTONE:
    case EVENT_TYPES.BREAKTHROUGH:
    case EVENT_TYPES.ARCHITECT_MOMENT:
    case EVENT_TYPES.TRANSFORMATION:
      return <MilestoneCard event={event} />;
    default:
      return (
        <div className="card" style={{ padding: "16px" }}>
          <h4>{event.title}</h4>
          <p>{event.description}</p>
        </div>
      );
  }
}
