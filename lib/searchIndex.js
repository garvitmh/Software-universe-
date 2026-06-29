// A flat, client-side index of everything you can navigate to — entries, tech
// references, guided paths, simulators, key pages, and glossary terms. Powers
// the instant "jump to" results in the Professor (⌘K). This is navigation, not
// the AI's grounded retrieval (that's the committed knowledge index).

import { ALL_CODEX_CHAPTERS, ALL_TECH } from "@/lib/curriculum";
import { PATHS } from "@/lib/paths";
import { GLOSSARY } from "@/lib/glossary";
import DSA_INDEX from "@/lib/dsa-index.json";
import { CASE_STUDY } from "@/lib/caseStudy";

const PAGES = [
  { title: "The Learn Map", href: "/learn" },
  { title: "Guided paths", href: "/paths" },
  { title: "Roles — who does what", href: "/roles" },
  { title: "The Codex — contents", href: "/codex" },
  { title: "The Simulator", href: "/simulator" },
  { title: "The Playground — run code", href: "/playground" },
  { title: "DSA Lab", href: "/dsa" },
  { title: "Burger Farm — case study", href: "/case-study" },
  { title: "The Glossary", href: "/glossary" },
];

const SIMS = [
  { title: "Load & resilience simulator", href: "/simulator" },
  { title: "The journey of an order", href: "/simulator/order-journey" },
  { title: "Ask the internet a question (live API playground)", href: "/simulator/api-playground" },
  { title: "The cart that disagrees with itself", href: "/simulator/cart-drift" },
  { title: "From 10 to 1,000,000 users", href: "/simulator/scaling" },
  { title: "The loyalty ledger", href: "/simulator/loyalty-ledger" },
  { title: "Dependency Explorer & Chaos Monkey", href: "/simulator/dependency-explorer" },
  { title: "Raft distributed consensus", href: "/simulator/raft" },
  { title: "LLM transformer internals", href: "/simulator/llm" },
  { title: "B-Tree database indexing", href: "/simulator/visualgo" },
  { title: "Big-O & sorting visualizer", href: "/simulator/complexity" },
];

export const NAV_INDEX = [
  ...PAGES.map((p) => ({ ...p, kind: "page" })),
  ...ALL_CODEX_CHAPTERS.map((c) => ({ title: c.title, href: c.href, kind: "entry" })),
  ...ALL_TECH.map((t) => ({ title: t.title, href: t.href, kind: "entry" })),
  ...PATHS.map((p) => ({ title: p.title, href: `/paths/${p.id}`, kind: "path", sub: p.subtitle })),
  ...SIMS.map((s) => ({ ...s, kind: "sim" })),
  ...DSA_INDEX.map((p) => ({ title: p.title, href: `/dsa/${p.slug}`, kind: "problem", sub: p.difficulty })),
  ...CASE_STUDY.chapters.map((c) => ({ title: `Burger Farm: ${c.title}`, href: `/case-study/${c.slug}`, kind: "page", sub: c.eyebrow })),
  ...Object.entries(GLOSSARY).map(([id, v]) => ({ title: v.term, href: "/glossary", kind: "term", sub: v.def })),
];

export function searchNav(q, limit = 8) {
  const needle = (q || "").trim().toLowerCase();
  if (needle.length < 2) return [];
  const scored = [];
  for (const e of NAV_INDEX) {
    const t = e.title.toLowerCase();
    let score = 0;
    if (t === needle) score = 100;
    else if (t.startsWith(needle)) score = 80;
    else if (t.includes(needle)) score = 60;
    else if ((e.sub || "").toLowerCase().includes(needle)) score = 28;
    if (score > 0) {
      const kindBoost = e.kind === "term" ? 0 : e.kind === "page" ? 12 : 8;
      scored.push({ ...e, score: score + kindBoost });
    }
  }
  scored.sort((a, b) => b.score - a.score || a.title.length - b.title.length);
  return scored.slice(0, limit);
}
