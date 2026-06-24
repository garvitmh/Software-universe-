# 03 — Interactive & Visualization System (SEE + PRACTICE)

> Master-plan section. Owns the **SEE** pillar (simulators/visualizers) and the **PRACTICE**
> pillar (in-browser code sandbox). Implementation-ready, grounded in the existing repo.
>
> **Grounding (real files read):** `components/ScalingSim.jsx`, `components/SecuritySim.jsx`,
> `components/SplitPaneViewer.jsx`, `components/order-journey/TimelineControls.jsx`,
> `components/home/Hero3D.jsx` + `components/home/HomeHero.jsx` (dynamic import, `ssr:false`),
> `app/simulator/page.jsx`, `app/simulator/{raft,visualgo,llm}/page.jsx`, `app/globals.css` (tokens).
> Installed libs: `framer-motion@11.11.17`, `@xyflow/react@12`, `d3@7`, `three@0.169` +
> `@react-three/fiber@8` + `drei@9`, `lenis`. JS only (no TS). Next 14 App Router.

---

## 0. Current state & the three problems this section solves

What exists today is a set of **bespoke, hand-rolled** sims (`ScalingSim`, `SecuritySim`,
`OrderJourney`, `CartDriftSim`, `LoyaltyLedgerSim`, `DependencyExplorer`). They are good, but:

1. **No shared shell.** Each sim re-implements play/pause/step/reset/speed inline
   (`order-journey/TimelineControls.jsx` is the most complete; `ScalingSim` has none).
   Every new sim copy-pastes scrub logic. This does not scale to ~40 sims.
2. **Three sims are external iframes** (`raft.github.io`, `bbycroft.net`/llm, `visualgo.net`)
   via `SplitPaneViewer`. These are **X-Frame-Options / frame-ancestors blocked** on many hosts,
   break the Warm-Farm theme, and can vanish. They must be owned.
3. **No PRACTICE pillar exists at all.** There is no code editor and no execution sandbox.
   The "now you try" promise of the vision is currently unmet.

This section fixes all three: a reusable **SimShell framework**, an owned **simulator catalog**,
and a **Pyodide + sandboxed-iframe code sandbox**.

---

## 1. SIMULATOR / VISUALIZER CATALOG

One sim per major concept. Columns: **Concept** · **What the user SEES** ·
**Interaction** · **Build approach** (React-state / SVG / Canvas2D / D3 / R3F / React Flow).

Build-approach rule of thumb used throughout:
- **≤ ~50 animated elements, crisp shapes, needs DOM/a11y** → **SVG + framer-motion**.
- **100s–10,000s of particles, per-frame redraw** → **Canvas2D** (rAF loop).
- **Graph/topology with nodes+edges+pan/zoom** → **React Flow** (`@xyflow/react`, already in).
- **Force/tree/scale layouts & axes** → **D3** for math only, render via SVG/Canvas (already used in `order-journey/Graph*`).
- **Genuine spatial depth earns it** → **R3F** (rare; see §4).

### A. Foundations — Algorithms & Data Structures

| Sim | Concept | SEES | Interaction | Build |
|---|---|---|---|---|
| **SortLab** | Sorting (bubble/insertion/merge/quick/heap) | Bars re-ordering; compare/swap highlighted; live comparison + swap counters | Pick algo, play/pause/**step**, speed, randomize/size slider | Canvas2D bars + SVG overlay; React-state engine emits step-frames |
| **DSViz: Array & List** | Contiguous vs linked memory | Boxes with indices vs nodes with `next` pointers; insert mid-list shifts vs re-points | Insert/delete at index, drag value | SVG + framer-motion layout |
| **DSViz: Stack & Queue** | LIFO / FIFO, ring buffer | Push/pop animation; queue head/tail pointers wrap | Buttons push/pop/enqueue/dequeue | SVG + framer-motion |
| **TreeViz (BST/AVL)** | Tree insert, rotation, balance | Nodes appear, rotations animate, height/balance-factor labels | Insert/delete value, toggle auto-balance | D3 tree layout → SVG, framer-motion on transforms |
| **HeapViz** | Binary heap + sift up/down | Array-and-tree dual view; bubble path highlighted | Insert, extract-min, heapify | SVG dual-pane |
| **GraphViz + traversal** | BFS/DFS, Dijkstra | Nodes/edges; frontier + visited recolor; queue/stack/PQ sidebar | Build graph (drag), pick source, step traversal | **React Flow** (graph) + state engine |
| **HashTableViz** | Buckets, hashing, collisions, resize | Slots filling; collision → chain/probe; load-factor bar; rehash on resize | Insert key, choose chaining vs open-addressing | SVG + framer-motion |
| **BTreeViz** | Disk-oriented multi-way index, node split | Wide nodes; insert → overflow → **split + promote**; disk-page framing | Insert/delete, order(k) slider | SVG (replaces visualgo iframe — §5) |
| **BigOGrower** | Growth rates O(1…n!) | Live log-scale curves; "ops at n=…" readout; race-to-finish bars | n slider, toggle curves, "race" play | D3 scales → SVG |
| **RecursionStack** | Call stack, recursion, base case | Stack frames push/pop; tree of calls (e.g. fib, factorial, Hanoi) | Step in/out, change input | SVG frames + framer-motion |

### B. Machine & Systems (CS core)

| Sim | Concept | SEES | Interaction | Build |
|---|---|---|---|---|
| **CPUPipeline** | Fetch/decode/exec/mem/WB, hazards, stalls | 5-stage pipeline grid; instructions flow; bubbles on hazard | Step cycles, inject dependency, toggle forwarding | SVG grid + framer-motion |
| **MemoryHierarchy / Cache** | L1/L2/RAM/disk latency, hit/miss, locality | Access animates down levels; hit=green, miss=red; latency meter | Access pattern (sequential/random/stride), cache-size slider | Canvas2D + SVG meters |
| **OSScheduler** | FCFS/RR/SJF/priority, context switch | Gantt chart builds; ready-queue; turnaround/wait stats | Add processes (burst/arrival), pick policy, quantum slider, step | SVG Gantt + D3 time scale |
| **ThreadsLocksDeadlock** | Race condition, mutex, deadlock | 2 threads incrementing a shared counter; with/without lock; **deadlock = wait-for cycle** | Toggle lock, "interleave" stepper, force deadlock | SVG lanes + framer-motion |

### C. Networking

| Sim | Concept | SEES | Interaction | Build |
|---|---|---|---|---|
| **TCPHandshake** | 3-way handshake, seq/ack, teardown | Client/server timeline; SYN/SYN-ACK/ACK packets travel; state labels | Step, **drop a packet** → retransmit | SVG sequence diagram + framer-motion packets |
| **DNSResolver** | Recursive resolution + caching | Query hops resolver→root→TLD→authoritative; cache hit shortcut | Type a domain, toggle cache, step | React Flow (hops) + SVG |
| **TLSHandshake** | ClientHello→cert→key exchange→encrypted | Messages exchange; lock closes when secure; cert chain panel | Step, "tamper cert" → fail | SVG sequence + framer-motion |
| **PacketRouting** | Hops, routing tables, congestion | Grid of routers; packet finds path; congested link reroutes | Drag src/dst, kill a link, send burst | React Flow / Canvas2D |

### D. Databases

| Sim | Concept | SEES | Interaction | Build |
|---|---|---|---|---|
| **IndexSeek** | Full scan vs B-tree index | Side-by-side: scan touches every row vs index descends; rows-read counter | Toggle index, run query, row-count slider | SVG (reuses BTreeViz) |
| **TxnMVCC** | Isolation levels, MVCC versions, dirty/phantom reads | Two transaction timelines; row versions stack; anomaly flagged | Pick isolation level, interleave ops, commit/rollback | SVG timelines |
| **ReplicationLag** | Leader→follower, sync vs async, stale read | Writes flow to followers with lag bar; read hits stale replica | Toggle sync/async, latency slider, read-after-write | SVG + framer-motion |
| **ShardingRouter** | Hash vs range sharding, hot shard, rebalancing | Keys routed to shards; hot shard reddens; add shard → resharding | Insert keys, add/remove shard, pick strategy | SVG + D3 |

### E. Distributed Systems

| Sim | Concept | SEES | Interaction | Build |
|---|---|---|---|---|
| **RaftConsensus** | Leader election, log replication, split-brain | Node ring with states (follower/candidate/leader); heartbeats; term counter; **partition → split-brain → heal** | Kill leader, partition cluster, step election, commit entry | React Flow ring + framer-motion (replaces raft iframe — §5) |
| **QuorumCAP** | Quorum reads/writes, R+W>N, CAP | N replicas; pick R/W; show whether consistent; partition forces C-vs-A | R/W/N sliders, partition toggle | SVG |
| **LeaderElection** | Bully / ring election | Nodes vote; highest id wins; failure re-elects | Kill node, trigger election | React Flow (shares Raft node component) |

### F. System Design (extend the existing ScalingSim)

| Sim | Concept | SEES | Interaction | Build |
|---|---|---|---|---|
| **ScalingSim v2** | 10→1M users, when each layer is needed | *(extend existing)* topology graph that **grows** (LB→copies→cache→replicas→queue→CDN); live latency/throughput; cost bar | keep slider + toggles; add animated topology + cost + **inject traffic spike** | upgrade current React-state sim with React Flow topology + framer-motion |
| **LoadBalancer** | RR / least-conn / IP-hash, health checks | Requests fan to backends; one goes unhealthy → drained | Pick algorithm, kill a backend, RPS slider | SVG + framer-motion |
| **CacheLab** | Cache-aside, TTL, eviction (LRU/LFU), stampede | Hit/miss stream; eviction animates; **thundering herd** on expiry | Pick policy, size, TTL, hit-rate slider | SVG + Canvas2D stream |
| **QueueBackpressure** | Producer/consumer, buffering, backpressure, DLQ | Queue depth bar fills/drains; consumers lag; overflow → drop/DLQ | Producer-rate vs consumer-rate sliders, add consumer | SVG + framer-motion |
| **RateLimiter** | Token bucket / leaky bucket / sliding window | Tokens refill; request allowed/429; window slides | Refill-rate + burst sliders, spam button | SVG (lift the bucket viz already in `SecuritySim`) |

### G. Security

| Sim | Concept | SEES | Interaction | Build |
|---|---|---|---|---|
| **InjectionLab** | XSS, CSRF, SQLi (safe, simulated) | Input field → sandboxed "render"; payload escapes or is neutralized; SQLi shows query string mutate | Type payload, toggle sanitization/parameterization | React-state + sandboxed render frame (no real eval) |
| **HashingLab** | Hash vs encrypt, salt, avalanche | Type text → digest; one-char change → totally different digest; rainbow-table vs salt | Type input, toggle salt, pick algo | Web Crypto (`crypto.subtle`) + SVG |
| **JWTAnatomy** | header.payload.signature, tamper detection | 3 colored segments; edit payload → signature mismatch → rejected | Edit claims, change key, verify | React-state (generalize existing `SecuritySim` JWT block) |

### H. AI / ML

| Sim | Concept | SEES | Interaction | Build |
|---|---|---|---|---|
| **Perceptron** | Weights, bias, decision boundary | 2D points; line separates classes; updates on misclassify | Add points, learning-rate slider, step training | Canvas2D + SVG line |
| **GradientDescent** | Loss surface, steps, learning rate | 3D bowl (or 2D contour) with a ball rolling to minimum; LR too-high diverges | LR slider, start point, step, toggle 2D/3D | 2D: D3 contour + SVG; 3D: **R3F** (one of the few earned 3D uses, §4) |
| **NeuralNetViz** | Layers, forward pass, activations | Network graph; signal lights up neurons layer by layer; weights as edge thickness | Pick input, step forward pass, node count sliders | React Flow / SVG |
| **TransformerAttention** | Tokenize → embed → self-attention → next token | Token strip; **attention heatmap** (which tokens attend to which); logits → sampled token | Type a short prompt, step layers, hover a token to see its attention row | SVG heatmap + framer-motion (replaces llm iframe — §5) |
| **TokenizerLab** | BPE/subword tokenization | Text splits into colored tokens; merge rules; token count + id | Type text, toggle whitespace/merges | React-state + SVG chips |

> **Total: ~40 sims.** Plus the existing flagship/state/money sims (`OrderJourney`,
> `CartDrift`, `LoyaltyLedger`, `DependencyExplorer`) which get **migrated onto SimShell**
> but otherwise stay.

### 1.1 RANKED SHORTLIST — first 12 (teaching-impact × low-effort, high first)

Chosen for: maximal concept coverage, reuse of the framework, and unblocking the iframe replacements.

| # | Sim | Why first |
|---|---|---|
| 1 | **SortLab** | The canonical "see the algorithm" win; proves SimShell step/speed; pure Canvas |
| 2 | **BigOGrower** | Tiny effort, huge intuition payoff; D3 scales only |
| 3 | **RecursionStack** | Cements call-stack mental model; reused by sandbox tracebacks |
| 4 | **TreeViz (BST)** | Foundational DS; reused by BTree/Heap |
| 5 | **HashTableViz** | High-impact, self-contained |
| 6 | **GraphViz + BFS/DFS** | Proves React Flow integration; reused by Dijkstra/networking |
| 7 | **ScalingSim v2** | Extends existing flagship; instant credibility |
| 8 | **CacheLab** | Core system-design concept; pairs with ScalingSim |
| 9 | **RateLimiter** | Lift existing `SecuritySim` bucket; fast |
| 10 | **TCPHandshake** | Best "packets travel" demo; reusable sequence-diagram primitive |
| 11 | **BTreeViz** | **Replaces visualgo iframe** (§5) |
| 12 | **TransformerAttention** | **Replaces llm iframe** (§5); flagship AI piece |

(**RaftConsensus** replaces the raft iframe and is #13 — first item of Phase 4, because it
needs the React Flow node primitives proven by GraphViz #6.)

---

## 2. VISUALIZATION FRAMEWORK — `<SimShell>` + conventions

Goal: a new sim = **one engine function + one render function**, ~150 lines, theme-correct,
accessible, with playback for free. Lives in `components/sim-kit/`.

### 2.1 The state-machine pattern (the core idea)

Every sim is modeled as a **deterministic sequence of frames**. The author writes a pure
**reducer** that, given `(state, params)`, produces the *next* frame. SimShell owns the clock,
the index, scrubbing, and replay. This is the generalization of the proven
`order-journey/TimelineControls.jsx` scrub model.

```js
// components/sim-kit/createSimEngine.js
// A sim author provides:
//   init(params) -> initialState
//   step(state, params) -> { state, done }   // pure, deterministic
//   (optional) frames(params) -> [frame...]  // for fully precomputable sims (sorting)
export function createSimEngine({ init, step, frames }) { /* normalizes to a frame array + cursor */ }
```

Two flavors, both supported:
- **Precomputed** (sorting, Big-O, recursion): author returns the whole `frames` array up front;
  SimShell just indexes it. Scrubbing is O(1).
- **Live** (Raft, queues, schedulers): author gives `init`/`step`; SimShell calls `step` on a
  rAF/timer tick. Scrubbing replays from a snapshot.

### 2.2 `<SimShell>` API

```jsx
<SimShell
  title="Sorting"
  engine={engine}                 // from createSimEngine
  params={params}                 // current control values (object)
  controls={[                     // declarative control bar — auto-rendered
    { type:'select', key:'algo', label:'Algorithm', options:[...] },
    { type:'slider', key:'size', label:'Items', min:8, max:120, step:1 },
    { type:'toggle', key:'sound', label:'Sound' },
    { type:'button', key:'shuffle', label:'Shuffle', onClick: ... },   // injection
  ]}
  onParams={setParams}
  speedPresets={[0.5, 1, 2, 4]}   // default
  defaultSpeed={1}
  render={(frame, ctx) => <SortCanvas frame={frame} />}   // pure view of one frame
  legend={[{ color:'var(--teal)', label:'sorted' }, ...]}
  caption="What you're looking at…"     // 1-2 lines under the stage
  rightPanel={<WhyWhenItBreaks .../>}   // optional teaching pane (see §2.6)
/>
```

SimShell renders, top-to-bottom:
1. **Stage** (the `render` output) on `--bg-2`, rounded `--radius-lg`, `--hairline` border.
2. **Transport bar** — Play/Pause · Step◀ · Step▶ · Reset · Speed segmented control ·
   scrub slider (`Event N of M`). Lifted *verbatim in behavior* from `TimelineControls.jsx`
   so it already matches the house style (`btn btn-primary`, `accentColor:'var(--brand)'`).
3. **Control bar** — auto-rendered from the `controls` array (sliders/selects/toggles/inject buttons).
4. **Legend** + **caption**.
5. Optional **rightPanel** (40% split, à la `SplitPaneViewer`) for "Why / When it breaks / Ask".

### 2.3 Animation tokens (framer-motion)

Centralize so every sim feels the same. `components/sim-kit/motion.js`:

```js
export const SIM_SPRING = { type:'spring', stiffness:340, damping:30, mass:0.7 };
export const SIM_EASE   = [0.4, 0, 0.2, 1];            // matches existing inline easings
export const dur = { fast:0.18, base:0.32, slow:0.6 }; // seconds
// Speed multiplier from SimShell scales transition.duration so "4×" actually feels 4×.
```

### 2.4 Theming — **mandatory, zero hardcoded colors**

Reuse the existing token set (verified in `app/globals.css`): structure on `--bg-2 / --surface /
--hairline`; semantic state via `--teal`/`--teal-soft` (good/sorted/hit), `--amber`/`--amber-soft`
(warn/slow), `--brand`/`--brand-2`/`--brand-soft` (active/primary), `--pink`/pink-soft (error/fail).
Provide `components/sim-kit/palette.js` mapping semantic roles → tokens so sims never inline hex.
This guarantees light/dark parity (the dark block at `globals.css:45+` redefines the same vars).

### 2.5 Accessibility & reduced-motion (**current gap — there is no `prefers-reduced-motion` rule today**)

- SimShell reads `useReducedMotion()` (framer-motion). When reduced: transitions snap (duration 0),
  auto-play defaults **off**, sims become **step-only**. Add a global
  `@media (prefers-reduced-motion: reduce)` guard in `globals.css` too.
- Transport buttons: real `<button>` with `aria-label`, `aria-pressed` on Play.
- Scrub slider: native `<input type=range>` with `aria-valuetext="Step N of M"`.
- Canvas sims expose an `aria-live="polite"` status line ("Comparing 5 and 9 — swapping").
- Color is never the only signal: pair color with icon/label (matches existing legend style).
- Honor keyboard: Space=play/pause, ←/→ = step, R = reset (documented, focus-trapped to stage).

### 2.6 Reusable primitives shipped with the kit

`components/sim-kit/`: `SimShell.jsx`, `createSimEngine.js`, `Transport.jsx`,
`ControlBar.jsx` (slider/select/toggle/button renderers), `Legend.jsx`, `Stage.jsx`,
`SequenceDiagram.jsx` (TCP/TLS/DNS), `NodeRing.jsx` (Raft/election), `BarCanvas.jsx` (sorting/heap),
`Heatmap.jsx` (attention), `motion.js`, `palette.js`, `useReducedMotionSafe.js`.
Each new sim then becomes `app/simulator/<slug>/page.jsx` (a `"use client"` thin wrapper) +
`components/sims/<Name>.jsx` (engine + render), exactly mirroring today's
`app/simulator/scaling/page.jsx → components/ScalingSim.jsx` structure.

---

## 3. CODE SANDBOX (PRACTICE) — run Python & JS in-browser

The missing pillar. Two runtimes, one editor, one results console. Lives in
`components/sandbox/` + `app/practice/[slug]/page.jsx`.

### 3.1 Editor
- **CodeMirror 6** (`@codemirror/state`, `@codemirror/view`, `@codemirror/lang-python`,
  `@codemirror/lang-javascript`, `@codemirror/theme-one-dark`). Lightweight, tree-shakeable,
  React-friendly via a thin `useCodeMirror` hook. (Monaco rejected: ~heavy, awkward with Next App Router.)
- Loaded with `next/dynamic` `ssr:false` (editor touches `window`), same pattern as `HomeHero → Hero3D`.

### 3.2 Python runtime — **Pyodide (CPython → WASM)**
- Load Pyodide from the **versioned CDN** (`cdn.jsdelivr.net/pyodide/vX/full/`) **inside a Web Worker**,
  never the main thread (it blocks for seconds and freezes the UI).
- Architecture: `app/practice` → `components/sandbox/PyRunner.js` posts `{code, stdin}` to
  `public/workers/pyodide.worker.js`; worker streams `stdout`/`stderr`/`result` back via `postMessage`.
- **Timeout / runaway guard:** the worker enforces a wall-clock budget; the main thread can
  `worker.terminate()` and respawn (the only reliable way to kill a runaway WASM loop).
- Capture `sys.stdout`/`sys.stderr` redirection inside Python; surface tracebacks verbatim
  (great teaching — pair with **RecursionStack** sim for stack-overflow lessons).
- `micropip` available for `numpy` etc. on demand (lazy, opt-in per problem).

### 3.3 JS runtime — **sandboxed iframe + Worker**
- Run user JS in a **same-origin-isolated `<iframe sandbox="allow-scripts">`** (note: deliberately
  **omit `allow-same-origin`** so the guest cannot reach our cookies/localStorage/DOM), which then
  spins a Worker for the actual eval. Communicate via `postMessage`.
- Override `console.*` in the guest to forward logs to the parent console UI.
- Same terminate-on-timeout strategy as Python.

### 3.4 Problem format & "now you try"
```js
// content/practice/<slug>.js
export default {
  slug:'two-sum', title:'Two Sum', lang:'python',
  prompt:'Return indices of the two numbers that add to target.',
  starter:'def two_sum(nums, target):\n    pass',
  tests:[{ call:'two_sum([2,7,11,15],9)', expect:[0,1] }, ...],
  hints:[...], solution:'...'
}
```
A `TestRunner` runs the user's function against `tests` in the sandbox and renders pass/fail chips
(reuse the green/red `--teal`/`--pink` language). Inline "now you try" widgets embed the same
`<Sandbox>` component inside Codex pages via the existing `InlineWidget` slot.

### 3.5 Deploy-safety & security checklist
- Pyodide/CDN assets are static — **no server compute**, works on any static/Vercel deploy. Pin the
  Pyodide version and **SRI-hash** the loader; consider self-hosting under `public/pyodide/` to avoid
  third-party CDN availability risk.
- **No `eval` on the main thread, ever.** All execution is worker/iframe-isolated.
- JS iframe **without `allow-same-origin`** ⇒ guest code is in a null origin: can't touch our DOM,
  storage, or the RAG API key in `localStorage` (which `SplitPaneViewer` stores — keep it out of reach).
- Strict **resource budgets**: execution timeout (~5–8s), output cap (truncate huge prints),
  memory guard via worker terminate.
- A `Content-Security-Policy` (`worker-src 'self' blob:; frame-src 'self'`) tightened in
  `next.config.ts` headers. No network from user code by default (block `fetch`/`XHR` in the JS guest;
  Pyodide has no socket access anyway).

---

## 4. 3D STRATEGY (react-three-fiber)

R3F is already wired correctly (`Hero3D.jsx` via `HomeHero.jsx` with `next/dynamic`,
`ssr:false`). **Default answer for a teaching sim is "2D".** 3D earns its place in exactly
three buckets — everywhere else it is noise that hurts comprehension and the perf budget.

**Where 3D EARNS it:**
1. **Hero / landing emotion** — already shipped (`RetroComputer.glb`). Keep, don't expand.
2. **GradientDescent loss surface** — a 3D bowl genuinely teaches "the optimizer rolls downhill";
   2D contour is the fallback for reduced-motion / low-power. The *only* catalog sim that is 3D-first.
3. **Systems "fly-through"** (one marquee piece for `/universe`): a slow, on-rails camera through
   client → LB → services → DB → replicas, each labeled. Genuinely conveys layered architecture.
   On-rails only (no free orbit), `<ScrollControls>`-driven.

**Where 3D is NOISE (use 2D):** sorting, trees, graphs, queues, schedulers, networking sequences,
attention heatmaps, B-tree splits. Depth adds occlusion and obscures the data. Hard no.

**Performance budget:** R3F bundle is large → **always `next/dynamic({ ssr:false })`** and
**lazy-mount only when scrolled into view** (IntersectionObserver). Targets: `dpr={[1,1.75]}`,
`<Canvas frameloop="demand">` for static-ish scenes (invalidate on interaction) so the GPU isn't
pinned at 60fps idle. Cap to **one live Canvas per route**. `<Suspense>` + skeleton while GLB/textures
load (drei `useGLTF.preload`). Provide a static `<img>` poster fallback for reduced-motion and a
WebGL-unavailable guard.

**SSR handling:** R3F/three touch `window`/WebGL → must never SSR. Enforce via the established
dynamic-import pattern; never import three at module top level in a server component.

---

## 5. REPLACING THE EXTERNAL IFRAME SIMS

Three routes embed third-party sites through `SplitPaneViewer`
(`app/simulator/raft → raft.github.io`, `app/simulator/llm`, `app/simulator/visualgo → visualgo.net`).
They are X-Frame-blockable, off-theme, and outside our control. Plan: **own all three**, in priority order.

| Route | Replace with | Catalog # | Notes |
|---|---|---|---|
| `/simulator/visualgo` | **BTreeViz** (owned SVG) | #11 | Lowest effort; reuses TreeViz primitives |
| `/simulator/llm` | **TransformerAttention** (owned SVG heatmap) | #12 | Highest teaching value; flagship AI |
| `/simulator/raft` | **RaftConsensus** (React Flow ring) | #13 | Needs GraphViz node primitives first |

**Migration mechanism (keep the good half of `SplitPaneViewer`):** the right-hand RAG "Why / When
it breaks / Ask Professor" pane is genuinely valuable and theme-correct — **keep it**. Only the
left iframe is the problem. Generalize `SplitPaneViewer`: when `visualizerUrl` is `null`, it already
renders `fallbackComponent` (the prop exists today). So the migration is literally: pass the new
owned React sim as `fallbackComponent` and drop `visualizerUrl`. No new wiring.

**Interim fallback hardening (ship this week, before the React versions land):** `SplitPaneViewer`'s
iframe has **no error/timeout handling** today — if X-Frame-Options blocks it, the user sees a
permanent spinner (`iframeLoading` never clears). Add:
- An `onLoad`-timeout (~6s): if not loaded, show a themed card: *"This visualizer can't be embedded —
  open it in a new tab ↗"* with the existing `visualizerUrl` link, plus the RAG pane still works.
- A `try/catch` probe (best-effort) and a clear "Open original site ↗" CTA (the link already exists in
  the toolbar). This removes the infinite-spinner failure mode immediately and degrades gracefully.

---

## 6. PHASING — sequencing the 12 sims + framework + sandbox

Bias: **framework first** (so every sim after is cheap), then teaching-impact, then unblock iframes,
then PRACTICE. Each phase is independently shippable.

**Phase 0 — Framework foundation (the multiplier).** Build `components/sim-kit/`: `SimShell`,
`createSimEngine`, `Transport` (port `TimelineControls` behavior), `ControlBar`, `Legend`, `motion.js`,
`palette.js`, reduced-motion. Add the global `prefers-reduced-motion` CSS rule. Migrate **ScalingSim**
onto SimShell as the dogfood/proof. *Exit:* one existing sim runs through the shell with no regressions.

**Phase 1 — Algorithms & DS (sims #1–#6).** SortLab, BigOGrower, RecursionStack, TreeViz,
HashTableViz, GraphViz+BFS/DFS. Ships the Canvas, SVG, and **React Flow** primitives the rest depend on.
*Exit:* `/simulator` hub lists 6 new owned sims; React Flow integration proven.

**Phase 2 — System design (sims #7–#9).** ScalingSim v2 (topology + cost), CacheLab, RateLimiter
(lift `SecuritySim` bucket). *Exit:* the "from 10 to 1M" story is now a connected set.

**Phase 3 — Replace iframes + networking (sims #10–#12, + interim hardening from §5).** Ship the
`SplitPaneViewer` timeout fallback **first** (one PR), then TCPHandshake, BTreeViz (→ retire visualgo
iframe), TransformerAttention (→ retire llm iframe). *Exit:* 2 of 3 external iframes gone.

**Phase 4 — Sandbox (PRACTICE) + Raft.** Pyodide worker + CodeMirror + JS sandbox + `TestRunner` +
first 5 DSA problems wired to the Phase-1 DS sims; RaftConsensus (→ retire raft iframe). *Exit:*
"now you try" works inline in Codex; **zero external iframes remain**.

**Phase 5+ — Long tail.** Remaining catalog (CPU/cache/scheduler/threads, DNS/TLS/routing,
MVCC/replication/sharding, quorum/election, perceptron/grad-descent/neural-net/tokenizer, injection/hashing/jwt),
+ the 3D systems fly-through for `/universe`. Each is now a ~1-day job on the mature framework.

---

## 7. Risks & decisions to lock

- **Pyodide weight (~6–10MB).** Lazy-load only on `/practice` and inline sandbox mount; never on first paint.
- **React Flow vs hand-SVG for graphs.** Use React Flow only where pan/zoom/drag-to-build matters
  (GraphViz, Raft, DNS, routing). For fixed small diagrams, plain SVG is lighter and easier to theme.
- **Determinism.** Every engine must be seedable (pass a seed in `params`) so scrubbing and replays
  are reproducible — this is what makes the SimShell scrub model work.
- **One Canvas/WebGL context per route** — guard against context-loss from too many live `<Canvas>`.
- **No new heavy deps beyond:** CodeMirror 6 packages + Pyodide (CDN/self-hosted). Everything else
  (framer-motion, d3, React Flow, three) is already installed.
