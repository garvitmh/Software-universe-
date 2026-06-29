"use client";

import { useMemo, useState } from "react";

// A real 2-3-4 B-tree (CLRS minimum degree t=2 → each node holds 1–3 keys and
// splits at 4). Inserting keys triggers genuine splits and a growing-from-the-
// root height, so the learner watches the exact structure a database index uses
// to stay shallow. Pure functions over plain {keys, children} nodes; we clone
// on each insert so React re-renders.
const T = 2; // minimum degree
const MAX_KEYS = 2 * T - 1; // 3

function clone(node) {
  return { keys: [...node.keys], children: node.children.map(clone) };
}
function leaf() {
  return { keys: [], children: [] };
}
function isLeaf(n) {
  return n.children.length === 0;
}

function splitChild(parent, i) {
  const child = parent.children[i];
  const z = { keys: child.keys.slice(T), children: child.children.length ? child.children.slice(T) : [] };
  const median = child.keys[T - 1];
  child.keys = child.keys.slice(0, T - 1);
  if (child.children.length) child.children = child.children.slice(0, T);
  parent.children.splice(i + 1, 0, z);
  parent.keys.splice(i, 0, median);
}

function insertNonFull(node, k) {
  if (isLeaf(node)) {
    let i = node.keys.length - 1;
    while (i >= 0 && k < node.keys[i]) i--;
    node.keys.splice(i + 1, 0, k);
    return;
  }
  let i = node.keys.length - 1;
  while (i >= 0 && k < node.keys[i]) i--;
  i++;
  if (node.children[i].keys.length === MAX_KEYS) {
    splitChild(node, i);
    if (k > node.keys[i]) i++;
  }
  insertNonFull(node.children[i], k);
}

function insertKey(root, k) {
  const r = clone(root);
  if (r.keys.length === MAX_KEYS) {
    const newRoot = { keys: [], children: [r] };
    splitChild(newRoot, 0);
    insertNonFull(newRoot, k);
    return newRoot;
  }
  insertNonFull(r, k);
  return r;
}

function contains(node, k) {
  let i = 0;
  while (i < node.keys.length && k > node.keys[i]) i++;
  if (i < node.keys.length && node.keys[i] === k) return true;
  if (isLeaf(node)) return false;
  return contains(node.children[i], k);
}

function height(node) {
  if (isLeaf(node)) return 1;
  return 1 + Math.max(...node.children.map(height));
}
function countKeys(node) {
  return node.keys.length + node.children.reduce((s, c) => s + countKeys(c), 0);
}

// --- layout: assign x to leaves left→right, parent x = midpoint of children ---
const KEY_W = 30;
const PAD = 10;
const LEVEL_H = 84;
const GAP = 26;
function nodeWidth(n) {
  return n.keys.length * KEY_W + PAD * 2;
}
function layout(root) {
  let cursor = 0;
  let maxDepth = 0;
  const place = (n, depth) => {
    n._d = depth;
    if (depth > maxDepth) maxDepth = depth;
    if (isLeaf(n)) {
      n._x = cursor + nodeWidth(n) / 2;
      cursor += nodeWidth(n) + GAP;
    } else {
      n.children.forEach((c) => place(c, depth + 1));
      n._x = (n.children[0]._x + n.children[n.children.length - 1]._x) / 2;
    }
    n._y = depth * LEVEL_H + 30;
  };
  place(root, 0);
  return { width: Math.max(cursor, 200), height: (maxDepth + 1) * LEVEL_H + 20 };
}

function collect(node, nodes, edges) {
  nodes.push(node);
  node.children.forEach((c) => {
    edges.push([node, c]);
    collect(c, nodes, edges);
  });
}

export default function BTreeSim() {
  const [root, setRoot] = useState(() => ({ keys: [10, 20, 30], children: [] }));
  const [input, setInput] = useState("");
  const [flash, setFlash] = useState(null); // last-inserted key
  const [note, setNote] = useState("Three keys in one node. Add a 4th to force the first split.");

  const add = (raw) => {
    const k = parseInt(raw, 10);
    if (Number.isNaN(k)) return;
    if (contains(root, k)) {
      setNote(`${k} is already in the tree — B-tree keys are unique, like a primary-key index.`);
      setFlash(k);
      return;
    }
    const before = height(root);
    const next = insertKey(root, k);
    const after = height(next);
    setRoot(next);
    setFlash(k);
    setInput("");
    if (after > before) setNote(`Inserting ${k} overflowed a node — it split and pushed a key up, so the whole tree grew to height ${after}. The tree grows at the root, never the leaves.`);
    else setNote(`${k} slotted into a leaf. No overflow, so nothing split.`);
  };

  const addRandom = () => {
    let k;
    let tries = 0;
    do {
      k = Math.floor(Math.random() * 99) + 1;
      tries++;
    } while (contains(root, k) && tries < 50);
    add(String(k));
  };

  const reset = () => {
    setRoot({ keys: [10, 20, 30], children: [] });
    setFlash(null);
    setNote("Three keys in one node. Add a 4th to force the first split.");
  };

  const { nodes, edges, dims } = useMemo(() => {
    const r = clone(root);
    const dims = layout(r);
    const ns = [];
    const es = [];
    collect(r, ns, es);
    return { nodes: ns, edges: es, dims };
  }, [root]);

  const h = height(root);
  const total = countKeys(root);

  const btn = { fontFamily: "var(--font-body)", fontWeight: 600, fontSize: 13.5, padding: "8px 14px", borderRadius: 6, cursor: "pointer", border: "1px solid var(--border-2)", background: "var(--surface)", color: "var(--ink-2)" };

  return (
    <div style={{ border: "1px solid var(--border)", borderRadius: 8, overflow: "hidden" }}>
      {/* controls */}
      <div style={{ padding: "12px 16px", borderBottom: "1px solid var(--border)", background: "var(--surface)", display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value.replace(/[^0-9]/g, ""))}
          onKeyDown={(e) => e.key === "Enter" && add(input)}
          placeholder="a number"
          inputMode="numeric"
          style={{ width: 110, border: "1px solid var(--border-2)", background: "var(--bg)", borderRadius: 6, padding: "8px 11px", outline: "none", color: "var(--ink)", fontFamily: "var(--font-mono)", fontSize: 13.5 }}
        />
        <button onClick={() => add(input)} style={{ ...btn, border: "none", background: "var(--ink)", color: "var(--bg)" }}>Insert ▸</button>
        <button onClick={addRandom} style={btn}>Insert random</button>
        <button onClick={reset} style={btn}>Reset</button>
        <div style={{ flex: 1 }} />
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 11.5, color: "var(--ink-3)" }}>{total} keys · height {h}</span>
      </div>

      {/* tree */}
      <div style={{ background: "var(--surface-2)", overflowX: "auto", padding: "8px 0" }}>
        <svg viewBox={`0 0 ${dims.width} ${dims.height}`} width={Math.max(dims.width, 320)} height={dims.height} style={{ display: "block", margin: "0 auto", maxWidth: "100%" }}>
          {edges.map(([p, c], i) => (
            <line key={i} x1={p._x} y1={p._y + 26} x2={c._x} y2={c._y - 2} stroke="var(--border-2)" strokeWidth={1.5} />
          ))}
          {nodes.map((n, ni) => {
            const w = nodeWidth(n);
            const x0 = n._x - w / 2;
            const hot = flash != null && n.keys.includes(flash);
            return (
              <g key={ni}>
                <rect x={x0} y={n._y} width={w} height={26} rx={5} fill={hot ? "color-mix(in srgb, var(--primary) 14%, var(--bg))" : "var(--bg)"} stroke={hot ? "var(--primary)" : "var(--ink)"} strokeWidth={hot ? 1.8 : 1.2} />
                {n.keys.map((k, ki) => (
                  <g key={ki}>
                    {ki > 0 && <line x1={x0 + PAD + ki * KEY_W} y1={n._y + 4} x2={x0 + PAD + ki * KEY_W} y2={n._y + 22} stroke="var(--border-2)" strokeWidth={1} />}
                    <text x={x0 + PAD + ki * KEY_W + KEY_W / 2} y={n._y + 17} textAnchor="middle" fontFamily="var(--font-mono)" fontSize={12.5} fontWeight={k === flash ? 700 : 500} fill={k === flash ? "var(--primary)" : "var(--ink)"}>
                      {k}
                    </text>
                  </g>
                ))}
              </g>
            );
          })}
        </svg>
      </div>

      {/* narration */}
      <div style={{ padding: "11px 16px", borderTop: "1px solid var(--border)", background: "var(--surface)", display: "flex", gap: 14, alignItems: "baseline", flexWrap: "wrap" }}>
        <span style={{ fontSize: 13.5, color: "var(--ink-2)", lineHeight: 1.5, flex: 1, minWidth: 220 }}>{note}</span>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 11.5, color: "var(--primary)" }}>a lookup touches {h} node{h === 1 ? "" : "s"} = {h} disk read{h === 1 ? "" : "s"}</span>
      </div>
    </div>
  );
}
