# 00 · AI Handoff — start here

> **Purpose.** This is the single, authoritative continuation brief for any AI (or human)
> picking up Software Universe. It tells you **what the project is, how we work (the thinking
> structure), the exact current state, the conventions you must keep, and what remains.**
> Read this first. The other numbered docs are deeper references; where they disagree with this
> file, **this file wins** (some were written in an earlier era — see "Doc currency" at the end).

---

## 1. What this project is

**Software Universe** is a visual, AI-guided learning platform that takes a complete beginner —
a "vibe coder" — through *all* of software engineering, with **nothing left behind**. Every
topic answers four questions — **what · why (+ alternatives) · how · when it breaks** — and is
learnable four ways: **READ** (the Codex), **SEE** (the Simulator), **PRACTICE** (the DSA Lab +
the code Playground), **ASK** (the Professor, ⌘K).

- Stack: **Next.js App Router, JavaScript (not TypeScript)**. No database — content is data
  files in `lib/`, shipped in git. Deployed to a Node host (see deploy notes).
- Repo/branch: work lands on **`testing`** (repo `garvitmh/Software-universe-`).
- Design: the **"Editorial"** direction (see `docs/03-DESIGN-SYSTEM.md`) — textbook-as-software,
  Newsreader / Source Serif 4 / IBM Plex Mono, warm paper + navy + rust, light & dark.

**The mandate from the owner:** open-hand, "treat it as your own project," go *deep and
vertical* (local → production → enterprise → planet-scale), be exhaustive and correct. The owner
wants work **explained in plain language**.

---

## 2. How we work — the thinking structure (the important part)

Adapt to this. It's why the project stays correct at scale.

1. **Depth over breadth.** Go deep part-by-part: audit → research/brainstorm → improve the *real*
   implementation. Do one part fully, then the next. Not broad shallow sweeps.

2. **Author at scale with agent waves of ≤3.** To add a lot of content (DSA problems, content
   entries) fast *and* correctly: spawn **at most 3 background agents at once**, each writing
   **one data file in its own disjoint lane**. Then the **main thread integrates** (adds the
   `import` + spread), runs the checker, builds, commits, pushes. **Never let an agent self-wire
   the central registry** (`lib/dsa.js`, `lib/tech-content.js`) — parallel edits cause
   "file modified since read" races and partial wiring.

3. **Verify before every push — with the build, never a preview server.** The owner has
   explicitly said *do not use the preview/dev-server tool* (it wastes time). Correctness is
   proven by `npm run check && npm run build`. The integrity checker (`scripts/check_content.js`)
   is the gate: it fails the build on broken refs/dupes.

4. **Ground everything; never confabulate.** Verify file/line citations against the actual file
   before stating them. (An earlier automated security pass *fabricated* findings against files
   that didn't exist — that's why the Burger Farm planning set is labelled "verified." Treat any
   agent's code-citation as a draft until checked.)

5. **Commit discipline.** Small, descriptive commits; end the message with
   `Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>`; push to `testing`.

6. **Pitfalls we learned the hard way (don't relearn them):**
   - **Cross-agent slug collisions:** two parallel agents pick the same new slug. Fix: strict
     per-agent **pattern lanes** + after every wave, scan for duplicate slugs.
   - **Semantic duplicates (same problem, different slug):** slug-checks miss these. Fix: also
     scan for **duplicate LeetCode numbers** across all wave files
     (`grep -rhoE 'leetcode: [0-9]+' lib/dsa.js lib/dsa/*.js | sort | uniq -d`).
   - **"Exists in data but invisible in UI":** content can be authored but unreachable. Always
     check it's **linked from nav and/or footer**, not just ⌘K. (This bit us: the 676-problem DSA
     Lab was missing from both nav and footer.)
   - **Stale copy:** hard-coded numbers/targets drift (e.g. the DSA hub once said "building toward
     150" at 600+). Grep for stale literals after big growth.

---

## 3. Current state (exact, as of this handoff)

| Surface | Route | State |
|---|---|---|
| Codex (reader) | `/codex`, `/codex/tech/<slug>`, chapters | **144 tech entries**, 11 chapters, 0 orphans |
| Learn Map | `/learn` | **17 domains** with depth ladders (`lib/domains.js`) |
| DSA Lab | `/dsa`, `/dsa/<slug>` | **676 problems**, 18 patterns, Java, deep schema |
| Simulator | `/simulator` + 10 sub-routes | **10 owned interactive demos** (no iframes) |
| Case study | `/case-study`, `/case-study/<slug>` | **11 chapters** on Burger Farm: D1–D11 + 29 "what if" |
| Playground | `/playground` | JS + Python (Pyodide) in a Web Worker |
| Glossary | `/glossary` | **153 terms** (`lib/glossary.js`) |
| Paths | `/paths`, `/paths/<id>` | **6 guided paths** with live progress |
| Roles | `/roles` | role guides (`lib/content/roles.js`) |
| Professor / search | ⌘K everywhere | `/api/rag/query` (embeddings + TF-IDF fallback) + nav index |
| API / seam | `/api/*` | repository (`lib/content/repository.js`) = the DB-swap seam |
| Aux/older | `/roadmap`, `/universe`, `/worlds/<slug>`, `/plan` | present; some on legacy fonts |

The **10 sims**: order-journey, api-playground (live free public APIs), cart-drift, scaling,
loyalty-ledger, dependency-explorer, raft, llm (n-gram next-token), visualgo (a real 2-3-4
B-tree), complexity (Big-O + sorting). Sim components are split between `components/sim/` (the
newer ones: ApiPlayground, BTreeSim, ComplexityChart+SortRace, LLMSim, RaftSim) and
`components/` top-level (OrderJourney, CartDriftSim, LoyaltyLedgerSim, ScalingSim).
`SplitPaneViewer` (the only remaining iframe) is used **only** by `/codex/library/<slug>`.

**Discoverability:** nav (`components/SiteNav.jsx`) = Home · Curriculum · Codex · DSA · Simulator ·
Case study. Footer (`app/layout.jsx`) links *every* section incl. Playground, Glossary, Roles,
Paths, Plan. ⌘K (`lib/searchIndex.js`) indexes pages/entries/problems/terms/paths/sims/case-study.

---

## 4. Where each kind of content lives (and how it's wired)

- **Tech entries** → `lib/tech-content.js`, which imports area files `lib/content/*.js`
  (cs-core, systems-networks, web-deep, backend-deep, ai-security-deep, data-deep,
  web-platform-deep, systems-ops-deep, …) and merges them with `typeof`-guarded spreads. Listed
  in `lib/curriculum.js` (`TECH_SECTIONS`) for the sidebar; surfaced on `/learn` via
  `lib/domains.js`. Rendered by `components/TechArticle.jsx`.
- **DSA problems** → `lib/dsa/wave1a … wave19c.js` (57 files), each `export const WAVEXX = [...]`,
  merged into `DSA_PROBLEMS` in `lib/dsa.js` via `import` + `...(typeof WAVEXX … )`. The hub reads
  `DSA_PATTERNS` + `problemsByPattern`; `lib/dsa-index.json` (lightweight) is rebuilt in prebuild.
- **Case study** → `lib/caseStudy.js` (`CASE_STUDY = { meta, chapters[] }`); rendered by
  `components/case-study/CaseStudyChapter.jsx`. Grounded in `~/Desktop/zone-trial/_planning`
  (the *verified* Burger Farm enterprise blueprint — docs 00,05,06,08,10 especially).
- **Sims** → `components/sim/*.jsx` + a page under `app/simulator/<slug>/`; add to the `SIMS`
  array in `app/simulator/page.jsx` and to `lib/searchIndex.js`.
- **Glossary** `lib/glossary.js` · **Paths** `lib/paths.js` · **Roles** `lib/content/roles.js`.

See `docs/04-ARCHITECTURE-AND-HOWTO.md` for step-by-step "how to add X".

---

## 5. The build & verify loop (do this every time)

```bash
npm run check    # scripts/check_content.js — content-graph gate (broken refs/dupes fail)
npm run build    # prebuild (= check + build_dsa_index + build_knowledge_index + build_embeddings) then next build
```

After a DSA wave, also run the dedupe scans:
```bash
node -e "const a=require('./lib/dsa-index.json');const s=a.map(x=>x.slug);console.log('dupes:',s.filter((x,i)=>s.indexOf(x)!==i))"
grep -rhoE 'leetcode: [0-9]+' lib/dsa.js lib/dsa/*.js | sort | uniq -d   # must be empty
```

**Deploy:** `render.yaml` (Render blueprint; `DISABLE_EMBEDDINGS=1` on the free/low-RAM tier →
keyword search; ≥1 GB instance → semantic). Node host only — the embedding runtime (~210 MB)
exceeds Vercel's serverless limit. RAG is deploy-safe (TF-IDF fallback, never 500s).

---

## 6. What remains / next steps

- **DSA → a hard 700.** Currently 676. ~2 more 3-agent waves (the loop in §2/§5). Patterns/lanes:
  a = arrays-hashing/two-pointers/sliding-window/stack/binary-search; b = trees/linked-list/heaps/
  tries/intervals; c = dp-1d/dp-2d/graphs/advanced-graphs/backtracking/greedy.
- **Case study "code tour" chapter** (optional, owner-suggested): walk the *actual* Burger Farm
  files of one slice end-to-end (e.g. address/serviceability: Express route → service → Prisma →
  the Flutter screen).
- **Font-migration debt:** `app/layout.jsx` still loads Fraunces/Inter/JetBrains for un-migrated
  aux pages (`/universe`, `/worlds`, `/roadmap`, `/plan`). Move them to Editorial fonts, then prune.
- **Depth pass** on the oldest content entries; **Professor** streaming + Socratic follow-ups.
- **Vision (future, not started)** — `docs/AI_BRIDGE.md` argues for shifting from "build every
  simulator" to **orchestrating** the best external resources (inline resource panel per topic:
  blogs/books/videos/repos beside the simulation). Treat as a direction, not a committed plan.

---

## 7. Doc currency (read this before trusting other docs)

- ✅ **This file (`00-AI-HANDOFF.md`)** and the **root `README.md`** are current.
- ✅ `03-DESIGN-SYSTEM.md`, `04-ARCHITECTURE-AND-HOWTO.md`, `05-SYLLABUS-AND-STATUS.md` were
  refreshed to the current "Editorial + DSA + case study" state alongside this handoff.
- 📜 `01-VISION-AND-RULES.md`, `02-PRODUCT-SPEC.md`, `06-TECHNICAL-AUDIT.md`, `AI_BRIDGE.md`,
  `STITCH-CONTEXT.md`, `OBSERVATORY.md`, `IMPLEMENTATION_PLAN.md`, `architect_logs/`, `plan/`,
  `ADRs/` are **historical / earlier-era** — useful for intent and backstory, but verify any
  factual claim against the live code (they predate the Editorial rebuild, the DSA Lab, and the
  case study).
- The **Burger Farm** planning set referenced by the case study lives *outside this repo* at
  `~/Desktop/zone-trial/_planning` (gitignored, verified).
