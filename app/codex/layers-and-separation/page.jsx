import Link from "next/link";
import Callout from "@/components/Callout";

const LAYERS = [
  { name: "UI — the screen", sub: "shows things, captures taps", tint: "var(--blue-soft)", ink: "var(--blue)" },
  { name: "State — the provider", sub: "the single current truth on screen", tint: "var(--purple-soft)", ink: "var(--purple)" },
  { name: "Repository", sub: "“give me the menu” — hides where it comes from", tint: "var(--amber-soft)", ink: "var(--amber)" },
  { name: "Data source", sub: "the network client that calls the backend", tint: "var(--brand-soft)", ink: "var(--brand-2)" },
  { name: "Database", sub: "the permanent memory", tint: "var(--teal-soft)", ink: "var(--teal)" },
];

export default function LayersPage() {
  return (
    <main className="wrap-narrow" style={{ paddingTop: 44, paddingBottom: 40 }}>
      <Link href="/" style={{ fontSize: 13.5, color: "var(--muted)", display: "inline-flex", alignItems: "center", gap: 6, marginBottom: 22 }}>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M11 6l-6 6 6 6" /></svg>
        Back to the campus
      </Link>

      <span className="pill" style={{ background: "var(--amber-soft)", color: "var(--amber)", marginBottom: 14 }}>World 1 · The Codex · Part 02</span>
      <h1 style={{ fontSize: 42, lineHeight: 1.06 }}>Layers & separation of concerns.</h1>

      <div className="prose" style={{ marginTop: 22 }}>
        <p className="lead">
          You’ve met the four big characters. Now zoom into one — the app — and you’ll find it isn’t one lump of code either. It’s built in <strong>layers</strong>, each with exactly one job. This is the single most important idea in all of software, so we’ll take it slowly.
        </p>

        <h2>The stack: each layer talks only to its neighbour</h2>
        <p>
          When the menu screen needs the list of burgers, the request doesn’t leap straight from the screen to the database. It passes down a stack, one handoff at a time — and each layer knows nothing about the layers two steps away. Top to bottom:
        </p>

        <div style={{ margin: "1.6rem 0" }}>
          {LAYERS.map((l, i) => (
            <div key={l.name}>
              <div style={{ display: "flex", alignItems: "center", gap: 14, background: l.tint, border: "1px solid var(--hairline)", borderRadius: 14, padding: "13px 16px" }}>
                <span style={{ fontFamily: "JetBrains Mono", fontSize: 12, fontWeight: 600, color: l.ink, width: 18 }}>{i + 1}</span>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 600, color: "var(--ink)" }}>{l.name}</div>
                  <div style={{ fontSize: 13, color: "var(--muted)" }}>{l.sub}</div>
                </div>
              </div>
              {i < LAYERS.length - 1 && (
                <div style={{ textAlign: "center", color: "var(--faint)", padding: "3px 0" }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M6 13l6 6 6-6" /></svg>
                </div>
              )}
            </div>
          ))}
        </div>

        <h2>Follow it in your real code</h2>
        <p>
          This isn’t a textbook diagram — it’s literally how your menu loads. The screen <strong>watches</strong> a provider called <code>menuVisibleProductsProvider</code>, which is fed by <code>menuCatalogProvider</code> (<code>apps/mobile-app/lib/features/menu/presentation/providers/menu_provider.dart</code>). That provider doesn’t know any URLs — it just asks a <strong>repository</strong>:
        </p>
        <p>
          <code>apps/mobile-app/lib/features/menu/data/menu_repository.dart</code> is the only place in the entire app that knows the menu lives at <code>GET /api/v1/menu</code>. It fetches, turns the raw response into clean <code>MenuProduct</code> objects, and hands them up. <strong>The screen never builds a URL, and never touches the database.</strong> It just asks for “the menu” and trusts what comes back.
        </p>

        <h2>Two patterns are hiding in there</h2>
        <p>
          <strong>The Repository pattern.</strong> The screen says “give me the menu,” not “make an HTTP GET to this address and parse this JSON.” The <em>how</em> is sealed inside the repository. That one wall is what lets you change the <em>how</em> without touching the screen.
        </p>
        <p>
          <strong>Dependency injection.</strong> Notice the repository doesn’t <em>create</em> its own network client — it’s <strong>handed</strong> one: <code>MenuRepository(ref.watch(apiClientProvider))</code>. “Don’t reach for your tools — have them handed to you.” That tiny inversion is what makes the repository swappable and testable: you can hand it a fake client in a test and it never knows the difference.
        </p>
        <p>
          And the umbrella idea over all of this — keeping the screen’s job (showing) apart from the data’s job (fetching) apart from the truth (the database) — has a name you’ll meet everywhere: <strong>Separation of Concerns</strong>. You just understood it from the inside, before the jargon.
        </p>

        <Callout variant="why" title="Why bother with all these layers?">
          The alternative is to let each screen fetch its own data and hold its own logic — fewer files, faster to write the <em>first</em> screen. The cost shows up later: the same logic gets copy-pasted across screens, a fix in one place misses the other five, and the UI and the data rules become impossible to change independently. Layers cost you a few more small files up front and buy you a codebase that stays changeable. That trade — a little structure now for a lot of freedom later — is the core bet of good architecture.
        </Callout>

        <Callout variant="breaks" title="What breaks without the wall">
          Say the company outgrows its current setup and wants to move the menu to a different backend. With the repository, you change <strong>one file</strong> — every screen keeps working, because none of them ever knew where the menu came from. Without it, the address and parsing live in dozens of screens, and you’re editing all of them by hand, praying you didn’t miss one. Same story for a UI redesign: because pricing logic lives in a different layer from the buttons, you can restyle the whole app without any risk of accidentally changing what a burger costs.
        </Callout>

        <Callout variant="scale" title="Why this matters more as you grow">
          At 6 screens, a tangled app is annoying. At 60 screens and three developers, it’s unworkable — nobody can change anything without breaking something far away. Layers are what let a codebase keep growing without collapsing into spaghetti; it’s why every serious team (and every framework you’ll meet) is organised this way.
        </Callout>
      </div>

      <div style={{ marginTop: 30, paddingTop: 22, borderTop: "1px solid var(--hairline)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
        <Link href="/codex/foundations" className="muted" style={{ fontSize: 14 }}>← Part 01 — Foundations</Link>
        <span style={{ fontSize: 14, color: "var(--faint)" }}>Next — State: the single source of truth · coming soon</span>
      </div>
    </main>
  );
}
