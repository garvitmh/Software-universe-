const assert = require("assert");
const { EVOLUTION_STAGES } = require("../components/evolution/EvolutionSchema.js");

console.log("=== STARTING ARCHITECTURE EVOLUTION PLAYER TESTS ===");

try {
  // Test 1: Verify stages list is not empty and has correct amount of stages
  assert.ok(Array.isArray(EVOLUTION_STAGES), "EVOLUTION_STAGES must be an array");
  assert.strictEqual(EVOLUTION_STAGES.length, 6, "Must define exactly 6 scaling stages (10 to 1M users)");
  console.log("✓ Test 1 Passed: 6 stages defined successfully.");

  // Test 2: Check required schema fields on each stage
  const requiredKeys = [
    "id", "label", "userCount", "rps", "architecture", "constraint",
    "bottleneck", "story", "capabilities", "cost", "tradeoffs",
    "pressures", "diff", "topology"
  ];

  EVOLUTION_STAGES.forEach((stage, idx) => {
    requiredKeys.forEach((key) => {
      assert.ok(stage[key] !== undefined, `Stage [${idx}] is missing required property: ${key}`);
    });

    // Check cost keys
    const costKeys = ["infra", "operational", "cognitive"];
    costKeys.forEach((key) => {
      assert.ok(typeof stage.cost[key] === "number", `Stage [${idx}] cost.${key} must be a number`);
    });

    // Check tradeoff keys
    const tradeoffKeys = ["gain", "loss", "complexity"];
    tradeoffKeys.forEach((key) => {
      assert.ok(stage.tradeoffs[key], `Stage [${idx}] tradeoffs.${key} must be present`);
    });

    // Check pressures keys
    const pressureKeys = ["traffic", "latency", "availability", "cost", "teamSize"];
    pressureKeys.forEach((key) => {
      assert.ok(typeof stage.pressures[key] === "number", `Stage [${idx}] pressures.${key} must be a number`);
    });

    // Check topology structure
    assert.ok(Array.isArray(stage.topology.nodes), `Stage [${idx}] topology.nodes must be an array`);
    assert.ok(Array.isArray(stage.topology.links), `Stage [${idx}] topology.links must be an array`);

    stage.topology.nodes.forEach((node) => {
      assert.ok(node.id, `Stage [${idx}] node has missing id`);
      assert.ok(node.label, `Stage [${idx}] node has missing label`);
      assert.ok(typeof node.x === "number" && typeof node.y === "number", `Stage [${idx}] node x/y must be numbers`);
    });

    stage.topology.links.forEach((link) => {
      assert.ok(link.from && link.to, `Stage [${idx}] link must have from & to`);
    });
  });
  console.log("✓ Test 2 Passed: Schema fields and types validated successfully.");

  // Test 3: Validate user progression values increase monotonically
  for (let i = 1; i < EVOLUTION_STAGES.length; i++) {
    const prev = EVOLUTION_STAGES[i - 1];
    const curr = EVOLUTION_STAGES[i];
    assert.ok(curr.userCount > prev.userCount, `User count must increase monotonically (stage ${curr.label} vs ${prev.label})`);
    assert.ok(curr.cost.infra >= prev.cost.infra, `Infra cost score should increase as scale increases`);
  }
  console.log("✓ Test 3 Passed: Monotonic load progression validated successfully.");

  console.log("\n=== ALL TESTS PASSED SUCCESSFULLY! ===");
  process.exit(0);
} catch (error) {
  console.error("\n❌ TESTS FAILED!");
  console.error(error.message);
  process.exit(1);
}
