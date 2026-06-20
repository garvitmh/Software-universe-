# 02 · Product Spec

## The two worlds
Everything is one of these. They share the nav, the Warm Farm skin, and (eventually) the knowledge-graph + progress.

### 🌍 World 1 — The Codex *(read & understand)*
Routes under **`/codex/*`**. The deep library: each domain as a written chapter, **simple → deep**, in plain-but-substantive language, **diagram-heavy**. This is where the *why / alternatives / tradeoffs / what-breaks / how-it-scales* live in full prose + visuals.

### 🌍 World 2 — The Simulator *(see & explore)*
Routes under **`/simulator/*`**. The creative, visual, interactive world: things you press, drag, and break. Watch processes move; flip a failure on and watch the safety net catch it; drag a slider from 10 → 1,000,000 users and watch the design change. This is the primary "make it click" mechanism (since there are no quizzes).

Most domains should have **both**: a Codex chapter *and* a Simulator interactive, cross-linked.

## The shape every topic must take (the "depth ladder")
Within a topic, descend these rungs (skip a rung only if the learner clearly owns it; never skip one they'd need and then build on the gap):
1. **A grounded opening** — a short, real framing of what this is (NOT a childish analogy).
2. **The real thing in Burger Farm** — the actual mechanism in their code, with real file references.
3. **WHY this way** — the decision, the alternatives we rejected, the tradeoffs.
4. **WHAT BREAKS without it** — a concrete failure, the measures we take, how we recover/migrate. *(First-class — give it real space.)*
5. **HOW IT SCALES** — what changes from 10 → 1k → 100k → 1M users / 1 → 1000 stores.
6. **HOW THE GIANTS DO IT** — Netflix / Uber / Stripe / Swiggy / Amazon doing the same thing.

Not every topic needs all six every time, but this is the spine. The four questions from the rules (what / why / how / when-it-breaks) must always be answered.

## Content components (reusable building blocks)
The Codex uses recurring callout boxes so the structure is legible at a glance:
- **Why** (blue) — the decision + alternatives + tradeoffs.
- **What breaks** (pink) — the failure scenario + the fix + the other fixes we could've used.
- **Go deeper** (amber) — what this unlocks next / where to descend.

The Simulator uses recurring interactive patterns:
- **A pipeline/flow** that animates (like the order-journey).
- **A failure toggle** that re-runs the flow showing the disaster → the rescue.
- **Sliders** that change a number (users, load) and re-render the consequence.
- **Click-to-open** stages/nodes that reveal a detail panel.

## What it is NOT
- Not a quiz app. (Rule 4.)
- Not generic tutorials. (Everything is grounded in *their* Burger Farm.)
- Not a wall of text. (Diagram-first; prose supports the visual.)
- Not a single giant page. (One domain = one focused Codex route + one Simulator route.)
