"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { searchNav } from "@/lib/searchIndex";

// Starter questions shown in the empty state — onboarding for the Professor.
const SUGGESTIONS = [
  "What is idempotency, and why does it matter for payments?",
  "How does a cache work — and when does it break?",
  "SQL versus NoSQL — when should I use each?",
  "What happens during a cascading failure?",
];

// The four-question lenses, in reading order.
const LENSES = [
  { key: "what", tag: "What", color: "var(--primary)" },
  { key: "why", tag: "Why", color: "var(--primary)" },
  { key: "how", tag: "How", color: "var(--primary)" },
  { key: "breaks", tag: "When it breaks", color: "var(--accent)" },
];

const stripLabel = (text) =>
  (text || "")
    .replace(/^[-#*\s]*\**\s*(WHAT|WHY|HOW|WHEN[^\n:]*)\**\s*:?\s*/i, "")
    .replace(/\*\*/g, "")
    .trim();

const clean = (text) => (text || "").replace(/\*\*/g, "").trim();

export default function InlineRAGDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [topic, setTopic] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [showKeyConfig, setShowKeyConfig] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [answer, setAnswer] = useState("");
  const [references, setReferences] = useState([]);
  const [isMock, setIsMock] = useState(true);
  const [error, setError] = useState("");

  const inputRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    const savedKey = localStorage.getItem("openai_api_key");
    if (savedKey) setApiKey(savedKey);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === "Escape") setIsOpen(false);
    };
    const handleToggleEvent = () => setIsOpen((prev) => !prev);
    const handleSearchTermEvent = (e) => {
      const term = e.detail?.term;
      if (term) {
        setQuery(term);
        setIsOpen(true);
        executeSearch(term);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("toggle-rag-drawer", handleToggleEvent);
    window.addEventListener("search-rag-term", handleSearchTermEvent);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("toggle-rag-drawer", handleToggleEvent);
      window.removeEventListener("search-rag-term", handleSearchTermEvent);
    };
  }, [apiKey]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      const t = setTimeout(() => inputRef.current.focus(), 300);
      return () => clearTimeout(t);
    }
  }, [isOpen]);

  const saveApiKey = (key) => {
    setApiKey(key);
    localStorage.setItem("openai_api_key", key);
    setShowKeyConfig(false);
  };

  const executeSearch = async (searchTerm) => {
    setIsLoading(true);
    setError("");
    setAnswer("");
    setReferences([]);
    setTopic(searchTerm);

    try {
      const response = await fetch("/api/rag/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: searchTerm, apiKey: apiKey.trim() }),
      });
      if (!response.ok) {
        const errorJson = await response.json();
        throw new Error(errorJson.error || "Failed to reach the Professor.");
      }
      const data = await response.json();
      setAnswer(data.answer);
      setReferences(data.references || []);
      setIsMock(data.isMock !== false);
    } catch (err) {
      console.error("Professor query error:", err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;
    await executeSearch(query.trim());
  };

  const getParsedSections = () => {
    const sections = { what: "", why: "", how: "", breaks: "" };
    if (!answer) return sections;
    const parts = answer.split(
      /(?=- \*\*WHAT\*\*|^- \*\*WHY\*\*|^- \*\*HOW\*\*|^- \*\*WHEN IT BREAKS\*\*|^\*\*WHAT\*\*|^\*\*WHY\*\*|^\*\*HOW\*\*|^\*\*WHEN IT BREAKS\*\*|^###? WHAT|^###? WHY|^###? HOW|^###? WHEN)/mi
    );
    let general = "";
    for (const part of parts) {
      const c = part.trim();
      if (/WHAT/i.test(c)) sections.what = c;
      else if (/WHY/i.test(c)) sections.why = c;
      else if (/HOW/i.test(c)) sections.how = c;
      else if (/BREAKS|FAILURE/i.test(c)) sections.breaks = c;
      else general += part + "\n";
    }
    if (!sections.what && !sections.why && !sections.how && !sections.breaks) sections.what = answer;
    else if (general.trim() && !sections.what) sections.what = general.trim();
    return sections;
  };

  const parsed = getParsedSections();
  const hasLenses = LENSES.some((l) => parsed[l.key]) && (parsed.why || parsed.how || parsed.breaks);
  const matches = searchNav(query);

  const monoLabel = {
    fontFamily: "var(--font-mono)",
    fontWeight: 600,
    fontSize: 10,
    letterSpacing: ".12em",
    textTransform: "uppercase",
    color: "var(--ink-3)",
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "color-mix(in srgb, var(--ink) 26%, transparent)",
            zIndex: 999,
          }}
        />
      )}

      {/* Drawer */}
      <div
        className="ed-scroll"
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          width: "min(460px, 92vw)",
          height: "100vh",
          background: "var(--bg)",
          borderLeft: "1px solid var(--border-2)",
          boxShadow: "var(--shadow-lg)",
          zIndex: 1000,
          transform: isOpen ? "translateX(0)" : "translateX(100%)",
          transition: "transform .34s cubic-bezier(.2,.7,.2,1)",
          display: "flex",
          flexDirection: "column",
          overflowY: "auto",
        }}
      >
        {/* Sticky header + input */}
        <div
          style={{
            position: "sticky",
            top: 0,
            background: "var(--bg)",
            borderBottom: "1px solid var(--border)",
            padding: "20px 24px 16px",
            zIndex: 2,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
            <div style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: 22, color: "var(--ink)" }}>
              The Professor
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <button
                onClick={() => setShowKeyConfig((v) => !v)}
                title="AI key (optional)"
                style={{
                  border: "1px solid var(--border-2)",
                  background: "var(--surface)",
                  borderRadius: 5,
                  padding: "5px 7px",
                  color: showKeyConfig ? "var(--primary)" : "var(--ink-3)",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="3" />
                  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
                </svg>
              </button>
              <button
                onClick={() => setIsOpen(false)}
                title="Close"
                style={{
                  border: "1px solid var(--border-2)",
                  background: "var(--surface)",
                  borderRadius: 5,
                  fontFamily: "var(--font-mono)",
                  fontWeight: 600,
                  fontSize: 10,
                  padding: "5px 8px",
                  color: "var(--ink-3)",
                  cursor: "pointer",
                }}
              >
                ESC
              </button>
            </div>
          </div>

          <form onSubmit={handleSearch}>
            <input
              ref={inputRef}
              type="text"
              placeholder="Ask anything…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              style={{
                width: "100%",
                border: "1px solid var(--border-2)",
                background: "var(--surface)",
                borderRadius: 6,
                padding: "11px 14px",
                outline: "none",
                color: "var(--ink)",
                fontFamily: "var(--font-body)",
                fontWeight: 400,
                fontSize: 16,
              }}
            />
          </form>

          {showKeyConfig && (
            <div
              style={{
                marginTop: 12,
                border: "1px solid var(--border)",
                background: "var(--surface)",
                borderRadius: 6,
                padding: 14,
              }}
            >
              <div style={{ ...monoLabel, marginBottom: 8 }}>AI key — optional</div>
              <p style={{ fontSize: 13, color: "var(--ink-2)", lineHeight: 1.5, margin: "0 0 10px" }}>
                Answers are grounded in the local knowledge index. Add an OpenAI/OpenRouter-compatible key for richer
                synthesis. Saved only in your browser.
              </p>
              <div style={{ display: "flex", gap: 8 }}>
                <input
                  type="password"
                  placeholder="sk-…"
                  defaultValue={apiKey}
                  id="prof_api_key_input"
                  style={{
                    flex: 1,
                    padding: "8px 12px",
                    borderRadius: 5,
                    border: "1px solid var(--border-2)",
                    fontSize: 13,
                    background: "var(--bg)",
                    color: "var(--ink)",
                  }}
                />
                <button
                  onClick={() => saveApiKey(document.getElementById("prof_api_key_input").value)}
                  style={{
                    background: "var(--ink)",
                    color: "var(--bg)",
                    border: "none",
                    borderRadius: 5,
                    fontFamily: "var(--font-body)",
                    fontWeight: 600,
                    fontSize: 13,
                    padding: "8px 16px",
                    cursor: "pointer",
                  }}
                >
                  Save
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Body */}
        <div style={{ padding: "22px 24px 40px" }}>
          {error && (
            <div
              style={{
                border: "1px solid var(--accent)",
                background: "color-mix(in srgb, var(--accent) 6%, transparent)",
                color: "var(--accent)",
                borderRadius: 6,
                padding: "12px 16px",
                fontSize: 14,
                marginBottom: 18,
              }}
            >
              {error}
            </div>
          )}

          {isLoading && (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={{ ...monoLabel }}>Consulting the index…</div>
              {[40, 100, 92, 96, 70].map((w, i) => (
                <div
                  key={i}
                  style={{
                    height: i === 0 ? 22 : 14,
                    width: `${w}%`,
                    background: "var(--surface-2)",
                    borderRadius: 4,
                    animation: "pulse 1.5s infinite",
                  }}
                />
              ))}
            </div>
          )}

          {/* Empty state — jump-to navigation while typing, else suggestions */}
          {!answer && !isLoading && !error &&
            (query.trim().length >= 2 ? (
              <div>
                {matches.length > 0 && (
                  <div style={{ marginBottom: 22 }}>
                    <div style={{ ...monoLabel, marginBottom: 10 }}>Jump to</div>
                    {matches.map((m) => (
                      <button
                        key={m.kind + m.href + m.title}
                        onClick={() => {
                          router.push(m.href);
                          setIsOpen(false);
                        }}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 12,
                          width: "100%",
                          textAlign: "left",
                          background: "transparent",
                          border: "none",
                          borderBottom: "1px solid var(--border)",
                          padding: "10px 0",
                          cursor: "pointer",
                        }}
                      >
                        <span style={{ fontFamily: "var(--font-mono)", fontWeight: 600, fontSize: 9, letterSpacing: ".1em", textTransform: "uppercase", color: "var(--ink-3)", minWidth: 44 }}>
                          {m.kind}
                        </span>
                        <span style={{ fontFamily: "var(--font-display)", fontSize: 17, color: "var(--ink)" }}>{m.title}</span>
                      </button>
                    ))}
                  </div>
                )}
                <button
                  onClick={handleSearch}
                  style={{
                    display: "block",
                    width: "100%",
                    textAlign: "left",
                    background: "var(--ink)",
                    color: "var(--bg)",
                    border: "none",
                    borderRadius: 6,
                    fontFamily: "var(--font-body)",
                    fontWeight: 600,
                    fontSize: 14,
                    padding: "12px 16px",
                    cursor: "pointer",
                  }}
                >
                  Ask the Professor about “{query.trim()}” →
                </button>
              </div>
            ) : (
              <div>
                <div style={{ ...monoLabel, marginBottom: 12 }}>Try asking</div>
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => {
                      setQuery(s);
                      executeSearch(s);
                    }}
                    style={{
                      display: "block",
                      width: "100%",
                      textAlign: "left",
                      fontFamily: "var(--font-display)",
                      fontSize: 17,
                      color: "var(--primary)",
                      background: "transparent",
                      border: "none",
                      borderBottom: "1px solid var(--border)",
                      padding: "11px 0",
                      cursor: "pointer",
                    }}
                  >
                    {s} →
                  </button>
                ))}
              </div>
            ))}

          {/* Answer */}
          {answer && !isLoading && (
            <div>
              <div style={{ ...monoLabel, marginBottom: 8 }}>Grounded answer</div>
              {topic && (
                <div style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 26, marginBottom: 20, color: "var(--ink)", lineHeight: 1.15 }}>
                  {topic}
                </div>
              )}

              {hasLenses ? (
                LENSES.filter((l) => parsed[l.key]).map((l) => (
                  <div key={l.key} style={{ marginBottom: 18, paddingBottom: 18, borderBottom: "1px solid var(--border)" }}>
                    <div style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: 18, color: l.color, marginBottom: 6 }}>
                      {l.tag}
                    </div>
                    <div style={{ fontSize: 16, lineHeight: 1.65, color: "var(--ink)", whiteSpace: "pre-line" }}>
                      {stripLabel(parsed[l.key])}
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ fontSize: 16, lineHeight: 1.7, color: "var(--ink)", whiteSpace: "pre-line", marginBottom: 18, paddingBottom: 18, borderBottom: "1px solid var(--border)" }}>
                  {clean(answer)}
                </div>
              )}

              {/* Source mode */}
              <div style={{ ...monoLabel, marginBottom: 9 }}>
                {isMock ? "Grounded in the local index" : "AI synthesis · grounded in sources"}
              </div>

              {references.length > 0 && (
                <div style={{ marginBottom: 22 }}>
                  <div style={{ ...monoLabel, marginBottom: 9 }}>Sources</div>
                  {references.map((ref) => (
                    <div key={ref.id} style={{ borderBottom: "1px dotted var(--border)", padding: "7px 0" }}>
                      <div style={{ fontSize: 14, color: "var(--ink)" }}>
                        — {ref.title}
                        {ref.category ? (
                          <span style={{ fontFamily: "var(--font-mono)", fontSize: 9.5, color: "var(--ink-3)", marginLeft: 8, textTransform: "uppercase", letterSpacing: ".08em" }}>
                            {ref.category}
                          </span>
                        ) : null}
                      </div>
                      {ref.url && (
                        <a href={ref.url} target="_blank" rel="noopener noreferrer" style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--primary)" }}>
                          read full context →
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Continue reading */}
              <div style={{ ...monoLabel, marginBottom: 10 }}>Continue reading</div>
              {SUGGESTIONS.filter((s) => s.toLowerCase() !== (topic || "").toLowerCase())
                .slice(0, 3)
                .map((s) => (
                  <button
                    key={s}
                    onClick={() => {
                      setQuery(s);
                      executeSearch(s);
                    }}
                    style={{
                      display: "block",
                      width: "100%",
                      textAlign: "left",
                      fontFamily: "var(--font-display)",
                      fontSize: 17,
                      color: "var(--primary)",
                      background: "transparent",
                      border: "none",
                      borderBottom: "1px solid var(--border)",
                      padding: "9px 0",
                      cursor: "pointer",
                    }}
                  >
                    {s} →
                  </button>
                ))}
            </div>
          )}
        </div>
      </div>

      <style jsx global>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </>
  );
}
