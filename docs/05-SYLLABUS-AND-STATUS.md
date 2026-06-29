# 05 · Status & Surfaces

> For working method + the full continuation brief, see `docs/00-AI-HANDOFF.md`.

This is the current state-of-the-app reference: what exists, where it lives in routes, and which `lib/` files drive it. The build is the source of truth — there is **no preview server**. Verify with `npm run check` (the content-graph gate, `scripts/check_content.js`) then `npm run build`.

- Repo: `garvitmh/Software-universe-`, branch `testing`.
- Stack: Next.js (App Router), **JavaScript** (not TypeScript).
- Design: **"Editorial"** — Newsreader (display serif), Source Serif 4 (body), IBM Plex Mono (labels); warm-paper background + navy `#2E4B73` + rust `#9C4422`; light + dark. Tokens in `app/globals.css`.

## Status at a glance

The content graph is consistent and the integrity checker enforces **0 "soon"/orphan topics**. Current counts (from `npm run check`):

| Surface | Count | Source |
| --- | --- | --- |
| Tech entries (Curriculum) | **144** | `lib/tech-content.js` + `lib/content/*.js` |
| Domains (drive `/learn`) | **17** | `lib/domains.js` |
| Codex chapters | **11** | `lib/curriculum.js` (`ALL_CODEX_CHAPTERS`) |
| Glossary terms | **153** | `lib/glossary.js` |
| Guided paths | **6** | `lib/paths.js` |
| DSA problems | **676** | `lib/dsa.js` (verified via `lib/dsa-index.json` length) |
| DSA patterns | **18** | `lib/curriculum.js` (`TECH_SECTIONS`) / `lib/dsa.js` |
| Case-study chapters | **11** | `lib/caseStudy.js` |
| Simulators | **10** | `components/sim/` + `app/simulator/` |

`npm run check` summary: `{"entries":144,"terms":153,"chapters":11,"paths":6,"domains":17,"simulators":10}`.

## Surfaces

### Codex / Learn (the curriculum)
- **144 tech entries** in `lib/tech-content.js`, which merges the area files in `lib/content/*.js` (cs-core, systems-networks, craft-systemdesign, web-deep, backend-deep, ai-security-deep, mobile-devops-deep, cloud-dataeng-deep, foundations-deep, data-deep, web-platform-deep, systems-ops-deep). Each answers what / why (+alternatives) / how / when-it-breaks.
- **11 Codex chapters** + **18 sections** are structured by `lib/curriculum.js`.
- **17 domains** in `lib/domains.js` drive `/learn`.
- Routes: `/codex`, `/learn`. The SplitPaneViewer survives ONLY for `/codex/library/[slug]`.

### DSA Lab
- **676 problems** across **18 patterns**, in Java, with a deep schema per problem (statement / examples / recognize / figureItOut / approaches brute→optimal each with walkthrough / edgeCases / twists / related).
- Data: `lib/dsa.js` merges `lib/dsa/wave1a..wave19c.js` (**57 wave files**) via `import` + `typeof`-guarded spreads.
- Routes: `/dsa` (hub, all problems grouped by pattern), `/dsa/[slug]` (deep page).
- `lib/dsa-index.json` is the lightweight ⌘K index, rebuilt in `prebuild` by `scripts/build_dsa_index.js`.

### Simulators
**10 owned interactive demos** (no iframes) at `/simulator/<slug>`; components in `components/sim/`:
`order-journey`, `api-playground` (live free public APIs), `cart-drift`, `scaling`, `loyalty-ledger`, `dependency-explorer`, `raft`, `llm` (n-gram next-token), `visualgo` (a real 2-3-4 B-tree), `complexity` (Big-O + sorting).

### Case study
- **11 chapters** in `lib/caseStudy.js`, rendered by `components/case-study/CaseStudyChapter.jsx`.
- Routes: `/case-study`, `/case-study/[slug]`.
- Explains the real Burger Farm platform: decisions **D1–D11** (what / why / alternatives / how) + **29 "what if it breaks?"** edge cases. Grounded in the verified planning set at `~/Desktop/zone-trial/_planning`.

### Playground
- Route: `/playground`. Linked from the footer.

### Glossary
- **153 terms** in `lib/glossary.js`. Route: `/glossary` (also `/api/glossary`).

### Paths
- **6 guided paths** in `lib/paths.js`. Route: `/paths`.

### Roles
- `lib/content/roles.js` → `/roles`.

### Search / Professor (RAG)
- ⌘K via `lib/searchIndex.js` — `NAV_INDEX` spans pages, entries, problems, terms, paths, sims, and case-study.
- The Professor: `/api/rag/query` (and `/api/rag/search`), using embeddings (`lib/knowledge/embeddings.json`) with a TF-IDF fallback. Set `DISABLE_EMBEDDINGS=1` for low-RAM hosts (`lib/embeddings_search.js`).

### API / backend (route handlers)
- `/api/content`, `/api/content/[slug]`, `/api/search`, `/api/glossary`, `/api/stats`, `/api/rag/search`, `/api/rag/query`.

### Navigation
- `components/SiteNav.jsx`: Home, Curriculum, Codex, DSA, Simulator, Case study.
- Footer (`app/layout.jsx`) links every section incl. Playground, Glossary, Roles, Paths, Plan.

### Auxiliary surfaces (still live)
- `/roadmap`, `/universe`, `/worlds/[slug]`, `/plan` — older/auxiliary surfaces, not yet migrated to Editorial.

## Verify discipline
- `npm run check` → content-graph gate (`scripts/check_content.js`).
- `npm run build` → `next build`. `prebuild` runs the check, then rebuilds `lib/dsa-index.json`, the knowledge index, and embeddings.
- The build is the source of truth. No preview/dev server is relied upon for correctness.

## What remains
- **DSA 676 → a hard 700** (~2 more 3-agent waves).
- Optional **case-study "code tour"** chapter.
- **Font-migration cleanup**: `app/layout.jsx` still loads Fraunces / Inter / JetBrains for the un-migrated aux pages (`/universe`, `/worlds`, `/roadmap`, `/plan`) — prune once those move to Editorial.
- The **orchestrator / inline-resource-panel** vision in `docs/AI_BRIDGE.md` (future, not started).
- **Deepen the oldest content entries.**
