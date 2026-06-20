"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// A predicted-confusion catcher. Use it exactly where a beginner trips:
//   <Aside q="Wait — what's a 'server'?">A server is just a computer…</Aside>
// Collapsed by default so it never clutters; one tap clears the doubt in place.
export default function Aside({ q, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className={`bf-aside${open ? " open" : ""}`}>
      <button className="bf-aside-q" onClick={() => setOpen((v) => !v)} aria-expanded={open}>
        <span className="bf-aside-mark" aria-hidden>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" style={{ transform: open ? "rotate(90deg)" : "none", transition: "transform .18s ease" }}><path d="M9 6l6 6-6 6" /></svg>
        </span>
        <span>{q}</span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            className="bf-aside-body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            style={{ overflow: "hidden" }}
          >
            <div className="bf-aside-inner">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
