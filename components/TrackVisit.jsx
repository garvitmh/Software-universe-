"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { recordVisit } from "@/lib/learnerStore";
import { ALL_CODEX_CHAPTERS, ALL_TECH } from "@/lib/curriculum";

// Path → friendly title, built once from the curriculum.
const TITLES = {};
for (const c of ALL_CODEX_CHAPTERS) TITLES[c.href] = c.title;
for (const t of ALL_TECH) TITLES[t.href] = t.title;

// Records the current Codex entry into the learner store, so the landing can
// offer "continue reading". Renders nothing.
export default function TrackVisit() {
  const path = usePathname();
  useEffect(() => {
    const title = TITLES[path];
    if (title) recordVisit({ title, href: path, kind: "codex" });
  }, [path]);
  return null;
}
