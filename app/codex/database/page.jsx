import Link from "next/link";
import Callout from "@/components/Callout";
import Term from "@/components/Term";
import Aside from "@/components/Aside";

const COLS = ["id", "user_id", "store_id", "status", "total", "created_at"];
const ROW = ["ord_8f3…", "usr_22a…", "str_01…", "CONFIRMED", "358.00", "12:41:07"];

const REL = [
  { name: "User", sub: "who ordered", tint: "var(--blue-soft)", ink: "var(--blue)" },
  { name: "Store", sub: "which outlet", tint: "var(--teal-soft)", ink: "var(--teal)" },
];

export default function DatabasePage() {
  return (
    <main className="wrap-narrow" style={{ paddingTop: 44, paddingBottom: 40 }}>
      <Link href="/" style={{ fontSize: 13.5, color: "var(--muted)", display: "inline-flex", alignItems: "center", gap: 6, marginBottom: 22 }}>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M11 6l-6 6 6 6" /></svg>
        Back to the campus
      </Link>

      <span className="pill" style={{ background: "var(--amber-soft)", color: "var(--amber)", marginBottom: 14 }}>World 1 · The Codex · Part 05</span>
      <h1 style={{ fontSize: 42, lineHeight: 1.06 }}>The database — the memory.</h1>

      <div className="prose" style={{ marginTop: 22 }}>
        <p className="lead">
          The app forgets the moment you close it. The backend forgets the moment it restarts. The <strong>database</strong> is the one part that never forgets — every order, every payment, every customer lives here, safe through restarts, crashes, and deploys. Yours is <strong>PostgreSQL</strong>, and the file <code>apps/backend/prisma/schema.prisma</code> is its blueprint.
        </p>

        <h2>What a database actually is</h2>
        <p>
          Picture a set of very strict spreadsheets. Each <Term id="table"><strong>table</strong></Term> is one sheet; each <Term id="row"><strong>row</strong></Term> is one thing (one order, one user); each <Term id="column"><strong>column</strong></Term> is one fact about it (its total, its status). Here’s your real <code>Order</code> table — one order is one row:
        </p>

        <Aside q="If it's basically a spreadsheet, why not just use Excel or Google Sheets?">
          Three reasons a spreadsheet falls apart for this. <strong>It can’t enforce rules</strong> — nothing stops someone typing “banana” into the price cell, whereas a database refuses anything that isn’t a valid amount. <strong>It can’t handle many people at once</strong> — two waiters editing the same sheet at the same instant clobber each other; a database carefully serialises them. And <strong>it has no all-or-nothing safety</strong> — if the power cuts mid-edit you get a half-written mess, while a database undoes the whole thing cleanly. A database is a spreadsheet that’s strict, fast, multi-user, and crash-proof — exactly what money demands.
        </Aside>

        <div style={{ margin: "1.6rem 0", overflowX: "auto" }}>
          <table style={{ borderCollapse: "collapse", fontFamily: "JetBrains Mono", fontSize: 12.5, minWidth: 560 }}>
            <thead>
              <tr>
                {COLS.map((c) => (
                  <th key={c} style={{ textAlign: "left", padding: "8px 12px", background: "var(--bg-2)", border: "1px solid var(--hairline)", color: "var(--ink-2)", fontWeight: 600 }}>{c}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                {ROW.map((v, i) => (
                  <td key={i} style={{ padding: "8px 12px", border: "1px solid var(--hairline)", background: "var(--surface)", color: "var(--ink)" }}>{v}</td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>

        <h2>Tables don’t live alone — they’re related</h2>
        <p>
          An order isn’t a lonely island. It belongs to a <strong>user</strong> and a <strong>store</strong>, and it <em>has</em> a list of items. In your schema, <code>Order</code> holds a <code>user_id</code> and a <code>store_id</code> that point at rows in the <code>User</code> and <code>Store</code> tables — those pointers are called <Term id="foreign-key"><strong>foreign keys</strong></Term>. And one <code>Order</code> fans out into many <code>OrderItem</code> rows, each pointing at a <code>Product</code>:
        </p>

        <div style={{ margin: "1.6rem 0" }}>
          <div style={{ display: "flex", gap: 8, justifyContent: "center", marginBottom: 8 }}>
            {REL.map((r) => (
              <div key={r.name} style={{ background: r.tint, border: "1px solid var(--hairline)", borderRadius: 11, padding: "8px 14px", textAlign: "center" }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: r.ink }}>{r.name}</div>
                <div style={{ fontSize: 11, color: "var(--muted)" }}>{r.sub}</div>
              </div>
            ))}
          </div>
          <div style={{ textAlign: "center", color: "var(--faint)" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M6 13l6 6 6-6" /></svg>
          </div>
          <div style={{ background: "var(--brand-soft)", border: "1px solid #F3C9A8", borderRadius: 12, padding: "11px 16px", textAlign: "center", maxWidth: 230, margin: "0 auto" }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: "var(--brand-2)" }}>Order</div>
            <div style={{ fontSize: 11.5, color: "var(--muted)" }}>one row · holds the totals</div>
          </div>
          <div style={{ textAlign: "center", color: "var(--faint)" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M6 13l6 6 6-6" /></svg>
            <div style={{ fontSize: 11.5, color: "var(--faint)", marginTop: -2 }}>has many</div>
          </div>
          <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
            <div style={{ background: "var(--surface)", border: "1px solid var(--hairline)", borderRadius: 11, padding: "8px 14px", textAlign: "center" }}>
              <div style={{ fontSize: 13, fontWeight: 600 }}>OrderItem</div>
              <div style={{ fontSize: 11, color: "var(--faint)" }}>1× Classic Burger</div>
            </div>
            <div style={{ background: "var(--surface)", border: "1px solid var(--hairline)", borderRadius: 11, padding: "8px 14px", textAlign: "center" }}>
              <div style={{ fontSize: 13, fontWeight: 600 }}>OrderItem</div>
              <div style={{ fontSize: 11, color: "var(--faint)" }}>2× Fries → Product</div>
            </div>
          </div>
        </div>

        <p>
          This is why it’s called a <strong>relational</strong> database: the power isn’t in any one table, it’s in the <em>links</em> between them. And the links are enforced — an <code>OrderItem</code> literally cannot point at a <code>Product</code> that doesn’t exist. The database refuses. That guarantee is called <strong>referential integrity</strong>, and it’s a wall against a whole category of “impossible” data.
        </p>

        <h2>Two details that show this schema is serious</h2>
        <p>
          <strong>Money is a <code>Decimal</code>, never a decimal point in a float.</strong> Your <code>total</code> column is <code>Decimal(10, 2)</code> — exact to the paisa. The tempting shortcut is a regular floating-point number, but those can’t store <code>0.10</code> exactly (the same reason <code>0.1 + 0.2</code> famously isn’t <code>0.3</code> in code). Use a float for money and you slowly leak fractions of a rupee across millions of orders. The schema refuses that bug by design.
        </p>
        <p>
          <strong>The <code>idempotency_key</code> is marked <code>@unique</code>.</strong> If “Place order” fires twice — a flaky network retried the request — the second insert hits that unique wall and is rejected, instead of charging the customer and creating a duplicate order. One small word in the schema closes a real, expensive bug.
        </p>

        <h2>How the code talks to it: Prisma</h2>
        <p>
          The backend doesn’t hand-write raw database commands. It uses <strong>Prisma</strong> — a translator (an “ORM”) between your code’s objects and the database’s rows. You describe every table once in <code>schema.prisma</code>, and Prisma gives the backend clean, typed objects to work with, plus <strong>migrations</strong>: versioned, repeatable changes to the database’s shape, so the structure evolves safely instead of someone editing tables by hand in production.
        </p>

        <h2>The non-negotiable: transactions</h2>
        <p>
          Placing an order isn’t one write — it’s several: the <code>Order</code> row, its <code>OrderItem</code> rows, and the <code>OrderPayment</code>. These must happen <strong>all-or-nothing</strong>. A <strong>transaction</strong> wraps them so that if any step fails, every step is undone — the database snaps back as if nothing happened. There’s no universe where the payment is recorded but the order isn’t. That all-or-nothing guarantee is the heart of why money lives in a database like this.
        </p>

        <h2>Why it stays fast: indexes</h2>
        <p>
          Your <code>Order</code> table has <code>@@index([store_id, status])</code>. An <Term id="index">index</Term> is exactly like the index at the back of a book: instead of reading every page to find a topic, you jump straight to it. So “show me every <em>pending</em> order for <em>this store</em>” stays instant even when the table holds ten million orders — the database hops to the right rows instead of scanning them all.
        </p>

        <Callout variant="why" title="Why PostgreSQL, and not a simpler store?">
          A spreadsheet or a plain document store is faster to start with — no schema, no rules. But Burger Farm’s data is deeply <em>related</em> (orders↔users↔stores↔products) and involves <em>money</em>, which demands transactions and exact decimals. PostgreSQL gives you relationships, referential integrity, real transactions, and battle-tested decimal math — the exact guarantees money needs. The tradeoff is you must define your shape up front. For a serious ordering system, that discipline is a feature, not a cost.
        </Callout>

        <Callout variant="breaks" title="What breaks without transactions">
          Drop the transaction and run the writes one by one. The payment succeeds, then the server hiccups before the order is saved. Now the customer is charged for an order that doesn’t exist — no kitchen ticket, no record, just an angry call and a refund. Or the reverse: an order with no payment, food given away free. Transactions make these half-states impossible: either the whole order exists, paid and recorded, or none of it does.
        </Callout>

        <Callout variant="scale" title="From one database to a million orders">
          One Postgres server handles a surprising amount. As load grows, you add <strong>indexes</strong> for the queries that matter (you’ve already got them), then <strong>read replicas</strong> — copies that serve all the “show me…” reads so the main database is free for writes — and a <strong>connection pool</strong> so thousands of requests share a sane number of database connections. The schema barely changes; you’re adding capacity around a design that was already correct. Correct-first, fast-later is the right order — and this schema did it in that order.
        </Callout>
      </div>

      <div style={{ marginTop: 30, paddingTop: 22, borderTop: "1px solid var(--hairline)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
        <Link href="/codex/backend" className="muted" style={{ fontSize: 14 }}>← Part 04 — The backend</Link>
        <Link href="/codex/admin-panel" className="muted" style={{ fontSize: 14 }}>Part 06 — The admin panel →</Link>
      </div>
    </main>
  );
}
