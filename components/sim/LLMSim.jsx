"use client";

import { useMemo, useState } from "react";

// An honest, runnable model of how an LLM writes: a real n-gram next-token
// predictor built from a tiny corpus. It does the genuine thing an LLM does —
// turn the context into a probability distribution over the next token, reshape
// it with temperature, then sample one and loop. No API, fully deterministic in
// its counts. What it is NOT: a neural network with attention (see the note on
// the page). The *shape* of the computation is the lesson.
const CORPUS = [
  "the cat sat on the mat",
  "the cat sat on the soft warm mat",
  "the cat chased the small mouse",
  "the dog ran across the green field",
  "the dog sat by the warm fire",
  "the model predicts the next token from the context",
  "the model reads the context and predicts the next word",
  "the server sends a response to the client",
  "the server stores the data in a database",
  "the client sends a request to the server",
  "a database stores rows in a table",
  "a function returns a value to the caller",
  "the cache returns the value without a slow lookup",
  "the user opens the app and taps the button",
  "the app sends the order to the kitchen",
  "the kitchen cooks the order and the driver delivers it",
];

function tokenize(s) {
  return s.toLowerCase().trim().split(/\s+/).filter(Boolean);
}

// Build trigram, bigram, unigram count tables once.
function buildModel() {
  const tri = {}; // "w1 w2" -> {w3: count}
  const bi = {}; // "w1" -> {w2: count}
  const uni = {}; // "w" -> count
  for (const line of CORPUS) {
    const t = tokenize(line);
    for (let i = 0; i < t.length; i++) {
      uni[t[i]] = (uni[t[i]] || 0) + 1;
      if (i >= 1) {
        const k = t[i - 1];
        (bi[k] = bi[k] || {})[t[i]] = (bi[k][t[i]] || 0) + 1;
      }
      if (i >= 2) {
        const k = t[i - 2] + " " + t[i - 1];
        (tri[k] = tri[k] || {})[t[i]] = (tri[k][t[i]] || 0) + 1;
      }
    }
  }
  return { tri, bi, uni };
}

function softmaxFromCounts(counts, temp) {
  const T = Math.max(temp, 0.05);
  const entries = Object.entries(counts);
  const logits = entries.map(([, c]) => Math.log(c) / T);
  const max = Math.max(...logits);
  const exps = logits.map((l) => Math.exp(l - max));
  const sum = exps.reduce((a, b) => a + b, 0);
  return entries
    .map(([tok], i) => ({ tok, p: exps[i] / sum }))
    .sort((a, b) => b.p - a.p);
}

export default function LLMSim() {
  const model = useMemo(buildModel, []);
  const [tokens, setTokens] = useState(["the", "model"]);
  const [temp, setTemp] = useState(0.7);
  const [lastPick, setLastPick] = useState(null);

  // Next-token distribution with longest-context backoff.
  const { dist, ctxUsed } = useMemo(() => {
    const n = tokens.length;
    if (n >= 2) {
      const k = tokens[n - 2] + " " + tokens[n - 1];
      if (model.tri[k]) return { dist: softmaxFromCounts(model.tri[k], temp), ctxUsed: 2 };
    }
    if (n >= 1) {
      const k = tokens[n - 1];
      if (model.bi[k]) return { dist: softmaxFromCounts(model.bi[k], temp), ctxUsed: 1 };
    }
    return { dist: softmaxFromCounts(model.uni, temp), ctxUsed: 0 };
  }, [tokens, temp, model]);

  const top = dist.slice(0, 6);

  const sample = () => {
    if (temp <= 0.06) return dist[0]?.tok; // greedy
    const r = Math.random();
    let acc = 0;
    for (const d of dist) {
      acc += d.p;
      if (r <= acc) return d.tok;
    }
    return dist[dist.length - 1]?.tok;
  };

  const step = () => {
    const t = sample();
    if (!t) return;
    setLastPick(t);
    setTokens((cur) => (cur.length >= 24 ? cur : [...cur, t]));
  };
  const stepN = (n) => {
    let cur = [...tokens];
    for (let i = 0; i < n && cur.length < 24; i++) {
      const dd = (() => {
        const m = cur.length;
        if (m >= 2 && model.tri[cur[m - 2] + " " + cur[m - 1]]) return softmaxFromCounts(model.tri[cur[m - 2] + " " + cur[m - 1]], temp);
        if (m >= 1 && model.bi[cur[m - 1]]) return softmaxFromCounts(model.bi[cur[m - 1]], temp);
        return softmaxFromCounts(model.uni, temp);
      })();
      let t;
      if (temp <= 0.06) t = dd[0]?.tok;
      else {
        const r = Math.random();
        let acc = 0;
        for (const d of dd) {
          acc += d.p;
          if (r <= acc) { t = d.tok; break; }
        }
        if (!t) t = dd[dd.length - 1]?.tok;
      }
      if (!t) break;
      cur.push(t);
    }
    setLastPick(cur[cur.length - 1]);
    setTokens(cur);
  };

  const pickManual = (tok) => {
    setLastPick(tok);
    setTokens((cur) => (cur.length >= 24 ? cur : [...cur, tok]));
  };

  const PRESETS = [["the", "model"], ["the", "cat"], ["the", "server"], ["a", "database"]];
  const btn = { fontFamily: "var(--font-body)", fontWeight: 600, fontSize: 13.5, padding: "8px 14px", borderRadius: 6, cursor: "pointer", border: "1px solid var(--border-2)", background: "var(--surface)", color: "var(--ink-2)" };
  const ctxLabel = ctxUsed === 2 ? "last 2 tokens" : ctxUsed === 1 ? "last 1 token (backed off)" : "no context (backed off to overall frequency)";

  return (
    <div style={{ border: "1px solid var(--border)", borderRadius: 8, overflow: "hidden" }}>
      {/* the running text */}
      <div style={{ padding: "16px 18px", background: "var(--surface-2)", borderBottom: "1px solid var(--border)" }}>
        <div style={{ fontFamily: "var(--font-mono)", fontWeight: 600, fontSize: 10, letterSpacing: ".1em", textTransform: "uppercase", color: "var(--ink-3)", marginBottom: 10 }}>The sequence so far</div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
          {tokens.map((t, i) => (
            <span key={i} style={{ fontFamily: "var(--font-mono)", fontSize: 14, padding: "4px 9px", borderRadius: 5, background: i >= tokens.length - (ctxUsed || 0) ? "color-mix(in srgb, var(--primary) 13%, var(--bg))" : "var(--bg)", border: "1px solid var(--border-2)", color: t === lastPick && i === tokens.length - 1 ? "var(--primary)" : "var(--ink)", fontWeight: t === lastPick && i === tokens.length - 1 ? 700 : 500 }}>
              {t}
            </span>
          ))}
          <span style={{ width: 2, height: 18, background: "var(--primary)", animation: "none", marginLeft: 2 }} />
        </div>
        <div style={{ fontSize: 12, color: "var(--ink-3)", marginTop: 10 }}>
          Highlighted = the <strong style={{ color: "var(--ink-2)" }}>context</strong> the model is looking at right now ({ctxLabel}).
        </div>
      </div>

      {/* distribution */}
      <div style={{ padding: "16px 18px", background: "var(--surface)" }}>
        <div style={{ fontFamily: "var(--font-mono)", fontWeight: 600, fontSize: 10, letterSpacing: ".1em", textTransform: "uppercase", color: "var(--ink-3)", marginBottom: 12 }}>
          Probability of the next token — click one, or let it sample
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
          {top.map((d) => (
            <button
              key={d.tok}
              onClick={() => pickManual(d.tok)}
              title="Pick this token"
              style={{ display: "flex", alignItems: "center", gap: 10, border: "none", background: "transparent", cursor: "pointer", padding: 0, textAlign: "left" }}
            >
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 13, width: 96, color: "var(--ink)", flexShrink: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{d.tok}</span>
              <span style={{ flex: 1, height: 16, background: "var(--surface-2)", borderRadius: 4, overflow: "hidden", border: "1px solid var(--border)" }}>
                <span style={{ display: "block", height: "100%", width: `${Math.max(d.p * 100, 1.5)}%`, background: "var(--primary)", opacity: 0.82 }} />
              </span>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, width: 46, textAlign: "right", color: "var(--ink-2)", flexShrink: 0 }}>{(d.p * 100).toFixed(1)}%</span>
            </button>
          ))}
        </div>
      </div>

      {/* controls */}
      <div style={{ padding: "12px 16px", borderTop: "1px solid var(--border)", background: "var(--surface)", display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
        <button onClick={step} style={{ ...btn, border: "none", background: "var(--ink)", color: "var(--bg)" }}>Generate 1 ▸</button>
        <button onClick={() => stepN(8)} style={btn}>Generate 8</button>
        {PRESETS.map((p) => (
          <button key={p.join(" ")} onClick={() => { setTokens(p); setLastPick(null); }} style={{ ...btn, fontFamily: "var(--font-mono)", fontSize: 12.5 }}>{p.join(" ")}…</button>
        ))}
        <div style={{ flex: 1, minWidth: 180, display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--ink-3)", whiteSpace: "nowrap" }}>temp {temp.toFixed(2)}</span>
          <input type="range" min={0.05} max={1.5} step={0.05} value={temp} onChange={(e) => setTemp(parseFloat(e.target.value))} style={{ flex: 1, accentColor: "var(--primary)" }} />
        </div>
      </div>
      <div style={{ padding: "10px 16px", borderTop: "1px solid var(--border)", background: "var(--surface-2)", fontSize: 12.5, color: "var(--ink-3)", lineHeight: 1.5 }}>
        Drag <strong style={{ color: "var(--ink-2)" }}>temperature</strong> low and the top bar towers over the rest — the model becomes predictable, almost repeating the corpus. Drag it high and the bars flatten — it gets surprising, sometimes nonsensical. Same machine, one dial.
      </div>
    </div>
  );
}
