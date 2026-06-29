"use client";

import { useState } from "react";

// A real HTTP playground: make a GET request to a free, no-key public API and
// see the actual live response — status, timing, and JSON body. Teaches
// request/response, status codes, and JSON with real data. A blocked request
// becomes a CORS lesson rather than a dead end. GET only (we never mutate
// someone else's API).
const PRESETS = [
  { label: "GitHub repo", url: "https://api.github.com/repos/facebook/react", note: "A real REST API. Change the owner/repo in the URL." },
  { label: "Crypto prices (live)", url: "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd", note: "Live market data — it changes every time you send." },
  { label: "Weather now (live)", url: "https://api.open-meteo.com/v1/forecast?latitude=40.71&longitude=-74.01&current_weather=true", note: "Current conditions. Change latitude/longitude for your city." },
  { label: "ISS position (live)", url: "https://api.wheretheiss.at/v1/satellites/25544", note: "The Space Station's live coordinates — send it twice; it has moved." },
  { label: "Random advice", url: "https://api.adviceslip.com/advice", note: "A tiny API that returns one piece of advice as JSON." },
];

function statusColor(s) {
  if (!s) return "var(--ink-3)";
  if (s >= 200 && s < 300) return "var(--primary)";
  if (s >= 400 && s < 500) return "var(--bronze)";
  return "var(--accent)";
}

export default function ApiPlayground() {
  const [url, setUrl] = useState(PRESETS[1].url);
  const [note, setNote] = useState(PRESETS[1].note);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const send = async () => {
    setLoading(true);
    setError("");
    setResult(null);
    const t0 = performance.now();
    try {
      const res = await fetch(url, { method: "GET" });
      const ms = Math.round(performance.now() - t0);
      const ct = res.headers.get("content-type") || "";
      const raw = await res.text();
      let body = raw;
      if (ct.includes("json") || /^[\[{]/.test(raw.trim())) {
        try {
          body = JSON.stringify(JSON.parse(raw), null, 2);
        } catch (_) {}
      }
      if (body.length > 6000) body = body.slice(0, 6000) + "\n… (truncated)";
      setResult({ status: res.status, ok: res.ok, ms, type: ct.split(";")[0] || "—", body });
    } catch (e) {
      const ms = Math.round(performance.now() - t0);
      setError(
        `${e.message}. This usually means the API didn't send CORS headers allowing the browser to read it (Access-Control-Allow-Origin) — a real, common gotcha. The request still left your machine; the browser just refused to hand you the response. Try one of the presets, which do allow it.`
      );
      setResult({ status: 0, ok: false, ms, type: "—", body: "" });
    } finally {
      setLoading(false);
    }
  };

  const monoLabel = { fontFamily: "var(--font-mono)", fontWeight: 600, fontSize: 10, letterSpacing: ".1em", textTransform: "uppercase", color: "var(--ink-3)" };

  return (
    <div style={{ border: "1px solid var(--border)", borderRadius: 8, overflow: "hidden" }}>
      {/* presets */}
      <div style={{ padding: "12px 16px", borderBottom: "1px solid var(--border)", background: "var(--surface)", display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
        <span style={{ ...monoLabel, marginRight: 4 }}>Try</span>
        {PRESETS.map((p) => (
          <button
            key={p.label}
            onClick={() => {
              setUrl(p.url);
              setNote(p.note);
              setResult(null);
              setError("");
            }}
            style={{ border: `1px solid ${url === p.url ? "var(--ink)" : "var(--border-2)"}`, background: url === p.url ? "var(--ink)" : "var(--surface)", color: url === p.url ? "var(--bg)" : "var(--ink-2)", fontFamily: "var(--font-body)", fontWeight: 500, fontSize: 13, padding: "6px 11px", borderRadius: 6, cursor: "pointer" }}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* request bar */}
      <div style={{ padding: "14px 16px", background: "var(--surface)", borderBottom: "1px solid var(--border)" }}>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <span style={{ fontFamily: "var(--font-mono)", fontWeight: 600, fontSize: 13, color: "var(--primary)", alignSelf: "center", padding: "0 6px" }}>GET</span>
          <input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
            spellCheck={false}
            style={{ flex: 1, minWidth: 220, border: "1px solid var(--border-2)", background: "var(--bg)", borderRadius: 6, padding: "9px 12px", outline: "none", color: "var(--ink)", fontFamily: "var(--font-mono)", fontSize: 13 }}
          />
          <button onClick={send} disabled={loading} style={{ border: "none", background: "var(--ink)", color: "var(--bg)", fontFamily: "var(--font-body)", fontWeight: 600, fontSize: 14, padding: "9px 20px", borderRadius: 6, cursor: "pointer" }}>
            {loading ? "Sending…" : "Send ▸"}
          </button>
        </div>
        {note && <div style={{ fontSize: 12.5, color: "var(--ink-3)", marginTop: 8 }}>{note}</div>}
      </div>

      {/* response */}
      <div style={{ padding: "16px 18px", background: "var(--surface-2)", minHeight: 120 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 18, marginBottom: 12, flexWrap: "wrap" }}>
          <span style={monoLabel}>Response</span>
          {result && (
            <>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 13, fontWeight: 600, color: statusColor(result.status) }}>
                {result.status || "—"} {result.status >= 200 && result.status < 300 ? "OK" : result.status === 0 ? "blocked" : ""}
              </span>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--ink-3)" }}>{result.ms} ms</span>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--ink-3)" }}>{result.type}</span>
            </>
          )}
        </div>
        {!result && !loading && <div style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: "var(--ink-3)" }}>— pick an API and press Send to see the real response —</div>}
        {error && (
          <div style={{ border: "1px solid var(--accent)", background: "color-mix(in srgb, var(--accent) 6%, transparent)", color: "var(--accent)", borderRadius: 6, padding: "12px 14px", fontSize: 13.5, lineHeight: 1.6 }}>
            {error}
          </div>
        )}
        {result && result.body && (
          <pre style={{ fontFamily: "var(--font-mono)", fontSize: 12.5, lineHeight: 1.6, color: "var(--code-ink)", background: "var(--code-bg)", border: "1px solid var(--border)", borderRadius: 6, padding: "14px 16px", margin: 0, overflowX: "auto", whiteSpace: "pre-wrap", wordBreak: "break-word", maxHeight: 360, overflowY: "auto" }}>
            {result.body}
          </pre>
        )}
      </div>
    </div>
  );
}
