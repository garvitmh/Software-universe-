"use client";

import { useEffect, useMemo, useRef, useState } from "react";

const ALGOS = [
  { key: "bubble", label: "Bubble", big: "O(n²)" },
  { key: "insertion", label: "Insertion", big: "O(n²)" },
  { key: "selection", label: "Selection", big: "O(n²)" },
  { key: "quick", label: "Quick", big: "O(n log n)" },
  { key: "merge", label: "Merge", big: "O(n log n)" },
];

const SIZE = 24;

function makeArray() {
  const a = Array.from({ length: SIZE }, (_, i) => i + 1);
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Produce a replayable trace of comparisons / swaps / writes for one algorithm.
function trace(algo, arr) {
  const a = arr.slice();
  const ops = [];
  let comps = 0;
  const cmp = (i, j) => {
    ops.push({ t: "c", i, j });
    comps++;
    return a[i] - a[j];
  };
  const swap = (i, j) => {
    ops.push({ t: "s", i, j });
    const x = a[i];
    a[i] = a[j];
    a[j] = x;
  };
  const setv = (i, v) => {
    ops.push({ t: "v", i, v });
    a[i] = v;
  };

  if (algo === "bubble") {
    for (let i = 0; i < a.length; i++) for (let j = 0; j < a.length - 1 - i; j++) if (cmp(j, j + 1) > 0) swap(j, j + 1);
  } else if (algo === "selection") {
    for (let i = 0; i < a.length; i++) {
      let m = i;
      for (let j = i + 1; j < a.length; j++) if (cmp(j, m) < 0) m = j;
      if (m !== i) swap(i, m);
    }
  } else if (algo === "insertion") {
    for (let i = 1; i < a.length; i++) {
      const key = a[i];
      let j = i - 1;
      while (j >= 0) {
        ops.push({ t: "c", i: j, j: i });
        comps++;
        if (a[j] > key) {
          setv(j + 1, a[j]);
          j--;
        } else break;
      }
      setv(j + 1, key);
    }
  } else if (algo === "quick") {
    const qs = (lo, hi) => {
      if (lo >= hi) return;
      const p = a[hi];
      let i = lo;
      for (let j = lo; j < hi; j++) {
        ops.push({ t: "c", i: j, j: hi });
        comps++;
        if (a[j] < p) {
          swap(i, j);
          i++;
        }
      }
      swap(i, hi);
      qs(lo, i - 1);
      qs(i + 1, hi);
    };
    qs(0, a.length - 1);
  } else if (algo === "merge") {
    const tmp = a.slice();
    const ms = (lo, hi) => {
      if (hi - lo <= 1) return;
      const mid = (lo + hi) >> 1;
      ms(lo, mid);
      ms(mid, hi);
      let i = lo,
        j = mid,
        k = lo;
      while (i < mid && j < hi) {
        ops.push({ t: "c", i, j });
        comps++;
        if (a[i] <= a[j]) tmp[k++] = a[i++];
        else tmp[k++] = a[j++];
      }
      while (i < mid) tmp[k++] = a[i++];
      while (j < hi) tmp[k++] = a[j++];
      for (let x = lo; x < hi; x++) setv(x, tmp[x]);
    };
    ms(0, a.length);
  }
  return { ops, comps };
}

export default function SortRace() {
  const [base, setBase] = useState(() => makeArray());
  const [algo, setAlgo] = useState("bubble");
  const [data, setData] = useState(base);
  const [hl, setHl] = useState(null);
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);
  const [played, setPlayed] = useState(0);
  const [speed, setSpeed] = useState(22);

  const opsRef = useRef([]);
  const ptrRef = useRef(0);
  const timer = useRef(null);

  // comparison counts for every algorithm on the current array (the punchline)
  const counts = useMemo(() => {
    const c = {};
    for (const al of ALGOS) c[al.key] = trace(al.key, base).comps;
    return c;
  }, [base]);

  const reset = (nextAlgo = algo, nextBase = base) => {
    stop();
    opsRef.current = trace(nextAlgo, nextBase).ops;
    ptrRef.current = 0;
    setData(nextBase);
    setHl(null);
    setDone(false);
    setPlayed(0);
  };

  const stop = () => {
    if (timer.current) clearInterval(timer.current);
    timer.current = null;
    setRunning(false);
  };

  const stepOnce = () => {
    const ops = opsRef.current;
    if (ptrRef.current >= ops.length) {
      stop();
      setDone(true);
      setHl(null);
      return false;
    }
    const op = ops[ptrRef.current++];
    if (op.t === "c") {
      setHl({ a: op.i, b: op.j });
      setPlayed((p) => p + 1);
    } else if (op.t === "s") {
      setHl({ a: op.i, b: op.j });
      setData((d) => {
        const n = [...d];
        const x = n[op.i];
        n[op.i] = n[op.j];
        n[op.j] = x;
        return n;
      });
    } else if (op.t === "v") {
      setHl({ a: op.i });
      setData((d) => {
        const n = [...d];
        n[op.i] = op.v;
        return n;
      });
    }
    return true;
  };

  const play = () => {
    if (running) {
      stop();
      return;
    }
    if (ptrRef.current >= opsRef.current.length) reset();
    setRunning(true);
    timer.current = setInterval(() => {
      if (!stepOnce()) stop();
    }, speed);
  };

  const shuffle = () => {
    const nb = makeArray();
    setBase(nb);
    reset(algo, nb);
  };

  const pick = (k) => {
    setAlgo(k);
    reset(k, base);
  };

  // initialise the trace on first mount
  useEffect(() => {
    opsRef.current = trace(algo, base).ops;
    return () => stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // keep interval speed live
  useEffect(() => {
    if (running) {
      clearInterval(timer.current);
      timer.current = setInterval(() => {
        if (!stepOnce()) stop();
      }, speed);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [speed]);

  const max = SIZE;
  const cur = ALGOS.find((a) => a.key === algo);

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
      {/* algorithm picker + counts */}
      <div style={{ padding: "16px 18px", borderBottom: "1px solid var(--border)", background: "var(--surface)" }}>
        <div style={{ fontFamily: "var(--font-mono)", fontWeight: 600, fontSize: 10, letterSpacing: ".12em", textTransform: "uppercase", color: "var(--primary)", marginBottom: 12 }}>
          Comparisons on this array
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {ALGOS.map((al) => {
            const active = al.key === algo;
            return (
              <button
                key={al.key}
                onClick={() => pick(al.key)}
                style={{
                  border: `1px solid ${active ? "var(--ink)" : "var(--border)"}`,
                  background: active ? "var(--ink)" : "var(--surface)",
                  color: active ? "var(--bg)" : "var(--ink-2)",
                  borderRadius: 6,
                  padding: "8px 12px",
                  cursor: "pointer",
                  textAlign: "left",
                }}
              >
                <div style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 15 }}>{al.label}</div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 10.5, color: active ? "var(--bg)" : "var(--ink-3)", marginTop: 2 }}>
                  {al.big} · {counts[al.key].toLocaleString()} cmp
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* bars */}
      <div style={{ padding: 20, background: "var(--surface-2)" }}>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 3, height: 200 }}>
          {data.map((v, i) => {
            const isHl = hl && (hl.a === i || hl.b === i);
            const color = done ? "var(--teal)" : isHl ? "var(--accent)" : "var(--primary)";
            return <div key={i} style={{ flex: 1, height: `${(v / max) * 100}%`, background: color, borderRadius: "2px 2px 0 0", transition: "height .08s linear" }} />;
          })}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 18, marginTop: 14, flexWrap: "wrap" }}>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: "var(--ink-2)" }}>
            {cur.label} sort · <span style={{ color: "var(--primary)" }}>{cur.big}</span>
          </span>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: "var(--ink-2)" }}>
            {played.toLocaleString()} comparisons
          </span>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: done ? "var(--teal)" : "var(--ink-3)" }}>
            {done ? "sorted ✓" : running ? "sorting…" : "ready"}
          </span>
        </div>
      </div>

      {/* controls */}
      <div style={{ padding: "16px 18px", borderTop: "1px solid var(--border)", background: "var(--surface)", display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
        <button onClick={play} style={{ ...ctrlBtn, background: "var(--ink)", color: "var(--bg)", border: "none" }}>
          {running ? "Pause" : done ? "Replay" : "Play"}
        </button>
        <button
          onClick={() => {
            if (running) stop();
            stepOnce();
          }}
          style={ctrlBtn}
        >
          Step
        </button>
        <button onClick={shuffle} style={ctrlBtn}>
          Shuffle
        </button>
        <label style={{ display: "flex", alignItems: "center", gap: 8, marginLeft: "auto", fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--ink-3)" }}>
          slow
          <input type="range" min={4} max={70} value={74 - speed} onChange={(e) => setSpeed(74 - +e.target.value)} />
          fast
        </label>
      </div>
    </div>
  );
}
