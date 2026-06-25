// scripts/build_embeddings.js
//
// Computes a neural embedding for every chunk in the committed TF-IDF index and
// writes them (int8-quantized) to lib/knowledge/embeddings.json. The Professor
// then ranks by semantic similarity (lib/embeddings_search.js), falling back to
// TF-IDF if the model or this file is unavailable — so it's deploy-safe.
//
// Run:  node scripts/build_embeddings.js   (prebuild runs it with `|| true`)

const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const MODEL = "Xenova/all-MiniLM-L6-v2";
const SCALE = 127;

async function main() {
  const idxPath = path.join(ROOT, "lib", "knowledge", "search_index.json");
  if (!fs.existsSync(idxPath)) {
    console.log("embeddings: no search_index.json yet — skipping");
    return;
  }
  const idx = JSON.parse(fs.readFileSync(idxPath, "utf8"));
  const chunks = idx.chunks || [];
  if (!chunks.length) {
    console.log("embeddings: no chunks — skipping");
    return;
  }

  const { pipeline, env } = await import("@huggingface/transformers");
  env.allowLocalModels = false;
  const extractor = await pipeline("feature-extraction", MODEL);

  const ids = [];
  const vectors = [];
  for (const ch of chunks) {
    const text = `${ch.title}. ${ch.text}`.slice(0, 2000);
    const out = await extractor(text, { pooling: "mean", normalize: true });
    const v = Array.from(out.data).map((x) => Math.max(-127, Math.min(127, Math.round(x * SCALE))));
    ids.push(ch.id);
    vectors.push(v);
  }

  const outPath = path.join(ROOT, "lib", "knowledge", "embeddings.json");
  fs.writeFileSync(outPath, JSON.stringify({ model: MODEL, dim: vectors[0].length, scale: SCALE, ids, vectors }));
  console.log(`✓ embeddings: ${ids.length} vectors × ${vectors[0].length} dims → ${(fs.statSync(outPath).size / 1024).toFixed(1)} KB`);
}

main().catch((e) => {
  console.error("embeddings build failed (Professor will use TF-IDF):", e.message);
  process.exit(1);
});
