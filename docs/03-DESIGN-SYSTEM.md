# 03 · Design System — "Editorial"

> For working method + continuation, see `docs/00-AI-HANDOFF.md`.

The single source of truth is **`app/globals.css`** (CSS variables + helper classes). Use those tokens and classes; do not invent new colours or fonts per-component.

The locked design direction is **"Editorial"** (internally "Direction 2") — a *textbook-as-software* look. The page reads like a finely set print volume: warm off-white "paper", serif body type, italic serif for emphasis, uppercase mono for labels, hairline rules, drop-caps, roman numerals, `§` section marks and `Fig.` captions. Calm, authoritative, premium — never busy.

The authoritative visual reference lives at **`docs/design/editorial/`** — `reference.html` (the full styled mock) plus `screens/` (exported PNGs). When in doubt about spacing/feel, match that.

---

## Palette — light (`:root` in `globals.css`)

| Token | Value | Use |
|---|---|---|
| `--bg` | `#FBFAF6` | page background — warm off-white "paper" |
| `--bg-2` | `#F4F1E8` | deeper sections / inset bands |
| `--surface` | `#FFFFFF` | cards |
| `--surface-warm` | `#F4F1E8` | inset panels |
| `--surface-2` | `#F4F1E8` | hover / fig backgrounds |
| `--ink` | `#1C1A15` | headings / strong text |
| `--ink-2` | `#57534A` | body text |
| `--ink-3` | `#8B857A` | mono eyebrows / labels / captions |
| `--muted` | `#8B857A` | secondary text |
| `--faint` | `#A8A294` | hints / "soon" states |
| `--hairline` | `#E6E1D4` | borders (alias `--border`) |
| `--hairline-2` | `#D6D0C0` | stronger borders (alias `--border-2`) |
| `--border` | `#E6E1D4` | = `--hairline` |
| `--border-2` | `#D6D0C0` | = `--hairline-2` |
| `--primary` | `#2E4B73` | **navy** — primary accent |
| `--accent` | `#9C4422` | **rust** — secondary accent |
| `--brand` | `#2E4B73` | legacy alias → `--primary` |
| `--brand-2` | `#9C4422` | legacy alias → `--accent` |
| `--brand-soft` | `#E8EEF5` | navy tint fill (pills, active links) |
| `--bronze` | `#9A7B45` | tertiary metallic accent |
| `--code-bg` | `#F4F1E8` | inline / block code background |
| `--code-ink` | `#2A2720` | code text |
| `--tip-bg` | `#FFFFFF` | tooltip / term-pop background |

**Category tints** (encode the four system parts; retuned to the warm palette so they don't clash):
`--blue` `#2E4B73` / `--blue-soft` `#E8EEF5` (app) · `--amber` `#9C4422` / `--amber-soft` `#F6E9E1` (backend) · `--teal` `#4A6B57` / `--teal-soft` `#E8EFE9` (database) · `--purple` `#5B5170` / `--purple-soft` `#ECEAF1` (admin) · `--pink` `#8A4A5A` / `--pink-soft` `#F4E8EC` ("what breaks" callouts).

**Shape / depth tokens:** `--shadow` `0 1px 2px rgba(40,36,28,.06)`, `--shadow-lg` `0 14px 38px -20px rgba(40,36,28,.28)`, `--radius` `8px`, `--radius-lg` `10px`, `--radius-xl` `14px`, `--maxw` `1200px`.

> There is also a separate **"Bold & playful"** accent set in `:root` (`--pop-pink`, `--pop-blue`, `--pop-purple`, `--pop-yellow`, `--pop-lime`, the `--grad-*` gradients, `--ease-bounce`, `--radius-chunky`) used by `.grad-text`, `.sticker`, `.chip3d`, `.btn-pop`, blobs, etc. These belong to the older bold-home/aux pages, **not** the Editorial look. Don't reach for them on Editorial pages.

## Palette — dark (`[data-theme="dark"]`)

Dark mode is **warm charcoal**, not cold grey. Accents lighten for contrast on the dark paper.

| Token | Value | Use |
|---|---|---|
| `--bg` | `#1A1915` | page background — warm charcoal |
| `--bg-2` | `#2A281F` | deeper sections |
| `--surface` | `#222018` | cards |
| `--surface-warm` / `--surface-2` | `#2A281F` | inset panels / hover |
| `--ink` | `#ECE7DB` | headings / strong text |
| `--ink-2` | `#B4AE9E` | body text |
| `--ink-3` | `#857F70` | mono eyebrows / labels |
| `--muted` | `#857F70` | secondary text |
| `--faint` | `#6E6A5E` | hints |
| `--hairline` / `--border` | `#34322A` | borders |
| `--hairline-2` / `--border-2` | `#403D33` | stronger borders |
| `--primary` (+ `--brand`) | `#90B2DE` | navy, lightened |
| `--accent` (+ `--brand-2`) | `#D4895E` | rust, lightened |
| `--brand-soft` | `#27323F` | navy tint fill |
| `--bronze` | `#CAA468` | tertiary accent |
| `--code-bg` | `#15140F` | code background |
| `--code-ink` | `#E6E1D4` | code text |
| `--tip-bg` | `#2A281F` | tooltip background |

Dark category tints: `--blue` `#90B2DE`/`#27323F`, `--amber` `#D4895E`/`#3A2E25`, `--teal` `#8FB39C`/`#25302A`, `--purple` `#ADA2C4`/`#2E2A38`, `--pink` `#C99AA8`/`#382A2E`. Dark shadows deepen (`--shadow`, `--shadow-lg` use `rgba(0,0,0,…)`); `color-scheme: dark` is set.

Theme is toggled by `data-theme="dark"` on `<html>`, set by an inline boot script in `app/layout.jsx` (reads `localStorage.theme`, else falls back to `prefers-color-scheme`).

---

## Type

Three families, all loaded via a single Google Fonts `<link>` in `app/layout.jsx` (`<head>`), exposed as CSS variables in `:root`:

| Variable | Stack | Role |
|---|---|---|
| `--font-display` | `"Newsreader", Georgia, "Times New Roman", serif` | **Display serif** — all `h1–h4` (auto-applied in `globals.css`), weight 600; **italic** Newsreader for emphasis (deks, "finally understood.", quote tags). |
| `--font-body` | `"Source Serif 4", Georgia, serif` | **Body / reading type** — set on `body`, 18px base, line-height 1.65. |
| `--font-mono` | `"IBM Plex Mono", ui-monospace, "SF Mono", Menlo, monospace` | **Uppercase eyebrows / labels / code** — `.eyebrow`, `.ed-label`, footer, captions, code. |

- `h1–h4` automatically use `--font-display` (weight 600, line-height 1.12, letter-spacing −.01em). Display headings are often set at weight 500 inline for the lighter editorial feel (see `app/dsa/page.jsx`, `CaseStudyChapter.jsx`).
- Body copy uses `--font-body` (Source Serif 4). `.prose` tightens reading typography for lesson pages (p 19px/1.8, `.lead` 23px).
- `--font-mono` (IBM Plex Mono) is reserved for **uppercase tracked labels** — eyebrows, section/figure markers, the footer Vol./est. lines, captions, and inline/block code.

### Known migration debt — leftover fonts

`app/layout.jsx` STILL loads **Fraunces, Inter, and JetBrains Mono** in the same Google Fonts `<link>`. These are *not* part of Editorial; they are leftovers from the older "Warm Farm" / bold-home pass, still referenced by **un-migrated auxiliary pages** (`/universe`, `/worlds`, `/roadmap`, `/plan`) and a few stray rules in `globals.css` (e.g. `.plan-doc code`/`pre`, `.side-group-num`, `.inline-widget-title`, `.bf-aside` still hardcode `"JetBrains Mono"` / `"Inter"`). **Debt:** once those pages move to the Editorial fonts (`--font-display` / `--font-body` / `--font-mono`), drop Fraunces + Inter + JetBrains Mono from the `<link>` and from `globals.css`. Until then, leave them — removing early would break the aux pages.

---

## Editorial motifs (the recurring "textbook" devices)

Confirmed in use across `app/dsa/page.jsx`, `app/learn/page.jsx`, `components/case-study/CaseStudyChapter.jsx`, `components/TechArticle.jsx`, and the `app/simulator/*` pages:

- **Drop-caps** — first letter of an opening paragraph. Class `.ed-dropcap` (`::first-letter` float, Newsreader 58px). Applied via `TechArticle`'s `dropFirst` prop; the reference hero hand-rolls one.
- **Roman numerals** — volume/chapter numbering. `Vol. I` in the nav footer, home and Codex; `app/learn/page.jsx` exports a `ROMAN` array (`I … XX`) for chapter numbers.
- **`§` section markers** — a mono `§` glyph prefixes section `h2`s (`CaseStudyChapter.jsx`, `TechArticle.jsx`, several sim pages).
- **`Fig.` captions** — figures/diagrams get a mono caption `Fig. — …` in `--ink-3` (`CaseStudyChapter.jsx`, `app/page.jsx`, `app/simulator/page.jsx`).
- **Uppercase mono eyebrows** — small tracked labels above headings: `.eyebrow` (10.5px, letter-spacing .14em) and `.ed-label`, both `--font-mono` / `--ink-3`.
- **Zero-padded indices** — `01`, `02`, … in mono before list items (`app/dsa/page.jsx`).
- **Hairline borders** — 1px `--hairline` rules everywhere (cards, sidebars, rails, footer); the look leans on rules + whitespace, not heavy shadows.
- **Italic display deks** — section sub-titles / pull-quotes set in italic Newsreader (`CaseStudyChapter.jsx` `dek`, reference quote tags).

---

## Reusable classes (in `globals.css`)

- `.wrap` (max `--maxw` 1200) / `.wrap-narrow` (max 760) — page width.
- `.card` — surface, hairline border, `--radius-lg`, soft shadow.
- `.btn` + `.btn-primary` / `.btn-ghost` — buttons (radius 14px).
- `.pill` — small rounded label (`--brand-soft` fill, `--brand-2` text).
- `.eyebrow` / `.ed-label` — uppercase mono labels.
- `.prose` — reading typography for Codex/lesson chapters (sets p / h2 / h3 / code / `.lead`); `.ed-dropcap` for the lead drop-cap.
- **Docs/Codex layout:** `.codex-shell` (sidebar · content · rail), `.codex-sidebar`, `.codex-content`, `.codex-rail`, `.side-link`, `.rail-link`, `.breakout` (wide figures).
- **Inline reading widgets:** `.inline-widget`, `.term` / `.term-pop` (jargon-buster), `.bf-aside` (predicted-confusion catcher).
- **Motion:** `.fade-up` / `@keyframes fadeUp` and the Editorial `.ed-rise` / `@keyframes ed-rise` (gentle 8px rise). Both respect `prefers-reduced-motion`.

## Rules of the look

- Warm neutral paper + two restrained accents: **navy `--primary`** (structure, links, active) and **rust `--accent`** (emphasis, inline code). Category tints only to encode *which system part*, never decoration.
- Serif for everything readable; mono only for uppercase labels and code; italic Newsreader for emphasis.
- Generous whitespace, hairline rules, soft shadows — never heavy. Sentence case for UI.
- Animations are gentle and meaningful (entrances, the flow packet, stage lighting) — never gratuitous. Always honour reduced-motion.
- Tasteful inline line-icons (stroke style) matching the existing flow/journey components.
