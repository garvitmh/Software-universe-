import Link from "next/link";
import Callout from "@/components/Callout";

const FLOW = [
  { name: "Request", sub: "from the app", tint: "var(--blue-soft)", ink: "var(--blue)" },
  { name: "Middleware", sub: "auth · CSRF · tracing", tint: "var(--pink-soft)", ink: "var(--pink)" },
  { name: "Route", sub: "which URL → which handler", tint: "var(--amber-soft)", ink: "var(--amber)" },
  { name: "Service", sub: "the actual logic", tint: "var(--brand-soft)", ink: "var(--brand-2)" },
  { name: "Database", sub: "the truth", tint: "var(--teal-soft)", ink: "var(--teal)" },
];

export default function BackendPage() {
  return (
    <main className="wrap-narrow" style={{ paddingTop: 44, paddingBottom: 40 }}>
      <Link href="/" style={{ fontSize: 13.5, color: "var(--muted)", display: "inline-flex", alignItems: "center", gap: 6, marginBottom: 22 }}>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M11 6l-6 6 6 6" /></svg>
        Back to the campus
      </Link>

      <span className="pill" style={{ background: "var(--amber-soft)", color: "var(--amber)", marginBottom: 14 }}>World 1 · The Codex · Part 04</span>
      <h1 style={{ fontSize: 42, lineHeight: 1.06 }}>The backend — the brain.</h1>

      <div className="prose" style={{ marginTop: 22 }}>
        <p className="lead">
          We’ve toured the customer’s side. Now cross over to the brain — the part that does the real work and enforces every rule. This is <code>apps/backend</code>, built with Node and Express. Nothing the app <em>claims</em> is trusted until the backend says so.
        </p>

        <h2>What the backend actually is</h2>
        <p>
          It’s a program that sits on a server, <strong>listens for requests, and answers them</strong>. When your app says “here’s an order,” the backend is what checks the store is open, the price is right, and the payment is real — then writes it down. The golden rule: <strong>never trust the client.</strong> The phone can be tampered with; the backend is the referee that can’t be.
        </p>

        <h2>A request’s path through the brain</h2>
        <p>
          A request doesn’t go straight to the database. It passes through a short assembly line, and each stage has one job:
        </p>

        <div style={{ margin: "1.6rem 0", overflowX: "auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 4, minWidth: 620 }}>
            {FLOW.map((s, i) => (
              <div key={s.name} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <div style={{ background: s.tint, border: "1px solid var(--hairline)", borderRadius: 12, padding: "11px 10px", textAlign: "center", width: 118 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: s.ink }}>{s.name}</div>
                  <div style={{ fontSize: 11, color: "var(--muted)" }}>{s.sub}</div>
                </div>
                {i < FLOW.length - 1 && (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--faint)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
                )}
              </div>
            ))}
          </div>
        </div>

        <p>
          In your code: <code>apps/backend/src/app.ts</code> wires it up, the route files (<code>src/routes/menu.routes.ts</code>, <code>admin-*.routes.ts</code>) decide which URL maps to which handler, and the service files (<code>src/services/menu.service.ts</code>) hold the actual logic. The guards in between live in <code>src/middleware</code>.
        </p>

        <h2>Routes vs services — the front desk and the workers</h2>
        <p>
          A <strong>route</strong> is the front desk: “a <code>GET</code> to <code>/api/v1/menu</code> goes to this handler.” It should stay thin. The real work — fetching the catalogue, applying store availability, converting prices to paise — lives in a <strong>service</strong>. Keeping them apart means the logic is testable on its own, and you can change <em>how</em> a request arrives without rewriting <em>what</em> it does.
        </p>

        <h2>Middleware — the guards at the door</h2>
        <p>
          <strong>Middleware</strong> is code that runs <em>before</em> the handler, on every matching request. Your backend has two important guards: <code>requireAdmin</code> (is this person actually a logged-in admin?) and <code>requireCsrf</code> (is this state-changing request genuine, not forged?). A request that fails a guard never reaches the handler at all.
        </p>

        <h2>Auth done right</h2>
        <p>
          When an admin logs in, the backend sets an <strong>httpOnly cookie</strong> holding a signed token (a <strong>JWT</strong> — basically a tamper-proof “this is who I am” badge). “httpOnly” means JavaScript on the page <em>cannot read it</em> — so even if an attacker sneaks a script onto the page, they can’t steal the login. That was a deliberate choice over the popular habit of stashing the token in the browser’s <code>localStorage</code>, which JavaScript <em>can</em> read (and therefore steal). The tradeoff cookies bring is a different attack — request forgery — which the <code>requireCsrf</code> guard closes.
        </p>

        <Callout variant="why" title="Why a cookie, not a token in localStorage?">
          The common shortcut is to keep the login token in <code>localStorage</code> and attach it by hand to each request. It’s easy — but any script that ever runs on your page (an injected ad, a compromised library) can read <code>localStorage</code> and walk off with the login. The httpOnly cookie can’t be read by script at all, so that whole class of theft disappears. The price is that cookies are sent automatically, which opens the door to <em>forgery</em> (see below) — so we pay for the cookie’s safety with a CSRF check. Every real choice in security is a trade like this.
        </Callout>

        <Callout variant="breaks" title="What breaks without the CSRF guard">
          Because the login cookie is sent automatically on every request to your backend, a malicious website could quietly submit a form to your admin API while you’re logged in — and the browser would attach your cookie, making it look genuine. That’s a forged request (CSRF). The fix your backend uses is a “double-submit” token: a separate value the real admin page reads and echoes in a header, which a foreign site can’t obtain. No matching token, request rejected. Skip this and a single booby-trapped link could change prices or delete data under your own login.
        </Callout>

        <Callout variant="scale" title="Why the backend is built to be stateless">
          Notice the backend doesn’t keep your session in its own memory — your identity rides in the signed cookie. That’s deliberate: it means you can run <em>many identical copies</em> of the backend behind a load balancer, and it doesn’t matter which copy answers your request, because none of them is “the one that remembers you.” Statelessness is the quiet design choice that lets a backend scale from one server to a hundred.
        </Callout>
      </div>

      <div style={{ marginTop: 30, paddingTop: 22, borderTop: "1px solid var(--hairline)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
        <Link href="/codex/flutter-app" className="muted" style={{ fontSize: 14 }}>← Part 03 — Flutter app</Link>
        <span style={{ fontSize: 14, color: "var(--faint)" }}>Next — The database, the memory · coming soon</span>
      </div>
    </main>
  );
}
