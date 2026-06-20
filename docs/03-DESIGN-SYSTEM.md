# 03 · Design System — "Warm Farm"

The single source of truth is **`app/globals.css`** (CSS variables + helper classes). Use it; do not invent new colours per-component. The feel: **warm, calm, premium, uncluttered** — cozy enough for a beginner, never busy or intimidating.

## Palette (CSS variables, in `globals.css`)
| Token | Value | Use |
|---|---|---|
| `--bg` | `#FBF7EE` | page background (warm cream) |
| `--bg-2` | `#F4ECDD` | deeper sections / code chips |
| `--surface` | `#FFFFFF` | cards |
| `--surface-warm` | `#FFFBF4` | inset panels |
| `--ink` | `#241A10` | headings / strong text |
| `--ink-2` | `#5A4A36` | body text |
| `--muted` / `--faint` | `#8A745A` / `#A8916F` | secondary / hints |
| `--hairline` / `--hairline-2` | `#EBDFC9` / `#E2D2B6` | borders |
| `--brand` / `--brand-2` | `#E8560A` / `#C2410C` | primary orange / deep |
| `--brand-soft` | `#FCEBDD` | orange tint fills |

**Category tints** (use to colour-code the four system parts consistently everywhere): app = blue (`--blue` / `--blue-soft`), backend = amber, database = teal, admin = purple. There's also pink (used for "what breaks" callouts).

## Type
- **Display / headings:** `Fraunces` (warm serif), weight 600. Loaded via Google Fonts `<link>` in `app/layout.jsx`.
- **Body / UI:** `Inter`, 400/500/600.
- **Code:** `JetBrains Mono`.
- Headings get `font-family: Fraunces` automatically (see `globals.css`). Section sub-headings inside prose can override to Inter for a cleaner look (see the Codex page).

## Reusable classes (in `globals.css`)
- `.wrap` (max 1080) / `.wrap-narrow` (max 760) — page width.
- `.card` — white, hairline border, soft shadow, rounded.
- `.btn` + `.btn-primary` (orange) / `.btn-ghost` (white).
- `.pill` — small rounded label (recolour with inline style for category pills).
- `.eyebrow` — small uppercase orange label above a heading.
- `.prose` — the reading-typography wrapper for Codex chapters (sets p / h2 / h3 / code / `.lead`).
- `.fade-up` — gentle entrance animation.

## Reusable React components (in `components/`)
- **`SiteNav.jsx`** — sticky top nav (logo + world links + progress chip).
- **`FlowMap.jsx`** *(client)* — the animated four-character system map (App→Backend→Database + Admin), with a looping data-packet. Reused on the home and in Codex chapters.
- **`OrderJourney.jsx`** *(client)* — the flagship Simulator interactive (animated stage pipeline + failure toggle + click-to-open detail). **Use this as the reference pattern** when building new Simulator interactives.
- The Codex `Callout` component (currently inline in `app/codex/foundations/page.jsx`) — variants `why` / `breaks` / `deeper`. When a second chapter needs it, **promote it to `components/Callout.jsx`** and import.

## Rules of the look
- Warm neutrals + one strong accent (orange). Category tints only to encode meaning (which system part), never decoration.
- Generous whitespace. Hairline borders, soft shadows — never heavy.
- Sentence case for UI. Real, tasteful line-icons (inline SVG, stroke style) — match the ones already in `FlowMap`/`OrderJourney`.
- Animations are gentle and meaningful (entrances, the flow packet, stage lighting) — never gratuitous.
