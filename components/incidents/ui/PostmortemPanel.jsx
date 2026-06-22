"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useIncidentContext } from "../IncidentContext";

export default function PostmortemPanel() {
  const { postmortemTemplate, activeStep, submitPostmortem, incidentType } = useIncidentContext();
  const isUnlocked = activeStep === 4;

  const [form, setForm] = useState({
    summary: "",
    rootCause: "",
    factors: "",
    lessons: "",
    actionItems: ""
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (field) => (e) => setForm(prev => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = () => {
    if (!form.summary || !form.rootCause) return;
    submitPostmortem({ ...form, submittedAt: new Date().toISOString(), incidentType });
    setSubmitted(true);
  };

  if (!isUnlocked) {
    return (
      <div className="card" style={{ padding: "24px", textAlign: "center" }}>
        <span className="eyebrow" style={{ color: "var(--muted)" }}>Google SRE Style</span>
        <h3 style={{ margin: "6px 0 12px 0", fontSize: "16px" }}>Blameless Postmortem</h3>
        <div style={{ padding: "24px", background: "var(--bg-2)", borderRadius: "10px" }}>
          <span style={{ fontSize: "32px" }}>📝</span>
          <p style={{ margin: "10px 0 0 0", fontSize: "13px", color: "var(--muted)" }}>
            Postmortem unlocks after incident is fully resolved.
          </p>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <motion.div
        className="card"
        style={{ padding: "24px", textAlign: "center" }}
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
      >
        <span style={{ fontSize: "48px" }}>🏆</span>
        <h3 style={{ margin: "12px 0 8px 0", fontSize: "20px", color: "var(--teal)" }}>
          Postmortem Submitted!
        </h3>
        <p style={{ fontSize: "13px", color: "var(--ink-2)", maxWidth: "400px", margin: "0 auto" }}>
          You've successfully completed the incident simulation. The postmortem has been logged to the SRE knowledge base.
        </p>
        <div style={{ marginTop: "16px", padding: "14px", background: "var(--teal-soft)", borderRadius: "10px", border: "1px solid rgba(15,110,86,0.2)" }}>
          <p style={{ fontSize: "13px", fontStyle: "italic", color: "var(--teal)", margin: 0 }}>
            "I understand what an incident feels like."
          </p>
        </div>
      </motion.div>
    );
  }

  const inputStyle = {
    width: "100%", background: "var(--bg-2)", border: "1px solid var(--hairline-2)",
    borderRadius: "8px", color: "var(--ink)", padding: "10px 12px", fontSize: "13px",
    fontFamily: "inherit", outline: "none", resize: "vertical", lineHeight: "1.5",
    boxSizing: "border-box"
  };

  const labelStyle = { fontSize: "11px", fontWeight: "700", color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.07em" };

  return (
    <motion.div
      className="card"
      style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "16px" }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <span className="eyebrow" style={{ color: "var(--muted)" }}>Google SRE Style</span>
          <h3 style={{ margin: "2px 0 0 0", fontSize: "16px" }}>Blameless Postmortem</h3>
          <p style={{ margin: "4px 0 0 0", fontSize: "12px", color: "var(--faint)" }}>
            Document this incident to prevent recurrence
          </p>
        </div>
        <span style={{
          fontSize: "10px", fontWeight: "700", color: "var(--teal)",
          background: "var(--teal-soft)", padding: "3px 10px", borderRadius: "999px",
          border: "1px solid rgba(15,110,86,0.2)"
        }}>
          UNLOCKED
        </span>
      </div>

      {/* Auto-fill from template */}
      {postmortemTemplate && !form.summary && (
        <button
          onClick={() => setForm({
            summary: postmortemTemplate.summary || "",
            rootCause: postmortemTemplate.rootCause || "",
            factors: (postmortemTemplate.contributingFactors || []).join("\n"),
            lessons: (postmortemTemplate.lessonsLearned || []).join("\n"),
            actionItems: (postmortemTemplate.actionItems || []).join("\n")
          })}
          style={{
            background: "var(--brand-soft)", color: "var(--brand-2)", border: "1px solid var(--brand)",
            borderRadius: "8px", padding: "8px 14px", fontSize: "12px", fontWeight: "700",
            cursor: "pointer", textAlign: "left"
          }}
        >
          ✨ Auto-fill from incident data
        </button>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        <div>
          <label style={labelStyle}>Incident Summary *</label>
          <textarea rows={2} style={{ ...inputStyle, marginTop: "6px" }} value={form.summary} onChange={handleChange("summary")} placeholder="What happened and what was the user impact?" />
        </div>
        <div>
          <label style={labelStyle}>Root Cause *</label>
          <textarea rows={2} style={{ ...inputStyle, marginTop: "6px" }} value={form.rootCause} onChange={handleChange("rootCause")} placeholder="What was the underlying cause?" />
        </div>
        <div>
          <label style={labelStyle}>Contributing Factors</label>
          <textarea rows={3} style={{ ...inputStyle, marginTop: "6px" }} value={form.factors} onChange={handleChange("factors")} placeholder="What conditions made this worse? (one per line)" />
        </div>
        <div>
          <label style={labelStyle}>Lessons Learned</label>
          <textarea rows={3} style={{ ...inputStyle, marginTop: "6px" }} value={form.lessons} onChange={handleChange("lessons")} placeholder="What did we learn? (one per line)" />
        </div>
        <div>
          <label style={labelStyle}>Action Items</label>
          <textarea rows={2} style={{ ...inputStyle, marginTop: "6px" }} value={form.actionItems} onChange={handleChange("actionItems")} placeholder="Concrete next steps to prevent recurrence" />
        </div>
      </div>

      <button
        onClick={handleSubmit}
        disabled={!form.summary || !form.rootCause}
        style={{
          background: form.summary && form.rootCause ? "var(--brand)" : "var(--bg-2)",
          color: form.summary && form.rootCause ? "#fff" : "var(--faint)",
          border: "none", borderRadius: "10px", padding: "12px 20px",
          fontSize: "14px", fontWeight: "700", cursor: form.summary && form.rootCause ? "pointer" : "not-allowed",
          transition: "all 0.2s ease"
        }}
      >
        📋 Submit Postmortem Report
      </button>
    </motion.div>
  );
}
