// scratch/test_replay.js

async function runTest() {
  console.log("=== STARTING REPLAY SYSTEM ENGINE TESTS ===");

  const { EVENT_TYPES, MOCK_HISTORY_EVENTS } = await import('file:///c:/Desktop/Software Universe/components/replay/ReplaySchema.js');
  const { buildTimeline, detectBreakthroughs, detectRepeatedMistakes, detectTransformationMoments, buildNarrative } = await import('file:///c:/Desktop/Software Universe/components/replay/ReplayEngine.js');

  // 1. Verify Event count
  console.log("\n1. Verifying schema events...");
  console.log("   Total history events:", MOCK_HISTORY_EVENTS.length);
  if (MOCK_HISTORY_EVENTS.length < 5) {
    throw new Error(`Expected at least 5 history events, got ${MOCK_HISTORY_EVENTS.length}`);
  }

  // 2. Verify chronological sorting
  console.log("\n2. Verifying buildTimeline sorting...");
  const timeline = buildTimeline(MOCK_HISTORY_EVENTS);
  for (let i = 0; i < timeline.length - 1; i++) {
    const t1 = new Date(timeline[i].timestamp);
    const t2 = new Date(timeline[i + 1].timestamp);
    if (t1 > t2) {
      throw new Error(`Events not sorted chronologically at index ${i}`);
    }
  }
  console.log("   Events successfully sorted.");
  console.log("   First event date:", new Date(timeline[0].timestamp).toLocaleDateString());
  console.log("   Last event date:", new Date(timeline[timeline.length - 1].timestamp).toLocaleDateString());

  // 3. Verify breakthroughs
  console.log("\n3. Verifying detectBreakthroughs...");
  const breakthroughs = detectBreakthroughs(timeline);
  console.log("   Total breakthroughs detected:", breakthroughs.length);
  breakthroughs.forEach(b => {
    if (b.type !== EVENT_TYPES.BREAKTHROUGH) {
      throw new Error(`Incorrect type detected as breakthrough: ${b.type}`);
    }
  });

  // 4. Verify repeated mistakes
  console.log("\n4. Verifying detectRepeatedMistakes...");
  const repeated = detectRepeatedMistakes(timeline);
  console.log("   Concepts with repeated mistakes count:", repeated.length);
  repeated.forEach(rep => {
    console.log(`   - Concept "${rep.concept}": ${rep.count} occurrences`);
    if (rep.count <= 1) {
      throw new Error(`Expected count > 1 for repeated mistake, got ${rep.count}`);
    }
  });

  // 5. Verify transformations
  console.log("\n5. Verifying detectTransformationMoments...");
  const transformations = detectTransformationMoments(timeline);
  console.log("   Total transformations detected:", transformations.length);

  // 6. Verify narrative synthesis
  console.log("\n6. Verifying buildNarrative...");
  const story = buildNarrative(timeline);
  console.log("   Synthesized Narrative biography length:", story.length);
  if (story.length < 50) {
    throw new Error("Narrative biography is too short.");
  }
  console.log("   Biography snippet:\n   ", story.substring(0, 160) + "...");

  console.log("\n=== ALL REPLAY SYSTEM ENGINE TESTS PASSED ===");
}

runTest().catch(err => {
  console.error("Test failed:", err);
  process.exit(1);
});
