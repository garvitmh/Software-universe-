// scripts/build_dsa_index.js
//
// Writes a lightweight index of every DSA problem (slug / title / difficulty /
// pattern) to lib/dsa-index.json, so the ⌘K nav search can offer problems
// WITHOUT pulling the heavy problem content (figure-it-out, Java, etc.) into the
// client bundle. Runs in prebuild.

const fs = require("fs");
const path = require("path");
const vm = require("vm");

const ROOT = path.join(__dirname, "..");

function loadModule(relFile) {
  let src = fs.readFileSync(path.join(ROOT, relFile), "utf8");
  src = src
    .replace(/^\s*import\s[^;\n]*;?\s*$/gm, "")
    .replace(/export\s+default\s+/g, "var __default = ")
    .replace(/export\s+const\s+/g, "var ")
    .replace(/export\s+let\s+/g, "var ")
    .replace(/export\s+function\s+/g, "function ")
    .replace(/export\s*\{[^}]*\}\s*;?/g, "");
  const sb = {};
  vm.createContext(sb);
  vm.runInContext(src, sb);
  return sb;
}

function loadDsa() {
  let all = [...(loadModule("lib/dsa.js").DSA_PROBLEMS || [])];
  const dir = path.join(ROOT, "lib", "dsa");
  if (fs.existsSync(dir)) {
    for (const f of fs.readdirSync(dir).filter((x) => x.endsWith(".js"))) {
      let sb;
      try {
        sb = loadModule(`lib/dsa/${f}`);
      } catch (e) {
        continue; // skip a malformed / mid-write file
      }
      for (const k of Object.keys(sb)) {
        const v = sb[k];
        if (Array.isArray(v) && v[0] && v[0].slug && v[0].pattern) all = all.concat(v);
      }
    }
  }
  return all;
}

const idx = loadDsa().map((p) => ({ slug: p.slug, title: p.title, difficulty: p.difficulty, pattern: p.pattern }));
fs.writeFileSync(path.join(ROOT, "lib", "dsa-index.json"), JSON.stringify(idx));
console.log(`✓ DSA index: ${idx.length} problems → lib/dsa-index.json`);
