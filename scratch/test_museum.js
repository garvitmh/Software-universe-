const assert = require("assert");
const { COMPANIES_DB } = require("../components/case-studies/CompanySchema.js");

console.log("=== STARTING CASE STUDY MUSEUM DATA VERIFICATION TESTS ===");

try {
  // Test 1: Validate list size is exactly 9
  assert.ok(Array.isArray(COMPANIES_DB), "COMPANIES_DB must be an array");
  assert.strictEqual(COMPANIES_DB.length, 9, "Must define exactly 9 company case studies");
  console.log("✓ Test 1 Passed: Exactly 9 company case studies defined in the schema.");

  // Test 2: Check required schema fields on each company
  const requiredKeys = [
    "id", "name", "logo", "era", "scale", "originalProblem", "failures",
    "architecture", "patterns", "tradeoffs", "regrets", "lessons",
    "burgerFarmRelevance", "timeline"
  ];

  COMPANIES_DB.forEach((co, idx) => {
    requiredKeys.forEach((key) => {
      assert.ok(co[key] !== undefined, `Company [${idx}] '${co.name}' is missing required property: ${key}`);
    });

    // Check tradeoff keys
    const tradeoffKeys = ["gain", "loss", "complexity"];
    tradeoffKeys.forEach((key) => {
      assert.ok(co.tradeoffs[key], `Company '${co.name}' tradeoffs.${key} must be present`);
    });

    // Check timeline structure
    assert.ok(Array.isArray(co.timeline), `Company '${co.name}' timeline must be an array`);
    co.timeline.forEach((event, eIdx) => {
      assert.ok(event.year && event.title && event.description, `Company '${co.name}' timeline[${eIdx}] must have year, title, and description`);
    });
  });
  console.log("✓ Test 2 Passed: All required keys, nested structures, and timeline items are valid.");

  // Test 3: Validate timeline order (chronological check)
  COMPANIES_DB.forEach((co) => {
    for (let i = 1; i < co.timeline.length; i++) {
      const prevYear = parseInt(co.timeline[i - 1].year, 10);
      const currYear = parseInt(co.timeline[i].year, 10);
      assert.ok(currYear >= prevYear, `Company '${co.name}' timeline events must be sorted chronologically`);
    }
  });
  console.log("✓ Test 3 Passed: Timeline event order is chronological.");

  console.log("\n=== ALL TESTS PASSED SUCCESSFULLY! ===");
  process.exit(0);
} catch (error) {
  console.error("\n❌ TESTS FAILED!");
  console.error(error.message);
  process.exit(1);
}
