const assert = require("assert");
const { PATTERNS_DB } = require("../components/patterns/PatternSchema.js");

console.log("=== STARTING PATTERN ATLAS DATA VERIFICATION TESTS ===");

try {
  // Test 1: Validate list size is exactly 16
  assert.ok(Array.isArray(PATTERNS_DB), "PATTERNS_DB must be an array");
  assert.strictEqual(PATTERNS_DB.length, 16, "Must define exactly 16 patterns");
  console.log("✓ Test 1 Passed: Exactly 16 design patterns defined in the schema.");

  // Test 2: Check required schema fields on each pattern
  const requiredKeys = [
    "id", "name", "category", "complexity", "popularity", "useCases",
    "problem", "solution", "tradeoffs", "failureModes", "alternatives",
    "companies", "evolution", "relatedPatterns"
  ];

  PATTERNS_DB.forEach((pat, idx) => {
    requiredKeys.forEach((key) => {
      assert.ok(pat[key] !== undefined, `Pattern [${idx}] '${pat.name}' is missing required property: ${key}`);
    });

    // Check tradeoff keys
    const tradeoffKeys = ["gain", "loss", "complexity"];
    tradeoffKeys.forEach((key) => {
      assert.ok(pat.tradeoffs[key], `Pattern '${pat.name}' tradeoffs.${key} must be present`);
    });

    // Check failureModes structure
    assert.ok(Array.isArray(pat.failureModes), `Pattern '${pat.name}' failureModes must be an array`);
    pat.failureModes.forEach((fm, fIdx) => {
      assert.ok(fm.title && fm.description, `Pattern '${pat.name}' failureModes[${fIdx}] must have title & description`);
    });

    // Check companies structure
    assert.ok(Array.isArray(pat.companies), `Pattern '${pat.name}' companies must be an array`);
    pat.companies.forEach((c, cIdx) => {
      assert.ok(c.name && c.rationale, `Pattern '${pat.name}' companies[${cIdx}] must have name & rationale`);
    });

    // Check relatedPatterns reference validity
    pat.relatedPatterns.forEach((relId) => {
      const found = PATTERNS_DB.some((p) => p.id === relId);
      assert.ok(found, `Pattern '${pat.name}' references invalid related pattern ID: ${relId}`);
    });
  });
  console.log("✓ Test 2 Passed: All required keys, nested structures, and relationship IDs are valid.");

  // Test 3: Validate categories coverage
  const allowedCategories = ["Reliability", "Resilience", "Messaging", "Performance", "Scaling", "Consistency", "Data"];
  PATTERNS_DB.forEach((pat) => {
    assert.ok(allowedCategories.includes(pat.category), `Pattern '${pat.name}' category '${pat.category}' is invalid`);
  });
  console.log("✓ Test 3 Passed: All pattern categories map to the allowed taxonomy.");

  console.log("\n=== ALL TESTS PASSED SUCCESSFULLY! ===");
  process.exit(0);
} catch (error) {
  console.error("\n❌ TESTS FAILED!");
  console.error(error.message);
  process.exit(1);
}
