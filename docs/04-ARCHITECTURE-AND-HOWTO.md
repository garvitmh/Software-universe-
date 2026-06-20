# 04 · Architecture & How to add a topic

## Tech
- **Next.js 14.2** (app router), **JavaScript** (`.jsx`, not TypeScript — keep it that way for low friction).
- **React 18** + **framer-motion 11** (animations).
- Plain CSS design system (`app/globals.css`). No Tailwind, no CSS-in-JS lib.
- Fonts via Google Fonts `<link>` in `app/layout.jsx` (not `next/font`, to avoid build-time font fetches).

## Folder layout
```
software-universe/
├── app/
│   ├── globals.css                 # the Warm Farm design system (tokens + helpers)
│   ├── layout.jsx                  # <html>, fonts, <SiteNav/>, footer
│   ├── page.jsx                    # HOME (the campus)
│   ├── codex/<topic>/page.jsx      # World 1 chapters
│   └── simulator/<topic>/page.jsx  # World 2 interactives
├── components/                     # shared (SiteNav, FlowMap, OrderJourney, …)
├── docs/                           # THIS folder — read it first
├── package.json                    # next/react/react-dom/framer-motion
└── jsconfig.json                   # "@/*" import alias → project root
```
Routing convention: **Codex = `/codex/<slug>`**, **Simulator = `/simulator/<slug>`**. Use the slug from `05-SYLLABUS-AND-STATUS.md`.

## Conventions
- Interactive components (anything using framer-motion / state) need `"use client";` at the top. Page files can stay server components and import client components.
- Import shared components via the alias: `import FlowMap from "@/components/FlowMap";`.
- Use the design tokens (`var(--brand)`, `.card`, `.prose`, …) — never hardcode new colours.
- Cite real Burger Farm files in `code` style (e.g. `apps/backend/src/routes/menu.routes.ts`). Read the real file in `~/Desktop/zone-trial` to get it right.

## Recipe: add ONE new topic (do this for every domain)
A topic = a Codex chapter **+** (where it makes sense) a Simulator interactive, cross-linked.

1. **Reverse-engineer first.** Read the relevant real code in `~/Desktop/zone-trial` so the chapter is grounded (real files, real flow). Don't write from generic knowledge.
2. **Codex chapter** — create `app/codex/<slug>/page.jsx`, modelled on `app/codex/foundations/page.jsx`:
   - `.wrap-narrow` + a category `.pill` ("World 1 · The Codex · Part NN") + Fraunces `<h1>` + `.prose` body.
   - Walk the depth ladder (`02-PRODUCT-SPEC.md`); use the `Why` / `What breaks` / `Go deeper` callouts. **Always** answer what / why(+alternatives) / how / when-it-breaks.
   - Embed a diagram (reuse `FlowMap`, or build a small topic-specific SVG/animated component).
   - End with prev/next links.
3. **Simulator interactive** — create `app/simulator/<slug>/page.jsx` + a `components/<Topic>Sim.jsx` client component, modelled on `OrderJourney.jsx`:
   - Pick the right interactive pattern (flow / failure-toggle / slider / click-to-open — see `02-PRODUCT-SPEC.md`).
   - It must let the learner *see and break* the thing, with narration explaining what's happening.
4. **Wire it up** — add the topic to the home learning-path list (`app/page.jsx` `PARTS`), set its status, and cross-link the Codex chapter ↔ the Simulator.
5. **Verify** — run `npm run dev -- -p 4000`, open the new routes, confirm they compile and look right (screenshot). Fix before moving on.
6. **Update status** — tick it off in `05-SYLLABUS-AND-STATUS.md`.

## Patterns worth reusing
- The **animated pipeline + failure toggle + click-to-open detail** in `OrderJourney.jsx` is the template for most "watch a process, then break it" interactives.
- The **looping flow-packet** in `FlowMap.jsx` is the template for "show data moving between parts".
- Later, shared infra to add (see roadmap): a `Callout` component, a `KnowledgeGraph` (React Flow), Mermaid sequence diagrams, a `react-three-fiber` 3D journey, and progress tracking (localStorage).
