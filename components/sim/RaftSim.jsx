"use client";

import { useEffect, useRef, useState } from "react";

// An owned, interactive Raft consensus visualizer — leader election with
// randomized timeouts, heartbeats, crash-and-re-elect, and split-brain
// prevention. A faithful *teaching* model (not a formal implementation): the
// core invariants — a candidate needs a majority of the whole cluster, higher
// term wins, randomized timeouts break ties — are real.

const N = 5;
const TMIN = 9;
const TMAX = 18;
const CX = 240;
const CY = 190;
const R = 135;

const rand = () => Math.floor(TMIN + Math.random() * (TMAX - TMIN));

function makeNodes() {
  return Array.from({ length: N }, (_, i) => {
    const a = -Math.PI / 2 + (i * 2 * Math.PI) / N;
    const t = rand();
    return {
      id: i,
      x: CX + R * Math.cos(a),
      y: CY + R * Math.sin(a),
      state: "follower",
      term: 0,
      votedFor: null,
      timeout: t,
      timeoutMax: t,
      alive: true,
    };
  });
}

export default function RaftSim() {
  const [nodes, setNodes] = useState(makeNodes);
  const [running, setRunning] = useState(true);
  const [partition, setPartition] = useState(false);
  const [speed, setSpeed] = useState(130);
  const [beat, setBeat] = useState(0); // ticks since a heartbeat, for the pulse

  const ref = useRef(nodes);
  const partRef = useRef(partition);
  const timer = useRef(null);
  ref.current = nodes;
  partRef.current = partition;

  const reachable = (a, b) => {
    if (!a.alive || !b.alive) return false;
    if (!partRef.current) return true;
    return a.id < 3 === b.id < 3; // two groups: {0,1,2} and {3,4}
  };

  const tick = () => {
    const ns = ref.current.map((n) => ({ ...n }));
    const leader = ns.find((n) => n.alive && n.state === "leader");
    let didBeat = false;

    if (leader) {
      // Leader sends heartbeats: reachable followers stay followers and reset.
      for (const n of ns) {
        if (n.id === leader.id) continue;
        if (reachable(leader, n) && n.term <= leader.term) {
          n.state = "follower";
          n.term = leader.term;
          n.votedFor = null;
          n.timeout = rand();
          n.timeoutMax = n.timeout;
        }
      }
      didBeat = true;
    }

    // Election timeouts for everyone who isn't the (heartbeating) leader.
    for (const n of ns) {
      if (!n.alive || n.state === "leader") continue;
      n.timeout -= 1;
      if (n.timeout <= 0) {
        // Become a candidate, bump the term, vote for self.
        n.state = "candidate";
        n.term += 1;
        n.votedFor = n.id;
        n.timeout = rand();
        n.timeoutMax = n.timeout;
        let votes = 1;
        for (const p of ns) {
          if (p.id === n.id || !reachable(n, p)) continue;
          if (p.term < n.term || (p.term === n.term && p.votedFor == null)) {
            p.term = n.term;
            p.votedFor = n.id;
            votes += 1;
          }
        }
        // Majority of the WHOLE cluster (N), so a minority partition can't win.
        if (votes > N / 2) {
          for (const p of ns) {
            if (p.id === n.id) continue;
            if (p.alive && p.term <= n.term) {
              p.state = "follower";
              p.term = n.term;
              p.votedFor = null;
            }
          }
          n.state = "leader";
        }
      }
    }

    setNodes(ns);
    setBeat((b) => (didBeat ? 0 : b + 1));
  };

  useEffect(() => {
    if (!running) {
      clearInterval(timer.current);
      return;
    }
    timer.current = setInterval(tick, speed);
    return () => clearInterval(timer.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running, speed]);

  const crashLeader = () => {
    setNodes((ns) => {
      const copy = ns.map((n) => ({ ...n }));
      const l = copy.find((n) => n.alive && n.state === "leader");
      if (l) {
        l.alive = false;
        l.state = "follower";
      }
      return copy;
    });
  };
  const healAll = () =>
    setNodes((ns) =>
      ns.map((n) => {
        if (n.alive) return n;
        const t = rand();
        return { ...n, alive: true, state: "follower", votedFor: null, timeout: t, timeoutMax: t };
      })
    );
  const reset = () => {
    setPartition(false);
    setNodes(makeNodes());
  };

  const leader = nodes.find((n) => n.alive && n.state === "leader");
  const candidate = nodes.find((n) => n.alive && n.state === "candidate");
  const maxTerm = Math.max(...nodes.map((n) => n.term));
  const status = leader
    ? `Term ${leader.term} · Leader is S${leader.id}`
    : candidate
    ? `Election in progress — term ${maxTerm}`
    : "No leader — waiting for a timeout";
  const statusColor = leader ? "var(--primary)" : "var(--accent)";

  const COLORS = {
    follower: { fill: "var(--surface)", stroke: "var(--border-2)", text: "var(--ink-2)" },
    candidate: { fill: "color-mix(in srgb, var(--bronze) 18%, var(--surface))", stroke: "var(--bronze)", text: "var(--ink)" },
    leader: { fill: "color-mix(in srgb, var(--primary) 16%, var(--surface))", stroke: "var(--primary)", text: "var(--ink)" },
  };

  const ctrlBtn = {
    border: "1px solid var(--border-2)",
    background: "var(--surface)",
    color: "var(--ink)",
    fontFamily: "var(--font-body)",
    fontWeight: 600,
    fontSize: 13.5,
    padding: "9px 14px",
    borderRadius: 6,
    cursor: "pointer",
  };

  return (
    <div style={{ border: "1px solid var(--border)", borderRadius: 8, overflow: "hidden" }}>
      <div style={{ padding: 20, background: "var(--surface-2)" }}>
        <svg viewBox="0 0 480 380" style={{ width: "100%", height: "auto", display: "block", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 6 }}>
          {/* partition divider */}
          {partition && (
            <line x1="240" y1="20" x2="240" y2="300" stroke="var(--accent)" strokeWidth="1.5" strokeDasharray="5 5" />
          )}

          {/* heartbeat links from the leader */}
          {leader &&
            nodes.map(
              (n) =>
                n.id !== leader.id &&
                reachable(leader, n) && (
                  <line key={`hb${n.id}`} x1={leader.x} y1={leader.y} x2={n.x} y2={n.y} stroke="var(--primary)" strokeWidth="1" opacity={beat === 0 ? 0.5 : 0.12} />
                )
            )}

          {/* nodes */}
          {nodes.map((n) => {
            const c = n.alive ? COLORS[n.state] : { fill: "var(--surface-2)", stroke: "var(--border)", text: "var(--ink-3)" };
            const ringFrac = n.alive && n.state !== "leader" ? n.timeout / n.timeoutMax : 0;
            const circ = 2 * Math.PI * 32;
            return (
              <g key={n.id}>
                {/* election-timeout ring */}
                {ringFrac > 0 && (
                  <circle cx={n.x} cy={n.y} r={32} fill="none" stroke="var(--bronze)" strokeWidth="2.5" strokeDasharray={`${circ * ringFrac} ${circ}`} strokeLinecap="round" transform={`rotate(-90 ${n.x} ${n.y})`} opacity="0.7" />
                )}
                <circle cx={n.x} cy={n.y} r={26} fill={c.fill} stroke={c.stroke} strokeWidth={n.state === "leader" ? 2.5 : 1.5} opacity={n.alive ? 1 : 0.55} />
                <text x={n.x} y={n.y - 2} textAnchor="middle" fontFamily="var(--font-display)" fontWeight="600" fontSize="16" fill={c.text}>
                  S{n.id}
                </text>
                <text x={n.x} y={n.y + 12} textAnchor="middle" fontFamily="var(--font-mono)" fontSize="9" fill={c.text}>
                  {n.alive ? `t${n.term}` : "down"}
                </text>
                {n.state === "leader" && n.alive && (
                  <text x={n.x} y={n.y - 36} textAnchor="middle" fontFamily="var(--font-mono)" fontWeight="600" fontSize="9" fill="var(--primary)" letterSpacing="0.1em">
                    LEADER
                  </text>
                )}
              </g>
            );
          })}
        </svg>

        <div style={{ display: "flex", alignItems: "center", gap: 18, marginTop: 12, flexWrap: "wrap", fontSize: 13.5 }}>
          <span style={{ display: "flex", alignItems: "center", gap: 7, color: "var(--ink-2)" }}>
            <span style={{ width: 11, height: 11, borderRadius: "50%", background: "var(--primary)" }} /> leader
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: 7, color: "var(--ink-2)" }}>
            <span style={{ width: 11, height: 11, borderRadius: "50%", background: "var(--bronze)" }} /> candidate
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: 7, color: "var(--ink-2)" }}>
            <span style={{ width: 11, height: 11, borderRadius: "50%", border: "1.5px solid var(--border-2)" }} /> follower
          </span>
          <span style={{ marginLeft: "auto", fontFamily: "var(--font-mono)", fontSize: 13, color: statusColor }}>{status}</span>
        </div>
      </div>

      <div style={{ padding: "16px 18px", borderTop: "1px solid var(--border)", background: "var(--surface)", display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
        <button onClick={() => setRunning((r) => !r)} style={{ ...ctrlBtn, background: "var(--ink)", color: "var(--bg)", border: "none" }}>
          {running ? "Pause" : "Play"}
        </button>
        <button onClick={crashLeader} style={{ ...ctrlBtn, border: "1px solid var(--accent)", color: "var(--accent)" }}>
          Crash the leader
        </button>
        <button onClick={() => setPartition((p) => !p)} style={{ ...ctrlBtn, ...(partition ? { background: "var(--accent)", color: "var(--bg)", border: "none" } : {}) }}>
          {partition ? "Heal partition" : "Split the network"}
        </button>
        <button onClick={healAll} style={ctrlBtn}>
          Revive all
        </button>
        <button onClick={reset} style={ctrlBtn}>
          Reset
        </button>
        <label style={{ display: "flex", alignItems: "center", gap: 8, marginLeft: "auto", fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--ink-3)" }}>
          slow
          <input type="range" min={40} max={260} value={300 - speed} onChange={(e) => setSpeed(300 - +e.target.value)} />
          fast
        </label>
      </div>
    </div>
  );
}
