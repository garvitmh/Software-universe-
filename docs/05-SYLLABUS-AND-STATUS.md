# 05 · Syllabus & Status

Legend: ✅ built · ◐ partial · ⬜ not started. Each topic = a Codex chapter (`/codex/<slug>`) + (usually) a Simulator interactive (`/simulator/<slug>`).

## Status at a glance
- ✅ **Shell & engine:** Next.js app, Warm Farm design system, `SiteNav`, home/campus, `FlowMap`, the `OrderJourney` interactive pattern.
- ✅ **Phase 1 content:** Part 1 Foundations (Codex) + the order-journey (Simulator).
- ⬜ **Everything below Part 1**, plus the cross-cutting features (knowledge graph, sequence diagrams, 3D, scaling sliders, deploy).

## The curriculum
> Anchors = the real Burger Farm files/features to read in `~/Desktop/zone-trial` before writing.

**Part 1 — Foundations** ✅
- `foundations` — the four characters + the journey of a tap. *(Codex ✅ + Simulator `order-journey` ✅.)*

**Part 2 — The thinking tools (principles)** ⬜
- `layers-and-separation` — UI→Controller→Service→Repository→DB; Separation of Concerns. *Anchor: `apps/mobile-app/lib/features/menu/*`.*
- `repository-pattern`, `dependency-injection`, `solid-dry-kiss-yagni`, `state-management` (why Riverpod).

**Part 3 — Your Flutter app, layer by layer** ⬜
- `flutter-app` — widgets, providers, controllers, repositories, models, networking. *Anchor: `apps/mobile-app/lib/features/{menu,home}`.*

**Part 4 — Backend & database** ⬜
- `backend` — Express routes/services/middleware; auth (cookies/JWT/CSRF). *Anchor: `apps/backend/src/{routes,services,middleware}`.*
- `database` — Postgres tables, relationships, indexes, transactions, migrations. *Anchor: `apps/backend/prisma/schema.prisma`.*

**Part 5 — The admin panel** ⬜
- `admin-panel` — how one screen controls the whole app; roles; live sync (SSE `MENU_SYNC`/`CONFIG_SYNC`). *Anchor: `apps/admin-panel`.*

**Part 6 — Feature deep-dives** ⬜
- `burger-builder` — the motion engine: layered assets, presets, app↔backend↔admin sync. *Anchor: `apps/mobile-app/lib/features/menu/motion/*` + the admin Presentation Studio.*  ← high-value, the owner is proud of this one.
- `cart-and-orders`, `dynamic-content`.

**Part 7 — Big systems (taught as design space, since being built)** ⬜
- `loyalty` (points vs coupons vs tiers vs hybrid) · `payments` (Razorpay: webhooks, signature verification, idempotency, refunds) · `delivery` (Dunzo/Zomato) · `pos` (Flamboyant: sync, offline).

**Part 8 — Enterprise plumbing** ⬜
- `caching` · `queues` · `rate-limiting-load-balancing` · `security` · `observability` · `testing`. *(Simulator gold here: crash Redis, drop the queue, watch it break.)*

**Part 9 — Scale & evolution** ⬜
- `scaling` — 10 → 1,000,000 users; how the architecture morphs; how the giants do it. *(Simulator: a users slider that re-renders the architecture.)*

**Part 10 — Deployment & ops** ⬜
- `deployment` — what containers / Docker / Kubernetes are; CI/CD; the current Render setup; monitoring.

## Cross-cutting features still to build
- ⬜ **Knowledge graph** navigation (React Flow) — clickable rabbit-hole map instead of a flat list.
- ⬜ **Mermaid sequence diagrams** per topic.
- ⬜ **3D order-journey** (react-three-fiber + GSAP) — upgrade the current smooth-2D journey.
- ⬜ **Scaling sliders** as a reusable interactive.
- ⬜ **Progress tracking** (localStorage) — quiet, no quizzes.
- ⬜ **Promote `Callout` to `components/Callout.jsx`** once a 2nd chapter needs it.
- ⬜ **Deploy** to Vercel.

## Roadmap (phases)
1. ✅ **Phase 1** — shell + Foundations + order-journey (DONE).
2. **Phase 2** — build all Codex chapters + Simulator interactives for Parts 2–6 (the owner's real, existing system).
3. **Phase 3** — Parts 7–10 (the big systems + enterprise + scale + deploy), taught partly as design space.
4. **Phase 4** — cross-cutting upgrades (knowledge graph, sequence diagrams, 3D, scaling sliders) + **deploy to Vercel**.

> The owner wants the **whole thing built before they review it**, so work through Phases 2→4 systematically, keeping each topic consistent with `02`–`04`, and verify each route runs before moving on.
