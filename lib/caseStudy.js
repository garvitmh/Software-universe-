// THE BURGER FARM CASE STUDY — a real, enterprise-grade, fully admin-driven food
// -ordering platform (Flutter mobile + Express/Prisma/Postgres backend + Next/
// Refine admin), explained in extreme detail: every architectural decision (what
// / why / the alternatives we rejected / how), the full data flow, and an
// exhaustive "what if X happens — what do we do?" failure playbook.
//
// Grounded in the project's own verified planning set (the security doc was
// rewritten after an automated pass confabulated, so every claim here traces to
// a real file). Rendered by app/case-study/[slug]/page.jsx.
//
// Block types a section.body may contain:
//   "string"                      → paragraph (supports **bold** and `code`)
//   { list: [...] }               → bulleted list
//   { steps: [...] }              → numbered list
//   { note: "...", tone }         → callout (tone: "info" | "warn" | "good")
//   { fig: "...", caption }       → labelled diagram-ish block (mono)
// A chapter may also carry decisions[] {id,title,what,why,alternatives,how}
// and edgeCases[] {q,risk,answer}.

export const CASE_STUDY = {
  meta: {
    title: "Burger Farm",
    kicker: "A real system, taken apart",
    dek: "A Zomato/Swiggy-class, fully admin-driven, multi-store food-ordering platform — three apps, one source of truth for money, serviceability and content. This is the whole thing explained: every decision, every data flow, and every \"what if it breaks?\" answered.",
    stats: [
      { n: "3", l: "apps — mobile, backend, admin" },
      { n: "36", l: "data models (DB ~70% built)" },
      { n: "11", l: "locked decisions (D1–D11)" },
      { n: "12", l: "build slices to launch" },
    ],
    intro: [
      "Burger Farm is one product made of **three programs that talk to each other**: a phone app customers order from (built in **Flutter**), a control panel staff run the business from (built in **Next.js + Refine**), and a **backend** in the middle (built in **Express + Prisma + Postgres**) that both of them call. The backend is the boss: it is the single place that decides money, who can be delivered to, and what content the app shows.",
      "The whole thesis of the product is this: **an operator changes a setting, and the live app changes within seconds — with no app-store release — and the layout never moves.** A new offer, a price change, a store going off-hours, a seasonal theme: all of it flows from the backend into fixed, pre-built slots in the app. That one idea drives almost every decision below.",
      "This case study is written to be read top to bottom by someone who is still learning, and to survive scrutiny from someone who is not. Where we made a choice, you'll find **what** we chose, **why**, the **alternatives we turned down**, and **how** it actually works. And because real systems are judged by how they fail, there is a whole chapter of **\"what if this happens?\"** with the concrete answer for each.",
    ],
  },

  chapters: [
    // ───────────────────────────────────────────────────────────── 1
    {
      slug: "overview",
      num: 1,
      eyebrow: "The shape of it",
      title: "What Burger Farm actually is",
      dek: "Three apps, one authority, and one big idea — change data, not code.",
      sections: [
        {
          heading: "Three apps, one brain",
          body: [
            "Picture a restaurant. The **customer** sits at a table with a menu (the Flutter phone app). The **kitchen and manager** work behind the scenes (the admin panel). And there's a **head office** that decides the prices, the menu, and which areas get delivery (the backend). The customer never walks into head office — they ask the waiter, who asks head office. That waiter-in-the-middle is the backend API.",
            { list: [
              "**Mobile app (Flutter)** — what the customer touches. It browses the menu, builds a cart, places orders, and tracks them. Crucially, its screens are *fixed in code* — it only ever pours fresh data into slots that already exist.",
              "**Admin panel (Next.js + Refine)** — what staff touch. Two jobs: **control** (create offers, change prices, set store hours, toggle a sold-out item) and **observe** (watch live orders and revenue).",
              "**Backend API (Express + Prisma + Postgres)** — the only thing both apps trust. It is the **single source of authority** for three things that must never be faked by a client: how much money is owed, whether we deliver to an address, and what content is live right now.",
            ]},
            "Postgres (hosted on **Neon**) is the permanent memory — the *system of record*. **Redis** (a fast in-memory helper) handles realtime messaging, shared caching and rate-limiting once there's more than one server. Images live on **cloud storage behind a CDN**. Customer identity comes from **Firebase**; everything else is ours.",
          ],
        },
        {
          heading: "The one-line picture: what's built vs what's planned",
          body: [
            "An honest status, because pretending everything is done is how teams lie to themselves: **the database is roughly 70% built; the API is roughly 30% built.** Most of the launch work is *exposing and finishing* models that already exist — not greenfield invention.",
            { fig: "36 data models exist  ·  8 backend route files wired  ·  ~90 endpoints still to build", caption: "Menu, cart, order, payment, loyalty and content are 'tables without an API' — the shape is designed, the doors aren't open yet." },
            "The backend that *does* exist is already well-hardened — security headers, tiered rate-limiting, CSRF protection, fail-closed auth, no raw SQL. So the road to launch is not a frantic rewrite; it's a disciplined sequence of vertical slices, each one shippable on its own.",
          ],
        },
        {
          heading: "The big idea, stated once",
          body: [
            "Everything downstream follows from a single principle we call **admin-driven, data + theme only**. The operator can change *what the app shows* — offers, stories, prices, hours, serviceable areas, colours, which seasonal images are live — but they cannot change *how the app is laid out or how it moves*. Layout and motion stay in the app's code; only the **content poured into fixed slots** is dynamic.",
            { note: "Why draw the line there? Because the moment an operator can move layout, you've built a website builder, not a food app — and every release becomes untestable. Fixing the skeleton and flowing only data through it keeps the app fast, predictable, and safe to change live.", tone: "info" },
          ],
        },
      ],
    },

    // ───────────────────────────────────────────────────────────── 2
    {
      slug: "architecture",
      num: 2,
      eyebrow: "How the pieces connect",
      title: "The architecture, from far away to up close",
      dek: "Zoom out to the whole world, then in to the parts of the API — and how it survives growing past one server.",
      sections: [
        {
          heading: "The world around the system",
          body: [
            "At the widest zoom, Burger Farm is one platform talking to a handful of outside services. Each outside service is a deliberate dependency — something we chose *not* to build ourselves.",
            { list: [
              "**Firebase** — proves who a customer is (identity only; we never let it hold our business data).",
              "**Google Places** — turns a typed address into real coordinates. It's *billable*, so we put it behind our own protected proxy so nobody can run up the bill.",
              "**Payment gateway (Razorpay/Cashfree)** — takes the actual money. To be built; deliberately deferred so we never store card numbers.",
              "**Cloud storage + CDN** — serves menu and brand images close to the user, off the API server.",
              "**Redis** — realtime fan-out, shared cache, global rate-limiting. The unlock for running more than one server.",
              "**Neon Postgres** — the system of record, with point-in-time backups.",
            ]},
            "The two human apps authenticate **differently on purpose**: the mobile app sends a Firebase token (a *Bearer* token in the header); the admin panel uses a cookie plus a CSRF token. That split isn't an accident — it's a security decision covered in Chapter 8.",
          ],
        },
        {
          heading: "Inside the API: domain modules",
          body: [
            "The backend is organised into **domain modules**, each following the same shape: a router (the doors), a controller (the doorman), a service (the actual work), and Zod validators (the bouncer checking IDs at the door). Some exist today; most are designed and waiting.",
            { list: [
              "**Identity & session** — bootstrap a session, fetch \"me\", profile, preferences. (Partly built.)",
              "**Catalog / menu** — categories, products, variants, modifiers, combos, per-store availability. (Tables exist, no API yet.)",
              "**Cart** — exactly one active cart per (customer, store); the server prices it, never the client.",
              "**Order** — place (snapshot the cart), history, status, reorder (re-price live).",
              "**Payment** — intents, confirm, HMAC-verified webhooks, refunds.",
              "**Loyalty** — points, a freebie ladder, tiers, an append-only ledger.",
              "**Content / app-config** — offers, stories, popups, and the versioned `GET /app-config` the app lives on.",
              "**Store & serviceability** — stores, hours, delivery radius, the 'do we deliver here?' decision. (Built.)",
              "**Address, Assets/theme, Ops, Platform** — the supporting cast.",
            ]},
          ],
        },
        {
          heading: "Cross-cutting layers — written once, reused everywhere",
          body: [
            "Some concerns can't live inside one module; they wrap *all* of them. Getting these right once is what keeps ~90 future endpoints safe and consistent.",
            { list: [
              "**Auth** — two schemes, already enforced. Customer requests read identity *only* from the verified token, never from the URL or body (this is the core defence against users reaching each other's data).",
              "**Validation** — Zod at every boundary; money is always an integer number of paise, and non-integer or negative amounts are rejected.",
              "**Error envelope** — one standard error shape `{ error: { code, message, details, request_id } }`, settled early so 90 endpoints don't calcify two different formats.",
              "**Rate-limit** — tiered (login is strict, billable Places is stricter, reads are broad), backed by Redis so the limit is global across servers.",
              "**SSE + outbox** — realtime events are written to an 'outbox' table in the *same database transaction* as the change itself, then a poller pushes them out. (Why this matters is Chapter 10.)",
              "**Audit + idempotency** — every admin and money action is logged; orders, payments and redemptions carry an idempotency key so a retry never double-acts.",
            ]},
          ],
        },
        {
          heading: "Surviving more than one server",
          body: [
            "Today Burger Farm runs on a **single server instance**, and three things live *inside that one process*: the rate-limiter's counters, the list of connected realtime clients, and a local cache. On one server, all three are correct. On two servers, all three are silently *wrong* — each server counts rate-limits separately, realtime events only reach clients pinned to the same server, and caches disagree.",
            { note: "This is the most important scaling truth in the whole system: in-process state is a lie the moment you have a second process. The fix isn't 'more servers' — it's moving that shared state OUT, into Redis, first.", tone: "warn" },
            "So the path to running N≥2 servers is, in order: **(1)** externalise that state to Redis; **(2)** use Neon's pooled connection string with a per-server connection cap so `servers × pool size` stays under Neon's limit; **(3)** finish the CDN so images never touch the API node; **(4)** add a separate worker process to drain the outbox. Only then does a load balancer in front of many servers actually work.",
          ],
        },
      ],
    },

    // ───────────────────────────────────────────────────────────── 3
    {
      slug: "order-journey",
      num: 3,
      eyebrow: "Follow one tap",
      title: "The journey of a single order",
      dek: "From the app opening to a live tracking dot — every hop, and where the system quietly protects itself.",
      sections: [
        {
          heading: "Before anything: the app is never blank",
          body: [
            "When the app opens, it does **not** wait for the network. It immediately renders from the **last cached app-config** — the offers, theme and flags it saw last time. Then, in the background, it asks the server `GET /app-config` and includes the version it already has (an `If-None-Match` header). If nothing changed, the server replies `304 Not Modified` and the app does nothing. If something changed, it gets the new body and swaps it into the fixed slots.",
            { note: "A customer on a flaky train connection still sees a full, branded app instantly. The network makes it *fresher*, never *possible*. Offline-first isn't a feature here — it's the default.", tone: "good" },
          ],
        },
        {
          heading: "Can we even deliver to you?",
          body: [
            "Before showing a menu, the app asks `POST /serviceability/check` with the chosen address and the mode (delivery or pickup). The **server** decides — using each store's delivery radius — and replies either `{serviceable, store_id, eta, fee}` or a clean `422 not-serviceable`. The client never computes this and never sees the raw store coordinates or radius maths.",
            "Then `GET /menu?store_id=` returns the catalog *for that store* — including which items are sold out and any per-store price override. Two stores can show different availability and prices from the same product catalog.",
          ],
        },
        {
          heading: "Building the cart, and the bill",
          body: [
            "Every time an item is added, the server re-prices the line: **base price + the sum of modifier deltas**, all in paise. This is what kills the classic 'every custom burger is a flat ₹499' bug — the price is computed from the actual choices, server-side.",
            { steps: [
              "`POST /cart/items` with the product and the selected options → the server returns the cart with line totals *it* set.",
              "`POST /cart/quote` with the mode and any promo or points to redeem → the server adds delivery + packaging + tax (including tax-on-fees), subtracts discounts, and returns the final bill plus a short-lived **quote_token** and the loyalty points this order would earn.",
            ]},
            "That `quote_token` is a promise with an expiry. It's how the system later proves the price the customer agreed to is the price being charged.",
          ],
        },
        {
          heading: "Checkout → payment → order → live tracking",
          body: [
            "This is the riskiest hop — real money — so it's also the most defended.",
            { steps: [
              "`POST /orders` with an **Idempotency-Key** and the `quote_token`. The server re-checks serviceability and guards against a changed price, then — in **one database transaction** — snapshots the cart into an immutable Order (name, image, veg flag, calories frozen in) *and* writes an `order.placed` event to the outbox.",
              "`POST /payments/intent` (also idempotent) → the server asks the gateway to create a payment intent and hands back a client secret; the customer pays on the gateway's own screen (so card numbers never touch our servers).",
              "The gateway calls us back at `POST /webhooks/payments` — **HMAC-signed**, with a unique event id. In another transaction we capture the payment and write a `payment.captured` event.",
              "A worker drains the outbox → Redis → and pushes an **SSE order-changed** event *only to that one customer*. The tracking dot goes live.",
            ]},
            "Notice how many safety rails are in that short list: idempotency keys (no double order), a re-quoted price (no stale total), a signed webhook with a unique id (no forged or replayed payment), a transactional outbox (the event can't exist without the order), and per-customer event scoping (you never see someone else's order). Each one answers a specific 'what if' in Chapter 10.",
          ],
        },
      ],
    },

    // ───────────────────────────────────────────────────────────── 4
    {
      slug: "dynamic-control-plane",
      num: 4,
      eyebrow: "The heart of the product",
      title: "How an admin edit reaches a live phone in seconds",
      dek: "One loop — edit, version, push, pull, swap — and the discipline that keeps it safe.",
      sections: [
        {
          heading: "The loop",
          body: [
            "This is the mechanism the whole product is named for. When an operator changes something, here is exactly what happens:",
            { steps: [
              "The admin edits a row — an offer, a theme colour, store hours, a price — **and a schedule** (start time, end time, active flag, priority). They never edit a layout.",
              "In **one transaction**, the API writes the row, writes an audit-log entry, bumps a monotonic **AppConfigVersion** counter (this number *is* the ETag), and writes a `config-changed` event to the outbox.",
              "A poller publishes a **tiny** invalidation event — just `{version}`, never the full state — to Redis. Every server instance is subscribed and fans it out over SSE.",
              "Each client receives that little nudge and **pulls** a fresh `GET /app-config` with its current version. The server returns either the new active-now set or `304`.",
              "The new data drops into **fixed coded slots**. The carousel, popup, and theme tokens change; the widget, the motion, and the layout do not.",
            ]},
            { note: "The client never evaluates a schedule. The server decides what is 'active now' (active flag on, start ≤ now < end) and returns only that. Clients are dumb on purpose — it means a phone with the wrong clock, or an old app version, can't show an offer that should be retired.", tone: "info" },
          ],
        },
        {
          heading: "Why push a nudge, then pull?",
          body: [
            "We could have pushed the *whole* new config over the realtime channel. We don't, for two reasons. First, the realtime event stays tiny and cheap, so a burst of edits doesn't flood every device with payloads. Second, the pull goes through the same cached, versioned `GET /app-config` path the app already uses on launch — so there is exactly **one** way config ever reaches the app, online or offline, scheduled or manual. One path is one thing to test and trust.",
          ],
        },
        {
          heading: "The control center: versions you can roll back",
          body: [
            "Because every change bumps a version, the admin has an **App-Config Versions** screen: publish, schedule, and — critically — **roll back**. Nothing reaches the app uncontrolled, and a bad change is *one click* to revert. That single capability is why pushing changes live to thousands of phones is safe rather than terrifying.",
          ],
        },
      ],
      decisions: [
        {
          id: "D1",
          title: "Admin-driven means DATA + THEME only — never layout or motion",
          what: "Operators can change content (offers, stories, prices, hours, serviceable areas) and theme (colours, seasonal image sets). They cannot move, resize, or re-order UI; layout and animation live in the app's code.",
          why: "It keeps the app fast and predictable, makes every release testable, and prevents the app from degrading into an un-QA-able page builder. The product value (change things live, no release) is captured almost entirely by data+theme; layout-editing adds enormous risk for little gain.",
          alternatives: "Full server-driven UI (every widget described by the server) — maximally flexible, but slow, fragile, and impossible to guarantee pixel/motion quality on. We rejected it.",
          how: "The app ships fixed coded slots; `GET /app-config` returns only the data and theme tokens that fill them. A motion 'engine' (D9) lets the admin assign pre-built animation presets to asset groups — so even motion is chosen from a code-built menu, not authored freely.",
        },
        {
          id: "D2",
          title: "A versioned GET /app-config, pushed by SSE-over-Redis",
          what: "One endpoint returns the entire active-now content+theme+flags, tagged with a version/ETag. Changes are announced by a tiny realtime event; clients then re-pull.",
          why: "ETags give free 304s (no payload when nothing changed), the cached body makes the app offline-first, and the nudge-then-pull design means a single, testable code path serves launch, manual edits, and scheduled go-lives alike.",
          alternatives: "Polling on a timer (wasteful, laggy) or pushing full state over the socket (floods devices, and creates a second config path to maintain). Both rejected.",
          how: "An AppConfigVersion counter is the ETag source; Redis pub/sub fans the `{version}` event to every server's SSE subscribers; clients pull `/app-config` with `If-None-Match`.",
        },
        {
          id: "D5",
          title: "Content & theme carry a schedule; the server resolves 'active now'",
          what: "Every offer/story/theme set has start_at, end_at, is_active and priority. The server returns only what is active at this instant; clients never evaluate the schedule.",
          why: "Seasonal and timed campaigns must go live and retire on their own, exactly on time, identically for every user — regardless of the device's clock or app version. Centralising the decision on the server is the only way to guarantee that.",
          alternatives: "Letting the client decide what's active from start/end times — breaks on wrong device clocks and stale app versions, and leaks not-yet-live content to anyone inspecting traffic. Rejected.",
          how: "A resolver filters `is_active && start_at <= now < end_at`, ordered by priority, on every `/app-config` read; a scheduled item simply appears on the next pull after its start time, with no admin action.",
        },
      ],
    },

    // ───────────────────────────────────────────────────────────── 5
    {
      slug: "data-and-money",
      num: 5,
      eyebrow: "The permanent memory",
      title: "The data model, and the iron rules of money",
      dek: "36 models, why money is an integer, and how a custom burger gets its price.",
      sections: [
        {
          heading: "Tables without doors",
          body: [
            "There are **36 data models** in the schema, but only 8 route files. That gap is deliberate and tells you exactly where the work is: menu, cart, order, payment, loyalty and content are **tables without an API** — the shapes are designed and migrated, but no endpoint touches them yet. Launch is largely the act of *opening doors* onto existing, well-considered tables.",
          ],
        },
        {
          heading: "Money is an integer number of paise — always",
          body: [
            "The single most important data rule in the system: **all money is stored and computed as an integer count of paise** (1 rupee = 100 paise), never as a decimal or a float.",
            { note: "Floating-point money is how you end up charging ₹499.99999998. Computers can't represent 0.1 exactly in binary; add enough of them and the rounding drifts. Integers never drift. Every serious payments system on earth stores money as the smallest integer unit.", tone: "warn" },
            "And on every bill we assert an invariant before trusting it: `subtotal + tax + fees − discount == total`. If that equation doesn't hold to the exact paise, the bill is wrong and we refuse it rather than charge it.",
          ],
        },
        {
          heading: "How a custom burger is priced",
          body: [
            "Pricing is **base price + the sum of modifier deltas**. A burger starts at its base; adding cheese adds its delta; a large size adds its delta; removing onions adds nothing. The server computes this from the actual selections every time an item is added or a cart is re-quoted.",
            "This replaces a demo shortcut where every build-your-own burger was a flat price. Real pricing has to reflect real choices — otherwise two very different burgers cost the same, and the business loses money on the expensive one.",
          ],
        },
        {
          heading: "Snapshots: an order is frozen in time",
          body: [
            "When an order is placed, we don't store *links* to the current product rows — we **snapshot** the name, image, veg flag, calories and price into the order itself. If the menu changes tomorrow, last week's order still shows exactly what was bought at the price that was paid. An order is a historical fact, not a live view.",
          ],
        },
      ],
      decisions: [
        {
          id: "D8",
          title: "Money in integer paise; pricing = base + modifier deltas; reorder reprices live",
          what: "Every monetary value is an integer of paise. Item price is computed from base + selected modifier deltas. Re-ordering an old order re-prices it at today's prices and drops items no longer available.",
          why: "Integers eliminate rounding drift; computed pricing reflects real choices; live re-pricing on reorder prevents charging a stale or impossible total (and avoids replaying an item that's been deleted).",
          alternatives: "Decimals/floats for money (rejected — drift); flat per-build pricing (rejected — loses money); reorder that replays the old line items verbatim (rejected — stale prices, dead items).",
          how: "Additive `*_paise` integer columns alongside the legacy decimals, backfilled and invariant-asserted, then reads switch to paise — a careful coordinated migration done before the first slice that does money maths.",
        },
        {
          id: "D7",
          title: "One loyalty account: points + a freebie ladder + tiers; real-money wallet OFF at launch",
          what: "Loyalty is a single account with three axes — spendable points, a freebie ladder unlocked by order count, and status tiers. A real-money wallet exists in the design but ships behind a flag, off at launch.",
          why: "Points and a wallet serve different purposes and carry very different fraud and regulatory weight; shipping the wallet later (behind a flag) lets loyalty launch without taking on money-storage risk on day one.",
          alternatives: "Three separate systems (confusing, triple the surface) or shipping the wallet immediately (regulatory + fraud risk before it's needed). Both rejected.",
          how: "An append-only loyalty ledger (already in the schema) records every earn/burn exactly once; points are awarded only on *fulfilled* orders and reversed on cancellation; the wallet feature flag stays off.",
        },
      ],
    },
  ],
};
