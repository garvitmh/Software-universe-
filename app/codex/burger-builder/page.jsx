import Link from "next/link";
import Callout from "@/components/Callout";

const TOKENS = [
  { name: "spring", val: "cubic(0.16, 1, 0.3, 1)", use: "page transitions, hero scale, panels" },
  { name: "pulse", val: "cubic(0.215, 0.61, 0.355, 1)", use: "radar rings, splash pulse" },
  { name: "sweep", val: "cubic(0.4, 0, 0.2, 1)", use: "content cross-fades" },
  { name: "panelEnter", val: "spring · mass .88 · stiff 300 · damp 28", use: "auth panel enter" },
];

export default function BurgerBuilderPage() {
  return (
    <main className="wrap-narrow" style={{ paddingTop: 44, paddingBottom: 40 }}>
      <Link href="/" style={{ fontSize: 13.5, color: "var(--muted)", display: "inline-flex", alignItems: "center", gap: 6, marginBottom: 22 }}>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M11 6l-6 6 6 6" /></svg>
        Back to the campus
      </Link>

      <span className="pill" style={{ background: "var(--amber-soft)", color: "var(--amber)", marginBottom: 14 }}>World 1 · The Codex · Part 07</span>
      <h1 style={{ fontSize: 42, lineHeight: 1.06 }}>The burger builder & motion engine.</h1>

      <div className="prose" style={{ marginTop: 22 }}>
        <p className="lead">
          The burger builder is the showpiece — pick a bun, add cheese burst, drop the onions, and the burger <em>rebuilds itself</em> in front of you, every layer sliding into place. It looks like magic. It’s actually three serious engineering ideas working together, and once you see them you’ll spot them everywhere.
        </p>

        <h2>Idea 1 — the state is one immutable object</h2>
        <p>
          Everything you’ve chosen lives in one little object, <code>BurgerCustomization</code> (<code>apps/mobile-app/lib/features/menu/presentation/builder/burger_customization.dart</code>): the removals, the bun type, the cheese type, the add-ons. It’s marked <strong>immutable</strong> — meaning it’s never edited in place. When you tap “wheat bun,” the app doesn’t change the old object; it makes a fresh copy with one field different, via <code>copyWith</code>:
        </p>

        <div style={{ margin: "1.4rem 0", background: "var(--bg-2)", border: "1px solid var(--hairline)", borderRadius: 14, padding: "14px 18px", fontFamily: "JetBrains Mono", fontSize: 13, color: "var(--ink-2)", lineHeight: 1.85 }}>
          <span style={{ color: "var(--faint)" }}>// tap “wheat” → a NEW state, old one untouched</span><br />
          state = state.copyWith(bunType: <span style={{ color: "var(--brand-2)" }}>BunType.wheat</span>);
        </div>

        <p>
          Why never edit in place? Because immutable state is <strong>predictable</strong>. Every change produces a brand-new value, so nothing can be altered behind another widget’s back — the drift bug from Part 02 is impossible by construction. And because each tap is a clean new state, “undo” is trivial: just keep the previous object. This is the same single-source-of-truth idea you already met, made even stricter.
        </p>

        <h2>Idea 2 — the picture is derived, never stored</h2>
        <p>
          Here’s the clever bit. The app does <em>not</em> store “where each burger layer sits.” It <strong>computes</strong> the whole visual stack from the customization, every frame, in <code>burger_stack.dart</code> — a faithful port of the web reference’s <code>compute-burger-stack.ts</code>. Given your choices, it works out which layers exist, how tall each one rises, how wide it is, and auto-scales the stack to fit. So the flow is one-directional:
        </p>

        <div style={{ margin: "1.6rem 0", display: "flex", alignItems: "center", justifyContent: "center", gap: 6, flexWrap: "wrap" }}>
          <div style={{ background: "var(--purple-soft)", border: "1px solid var(--hairline)", borderRadius: 11, padding: "10px 14px", textAlign: "center" }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: "var(--purple)" }}>Your choices</div>
            <div style={{ fontSize: 11, color: "var(--muted)" }}>BurgerCustomization</div>
          </div>
          <svg width="20" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--faint)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
          <div style={{ background: "var(--amber-soft)", border: "1px solid var(--hairline)", borderRadius: 11, padding: "10px 14px", textAlign: "center" }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: "var(--amber)" }}>Geometry</div>
            <div style={{ fontSize: 11, color: "var(--muted)" }}>compute the stack</div>
          </div>
          <svg width="20" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--faint)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
          <div style={{ background: "var(--brand-soft)", border: "1px solid #F3C9A8", borderRadius: 11, padding: "10px 14px", textAlign: "center" }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: "var(--brand-2)" }}>Pixels</div>
            <div style={{ fontSize: 11, color: "var(--muted)" }}>the hero redraws</div>
          </div>
        </div>

        <p>
          You change the <em>state</em>; the <em>picture</em> recomputes itself. Nobody ever hand-moves a layer. That’s the same “derive, don’t duplicate” principle that powered the menu’s visible-products list — here it’s drawing a burger instead of filtering a list, but it’s the identical shape of thinking.
        </p>

        <h2>Idea 3 — motion is a design system, not scattered numbers</h2>
        <p>
          The thing that makes it feel <em>expensive</em> is the motion — and the motion isn’t sprinkled randomly through the code. Every curve and every spring lives in one file, <code>apps/mobile-app/lib/core/theme/app_motion.dart</code>, as named tokens. The rule is strict enough that the file itself says writing a raw <code>Cubic(...)</code> in feature code is a <strong>forbidden pattern</strong>:
        </p>

        <div style={{ margin: "1.6rem 0", overflowX: "auto" }}>
          <table style={{ borderCollapse: "collapse", fontSize: 12.5, minWidth: 560, width: "100%" }}>
            <thead>
              <tr>
                {["token", "value", "where it’s used"].map((h) => (
                  <th key={h} style={{ textAlign: "left", padding: "8px 12px", background: "var(--bg-2)", border: "1px solid var(--hairline)", color: "var(--ink-2)", fontWeight: 600 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {TOKENS.map((t) => (
                <tr key={t.name}>
                  <td style={{ padding: "8px 12px", border: "1px solid var(--hairline)", background: "var(--surface)", fontFamily: "JetBrains Mono", fontWeight: 600, color: "var(--brand-2)" }}>{t.name}</td>
                  <td style={{ padding: "8px 12px", border: "1px solid var(--hairline)", background: "var(--surface)", fontFamily: "JetBrains Mono", color: "var(--ink-2)", fontSize: 11.5 }}>{t.val}</td>
                  <td style={{ padding: "8px 12px", border: "1px solid var(--hairline)", background: "var(--surface)", color: "var(--muted)" }}>{t.use}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p>
          Notice the last row isn’t a curve — it’s a <strong>spring</strong>, described by physics: a mass on a spring with a stiffness and a damping. A plain curve is a fixed path from A to B; a spring actually <em>simulates</em> motion, so it can overshoot a touch and settle, the way real objects do. That’s why a well-tuned spring feels alive and a generic ease feels mechanical. And because every spring is defined once, the whole app shares one consistent “personality” of movement.
        </p>

        <h2>And the prices stay dynamic</h2>
        <p>
          One last thread back to the control room: the add-ons you can pick (<code>AddonOption</code>) are sourced from the backend’s <strong>modifier groups</strong>, not hardcoded — so their prices are set in the admin panel and flow straight into the builder. The fanciest screen in the app still obeys the same rule as the rest: the truth lives on the backend.
        </p>

        <Callout variant="why" title="Why centralise motion into tokens at all?">
          The easy way is to type a curve or duration wherever you need one. It works — until you have three hundred of them, all slightly different, and the app feels subtly inconsistent. By naming a small set of curves and springs and <em>banning</em> raw ones, two things happen: every animation shares the same feel, and you can re-tune the entire app’s motion by editing one file. The tradeoff is discipline — you can’t just drop in a one-off number — and that discipline is exactly the point. It’s the same reason designers use a colour palette instead of picking random hex codes.
        </Callout>

        <Callout variant="breaks" title="What breaks without immutable state">
          Imagine the customization were mutable — edited in place. One widget tweaks the cheese while another is mid-read; the on-screen burger and the price quietly disagree; and “undo” becomes a nightmare because the old state was overwritten the moment you changed it. Immutability makes each tap a clean, separate snapshot — so the view, the price, and the history can never fall out of step, and undo is just “show the previous snapshot.”
        </Callout>

        <Callout variant="scale" title="Where a motion engine goes next">
          Once motion is data in one place, it stops being decoration and becomes a <em>lever</em>. You can ship seasonal “feels,” dial animations down on low-end phones for performance, or even A/B test two personalities of movement to see which converts better — all without touching feature code. The giants treat motion exactly this way: Apple, Stripe, and Material Design each publish a tight motion system precisely so a thousand engineers move things the same way. Your app is built on the same idea, at its own scale.
        </Callout>
      </div>

      <div style={{ marginTop: 30, paddingTop: 22, borderTop: "1px solid var(--hairline)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
        <Link href="/codex/admin-panel" className="muted" style={{ fontSize: 14 }}>← Part 06 — The admin panel</Link>
        <span style={{ fontSize: 14, color: "var(--faint)" }}>Next — Big systems: loyalty, payments, delivery, POS · coming soon</span>
      </div>
    </main>
  );
}
