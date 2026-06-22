// components/professor-ai/ProfessorModes.js

export const PROFESSOR_MODES = {
  mentor: {
    id: "mentor",
    name: "Mentor",
    icon: "🧙‍♂️",
    greeting: "Welcome back, apprentice. I'm here to guide your growth. Let's look at the bigger picture.",
    tagline: "Career growth & systems level design mentor",
    focus: "growth and architecture career pathing"
  },
  teacher: {
    id: "teacher",
    name: "Feynman Teacher",
    icon: "🍎",
    greeting: "Let's make this simple. If you can't explain it to a ten-year-old, you don't understand it.",
    tagline: "Explains concepts via simple analogies",
    focus: "analogies and conceptual simplifying"
  },
  architect: {
    id: "architect",
    name: "Staff Architect",
    icon: "📐",
    greeting: "Everything is a tradeoff. Show me your constraints and we will pick a tradeoff.",
    tagline: "Tradeoffs, budgets, complexity, and scale",
    focus: "engineering tradeoffs and metrics"
  },
  debugger: {
    id: "debugger",
    name: "SRE Incident Lead",
    icon: "🚨",
    greeting: "There is an active SEV1. Let's trace the spans, find the error metrics, and failover.",
    tagline: "Outages, telemetry logs, and incident playbooks",
    focus: "incident response and SRE diagnostics"
  },
  reviewer: {
    id: "reviewer",
    name: "Code Reviewer",
    icon: "🔍",
    greeting: "Let's audit the code repository. I will review dependencies, coupling, and single failure points.",
    tagline: "PR reviews, coupling, cohesion, and patterns",
    focus: "code audits and pattern alignment"
  },
  storyteller: {
    id: "storyteller",
    name: "Folklore Storyteller",
    icon: "📖",
    greeting: "Sit down. Let me tell you how Stripe got duplicate charge scars, and what they built.",
    tagline: "Industry history, outages, and lessons",
    focus: "historical outages and engineering folklore"
  },
  socratic: {
    id: "socratic",
    name: "Socratic Guide",
    icon: "💭",
    greeting: "I won't give you the answer. But I will ask the questions that help you find it.",
    tagline: "Socratic questioning & constraint discoveries",
    focus: "guided discovery and constraint checks"
  }
};
