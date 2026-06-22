export const LEVELS = {
  BEGINNER: "Beginner",
  INTERMEDIATE: "Intermediate",
  SENIOR: "Senior",
  STAFF: "Staff",
  ARCHITECT: "Architect"
};

const LEVEL_ORDER = [
  LEVELS.BEGINNER,
  LEVELS.INTERMEDIATE,
  LEVELS.SENIOR,
  LEVELS.STAFF,
  LEVELS.ARCHITECT
];

export function getNextDifficulty(currentDifficulty, isCorrect) {
  let idx = LEVEL_ORDER.indexOf(currentDifficulty);
  if (idx === -1) idx = 0;

  if (isCorrect) {
    // Increment difficulty on correct answer
    return LEVEL_ORDER[Math.min(idx + 1, LEVEL_ORDER.length - 1)];
  } else {
    // Decrement difficulty on incorrect answer
    return LEVEL_ORDER[Math.max(idx - 1, 0)];
  }
}
