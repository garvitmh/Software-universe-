# Stitch Integration Context & Prompts

Use this document to feed the exact architectural context of **Software Universe** into Google Labs' **Stitch** design canvas (`stitch.withgoogle.com`). 

By copy-pasting the design tokens and prompts below, you can generate high-end, production-ready React components that align perfectly with the "Warm Farm" visual aesthetic.

---

## 🎨 1. Stitch `DESIGN.md` (Design System Rules)
*Copy this section and drop it directly into the Stitch Design System canvas or as a markdown reference file.*

```markdown
# Software Universe Design System (Warm Farm Style)

## Palette Mappings
- Backdrop (Deep Slate): `#0B0F19`
- Card Surface: `#121B2B` with border `1px solid rgba(255, 255, 255, 0.05)`
- Accent Primary (Teal): `#0EA5E9` (glowing)
- Accent Secondary (Amber/Orange): `#F59E0B`
- Text Ink: `#F8FAFC` (pure cream-white)
- Text Muted: `#94A3B8` (slate gray)

## Visual Elements
- Dot Grid meshes behind hero panels.
- Fine glassmorphic cards with subtle top border reflections.
- Lucide-style outline icons only (zero emojis allowed).
- Layout: Asymmetrical Bento Grid containing stats, code trees, and 3D viewports.
```

---

## 💬 2. Stitch Generation Prompts

### Prompt A: The Bento Grid Dashboard
*Copy and paste this into Stitch to generate the landing page dashboard.*

> **Prompt**: Create a premium dark-mode developer dashboard layout for "Software Universe" using the Warm Farm design system. The background should feature a subtle radial dot-grid mesh. Arrange the interface in an asymmetrical Bento Grid:
> - **Card 1 (Telemetry)**: Shows a request volume slider, a live traffic latency chart with neon lines, and status indicators.
> - **Card 2 (3D Canvas)**: A viewport for rendering a floating 3D cybernetic model on a dark grid backdrop.
> - **Card 3 (Codex Library)**: Lists textbooks (Google SRE Book, Stripe Idempotency, Discord ScyllaDB) with outline vector icons.
> - **Card 4 (Roadmap progress)**: Radial skill tree connections.
> Use Inter font, glassmorphic cards, and clean borders.

### Prompt B: The Socratic Split-Pane Reader
*Copy and paste this into Stitch to generate the library reading page.*

> **Prompt**: Create a split-screen web application interface for reading engineering textbooks.
> - **Left Pane (Textbook Reader)**: Clean editorial typography. Text includes dotted-underlined terms. Highlighted text shows a floating bubble badge with "✨ Ask Professor" in a rounded button.
> - **Right Pane (Socratic Assistant)**: A sidebar with tabs (WHAT, WHY, HOW, WHEN IT BREAKS, Socratic Q&A). The Q&A tab is an interactive chat panel with user speech bubbles and detailed markdown answers.
> Style with deep slate backdrops, thin borders, and clean outline icons.

---

## 📂 3. Code Reference Snippets
*If Stitch asks for code structure context, copy these files to help it understand our JSX components:*

- Main Layout: [SplitPaneViewer.jsx](file:///c:/Desktop/Software%20Universe/components/SplitPaneViewer.jsx)
- Glossary Tooltip: [Term.jsx](file:///c:/Desktop/Software%20Universe/components/Term.jsx)
- Global Search: [InlineRAGDrawer.jsx](file:///c:/Desktop/Software%20Universe/components/InlineRAGDrawer.jsx)
