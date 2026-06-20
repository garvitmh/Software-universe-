# Software Universe — documentation

> **If you are an AI (or human) picking this project up: read these docs in order, then read the code. They tell you what this is, what it must become, the rules you must not break, and exactly how to add the next piece. Build in the spirit described here — not just to the letter.**

## What this project is (30 seconds)
**Software Universe** is a deployable, interactive learning website that teaches one specific person — a self-described *"vibe coder"* (the project owner) — how their own **Burger Farm** app actually works, and through it, software engineering from **absolute beginner → enterprise**. The owner's real codebase is the textbook. It is **not documentation**; it is an explorable university.

The Burger Farm codebase it teaches lives separately at `~/Desktop/zone-trial` (a Flutter app + Node/Express backend + PostgreSQL + Next.js admin panel).

## Read these in order
1. **[01-VISION-AND-RULES.md](01-VISION-AND-RULES.md)** — the goal, who it's for, the philosophy, and the non-negotiable rules / decisions. *Start here.*
2. **[02-PRODUCT-SPEC.md](02-PRODUCT-SPEC.md)** — the two "worlds", the teaching method, and the exact shape every topic must take.
3. **[03-DESIGN-SYSTEM.md](03-DESIGN-SYSTEM.md)** — the "Warm Farm" look: colours, fonts, components, patterns.
4. **[04-ARCHITECTURE-AND-HOWTO.md](04-ARCHITECTURE-AND-HOWTO.md)** — the tech, the folder layout, conventions, and a step-by-step recipe for adding a topic.
5. **[05-SYLLABUS-AND-STATUS.md](05-SYLLABUS-AND-STATUS.md)** — the full curriculum, what's built, what's left, and the roadmap to "done + deployed".

## How to run it
```
cd ~/Desktop/software-universe
npm install        # first time only
npm run dev -- -p 4000
# open http://localhost:4000
```
Next.js 14 (app router, JavaScript — not TypeScript). Deploys free to Vercel when ready.

## The one-line spirit
> Turn a vibe coder into someone who thinks like an architect — by letting them *explore* their own system, see *why* every decision was made, and *watch* what breaks when it's done wrong.
