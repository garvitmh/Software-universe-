// components/planet-scale/FailoverPanel.jsx

import React, { useEffect, useState } from "react";
import { usePlanetScale } from "./usePlanetScale";

export default function FailoverPanel() {
  const { disasters, primaryRegion } = usePlanetScale();
  const isEastDown = disasters.includes("region_down");

  const [step, setStep] = useState(0);

  useEffect(() => {
    if (isEastDown) {
      setStep(1); // Heartbeat lost
      const t1 = setTimeout(() => setStep(2), 1800); // Consensus election
      const t2 = setTimeout(() => setStep(3), 3200); // Promote West
      const t3 = setTimeout(() => setStep(4), 4500); // Complete
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
        clearTimeout(t3);
      };
    } else {
      setStep(0);
    }
  }, [isEastDown]);

  return (
    <div className="card" style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "16px" }}>
      <div>
        <span className="eyebrow" style={{ color: "var(--brand)" }}>High Availability</span>
        <h3 style={{ margin: "2px 0 0 0" }}>Automatic Leader Failover</h3>
        <p style={{ margin: "4px 0 0 0", fontSize: "12px", color: "var(--muted)" }}>
          Watch how cluster coordinators automatically elect a new primary when a leader goes offline.
        </p>
      </div>

      <div style={{
        padding: "14px",
        borderRadius: "10px",
        backgroundColor: "var(--bg-2)",
        border: "1px solid var(--hairline-2)",
        display: "flex",
        flexDirection: "column",
        gap: "12px"
      }}>
        {/* Active DB Leader Badge */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: "11px", fontWeight: "600", color: "var(--muted)" }}>Current DB Primary:</span>
          <span style={{
            padding: "4px 10px",
            borderRadius: "12px",
            backgroundColor: "var(--brand-soft)",
            color: "var(--brand-2)",
            fontWeight: "700",
            fontSize: "12px"
          }}>
            👑 {primaryRegion.toUpperCase()}
          </span>
        </div>

        {/* Step Progression */}
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <div style={{ display: "flex", gap: "8px", alignItems: "center", fontSize: "11px" }}>
            <div style={{
              width: "16px",
              height: "16px",
              borderRadius: "50%",
              backgroundColor: step >= 1 ? "var(--pink)" : "var(--hairline-2)",
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "9px"
            }}>
              1
            </div>
            <span style={{
              fontWeight: step === 1 ? "700" : "500",
              color: step >= 1 ? "var(--ink)" : "var(--muted)"
            }}>
              Primary heartbeat lost (US-East offline)
            </span>
          </div>

          <div style={{ display: "flex", gap: "8px", alignItems: "center", fontSize: "11px" }}>
            <div style={{
              width: "16px",
              height: "16px",
              borderRadius: "50%",
              backgroundColor: step >= 2 ? "var(--amber)" : "var(--hairline-2)",
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "9px"
            }}>
              2
            </div>
            <span style={{
              fontWeight: step === 2 ? "700" : "500",
              color: step >= 2 ? "var(--ink)" : "var(--muted)"
            }}>
              Consensus election trigger (raft/paxos)
            </span>
          </div>

          <div style={{ display: "flex", gap: "8px", alignItems: "center", fontSize: "11px" }}>
            <div style={{
              width: "16px",
              height: "16px",
              borderRadius: "50%",
              backgroundColor: step >= 3 ? "var(--brand)" : "var(--hairline-2)",
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "9px"
            }}>
              3
            </div>
            <span style={{
              fontWeight: step === 3 ? "700" : "500",
              color: step >= 3 ? "var(--ink)" : "var(--muted)"
            }}>
              Promoting US-West replica to primary
            </span>
          </div>

          <div style={{ display: "flex", gap: "8px", alignItems: "center", fontSize: "11px" }}>
            <div style={{
              width: "16px",
              height: "16px",
              borderRadius: "50%",
              backgroundColor: step >= 4 ? "var(--teal)" : "var(--hairline-2)",
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "9px"
            }}>
              4
            </div>
            <span style={{
              fontWeight: step === 4 ? "700" : "500",
              color: step >= 4 ? "var(--teal)" : "var(--muted)"
            }}>
              Global DNS & routes failover complete
            </span>
          </div>
        </div>
      </div>

      {!isEastDown && (
        <div style={{ fontSize: "11px", color: "var(--muted)", fontStyle: "italic", textAlign: "center" }}>
          💡 Try injecting the "AWS US-East Outage" in the Disaster Board to watch this orchestration trigger.
        </div>
      )}
    </div>
  );
}
