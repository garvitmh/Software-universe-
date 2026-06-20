import Link from "next/link";
import Callout from "@/components/Callout";

const PIPE = [
  { name: "Push", sub: "you commit code", tint: "var(--blue-soft)", ink: "var(--blue)" },
  { name: "Test", sub: "CI runs loyalty + e2e", tint: "var(--purple-soft)", ink: "var(--purple)" },
  { name: "Build", sub: "prisma generate && tsc", tint: "var(--amber-soft)", ink: "var(--amber)" },
  { name: "Release", sub: "migrate db · start", tint: "var(--brand-soft)", ink: "var(--brand-2)" },
  { name: "Live", sub: "real customers", tint: "var(--teal-soft)", ink: "var(--teal)" },
];

export default function DeploymentPage() {
  return (
    <main className="wrap-narrow" style={{ paddingTop: 44, paddingBottom: 40 }}>
      <Link href="/" style={{ fontSize: 13.5, color: "var(--muted)", display: "inline-flex", alignItems: "center", gap: 6, marginBottom: 22 }}>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M11 6l-6 6 6 6" /></svg>
        Back to the campus
      </Link>

      <span className="pill" style={{ background: "var(--amber-soft)", color: "var(--amber)", marginBottom: 14 }}>World 1 · The Codex · Part 10</span>
      <h1 style={{ fontSize: 42, lineHeight: 1.06 }}>Deployment & ops — going live.</h1>

      <div className="prose" style={{ marginTop: 22 }}>
        <p className="lead">
          “It works on my machine” is where software begins, not where it ends. The last leap is getting it running on a computer in a data centre, reliably, for strangers, forever — and being able to change it without taking it down. This is <strong>deployment and operations</strong>, and your repo already does it for real, to a host called <strong>Render</strong>.
        </p>

        <h2>The release pipeline</h2>
        <p>
          Going live isn’t one button — it’s a short assembly line that runs every time you push. Each stage refuses to pass broken work to the next:
        </p>

        <div style={{ margin: "1.6rem 0", overflowX: "auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 4, minWidth: 640 }}>
            {PIPE.map((s, i) => (
              <div key={s.name} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <div style={{ background: s.tint, border: "1px solid var(--hairline)", borderRadius: 12, padding: "11px 10px", textAlign: "center", width: 116 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: s.ink }}>{s.name}</div>
                  <div style={{ fontSize: 11, color: "var(--muted)" }}>{s.sub}</div>
                </div>
                {i < PIPE.length - 1 && (
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--faint)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
                )}
              </div>
            ))}
          </div>
        </div>

        <h2>Config lives in the environment, never in the code</h2>
        <p>
          The backend needs secrets and settings: the database address (<code>DATABASE_URL</code>), the token-signing key (<code>JWT_SECRET</code>), the port, the frontend URL. None of these are written in the code — they’re read from <strong>environment variables</strong>, supplied separately wherever the app runs. Your repo ships an <code>.env.example</code> that lists the <em>names</em> with blank values, so the shape is documented, while the real values stay out of the codebase entirely. This is the golden rule of ops: <strong>never commit a secret.</strong> The same code runs in development and production; only the environment around it differs.
        </p>

        <h2>Build vs run — source becomes an artifact</h2>
        <p>
          You write TypeScript, but the server doesn’t run your source. The <strong>build</strong> step (<code>prisma generate &amp;&amp; tsc</code>) compiles it into plain JavaScript in a <code>dist/</code> folder; the <strong>start</strong> step runs that compiled artifact (<code>node dist/app.js</code>). Separating “prepare the package” from “run the package” means the live server does the minimum at boot, and the thing you tested is the exact thing that runs.
        </p>

        <h2>Infrastructure as code</h2>
        <p>
          How does Render know to build a Node service, attach a Postgres database, and set it all up? It reads <code>render.yaml</code> — a file in your repo that <em>describes the infrastructure itself</em>. Your servers and database are defined in version control, like everything else, so a deploy is reproducible and reviewable instead of a person clicking around a dashboard from memory. That idea — <strong>infrastructure as code</strong> — is what makes “push to deploy” trustworthy.
        </p>

        <h2>Code and schema travel together</h2>
        <p>
          A release usually changes the database shape too — a new column, a new table. So part of going live is bringing the production database up to date (your deploy runs a Prisma schema push) <em>before</em> the new code serves traffic. Code and schema must move as one: ship code that expects a column the database doesn’t have yet, and it crashes on the first request. This is why migrations are part of the pipeline, not an afterthought.
        </p>

        <h2>After launch: the “ops” half</h2>
        <p>
          Shipping is day one; <strong>operating</strong> is every day after. That means <strong>health checks</strong> (the host pings the app; if it stops answering, it’s restarted), <strong>rollbacks</strong> (a bad release? redeploy the last good one in seconds), and ideally <strong>zero-downtime deploys</strong> (start the new version, shift traffic over, then retire the old one — customers never notice). And it leans on the observability from Part 9 to know something’s wrong before your customers tell you.
        </p>

        <Callout variant="why" title="Why containers and Kubernetes exist (the ‘lot’)">
          “Works on my machine” fails because your laptop isn’t the server — different versions, different settings. A <strong>container</strong> (Docker) fixes this by packing the app <em>and</em> its entire environment into one sealed box that runs identically everywhere. <strong>Kubernetes</strong> is the manager for many such boxes: it runs them, restarts crashed ones, and adds or removes copies as load changes — the automated version of Part 9’s horizontal scaling. Hosts like Render and Vercel hide this machinery so you don’t need it yet; the giants run it themselves because at their size they must. Knowing it exists tells you where the road leads.
        </Callout>

        <Callout variant="breaks" title="What breaks: a leaked secret, or a skipped migration">
          Commit your <code>DATABASE_URL</code> or <code>JWT_SECRET</code> to the repo and you’ve handed anyone who sees it the keys to your database and the power to forge logins — secret leaks are among the most common and most damaging real-world breaches. The quieter disaster: deploy new code without running its migration, so the code asks for a column that isn’t there and every request 500s. Both are prevented by the same discipline — secrets in the environment, schema changes in the pipeline, tests gating the release.
        </Callout>

        <Callout variant="scale" title="From push-to-deploy to a real CI/CD pipeline">
          Your tests (loyalty, end-to-end orders) are the seed of <strong>CI/CD</strong> — continuous integration and delivery. Maturing it means: run the full test suite automatically on every pull request, block merges that fail, then deploy automatically once merged. Bigger teams add <strong>canary</strong> releases (send 1% of traffic to the new version, watch the metrics, then roll out to everyone) and <strong>blue-green</strong> deploys (two identical environments, flip between them) so a bad release affects almost no one. It all grows from exactly what you already have: tests, a build, and a described environment.
        </Callout>

        <div style={{ marginTop: 30, padding: "20px 22px", background: "var(--brand-soft)", border: "1px solid #F3C9A8", borderRadius: 16 }}>
          <div style={{ fontFamily: "Fraunces", fontSize: 21, fontWeight: 600, color: "var(--brand-2)" }}>That’s the whole Codex.</div>
          <p style={{ fontSize: 15, color: "var(--ink-2)", marginTop: 8, lineHeight: 1.6 }}>
            You’ve walked the entire system — from a single tap, down through the app’s layers, the backend, the database, the control room, the motion engine, the big money-and-order systems, scale, and now shipping it to the world. Every piece grounded in your real code. The best next move isn’t to read more — it’s to <em>watch it move</em> and break it on purpose.
          </p>
          <div style={{ marginTop: 16 }}>
            <Link href="/simulator/order-journey" className="btn btn-primary">
              Cross into the Simulator
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
            </Link>
          </div>
        </div>
      </div>

      <div style={{ marginTop: 30, paddingTop: 22, borderTop: "1px solid var(--hairline)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
        <Link href="/codex/scale" className="muted" style={{ fontSize: 14 }}>← Part 09 — Scale</Link>
        <Link href="/" className="muted" style={{ fontSize: 14 }}>Back to the campus →</Link>
      </div>
    </main>
  );
}
