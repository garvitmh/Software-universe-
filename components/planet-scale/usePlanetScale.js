// components/planet-scale/usePlanetScale.js

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { REGIONS, LATENCY_MATRIX, SCALES, SCENARIOS } from "./PlanetSchema";

const PlanetScaleContext = createContext(null);

export function PlanetScaleProvider({ children }) {
  const [scale, setScale] = useState("10k"); // 10k, 100k, 1m, 10m, 100m
  const [activeScenario, setActiveScenario] = useState("normal");
  const [activeRegion, setActiveRegion] = useState("us-east");
  const [playbackState, setPlaybackState] = useState({ isPlaying: false, speed: 1, step: 0 });
  const [disasters, setDisasters] = useState([]); // Array of active disaster keys
  const [consistencyMode, setConsistencyMode] = useState("eventual"); // strong | eventual | read-your-writes
  const [cdnEnabled, setCdnEnabled] = useState(true);
  const [primaryRegion, setPrimaryRegion] = useState("us-east");

  // Dynamic simulation values computed on tick
  const [time, setTime] = useState(0);
  const [regionTelemetry, setRegionTelemetry] = useState({});
  const [globalMetrics, setGlobalMetrics] = useState({
    rps: 10000,
    errors: 0,
    latency: 45,
    availability: 100,
    cost: 4500,
    cacheHitRatio: 85
  });

  // Reset helper
  const resetWorld = useCallback(() => {
    setScale("10k");
    setActiveScenario("normal");
    setActiveRegion("us-east");
    setPlaybackState({ isPlaying: false, speed: 1, step: 0 });
    setDisasters([]);
    setConsistencyMode("eventual");
    setCdnEnabled(true);
    setPrimaryRegion("us-east");
  }, []);

  // Timeline scenarios playback
  useEffect(() => {
    let timer = null;
    if (playbackState.isPlaying) {
      timer = setInterval(() => {
        setPlaybackState(prev => {
          const nextStep = prev.step + 1;
          // Loop or change state based on playback sequence
          return { ...prev, step: nextStep };
        });
        setTime(t => t + 1);
      }, 1000 / playbackState.speed);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [playbackState.isPlaying, playbackState.speed]);

  const playTimeline = useCallback((play = true) => {
    setPlaybackState(prev => ({ ...prev, isPlaying: play }));
  }, []);

  const setPlaybackSpeed = useCallback((speed) => {
    setPlaybackState(prev => ({ ...prev, speed }));
  }, []);

  const increaseScale = useCallback(() => {
    setScale(current => {
      const idx = SCALES.findIndex(s => s.id === current);
      if (idx < SCALES.length - 1) {
        return SCALES[idx + 1].id;
      }
      return SCALES[0].id; // loop
    });
  }, []);

  const changeScenario = useCallback((scenarioId) => {
    const sc = SCENARIOS[scenarioId];
    if (!sc) return;
    setActiveScenario(scenarioId);
    
    // Set corresponding failures automatically
    const scenarioFailures = sc.failures || [];
    setDisasters(scenarioFailures);
  }, []);

  const triggerDisaster = useCallback((disasterKey) => {
    setDisasters(prev => {
      if (prev.includes(disasterKey)) {
        return prev.filter(k => k !== disasterKey); // toggle off
      } else {
        return [...prev, disasterKey]; // toggle on
      }
    });
  }, []);

  const toggleCDN = useCallback(() => {
    setCdnEnabled(prev => !prev);
  }, []);

  // Compute telemetries dynamically based on states
  useEffect(() => {
    const scaleObj = SCALES.find(s => s.id === scale) || SCALES[0];
    const scenarioObj = SCENARIOS[activeScenario] || SCENARIOS.normal;
    const mult = scaleObj.multiplier * scenarioObj.trafficMultiplier;

    let localTelemetry = {};
    let totalRps = 0;
    let totalErrors = 0;
    let totalLatencyAccum = 0;
    let totalActiveUsers = 0;
    let totalCost = 0;
    let cacheHits = 0;

    Object.keys(REGIONS).forEach(rId => {
      const reg = REGIONS[rId];
      const isAffectedScenario = scenarioObj.affectedRegions.includes(rId);

      // Check failures
      const isRegionDown = disasters.includes("region_down") && rId === "us-east";
      const isNetworkCongested = disasters.includes("network_congestion") && rId === "europe";
      const isFiberCut = disasters.includes("undersea_fiber_cut") && (rId === "us-east" || rId === "europe");
      const isDbLocked = disasters.includes("database_replication_lock") && rId === "us-west";
      const isCacheCollapsed = disasters.includes("redis_cache_collapse");
      const isQueueCongested = disasters.includes("kafka_consumer_lag") && (rId === "japan" || rId === "australia");

      // Compute regional traffic / users
      let users = reg.baseUsers * (scaleObj.multiplier * 0.8 + 0.2);
      if (isRegionDown) {
        users = 0;
      } else if (isAffectedScenario) {
        users *= 2.5; // Scenario spike
      }
      
      let traffic = users * 0.15; // transaction throughput ratio
      if (isRegionDown) traffic = 0;

      // Primary replica setup
      let isPrimary = rId === primaryRegion;
      let replicaCount = isPrimary ? 3 : 1;
      if (scale === "100k") replicaCount = 2;
      if (scale === "1m") replicaCount = 3;
      if (scale === "10m") replicaCount = 5;
      if (scale === "100m") replicaCount = 8;

      // CDN Cache hit ratio
      let cacheHitRatio = cdnEnabled ? 85 : 0;
      if (isCacheCollapsed) cacheHitRatio = 5; // collapsed
      if (rId === "india") cacheHitRatio -= 10; // farther nodes slightly less cached
      cacheHitRatio = Math.max(0, cacheHitRatio);

      // Latency computations
      let baseLatency = 5; // Local loop
      let writeLatency = 5;
      let readLatency = 5;
      let replicationLag = 0;

      // Distance factor to primary database
      const distToPrimary = LATENCY_MATRIX[rId][primaryRegion];

      // Read/Write Latency
      if (cdnEnabled && Math.random() * 100 < cacheHitRatio) {
        readLatency = 8; // CDN Edge cached read
      } else {
        // Must hit database replica
        readLatency = 12 + distToPrimary * 0.15; 
      }

      if (consistencyMode === "strong") {
        // Strong consistency writes must coordinate globally
        writeLatency = distToPrimary * 2.0; 
        if (writeLatency < 10) writeLatency = 35; // internal Paxos/Raft consensus floor
      } else if (consistencyMode === "read-your-writes") {
        writeLatency = distToPrimary * 1.2;
      } else {
        // Eventual
        writeLatency = 15; 
      }

      // Add disaster overheads
      if (isNetworkCongested) {
        readLatency += 180;
        writeLatency += 220;
      }
      if (isFiberCut) {
        // latency spikes
        readLatency += 250;
        writeLatency += 350;
      }
      if (isDbLocked) {
        writeLatency += 400;
        replicationLag = 5000 + Math.sin(time) * 1500;
      } else if (consistencyMode !== "strong") {
        replicationLag = distToPrimary * 1.5; // async replication lag
      }

      if (isQueueCongested) {
        replicationLag += 8000;
      }

      const avgLatency = (readLatency * 0.7 + writeLatency * 0.3);

      // Error Rates
      let errors = 0;
      if (isRegionDown) {
        errors = 100;
      } else {
        if (isNetworkCongested) errors += 25;
        if (isDbLocked && consistencyMode === "strong") errors += 40; // DB deadlock failures
        if (isCacheCollapsed) errors += 8; // cache slam overloading DB pool
        if (isAffectedScenario && scale === "100m" && consistencyMode === "strong") {
          errors += 15; // paxos consensus timeout
        }
      }
      errors = Math.min(100, errors);

      // Cost Calculation
      let cost = reg.baseCost * (scaleObj.multiplier * 0.4 + 0.6);
      if (consistencyMode === "strong") cost *= 1.3; // Consensus network and replica CPU cost
      if (cdnEnabled) cost *= 1.15;
      if (isRegionDown) cost *= 0.1; // down nodes consume basic idle billing

      // State determination
      let status = "Healthy";
      if (errors > 20 || avgLatency > 200) {
        status = "Critical";
      } else if (errors > 5 || avgLatency > 80 || isAffectedScenario) {
        status = "Warning";
      }

      localTelemetry[rId] = {
        id: rId,
        name: reg.name,
        users: Math.round(users),
        traffic: Math.round(traffic),
        replicas: replicaCount,
        cacheHitRatio,
        avgLatency: Math.round(avgLatency),
        writeLatency: Math.round(writeLatency),
        readLatency: Math.round(readLatency),
        replicationLag: Math.round(replicationLag),
        errors: Math.round(errors),
        cost: Math.round(cost),
        status,
        color: reg.color
      };

      totalRps += traffic;
      totalErrors += (traffic * (errors / 100));
      totalLatencyAccum += avgLatency * traffic;
      totalActiveUsers += users;
      totalCost += cost;
      cacheHits += traffic * (cacheHitRatio / 100);
    });

    // Handle Failovers if us-east is down
    if (disasters.includes("region_down") && primaryRegion === "us-east") {
      // Automatic promotion to US-West in 4 seconds
      const failoverTimeout = setTimeout(() => {
        setPrimaryRegion("us-west");
      }, 4000);
      return () => clearTimeout(failoverTimeout);
    }

    const calculatedAvgLatency = totalRps > 0 ? (totalLatencyAccum / totalRps) : 10;
    const calculatedErrRate = totalRps > 0 ? (totalErrors / totalRps) * 100 : 0;
    const globalCacheHit = totalRps > 0 ? (cacheHits / totalRps) * 100 : 0;

    setRegionTelemetry(localTelemetry);
    setGlobalMetrics({
      rps: Math.round(totalRps),
      errors: parseFloat(calculatedErrRate.toFixed(2)),
      latency: Math.round(calculatedAvgLatency),
      availability: parseFloat((100 - calculatedErrRate).toFixed(2)),
      cost: Math.round(totalCost),
      cacheHitRatio: Math.round(globalCacheHit)
    });

  }, [scale, activeScenario, disasters, consistencyMode, cdnEnabled, primaryRegion, time, resetWorld]);

  return (
    <PlanetScaleContext.Provider value={{
      scale,
      activeScenario,
      activeRegion,
      playbackState,
      disasters,
      consistencyMode,
      cdnEnabled,
      primaryRegion,
      regionTelemetry,
      globalMetrics,
      time,
      increaseScale,
      setScale, // Exposed setScale
      changeScenario,
      triggerDisaster,
      resetWorld,
      playTimeline,
      setPlaybackSpeed,
      toggleCDN,
      setConsistencyMode,
      setActiveRegion,
      setPrimaryRegion
    }}>
      {children}
    </PlanetScaleContext.Provider>
  );
}

export function usePlanetScale() {
  const context = useContext(PlanetScaleContext);
  if (!context) {
    throw new Error("usePlanetScale must be used within a PlanetScaleProvider");
  }
  return context;
}
