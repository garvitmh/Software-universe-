# Software Universe — Master Plan

> The north star: turn Software Universe into **"the answer to everything in software engineering"** — a visual, AI‑guided site where a complete beginner ("vibe coder") can learn *all* of software, with **nothing left behind**: breadth across every domain, depth per topic (local → production → enterprise → planet‑scale), through four modes — **READ · SEE · PRACTICE · ASK**.

This `docs/plan/` directory is the enterprise‑grade blueprint. It was authored by six specialist passes, each grounded in the real repo. Read this index first, then the pillar it points to.

## The six pillars

| # | Doc | Owns |
|---|-----|------|
| 01 | [Vision, Product & Pedagogy](./01-VISION-PRODUCT-PEDAGOGY.md) | The north star, the learner journey, the **8‑lens** topic model, the **no‑quiz** learning mechanics, learning **paths/tracks**, mastery & success metrics |
| 02 | [Curriculum & Content Architecture](./02-CURRICULUM-CONTENT.md) | The **exhaustive field map** (18 domains / ~135 topics), the depth ladder, the scalable **content data model** (`lib/content/<domain>.js`), authoring conventions, the gap queue |
| 03 | [Interactive & Visualization](./03-INTERACTIVE-VISUALIZATION.md) | The **~40‑sim catalog**, the reusable **`<SimShell>`** framework, the in‑browser **code sandbox** (Pyodide), the 3D strategy, replacing the iframe sims |
| 04 | [AI Tutor & RAG](./04-AI-TUTOR-RAG.md) | The Socratic tutor architecture, retrieval (TF‑IDF → embeddings), generation (OpenRouter + streaming), the **6 tutor modes**, grounding/guardrails, **personalization & progress** |
| 05 | [Platform & Architecture](./05-PLATFORM-ARCHITECTURE.md) | Folder architecture & anti‑sprawl, the **design‑token / theme‑pack** system + `/design` playground, ⌘K search, performance, a11y, testing/CI, deployment, the **tech‑debt backlog** |
| 06 | [Data, Sourcing & Content‑Ops](./06-DATA-SOURCING-CONTENTOPS.md) | **License‑safe** sourcing (link / paraphrase / ingest), the deploy‑safe RAG corpus, the content production pipeline, prioritization, content‑ops cadence |

## Cross‑cutting truths the audit surfaced (read these once)

1. **The brand identity is undecided in code.** `app/globals.css` ships indigo/slate tokens (`--brand:#6366F1`), `DESIGN.md` describes a dark teal/amber look, and the spoken brief says "Warm Farm" cream/orange. **Three directions, no source of truth.** → This is exactly why doc 05's **theme‑pack architecture** is foundational: a design direction must become *one data file*, not a refactor. It also dovetails with the owner's active exploration of 2–3 design directions × light/dark.
2. **Two parallel content spines** (`CODEX_PARTS` vs `DOMAINS`/`TECH_SECTIONS`) are hand‑maintained and will drift. → Doc 02: make `lib/content/<domain>.js` canonical and derive the rest.
3. **Three "professor" systems exist** — one real grounded RAG path plus two duplicated, ungrounded rule engines (`components/professor/**` + `components/professor-ai/**`, ~49 files). → Doc 04: collapse into one grounded brain; salvage only the content into `lib/prompts.js`.
4. **The personalization is fake.** The dashboard runs on hardcoded mock state (`UniverseContext.js`, `mastery || 35`) with no persistence. → Docs 04/05: a single `lib/learnerStore.js` (localStorage → DB) replaces it and powers "what's next."
5. **Real user‑visible bug:** `SplitPaneViewer.jsx` never clears its loading spinner when an embed is X‑Frame‑blocked → the raft/llm/visualgo routes can hang. → Doc 03/05 P0.
6. **The data lake is gitignored and empty;** the only deploy‑safe knowledge is the committed TF‑IDF index (`lib/knowledge/search_index.json`, built in `prebuild`). → Doc 06: originate content, never copy; keep the committed index the single deploy dependency.

## The synthesized execution roadmap

Sequenced so each phase unblocks the next. Phase 0 is foundations + cleanup; the rest is build‑out.

### Phase 0 — Foundations & cleanup (make everything else cheap & honest)
- **Design tokens → theme packs + `/design` playground** (05). Resolve the 3‑way theme drift; make a direction one file. *This also serves the owner's live design exploration.*
- **`lib/learnerStore.js`** (localStorage) (04/05). Delete the mock persona; give the tutor "where the learner is."
- **One professor brain** (04). Consolidate the three systems; move prompts/personas into `lib/prompts.js`; delete the rule engines.
- **P0 bug + hygiene fixes** (05): SplitPaneViewer spinner/timeout; rename `openai_api_key` → `su_tutor_api_key`; delete confirmed dead code.
- **`<SimShell>` framework** (`components/sim-kit/`) + migrate `ScalingSim` to prove it (03).
- **Canonical content model** `lib/content/<domain>.js` + derive `domains.js`/`curriculum.js` (02/05).

### Phase 1 — Depth + the tutor that teaches it
- **AT‑SCALE lens** (the real differentiator) added to the ~12 strongest existing articles (01/02).
- **Streaming + abuse/cost guardrails** on `/api/rag/query` before any public push (04).
- **Path mode** — `lib/paths.js` + `app/learn/path/[id]` (the "rope through the maze") (01).
- **First sims via `<SimShell>`** — the ranked first‑12 (sorting/structures/Big‑O, request lifecycle, the existing scaling sim extended) (03).
- **D0 "CS from scratch" foundations** content — the floor below today's framework articles (02).

### Phase 2 — Breadth + practice
- **Fill the field‑map gaps** domain by domain (the `status:"soon"` queue), license‑safe (02/06).
- **Code sandbox** — CodeMirror + worker‑isolated JS + self‑hosted Pyodide, wired into DSA "now you try" (03).
- **Replace the iframe sims** (raft/llm/visualgo) with owned React versions (03).
- **⌘K navigation search** across domains/topics/tech/dsa/resources/glossary (distinct from the RAG drawer) (05).
- **RAG → embeddings** upgrade once the corpus outgrows TF‑IDF; keep deploy‑safe (committed vectors or hosted store) (04/06).

### Phase 3+ — Scale, polish, operate
- Full curriculum fill + **content‑ops cadence** + coverage tracking via `domains.js` flags (02/06).
- License‑cleared **corpus expansion** for the tutor (06).
- **a11y + performance + testing/CI** hardening; split `lib/tech-content.js`; compress the 16 MB `.glb` (05).
- **Permanent deployment** (Vercel) with env + prebuild; retire the localtunnel approach (05).

## First sprint (the concrete "do this next")
1. Theme‑pack tokens + `/design` playground (Phase 0) — also lets the owner choose a direction.
2. `lib/learnerStore.js` + consolidate professors into one grounded brain.
3. Fix the SplitPaneViewer spinner + the API‑key rename.
4. `<SimShell>` + migrate ScalingSim.
5. Add the AT‑SCALE lens to the top existing articles.

## How to use this plan
- Each doc is **implementation‑ready** (schemas, file paths, phased steps). Treat the docs as the spec; this index as the sequencer.
- When a task spans pillars, the **owning doc** is named in the roadmap above.
- Update `domains.js` status flags as topics ship — that is the live coverage tracker (doc 02/06).
