"use client";

import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import {
  simulateIncident,
  SUPPORTED_INCIDENTS,
  generateMetrics,
  generateLogs,
  generateTraces,
  generateAlerts,
  findRootCause,
  calculateBlastRadius,
  generateMitigations,
  simulateRecovery,
  detectRepeatedIncidents,
  detectArchitecturalRegrets,
  generatePostmortem
} from "../runtime/ProductionIncidentSimulator";

const IncidentContext = createContext();

const TIMELINE_STEPS = ["0m", "5m", "15m", "30m", "Resolved"];

export function IncidentProvider({ children }) {
  const [incidentType, setIncidentType] = useState("PAYMENT_TIMEOUT");
  const [activeStep, setActiveStep] = useState(0); // 0 to 4
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [postmortem, setPostmortem] = useState(null);

  const timerRef = useRef(null);

  // Reset postmortem when changing incident type or resetting simulation
  const selectIncident = (type) => {
    if (type === null || SUPPORTED_INCIDENTS.includes(type)) {
      setIncidentType(type);
      setActiveStep(0);
      setIsPlaying(false);
      setPostmortem(null);
    }
  };

  const stepForward = () => {
    setActiveStep((prev) => Math.min(prev + 1, TIMELINE_STEPS.length - 1));
  };

  const stepBack = () => {
    setActiveStep((prev) => Math.max(prev - 0, 0));
  };

  const resetSimulation = () => {
    setActiveStep(0);
    setIsPlaying(false);
    setPostmortem(null);
  };

  // Autoplay timer logic
  useEffect(() => {
    if (isPlaying) {
      const intervalTime = 4000 / speed;
      timerRef.current = setInterval(() => {
        setActiveStep((prev) => {
          if (prev >= TIMELINE_STEPS.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, intervalTime);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isPlaying, speed]);

  // Compute dynamic telemetry data based on current activeStep
  const getSimulatedData = () => {
    // Basic incident details from the static simulator
    const baseIncident = {
      type: incidentType,
      id: incidentType === "PAYMENT_TIMEOUT" ? "INC-2026-001" : incidentType === "POSTGRES_SATURATION" ? "INC-2026-002" : "INC-2026-003",
      severity: incidentType === "REDIS_FAILURE" ? "SEV2" : "SEV1",
      startedAt: "2026-06-22T08:00:00Z",
      affectedSystems: incidentType === "PAYMENT_TIMEOUT"
        ? ["Checkout", "Notifications"]
        : incidentType === "POSTGRES_SATURATION"
        ? ["Checkout", "Admin Reports"]
        : ["Notifications", "POS Printing Queue"]
    };

    // 1. Recovery stage mapping
    let status = "ACTIVE";
    let recoveryStage = "Detection";
    if (activeStep >= 1 && activeStep <= 3) {
      recoveryStage = "Investigation";
    }
    if (activeStep === 3) {
      status = "MITIGATING";
      recoveryStage = "Mitigation";
    }
    if (activeStep === 4) {
      status = "RESOLVED";
      recoveryStage = "Resolved";
    }

    // 2. Metrics mapping per step
    const finalMetrics = generateMetrics(baseIncident);
    let stepMetrics = { ...finalMetrics };

    if (activeStep === 0) {
      // Healthy baseline
      stepMetrics = {
        requestRate: incidentType === "POSTGRES_SATURATION" ? 180 : 100,
        latency: 85,
        p95: 145,
        p99: 220,
        cpu: 25,
        memory: incidentType === "REDIS_FAILURE" ? 32 : 40,
        queueDepth: 0,
        errorRate: 0.05
      };
    } else if (activeStep === 1) {
      // First warning/onset
      if (incidentType === "PAYMENT_TIMEOUT") {
        stepMetrics = { requestRate: 115, latency: 450, p95: 1500, p99: 3200, cpu: 55, memory: 40, queueDepth: 8, errorRate: 4.8 };
      } else if (incidentType === "POSTGRES_SATURATION") {
        stepMetrics = { requestRate: 200, latency: 600, p95: 2200, p99: 4500, cpu: 100, memory: 55, queueDepth: 25, errorRate: 12.4 };
      } else {
        stepMetrics = { requestRate: 80, latency: 90, p95: 140, p99: 210, cpu: 12, memory: 99, queueDepth: 180, errorRate: 1.2 };
      }
    } else if (activeStep === 2) {
      // Peak outage (returns exact simulator values)
      stepMetrics = { ...finalMetrics };
    } else if (activeStep === 3) {
      // Mitigation applied/Investigating (still high, but stabilization begins)
      if (incidentType === "PAYMENT_TIMEOUT") {
        stepMetrics = { requestRate: 120, latency: 950, p95: 2400, p99: 4100, cpu: 65, memory: 40, queueDepth: 12, errorRate: 8.5 };
      } else if (incidentType === "POSTGRES_SATURATION") {
        stepMetrics = { requestRate: 190, latency: 850, p95: 1800, p99: 3100, cpu: 60, memory: 65, queueDepth: 40, errorRate: 15.0 };
      } else {
        stepMetrics = { requestRate: 80, latency: 60, p95: 110, p99: 160, cpu: 8, memory: 55, queueDepth: 320, errorRate: 2.5 };
      }
    } else if (activeStep === 4) {
      // Fully Recovered
      stepMetrics = {
        requestRate: incidentType === "POSTGRES_SATURATION" ? 175 : 100,
        latency: 75,
        p95: 125,
        p99: 180,
        cpu: 18,
        memory: incidentType === "REDIS_FAILURE" ? 35 : 40,
        queueDepth: 0,
        errorRate: 0.01
      };
    }

    // Generate historical metrics points up to the current active step for the charting dashboards
    const metricsHistory = [];
    for (let i = 0; i <= activeStep; i++) {
      let histVal = {};
      if (i === 0) {
        histVal = { step: "0m", latency: 85, errorRate: 0.05, cpu: 25, memory: incidentType === "REDIS_FAILURE" ? 32 : 40, queueDepth: 0 };
      } else if (i === 1) {
        histVal = {
          step: "5m",
          latency: incidentType === "PAYMENT_TIMEOUT" ? 450 : incidentType === "POSTGRES_SATURATION" ? 600 : 90,
          errorRate: incidentType === "PAYMENT_TIMEOUT" ? 4.8 : incidentType === "POSTGRES_SATURATION" ? 12.4 : 1.2,
          cpu: incidentType === "PAYMENT_TIMEOUT" ? 55 : incidentType === "POSTGRES_SATURATION" ? 100 : 12,
          memory: incidentType === "REDIS_FAILURE" ? 99 : 40,
          queueDepth: incidentType === "REDIS_FAILURE" ? 180 : 8
        };
      } else if (i === 2) {
        histVal = {
          step: "15m",
          latency: finalMetrics.latency,
          errorRate: finalMetrics.errorRate,
          cpu: finalMetrics.cpu,
          memory: finalMetrics.memory,
          queueDepth: finalMetrics.queueDepth
        };
      } else if (i === 3) {
        histVal = {
          step: "30m",
          latency: incidentType === "PAYMENT_TIMEOUT" ? 950 : incidentType === "POSTGRES_SATURATION" ? 850 : 60,
          errorRate: incidentType === "PAYMENT_TIMEOUT" ? 8.5 : incidentType === "POSTGRES_SATURATION" ? 15.0 : 2.5,
          cpu: incidentType === "PAYMENT_TIMEOUT" ? 65 : incidentType === "POSTGRES_SATURATION" ? 60 : 8,
          memory: incidentType === "REDIS_FAILURE" ? 55 : 40,
          queueDepth: incidentType === "REDIS_FAILURE" ? 320 : 12
        };
      } else {
        histVal = { step: "Resolved", latency: 75, errorRate: 0.01, cpu: 18, memory: incidentType === "REDIS_FAILURE" ? 35 : 40, queueDepth: 0 };
      }
      metricsHistory.push(histVal);
    }

    // 3. Alerts list mapping per step
    let activeAlerts = [];
    if (activeStep >= 1 && activeStep <= 3) {
      activeAlerts = generateAlerts(baseIncident);
      if (activeStep === 1) {
        // Only the first alert fires at 5m
        activeAlerts = activeAlerts.slice(0, 1);
      }
    }

    // 4. Logs mapping per step
    const fullLogs = generateLogs(baseIncident);
    let stepLogs = [];
    const timestampPrefix = "2026-06-22T08:";
    
    // Add logs step-by-step
    if (activeStep >= 0) {
      stepLogs.push({ timestamp: `${timestampPrefix}00:00Z`, service: "Core API", level: "INFO", message: `System initialized in production mode. Initializing telemetry monitors.` });
      if (incidentType === "PAYMENT_TIMEOUT") {
        stepLogs.push({ timestamp: `${timestampPrefix}00:02Z`, service: "Checkout", level: "INFO", message: `Checkout processed successfully: orderId=724391` });
      } else if (incidentType === "POSTGRES_SATURATION") {
        stepLogs.push({ timestamp: `${timestampPrefix}00:01Z`, service: "Postgres", level: "INFO", message: `Database read replica pool operational with 2 healthy instances.` });
      } else {
        stepLogs.push({ timestamp: `${timestampPrefix}00:02Z`, service: "Redis", level: "INFO", message: `Redis memory footprint stable at 32MB.` });
      }
    }
    if (activeStep >= 1) {
      if (incidentType === "PAYMENT_TIMEOUT") {
        stepLogs.push({ timestamp: `${timestampPrefix}04:12Z`, service: "Checkout", level: "WARN", message: `Stripe API response latency elevated: 3200ms.` });
        stepLogs.push({ timestamp: `${timestampPrefix}05:00Z`, service: "Checkout", level: "ERROR", message: `OrderController: Stripe API timeout. Retrying attempt #1...` });
      } else if (incidentType === "POSTGRES_SATURATION") {
        stepLogs.push({ timestamp: `${timestampPrefix}03:45Z`, service: "Admin Reports", level: "INFO", message: `Monthly financial reports analytics query triggered by user ID 109.` });
        stepLogs.push({ timestamp: `${timestampPrefix}04:50Z`, service: "Postgres", level: "WARN", message: `Slow query warning: SELECT SUM(total) FROM orders WHERE created_at > NOW() - INTERVAL '30 days'... (duration 12400ms)` });
      } else {
        stepLogs.push({ timestamp: `${timestampPrefix}04:30Z`, service: "Redis", level: "WARN", message: `Redis memory utilization reached 99%. Eviction policy: noeviction.` });
        stepLogs.push({ timestamp: `${timestampPrefix}05:00Z`, service: "Redis", level: "CRITICAL", message: `OOM command rejected. Out of memory database error.` });
      }
    }
    if (activeStep >= 2) {
      // Outage peak logs
      fullLogs.forEach((logStr, idx) => {
        let level = "INFO";
        if (logStr.includes("ERROR")) level = "ERROR";
        else if (logStr.includes("WARN")) level = "WARN";
        else if (logStr.includes("FATAL") || logStr.includes("CRITICAL")) level = "CRITICAL";

        const cleanMsg = logStr.replace(/\[(ERROR|WARN|INFO|FATAL)\]\s*/, "");
        const service = cleanMsg.split(":")[0]?.trim() || "System";
        const message = cleanMsg.substring(cleanMsg.indexOf(":") + 1)?.trim() || cleanMsg;

        stepLogs.push({
          timestamp: `${timestampPrefix}15:${idx * 10}Z`,
          service,
          level,
          message
        });
      });
    }
    if (activeStep >= 3) {
      // Diagnostic investigation logs
      stepLogs.push({ timestamp: `${timestampPrefix}20:00Z`, service: "SRE PagerDuty", level: "INFO", message: `On-call engineer paged. PagerDuty alert acknowledged.` });
      if (incidentType === "PAYMENT_TIMEOUT") {
        stepLogs.push({ timestamp: `${timestampPrefix}30:00Z`, service: "SRE Terminal", level: "INFO", message: `Diagnostic check: checkout worker threads are blocked in Stripe SDK network socket reads.` });
      } else if (incidentType === "POSTGRES_SATURATION") {
        stepLogs.push({ timestamp: `${timestampPrefix}28:30Z`, service: "SRE Terminal", level: "INFO", message: `PostgreSQL pg_stat_activity analysis reveals query pid 20432 locking checkout table transactions.` });
      } else {
        stepLogs.push({ timestamp: `${timestampPrefix}29:00Z`, service: "SRE Terminal", level: "INFO", message: `Redis analysis: BullMQ jobs are piling up in RAM due to missing removeOnComplete limits.` });
      }
    }
    if (activeStep >= 4) {
      // Mitigation logs
      if (incidentType === "PAYMENT_TIMEOUT") {
        stepLogs.push({ timestamp: `${timestampPrefix}45:00Z`, service: "SRE Terminal", level: "INFO", message: `Mitigation applied: Switched checkout payment validation pipeline to backup Razorpay gateway.` });
        stepLogs.push({ timestamp: `${timestampPrefix}46:12Z`, service: "Checkout", level: "INFO", message: `Stripe API connectivity recovered. Checkout process returning to normal operations.` });
      } else if (incidentType === "POSTGRES_SATURATION") {
        stepLogs.push({ timestamp: `${timestampPrefix}35:00Z`, service: "SRE Terminal", level: "INFO", message: `Mitigation applied: Force terminated query pid 20432. CPU load dropping.` });
        stepLogs.push({ timestamp: `${timestampPrefix}42:00Z`, service: "Admin Reports", level: "INFO", message: `Configured PG write/read replica routing: relocated reporting traffic to Postgres read replica.` });
      } else {
        stepLogs.push({ timestamp: `${timestampPrefix}35:00Z`, service: "SRE Terminal", level: "INFO", message: `Mitigation applied: Restarted Redis cluster nodes and applied BullMQ removeOnComplete task limits.` });
        stepLogs.push({ timestamp: `${timestampPrefix}40:15Z`, service: "Notifications", level: "INFO", message: `NotificationWorker re-established redis connection; draining queue backlog (850 jobs).` });
      }
      stepLogs.push({ timestamp: `${timestampPrefix}48:00Z`, service: "SRE Monitor", level: "INFO", message: `Outage fully resolved. Latencies and error rates restored to healthy baseline.` });
    }

    // 5. Traces mapping per step
    const defaultTraces = generateTraces(baseIncident);
    let stepTraces = defaultTraces.map(t => {
      // Step 0: All healthy
      if (activeStep === 0) {
        return { ...t, status: "SUCCESS", duration: t.duration > 100 ? 60 : t.duration };
      }
      // Step 1: Warning, stripe slower
      if (activeStep === 1) {
        if (t.type === "EXTERNAL" || t.id === "span-3") {
          return { ...t, duration: 3200, status: "TIMEOUT" };
        }
        if (t.type === "SERVICE" || t.id === "span-2") {
          return { ...t, duration: 3250, status: "FAILED" };
        }
      }
      // Step 2 & 3: Peak outage
      return t;
    });

    // 6. Root Cause, Regrets, mitigations, postmortem details
    const rootCause = findRootCause(baseIncident);
    const regrets = detectArchitecturalRegrets(baseIncident);
    const mitigations = generateMitigations(baseIncident);
    const recovery = simulateRecovery(baseIncident);
    const blastRadius = calculateBlastRadius(baseIncident);
    const postmortemTemplate = generatePostmortem(baseIncident);

    return {
      incident: baseIncident,
      status,
      recovery: {
        stage: recoveryStage,
        mttr: recovery.mttr,
        recoveredSystems: recovery.recoveredSystems
      },
      metrics: stepMetrics,
      metricsHistory,
      alerts: activeAlerts,
      logs: stepLogs,
      traces: stepTraces,
      rootCause,
      regrets,
      mitigations,
      blastRadius,
      postmortemTemplate
    };
  };

  const value = {
    incidentType,
    activeStep,
    steps: TIMELINE_STEPS,
    isPlaying,
    speed,
    postmortem,
    selectIncident,
    setPlaybackStep: setActiveStep,
    togglePlay: () => setIsPlaying(!isPlaying),
    play: () => setIsPlaying(true),
    pause: () => setIsPlaying(false),
    stepForward,
    nextStep: stepForward,
    stepBack,
    prevStep: stepBack,
    resetSimulation,
    reset: resetSimulation,
    setSpeed,
    setPlaybackSpeed: setSpeed,
    playbackSpeed: speed,
    totalSteps: TIMELINE_STEPS.length,
    submitPostmortem: setPostmortem,
    ...getSimulatedData()
  };

  return (
    <IncidentContext.Provider value={value}>
      {children}
    </IncidentContext.Provider>
  );
}

export function useIncidentContext() {
  const context = useContext(IncidentContext);
  if (!context) {
    throw new Error("useIncidentContext must be used within an IncidentProvider");
  }
  return context;
}
