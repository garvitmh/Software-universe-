# 05 · Platform, Architecture, Design System & Engineering

**Status:** master-plan section · **Owner:** Platform/Frontend · **Last reviewed:** 2026-06-24

This section owns *the house the content lives in*: the app skeleton, the design system, search,
performance, accessibility, testing, deployment, and the tech-debt backlog. The other sections
own **what** we teach (01, 02, 06) and **how** we teach it (03 SEE/PRACTICE, 04 ASK). This one
makes all of that fast, themeable, accessible, and deployable for the long term.

**Grounding (real files read, cited exactly):**

- `package.json` — Next `14.2.15`, React `18.3.1`, **JavaScript only** (no TS). Deps: `framer-motion@11.11.17`, `@xyflow/react@12`, `d3@7`, `three@0.169` + `@react-three/fiber@8` + `@react-three/drei@9`, `lenis`, `@floating-ui/react`. Scripts: `dev/build/start`, `prebuild → scripts/build_knowledge_index.js`, `index`.
- `next.config.mjs` — **empty** (`const nextConfig = {}`). No headers, no image/transpile config yet.
- `jsconfig.json` — one alias: `@/* → ./*`.
- `app/globals.css` — the live design tokens (`:root` + `[data-theme="dark"]`), `.card/.pill/.btn/.term/.prose/.codex-shell/.inline-widget` classes, the bold/playful layer (`grad-text`, `sticker`, `chip3d`, `blob`), and one `@media (prefers-reduced-motion: reduce)` rule that guards **only four** decorative animations.
- `app/layout.jsx` — root layout: Google-Fonts `<link>` (Fraunces/Inter/JetBrains Mono), an inline no-flash theme `<script>`, `SiteNav` + `CodexSidebar` + `InlineRAGDrawer` mounted globally; reads `Object.keys(TECH_CONTENT)` for the "ready" sidebar.
- `components/ThemeToggle.jsx` — `data-theme` on `<html>`, `localStorage('theme')`, system fallback via `matchMedia`.
- `components/InlineRAGDrawer.jsx` — the ⌘K drawer; `keydown` (`metaKey||ctrlKey` + `k`), `search-rag-term` event, `localStorage('openai_api_key')`, POSTs `/api/rag/query`. **No client-side content search.**
- `components/SplitPaneViewer.jsx` — iframe + RAG pane; `iframeLoading` starts `true`, only cleared by `onLoad` (the infinite-spinner bug); `fallbackComponent` + `visualizerUrl` props already exist.
- `components/universe/UniverseContext.js` — `useState(INITIAL_MOCK_STATE)`; **no persistence**.
- `scripts/build_knowledge_index.js` — `vm`-sandboxed loader over `lib/glossary.js` + `lib/tech-content.js` → committed `lib/knowledge/search_index.json` (~262 KB).
- `.gitignore` — ignores `data/raw/*`, `data/processed/*`; **un-ignores** `public/models/retro_computer.glb` (16 MB, shipped).
- `.env.example` — `OPENROUTER_API_KEY`, `OPENROUTER_MODEL`, `OPENAI_API_KEY`.
- Footprint: **30 route pages**, **~307 component files** across 21 feature folders (largest: `observatory` 27, `professor-ai` 26, `professor` 23, `planet-scale` 22, `incidents` 22).

> **The single most important structural finding for this section:** the design tokens in
> `globals.css` are **indigo + slate** (`--brand:#6366F1`, `--bg:#F5F7FA`), while the brief and
> `DESIGN.md` both describe a "Warm Farm" **cream/orange/espresso** palette — and `DESIGN.md`
> describes a *third*, dark teal/amber bento direction. **There is no single theme; there are
> three half-stated ones.** That is not a bug to fix — it is the *exact* signal that the token
> layer must become a swappable **theme pack** (§3), so the owner's 2–3-direction exploration is
> a data change, not a refactor. This section makes that cheap.

---

## 1. App architecture & conventions — taming the 307-component sprawl

### 1.1 The problem, stated honestly

307 components in 21 flat-ish folders, most named after a *page feature* (`observatory`,
`planet-scale`, `incidents`, `replay`, `evolution`) that is itself a heavy mock dashboard.
There is no `lib/content/` folder yet (doc 02 proposes it), content lives in five giant `lib/*.js`
files, and `app/layout.jsx` hardwires `tech-content`. The risk is not "too many files" — it is
**no rule for where a new file goes**, which is what produced `professor/` + `professor-ai/`
(49 files, two engines, doc 04 §7) and `components/ui` with only `Icons.jsx` + `CardSpotlight.jsx`.

### 1.2 The target layout (conventions, not a big-bang move)

```
app/                          # ROUTES ONLY. Thin. A page.jsx wires data → a feature component.
  (marketing)/                # route group: home, about — server components, static
  codex/…  dsa/…  worlds/…    # keep existing routes; do NOT rename (breaks links + the index URLs)
  universe/                   # the dashboard route (stays; its guts move to components/dashboard)
  design/                     # NEW — the design-direction playground (§3.6)
  api/rag/…                   # keep
components/
  primitives/                 # design-system atoms: Card, Pill, Button, Callout, CodeBlock,
                              #   Tabs, Term, Badge — theme-only, zero feature logic (§3.5)
  layout/                     # SiteNav, CodexSidebar, Footer, ThemeToggle, CommandMenu (§4)
  content/                    # renderers for content-as-data: TechArticle, DsaProblem,
                              #   DomainGrid, Roadmap, SelfCheck — consume lib/content/*
  sim-kit/                    # the SimShell framework (owned by doc 03)
  sims/                       # one file per simulator (owned by doc 03)
  sandbox/                    # PRACTICE editor + runners (owned by doc 03)
  tutor/                      # ONE AI surface set: RAGDrawer, SplitPane, ModePicker (owned by doc 04)
  dashboard/                  # the universe dashboard's panels (renamed from components/universe/**)
  three/                      # ALL R3F: Hero3D, lazy wrappers, the systems fly-through (§5)
  fx/                         # decorative-only: Bits-style animations, blobs, spotlight
lib/
  content/                    # the content source of truth (doc 02 §C.3): <domain>.js + index.js
  curriculum.js domains.js dsa.js glossary.js resources.js   # become projections (doc 02)
  knowledge/                  # committed RAG index + future aliases/embeddings (doc 04)
  tutor/                      # prompts.js, llm.js, parseLenses.js, learnerStore.js (doc 04)
  search/                     # the client search index builder + matcher config (§4)
  design/                     # tokens.js + theme-pack definitions (§3)
hooks/                        # keep; add useReducedMotionSafe, useTheme, useCommandMenu
scripts/                      # build_knowledge_index.js (+ the doc-06 corpus pipeline)
```

**Naming conventions (write them down, lint them later):**

- **Folders:** lowercase feature nouns (`dashboard`, `tutor`), never a person/metaphor (`professor`).
- **Components:** `PascalCase.jsx`, one component per file, default export named the same.
- **Data/logic modules:** `camelCase.js` in `lib/` (`learnerStore.js`, `tokens.js`).
- **Route files:** only `page.jsx` / `layout.jsx` / `route.js` live under `app/`; everything else imports from `components/` or `lib/`. A `page.jsx` should be **< ~40 lines** — derive data, render one feature component.

### 1.3 Server vs client component rules (currently ad-hoc)

Next App Router defaults to **server components**; the repo over-uses `"use client"` by habit.
The rule:

- **Server (default, no directive):** anything that only *reads content data and renders markup* — `TechArticle`, `DomainGrid`, the codex pages, `dsa/[slug]`. These are static, fast, SEO-good, ship zero JS. Most of the 30 routes can be server components.
- **Client (`"use client"`):** anything touching `window`, `localStorage`, events, timers, or interactive state — `ThemeToggle`, `CommandMenu`, every sim, the tutor surfaces, the dashboard panels. Push the directive **as far down the tree as possible**: a server page can render a server `TechArticle` that contains a small client `<SelfCheck>` island, rather than marking the whole page client.
- **Never** import `three`/`@react-three/fiber`/`d3`/`framer-motion` at the top of a server component — they pull `window` and balloon the server bundle. Gate them behind `next/dynamic({ ssr:false })` from a client wrapper (the proven `HomeHero → Hero3D` pattern, the *only* current `ssr:false` site — generalize it).

### 1.4 The incremental refactor plan (routes never break)

Do this as **rename-and-reexport waves**, each a single reviewable PR, each shippable:

1. **Wave 0 — alias hygiene.** Confirm every import uses `@/…` (jsconfig already supports it). This makes later folder moves a find-replace, not a path-math exercise.
2. **Wave 1 — primitives + content renderers.** Move `Term`, `Callout`, `Card`-like atoms into `components/primitives/`; move `TechArticle`, `DsaProblem`, `DomainGrid` into `components/content/`. Leave a one-line re-export at the old path so nothing breaks; delete shims in a later sweep.
3. **Wave 2 — content data.** Execute doc 02 §C.3: split `lib/tech-content.js` into `lib/content/<domain>.js` + `index.js`; point the old `tech-content.js` export at the union. `app/layout.jsx`’s `Object.keys(TECH_CONTENT)` keeps working unchanged.
4. **Wave 3 — tutor consolidation.** Execute doc 04 §7: collapse `professor/` + `professor-ai/` (49 files) into `components/tutor/` + `lib/tutor/`. Biggest single sprawl win.
5. **Wave 4 — dashboard + three.** Rename `components/universe/**` → `components/dashboard/**`; move all R3F into `components/three/`. The `app/universe` route only changes its imports.
6. **Wave 5 — delete shims + dead code** (§9). Remove the re-export stubs and `scratch/`.

**Route-safety rule:** never rename a folder under `app/` — the URL *is* a contract (it appears
in `search_index.json` chunk `url`s and in the live `domains.js` `href`s). Refactors move
`components/`/`lib/`, never `app/` route segments.

---

## 2. Content-as-data architecture (scaling lib/* → hundreds of routes)

This builds directly on doc 02 (the TOPIC schema + `lib/content/` split) and doc 06 (the
authoring pipeline). This section adds the **runtime/route mechanics**.

### 2.1 The registry pattern

One **registry per content type**, each a plain map `slug → object`, each with a tiny accessor module:

| Type | Source | Registry | Route |
|---|---|---|---|
| Topics (READ) | `lib/content/<domain>.js` → `lib/content/index.js` `TOPICS` | `getTopic(slug)`, `allTopicSlugs()` | `app/codex/tech/[slug]` |
| DSA (PRACTICE) | `lib/dsa.js` (own schema, doc 02) | `getProblem(slug)` | `app/dsa/[slug]` |
| Domains (breadth) | `lib/domains.js` (projection of `TOPICS`) | `getDomain(id)` | `app/learn`, `app/worlds/[slug]` |
| Glossary | `lib/glossary.js` | `getTerm(id)` | tooltips + `[[term]]` |
| Resources | `lib/resources.js` | `getResources(domain)` | `app/codex/library` |
| Sims | `lib/sims/registry.js` (NEW) | `getSim(slug)` | `app/simulator/[name]` (doc 03) |

**Why registries, not folder-walking:** explicit maps are statically analyzable (tree-shake,
`generateStaticParams`, the search index), and they make the "two-spines" drift impossible —
`domains.js`/`curriculum.js` become *derived* from `TOPICS` (doc 02 §C.3), so a topic appears in
the breadth grid, the sidebar, search, and the RAG index from **one** source edit.

### 2.2 Dynamic routes + static generation

The repo already does the right thing for tech + dsa (`[slug]` + `generateStaticParams`). The rule
for *all* content routes:

```js
// app/codex/tech/[slug]/page.jsx  (server component)
import { allTopicSlugs, getTopic } from "@/lib/content";
export function generateStaticParams() {
  return allTopicSlugs().map((slug) => ({ slug }));   // every topic → a static HTML page at build
}
export function generateMetadata({ params }) {
  const t = getTopic(params.slug);
  return { title: `${t.title} — Software Universe`, description: t.oneLiner };
}
export const dynamicParams = false;   // unknown slug → 404, not a runtime render
export default function Page({ params }) { return <TechArticle topic={getTopic(params.slug)} />; }
```

At hundreds of topics this stays a **fully static export** — every topic page is pre-rendered HTML
served from the edge, zero server cost, ideal Lighthouse. Adding a topic is "add a key, rebuild" —
the property doc 02/06 insist on, now formalized as the route contract.

### 2.3 The knowledge-index prebuild as the integration seam

`scripts/build_knowledge_index.js` already reads the content via a `vm` sandbox. When the content
splits into `lib/content/*` (Wave 2), **point the prebuild at `lib/content/index.js`** and extend it
to read `lib/dsa.js` (doc 06 §2.3) and to emit the doc-04 governance fields (`license`,
`lastReviewed`). Crucially, the **same registry feeds two indexes**:

- `lib/knowledge/search_index.json` — the *server* RAG/TF-IDF corpus (existing).
- `lib/search/client-index.json` — a small *client* search index for ⌘K (§4), built in the same prebuild pass so they never drift.

`prebuild` already runs before `next build` and is `|| true`-guarded (CI without content still
builds). Keep that resilience; just widen what it emits.

---

## 3. The design system — Warm Farm tokens, theming, typography, components

This is the section that makes the owner's 2–3-direction exploration **cheap**. The principle:
**components reference semantic tokens; tokens are defined per theme pack; switching direction is
swapping a pack.** No component ever hardcodes a hex value (the codebase is *already* good at this
in `globals.css`; we formalize and complete it).

### 3.1 The token architecture — three layers

```
LAYER 1 · PRIMITIVES  (raw scales, theme-agnostic)
  --indigo-500:#6366F1   --orange-500:#E8560A   --slate-900:#0F172A   …
  spacing/radius/shadow/type scales (§3.3, §3.4)

LAYER 2 · SEMANTIC TOKENS  (role → primitive; THIS is what components use)
  --bg --surface --ink --muted --hairline       (structure)
  --brand --brand-2 --brand-soft                (primary action / identity)
  --accent --accent-soft                        (secondary)
  --good --good-soft --warn --warn-soft --bad --bad-soft   (state; today: teal/amber/pink)
  --radius --radius-lg --shadow --shadow-lg

LAYER 3 · THEME PACKS  (a file maps semantic → primitive for one direction × mode)
  lib/design/themes/warm-farm.js     (cream/orange/espresso — the brief's north star)
  lib/design/themes/classy-edu.js    (the current indigo/slate, productized)
  lib/design/themes/hyper-visual.js  (the DESIGN.md teal/amber bento, dark-first)
  each exports { light:{…semantic→value}, dark:{…} }
```

A build step (or a small `lib/design/emitCss.js`) writes each pack to a CSS block keyed by
`[data-theme="<pack>-light"]` / `[data-theme="<pack>-dark"]`. **The migration is non-breaking:** the
*current* `:root`/`[data-theme="dark"]` becomes the `classy-edu` pack verbatim; nothing changes
until a second pack is selected.

### 3.2 Why this directly solves the owner's exploration

Today, trying "Warm Farm vs classy vs hyper-visual" means editing colours across `globals.css` and
hoping no component inlined a hex. With three layers, a direction is **one file** + a `data-theme`
value. The owner flips packs on `/design` (§3.6) and on the real app via an extended `ThemeToggle`,
sees every representative page in each direction × light/dark, and commits the winner by making it
the default. The exploration cost drops from "a refactor each" to "a data file each."

### 3.3 Typography scale — tuned for long-form readability (the owner's #1 priority)

The reading experience is the product. The current `.prose` is already strong (21px body, 1.75
line-height, Fraunces display / Inter body / JetBrains Mono code) — formalize and harden it:

- **Measure (line length):** cap the reading column at **~68ch** (≈ the existing `max-width:820px`
  in `.codex-content .wrap-narrow`). 45–75ch is the readability sweet spot; lock it as a token
  `--measure: 68ch` and use it, not a pixel width, so it scales with font size.
- **Type scale (modular, ~1.25 minor-third for headings, tighter for UI):**
  `--text-xs:13px · sm:15px · base:19px (body, UI) · lg:21px (prose body) · xl:25px (lead) · 2xl:34px (h2) · 3xl:48px · 4xl:64px (hero)`. Body prose stays **21px** — large on purpose for readability.
- **Rhythm:** `line-height` **1.7** for prose, **1.12** for display headings (current values).
  Vertical rhythm on a `--space` base (§3.4): paragraph spacing `1.25rem`, h2 `3rem` top.
- **Fonts:** keep **Fraunces** (display serif — warmth + authority), **Inter** (body/UI),
  **JetBrains Mono** (code). *Self-host via `next/font/local`* instead of the Google `<link>` in
  `layout.jsx` — kills the render-blocking external request, the FOUT, and a privacy/CLS hit; pin
  subsets (latin) and `font-display: swap`. This is a measurable LCP win (§5).
- **Long-form niceties:** `text-wrap: pretty` on headings, `text-wrap: balance` on leads,
  `hanging-punctuation` where supported, generous `--measure`, and a **max two typefaces visible
  per screen** rule. Dark mode lowers perceived weight — keep `--ink` at full contrast and consider
  a slightly heavier Fraunces optical size (`opsz`) for headings in dark.

### 3.4 Spacing, radius, shadow scales

- **Spacing:** an 8px-based scale token set — `--space-1:4 · 2:8 · 3:12 · 4:16 · 6:24 · 8:32 · 12:48 · 16:64`. Replace the many inline `style={{padding:24}}` literals (e.g. `layout.jsx` footer) with these.
- **Radius:** keep the existing `--radius:14 / -lg:20 / -xl:28 / -chunky:26`; add `--radius-pill:999px`. The "playful" `chip3d`/`sticker` chunky radii belong to the `hyper-visual` pack, not the base.
- **Shadow:** keep `--shadow`/`--shadow-lg` (already warm-tinted) — but note the warm tint is *theme-specific*; move it into the pack so `classy-edu` can use a cooler shadow.
- **Motion:** centralize `--ease-bounce` (exists) + add `--ease-standard:cubic-bezier(.2,.7,.2,1)` and duration tokens, shared with the sim-kit `motion.js` (doc 03 §2.3).

### 3.5 The documented component library (`components/primitives/`)

One canonical, theme-only version of each — the contract that ends per-page reinvention:

| Primitive | Replaces today's | Notes |
|---|---|---|
| `Button` | `.btn/.btn-primary/.btn-ghost/.btn-pop` | variants `primary·ghost·pop`, sizes, `aria` + focus-visible ring |
| `Card` | `.card/.glass-card/.sticker` | variants `flat·glass·sticker` (sticker = playful pack only) |
| `Pill` / `Badge` | `.pill/.chip3d/.side-soon-tag` | status colours from `--good/--warn/--bad` |
| `Callout` | `.bf-aside` (predicted-confusion) | variants `note·predict·warn`; doc 02 `<SelfCheck>` builds on it |
| `CodeBlock` | `.prose code` + future sandbox | inline + block, JetBrains Mono, copy button, a11y |
| `Term` | `components/Term.jsx` (keep) | the `[[term]]` tooltip; already `@floating-ui/react`-ready |
| `Tabs` | the lens tabs in Drawer/SplitPane | reused by AT-SCALE climb (doc 02), tutor lenses (doc 04) |
| `Prose` | `.prose` wrapper | applies `--measure`, the type scale, `text-wrap` |

Each primitive is documented on `/design` (§3.6) with every variant × state × theme. The AI panel
(`components/tutor/*`), `SimShell` (doc 03), and the dashboard panels are **compositions** of these
primitives — they don't re-style.

### 3.6 The `/design` playground route (the exploration cockpit)

A single route that renders representative slices across **directions × light/dark**:

- **Token sheet:** every semantic token as a swatch + its primitive mapping, per pack.
- **Component gallery:** every primitive (§3.5) in all variants/states.
- **Page archetypes rendered in-frame:** a real `TechArticle` (long-form readability), the `/learn` domain grid, a `SimShell` stage, a tutor answer with lenses, and the dashboard hero — each shown in `warm-farm`, `classy-edu`, `hyper-visual`, light and dark, side by side (via scoped `data-theme` wrappers or `<iframe>`s).
- **Controls:** pack selector + light/dark toggle + a `--measure`/`--text-base` slider so the owner *feels* the readability tradeoff live.

This route is **dev-only / `noindex`** and is where the 2–3 directions get decided — not in prod.

### 3.7 Theming approach (robust light/dark + system + manual)

Keep the proven mechanism, complete it:

- `data-theme` on `<html>` (existing) — extend values from `light|dark` to `<pack>-<mode>`.
- The inline no-flash `<script>` in `layout.jsx` stays (it's the right pattern); update it to read both the pack and the mode, default mode from `prefers-color-scheme`.
- `ThemeToggle` (existing) gains a pack-aware `useTheme()` hook in `hooks/`; `color-scheme` is already set in dark — set it per mode for form controls/scrollbars.
- **Never** read theme in a server component; the `data-theme` attribute + CSS variables do all the work at the CSS layer, so server-rendered HTML is theme-agnostic and the toggle is instant with no hydration mismatch (`suppressHydrationWarning` already on `<html>`).

---

## 4. Site-wide search (⌘K) — index everything, reuse the drawer

### 4.1 The gap

`InlineRAGDrawer` already owns ⌘K (`metaKey/ctrlKey + k`) — but it **only sends a RAG query to the
LLM**. There is no instant, local, "jump to a topic/term/sim" search. A learner can't ⌘K → type
"caching" → hit Enter → land on the page. That is the single biggest navigation gap.

### 4.2 The design — one palette, two intents

Make ⌘K a **command menu** with two zones, so it serves *navigation* (fast, local, free) and *ASK*
(grounded, LLM) without forcing a choice:

```
⌘K  ┌─────────────────────────────────────────┐
    │  > caching                                │
    ├───────────────────────────────────────────┤
    │  JUMP TO            (instant, local index) │
    │   ▸ Caching            topic · databases   │
    │   ▸ Cache-aside        glossary term       │
    │   ▸ CacheLab           simulator           │
    │  ─────────────────────────────────────────│
    │  ✨ Ask the Professor about "caching"  ↵   │  ← routes to /api/rag/query (existing path)
    └───────────────────────────────────────────┘
```

- **Top zone = navigation** over a **client-side index** (`lib/search/client-index.json`): every topic (slug, title, tagline, domain), glossary term, DSA problem, sim, and resource. Built in the **same prebuild pass** as the RAG index (§2.3) so they never drift. ~hundreds of tiny records → a few KB gzipped → ship it; fuzzy-match in the browser with a tiny matcher (`fuse.js` ~few KB, or a hand-rolled ranked substring matcher to add zero deps). **No server round-trip** for navigation.
- **Bottom action = ASK** — the existing RAG flow (`fetch('/api/rag/query')`), unchanged, now reachable as the explicit "Ask" affordance instead of being the *only* behavior.

### 4.3 Client vs server split

- **Navigation index = client, static.** Built at prebuild, fetched once, matched in-browser. Zero cost, instant, works offline, no LLM spend.
- **Answers = server.** Only the explicit "Ask" path hits `/api/rag/query` (and its rate limits, doc 04 §5). This cleanly separates "find the page" (cheap, common) from "explain it to me" (expensive, deliberate).

### 4.4 Relationship to the existing RAG drawer

Don't build a second overlay. **Promote `InlineRAGDrawer` into `components/layout/CommandMenu.jsx`:**
add the navigation zone above the existing answer UI, keep the keybind, keep the `search-rag-term`
event entry (so `Term` "Consult Professor" still opens it pre-filled). The drawer's lens-parsing and
key handling are reused verbatim; we're adding a navigation header, not replacing the surface.

### 4.5 UX details

- ⌘K opens; `Esc` closes; `↑/↓` move; `Enter` activates highlighted; `→` on a topic peeks. Recent + suggested topics when the query is empty (driven by `learnerStore` history, doc 04 §6).
- Full keyboard trap + `role="dialog"` + a `listbox` with `aria-activedescendant` (§6).
- Show the result *type* as a chip (topic/term/sim/problem) so intent is obvious.

---

## 5. Performance — budgets, code-splitting, the heavy bits

### 5.1 The four weights, in priority order

1. **The 16 MB hero `.glb`** (`public/models/retro_computer.glb`, deliberately un-gitignored). It's the single largest asset and it's on the **landing page**. Actions: (a) **`<Suspense>` + lazy-mount** the hero `<Canvas>` only when in viewport (it already loads via `next/dynamic ssr:false` in `HomeHero` — add IntersectionObserver gating); (b) **compress the model** — run `gltf-transform` Draco/meshopt + texture resize; a retro-computer mesh should land **1–3 MB**, a 5–10× win, before it ever blocks; (c) ship a **static poster `<img>`** as the immediate LCP element and swap to the canvas after load + for `prefers-reduced-motion`/no-WebGL. Target: the 16 MB never sits on the critical path.
2. **R3F / three bundle (~hundreds of KB).** Rule (doc 03 §4): **one live `<Canvas>` per route**, always `next/dynamic({ ssr:false })` from `components/three/`, `frameloop="demand"` for static scenes, `dpr={[1,1.75]}`. Never import three in a server component.
3. **The universe/dashboard cluster** (`observatory` 27, `incidents` 22, `planet-scale` 22, `replay` 19, `evolution` 16 files) — heavy, client-only, mock-driven. It must be **route-isolated**: it loads only on `/universe`, never bleeds into the content routes' bundles. Verify with `@next/bundle-analyzer` that `/codex/*` and `/dsa/*` ship none of it. Lazy-load individual panels (`next/dynamic`) so the dashboard itself code-splits per tab.
4. **`lib/tech-content.js` (118 KB)** is imported by `app/layout.jsx` (for `Object.keys`). That pulls the *entire* content blob into the root layout's module graph. After the Wave-2 split (§1.4), `layout.jsx` should import only a tiny `allTopicSlugs()` (a string array), not the whole content.

### 5.2 Code-splitting policy

- **Sims, sandbox, tutor, dashboard, three** → all `next/dynamic` with a themed skeleton fallback.
- **Content routes** → server components, static, **zero client JS** beyond small islands (`SelfCheck`, `Term` popover, the ⌘K menu mounted once in layout).
- **Fonts** → `next/font/local` (§3.3) removes the render-blocking Google `<link>`.

### 5.3 Config that's currently missing (`next.config.mjs` is empty)

Add: security/CSP headers (doc 03 §3.5 wants `worker-src`/`frame-src` for the sandbox),
`images` config if/when we add raster art, `experimental.optimizePackageImports` for `framer-motion`
/`d3`/icon sets, and a `transpilePackages` entry only if a dep needs it.

### 5.4 Lighthouse targets & budgets

- **Targets (content routes, mobile):** Performance ≥ 90, Accessibility ≥ 95, Best-Practices ≥ 95, SEO ≥ 95. LCP < 2.5s, CLS < 0.1, INP < 200ms.
- **Budgets (enforced in CI, §7):** content route JS ≤ **120 KB** gzipped; home route (with deferred 3D) first-load ≤ **180 KB** excluding the lazy canvas; `/universe` allowed a higher budget but must not regress content routes. **Fail the build** if a content route imports `three`/the dashboard cluster.

---

## 6. Accessibility — the concrete checklist (mostly absent today)

Today there is **one** `prefers-reduced-motion` rule and it guards only four decorative animations;
sims, the dashboard, and tutor have no reduced-motion story, and some interactive elements are
`<div onClick>`. This is the gap. The checklist (gate every PR against it):

- **Color & contrast:** every semantic token pair (ink-on-surface, brand-on-bg, state colours) meets **WCAG AA** (4.5:1 text, 3:1 large/UI). Verify *per theme pack* on `/design` with a contrast readout. Never use colour as the *only* signal (sims pair colour with icon/label — doc 03 §2.5; apply everywhere).
- **Focus states:** a single visible `:focus-visible` ring token used by every interactive primitive (the current `.term:focus-visible` is the only one — generalize). Never `outline:none` without a replacement.
- **Keyboard nav:** every interactive element is a real `<button>`/`<a>`/native control (audit and fix the `<div onClick>` instances). ⌘K, sims (Space/←/→/R per doc 03), and the dashboard tabs are fully keyboard-operable; focus is trapped in the drawer/modals and restored on close.
- **Reduced motion (the real gap):** a **global** `@media (prefers-reduced-motion: reduce)` that snaps transitions, disables autoplay (sims become step-only — doc 03 §2.5), stops the hero canvas (poster fallback — §5.1), and silences the `blob`/`grad-text`/`floaty`/`shimmer`/`marquee` decoration (extend the current 4-animation guard to all).
- **Semantic structure:** one `<h1>` per page; ordered headings; `<nav>`/`<main>`/`<aside>` landmarks (the codex shell's sidebar/content/rail map cleanly to these); skip-to-content link; `lang="en"` (present).
- **Live regions:** sims expose `aria-live="polite"` status (doc 03 §2.5); the tutor streams into a polite region; the ⌘K result list is a proper `listbox` with `aria-activedescendant`.
- **Images/canvas/sims:** every sim has a prose **text-equivalent** (doc 02 §D.3); the hero has alt text/poster; decorative blobs are `aria-hidden`.
- **Forms/inputs:** the API-key input, range sliders, selects all have associated `<label>`s and `aria-valuetext` (doc 03 §2.5).

---

## 7. Testing & quality

The product is **content + light interactivity**, so the highest-ROI tests are **data integrity and
build/route health**, not deep unit coverage.

- **Content-data integrity (the most valuable, cheapest tests).** A node script (run in CI + as a `prebuild` sibling) asserts, over `lib/content/*` / `dsa.js` / `glossary.js`:
  - every topic has the required lens fields (doc 02 §C.1 schema) and a valid `domain`;
  - every `[[term]]` referenced in prose **exists** in `glossary.js` (no dangling tooltips — doc 02 §D.2);
  - every `related[]` / `prereqs[]` slug **resolves** to a real topic (no broken cross-links);
  - every `howWeUse.refs[]` path **exists in the Burger Farm repo** (the hard gate doc 06 §3.3 + project memory demand — an agent once confabulated one);
  - `domains.js`/`curriculum.js` projections stay consistent with `TOPICS` (the anti-drift check).
- **Link-check:** internal `href`s resolve to real routes; external resource links are reachable (a periodic, non-blocking job — doc 06 freshness sweep).
- **Build smoke:** `next build` succeeds and `generateStaticParams` produces a page for every slug (catches a topic that crashes the renderer).
- **Route smoke tests:** Playwright hits a sample of every route *type* (home, a codex topic, a dsa problem, a sim, `/universe`, ⌘K open) and asserts no console error + the `<h1>` renders. Cheap, catches the "whole route white-screened" class.
- **Accessibility:** `axe-core` (via `@axe-core/playwright`) on the same sampled routes, gating on the §6 checklist; plus a contrast assertion per theme pack.
- **Visual/interaction (optional, later):** Playwright screenshots of `/design` archetypes per theme to catch token regressions.
- **Tooling & CI:** **ESLint** (Next's config) + custom rules banning hex literals in `components/**` (force tokens) and banning `three`/dashboard imports in server components; **Prettier**; **GitHub Actions** running `lint → content-integrity → build → playwright smoke → axe → bundle-budget`. The content-integrity + bundle-budget gates are the two that protect the product's core promises.

---

## 8. Deployment

- **Host: Vercel** (Next 14 App Router, mostly static export → ideal; the RAG route is a serverless function). Connect the GitHub repo; **every PR gets a preview URL**, `main` is **production**.
- **Permanent URL:** a custom domain (or the stable `*.vercel.app` production alias) — pin it, never share preview URLs as the canonical link.
- **Env vars (Vercel → Settings → Environment Variables):** `OPENROUTER_API_KEY` (the one that makes the tutor work for all visitors), optional `OPENROUTER_MODEL`, `OPENAI_API_KEY`; plus doc-04 additions (`OPENROUTER_MODEL_PRO`, an embedding key gated behind a flag, Upstash rate-limit creds). The app **degrades gracefully with no keys** (local-template answers — `.env.example` documents this), so previews work without secrets.
- **The gitignored data-lake problem (handled correctly already, keep it).** `data/raw/*` and `data/processed/*` are gitignored, so **the deploy only ever sees the committed `lib/knowledge/search_index.json`** — exactly the deploy-safe contract doc 06 §2.2 requires. The big lake is a *local authoring aid*; production is the small, licence-cleared, committed index. Document this loudly so no one "fixes" it by committing the lake.
- **The prebuild step.** `prebuild` runs `build_knowledge_index.js` before `next build` and is `|| true`-guarded, so Vercel builds even if the index step hiccups (it falls back to the already-committed index). Keep that resilience. Since the index is committed, the prebuild is *belt-and-suspenders*, not a hard dependency — the safe design.
- **The 16 MB `.glb`** ships via the `!public/models/retro_computer.glb` un-ignore. After §5.1 compression, swap in the smaller model and update the un-ignore — or move large binaries to Vercel Blob / an asset CDN if they grow.
- **Preview vs prod discipline:** previews are throwaway; never index them (`X-Robots-Tag: noindex` on non-prod via a header rule); the `/design` playground is `noindex` everywhere.

---

## 9. Cleanup & tech-debt backlog (prioritized)

Ordered by **(value to the product) ÷ (risk/effort)**. Items P0–P2 unblock the rest of the plan;
P3+ are hygiene.

| # | Pri | Item | Why it matters | Owner doc |
|---|---|---|---|---|
| 1 | **P0** | **SplitPaneViewer infinite-spinner bug.** `iframeLoading` starts `true` and is only cleared by `onLoad`; when `X-Frame-Options`/`frame-ancestors` blocks the embed (`raft.github.io`, `bbycroft.net`/llm, `visualgo.net`), `onLoad` never fires → permanent spinner. Add a ~6s load timeout → themed "can't embed, open in new tab ↗" card; the RAG pane stays usable. | A user-visible broken state on 3 live routes; one-PR fix. | 03 §5 |
| 2 | **P0** | **localStorage key naming.** `InlineRAGDrawer` and `SplitPaneViewer` both store the tutor key under `openai_api_key` even when it's an OpenRouter `sk-or-…` key. Rename to **`su_tutor_api_key`**, detect provider by prefix, migrate the old key on read. | Misleading + collides with any real OpenAI usage; trivial. | 04 §3.1 |
| 3 | **P0** | **Mock dashboard persistence.** `UniverseContext.js` is `useState(INITIAL_MOCK_STATE)`, no persistence; `UniverseDashboard` reads `progress \|\| 35`; `professor-ai/ProfessorMemory` + `professor/LearnerModel` fake mastery. Replace all with the real `lib/tutor/learnerStore.js` (localStorage → Supabase). | The dashboard is the product's "I watched myself grow" payoff and it's currently fiction. | 04 §6 |
| 4 | **P1** | **Duplicate professor systems** (`components/professor/` 23 files + `components/professor-ai/` 26 = **49 files**, two ungrounded rule-engines, neither calls `/api/rag/query`). Salvage the *content* (modes/personas → `lib/tutor/prompts.js`; analogies → `tech-content.js`), delete the *logic*, fold UIs into `components/tutor/`. | Biggest single sprawl + the "one brain, many surfaces" win. | 04 §7 |
| 5 | **P1** | **Iframe sims → owned React sims.** Replace visualgo→BTreeViz, llm→TransformerAttention, raft→RaftConsensus via the existing `fallbackComponent` prop. | Removes off-theme, blockable, out-of-control embeds. | 03 §5 |
| 6 | **P1** | **No client-side ⌘K navigation.** The drawer only does RAG. Add the local navigation index (§4). | The #1 navigation gap. | §4 |
| 7 | **P1** | **Reduced-motion is 4 animations deep.** Global guard covering sims, hero, dashboard, all decoration. | Accessibility floor; doc 03 explicitly flags it. | §6, 03 §2.5 |
| 8 | **P1** | **Content monolith.** `lib/tech-content.js` = 118 KB single file, imported by the root layout. Split per doc 02 §C.3; make `layout.jsx` import only `allTopicSlugs()`. | Authoring scale + a real bundle/perf hit on every route. | 02 §C.3, §5.1 |
| 9 | **P2** | **`next.config.mjs` is empty.** No CSP/headers (sandbox needs them), no `optimizePackageImports`, no `noindex` for previews/design. | Security (sandbox) + perf + SEO hygiene. | §5.3, §8 |
| 10 | **P2** | **Google-Fonts `<link>` in `layout.jsx`** is render-blocking + a CLS/privacy cost. Move to `next/font/local`. | LCP win; readability is priority #1. | §3.3 |
| 11 | **P2** | **16 MB hero `.glb` uncompressed** on the landing page. Draco/meshopt + texture resize → 1–3 MB; poster fallback. | Largest asset on the most-visited route. | §5.1 |
| 12 | **P2** | **Token drift / hardcoded hex.** Inline `style={{}}` hex + the 3-way theme mismatch (globals.css indigo vs DESIGN.md teal vs brief's cream). Land the theme-pack architecture + lint hex out of `components/**`. | Makes the owner's design exploration cheap instead of a refactor. | §3 |
| 13 | **P3** | **Dead code: `scratch/`** (9 ad-hoc `test_*.js`/`ping_*.js` probe scripts) and stale scrapers — `scripts/ingest_resources.js` is the never-run, unsafe scraper (doc 06 §2.5: retire/rewrite, never run as-is). Delete `scratch/`; gate or rewrite the scraper. | Removes confusion + an unsafe foot-gun. | 06 §2.5 |
| 14 | **P3** | **`components/ui` is a near-empty husk** (`Icons.jsx`, `CardSpotlight.jsx`). Fold into `components/primitives/` + `components/fx/`. | Naming/structure consistency. | §1.2, §3.5 |
| 15 | **P3** | **`<div onClick>` interactive elements** across dashboard/sims. Convert to real buttons/links. | A11y + keyboard. | §6 |

---

## Appendix — what this section hands the rest of the plan

1. **A folder/naming contract + an incremental, route-safe refactor** (§1) that absorbs docs 02/03/04's
   new code into `lib/content`, `components/{primitives,content,sim-kit,sims,sandbox,tutor,dashboard,three,fx}`
   without ever renaming an `app/` route.
2. **Registries + `generateStaticParams` + the dual-index prebuild** (§2) so hundreds of topics stay a
   fully static, edge-served, "add-a-key" deploy — and the client search index and RAG index are built
   from one source.
3. **A three-layer token architecture + theme packs + a `/design` playground** (§3) that turns the owner's
   2–3-direction × light/dark exploration into a per-direction *data file*, with a readability-first
   type/measure scale as the spine.
4. **A unified ⌘K** (§4) that adds instant local navigation above the existing RAG drawer — find the page
   *or* ask the Professor, one overlay.
5. **Performance budgets, an a11y checklist, a content-integrity test suite, and a deploy story** (§§5–8)
   that protect the two core promises (it's readable; it's correct) — plus a **prioritized P0–P3 backlog**
   (§9) whose top items (SplitPane spinner, key rename, dashboard persistence) unblock docs 03 and 04.
