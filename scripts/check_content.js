// scripts/check_content.js
//
// Validates the content graph so broken cross-links can't ship silently:
//  · every related[] slug exists           · every sidebar item has content
//  · no orphan entries (unreachable)        · every domain/path href resolves
//
// Run:  node scripts/check_content.js   (exits non-zero on errors)

const fs = require("fs");
const path = require("path");
const vm = require("vm");

const ROOT = path.join(__dirname, "..");

// Load a pure-data ESM file in a sandbox (no imports, no Node globals needed).
function loadModule(relFile) {
  let src = fs.readFileSync(path.join(ROOT, relFile), "utf8");
  src = src
    .replace(/^\s*import\s[^;\n]*;?\s*$/gm, "")
    .replace(/export\s+default\s+/g, "var __default = ")
    .replace(/export\s+const\s+/g, "var ")
    .replace(/export\s+let\s+/g, "var ")
    .replace(/export\s+function\s+/g, "function ")
    .replace(/export\s*\{[^}]*\}\s*;?/g, "");
  const sandbox = {};
  vm.createContext(sandbox);
  vm.runInContext(src, sandbox);
  return sandbox;
}

const dirHasPage = (dir) =>
  ["page.jsx", "page.js", "page.tsx"].some((f) => fs.existsSync(path.join(ROOT, dir, f)));

// ── load data ──
const { TECH_CONTENT } = loadModule("lib/tech-content.js");
const { GLOSSARY } = loadModule("lib/glossary.js");
const { CODEX_PARTS, TECH_SECTIONS } = loadModule("lib/curriculum.js");
const { DOMAINS } = loadModule("lib/domains.js");
const { PATHS } = loadModule("lib/paths.js");
const { DSA_PROBLEMS } = loadModule("lib/dsa.js");

// ── build the set of valid routes ──
const techSlugs = new Set(Object.keys(TECH_CONTENT));
const chapterSlugs = new Set(CODEX_PARTS.flatMap((p) => p.chapters.map((c) => c.slug)));
const dsaSlugs = new Set((DSA_PROBLEMS || []).map((p) => p.slug));
const pathIds = new Set(PATHS.map((p) => p.id));
const simFolders = new Set(
  fs.readdirSync(path.join(ROOT, "app/simulator")).filter((f) => dirHasPage(`app/simulator/${f}`))
);
const topPages = new Set(
  fs
    .readdirSync(path.join(ROOT, "app"))
    .filter((f) => !f.startsWith("[") && f !== "api" && dirHasPage(`app/${f}`))
);

function validRoute(href) {
  if (!href || typeof href !== "string") return false;
  const clean = href.split("#")[0].split("?")[0].replace(/\/$/, "") || "/";
  if (clean === "/") return true;
  const seg = clean.split("/").filter(Boolean);
  const [a, b, c] = seg;
  if (a === "codex") {
    if (!b) return true; // /codex
    if (b === "tech") return techSlugs.has(c);
    if (b === "library") return true; // /codex/library (+ [slug])
    return chapterSlugs.has(b);
  }
  if (a === "dsa") return !b || dsaSlugs.has(b);
  if (a === "paths") return !b || pathIds.has(b);
  if (a === "simulator") return !b || simFolders.has(b);
  if (a === "worlds") return fs.existsSync(path.join(ROOT, "app/worlds")); // [slug] — slug not enumerable
  return topPages.has(a); // /learn, /glossary, /playground, /roadmap, /universe, /plan, …
}

// ── checks ──
const errors = [];
const warnings = [];

// 1. related[] and prereqs[] slugs exist (as a tech entry OR a Codex chapter)
for (const [slug, c] of Object.entries(TECH_CONTENT)) {
  for (const r of c.related || []) {
    if (!techSlugs.has(r) && !chapterSlugs.has(r)) errors.push(`entry "${slug}" → related "${r}" does not exist`);
  }
  for (const r of c.prereqs || []) {
    if (!techSlugs.has(r) && !chapterSlugs.has(r)) errors.push(`entry "${slug}" → prereq "${r}" does not exist`);
  }
  if (!c.title || !c.tagline) warnings.push(`entry "${slug}" missing title/tagline`);
}

// 2. every ready sidebar item has content; collect listed slugs
const listed = new Set();
for (const sec of TECH_SECTIONS) {
  for (const it of sec.items) {
    listed.add(it.slug);
    if (it.ready && !techSlugs.has(it.slug)) errors.push(`sidebar "${sec.id}" lists ready "${it.slug}" but no TECH_CONTENT exists`);
  }
}

// 3. orphan entries (have content but not in any sidebar section)
for (const slug of techSlugs) {
  if (!listed.has(slug)) warnings.push(`entry "${slug}" has content but is not listed in any TECH_SECTIONS (unreachable in sidebar)`);
}

// 4. domain topics
for (const d of DOMAINS) {
  for (const t of d.topics) {
    if (t.status === "live") {
      if (!t.href) errors.push(`domain "${d.id}" live topic "${t.t}" has no href`);
      else if (!validRoute(t.href)) errors.push(`domain "${d.id}" topic "${t.t}" → "${t.href}" is not a valid route`);
    }
  }
}

// 5. path steps
for (const p of PATHS) {
  for (const s of p.steps) {
    if (!validRoute(s.href)) errors.push(`path "${p.id}" step "${s.title}" → "${s.href}" is not a valid route`);
  }
}

// 6. glossary integrity
for (const [id, v] of Object.entries(GLOSSARY)) {
  if (!v.term || !v.def) errors.push(`glossary "${id}" missing term/def`);
}

// ── report ──
const stats = {
  entries: techSlugs.size,
  terms: Object.keys(GLOSSARY).length,
  chapters: chapterSlugs.size,
  paths: PATHS.length,
  domains: DOMAINS.length,
  simulators: simFolders.size,
};
console.log("content check —", JSON.stringify(stats));
for (const w of warnings) console.log("  ⚠ " + w);
for (const e of errors) console.log("  ✗ " + e);

if (errors.length) {
  console.error(`\n✗ ${errors.length} error(s), ${warnings.length} warning(s)`);
  process.exit(1);
}
console.log(`\n✓ content graph is consistent (${warnings.length} warning(s))`);
