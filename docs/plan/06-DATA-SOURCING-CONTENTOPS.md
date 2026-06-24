# 06 · Data, Sourcing & Content Operations

**Status:** master-plan section · **Owner:** Content Ops · **Last reviewed:** 2026-06-24

This is the operating manual for *how Software Universe gets its content* — legally, sustainably, and
at scale — and how that content flows into the grounded AI tutor. The north star: **teach a beginner
ALL of software engineering with nothing left behind.** That is a content-production problem before it
is a code problem, so the rules here govern sourcing, licensing, the RAG corpus, the authoring pipeline,
prioritisation, cadence, and governance.

**The one rule that overrides everything: we ORIGINATE, we do not copy.** Every paragraph a learner reads
is our own original prose. External sources teach *us* the facts; we re-express them in the project's voice
(the "Warm Farm" / Burger-Farm-as-textbook style already visible in `lib/tech-content.js`). Copyright protects
*expression*, not *facts and ideas* — so we are free to learn that "Node's event loop turns waiting into
capacity" from anywhere and write our own explanation, but we are never free to paste someone's paragraph.

---

## 1. Sourcing Strategy — per domain, with usage class & licence rules

### 1.1 The three usage classes

Every external source is tagged with exactly one usage class. This tag is the single most important
compliance decision and is recorded per item (see §6 metadata).

| Class | What we do | When it's allowed | Where it shows up |
|---|---|---|---|
| **(a) LINK** | Point learners at it; never copy text | Always — linking is always legal | `lib/resources.js` (already does this), inline "go deeper" links |
| **(b) PARAPHRASE** | Read it, learn from it, write our **own original** explanation; cite the source as "based on / further reading" | Always (facts/ideas aren't copyrightable), and it's our default for authored articles | `lib/tech-content.js`, `lib/glossary.js`, `lib/dsa.js` |
| **(c) INGEST** | Put the **verbatim** text into the RAG corpus (`search_index.json`) | **Only** for licences that permit redistribution **with attribution** (see §1.2), or public-domain / our-own-content | `lib/knowledge/search_index.json` |

The safe default for any new source is **(a) LINK** until a licence has been positively confirmed. Promotion
to **(b)** needs no licence check (it's our own words). Promotion to **(c)** is a deliberate, logged decision.

### 1.2 Licensing rules that decide the class

We classify by the source's actual licence, not by "it's on the public internet":

- **Public domain / CC0** → eligible for **(c) INGEST** freely. (e.g. US-government works, explicitly CC0 docs.)
- **CC-BY** → eligible for **(c) INGEST** *with attribution* retained in the chunk metadata (`source`, `url`, `license`).
- **CC-BY-SA** (e.g. Wikipedia) → **(c) only with caution**: ShareAlike is "viral" on derivative *text*. We keep
  CC-BY-SA out of the verbatim corpus to avoid having to relicense our index; we use it as **(b) PARAPHRASE** instead.
- **Permissive code licences (MIT / BSD / Apache-2.0)** → the *code* is reusable with attribution, but most
  "awesome-list" READMEs are **curation/links**, so we treat them as **(a)/(b)**, not bulk **(c)**.
- **All-rights-reserved** (most company eng-blogs, most published textbooks, MDN *prose* is CC-BY-SA, O'Reilly books)
  → **(a) LINK** and **(b) PARAPHRASE** only. **Never (c).** This covers DDIA, the printed SRE book text,
  ByteByteGo, Stripe/Netflix/Discord blog prose, etc. We learn the *idea*, link the *source*, write our *own* words.

> Conservative stance: when in doubt about a licence, it is **(a)/(b)**, never **(c)**. The cost of being wrong
> on ingestion (redistributing someone's copyrighted text) is far higher than the cost of paraphrasing.

### 1.3 Per-domain source map

Domains mirror `lib/domains.js`. For each, the authoritative free sources and their default class.

| Domain (`domains.js` id) | Authoritative free sources | Default class |
|---|---|---|
| **foundations / craft** | Teach Yourself CS, OSSU, `roadmap.sh`, Twelve-Factor App (MIT-ish, link), Pro Git (CC-BY-NC-SA → link/paraphrase) | (a) link · (b) paraphrase |
| **languages** | MDN (CC-BY-SA → paraphrase), *The Rust Book* (MIT/Apache → eligible (c) for short excerpts), A Tour of Go, javascript.info | (b), selective (c) for Rust/Go docs |
| **web** | MDN, web.dev (Google, ARR → link), React docs (MIT repo), Full Stack Open | (a)/(b) |
| **dsa** | CP-Algorithms (CC-BY-SA → paraphrase), MIT 6.006 OCW (CC-BY-NC-SA → link), Big-O cheat sheet, our own `lib/dsa.js` | (b); corpus = our own `dsa.js` |
| **systems / OS** | OSTEP (free-to-read, ARR → link/paraphrase), nand2tetris, CS:APP | (a)/(b) |
| **networking** | Beej's Guide (CC-BY-NC → link/paraphrase), High-Performance Browser Networking (CC-BY-NC-ND → link), Cloudflare Learning Center (ARR → link) | (a)/(b) |
| **databases** | Use-The-Index-Luke (link), CMU 15-445 (link), PostgreSQL docs (PostgreSQL licence → eligible (c)), DDIA (ARR → link) | (b); (c) for Postgres docs |
| **system-design** | System Design Primer (CC-BY 4.0 → **eligible (c)**), High Scalability, eng-blogs index (links only) | (b); (c) for SD-Primer |
| **devops / SRE** | Google SRE books (free-to-read, ARR → **link/paraphrase only**), Twelve-Factor, k8s docs (CC-BY 4.0 → **eligible (c)**) | (a)/(b); (c) for k8s docs |
| **cloud** | AWS Builders' Library (ARR → link), provider docs (link), Twelve-Factor | (a)/(b) |
| **ai-ml** | Karpathy Zero-to-Hero (link/video), Illustrated Transformer (link), Hugging Face course (Apache repo → selective (c)), Distill.pub (CC-BY → eligible (c)) | (b); (c) for Distill/HF |
| **security** | OWASP (CC-BY-SA → paraphrase; cheat-sheets), PortSwigger Academy (link), Crypto 101 (link) | (a)/(b) |

The **(c)-eligible shortlist** (positively-licensed for ingestion) is therefore small and known:
**System Design Primer (CC-BY 4.0), Kubernetes docs (CC-BY 4.0), Distill.pub (CC-BY 4.0), PostgreSQL docs
(permissive), Rust/Go official docs (MIT/BSD), Hugging Face course (Apache-2.0)** — plus **all of our own
authored content**, which is the backbone of the corpus.

---

## 2. The RAG Corpus Plan

### 2.1 Current reality (verified in repo)

- `scripts/build_knowledge_index.js` is the **working** prebuild (wired as `npm run prebuild`). It loads two
  pure-data ESM files via a `vm` sandbox — `lib/glossary.js` (one chunk per term) and `lib/tech-content.js`
  (two chunks per tech: *what/why* and *how/breaks*) — computes TF + IDF, and writes a single committed
  `lib/knowledge/search_index.json` (**144 chunks, 2,543 terms, ~262 KB**).
- `lib/rag_search.js` loads `data/processed/search_index.json` **first** (the gitignored lake), then falls
  back to the committed `lib/knowledge/search_index.json`, then to an empty index (so the tutor never throws).
- `scripts/ingest_resources.js` is the **never-run** scraper/cloner that writes into the gitignored
  `data/raw/*`. `data/raw` and `data/processed` contain only `placeholder.txt`.

### 2.2 The deploy-safe principle

The deployed app can only see what's committed. `data/raw` and `data/processed` are gitignored, so **the
corpus that ships is exactly `lib/knowledge/search_index.json`.** Therefore:

> The committed index must be **small, curated, and 100% licence-cleared** — built only from our own authored
> content plus the narrow (c)-eligible shortlist. The big lake stays a *local authoring aid*, never a deploy dependency.

This keeps the existing two-tier loader in `rag_search.js` honest: locally an author may have a richer
`data/processed/search_index.json`; in production the committed index is authoritative and safe.

### 2.3 What to ingest (corpus contents)

| Tier | Source | Class | How it gets in |
|---|---|---|---|
| **Backbone** | `lib/glossary.js`, `lib/tech-content.js`, `lib/dsa.js` (our words) | our own | already built by `build_knowledge_index.js` (extend it to read `dsa.js`) |
| **Cleared excerpts** | SD-Primer, k8s docs, Distill, Postgres/Rust/Go docs, HF course | (c) | new step in pipeline (§2.4), short excerpts only, attribution kept |
| **Curated pointers** | `lib/resources.js` items (name + why + url) | (a) | index the *one-line "why"* so the tutor can recommend a link |

We do **not** ingest company eng-blog prose, DDIA, OSTEP text, or any ARR source. The tutor *cites* those via
links instead — accurate, legal, and arguably more useful ("read Kleppmann ch.5").

### 2.4 The pipeline: source → cleaned text → index

```
SOURCE (licence-tagged)
  │  (c)-eligible only
  ▼
scripts/ingest_resources.js   →  data/raw/<source>/…     (LOCAL ONLY, gitignored)
  │  clone/fetch + record licence in a manifest
  ▼
scripts/clean_corpus.js (NEW) →  data/processed/clean/   (strip HTML/nav/boilerplate, dedupe,
  │                                                        chunk to ~200–400 words, attach
  │                                                        {source, url, license, lastReviewed})
  ▼
scripts/build_knowledge_index.js (EXTENDED)
  │  merges: (1) our authored chunks  (2) cleared-excerpt chunks
  │  recomputes TF/IDF exactly as today
  ▼
lib/knowledge/search_index.json   (COMMITTED, deploy-safe, every chunk carries a license field)
```

Chunking: keep the current "small, semantic" granularity (a glossary def, or a what/why vs how/breaks half of
a tech article). For ingested docs, chunk at heading boundaries, target ~200–400 tokens, never split a code
block. Each chunk keeps `id, source, category, title, text, url, license, lastReviewed`.

### 2.5 Reconcile / fix `scripts/ingest_resources.js`

The current scraper is unsafe to run as-is: it spoofs a browser `User-Agent`, fetches ARR pages
(`sre.google`, `stripe.com/blog`, `discord.com/blog`) that we must **never** ingest, and writes raw HTML with
no licence record. **Decision: retire its current source list and repurpose it as a licence-gated cloner.**

Concretely, rewrite it to:
1. Read sources from a **manifest** (`data/sources.manifest.json`) where every entry has an explicit
   `license` and `usage` (`link|paraphrase|ingest`).
2. **Only fetch/clone `usage:"ingest"` entries** (the (c)-eligible shortlist); skip everything else with a log line.
3. Drop the fake `User-Agent`; honour `robots.txt`; prefer `git clone --depth 1` of the licensed repo over scraping.
4. Write a per-source `LICENSE` + provenance record alongside the raw text.

If that's more than we want to maintain, the cheaper option is to **delete `ingest_resources.js` entirely** and
hand-curate the handful of cleared excerpts as small data files — the corpus is small enough that manual curation
is realistic and safest. Either way, **the scraper as written must not be run.**

---

## 3. Content Production Pipeline

### 3.1 The authoring data pattern (already in repo — keep it)

New topics are **data, not pages**. `lib/tech-content.js` keys a slug → a structured object; adding a key makes
`/codex/tech/<slug>` go live and flips the sidebar entry from "soon" (its header comment documents exactly this).
`generateStaticParams` reads the keys. This is our content model — every authored topic is one of these objects,
rendered by a shared component (`components/TechArticle.jsx`).

### 3.2 The per-topic template ("the lenses")

Every tech topic must fill the same fields as the existing entries (Dart, TypeScript, Node are the gold standard).
This is both the template *and* the QA checklist:

- `title`, `category`, `tagline`, `oneLiner` — the hook, in one breath.
- `what[]` — plain-language explanation, beginner-first, jargon defined on first use.
- `analogy{title,body}` — one vivid real-world analogy (the "two engines", "one brilliant waiter").
- `inside[]` — the named parts a learner will actually meet.
- `why[]` — the problem it exists to solve; *why this, not the alternative*.
- `alternatives[]` — honest trade-offs vs other choices.
- `howWeUse{body,refs}` — grounded in the real Burger Farm codebase, with file `refs`.
- `breaks` — the concrete bad day if you get it wrong (this is what makes it stick).
- `scale` — how it changes from local → planet-scale (ties to `DEPTH_LADDER`).
- `related[]` — cross-links to neighbouring slugs.

The **lenses checklist** — every topic must answer: *What is it? Why does it exist? What breaks without it?
What are the alternatives & trade-offs? How do WE use it (real file)? How does it change as it scales?* A draft
missing any lens is not done.

### 3.3 AI-assisted drafting with human review (and anti-plagiarism guardrails)

Drafting workflow, per topic:

1. **Research (read the (a)/(b) sources)** → collect facts, not sentences. Note the source for each fact.
2. **AI draft** → fill the template *in the project's voice*, from the noted facts, grounded in real repo files.
3. **Originality guardrail** (mandatory):
   - The prompt instructs: *originate every sentence; never reproduce phrasing from any source; facts only.*
   - **Plagiarism check**: run drafts through a similarity check against the cited sources (n-gram / embedding
     overlap). Any passage with high overlap is rewritten. No verbatim external prose may enter `(b)` content.
   - **Code refs must be real**: every `howWeUse.refs` path is verified to exist in the Burger Farm repo
     (the project's memory explicitly warns that an agent once confabulated a citation — so this is a hard gate).
4. **Human review** → a person checks: technical correctness, the lenses are all present, the analogy lands, the
   reading level is beginner-true, and the file refs resolve.
5. **Diagrams / sims** → for visual topics, author a `/simulator/*` widget or a diagram; reuse the existing
   simulator pattern. Diagrams are **our own** (Mermaid/D3/React) — never lifted images.
6. **Reindex** → `npm run index` (runs `build_knowledge_index.js`) so the tutor immediately knows the new topic.

### 3.4 Definition of Done (per topic)

Live in `domains.js` (`status: "live"` with `href`) · all lenses filled · analogy present · real verified file
refs · plagiarism check passed · human-reviewed · diagram/sim where the topic is visual · reindexed · glossary
terms it introduces exist in `lib/glossary.js`.

---

## 4. Prioritisation Framework

Score every candidate topic on **Impact × Demand ÷ Effort**:

- **Impact (1–5)** — how foundational; does it unlock many later topics? (HTTP, auth, transactions = 5.)
- **Demand (1–5)** — how often beginners hit it / search for it / it appears in interviews.
- **Effort (1–5)** — drafting + diagram/sim cost (a pure-text concept = 1; a new interactive sim = 5).

`priority = (Impact × Demand) / Effort`. Tie-break toward topics that **complete a domain's spine** (no holes in
a learning path) and topics that already have a `"soon"` placeholder in `domains.js` (the map already promises them).

**Proposed first wave** (highest priority, all currently `"soon"` in `domains.js`, all high-impact, low-effort text):

1. **Rate limiting & API gateways** (backend) — high demand, pairs with existing idempotency content.
2. **Common attacks: XSS, SQLi, SSRF** (security) — universal beginner gap; grounds the security world.
3. **Queues, backpressure & sagas** (system-design) — completes the scale spine.
4. **CSS, layout & accessibility** (web) — huge beginner demand, low effort.
5. **Sharding, replicas & NoSQL** (databases) — completes the databases spine.
6. **What a neural network really computes** (ai-ml) — pairs with the existing LLM simulator.
7. **Compute: VMs, containers, serverless** + **Object storage & CDNs** (cloud) — the cloud domain is mostly "soon".

Second wave: offline-first & sync (mobile), gRPC/GraphQL/WebSockets (backend), secrets/rotation & threat
modelling (security), training-vs-inference cost (ai-ml).

---

## 5. Content-Ops Cadence

### 5.1 Tracking done vs gaps

`lib/domains.js` is the **single source of truth for coverage**. Its `status` flag (`"live"` | `"soon"`) and the
derived `CURRICULUM_STATS` ("live / soon / total") are the gap tracker. **Rule: a topic flips to `"live"` only
when it meets the §3.4 Definition of Done.** No "live but empty" cells.

A lightweight **Content Backlog** (a table at the bottom of `docs/plan/05-SYLLABUS-AND-STATUS.md` or a board)
holds: topic · domain · priority score · usage-class of sources · status (backlog → drafting → review → live).

### 5.2 Cadence

- **Weekly**: produce N topics from the prioritised wave (capacity-bound). After each, run `npm run index`.
- **On each topic landing**: update `domains.js` status, add any new glossary terms, verify cross-links.
- **Monthly freshness sweep**: pick the oldest `lastReviewed` topics; re-verify facts, version numbers, and that
  file `refs` still resolve against the current Burger Farm repo.
- **Quarterly licence re-audit**: re-confirm that every `(c)` source still carries the licence we recorded.

### 5.3 Freshness

Fast-moving topics (Next.js/React versions, cloud pricing, LLM specifics) carry a shorter review interval. Evergreen
fundamentals (HTTP, ACID, Big-O) carry a long one. The `lastReviewed` date (§6) drives the monthly sweep ordering.

---

## 6. Metadata & Governance

### 6.1 Per-chunk / per-topic metadata (extend the existing shape)

The index already carries `id, source, category, title, text, url`. Add three governance fields, threaded from
the authored data through `build_knowledge_index.js` into each chunk:

- `license` — e.g. `"CC-BY-4.0"`, `"original"`, `"PostgreSQL"`. **Required for every (c) chunk**; `"original"` for ours.
- `attribution` — display string + URL for (c) sources (satisfies CC-BY/attribution duties).
- `lastReviewed` — ISO date; drives freshness ordering and is shown as "Last reviewed" in the UI.

### 6.2 Source attribution & the manifest

`data/sources.manifest.json` (new) is the canonical registry: every source ↔ `{license, usage, lastChecked,
url}`. It is the audit trail that proves the corpus is clean, and it's what `ingest_resources.js` (rewritten,
§2.5) reads. `lib/resources.js` remains the learner-facing curated library (the "(a) LINK" surface).

### 6.3 Versioning & fact-checking

- **Versioning**: content is data files under git — history *is* the version log. The index is rebuilt
  deterministically from them (`builtAt: "static"`), so a content change + reindex is one reviewable commit.
- **Fact-checking**: the §3.3 human-review step plus the monthly freshness sweep. Two specific hard gates that
  the project's own memory demands: (1) **every code citation must resolve to a real file** (an agent once
  confabulated one), and (2) **no (c) ingestion without a recorded licence**.
- **Attribution discipline**: any CC-BY/CC-BY-SA-derived fact paraphrased into our prose still gets a "further
  reading" link to be generous and safe, even though paraphrase requires no licence.

---

## 7. Summary of decisions (action items)

1. **Lock the three usage classes** and the **(c)-eligible shortlist** (SD-Primer, k8s docs, Distill, Postgres/
   Rust/Go docs, HF course) + all our own content. Everything else is link/paraphrase.
2. **Keep the deploy-safe single committed index** (`lib/knowledge/search_index.json`); the lake stays local.
3. **Extend `build_knowledge_index.js`** to also read `lib/dsa.js` and to thread `license` / `lastReviewed`
   into every chunk.
4. **Retire or rewrite `ingest_resources.js`** as a licence-gated, manifest-driven cloner that only touches
   `usage:"ingest"` sources — and **never run the current version**.
5. **Adopt the per-topic template + lenses checklist + plagiarism/real-ref gates** as the authoring contract.
6. **Drive coverage from `domains.js` status flags**; first wave = the seven high-priority `"soon"` topics in §4.
