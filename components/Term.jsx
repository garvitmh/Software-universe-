"use client";

import { useState } from "react";
import {
  useFloating, offset, flip, shift, autoUpdate,
  useHover, useFocus, useClick, useDismiss, useRole, useInteractions,
  FloatingPortal, safePolygon,
} from "@floating-ui/react";
import { motion, AnimatePresence } from "framer-motion";
import { GLOSSARY } from "@/lib/glossary";

// Inline jargon-buster. <Term id="api">API</Term> or <Term def="...">x</Term>.
// Dotted underline; hover (desktop), tap or focus (touch/keyboard) reveals a
// plain-language definition right where the doubt appears.
export default function Term({ id, def, children }) {
  const [open, setOpen] = useState(false);
  const entry = id ? GLOSSARY[id] : null;
  const title = entry?.term || null;
  const body = def || entry?.def || "";

  const { refs, floatingStyles, context } = useFloating({
    open,
    onOpenChange: setOpen,
    placement: "top",
    middleware: [offset(9), flip({ padding: 10 }), shift({ padding: 10 })],
    whileElementsMounted: autoUpdate,
  });

  const hover = useHover(context, { move: false, handleClose: safePolygon(), delay: { open: 70, close: 80 } });
  const focus = useFocus(context);
  const click = useClick(context);
  const dismiss = useDismiss(context);
  const role = useRole(context, { role: "tooltip" });
  const { getReferenceProps, getFloatingProps } = useInteractions([hover, focus, click, dismiss, role]);

  if (!body) return <span>{children}</span>;

  return (
    <>
      <span ref={refs.setReference} {...getReferenceProps()} className="term" tabIndex={0} role="button" aria-label={title || undefined}>
        {children}
      </span>
      <AnimatePresence>
        {open && (
          <FloatingPortal>
            <motion.span
              ref={refs.setFloating}
              style={floatingStyles}
              {...getFloatingProps()}
              className="term-pop"
              initial={{ opacity: 0, scale: 0.96, y: 3 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 3 }}
              transition={{ duration: 0.13, ease: [0.16, 1, 0.3, 1] }}
            >
              {title && <span className="term-pop-title">{title}</span>}
              <span className="term-pop-body">{body}</span>
              <button
                onClick={() => {
                  const termToSearch = title || (typeof children === 'string' ? children : '');
                  if (termToSearch) {
                    window.dispatchEvent(
                      new CustomEvent("search-rag-term", {
                        detail: { term: termToSearch }
                      })
                    );
                  }
                  setOpen(false);
                }}
                style={{
                  display: "block",
                  width: "100%",
                  marginTop: "10px",
                  padding: "6px 8px",
                  fontSize: "11px",
                  fontWeight: "600",
                  backgroundColor: "var(--brand-soft)",
                  color: "var(--brand-2)",
                  border: "1px solid var(--hairline)",
                  borderRadius: "6px",
                  cursor: "pointer",
                  textAlign: "center",
                  transition: "background 0.2s"
                }}
                className="term-pop-action"
              >
                ✨ Consult Professor
              </button>
            </motion.span>
          </FloatingPortal>
        )}
      </AnimatePresence>
    </>
  );
}
