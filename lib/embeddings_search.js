// lib/embeddings_search.js
//
// Semantic retrieval for the Professor: embed the query with the same model
// used at build time (transformers.js), then cosine-rank against the committed
// int8 vectors. Everything is wrapped so it returns null on any failure (no
// model, no embeddings file, runtime can't load the package) — the caller then
// falls back to TF-IDF (lib/rag_search.js). Deploy-safe by construction.

const fs = require("fs");
const path = require("path");

const MODEL = "Xenova/all-MiniLM-L6-v2";

let embCache = null; // false = unavailable; object = loaded
let pipePromise = null;

function loadEmb() {
  if (embCache !== null) return embCache;
  try {
    const embPath = path.join(process.cwd(), "lib", "knowledge", "embeddings.json");
    const idxPath = path.join(process.cwd(), "lib", "knowledge", "search_index.json");
    if (!fs.existsSync(embPath) || !fs.existsSync(idxPath)) {
      embCache = false;
      return false;
    }
    const raw = JSON.parse(fs.readFileSync(embPath, "utf8"));
    const idx = JSON.parse(fs.readFileSync(idxPath, "utf8"));
    const byId = {};
    for (const ch of idx.chunks || []) byId[ch.id] = ch;
    embCache = { scale: raw.scale || 127, ids: raw.ids || [], vectors: raw.vectors || [], byId };
    if (!embCache.ids.length) embCache = false;
    return embCache;
  } catch (e) {
    embCache = false;
    return false;
  }
}

async function getPipe() {
  if (pipePromise) return pipePromise;
  pipePromise = (async () => {
    const { pipeline, env } = await import("@huggingface/transformers");
    env.allowLocalModels = false;
    return pipeline("feature-extraction", MODEL);
  })();
  return pipePromise;
}

async function embedQuery(text) {
  const pipe = await getPipe();
  const out = await pipe(text, { pooling: "mean", normalize: true });
  return Array.from(out.data);
}

// Returns ranked references like searchRAG, or null if embeddings are unavailable.
async function searchByEmbedding(query, limit = 4) {
  const emb = loadEmb();
  if (!emb) return null;

  let qVec;
  try {
    qVec = await embedQuery(query);
  } catch (e) {
    return null;
  }
  if (!qVec || qVec.length === 0) return null;

  const inv = 1 / emb.scale;
  const scored = [];
  for (let i = 0; i < emb.ids.length; i++) {
    const v = emb.vectors[i];
    let dot = 0;
    for (let d = 0; d < qVec.length; d++) dot += qVec[d] * v[d] * inv;
    scored.push({ id: emb.ids[i], score: dot });
  }
  scored.sort((a, b) => b.score - a.score);

  return scored.slice(0, limit).map((s) => {
    const ch = emb.byId[s.id] || {};
    return { id: s.id, source: ch.source, category: ch.category, title: ch.title, text: ch.text, url: ch.url, score: s.score };
  });
}

module.exports = { searchByEmbedding };
