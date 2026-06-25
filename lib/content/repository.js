// ─────────────────────────────────────────────────────────────────────────────
// The content repository — the single data-access layer for everything the app
// knows. Pages, API routes, and the search all go through here instead of
// reaching into the raw data files. That's the seam: today it reads committed
// JS data; tomorrow it could read a database, and not a single caller changes.
// ─────────────────────────────────────────────────────────────────────────────

import { TECH_CONTENT } from "@/lib/tech-content";
import { ALL_TECH, ALL_CODEX_CHAPTERS } from "@/lib/curriculum";
import { GLOSSARY } from "@/lib/glossary";
import { PATHS } from "@/lib/paths";
import { DOMAINS, DOMAIN_LADDER, CURRICULUM_STATS } from "@/lib/domains";
import { readingMinutes } from "@/lib/readingTime";

function summarize(c) {
  return {
    slug: c.slug,
    title: c.title,
    category: c.category,
    color: c.color,
    href: `/codex/tech/${c.slug}`,
    tagline: c.tagline || "",
    oneLiner: c.oneLiner || "",
    readMinutes: readingMinutes(c),
    related: c.related || [],
  };
}

// ── Entries (the tech reference) ──
export function listEntries({ category, q } = {}) {
  let items = Object.values(TECH_CONTENT).map(summarize);
  if (category) items = items.filter((e) => e.category.toLowerCase() === category.toLowerCase());
  if (q) {
    const n = q.toLowerCase();
    items = items.filter((e) => e.title.toLowerCase().includes(n) || e.tagline.toLowerCase().includes(n) || e.oneLiner.toLowerCase().includes(n));
  }
  return items;
}

export function getEntry(slug) {
  return TECH_CONTENT[slug] || null;
}

export function listCategories() {
  const map = new Map();
  for (const c of Object.values(TECH_CONTENT)) map.set(c.category, (map.get(c.category) || 0) + 1);
  return [...map.entries()].map(([name, count]) => ({ name, count }));
}

// ── Codex chapters (the system, narrated) ──
export function listChapters() {
  return ALL_CODEX_CHAPTERS.map((c) => ({ slug: c.slug, title: c.title, href: c.href, group: c.group }));
}

// ── Glossary ──
export function getGlossary({ q } = {}) {
  let items = Object.entries(GLOSSARY).map(([id, v]) => ({ id, term: v.term, def: v.def, more: v.more || null }));
  if (q) {
    const n = q.toLowerCase();
    items = items.filter((e) => e.term.toLowerCase().includes(n) || e.def.toLowerCase().includes(n));
  }
  return items.sort((a, b) => a.term.localeCompare(b.term, "en", { sensitivity: "base" }));
}

// ── Guided paths ──
export function listPaths() {
  return PATHS.map((p) => ({ id: p.id, title: p.title, subtitle: p.subtitle, blurb: p.blurb, steps: p.steps.length, href: `/paths/${p.id}` }));
}

export function getPath(id) {
  return PATHS.find((p) => p.id === id) || null;
}

// ── Domains (the map) ──
export function listDomains() {
  return DOMAINS.map((d) => {
    const live = d.topics.filter((t) => t.status === "live").length;
    return { id: d.id, title: d.title, tagline: d.tagline, live, total: d.topics.length, ladder: DOMAIN_LADDER[d.id] || [] };
  });
}

// ── Cross-content search (entries + glossary) ──
export function search(q, limit = 12) {
  const n = (q || "").trim().toLowerCase();
  if (n.length < 2) return [];
  const out = [];
  for (const c of Object.values(TECH_CONTENT)) {
    const hay = `${c.title} ${c.tagline || ""} ${c.oneLiner || ""}`.toLowerCase();
    if (hay.includes(n)) out.push({ kind: "entry", title: c.title, href: `/codex/tech/${c.slug}`, category: c.category });
  }
  for (const v of Object.values(GLOSSARY)) {
    if (v.term.toLowerCase().includes(n)) out.push({ kind: "term", title: v.term, href: "/glossary", excerpt: v.def });
  }
  for (const p of PATHS) {
    if (`${p.title} ${p.subtitle}`.toLowerCase().includes(n)) out.push({ kind: "path", title: p.title, href: `/paths/${p.id}` });
  }
  return out.slice(0, limit);
}

// ── Whole-library stats ──
export function stats() {
  return {
    entries: Object.keys(TECH_CONTENT).length,
    chapters: ALL_CODEX_CHAPTERS.length,
    terms: Object.keys(GLOSSARY).length,
    paths: PATHS.length,
    domains: DOMAINS.length,
    topicsLive: CURRICULUM_STATS.live,
    topicsSoon: CURRICULUM_STATS.soon,
  };
}
