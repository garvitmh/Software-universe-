# Software Universe

A visual, AI-guided field guide that takes a complete beginner — a "vibe coder" — from
*"what is a program?"* all the way to sharding, neural networks, and threat modelling, with
**nothing left behind**. Every topic answers four questions — **what · why (+ alternatives) ·
how · when it breaks** — and you can learn it four ways:

| Pillar | Where | What it is |
|--------|-------|------------|
| **READ** | `/codex`, `/learn`, `/glossary` | 48 plain-language entries, 11 chapters, 153 glossary terms, every Learn-Map topic live |
| **SEE** | `/simulator` | 10 interactive demos — a live load simulator, a Big-O/sorting visualizer, and more |
| **PRACTICE** | `/playground`, `/dsa` | Run real JavaScript **and Python** in the browser; a NeetCode-style DSA lab |
| **ASK** | ⌘K anywhere | "The Professor" — a grounded RAG assistant that's also instant jump-to-anything navigation |

Plus **guided paths** (`/paths`) — ordered routes that build one idea on the last — and local
**progress** that remembers where you've been.

The design is the **Editorial** direction: a textbook-as-software look (Newsreader display
serif, Source Serif 4 body, IBM Plex Mono labels; warm paper, navy + rust accents; light + dark).

## Quick start

```bash
npm install
npm run dev      # http://localhost:3000
```

Other scripts:

```bash
npm run check    # validate the content graph (no broken links/refs)
npm run build    # runs check + rebuilds the search index, then next build
npm run index    # rebuild the committed RAG search index by hand
```

## Project structure

```
app/                      Next.js App Router
  page.jsx                Landing
  learn/                  The Learn Map (domains × depth ladder)
  codex/                  The reader: /codex (contents), /codex/<chapter>, /codex/tech/<slug>
  paths/                  Guided paths: index + /paths/<id> reader
  simulator/              Sim hub + each demo (complexity, scaling, raft, …)
  playground/             JS + Python sandbox
  glossary/               Filterable lexicon
  api/                    Backend route handlers (content, glossary, search, stats)
components/
  TechArticle.jsx         Renders every tech entry (§-markers, drop-caps, callouts, prev/next)
  InlineRAGDrawer.jsx     The Professor (⌘K) — RAG answer + instant nav
  sim/ playground/ paths/ home/   Feature components
lib/
  content/repository.js   The single content data-access layer (the DB-swap seam)
  tech-content.js         The tech entries (the bulk of the content)
  curriculum.js           CODEX_PARTS (chapters) + TECH_SECTIONS (sidebar order)
  domains.js              The 11 domains + depth ladders (drives /learn)
  glossary.js             ~153 plain-language term definitions (powers tooltips + search)
  paths.js                The guided paths
  learnerStore.js         localStorage progress (recents, read-count, bookmarks)
  searchIndex.js          Client nav index for ⌘K jump-to
  rag_search.js           Deploy-safe TF-IDF retrieval (never throws)
scripts/
  check_content.js        Content-graph validator (runs in prebuild)
  build_knowledge_index.js  Builds the committed RAG index from the content
```

## How to add content

### A tech entry (the common case)

1. Add the entry to **`lib/tech-content.js`** — keyed by slug. It auto-routes to
   `/codex/tech/<slug>` and feeds the search index. Schema:

   ```js
   "my-topic": {
     slug: "my-topic", title: "My topic", category: "Backend", color: "amber",
     tagline: "…", oneLiner: "…",
     what: ["…"],                     // §1 What it is (first paragraph gets a drop-cap)
     analogy: { title: "…", body: "…" },
     insideTitle: "What's inside", inside: [{ name: "…", desc: "…" }],
     how: ["…"],                      // §How it works (generic) …
     howWeUse: { body: ["…"], refs: ["path/file.ts"] },  // … or Burger-Farm-specific
     why: ["…"], alternatives: [{ name: "…", note: "…" }],
     breaks: "…", scale: "…",         // "when it breaks" + "how it grows" callouts
     related: ["other-slug", "a-chapter-slug"],   // tech entries OR chapters both resolve
   }
   // Inline markup in strings: `code` and **bold**.
   ```

2. List it in **`lib/curriculum.js`** → `TECH_SECTIONS` so it appears in the sidebar.
3. If it fills a domain topic, flip that topic in **`lib/domains.js`** to
   `{ t: "…", href: "/codex/tech/my-topic", status: "live" }`.
4. `npm run check` — confirms every link resolves and nothing is orphaned.

### A glossary term

Add to `lib/glossary.js` (`id: { term, def, more? }`). It instantly powers the inline
`<Term>` tooltips, the `/glossary` page, the ⌘K search, and the RAG index.

### A guided path

Add to `lib/paths.js` (`{ id, title, subtitle, blurb, steps: [{ href, title, note }] }`).
Steps can point at any real route; `npm run check` validates them.

## Backend

`lib/content/repository.js` is the single data-access layer — pages and APIs read through it,
so the backing store can be swapped for a real database later without touching callers. The
route handlers expose it:

```
GET /api                  self-describing index + stats
GET /api/content          entry summaries (?category=, ?q=)
GET /api/content/:slug    one full entry
GET /api/glossary         terms (?q=)
GET /api/search           entries, terms & paths (?q=, ?limit=)
GET /api/stats            whole-library counts
```

## The AI assistant

`/api/rag/query` answers from the committed TF-IDF index (`lib/knowledge/search_index.json`,
rebuilt in `prebuild`). It's deploy-safe and never 500s — it falls back to local retrieval if
no model key is present. Add an OpenAI/OpenRouter-compatible key in the Professor's settings for
richer synthesis (stored only in your browser).

## Verifying changes

This project is verified with the build, not a preview server:

```bash
npm run check && npm run build
```

`check` gates the content graph; `build` runs it, rebuilds the index, and compiles every route.
