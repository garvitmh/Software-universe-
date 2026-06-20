# 05 · Syllabus & Status

Legend: ✅ built · ◐ partial · ⬜ not started. Each topic = a Codex chapter (`/codex/<slug>`) and most have a Simulator interactive (`/simulator/<slug>`).

## Status at a glance
- ✅ **Shell & engine:** Next.js app, Warm Farm design system, `SiteNav`, home/campus, `FlowMap`, shared `Callout`, the `OrderJourney` interactive pattern.
- ✅ **Docs UI (Google-Docs style):** `app/codex/layout.jsx` wraps every Codex page in a left **sidebar** (`components/CodexSidebar.jsx`, all parts + the tech reference, active-highlighting, mobile drawer) and a right **"On this page" scrollspy rail** (`components/OnThisPage.jsx`). Structure driven by `lib/curriculum.js`.
- ✅ **World 1 — The Codex: COMPLETE.** All 10 parts, every chapter grounded in real Burger Farm code.
- ✅ **Tech Reference: COMPLETE — 22 encyclopedic pages.** `/codex/tech/<slug>`, a dynamic route reading `lib/tech-content.js`, rendered by `components/TechArticle.jsx`. Each answers what/inside/why+alternatives/how-we-use/when-it-breaks. Slugs: dart, typescript, nodejs, flutter, riverpod, dio, nextjs, refine, express, prisma, postgresql, sql, http-rest, json, auth, realtime-sync, idempotency, transactions, state-machines, ledgers, caching, concurrency. **Add a key to `TECH_CONTENT` → its page + sidebar entry appear automatically.**
- ✅ **The Roadmap (roadmap.sh-style):** `/roadmap` + `components/Roadmap.jsx` — a clickable system-map spine (drawer → chapter/tech/sim) and a "Deep flows" view stepping through place-order, admin-price-change, and login moment by moment.
- ✅ **World 2 — The Simulator: hub + 4 interactives** (order-journey, scaling, cart-drift, loyalty-ledger).
- ✅ **Home campus:** 3 ways in (Read / Map / Play) + a Tech Reference encyclopedia grid.
- ✅ **Production build green:** 43 static pages (`npm run build`).
- ◐ **More interactives** (Visualgo/Brilliant-style: JWT anatomy, request lifecycle, index/B-tree lookup, the layer call-stack) — next.
- ⬜ **Cross-cutting upgrades** (React-Flow knowledge graph, Mermaid, 3D order-journey, localStorage progress) — optional polish.
- ⬜ **Deploy to Vercel** — owner will do this; site builds clean.

> Dev-server note: after many rapid edits, Next dev can wedge (stale `.next` cache → phantom compile errors or dropped CSS). Fix = `preview_stop` → `rm -rf .next` → `preview_start`. The production build is the source of truth for correctness.

## The curriculum — all Codex chapters built ✅
> Anchors = the real Burger Farm files the chapter is grounded in.

**Part 01 — Foundations** ✅ `/codex/foundations`
- The four characters + the journey of a tap. *(Simulator: `order-journey` ✅.)*

**Part 02 — The thinking tools** ✅
- `/codex/layers-and-separation` — layers, SoC, Repository pattern, Dependency Injection. *Anchor: `menu_repository.dart`, `menu_provider.dart`.*
- `/codex/state-management` — single source of truth, derived/reactive state, Riverpod. *Anchor: `menu_cart_provider.dart`, `menu_provider.dart`.* *(Simulator: `cart-drift` ✅.)*

**Part 03 — Your Flutter app, layer by layer** ✅ `/codex/flutter-app`
- Feature-first folders, navigation/router, Dio client + interceptors (`apiClientProvider`). *Anchor: `apps/mobile-app/lib/features/*`.*

**Part 04 — The backend** ✅ `/codex/backend`
- Request path: middleware → route → service; cookie+JWT+CSRF auth; statelessness. *Anchor: `apps/backend/src/{app.ts,routes,services,middleware}`.*

**Part 05 — The database** ✅ `/codex/database`
- Tables/rows/relations, foreign keys, `Decimal(10,2)` money, `idempotency_key @unique`, transactions, indexes, Prisma. *Anchor: `schema.prisma` (Order/OrderItem/OrderPayment).*

**Part 06 — The admin panel** ✅ `/codex/admin-panel`
- Content-as-data (`ContentBlock`/`ContentItem`), per-store overrides (`StoreProduct`/`StoreAssetOverride`), Refine CRUD, `AuditLog`, reused cookie+CSRF auth. *Anchor: `apps/admin-panel`, schema.*

**Part 07 — The burger builder & motion engine** ✅ `/codex/burger-builder`
- Immutable state + `copyWith` (`BurgerCustomization`), derived geometry (`burger_stack.dart`), motion design tokens (`app_motion.dart`), dynamic add-on prices. *Anchor: `features/menu/presentation/builder/*`, `core/theme/app_motion.dart`.*

**Part 08 — Big systems** ✅ `/codex/big-systems`
- Payment gateway/webhooks, `OrderStatus` state machine, `OrderEvent` audit log, loyalty **ledger** (`LoyaltyTransaction`) with idempotency + optimistic-concurrency `version`, serviceability (`UserAddress` lat/lng). *Anchor: schema loyalty + order models.* *(Simulator: `loyalty-ledger` ✅.)*

**Part 09 — Enterprise plumbing & scale** ✅ `/codex/scale`
- Caching + invalidation, load-balancing/horizontal scaling, queues, read replicas, observability (request-id), `/api/v1` versioning. *(Simulator: `scaling` ✅.)*

**Part 10 — Deployment & ops** ✅ `/codex/deployment`
- Release pipeline, env-var secrets (`.env.example`), build-vs-run (`prisma generate && tsc` → `dist/`), infra-as-code (`render.yaml`), migrations on deploy, containers/Kubernetes. *Anchor: `render.yaml`, backend `package.json` scripts, `.env.example`.*

## World 2 — Simulator interactives
- ✅ `order-journey` — 8-stage pipeline with the POS-offline → queued rescue. (`components/OrderJourney.jsx`)
- ✅ `scaling` — drag users 10→1M, toggle infra, watch health/latency. (`components/ScalingSim.jsx`)
- ✅ `cart-drift` — scattered copies vs one source of truth; the live overcharge bug. (`components/CartDriftSim.jsx`)
- ✅ `loyalty-ledger` — append-only ledger, earn/redeem, idempotent retry block. (`components/LoyaltyLedgerSim.jsx`)
- Hub at `/simulator` lists all four.

## Cross-cutting features still to build (optional polish)
- ⬜ **Knowledge graph** navigation (React Flow) — clickable map instead of the flat home list.
- ⬜ **Mermaid sequence diagrams** per topic.
- ⬜ **3D order-journey** (react-three-fiber + GSAP).
- ⬜ **Progress tracking** (localStorage) — quiet, no quizzes (owner rejected quizzes).
- ⬜ A `layers`/repository "swap the backend" simulator.
- ⬜ **Deploy** to Vercel.

## How to continue
- The pattern for a Codex chapter: see any file in `app/codex/*/page.jsx` — `.wrap-narrow`, back-link, category `.pill`, Fraunces `<h1>`, `.prose` body, `Callout` variants (why/breaks/deeper/scale/giants), prev/next footer. Server components (no `"use client"`).
- The pattern for a Simulator: a `"use client"` component in `components/` + a thin page in `app/simulator/<slug>/page.jsx`; register it in the `SIMS` array in `app/simulator/page.jsx`.
- **Always ground content in the real repo** (`~/Desktop/Burger Farm Dev`), and verify each route returns 200 before committing. Run `npm run build` before deploy.
- Four questions every topic answers: **what · why (+alternatives/tradeoffs) · how · when it breaks.** No quizzes. Plain language, not childish.
