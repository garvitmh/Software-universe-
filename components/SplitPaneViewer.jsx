"use client";

import React, { useState, useEffect, useRef } from "react";

export default function SplitPaneViewer({
  concept,
  title,
  visualizerUrl,
  fallbackComponent,
  defaultQuery = ""
}) {
  const [activeSection, setActiveSection] = useState("what"); // 'what', 'why', 'how', 'breaks', 'chat'
  const [chatQuery, setChatQuery] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [socraticData, setSocraticData] = useState(null);
  const [iframeLoading, setIframeLoading] = useState(true);
  const [apiKey, setApiKey] = useState("");
  const [error, setError] = useState("");

  const [selectedText, setSelectedText] = useState("");
  const [bubbleCoords, setBubbleCoords] = useState({ top: 0, left: 0 });
  const leftPaneRef = useRef(null);

  // Load API Key and initial RAG context
  useEffect(() => {
    const savedKey = localStorage.getItem("openai_api_key") || "";
    setApiKey(savedKey);

    const fetchInitialContext = async () => {
      setIsLoading(true);
      setError("");
      try {
        const queryText = defaultQuery || `Explain ${concept} deeply and socratically`;
        const response = await fetch("/api/rag/query", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            query: queryText,
            apiKey: savedKey,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to fetch initial RAG context");
        }

        const data = await response.json();
        setSocraticData(data);
        
        // Populate chat history with the initial explanation
        setChatHistory([
          {
            sender: "Professor",
            text: data.answer,
            references: data.references || []
          }
        ]);
      } catch (err) {
        console.error("Initial RAG Fetch Error:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialContext();
  }, [concept, defaultQuery]);

  const handleSendMessage = async (e) => {
    if (e) e.preventDefault();
    if (!chatQuery.trim()) return;

    const userMessageText = chatQuery.trim();
    setChatQuery("");
    setChatHistory((prev) => [...prev, { sender: "Apprentice", text: userMessageText }]);
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/rag/query", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: userMessageText,
          apiKey: apiKey.trim(),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to consult Socratic database");
      }

      const data = await response.json();
      setChatHistory((prev) => [
        ...prev,
        {
          sender: "Professor",
          text: data.answer,
          references: data.references || []
        }
      ]);
    } catch (err) {
      console.error("Chat Error:", err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Listen for text selection change events
  useEffect(() => {
    const handleSelection = () => {
      const selection = window.getSelection();
      if (!selection || selection.isCollapsed) {
        setSelectedText("");
        return;
      }
      const text = selection.toString().trim();
      if (text.length > 1 && text.length < 120) {
        if (leftPaneRef.current && leftPaneRef.current.contains(selection.anchorNode)) {
          const range = selection.getRangeAt(0);
          const rect = range.getBoundingClientRect();
          setBubbleCoords({
            top: rect.top - 40,
            left: rect.left + rect.width / 2,
          });
          setSelectedText(text);
        }
      } else {
        setSelectedText("");
      }
    };

    document.addEventListener("selectionchange", handleSelection);
    return () => {
      document.removeEventListener("selectionchange", handleSelection);
    };
  }, [title]);

  const handleAskSelectedText = async (textToAsk) => {
    setSelectedText("");
    setActiveSection("chat");
    setChatQuery("");
    
    setChatHistory((prev) => [...prev, { sender: "Apprentice", text: `Professor, explain: "${textToAsk}"` }]);
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/rag/query", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: `Explain the concept: "${textToAsk}" in the context of "${title}"`,
          apiKey: apiKey.trim(),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to consult Socratic database");
      }

      const data = await response.json();
      setChatHistory((prev) => [
        ...prev,
        {
          sender: "Professor",
          text: data.answer,
          references: data.references || []
        }
      ]);
    } catch (err) {
      console.error("Selection Chat Error:", err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Helper to parse LLM answer into WHAT, WHY, HOW, WHEN IT BREAKS sections
  const getParsedSections = () => {
    const sections = {
      what: "",
      why: "",
      how: "",
      breaks: "",
    };

    const initialAnswer = socraticData?.answer;
    if (!initialAnswer) return sections;

    // Simple parser matching markdown headers or bullets
    const parts = initialAnswer.split(/(?=- \*\*WHAT\*\*|^- \*\*WHY\*\*|^- \*\*HOW\*\*|^- \*\*WHEN IT BREAKS\*\*|^\*\*WHAT\*\*|^\*\*WHY\*\*|^\*\*HOW\*\*|^\*\*WHEN IT BREAKS\*\*|^###? WHAT|^###? WHY|^###? HOW|^###? WHEN)/mi);
    
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
      sections.what = initialAnswer;
    } else if (generalText.trim() && !sections.what) {
      sections.what = generalText.trim();
    }

    return sections;
  };

  const parsed = getParsedSections();

  return (
    <div
      style={{
        display: "flex",
        width: "100%",
        height: "calc(100vh - 62px)", // Subtract SiteNav height
        overflow: "hidden",
        position: "relative"
      }}
      className="split-pane-layout"
    >
      {/* Floating Selection AI Popover */}
      {selectedText && (
        <div
          style={{
            position: "fixed",
            top: bubbleCoords.top,
            left: bubbleCoords.left,
            transform: "translateX(-50%)",
            zIndex: 9999,
            pointerEvents: "auto"
          }}
        >
          <button
            onClick={() => handleAskSelectedText(selectedText)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "6px 12px",
              fontSize: "12px",
              fontWeight: "600",
              backgroundColor: "var(--ink)",
              color: "var(--bg)",
              border: "1px solid var(--hairline)",
              borderRadius: "20px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
              cursor: "pointer",
              whiteSpace: "nowrap",
              transition: "all 0.2s"
            }}
            className="floating-ai-button"
          >
            ✨ Ask Professor
          </button>
        </div>
      )}

      {/* Left Pane: Visualizer */}
      <div
        ref={leftPaneRef}
        style={{
          flex: "1 1 60%",
          height: "100%",
          position: "relative",
          borderRight: "1px solid var(--hairline)",
          backgroundColor: "var(--bg-2)",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Pane Toolbar */}
        <div
          style={{
            padding: "12px 20px",
            borderBottom: "1px solid var(--hairline)",
            backgroundColor: "var(--surface)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: "18px" }}>🎮</span>
            <h2 style={{ fontSize: "16px", fontFamily: "Fraunces" }}>{title} Simulator</h2>
          </div>
          {visualizerUrl && (
            <a
              href={visualizerUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontSize: "12.5px",
                color: "var(--brand)",
                fontWeight: "600",
                textDecoration: "underline"
              }}
            >
              Open Original site ↗
            </a>
          )}
        </div>

        {/* Visualizer Area */}
        <div style={{ flex: 1, position: "relative" }}>
          {visualizerUrl ? (
            <>
              {iframeLoading && (
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    background: "var(--bg-2)",
                    zIndex: 2,
                    gap: 12
                  }}
                >
                  <div style={{ width: "40px", height: "40px", border: "3px solid var(--hairline)", borderTopColor: "var(--brand)", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
                  <span style={{ fontSize: "13px", color: "var(--muted)", fontWeight: "500" }}>Loading High-Fidelity Visualizer...</span>
                </div>
              )}
              <iframe
                src={visualizerUrl}
                sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
                style={{
                  width: "100%",
                  height: "100%",
                  border: "none",
                  backgroundColor: "#FFF"
                }}
                onLoad={() => setIframeLoading(false)}
              />
            </>
          ) : (
            <div style={{ width: "100%", height: "100%", overflow: "auto" }}>
              {fallbackComponent}
            </div>
          )}
        </div>
      </div>

      {/* Right Pane: Context Panel */}
      <div
        style={{
          flex: "0 0 40%",
          width: "40%",
          minWidth: "380px",
          height: "100%",
          backgroundColor: "var(--surface)",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Panel Tabs */}
        <div
          style={{
            display: "flex",
            borderBottom: "1px solid var(--hairline)",
            backgroundColor: "var(--surface-warm)",
            padding: "8px 12px 0 12px",
            gap: 4
          }}
        >
          {[
            { id: "what", label: "What" },
            { id: "why", label: "Why" },
            { id: "how", label: "How" },
            { id: "breaks", label: "When it breaks" },
            { id: "chat", label: "Socratic Q&A" }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveSection(tab.id)}
              style={{
                padding: "8px 12px",
                fontSize: "12.5px",
                fontWeight: "600",
                border: "none",
                background: activeSection === tab.id ? "var(--surface)" : "transparent",
                color: activeSection === tab.id ? "var(--brand)" : "var(--ink-2)",
                borderTopLeftRadius: "6px",
                borderTopRightRadius: "6px",
                borderBottom: activeSection === tab.id ? "2px solid var(--brand)" : "none",
                cursor: "pointer"
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Panel Content Area */}
        <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px" }}>
          {/* RAG Context Loader */}
          {isLoading && !socraticData && (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={{ height: "18px", width: "40%", background: "var(--bg-2)", borderRadius: "4px", animation: "pulse 1.5s infinite" }} />
              <div style={{ height: "12px", width: "100%", background: "var(--bg-2)", borderRadius: "4px", animation: "pulse 1.5s infinite" }} />
              <div style={{ height: "12px", width: "95%", background: "var(--bg-2)", borderRadius: "4px", animation: "pulse 1.5s infinite" }} />
            </div>
          )}

          {error && (
            <div style={{ padding: 12, backgroundColor: "var(--pink-soft)", borderLeft: "4px solid var(--pink)", color: "var(--pink)", fontSize: 13, marginBottom: 15 }}>
              Failed to load RAG context: {error}
            </div>
          )}

          {/* Socratic static tabs */}
          {activeSection !== "chat" && socraticData && (
            <div className="prose" style={{ fontSize: "14.5px", lineHeight: "1.65", color: "var(--ink-2)" }}>
              {activeSection === "what" && (
                <div style={{ whiteSpace: "pre-line" }}>
                  {parsed.what || "No definition content returned."}
                </div>
              )}
              {activeSection === "why" && (
                <div style={{ whiteSpace: "pre-line" }}>
                  {parsed.why || "No design and tradeoffs decisions returned."}
                </div>
              )}
              {activeSection === "how" && (
                <div style={{ whiteSpace: "pre-line" }}>
                  {parsed.how || "No operation flow returned."}
                </div>
              )}
              {activeSection === "breaks" && (
                <div style={{ whiteSpace: "pre-line" }}>
                  {parsed.breaks || "No failure and recovery information returned."}
                </div>
              )}
            </div>
          )}

          {/* Socratic Chat Interactive Tab */}
          {activeSection === "chat" && (
            <div style={{ display: "flex", flexDirection: "column", height: "100%", gap: 16 }}>
              {/* Chat Thread */}
              <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 12, minHeight: "260px" }}>
                {chatHistory.map((msg, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: msg.sender === "Apprentice" ? "flex-end" : "flex-start",
                      gap: 4
                    }}
                  >
                    <span style={{ fontSize: "10px", color: "var(--muted)", fontWeight: "600" }}>{msg.sender}</span>
                    <div
                      style={{
                        padding: "10px 14px",
                        borderRadius: "10px",
                        fontSize: "13.5px",
                        maxWidth: "85%",
                        lineHeight: "1.5",
                        backgroundColor: msg.sender === "Apprentice" ? "var(--brand-soft)" : "var(--surface-warm)",
                        color: msg.sender === "Apprentice" ? "var(--brand-2)" : "var(--ink-2)",
                        border: "1px solid var(--hairline)",
                        whiteSpace: "pre-line"
                      }}
                    >
                      {msg.text}
                    </div>

                    {/* Show references inline for professor replies */}
                    {msg.sender === "Professor" && msg.references && msg.references.length > 0 && (
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 4 }}>
                        {msg.references.map((ref) => (
                          <span
                            key={ref.id}
                            style={{
                              fontSize: "10px",
                              padding: "2px 6px",
                              backgroundColor: "var(--bg-2)",
                              borderRadius: "4px",
                              color: "var(--ink)",
                              cursor: "pointer",
                              border: "1px solid var(--hairline)"
                            }}
                            onClick={() => alert(`Source: ${ref.title}\n\n"${ref.text}"`)}
                            title={ref.text}
                          >
                            📖 {ref.title.split(":")[0]}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
                {isLoading && (
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    <span style={{ fontSize: "10px", color: "var(--muted)", fontWeight: "600" }}>Professor</span>
                    <div style={{ width: "60px", height: "30px", background: "var(--bg-2)", borderRadius: "8px", display: "flex", justifyContent: "center", alignItems: "center" }}>
                      <div style={{ width: "6px", height: "6px", background: "var(--muted)", borderRadius: "50%", margin: "0 2px", animation: "bounce 0.6s infinite alternate" }} />
                      <div style={{ width: "6px", height: "6px", background: "var(--muted)", borderRadius: "50%", margin: "0 2px", animation: "bounce 0.6s infinite alternate 0.2s" }} />
                      <div style={{ width: "6px", height: "6px", background: "var(--muted)", borderRadius: "50%", margin: "0 2px", animation: "bounce 0.6s infinite alternate 0.4s" }} />
                    </div>
                  </div>
                )}
              </div>

              {/* Chat Input */}
              <form onSubmit={handleSendMessage} style={{ display: "flex", gap: 8, borderTop: "1px solid var(--hairline)", paddingTop: 12 }}>
                <input
                  type="text"
                  placeholder="Ask a follow-up about tradeoffs..."
                  value={chatQuery}
                  onChange={(e) => setChatQuery(e.target.value)}
                  style={{
                    flex: 1,
                    padding: "8px 12px",
                    borderRadius: "8px",
                    border: "1px solid var(--hairline-2)",
                    fontSize: "13px",
                    background: "var(--surface-warm)",
                    color: "var(--ink)",
                    outline: "none"
                  }}
                />
                <button
                  type="submit"
                  disabled={isLoading}
                  style={{
                    padding: "8px 14px",
                    borderRadius: "8px",
                    backgroundColor: "var(--ink)",
                    color: "var(--bg)",
                    border: "none",
                    fontWeight: "600",
                    fontSize: "12.5px",
                    cursor: "pointer"
                  }}
                >
                  Send
                </button>
              </form>
            </div>
          )}

          {/* References for non-chat views */}
          {activeSection !== "chat" && socraticData?.references && socraticData.references.length > 0 && (
            <div style={{ marginTop: "24px", paddingTop: "16px", borderTop: "1px solid var(--hairline)" }}>
              <h3 style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--muted)", marginBottom: "8px" }}>
                📚 Recommended Readings
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                {socraticData.references.map((ref) => (
                  <div key={ref.id} style={{ fontSize: "12px", color: "var(--ink-2)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontWeight: "500" }}>• {ref.title}</span>
                    {ref.url && (
                      <a href={ref.url} target="_blank" rel="noopener noreferrer" style={{ color: "var(--brand)", textDecoration: "underline" }}>
                        View ↗
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes bounce {
          0% { transform: translateY(0); }
          100% { transform: translateY(-5px); }
        }
      `}</style>
    </div>
  );
}
