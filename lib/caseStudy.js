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

    // ───────────────────────────────────────────────────────────── 6
    {
      slug: "serviceability-and-privacy",
      num: 6,
      eyebrow: "Where we deliver, and what we hide",
      title: "Serviceability and the privacy of a home address",
      dek: "Who decides if we deliver to you — and why your coordinates never leave the server.",
      sections: [
        {
          heading: "'Do we deliver here?' is the server's call, never the app's",
          body: [
            "Each store has a **delivery radius**. Whether an address is serviceable is decided by the **backend**, by comparing the address against every store's radius — and the answer is the *first* thing checked before a menu is ever shown. The app sends the address; the server returns `{serviceable, store_id, eta, fee}` or a clean `422 not-serviceable`.",
            "The old, tempting shortcut was to let the app find the *nearest* store with some local distance maths and just use that. We rejected it. If you're outside every radius, the honest answer is **\"we don't deliver here yet\"** — not a silent match to a store that can't actually reach you. A silent nearest-match is how customers get orders that never arrive.",
          ],
        },
        {
          heading: "Your coordinates stay on the server",
          body: [
            "Addresses live in **Postgres**, not in the phone or a third-party store. The server keeps your latitude/longitude to do the serviceability maths — but it **never sends them back to any client**. The address list a customer sees is passed through a DTO that omits the coordinates entirely.",
            { note: "This was a real bug we found and fixed (finding S-2): the address endpoint returned the full row, lat/lng included. Precise home coordinates of every user, handed to anything inspecting the traffic — a genuine physical-safety risk, not just a privacy nicety. The fix is a strict response shape that defaults to hiding internal fields.", tone: "warn" },
            "Even when picking a location, the app uses a **map pin via Google Places**, not a typed-in latitude/longitude — so the coordinate is captured cleanly and stays server-side.",
          ],
        },
      ],
      decisions: [
        {
          id: "D3",
          title: "Per-store delivery radius, backend-authoritative",
          what: "Serviceability is a per-store radius check, decided on the server, exposed as a single check endpoint and re-checked at checkout.",
          why: "The 'can we deliver?' decision touches revenue and customer trust; it must be consistent, un-spoofable, and changeable by ops in real time. Only the server has the authority and the live store data to decide it correctly.",
          alternatives: "Client-side distance maths to the nearest store (spoofable, and silently matches stores that can't deliver) — rejected. Fixed delivery 'zones' drawn on a map (more rigid than a radius, heavier to manage) — deferred.",
          how: "A standalone `POST /serviceability/check`; an explicit `422 {serviceable:false, reason}` when an address is saved out of range; the radius is editable in admin via a map panel; the customer's serviceability is re-evaluated on select and again at checkout.",
        },
        {
          id: "D4",
          title: "Addresses in Postgres; raw lat/lng never returned to clients",
          what: "Customer addresses are stored in Postgres (not Firestore, not the device as source of truth). Coordinates are kept server-side only and stripped from every customer response.",
          why: "Geolocation is physical-safety-sensitive PII under India's DPDP Act; data-minimization means a client gets only what it needs (a label and the serviceable verdict), never the precise coordinates.",
          alternatives: "Addresses in Firestore (splits the source of truth, harder to join with serviceability) — rejected. Returning the full row for convenience — rejected (that was S-2).",
          how: "A Postgres `UserAddress` table; an explicit `select`/DTO on every address response that omits lat/lng; coordinates used only inside serviceability math.",
        },
      ],
      edgeCases: [
        { q: "a customer's address is just outside every store's radius?", risk: "A silent 'nearest store' match means an order is accepted that no store can actually deliver.", answer: "The server returns a clean not-serviceable result and the app shows a **\"we don't deliver here yet\"** screen — never a silent nearest-match." },
        { q: "an operator shrinks a store's radius while a customer has that address saved?", risk: "A previously-serviceable customer silently keeps ordering into a gap.", answer: "Serviceability is re-evaluated on the next select **and again at checkout** — so the customer flips to not-serviceable on their next action, not after a failed delivery." },
        { q: "someone inspects the app's network traffic to find a user's home?", risk: "Exposed lat/lng is a stalking / physical-safety risk.", answer: "Coordinates are stripped from every customer response (the S-2 fix); only a coarse serviceable/not and the chosen label ever leave the server." },
      ],
    },

    // ───────────────────────────────────────────────────────────── 7
    {
      slug: "security",
      num: 7,
      eyebrow: "Assume someone is trying",
      title: "Security and the threat model",
      dek: "What's already strong, the two real bugs we found, and the rules that keep ~90 unbuilt endpoints safe from day one.",
      sections: [
        {
          heading: "What is already strong (verified)",
          body: [
            "A security review is only worth anything if it's honest about what's *right*, not just what's wrong. The shipped backend already does the standard hardening:",
            { list: [
              "**Security headers** via helmet; **tiered rate-limiting** (a broad API limit plus a strict 10-per-15-min limit on admin login).",
              "**CSRF double-submit** is implemented and wired on every admin mutation.",
              "**Fail-closed auth**: if the Firebase admin credentials are missing, requests get a 503 — never trust-by-default. The dev-only unverified fallback is double-gated so it *cannot* run in production.",
              "**No raw SQL** — all database access goes through Prisma, parameterized by construction, so SQL injection isn't on the table.",
              "**Safe deploys** — migrations run via `migrate deploy` (versioned), not a destructive `db push`.",
            ]},
            { note: "An earlier automated security pass invented findings against files that don't exist in this repo — five of its six 'High' findings were false. Every claim here was re-checked against the real file at the cited line. That discipline — code, not vibes — is itself a security control.", tone: "warn" },
          ],
        },
        {
          heading: "The two real findings",
          body: [
            "**S-1 (Critical) — the admin token was also kept in `localStorage` and accepted as a Bearer header, and that Bearer path auto-bypassed CSRF.** The httpOnly cookie was fine; the *copy* in JavaScript was stealable by any admin-panel XSS, and because the client always sent the Bearer, the CSRF check was effectively dead. The fix (decision D6): remove the localStorage copy and the Bearer path entirely — **httpOnly cookie + live CSRF, token never in JS**.",
            "**S-2 (High) — the address list returned raw lat/lng** (covered in Chapter 6). Fixed by a DTO that omits coordinates.",
            "Everything else was Medium/Low/Info: no per-store admin roles yet (fine until a second store-manager exists), no explicit JSON body-size limit, the gated dev fallback, and unverified dependency vulns to scan in CI.",
          ],
        },
        {
          heading: "Rules for the endpoints not yet built",
          body: [
            "Most of the attack surface doesn't exist yet — which is exactly why the *rules* matter now, before ~90 endpoints calcify bad habits.",
            { list: [
              "**Ownership from the token, never the URL** — every customer endpoint derives 'who am I' from the verified token and filters by it. This is the defence against the most common API bug, where user A reaches user B's data by guessing an id (BOLA/IDOR).",
              "**Whitelist writable fields** — admin and profile writes can never set `is_admin`, a password hash, a points balance, or any money/role field from the request body (mass-assignment).",
              "**DTO every response** — default-deny internal fields (coordinates, costs, other users' data). S-2 was one instance of a rule that applies everywhere.",
              "**Scope realtime** — a customer may only receive their *own* order/tracking events; channels are never broadcast cross-user.",
            ]},
          ],
        },
        {
          heading: "Money rules (hard gates for the payment build)",
          body: [
            { list: [
              "**Gateway-hosted checkout** — card data never touches our servers or logs (keeps us at the lightest PCI scope).",
              "**Server-authoritative amounts** — the client never sends a price; the server computes it from the live menu and the quote_token.",
              "**Signed, idempotent webhooks** — verify the gateway HMAC on every webhook; a unique `(provider, event_id)` guard means a replayed or forged event does nothing.",
              "**Idempotent orders** — a retry with the same key returns the same order, never a second charge.",
              "**Audited refunds + a paise invariant** — refunds require admin (later, a finance role) and are logged; every bill must satisfy `subtotal + tax + fees − discount == total` to the paise.",
            ]},
          ],
        },
      ],
      decisions: [
        {
          id: "D6",
          title: "Admin auth = httpOnly cookie + CSRF; no token in JavaScript",
          what: "The admin session lives only in an httpOnly cookie protected by CSRF double-submit. No copy in localStorage, no Bearer path on admin routes.",
          why: "A token readable by JavaScript is stealable by a single XSS; and a Bearer path that bypasses CSRF makes the CSRF protection theatre. Cookie-only + live CSRF closes both at once — it's the one must-fix-before-anything.",
          alternatives: "Keeping the localStorage token 'for convenience' (rejected — it's the whole vulnerability) or relying on short token lifetime instead of fixing the path (rejected — a 12h full-admin token is plenty of damage).",
          how: "Remove the localStorage write and the Bearer injection in the admin client; remove the Bearer fallback in the admin middleware and the Bearer-bypass in the CSRF middleware. Result: token never in JS, CSRF actually fires.",
        },
      ],
      edgeCases: [
        { q: "an attacker lands an XSS in the admin panel and tries to steal the session?", risk: "A stolen 12-hour full-admin token works from anywhere — total control of the business.", answer: "The token lives only in an httpOnly cookie JavaScript can't read (D6); there's no localStorage copy to exfiltrate." },
        { q: "a malicious site tricks a logged-in admin's browser into POSTing a mutation?", risk: "Cross-site request forgery silently changes prices or refunds money.", answer: "CSRF double-submit rejects any admin mutation missing the matching token — and the old Bearer path that bypassed it is gone (D6)." },
        { q: "user A requests user B's order, address, or cart by guessing the id?", risk: "The classic API breach (BOLA): trusting an id in the URL hands out everyone's data.", answer: "Ownership is derived from the verified token and every query is filtered by it; the id in the path is ignored for authorization." },
        { q: "the payment gateway's webhook is forged, or the same one is replayed?", risk: "A forged 'payment captured' marks an unpaid order paid; a replay double-credits.", answer: "Every webhook's HMAC signature is verified, and a unique `(provider, event_id)` guard makes replays no-ops. Unsigned or duplicate events are ignored." },
        { q: "a customer edits the request to send their own (lower) total?", risk: "Client-trusted amounts let anyone set their own price.", answer: "The client never sends an amount; the server recomputes the bill from the live menu + the short-lived quote_token at checkout." },
        { q: "someone tries to set is_admin or points_balance through a profile update?", risk: "Mass-assignment escalates privilege or mints loyalty currency.", answer: "Writes whitelist allowed fields per resource; role, money, and balance fields are never body-writable." },
      ],
    },

    // ───────────────────────────────────────────────────────────── 8
    {
      slug: "scale-and-observability",
      num: 8,
      eyebrow: "Past one server",
      title: "Scale, performance, and seeing inside",
      dek: "The three things that are correct on one server and silently wrong on two — and how we'd know if anything broke.",
      sections: [
        {
          heading: "The three lies of a single process",
          body: [
            "Today everything runs in one process, and three pieces of state live *inside* it: the rate-limiter's counters, the list of connected realtime (SSE) clients, and a local cache. On one server they're correct. Add a second server behind a load balancer and all three quietly break:",
            { list: [
              "**Rate-limit** — each server counts separately, so the real limit is doubled and bypassable.",
              "**Realtime** — an event only reaches clients pinned to the server that produced it; everyone else misses it.",
              "**Cache** — the two servers disagree about what's current.",
            ]},
            "The fix is not 'more servers' — it's moving that shared state **out into Redis first**: a Redis-backed rate-limit store, Redis pub/sub for realtime fan-out, and a shared Redis cache. This is finding S-4, and it's the real unlock for horizontal scale.",
          ],
        },
        {
          heading: "Connections, the outbox, and a worker",
          body: [
            "**Database connections are precious.** With N servers each holding a pool, `N × pool_size` must stay under Neon's connection cap — so production uses Neon's pooled connection string with a per-server cap, and the direct connection is reserved for running migrations.",
            "**The transactional outbox** is how an event can never lie. When an order is placed, the `order.placed` event is written to an outbox table **inside the same database transaction** as the order. Either both commit or neither does. A separate **worker** process then drains the outbox and pushes events out — so even if the API crashes the instant after committing, the event is delivered after restart. No lost events, no ghost events for orders that didn't happen.",
          ],
        },
        {
          heading: "Knowing what's happening",
          body: [
            "You can't operate what you can't see. The observability plan: **structured logs** carrying a shared `request_id` so one request is traceable across the system; **error tracking** on every app; **RED/USE metrics** (rates, errors, durations / utilization, saturation, errors) plus business metrics (orders, revenue, payment success); **distributed tracing**; an **uptime check plus a synthetic checkout** that actually places a test order; and **alerting with an on-call runbook**. Before launch, the Neon point-in-time-restore is *rehearsed*, not assumed.",
          ],
        },
      ],
      edgeCases: [
        { q: "an admin edits content on server A but a customer is connected to server B?", risk: "With in-process realtime, the customer never gets the update — the product's core promise silently fails at scale.", answer: "Realtime moves to Redis pub/sub: server A publishes, every instance's subscriber fans out over SSE, so the customer on B is reached (the S-4 fix)." },
        { q: "we add a second server during a traffic spike without preparing?", risk: "Rate limits halve in effectiveness and realtime events vanish for half the users.", answer: "Adding instances is gated on the Redis trifecta being in place first; running N≥2 before that is a known-wrong state we explicitly don't ship." },
        { q: "the database runs out of connections under load?", risk: "New requests can't get a connection and the whole API stalls.", answer: "Production uses Neon's pooler with a per-instance pool cap so `N × pool` stays under the limit; the direct URL is used only for migrations." },
        { q: "the API commits an order then crashes before announcing it?", risk: "The order exists but no tracking event ever fires — a paid order that looks lost.", answer: "The event is written in the *same transaction* as the order (the outbox); a worker delivers it after restart. The event can't exist without the order, or vice-versa." },
        { q: "a deploy needs to be rolled back mid-flight?", risk: "In-flight requests get dropped; a schema change strands the old code.", answer: "Rolling deploys drain in-flight requests before swapping; migrations follow expand-contract (add before remove) so old and new code both work during the window; PITR restore is rehearsed." },
      ],
    },

    // ───────────────────────────────────────────────────────────── 9
    {
      slug: "failure-playbook",
      num: 9,
      eyebrow: "The whole point of engineering",
      title: "The \"what if it breaks?\" playbook",
      dek: "A system is judged by how it fails. Here is the consolidated register of bad days — and the exact design that turns each into a non-event.",
      sections: [
        {
          heading: "Why this chapter exists",
          body: [
            "Anyone can draw the happy path. The difference between a demo and a product is the dozen places where reality goes sideways: the network drops, a button gets double-tapped, two things happen at once, a downstream system is offline. Below is the consolidated playbook — each row is a concrete bad day and the specific mechanism that already handles it.",
          ],
        },
      ],
      edgeCases: [
        { q: "the kitchen / POS system is offline when an order comes in?", risk: "Orders pile up invisibly or get lost; customers pay for food no one is making.", answer: "POS is a fast-follow behind an adapter, not a hard dependency: orders are still placed, paid, and tracked through our own system, and a **manual ops board** drives the kitchen. The order is never blocked on the POS being up. (Watch this exact scenario in the order-journey simulator.)" },
        { q: "a payment is captured but writing the order failed (or vice-versa)?", risk: "Money taken with no order, or an order with no money — the worst kind of inconsistency.", answer: "The order snapshot and its outbox event are written in **one transaction**; payment capture is reconciled against the gateway via signed webhooks, and a daily reconciliation catches any drift. The customer is never charged for an order that doesn't exist in our system." },
        { q: "a customer double-taps 'place order', or retries on a flaky connection?", risk: "Two identical orders, two charges.", answer: "Order placement and payment both require an **Idempotency-Key**; a retry with the same key returns the *same* order and never creates a second charge." },
        { q: "the price changed between getting a quote and checking out?", risk: "The customer is charged a different total than the one they agreed to.", answer: "Checkout carries a short-lived **quote_token**; the server re-prices and runs a PRICE_CHANGED guard. If the bill moved, the customer re-quotes and re-confirms — no silent change." },
        { q: "an item sells out while it's sitting in someone's cart?", risk: "An order is placed for food that can't be made.", answer: "Availability is re-checked at checkout against per-store `StoreProduct` state; sold-out items are caught before payment, and a sold-out toggle in admin propagates to apps within seconds over SSE." },
        { q: "the app is opened with no internet at all?", risk: "A blank, broken screen on a flaky connection.", answer: "The app renders from its **last cached app-config** immediately and reconciles when the network returns. Offline is the default-safe state, not an error." },
        { q: "an operator publishes a broken content/theme version?", risk: "Every phone shows a broken home screen at once.", answer: "Every change bumps a version, and the **App-Config Versions** screen has one-click rollback. A bad version is reverted in seconds — and because layout is code, the blast radius is data only, never a broken layout." },
        { q: "the same loyalty points are spent twice in two parallel requests?", risk: "A user overspends points they don't have (a race condition).", answer: "Redemptions use a **conditional decrement** on an append-only ledger (decrement only if the balance still covers it) plus an idempotency key — so concurrent requests can't both succeed." },
        { q: "someone places an order, earns points, then cancels it?", risk: "Loyalty farming — minting currency from cancelled orders.", answer: "Points are awarded only on **fulfilled** orders and reversed on cancellation; referrals are capped and abuse-heuristic'd (AB-2)." },
        { q: "a coupon is submitted twice at the same instant?", risk: "Coupon stacking / reuse beyond its cap.", answer: "Redemption caps are enforced server-side with an atomic redeem; the discount is never trusted from the client." },
        { q: "the user's phone clock is wrong and a timed offer should be live (or dead)?", risk: "A device with a skewed clock shows a retired offer, or hides a live one.", answer: "The **server** decides what's active now (D5); the client never evaluates schedules, so the device clock is irrelevant." },
        { q: "Redis itself goes down?", risk: "Realtime, shared cache, and global rate-limiting all depend on it.", answer: "The system degrades rather than dies: reads fall back to the database and the last app-config cache; realtime reconnects and clients re-pull `/app-config` on reconnect; rate-limiting fails safe. Redis is monitored as critical infra with alerting." },
      ],
    },

    // ───────────────────────────────────────────────────────────── 10
    {
      slug: "integrations-and-polyglot",
      num: 10,
      eyebrow: "Talking to the outside world",
      title: "Integrations, motion, and many databases",
      dek: "Adapter now, integrate later — and why Postgres always wins an argument.",
      sections: [
        {
          heading: "Adapter now, integrate later",
          body: [
            "Every external system Burger Farm depends on — the **POS** (Flamboyant), **delivery** (Dunzo / Shadowfax), and **payments** (Razorpay) — sits behind an **adapter** in our code, and most are **off at launch**. The platform launches running its own orders and tracking with manual ops; the third-party hooks switch on later without touching the core order logic.",
            { note: "An adapter is a thin translation layer: our code talks to *our* interface, and the adapter translates to the vendor's. Swapping Dunzo for Shadowfax, or adding a second payment provider, becomes a change in one file — not a rewrite of the order flow.", tone: "info" },
          ],
        },
        {
          heading: "The motion engine — even animation is chosen from a menu",
          body: [
            "Decision D1 said layout and motion stay in code. The motion engine (D9) is how we keep that promise while still giving operators seasonal flair: the app ships a set of **pre-built animation presets**, and the admin **assigns** a preset to an asset group (and can schedule it). So motion is dynamic only in the sense of *which code-built preset plays* — operators never author raw animation, which keeps every frame QA'd and 60fps.",
          ],
        },
        {
          heading: "Polyglot persistence — one source of truth",
          body: [
            "The system uses more than one datastore, but with an iron rule: **Postgres is the single source of truth.** Redis is in from the start (realtime, cache, limits). Other stores — Pub/Sub, Firestore, a realtime DB — may be added as **projections** (fast read-models built *from* Postgres) where they help, but a projection is **never authoritative**. If a read-model ever disagrees with Postgres, Postgres wins and the projection is rebuilt.",
          ],
        },
      ],
      decisions: [
        {
          id: "D9",
          title: "Dynamic motion = code-built presets the admin assigns",
          what: "Operators choose and schedule animation presets per asset group; they never author motion freely. Only product *presentation* is dynamic; chrome and layout stay coded.",
          why: "It captures the seasonal-flair value while keeping motion testable and performant — free authoring would make 60fps and pixel-parity impossible to guarantee.",
          alternatives: "Server-described animations / a motion DSL (powerful but un-QA-able, jank-prone) — rejected.",
          how: "A library of coded presets; admin assigns a preset id (+ schedule) to an asset group; the app plays the matching coded animation.",
        },
        {
          id: "D10",
          title: "Third-party POS / delivery / payments behind adapters, off at launch",
          what: "POS=Flamboyant, delivery=Dunzo/Shadowfax, payment=Razorpay, each behind an adapter; integrations are prepped but switched on after launch (manual ops first).",
          why: "It de-risks launch (no hard dependency on a vendor being live), and adapters make swapping or adding a vendor a localized change.",
          alternatives: "Hard-wiring a vendor's SDK through the order flow — rejected (couples launch to vendor uptime and makes switching a rewrite).",
          how: "Our code calls our own interface; an adapter translates to each vendor; feature flags gate when each goes live.",
        },
        {
          id: "D11",
          title: "Polyglot persistence with Postgres as the only source of truth",
          what: "Postgres is authoritative; Redis now; Pub/Sub/Firestore/Realtime DB may be added as read-model projections, never as a source of truth.",
          why: "Live read-models can make reads fast and cheap, but two sources of truth is how data corruption starts. One authority, many disposable projections.",
          alternatives: "Treating a realtime DB as co-authoritative for live data — rejected (reconciliation nightmares).",
          how: "Projections are built from Postgres and are rebuildable; on any disagreement, Postgres wins.",
        },
      ],
      edgeCases: [
        { q: "the POS is down at launch — or a particular store never adopts it?", risk: "Coupling orders to the POS would block the whole business when the POS is unavailable.", answer: "POS is fast-follow behind an adapter; orders run through our own system with a manual ops board, so a down (or absent) POS never blocks ordering." },
        { q: "we need to switch delivery providers?", risk: "A vendor SDK wired through the order flow makes switching a rewrite.", answer: "The adapter boundary means swapping Dunzo↔Shadowfax (or adding one) is a change in the adapter, not in order logic." },
        { q: "a Firestore read-model disagrees with Postgres?", risk: "Two sources of truth corrupt each other.", answer: "Postgres is authoritative; the projection is rebuilt from it. A read-model is never trusted over the system of record." },
      ],
    },

    // ───────────────────────────────────────────────────────────── 11
    {
      slug: "roadmap",
      num: 11,
      eyebrow: "From here to launch",
      title: "The roadmap — twelve vertical slices",
      dek: "Sequenced by dependency, then risk, then value — each slice shippable on its own, each ending in something you can see.",
      sections: [
        {
          heading: "Why vertical slices",
          body: [
            "The work isn't organised by layer ('do all the backend, then all the app'). It's organised into **vertical tracer-bullet slices** — each cuts through mobile + backend + admin to deliver one observable behaviour, and each is independently shippable. That way value lands continuously and integration risk is paid down early, not in a big-bang at the end.",
            "Tags: **[LB]** = launch-blocking for a public MVP; **[FF]** = fast-follow after launch.",
          ],
        },
        {
          heading: "The twelve slices",
          body: [
            { steps: [
              "**Connectivity + security foundations** [LB] — one base-URL truth, retry that preserves auth, admin cookie-only (S-1), lat/lng stripped (S-2). Small; unblocks everything.",
              "**Serviceability + addresses** [LB] — the delivery-radius rule end-to-end (D3); addresses through Postgres only (D4).",
              "**Dynamic content + app-config + SSE/Redis** [LB] — offers/stories/popups as scheduled backend entities behind a versioned `/app-config`, pushed via Redis (closes S-4).",
              "**Catalog / menu** [LB] — the whole menu as a real resource with per-store availability + admin CRUD.",
              "**Cart + checkout pricing + money→paise** [LB] — server-authoritative cart and bill in integer paise; carries the money migration (D8).",
              "**Payments** [LB] — gateway intents + HMAC webhooks + refunds; idempotent and reconciled.",
              "**Orders + tracking** [LB] (POS/dispatch [FF]) — immutable orders, live per-user status, reorder that reprices.",
              "**Loyalty** [LB for points+ladder] — points + freebie ladder + tiers; wallet flagged off (D7).",
              "**Theme / seasonal engine** [FF, basic tokens LB] — brand colours and seasonal asset sets as admin theme tokens.",
              "**Admin observability dashboards** [FF, minimal board LB] — the 'watch the live system' half.",
              "**UI pixel/motion parity pass** [LB] — reference-exact mobile UI, every screen.",
              "**Hardening** [LB] — Redis everywhere across N≥2, pooling, structured logs + tracing, load test, pentest, launch gates.",
            ]},
          ],
        },
        {
          heading: "The critical path, and where the scary migrations land",
          body: [
            "The minimum chain for a customer to browse, order, pay, and track — plus the safety gates — is **1 → 2 → 3 → 4 → 5 → 6 → 7 → 11 → 12**. Loyalty, theme, deep dashboards, and POS run in parallel or fast-follow; launch happens with manual ops.",
            "The two migrations that scare everyone sit at deliberate points on that path: the **security fixes (S-1/S-2) in Slice 1** (they gate everything that reads admin/address surfaces), **Redis/S-4 in Slice 3** (the first slice needing multi-instance realtime, re-verified in Slice 12), and the **money→paise cutover in Slice 5** (the first slice doing money maths — done as an additive, shadow-written, invariant-asserted migration so the pricing service never straddles two unit systems).",
            { note: "Step back and the whole roadmap is just the big idea made real, in order: get connectivity and safety right, make content dynamic, open the catalog, make money correct, take payments, place orders — and only then polish pixels and harden for scale. Change data, not code — earned one slice at a time.", tone: "good" },
          ],
        },
      ],
    },
  ],
};
