// scratch/test_planetscale.js

async function runTest() {
  console.log("=== STARTING PLANET SCALE SIMULATOR TESTS ===");

  const { REGIONS, LATENCY_MATRIX, SCALES, SCENARIOS } = await import('file:///c:/Desktop/Software Universe/components/planet-scale/PlanetSchema.js');

  // 1. Verify Regions
  console.log("\n1. Verifying Regions configuration...");
  const regionKeys = Object.keys(REGIONS);
  console.log("   Total regions:", regionKeys.length);
  if (regionKeys.length !== 7) {
    throw new Error(`Expected 7 regions, got ${regionKeys.length}`);
  }
  const requiredRegions = ["us-east", "us-west", "europe", "india", "singapore", "japan", "australia"];
  requiredRegions.forEach(r => {
    if (!REGIONS[r]) {
      throw new Error(`Missing region configuration for ${r}`);
    }
    console.log(`   - Region ${r}: coord (${REGIONS[r].x}%, ${REGIONS[r].y}%)`);
  });

  // 2. Verify Latency Matrix
  console.log("\n2. Verifying Latency Matrix...");
  requiredRegions.forEach(r1 => {
    requiredRegions.forEach(r2 => {
      const lat = LATENCY_MATRIX[r1]?.[r2];
      if (typeof lat !== 'number') {
        throw new Error(`Missing latency mapping from ${r1} to ${r2}`);
      }
    });
  });
  console.log("   Latency matrix fully formed and populated.");
  console.log(`   US-East to Australia: ${LATENCY_MATRIX["us-east"]["australia"]}ms`);
  console.log(`   US-West to Japan: ${LATENCY_MATRIX["us-west"]["japan"]}ms`);

  // 3. Verify Scales
  console.log("\n3. Verifying Scales...");
  console.log("   Scale steps count:", SCALES.length);
  if (SCALES.length !== 5) {
    throw new Error(`Expected 5 growth scale steps, got ${SCALES.length}`);
  }
  SCALES.forEach(s => {
    console.log(`   - Scale ${s.id}: multiplier x${s.multiplier}`);
  });

  // 4. Verify Scenarios
  console.log("\n4. Verifying Scenarios...");
  const scenarioKeys = Object.keys(SCENARIOS);
  console.log("   Total Scenarios:", scenarioKeys.length);
  const requiredScenarios = ["normal", "black_friday", "payment_outage", "regional_failure", "ddos", "cable_cut", "database_failure", "cache_failure", "worker_failure"];
  requiredScenarios.forEach(sc => {
    if (!SCENARIOS[sc]) {
      throw new Error(`Missing scenario: ${sc}`);
    }
    console.log(`   - Scenario ${sc}: multiplier x${SCENARIOS[sc].trafficMultiplier}`);
  });

  console.log("\n=== ALL PLANET SCALE SIMULATOR TESTS PASSED ===");
}

runTest().catch(err => {
  console.error("Test failed:", err);
  process.exit(1);
});
