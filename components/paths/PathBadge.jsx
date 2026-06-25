"use client";

import { useEffect, useState } from "react";
import { getReadHrefs } from "@/lib/learnerStore";

// A tiny progress chip for a path card: "✓ complete" or "N/M read".
// Renders nothing until the learner has started the path (no fake data).
export default function PathBadge({ hrefs }) {
  const [done, setDone] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const load = () => {
      const set = new Set(getReadHrefs());
      setDone(hrefs.filter((h) => set.has(h)).length);
    };
    load();
    window.addEventListener("su-progress-change", load);
    return () => window.removeEventListener("su-progress-change", load);
  }, [hrefs]);

  if (!mounted || done === 0) return null;
  const complete = done >= hrefs.length;

  return (
    <span style={{ fontFamily: "var(--font-mono)", fontWeight: 600, fontSize: 10.5, letterSpacing: ".06em", color: complete ? "var(--teal)" : "var(--primary)", whiteSpace: "nowrap" }}>
      {complete ? "✓ complete" : `${done}/${hrefs.length} read`}
    </span>
  );
}
