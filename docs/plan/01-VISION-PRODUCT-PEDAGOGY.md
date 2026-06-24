# 01 · Vision, Product & Pedagogy

> Master plan, Section 1 of N. This section defines *what we are building and why it works
> for the learner*. Architecture, content pipeline, and AI are downstream sections.
> Everything below is grounded in the real repo as it stands today — file citations are
> exact so the rest of the plan can build on real surfaces, not invented ones.

**Grounding read (what already exists, cited):**

- `lib/domains.js` — the breadth×depth grid: 11 `DOMAINS`, each with topics; `DEPTH_LADDER` = `local → prod → enterprise → mnc`; `CURRICULUM_STATS` counts live/soon.
- `lib/curriculum.js` — `CODEX_PARTS` (10 reading chapters) + `TECH_SECTIONS` (~30 `TECH_CONTENT` slugs), with `codexHref` / `techHref` helpers.
- `lib/tech-content.js` — every tech article already carries a **fixed lens schema**: `oneLiner, what, analogy, inside, why, alternatives, howWeUse, breaks, related` (verified across all 30 entries).
- `lib/dsa.js` — `DSA_PATTERNS` (`idea` + `recognize`) and `DSA_PROBLEMS` (`statement, recognize, approaches[], twists[], related`).
- `lib/glossary.js` — ~70 plain-language `GLOSSARY` terms (`term, def, more`), surfaced inline via `lib/fmt.jsx` and `components/Term.jsx`.
- `components/SplitPaneViewer.jsx` + `components/InlineRAGDrawer.jsx` — the AI assistant already parses answers into the **WHAT · WHY · HOW · WHEN-IT-BREAKS** tab set.
- `app/learn/page.jsx` — the breadth map (domains grid + depth ladder); `app/codex/*`, `app/dsa/*`, `app/simulator/*`, `app/universe`.

The single most important finding: **the four-lens model (WHAT / WHY / HOW / WHEN-IT-BREAKS)
is already the de-facto contract of the whole product** — it lives in the tech-content
schema, the AI tabs, and `components/Callout.jsx` variants. This plan formalizes and
*extends* that contract into the canonical pedagogy, rather than inventing a new one.

---

## 1. North-star vision & positioning

### The one paragraph

**Software Universe is the place a curious beginner goes to understand *all* of software
engineering — not by collecting facts, but by being walked, in plain language and living
visuals, from "it works on my machine" all the way to "it survives a million users" — with
an always-present AI professor that turns any unfamiliar word into a moment of understanding
instead of a moment of shame.** It is breadth without gaps (every domain a working engineer
touches) and depth without hand-waving (every topic climbs the same ladder: local →
production → enterprise → planet-scale), built on one honest principle — **nothing is left
as a magic word.** If you can read it, you can understand it; if you want to *see* it, there's
a simulator; if you want to *do* it, there's a lab; and if you're ever lost, the professor is
one keystroke away.

### Positioning (who we are, who we are not)

| We ARE | We are NOT |
|---|---|
| A *map + guide* — breadth you can see, depth you can climb | A bootcamp with a fixed syllabus and a deadline |
| Concept-first, grounded in one real codebase (Burger Farm) | A tutorial mill teaching one framework's API surface |
| Calm, adult, "Warm Farm" — readable, never childish | Gamified, badge-driven, streak-shaming |
| Honest about what's built vs. coming (`status: "soon"`) | Pretending to be complete; padding with stubs |
| Quiz-free; mastery is *explaining*, not *scoring* | A graded course (the owner explicitly rejected quizzes) |

We are closest in spirit to "the missing manual for how software actually fits together" —
the thing that sits *between* a glossary (too shallow) and a CS degree (too slow, too
abstract). Our wedge is the **depth ladder**: nobody else teaches *the same concept four
times at four scales* so you feel a system grow under your hands.

### The principles (the constitution every later decision must pass)

1. **No magic words.** Every term of art is either defined inline (`[[term]]` → `<Term>`,
   see `lib/fmt.jsx`) or one click from the professor. A reader is never expected to "just
   know" what an API, a container, or a quorum is.
2. **Breadth has no gaps; depth has no floor and no ceiling.** The `DOMAINS` grid must
   eventually cover every field; every topic must answer the full lens set from absolute-
   beginner up to planet-scale.
3. **Concept over API.** We teach *idempotency*, not "how to call Stripe." The framework is
   the example, never the lesson. (This is why `tech-content` articles always end in
   `howWeUse` + `breaks`, not "installation".)
4. **One world, many lenses.** The same Burger Farm system is the textbook for every domain.
   A learner builds *one mental model of a real system* and views it through frontend,
   backend, data, scale, and security lenses — instead of 11 disconnected toy examples.
5. **Show, don't assert.** If a claim can be a simulator (`app/simulator/*`), it should be.
   "Caching is faster" is a sentence; the scaling sandbox is a felt truth.
6. **Calm by design.** Warm Farm palette, generous reading measure, light+dark. The emotional
   default is *welcome*, not *test*.
7. **Honest scaffolding.** `status: "soon"` and `ready: false` stay visible. We show the
   whole map even when cells are empty — the gap *is* the roadmap, and honesty *is* the trust.
8. **The AI is a professor, not an oracle.** Grounded (RAG over our own corpus), Socratic,
   and it never 500s (see `app/api/rag/*`). It explains; it doesn't replace reading or doing.

---

## 2. The target learner & the emotional journey

### Primary learner

**"Maya, the vibe coder."** She has shipped things — glued a React app together, prompted an
LLM into working code, deployed to Vercel. She *recognizes* words like API, cache, container,
JWT — but she could not honestly explain any of them, and she knows it. She is not stupid;
she is *un-scaffolded*. Her dominant emotion approaching "real engineering" is **quiet
intimidation**: the fear that everyone else got a memo she missed. Our entire pedagogy is
built to dissolve that specific fear.

### The emotional arc (we design *for the feeling*, screen by screen)

```
  INTIMIDATION ──▶ PERMISSION ──▶ TRACTION ──▶ CONFIDENCE ──▶ FLUENCY ──▶ MASTERY
   "everyone        "it's ok       "oh — I      "I can        "I reach     "I can
    knows but        not to         actually     explain       for the      teach this
    me"              know yet"      get this"    this back"    right idea"  to someone"
```

| Stage | What the learner feels | What the product does to move them | Surface |
|---|---|---|---|
| **Intimidation** | "This is for real engineers, not me." | Plain-language `oneLiner` + analogy *before* any jargon; the map shows it's finite, not infinite | `app/learn`, every article's `oneLiner`/`analogy` |
| **Permission** | "It's allowed to not know this." | Inline `<Term>` tooltips remove the cost of every unknown word; professor is always there, never judges | `lib/fmt.jsx`, `InlineRAGDrawer` |
| **Traction** | "Wait — I actually understand that." | One full lens cycle on one concrete concept (e.g. idempotency in Burger Farm) lands | `app/codex/tech/idempotency` |
| **Confidence** | "I can say it in my own words." | "Explain it back" with the professor; self-check prompts (§4) | AI + self-check mechanic |
| **Fluency** | "I reach for the right pattern by reflex." | DSA `recognize` triggers; pattern-first design; cross-domain links | `lib/dsa.js`, `related[]` |
| **Mastery** | "I could mentor someone through this." | Depth-ladder top rungs (enterprise/MNC) + "how the giants do it" lens | `DEPTH_LADDER` mnc rung |

### Personas / levels (orthogonal to domains — a learner has a *level* in *each* domain)

We deliberately split **persona** (who you are / why you're here) from **level** (how deep
you've climbed in a given domain). A backend-fluent learner can be a mobile beginner.

- **L0 · Curious** — "what even is software?" Needs foundations, no prerequisites.
- **L1 · Vibe coder (primary)** — ships with tools, lacks the model underneath.
- **L2 · Junior** — comfortable in one stack, building the breadth.
- **L3 · Crossing over** — strong in one domain, deliberately learning an adjacent one
  (frontend dev learning system design; backend dev learning ML).
- **L4 · Interview-prep** — needs DSA + system design *fast and deep*, pattern-first.
- **L5 · Senior leveling up** — chasing the enterprise/MNC rungs and "how the giants do it."

Levels map directly onto the existing `DEPTH_LADDER` (`local/prod/enterprise/mnc`) — a
learner's level *in a domain* is simply *the highest rung they can explain back*.

---

## 3. The core pedagogical model — the canonical "lenses"

This is the heart of the product and the contract every piece of content must honor.

### Why lenses at all

A beginner doesn't fail because facts are missing — they fail because facts arrive in no
order and answer no question they were asking. **Lenses are a fixed set of questions every
topic answers in the same order, every time.** Consistency is the teaching: by the third
article, the learner *knows what's coming* and reads to fill slots, not to drown. The repo
already proves this works — `tech-content` entries and the AI tabs share one schema.

### The canonical lens set (THE LENSES)

The existing 4 tabs (WHAT/WHY/HOW/WHEN-IT-BREAKS) are the *spine*. We formalize the full set
to **8 canonical lenses**, mapped onto fields that already largely exist in `tech-content.js`:

| # | Lens | The question it answers | Existing field(s) | New? |
|---|---|---|---|---|
| 1 | **WHAT** | "In one plain sentence — and then a fuller picture — what is this?" | `oneLiner`, `what`, `analogy` | exists |
| 2 | **WHY (+ alternatives & tradeoffs)** | "Why does this exist? What would we use instead, and what does each cost?" | `why`, `alternatives` | exists |
| 3 | **HOW** | "How does it actually work — the moving parts you'll really meet?" | `inside`, `howWeUse` | exists |
| 4 | **WHEN-IT-BREAKS** | "What's the bad day? The failure mode that teaches the lesson." | `breaks` | exists |
| 5 | **HISTORY** | "What came before, what problem forced this into existence?" | *(new)* `history` | **add** |
| 6 | **AT-SCALE (local→MNC)** | "How does this change as it grows up the depth ladder?" | *(new)* `atScale{local,prod,enterprise,mnc}` | **add** |
| 7 | **HOW-THE-GIANTS-DO-IT** | "What does Google/Netflix/Stripe-scale reality look like here?" | *(new)* `giants` | **add** |
| 8 | **NOW-YOU-TRY** | "A small, no-grade action that proves you've got it." | *(new)* `tryIt` (links sim/DSA/self-check) | **add** |

Lenses 1–4 are **required** for every topic (and already shipped). Lenses 5–8 are
**progressive**: foundational articles may stop at 4; a topic is "fully realized" only when
all 8 are present. This keeps the bar high without blocking publication — exactly the
`ready: true/false` honesty the repo already uses in `curriculum.js`.

> **Design note — AT-SCALE is the differentiator.** Lens 6 is literally the `DEPTH_LADDER`
> applied *inside one article*. Caching at `local` is a `Map`; at `prod` it's Redis with a
> TTL; at `enterprise` it's cache invalidation across services; at `mnc` it's CDN + regional
> tiers + thundering-herd protection. *Same concept, four rungs* — felt as growth, not as four
> separate topics. This is the single feature most worth building.

### The reusable TOPIC TEMPLATE

A drop-in schema extending the proven `tech-content` shape. This is the authoring contract —
one object per topic, rendered by an upgraded `components/TechArticle.jsx`.

```js
// lib/tech-content.js — extended topic schema (additive; existing fields unchanged)
{
  slug: "caching",
  title: "Caching",
  category: "Cross-cutting logic",
  color: "teal",
  level: "L1",                    // lowest level this article is readable at
  prereqs: ["http-rest"],         // slugs; powers path ordering & "you may want X first"
  estMin: 9,                      // honest reading-time estimate

  // ── LENS 1 · WHAT ──
  oneLiner: "Compute the answer once, then hand out copies — so you don't redo slow work.",
  what:    [ /* 2–3 plain paragraphs; jargon as [[term]] */ ],
  analogy: { title: "...", body: "..." },          // the felt intuition

  // ── LENS 2 · WHY (+ alternatives/tradeoffs) ──
  why:          [ /* the problem it solves */ ],
  alternatives: [ { name, note, tradeoff } ],       // add explicit `tradeoff`
  tradeoffs:    [ /* the costs you accept: staleness, memory, invalidation pain */ ], // NEW

  // ── LENS 3 · HOW ──
  inside:   [ { name, desc } ],                      // the parts you'll meet
  howWeUse: { body: [...], refs: ["apps/..."] },     // grounded in Burger Farm

  // ── LENS 4 · WHEN-IT-BREAKS ──
  breaks: "The concrete bad day — one story, not a checklist.",

  // ── LENS 5 · HISTORY (NEW, progressive) ──
  history: "What we did before this, and the pain that birthed it.",

  // ── LENS 6 · AT-SCALE — the depth ladder, inside the article (NEW) ──
  atScale: {
    local:      "One process, a plain Map. Lost on restart — and that's fine here.",
    prod:       "Redis, TTLs, a cache-aside read path. Now: what about stale data?",
    enterprise: "Shared cache across services; invalidation events; cache stampede locks.",
    mnc:        "CDN edge + regional tiers; request coalescing; the thundering herd."
  },

  // ── LENS 7 · HOW-THE-GIANTS-DO-IT (NEW, progressive) ──
  giants: [ { who: "Netflix", what: "EVCache — multi-region, replicated...", why: "..." } ],

  // ── LENS 8 · NOW-YOU-TRY (NEW) ──
  tryIt: {
    sim:       "/simulator/scaling",     // optional: a simulator to feel it
    dsa:       null,                       // optional: a related lab problem
    selfCheck: [                           // §4 — predict / explain-back prompts, NOT a quiz
      "Before you read on: what happens to a cached value when the underlying data changes?",
      "Explain to the professor, in your own words, why caching trades freshness for speed."
    ]
  },

  related: ["http-rest", "concurrency", "scale"]     // exists — powers the web of links
}
```

**Authoring rules baked into the template:**

- WHAT must land *before* any jargon; the first sentence a 12-year-old could follow.
- Every term-of-art in prose is wrapped `[[like-this]]` so `lib/fmt.jsx` makes it a tooltip.
- `breaks` is **one story**, never a bullet list — failure modes teach as narrative.
- `howWeUse.refs` must cite real Burger Farm paths (keeps us honest and grounded).
- `atScale` rungs reuse the exact `DEPTH_LADDER` ids so the UI can render them as a climb.

---

## 4. The no-quiz philosophy — and what replaces it

**Why no quizzes.** Graded multiple-choice optimizes for *recognition under time pressure* —
the opposite of understanding, and a direct trigger for the intimidation we're fighting. The
owner rejected them; we agree on principle. A quiz tells you *whether* you were right. We want
mechanics that tell you *what you actually understand* and *make understanding deeper in the
act of checking*. Five mechanics replace the quiz — none is graded, none is pass/fail.

### Mechanic A — **Self-check** (retrieval, not recognition)
At the end of each lens block: a single open prompt ("In one sentence, why does a retry not
charge you twice?"). The answer is hidden behind a "Show how we'd put it" reveal — never
scored, never compared. The *act of trying to retrieve* is the learning (the testing effect),
and the reveal models good explanation. **Data home:** `tryIt.selfCheck[]` in the topic
template. **UI:** a `<SelfCheck>` component — prompt → textarea/think → reveal.

### Mechanic B — **Predict-the-confusion** (pre-empt the wrong model)
Before the tricky part, we name the *most common misconception out loud* and ask the learner
to predict: "Most people think a cache is just 'faster storage.' Before you scroll — what do
you think goes wrong with that idea?" Then the article addresses exactly that. This converts
the learner's likely error into an *anticipated, named, resolved* thing — defusing it. **Data
home:** a new `misconception` field per lens. **Surface:** inline `<Predict>` callout
(reuse `components/Callout.jsx` with a new `predict` variant beside `why`/`breaks`).

### Mechanic C — **Challenges** (do-it, in the simulator/lab)
A concrete, ungraded action: "In the scaling sandbox, add a cache layer and watch p99 drop."
Challenges always point at an existing interactive (`app/simulator/*`) or a DSA problem
(`lib/dsa.js` `approaches`/`twists`). Success is *observing the effect*, self-evidently.
**Data home:** `tryIt.sim` / `tryIt.dsa`. For DSA, the `twists[]` already *are* graduated
challenges — we surface them as "now handle this variant."

### Mechanic D — **Spaced review** (return, don't cram)
Not flashcards-as-a-product, but a gentle "Revisit" rail: topics you've opened resurface on a
spaced schedule (1d / 3d / 7d / 21d) as a *single self-check prompt*, not a re-read. Purely
client-side (localStorage) review queue, surfaced in `app/universe` (the dashboard) and on the
home rail. No streaks, no shame — a missed day just slides the schedule. **Design-only here;**
the data model is "topicId → lastSeen → nextDue."

### Mechanic E — **Explain-it-back** (the keystone, AI-mediated)
The learner explains the concept *to the professor in their own words*; the professor (grounded
RAG) responds Socratically — "Good — and what happens when two requests arrive at once?" —
finding the *gap*, never grading. This is the closest thing to the true test of mastery
("can you teach it?") and it's uniquely possible because we *have* a grounded AI
(`components/professor-ai/SocraticEngine.js`, `app/api/rag/*`). **The professor is tuned to
probe, not praise:** it asks the next question the learner can't yet answer, which is exactly
where learning lives.

> **The replacement, in one line:** quizzes ask *"did you get it right?"*; our five mechanics
> ask *"can you retrieve it, predict its failure, do it, recall it later, and teach it?"* —
> and every one of those, *in the doing*, deepens the understanding it checks.

---

## 5. Learning PATHS / TRACKS

The map (`app/learn`) is breadth-first and non-linear *on purpose* — but a true beginner needs
a **rope through the maze**. A **Path** is an *ordered sequence of (domain, topic, rung) cells*
through the existing breadth×depth grid, plus a why-this-order narrative. Paths are data, not
new content — they reference existing `domains.js` topics and `tech-content` slugs.

### The path schema (new file `lib/paths.js`)

```js
export const PATHS = [{
  id: "cs-from-scratch",
  title: "CS from scratch",
  for: "L0–L1 · never formally learned how software fits together",
  promise: "By the end you can explain a request's whole journey, and what each part is for.",
  estHours: 10,
  steps: [
    { slug: "foundations", rung: "local", why: "See the whole machine before any one part." },
    { slug: "http-rest",  rung: "local", why: "How two programs talk at all." },
    { slug: "json",       rung: "local" },
    { slug: "backend",    rung: "prod"  },
    { slug: "database",   rung: "prod"  },
    { slug: "auth",       rung: "prod", why: "Now that data is real, prove who's asking." },
    // ...climbing rungs as the path advances
  ],
}]
```

### The canonical paths (each an ordered climb through the grid)

| Path | Persona | Spine (domains, in order) | Climbs to |
|---|---|---|---|
| **CS from scratch** | L0–L1 | foundations → web → backend → databases → system-design | `prod` |
| **Frontend** | L1–L2 | web → mobile → foundations(state) → a11y/CSS *(soon)* | `enterprise` |
| **Backend** | L1–L3 | backend → databases → system-design → devops → security | `enterprise` |
| **DSA for interviews** | L4 | dsa (pattern by pattern, `recognize`→`approaches`→`twists`) | optimal+twists |
| **System Design** | L4–L5 | system-design → databases(sharding) → cloud → devops | `mnc` |
| **AI Engineer** | L2–L4 | ai-ml → backend(APIs) → databases(vectors) → cloud(cost) | `prod`→`enterprise` |
| **Full-stack tour** | L1–L2 | the whole Burger Farm: mobile → web → backend → db → deploy | `prod` |

Paths *reuse* the existing `status`/`ready` honesty: a path step pointing at a `soon` topic
renders as "coming next on this path," never a dead link.

### Navigation / UX model — choosing breadth vs. depth

The core UX tension is **breadth (wander the map) vs. depth (climb one ladder) vs. guidance
(follow a rope).** We resolve it with **three coexisting entry modes over one grid**, so the
learner is never forced to commit:

1. **MAP mode** (`app/learn`, exists) — the 11-domain grid + depth ladder. *Breadth.* "Show me
   everything; let me wander." Already built; we add a depth toggle so each domain card can
   expand to show the four rungs.
2. **PATH mode** (new, `app/learn/path/[id]`) — a single rope: ordered steps, your position, "next
   up," why-this-order. *Guidance.* The default for L0–L2 and the home page's primary CTA.
3. **TOPIC mode** (`app/codex/tech/[slug]`, exists) — one concept, all 8 lenses, with the
   AT-SCALE lens letting you climb rungs *in place*. *Depth.* Plus `related[]` for lateral
   wandering back out to the map.

**The rule that ties them together:** *every surface offers all three moves.* From any topic
you can go **up** (the path it belongs to), **out** (related topics / the map), or **down**
(the next rung of the depth ladder). The learner chooses breadth-vs-depth *continuously*, by
which arrow they take — never via a mode-switch they have to think about. A persistent "you
are here" breadcrumb (`domain › topic › rung`) makes the two axes always legible.

---

## 6. Progress & mastery model (design-only, no gamification)

**What "mastered" means — per topic.** Mastery is **not** "pages read" or "minutes spent." A
topic is mastered when the learner can, *in their own words*, satisfy its lenses. We define
four honest, self-attested states (no scoring, no badges):

| State | Meaning | How it's reached |
|---|---|---|
| **Unseen** | not yet opened | — |
| **Read** | opened, lenses viewed | viewing WHAT→WHEN-IT-BREAKS |
| **Practiced** | did the NOW-YOU-TRY (sim/lab) or a self-check | Mechanic A/C |
| **Explained** | taught it back to the professor; gaps probed & filled | Mechanic E |

"Explained" is the mastery bar — it maps to the real-world test ("can you teach it?") and is
the only state the professor, not the click-counter, confers.

**Per-rung mastery.** Because of the depth ladder, mastery is *per rung*: you can have
*Explained* caching at `local`/`prod` but only *Read* at `mnc`. A topic's overall state is the
**highest rung you can explain** — directly reusing `DEPTH_LADDER`.

**How it's shown (calm, not gamified):**

- A small four-segment **rung meter** on each topic card (one filled bar per explained rung) —
  informational, never a "score," no number, no percent shown competitively.
- On `app/learn`, each domain shows "you can explain N of M topics at the *production* rung" —
  framed as *coverage of understanding*, not points.
- On `app/universe` (the dashboard), a **personal map heat-overlay**: domains you've explained
  glow warm; unseen stay cream. The map *fills in* as you understand — the only "progress
  animation" we allow, because it mirrors a real mental model forming.
- **No** streaks, leaderboards, XP, levels-as-numbers, or daily-goal nags. The spaced-review
  rail (Mechanic D) is the only recurring nudge, and a missed day costs nothing.

**Where it lives (design-only).** Client-side first: `localStorage` keyed by `topicId:rung →
state`. The model is portable to a backend later, but Phase 1 needs no accounts — lowering the
intimidation barrier (no signup wall) is itself pedagogy.

---

## 7. Accessibility & inclusivity principles for learning

Accessibility here is **two layers**: cognitive/linguistic (can a nervous ESL beginner
*understand* it?) and technical a11y (can everyone *operate* it?). Both are non-negotiable.

**Reading level & language.**
- Target **Grade 8–9 reading level** for all WHAT/WHY prose; jargon is *introduced*, never
  *assumed* — every term-of-art is a `[[term]]` tooltip (`lib/fmt.jsx`). This is already the
  glossary's stated rule ("1–2 sentences a total beginner can understand").
- **Short sentences, active voice, concrete nouns.** One idea per sentence. Analogy *before*
  abstraction (the `analogy` field is mandatory, not optional).
- **ESL-friendly:** avoid idioms in the *core* explanation (idioms allowed only in the optional
  `analogy`, where they aid memory); expand every acronym on first use; consistent vocabulary
  (don't call it a "service" here and a "microservice" there without saying they're the same).

**Neurodiversity & cognitive load.**
- **Chunking:** the lens structure *is* a cognitive-load tool — fixed, predictable sections so
  working memory isn't spent on "where is this going?"
- **No timers, no graded tests** — directly reduces anxiety-driven dropout (a core reason the
  no-quiz stance is also an *accessibility* stance).
- **Multiple representations** of the same idea (READ / SEE / PRACTICE / ASK) so a learner can
  reach understanding via their strongest channel — text, animation, doing, or dialogue.
- **Calm motion:** honor `prefers-reduced-motion` across all `framer-motion`/`lenis` animation
  (`app/simulator/*` especially); motion must never be required to understand content.

**Technical a11y (WCAG 2.2 AA as the floor).**
- **Color contrast:** Warm Farm palette must pass AA in *both* light and dark — meaning never
  rely on the tint (`brand/purple/blue/amber/teal/pink` in `domains.js`) alone to convey state;
  pair every color with text/icon (status is already text "live"/"soon," good).
- **Keyboard & focus:** every interactive — map cards, simulators, the professor drawer
  (`InlineRAGDrawer`), DSA tabs — fully keyboard-operable with visible focus rings.
- **Semantics & SR:** real heading hierarchy per lens (`<h2>` per lens), `<Term>` tooltips
  exposed via `aria-describedby`, simulators given text-equivalent summaries (a chart's point
  stated in prose) so a screen-reader user gets the same lesson.
- **Responsive & zoom:** readable to 200% zoom; single-column reflow on mobile.

**Inclusivity of examples.** Burger Farm is a deliberately *neutral, universal* domain (food,
orders, money) — no examples that assume Western/finance/gaming cultural context. Keep it so.

---

## 8. Success metrics & the definition of mastery

We optimize for **understanding that persists and transfers** — not engagement, not time-on-
site (a metric that *rewards confusion*). Metrics serve the learner; vanity metrics are banned.

### The product's definition of mastery (what we optimize for)

> **A learner has mastered Software Universe's promise when they can take a system they've
> never seen, name which domains it touches, explain each part's job in plain language,
> reason about how it would change from one user to a million, and predict where it would
> break — and do all of this without us.**

That is the north-star outcome. Every feature is judged by whether it moves a learner toward
*that* sentence.

### Leading indicators (do the mechanics work?)

- **Lens completion:** % of topic visits that reach the WHEN-IT-BREAKS lens (we want learners
  finishing the arc, not bouncing after WHAT).
- **Explain-back rate:** % of Read topics that reach **Explained** (Mechanic E engagement) —
  the single best proxy for real understanding.
- **Self-check attempt rate:** % of self-checks where the learner *attempts* before revealing
  (retrieval is the learning; reveal-without-trying is the failure mode).
- **Depth climb:** distribution of mastered rungs (are learners climbing past `prod`, or
  stalling at `local`?). A healthy product pushes mass up the ladder over time.
- **Term-tooltip usage that decreases over time** for a given learner — a beautiful signal:
  they're *internalizing* vocabulary, needing the crutch less.

### Lagging / outcome indicators

- **Path completion** (did the rope get them across?) and, crucially, *self-reported
  confidence shift* on the topics a path covers (a 1-question pre/post, "could you explain X to
  a friend?" — yes/sort-of/no) — measuring the **intimidation→confidence** arc directly.
- **Transfer:** can a learner who finished "System Design" correctly reason about a *new* system
  in an explain-back? (Sampled via the professor.)
- **Return-to-review adherence** (Mechanic D) as a retention signal — not as a streak to shame.

### Anti-metrics (we explicitly do NOT optimize)

Time-on-page (confusion inflates it), pages-per-session, streak length, quiz scores (none
exist), badge counts. If a feature only moves these, it's the wrong feature.

### Definition of Done for *content* (the publishing bar)

A topic is **shippable** (`ready: true`) when it has lenses 1–4 with a mandatory `analogy`, all
prose at Grade 8–9 with `[[term]]` markup, `howWeUse.refs` citing real Burger Farm paths, and
one NOW-YOU-TRY action. It is **fully realized** when all 8 lenses (incl. AT-SCALE across all
four rungs) are present. We stay honest about which is which — exactly as `curriculum.js`
already distinguishes `ready: true/false`.

---

## Appendix — top changes this section implies for the rest of the plan

1. **Extend the topic schema** in `lib/tech-content.js` with `history`, `atScale{...}`,
   `giants`, `tryIt{selfCheck,sim,dsa}`, `misconception`, and `tradeoffs`; upgrade
   `components/TechArticle.jsx` to render the 8 lenses (1–4 always, 5–8 when present).
2. **Add `lib/paths.js`** + `app/learn/path/[id]` (PATH mode) and a depth toggle on
   `app/learn` cards (rung expansion) — turning the existing breadth map into breadth+depth+rope.
3. **Build the five no-quiz mechanics** as small components (`<SelfCheck>`, `<Predict>`,
   a spaced-review rail) and tune the professor (`SocraticEngine.js`) for *explain-back* —
   reusing the already-shipped WHAT/WHY/HOW/BREAKS parsing in `SplitPaneViewer.jsx`.
4. **Add a client-side mastery store** (`topicId:rung → state`) and the calm rung-meter +
   map heat-overlay on `app/universe` — no accounts, no gamification.
```
