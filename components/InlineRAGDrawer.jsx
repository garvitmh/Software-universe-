"use client";

import React, { useState, useEffect, useRef } from "react";
import { SettingsIcon, BookOpenIcon } from "@/components/ui/Icons";

export default function InlineRAGDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [showKeyConfig, setShowKeyConfig] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [answer, setAnswer] = useState("");
  const [references, setReferences] = useState([]);
  const [isMock, setIsMock] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("all"); // 'all', 'what', 'why', 'how', 'breaks'

  const drawerRef = useRef(null);
  const inputRef = useRef(null);

  // Load API Key from localStorage
  useEffect(() => {
    const savedKey = localStorage.getItem("openai_api_key");
    if (savedKey) {
      setApiKey(savedKey);
    }
  }, []);

  // Listen to keyboard shortcut (Ctrl+K or Cmd+K) and toggle event
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
    };

    const handleToggleEvent = () => {
      setIsOpen((prev) => !prev);
    };

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

  // Focus input when drawer opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => {
        inputRef.current.focus();
      }, 300);
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

    try {
      const response = await fetch("/api/rag/query", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: searchTerm,
          apiKey: apiKey.trim(),
        }),
      });

      if (!response.ok) {
        const errorJson = await response.json();
        throw new Error(errorJson.error || "Failed to search the Socratic database");
      }

      const data = await response.json();
      setAnswer(data.answer);
      setReferences(data.references || []);
      setIsMock(data.isMock !== false);
    } catch (err) {
      console.error("RAG Drawer Query Error:", err);
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

  // Helper to parse LLM answer into WHAT, WHY, HOW, WHEN IT BREAKS sections
  const getParsedSections = () => {
    const sections = {
      what: "",
      why: "",
      how: "",
      breaks: "",
    };

    if (!answer) return sections;

    // Simple parser matching markdown headers or bullets
    const parts = answer.split(/(?=- \*\*WHAT\*\*|^- \*\*WHY\*\*|^- \*\*HOW\*\*|^- \*\*WHEN IT BREAKS\*\*|^\*\*WHAT\*\*|^\*\*WHY\*\*|^\*\*HOW\*\*|^\*\*WHEN IT BREAKS\*\*|^###? WHAT|^###? WHY|^###? HOW|^###? WHEN)/mi);
    
    let generalText = "";

    for (const part of parts) {
      const clean = part.trim();
      if (/WHAT/i.test(clean)) {
        sections.what = clean;
      } else if (/WHY/i.test(clean)) {
        sections.why = clean;
      } else if (/HOW/i.test(clean)) {
        sections.how = clean;
      } else if (/BREAKS|FAILURE/i.test(clean)) {
        sections.breaks = clean;
      } else {
        generalText += part + "\n";
      }
    }

    // If no tags were found, put everything in 'what'
    if (!sections.what && !sections.why && !sections.how && !sections.breaks) {
      sections.what = answer;
    } else if (generalText.trim() && !sections.what) {
      sections.what = generalText.trim();
    }

    return sections;
  };

  const parsed = getParsedSections();

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0, 0, 0, 0.2)",
            backdropFilter: "blur(2px)",
            zIndex: 999,
            transition: "opacity 0.2s ease",
          }}
        />
      )}

      {/* Drawer Panel */}
      <div
        ref={drawerRef}
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          width: "100%",
          maxWidth: "520px",
          height: "100vh",
          backgroundColor: "var(--surface)",
          borderLeft: "1px solid var(--hairline)",
          boxShadow: "var(--shadow-lg)",
          zIndex: 1000,
          transform: isOpen ? "translateX(0)" : "translateX(100%)",
          transition: "transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Drawer Header */}
        <div
          style={{
            padding: "20px 24px",
            borderBottom: "1px solid var(--hairline)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            background: "linear-gradient(to right, var(--surface-warm), var(--surface))",
          }}
        >
          <div>
            <span
              className="eyebrow"
              style={{ fontSize: "10.5px", letterSpacing: "0.08em" }}
            >
              Knowledge Layer
            </span>
            <h2
              style={{
                fontFamily: "Fraunces",
                fontSize: "20px",
                margin: "4px 0 0 0",
              }}
            >
              Socratic RAG Drawer
            </h2>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button
              onClick={() => setShowKeyConfig((v) => !v)}
              style={{
                background: "transparent",
                border: "none",
                cursor: "pointer",
                padding: "8px",
                borderRadius: "8px",
                display: "flex",
                alignItems: "center",
                color: showKeyConfig ? "var(--brand)" : "var(--muted)",
                transition: "color 0.15s ease",
              }}
              title="API Key Configuration"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <circle cx="12" cy="12" r="3" />
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
              </svg>
            </button>
            <button
              onClick={() => setIsOpen(false)}
              style={{
                background: "transparent",
                border: "none",
                cursor: "pointer",
                padding: "8px",
                borderRadius: "8px",
                display: "flex",
                alignItems: "center",
                color: "var(--muted)",
              }}
              title="Close Drawer"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        </div>

        {/* Drawer Body */}
        <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px" }}>
          {/* Key Settings configuration */}
          {showKeyConfig && (
            <div
              className="card"
              style={{
                padding: "16px",
                backgroundColor: "var(--surface-warm)",
                border: "1px solid var(--hairline-2)",
                marginBottom: "20px",
                borderRadius: "10px",
              }}
            >
              <h3 style={{ fontSize: "14px", marginBottom: "8px", display: "flex", alignItems: "center", gap: 6 }}>
                <SettingsIcon size={16} /> OpenAI API Settings
              </h3>
              <p style={{ fontSize: "12px", color: "var(--ink-2)", marginBottom: "12px", lineHeight: "1.4" }}>
                Enter your OpenAI API key to enable dynamic synthesis of retrieved SRE knowledge. 
                Leaving it blank falls back to free, local search matching. Key is saved locally in your browser.
              </p>
              <div style={{ display: "flex", gap: "8px" }}>
                <input
                  type="password"
                  placeholder="sk-..."
                  defaultValue={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  style={{
                    flex: 1,
                    padding: "8px 12px",
                    borderRadius: "8px",
                    border: "1px solid var(--hairline-2)",
                    fontSize: "13px",
                    background: "var(--surface)",
                    color: "var(--ink)",
                  }}
                  id="openai_api_key_input"
                />
                <button
                  onClick={() => saveApiKey(document.getElementById("openai_api_key_input").value)}
                  className="btn btn-primary"
                  style={{
                    fontSize: "12.5px",
                    padding: "6px 14px",
                    borderRadius: "8px",
                    backgroundColor: "var(--brand)",
                    color: "#FFF",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  Save
                </button>
              </div>
            </div>
          )}

          {/* Socratic search input */}
          <form
            onSubmit={handleSearch}
            style={{ display: "flex", gap: "8px", marginBottom: "20px" }}
          >
            <input
              ref={inputRef}
              type="text"
              placeholder="Ask the Universe... e.g. What breaks in a cascading failure?"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              style={{
                flex: 1,
                padding: "12px 16px",
                borderRadius: "10px",
                border: "1px solid var(--hairline-2)",
                fontSize: "14.5px",
                outline: "none",
                background: "var(--surface-warm)",
                color: "var(--ink)",
              }}
            />
            <button
              type="submit"
              disabled={isLoading}
              style={{
                padding: "10px 18px",
                borderRadius: "10px",
                backgroundColor: "var(--ink)",
                color: "var(--bg)",
                border: "none",
                fontWeight: "600",
                fontSize: "14px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              {isLoading ? "Searching..." : "Ask"}
            </button>
          </form>

          {/* Error Message */}
          {error && (
            <div
              className="card"
              style={{
                padding: "12px 16px",
                borderLeft: "4px solid var(--pink)",
                backgroundColor: "var(--pink-soft)",
                color: "var(--pink)",
                fontSize: "13.5px",
                marginBottom: "20px",
              }}
            >
              <strong>Error:</strong> {error}
            </div>
          )}

          {/* Loader */}
          {isLoading && (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginTop: "20px" }}>
              <div style={{ height: "20px", width: "40%", background: "var(--bg-2)", borderRadius: "4px", animation: "pulse 1.5s infinite" }} />
              <div style={{ height: "14px", width: "100%", background: "var(--bg-2)", borderRadius: "4px", animation: "pulse 1.5s infinite" }} />
              <div style={{ height: "14px", width: "90%", background: "var(--bg-2)", borderRadius: "4px", animation: "pulse 1.5s infinite" }} />
              <div style={{ height: "14px", width: "95%", background: "var(--bg-2)", borderRadius: "4px", animation: "pulse 1.5s infinite" }} />
            </div>
          )}

          {/* Content Output */}
          {answer && !isLoading && (
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              {/* API Provider Badge */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  fontSize: "11px",
                  color: "var(--muted)",
                  borderBottom: "1px solid var(--hairline)",
                  paddingBottom: "8px",
                }}
              >
                <span>
                  Source: {isMock ? "💾 Local Data Lake" : "🤖 OpenAI GPT-4o-mini Synthesis"}
                </span>
                {apiKey ? (
                  <span style={{ color: "var(--teal)", fontWeight: "600" }}>✓ AI Active</span>
                ) : (
                  <span style={{ color: "var(--amber)" }}>⚡ Local Only</span>
                )}
              </div>

              {/* Socratic Sectioned Tabs */}
              <div style={{ display: "flex", gap: "4px", borderBottom: "1px solid var(--hairline)", paddingBottom: "6px" }}>
                {["all", "what", "why", "how", "breaks"].map((tab) => {
                  const hasSection = tab === "all" || !!parsed[tab];
                  return (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      disabled={!hasSection}
                      style={{
                        padding: "6px 10px",
                        fontSize: "12px",
                        fontWeight: "600",
                        textTransform: "uppercase",
                        border: "none",
                        background: activeTab === tab ? "var(--brand-soft)" : "transparent",
                        color: activeTab === tab ? "var(--brand-2)" : hasSection ? "var(--ink-2)" : "var(--faint)",
                        borderRadius: "6px",
                        cursor: hasSection ? "pointer" : "not-allowed",
                      }}
                    >
                      {tab === "breaks" ? "when it breaks" : tab}
                    </button>
                  );
                })}
              </div>

              {/* Parsed Output */}
              <div
                className="prose"
                style={{
                  fontSize: "14.5px",
                  lineHeight: "1.6",
                  color: "var(--ink-2)",
                  whiteSpace: "pre-line",
                }}
              >
                {activeTab === "all" && answer}
                {activeTab === "what" && (parsed.what || "No definition content in results.")}
                {activeTab === "why" && (parsed.why || "No trade-offs / architectural why content in results.")}
                {activeTab === "how" && (parsed.how || "No operational step-by-step how content in results.")}
                {activeTab === "breaks" && (parsed.breaks || "No failure mode content in results.")}
              </div>

              {/* References Cards */}
              {references.length > 0 && (
                <div style={{ marginTop: "12px" }}>
                  <h3
                    style={{
                      fontSize: "13px",
                      textTransform: "uppercase",
                      letterSpacing: "0.06em",
                      color: "var(--muted)",
                      marginBottom: "10px",
                      display: "flex",
                      alignItems: "center",
                      gap: 6
                    }}
                  >
                    <BookOpenIcon size={15} /> Referenced Documents
                  </h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    {references.map((ref, idx) => (
                      <div
                        key={ref.id}
                        className="card"
                        style={{
                          padding: "12px 14px",
                          borderRadius: "8px",
                          border: "1px solid var(--hairline)",
                          background: "var(--surface-warm)",
                          display: "flex",
                          flexDirection: "column",
                          gap: "6px",
                        }}
                      >
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <span
                            style={{
                              fontSize: "12px",
                              fontWeight: "600",
                              color: "var(--ink)",
                            }}
                          >
                            {ref.title}
                          </span>
                          <span
                            style={{
                              fontSize: "10px",
                              padding: "2px 6px",
                              borderRadius: "4px",
                              backgroundColor:
                                ref.category === "books"
                                  ? "var(--purple-soft)"
                                  : ref.category === "blogs"
                                  ? "var(--teal-soft)"
                                  : "var(--amber-soft)",
                              color:
                                ref.category === "books"
                                  ? "var(--purple)"
                                  : ref.category === "blogs"
                                  ? "var(--teal)"
                                  : "var(--amber)",
                              fontWeight: "700",
                              textTransform: "uppercase",
                            }}
                          >
                            {ref.category}
                          </span>
                        </div>
                        <p style={{ fontSize: "12px", color: "var(--ink-2)", margin: 0, fontStyle: "italic", lineHeight: "1.4" }}>
                          "{ref.text.substring(0, 140)}..."
                        </p>
                        {ref.url && (
                          <a
                            href={ref.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              fontSize: "11px",
                              color: "var(--brand)",
                              fontWeight: "600",
                              alignSelf: "flex-end",
                              textDecoration: "underline",
                            }}
                          >
                            Read Full Context →
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Basic keyframe styles inline (CSS rule hack) */}
      <style jsx global>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </>
  );
}
