# 01 · Vision & Rules

## The goal
Take the owner — a **vibe coder** (has built real software with AI, recognises words like *API / database / frontend* but does **not** truly understand them or *why* they exist) — and grow them, through their own Burger Farm system, into someone who **thinks like a senior engineer**: who understands what each part does, *why* it was built that way, what else could have been done, what breaks without it, and how it changes as it scales.

Their stated aim: **understand deeply AND eventually be able to build it themselves.**

## Who it's for
One learner, deeply. Not a generic course. Every explanation is grounded in **their** real code (real file names, real folders), because "this is *your* `apps/backend`" lands in a way "generic Node.js" never will.

## The philosophy (the "our view")
- **Depth is the goal; confusion is the enemy — and they are not in tension if you climb slowly.** Go as deep as the truth requires, but every sentence must be understandable.
- **Show, don't quiz.** Understanding comes from *seeing it move* and *exploring*, not from being tested. (See the no-quizzes rule below.)
- **Always answer WHY, not just WHAT.** Architecture is the art of tradeoffs. Naming the alternatives we rejected and why is what separates an engineer from a copy-paster.
- **Failure teaches.** The fastest way to understand why a thing exists is to watch what breaks without it.
- **Slowly simple → deep.** Never throw the learner into the deep end. Each topic starts substantive-but-plain and descends.
- **Real codebase as textbook.** Content is reverse-engineered from `~/Desktop/zone-trial`, not invented or generic.

## The rules (NON-NEGOTIABLE — do not break these)
1. **Name:** the product is **"Software Universe."**
2. **Theme:** **"Warm Farm"** only (cream / orange / espresso). See `03-DESIGN-SYSTEM.md`. Warm, calm, uncluttered — inviting for a beginner, never intimidating.
3. **Two worlds:** all content lives in either **The Codex** (read & understand) or **The Simulator** (see & explore). See `02-PRODUCT-SPEC.md`.
4. **NO QUIZZES.** The owner explicitly rejected them: there is too much content to quiz, and quizzes don't measure real understanding. Teach by *visualising and exploring* instead. Do not add graded quizzes.
5. **Not childish.** Do **not** lean on cutesy toy analogies ("imagine a pantry…"). Calibrate **up**: plain language, but substantive and grounded in the real system from the first line. A light real-world framing is fine; a kindergarten metaphor is not.
6. **Every topic answers four questions:** **WHAT** we do · **WHY** this way (+ the alternatives we rejected + tradeoffs) · **HOW** it works · **WHEN it breaks** (what fails, the measures we take, and how we migrate/recover). The "when it breaks" part is **first-class**, not a footnote — the owner specifically wants edge-cases, failure, and migration covered in depth in every domain.
7. **Diagram-heavy.** Lots of visuals — maps, flows, sequence diagrams. Prefer a diagram over a paragraph when it carries the idea.
8. **Deployable & long-term.** The owner will deploy this and use it for a long time. Keep it a clean, standard Next.js app that deploys to Vercel. No throwaway hacks.
9. **Grounded.** Cite real Burger Farm files/folders. When unsure how their system does something, **read the real code in `~/Desktop/zone-trial`** before writing.

## What success looks like
The owner can open the site, wander any domain, *watch* how it works, understand *why* it was built that way and *what would break* if not — and come away thinking like an architect about their own product, and software in general.
