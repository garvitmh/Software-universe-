// scripts/build_knowledge_index.js
//
// Builds a SMALL, deploy-safe TF-IDF search index from the content already in
// the repo (the glossary + the tech reference), so the AI assistant ("Socratic
// RAG") is grounded out of the box — without the gitignored 3GB data lake.
//
// Output: lib/knowledge/search_index.json  (committed; loaded by lib/rag_search.js)
// Run:    node scripts/build_knowledge_index.js

const fs = require("fs");
const path = require("path");
const vm = require("vm");

const ROOT = path.join(__dirname, "..");

// keep in sync with lib/rag_search.js
const STOPWORDS = new Set([
  "i","me","my","myself","we","our","ours","ourselves","you","your","yours","yourself","yourselves",
  "he","him","his","himself","she","her","hers","herself","it","its","itself","they","them","their",
  "theirs","themselves","what","which","who","whom","this","that","these","those","am","is","are",
  "was","were","be","been","being","have","has","had","having","do","does","did","doing","a","an",
  "the","and","but","if","or","because","as","until","while","of","at","by","for","with","about",
  "against","between","into","through","during","before","after","above","below","to","from","up",
  "down","in","out","on","off","over","under","again","further","then","once","here","there","when",
  "where","why","how","all","any","both","each","few","more","most","other","some","such","no",
  "nor","not","only","own","same","so","than","too","very","s","t","can","will","just","don",
  "should","now",
]);

function tokenize(text) {
  return String(text)
    .toLowerCase()
    .replace(/[^\w\s-]/g, " ")
    .split(/[\s_]+/)
    .map((w) => w.trim())
    .filter((w) => w.length > 1 && !STOPWORDS.has(w));
}

// strip our inline markup: [[id|text]] / [[id]] / `code` / **bold**
function clean(s) {
  return String(s == null ? "" : s)
    .replace(/\[\[([^\]|]+)\|([^\]]+)\]\]/g, "$2")
    .replace(/\[\[([^\]]+)\]\]/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\s+/g, " ")
    .trim();
}

// Load a single `export const NAME = …` from a pure-data ESM file via a sandbox
// (these files have no imports, so this is safe and avoids an ESM/CJS build step).
function loadExport(relFile, name) {
  let src = fs.readFileSync(path.join(ROOT, relFile), "utf8");
  src = src.replace(/export\s+const\s+/g, "var ").replace(/export\s+default\s+/g, "var __default = ");
  const sandbox = {};
  vm.createContext(sandbox);
  vm.runInContext(src + `\n;__result = (typeof ${name} !== "undefined") ? ${name} : undefined;`, sandbox);
  return sandbox.__result;
}

const chunks = [];

// ── 1. Glossary → one short chunk per term ──────────────────────────────────
const GLOSSARY = loadExport("lib/glossary.js", "GLOSSARY");
for (const [id, entry] of Object.entries(GLOSSARY || {})) {
  const text = clean(entry.def);
  if (!text) continue;
  chunks.push({
    id: `glossary-${id}`,
    source: "Software Universe — Glossary",
    category: "Concept",
    title: entry.term || id,
    text,
    url: "",
  });
}

// ── 2. Tech reference → two chunks per tech (what/why · how/breaks) ──────────
const TECH = loadExport("lib/tech-content.js", "TECH_CONTENT");
for (const [slug, c] of Object.entries(TECH || {})) {
  const arr = (x) => (Array.isArray(x) ? x : x ? [x] : []);
  const insideText = arr(c.inside).map((it) => `${it.name}: ${it.desc}`).join(" ");
  const altText = arr(c.alternatives).map((a) => `${a.name}: ${a.note}`).join(" ");

  const partA = clean([c.tagline, c.oneLiner, ...arr(c.what), ...arr(c.why), insideText, altText].filter(Boolean).join(" "));
  const partB = clean([...(c.howWeUse ? arr(c.howWeUse.body) : []), c.breaks, c.scale].filter(Boolean).join(" "));

  if (partA) chunks.push({ id: `tech-${slug}-a`, source: `Tech Reference — ${c.title}`, category: c.category || "Technology", title: `${c.title}`, text: partA, url: `/codex/tech/${slug}` });
  if (partB) chunks.push({ id: `tech-${slug}-b`, source: `Tech Reference — ${c.title}`, category: c.category || "Technology", title: `${c.title} — how it works & when it breaks`, text: partB, url: `/codex/tech/${slug}` });
}

// ── 3. TF per chunk + document frequencies ──────────────────────────────────
const docFreq = {};
for (const ch of chunks) {
  const tokens = tokenize(`${ch.title} ${ch.text}`);
  const tf = {};
  for (const tok of tokens) tf[tok] = (tf[tok] || 0) + 1;
  ch.tf = tf;
  for (const term of Object.keys(tf)) docFreq[term] = (docFreq[term] || 0) + 1;
}

// ── 4. IDF map ──────────────────────────────────────────────────────────────
const N = chunks.length || 1;
const idfMap = {};
for (const [term, df] of Object.entries(docFreq)) {
  idfMap[term] = Math.log(1 + N / df);
}

// ── 5. Write ────────────────────────────────────────────────────────────────
const outDir = path.join(ROOT, "lib", "knowledge");
fs.mkdirSync(outDir, { recursive: true });
const outPath = path.join(outDir, "search_index.json");
fs.writeFileSync(outPath, JSON.stringify({ builtAt: "static", chunks, idfMap }, null, 0));

console.log(`✓ Knowledge index built: ${chunks.length} chunks, ${Object.keys(idfMap).length} terms`);
console.log(`  → ${path.relative(ROOT, outPath)} (${(fs.statSync(outPath).size / 1024).toFixed(1)} KB)`);
