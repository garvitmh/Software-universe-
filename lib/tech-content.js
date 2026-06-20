// Encyclopedic, deeply-grounded reference on every technology in the stack.
// Each entry is rendered by components/TechArticle.jsx. Inline markup in strings:
//   `code`  and  **bold**.
// Add a slug here → its page at /codex/tech/<slug> goes live automatically
// (generateStaticParams reads these keys) and the sidebar flips it from "soon".

export const TECH_CONTENT = {
  // ───────────────────────────── LANGUAGES ─────────────────────────────
  dart: {
    slug: "dart",
    title: "Dart",
    category: "Language",
    color: "blue",
    tagline: "The programming language your entire mobile app is written in.",
    oneLiner: "Dart is the language Flutter speaks — typed, fast, and built so the same code can run natively on both iPhone and Android.",
    what: [
      "A **programming language** is just the set of words and rules you use to tell a computer what to do. Your app (`apps/mobile-app`) is written almost entirely in Dart, a language made by Google specifically to pair with Flutter.",
      "Dart is **statically typed**: you (or the tools) declare that a thing is a number, or a `MenuProduct`, or a list of strings — and the computer checks those promises *before* the app ever runs. A whole class of typos and mismatches gets caught at your desk instead of on a customer's phone.",
      "It has **sound null safety**, which is a big deal. ‘Null' means ‘nothing here'. In older languages, a value you expected could secretly be nothing, and reading it crashed the app — the infamous ‘null pointer'. Dart forces you to say up front whether something *can* be nothing (`String?`) or never is (`String`), so the ‘it was empty and everything exploded' bug largely disappears.",
    ],
    analogy: {
      title: "Two engines in one language",
      body: "Think of Dart as a car with two engines. While you're building, it runs in a quick-to-start mode (JIT) that lets Flutter do **hot reload** — change code and see it on screen in under a second. When you ship to customers, it switches to a second engine (AOT) that compiles to fast native machine code. Same fuel, two engines for two jobs.",
    },
    insideTitle: "The parts of Dart you'll actually meet",
    inside: [
      { name: "Types & classes", desc: "`class MenuProduct { ... }` — your own named shapes of data, checked at compile time." },
      { name: "Null safety", desc: "`String?` means ‘maybe nothing'; `String` means ‘always something'. The compiler enforces it." },
      { name: "Futures & async/await", desc: "How Dart waits for slow things (a network call) without freezing the screen." },
      { name: "Isolates", desc: "Dart is single-threaded, but heavy work can be shoved onto a separate isolate so the UI stays smooth." },
    ],
    why: [
      "Dart exists to solve one specific problem: **one team, one codebase, both phones.** Building separately for iPhone (Swift) and Android (Kotlin) means writing — and bug-fixing — everything twice. Dart + Flutter lets you write it once.",
      "It was also designed *around* UI work: hot reload for fast iteration, AOT compilation for buttery 60fps animations, and a syntax familiar to anyone who's seen JavaScript or Java, so the learning curve is gentle.",
    ],
    alternatives: [
      { name: "Kotlin + Swift", note: "The native route — best possible integration, but two separate apps to build and maintain." },
      { name: "JavaScript (React Native)", note: "One codebase too, but it drives the phone's native widgets through a bridge; Flutter/Dart instead draws every pixel itself." },
      { name: "C# (.NET MAUI)", note: "Another cross-platform option; smaller ecosystem for this kind of app than Flutter." },
    ],
    howWeUse: {
      body: [
        "Every screen, every provider, every model in the app is Dart. When the menu loads, a Dart class `MenuProduct` describes each item; an `async` function awaits the network; null safety guarantees a product's name is never secretly missing.",
        "The immutable `BurgerCustomization` in the burger builder is pure Dart too — a typed, null-safe object that can't be edited in place, only copied.",
      ],
      refs: [
        "apps/mobile-app/lib/  — the whole app, in Dart",
        "apps/mobile-app/lib/features/menu/data/menu_repository.dart",
        "apps/mobile-app/lib/features/menu/presentation/builder/burger_customization.dart",
      ],
    },
    breaks: "Turn off null safety (as old code did) and here's the bad day: the backend returns a product with no price field, the app reads `product.price` expecting a number, finds nothing, and crashes to a white screen mid-order. Sound null safety makes the compiler refuse to even build that mistake — you're forced to handle the ‘maybe empty' case on purpose.",
    related: ["flutter", "typescript", "riverpod"],
  },

  typescript: {
    slug: "typescript",
    title: "TypeScript",
    category: "Language",
    color: "blue",
    tagline: "JavaScript with a safety net — the language of your backend and admin panel.",
    oneLiner: "TypeScript is JavaScript plus types: you label what your data looks like, and a checker catches mismatches before the code ever runs.",
    what: [
      "JavaScript is the language of the web, but it's famously loose — it'll happily let you add a number to a sentence and only complain once something's already gone wrong for a user. **TypeScript** is JavaScript with an added layer: you describe the *shape* of your data (this is a number, that is an `Order` with these fields), and a tool checks every line against those descriptions.",
      "Crucially, the browser and Node.js don't run TypeScript directly. It gets **compiled** down to plain JavaScript first (your backend's build step is literally `prisma generate && tsc`, where `tsc` is the TypeScript compiler). The types are a tool for *you*; they vanish in the final running code.",
      "Your backend (`apps/backend`) and admin panel (`apps/admin-panel`) are TypeScript. The `.ts` extension is the giveaway.",
    ],
    analogy: {
      title: "Labels on the boxes",
      body: "Imagine a warehouse where every box is unlabelled — you only discover a box holds glassware when you drop it. TypeScript is putting a label on every box (‘this is an Order', ‘this is a number'). Now the moment you try to stack something wrong, a checker stops you — before anything shatters in front of a customer.",
    },
    inside: [
      { name: "Type annotations", desc: "`amount: number`, `order: Order` — you spell out what each value is." },
      { name: "Interfaces & types", desc: "Reusable named shapes, like a blueprint for an ‘Order' object." },
      { name: "The compiler (tsc)", desc: "Reads your `.ts`, checks the types, and emits plain `.js` the server can run." },
      { name: "Generated types", desc: "Prisma auto-generates types from your database schema, so your code knows the exact shape of every table." },
    ],
    why: [
      "On a backend that handles money, ‘it broke for a customer' is expensive. TypeScript moves a huge category of mistakes — a misspelled field, the wrong argument, forgetting a value can be null — from *runtime* (a real user, a real failure) to *compile time* (a red squiggle while you type).",
      "It also makes the code self-documenting and refactor-safe: rename a field and the compiler shows you every one of the forty places that need updating, instead of you finding them via production errors.",
    ],
    alternatives: [
      { name: "Plain JavaScript", note: "Less ceremony, no build step — but every type mistake waits to ambush you at runtime." },
      { name: "Flow", note: "Facebook's type-checker for JS; TypeScript won the ecosystem battle decisively." },
      { name: "A typed language (Go, Java)", note: "Types from the ground up, but you leave the vast JavaScript ecosystem behind." },
    ],
    howWeUse: {
      body: [
        "The backend is written in `.ts` and built with `tsc` into a `dist/` folder of plain JavaScript that Node runs in production. Prisma generates TypeScript types straight from `schema.prisma`, so when your code reads an `Order`, the editor already knows it has a `total`, a `status`, and an `idempotency_key`.",
        "That generated link between database and code is why a typo like `order.totl` is caught instantly, not after a customer's payment misbehaves.",
      ],
      refs: [
        "apps/backend/  — TypeScript source (.ts)",
        "apps/backend/package.json  — build: \"prisma generate && tsc\"",
        "apps/backend/prisma/schema.prisma  — types are generated from here",
      ],
    },
    breaks: "Drop the types and rename the database column `total` to `grand_total`, but miss one spot in the code. Plain JavaScript ships happily; then a customer checks out and the server reads `order.total`, gets `undefined`, and tries to charge `undefined` rupees. TypeScript would have lit up that exact line in red before you ever committed.",
    related: ["nodejs", "prisma", "express"],
  },

  nodejs: {
    slug: "nodejs",
    title: "Node.js",
    category: "Runtime",
    color: "amber",
    tagline: "The engine that runs your backend's JavaScript on a server.",
    oneLiner: "Node.js lets JavaScript run on a server instead of only in a browser — it's the thing your backend code actually executes inside.",
    what: [
      "JavaScript was born inside web browsers. **Node.js** took the browser's JavaScript engine (Google's V8) and wrapped it so the same language can run on a *server* — a computer in a data centre answering requests. Your backend is a Node.js program.",
      "Node's signature trait is its **event loop**: a single main line of work that never sits idle waiting. When your code asks the database for an order, Node doesn't freeze for those few milliseconds — it sets that request aside, serves other customers, and comes back when the answer arrives. This ‘non-blocking I/O' is why one Node process can juggle thousands of waiting requests at once.",
      "That design makes Node a superb fit for an app backend, where almost every request is mostly *waiting* — on the database, on the payment gateway, on the kitchen system.",
    ],
    analogy: {
      title: "One brilliant waiter",
      body: "Picture a single waiter who never stands still. He takes your order, fires it to the kitchen, and instead of waiting at the pass he's already taking three more tables' orders. When a dish is ready he delivers it. One waiter, dozens of tables — because the slow part (cooking) happens elsewhere and he never blocks on it. That's Node's event loop.",
    },
    inside: [
      { name: "V8 engine", desc: "Google's JavaScript engine (from Chrome) — turns your JS into fast machine code." },
      { name: "Event loop", desc: "The single line of execution that hands off slow work and never blocks." },
      { name: "npm", desc: "The package manager — millions of reusable libraries, including Express and Prisma." },
      { name: "Modules", desc: "Code split into files that import each other; your `app.ts` wires them together." },
    ],
    why: [
      "Node was chosen because an ordering backend is **I/O-bound**, not number-crunching: it spends its time waiting on other systems. The event loop turns all that waiting into capacity to serve more users on the same hardware.",
      "There's also a people advantage: the app, admin, and backend can all be JavaScript/TypeScript, so one mental model and one ecosystem (npm) covers the whole stack.",
    ],
    alternatives: [
      { name: "Python (Django/Flask)", note: "Lovely to write; traditionally blocks on I/O unless you reach for async frameworks." },
      { name: "Go", note: "Compiled, brilliant at concurrency; a different language and ecosystem to learn." },
      { name: "Java / Spring", note: "Rock-solid enterprise default; heavier and more verbose than Node for this size of app." },
    ],
    howWeUse: {
      body: [
        "The backend is a Node.js app. In development it runs the TypeScript directly via `ts-node-dev`; in production it runs the compiled `node dist/app.js`. Express (a Node library) handles the HTTP requests, and Prisma (another) talks to PostgreSQL.",
        "Because Node keeps no per-user state in its own memory, you can run many identical copies behind a load balancer — the property that lets the backend scale (Part 09).",
      ],
      refs: [
        "apps/backend/src/app.ts  — the Node program's entry point",
        "apps/backend/package.json  — start: \"node -r dotenv/config dist/app.js\"",
      ],
    },
    breaks: "Node's strength is also its trap: there's one main line of work, so if you do something genuinely CPU-heavy on it (resizing huge images, crunching a giant report) the loop *blocks* — every other customer's request hangs until it finishes. The fix is to push heavy work off to a queue and a separate worker (Part 09), keeping the event loop free to do what it's great at: waiting on many things at once.",
    related: ["typescript", "express", "prisma"],
  },

  // ───────────────────────────── APP / FRONTEND ─────────────────────────────
  flutter: {
    slug: "flutter",
    title: "Flutter",
    category: "UI toolkit",
    color: "purple",
    tagline: "The toolkit that draws every pixel of your app, the same on iPhone and Android.",
    oneLiner: "Flutter is how the app is built: you compose tiny ‘widgets' into screens, and Flutter paints them itself — one codebase, identical on both phones.",
    what: [
      "**Flutter** is a UI toolkit from Google. Its one giant idea: **everything on screen is a ‘widget'.** A button is a widget, the row holding three buttons is a widget, the whole menu screen is a widget built from smaller widgets. You build an interface by nesting small widgets into bigger ones, like Lego.",
      "Unlike most app frameworks, Flutter doesn't borrow the phone's native buttons — it **draws every pixel itself** with its own rendering engine. That's why a Flutter app looks and behaves *identically* on iPhone and Android, and why custom designs (like your burger builder's animations) are possible without fighting the platform.",
      "You describe *what* the screen should look like for the current data, and Flutter figures out the minimal changes to make it so. Change the data, call `build` again, Flutter redraws. This is the ‘declarative' style.",
    ],
    analogy: {
      title: "Lego, not a kit of pre-made furniture",
      body: "Other toolkits hand you the platform's pre-made furniture — the iOS button, the Android switch — and you arrange it. Flutter hands you Lego bricks and a blank canvas: you build the exact button you want, pixel by pixel, and it looks the same everywhere. More freedom, and total consistency across phones.",
    },
    inside: [
      { name: "Widgets", desc: "The building blocks. Everything visible (and much that isn't) is a widget." },
      { name: "The widget tree", desc: "Widgets nested inside widgets, forming the whole screen as a tree." },
      { name: "build() method", desc: "Each widget describes itself from the current data; Flutter calls it to (re)draw." },
      { name: "Rendering engine", desc: "Flutter's own painter (Skia/Impeller) that turns the tree into actual pixels at 60fps." },
    ],
    why: [
      "Flutter was chosen for the same reason as Dart: **one codebase, both phones, pixel-perfect control.** For an app whose personality lives in its custom motion and layout (the radial burger builder, the animated cart), drawing your own pixels beats wrestling each platform's native widgets.",
      "Hot reload makes building fast — tweak a colour, see it in a second — and the declarative model means the UI is always a clean function of your data, which pairs perfectly with Riverpod's reactive state.",
    ],
    alternatives: [
      { name: "React Native", note: "Also one codebase, but drives the OS's native widgets via a JS bridge — less pixel control, more ‘native feel' for free." },
      { name: "Native (SwiftUI / Jetpack Compose)", note: "Best platform integration; two separate apps to build and keep in sync." },
      { name: "A web app in a shell", note: "Cheapest to reuse web code; usually the least app-like feel and performance." },
    ],
    howWeUse: {
      body: [
        "The whole app under `apps/mobile-app/lib` is Flutter. Screens live in each feature's `presentation/` folder as widgets; the menu screen is a widget tree that watches Riverpod providers and rebuilds when the cart or filter changes.",
        "The burger builder is Flutter showing off: a `burger_stack` of layered widgets, positioned by computed geometry and animated with the motion engine — exactly the kind of bespoke UI that ‘draw your own pixels' makes possible.",
      ],
      refs: [
        "apps/mobile-app/lib/features/menu/presentation/  — menu screens & widgets",
        "apps/mobile-app/lib/features/menu/presentation/builder/burger_stack.dart",
        "apps/mobile-app/lib/shared/widgets/motion/  — reusable animated widgets",
      ],
    },
    breaks: "Flutter rebuilds widgets a lot, and that's normally cheap — unless you rebuild a huge subtree on every tiny change. Forget to keep widgets small and `const` where possible, and a single keystroke in a search box can redraw the entire screen, causing visible jank. The fix is the same discipline as state: rebuild only the small widget that actually changed, which Riverpod's fine-grained watching makes easy.",
    related: ["dart", "riverpod", "dio"],
  },

  riverpod: {
    slug: "riverpod",
    title: "Riverpod",
    category: "State management",
    color: "purple",
    tagline: "How the app holds shared, live data — the single source of truth, made reactive.",
    oneLiner: "Riverpod keeps important data (the cart, the filters) in one place and lets any widget read it, so the whole screen stays in sync automatically.",
    what: [
      "‘State' is anything that can change while the app is open — what's in your cart, which category is selected, the search text. **Riverpod** is the library that holds that state and shares it, so different parts of the screen never disagree about it.",
      "The core unit is a **provider**: a named, shared piece of state or logic. A widget ‘watches' a provider; when the provider's value changes, every watcher rebuilds automatically. You never manually tell three widgets ‘hey, the cart changed' — they're already listening.",
      "Riverpod also does **derived state**: one provider can be computed from others. Your visible product list is derived from the full catalogue, the chosen filter, and the chosen category — change any input and the list recomputes itself.",
    ],
    analogy: {
      title: "A noticeboard, not photocopies",
      body: "Without Riverpod, each part of the screen keeps its own photocopy of the cart — and they drift apart, so the icon says 2 while the bill charges for 3. Riverpod is a single noticeboard everyone reads from. Pin a change once and every reader sees the same truth instantly. (You can feel this exact bug in the Cart-drift simulator.)",
    },
    inside: [
      { name: "Provider", desc: "A named, shared value or computation — the cart, the active filter, the API client." },
      { name: "ref.watch / ref.read", desc: "How a widget subscribes to a provider (watch = rebuild on change; read = one-off)." },
      { name: "Derived providers", desc: "Providers built from other providers — e.g. the visible-products list." },
      { name: "autoDispose", desc: "Providers can clean themselves up when nothing's watching, freeing memory." },
    ],
    why: [
      "Flutter's built-in `setState` keeps state trapped inside one widget — fine for a toggle, useless when three separate screens need the same cart. Riverpod was chosen because it makes *shared* and *derived* state effortless, is testable without a running app, catches wiring mistakes at compile time, and rebuilds only the widgets that actually use a changed value.",
      "It's the practical enforcement of the most important rule in app state: **one source of truth, many readers** (Part 02).",
    ],
    alternatives: [
      { name: "setState", note: "Built in, dead simple, but state is local to one widget — no sharing." },
      { name: "Provider (the older one)", note: "Riverpod's predecessor; Riverpod fixes its rough edges (compile-time safety, no BuildContext needed)." },
      { name: "Bloc", note: "Very structured, event-driven; more boilerplate, great for large teams that want strictness." },
      { name: "GetX", note: "Batteries-included and terse; less explicit about where state lives." },
    ],
    howWeUse: {
      body: [
        "The cart lives in one provider (`menu_cart_provider.dart`); the floating cart bar and the cart screen both watch it, so they can't fall out of sync. In `menu_provider.dart`, the active filter and category are their own providers, and `menuVisibleProductsProvider` derives the on-screen list from all three.",
        "Even the network client is a provider (`apiClientProvider`) — handed to repositories rather than created by them, which is dependency injection in action (Part 02).",
      ],
      refs: [
        "apps/mobile-app/lib/features/menu/presentation/providers/menu_cart_provider.dart",
        "apps/mobile-app/lib/features/menu/presentation/providers/menu_provider.dart  — menuVisibleProductsProvider",
      ],
    },
    breaks: "Abandon the single source of truth and let each widget keep its own copy of the cart. Remove an item and one copy misses the memo: the icon shows 2, the cart page shows 3, the bill charges for 3. That's not cosmetic — it's a money bug, and it's the single most common bug in app development. Riverpod's one-truth-many-readers model makes it structurally impossible.",
    related: ["flutter", "dart", "dio"],
  },

  // ───────────────────────────── BACKEND / DATA ─────────────────────────────
  express: {
    slug: "express",
    title: "Express",
    category: "Web framework",
    color: "amber",
    tagline: "The backend's traffic system — it decides which code answers which request.",
    oneLiner: "Express is the Node library that turns an incoming web request into the right function, running guards (middleware) along the way.",
    what: [
      "When the app sends a request to the backend, *something* has to catch it, figure out what it's asking for, run the right code, and send a reply. That something is **Express** — a small, popular web framework for Node.js.",
      "Express has two core ideas. **Routes** map a URL + method to a handler: ‘a `GET` to `/api/v1/menu` runs this function'. **Middleware** is code that runs *before* the handler, in a chain — checking auth, verifying a CSRF token, attaching a request-id — and can stop a request dead if something's wrong.",
      "A request flows through the middleware chain, reaches its route's handler, and the handler sends a response. That orderly pipeline is the whole shape of the backend.",
    ],
    analogy: {
      title: "Airport security to the right gate",
      body: "A request landing at your backend is a traveller. Middleware is the series of checkpoints — passport, boarding pass, security scan — each able to turn them back. Clear them all and they reach the right gate (the route handler) which actually does their business. Express is the airport that runs the checkpoints and the gates in order.",
    },
    inside: [
      { name: "Routes", desc: "URL + method → handler. `router.get('/menu', ...)`." },
      { name: "Middleware", desc: "Functions that run before handlers: auth, CSRF, logging, parsing. They can pass or block." },
      { name: "req & res", desc: "The request object (what came in) and the response object (what you send back)." },
      { name: "Routers", desc: "Groups of related routes (menu, admin) mounted under a path like `/api/v1`." },
    ],
    why: [
      "Express was chosen for being **minimal and unopinionated**: it gives you routing and middleware and gets out of the way, which suits a backend that wants its real logic in well-separated service files rather than dictated by a framework.",
      "It's also the most widely-used Node framework on earth, so every problem has been solved before and every library plugs into it.",
    ],
    alternatives: [
      { name: "Fastify", note: "Similar idea, faster, stricter; smaller (but growing) ecosystem." },
      { name: "NestJS", note: "Heavily structured, Angular-style; great for big teams, much more ceremony." },
      { name: "Raw Node http", note: "No dependencies at all — but you'd reinvent routing and middleware yourself." },
    ],
    howWeUse: {
      body: [
        "`app.ts` creates the Express app and wires in global middleware (security headers, CSRF, request tracing). Route files under `src/routes` map URLs to handlers; the handlers stay thin and call **services** (`src/services`) that hold the real logic. Guards like `requireAdmin` and `requireCsrf` live in `src/middleware`.",
        "Everything is mounted under `/api/v1`, the version prefix that lets the API evolve without breaking old app versions (Part 09).",
      ],
      refs: [
        "apps/backend/src/app.ts  — the Express app + global middleware",
        "apps/backend/src/routes/  — URL → handler maps",
        "apps/backend/src/middleware/  — requireAdmin, requireCsrf, tracing",
      ],
    },
    breaks: "Forget an error-handling middleware and let one handler throw an unexpected error. Without a safety net, that error can crash the whole Node process — taking down *every* customer's request, not just the one that failed. A proper error middleware catches it, logs it, and returns a clean 500 to just that one request while everyone else keeps ordering.",
    related: ["nodejs", "prisma", "auth"],
  },

  postgresql: {
    slug: "postgresql",
    title: "PostgreSQL",
    category: "Database",
    color: "teal",
    tagline: "The permanent, reliable memory where every order and payment truly lives.",
    oneLiner: "PostgreSQL is the relational database that stores Burger Farm's data in linked tables, with hard guarantees that money and orders are never corrupted.",
    what: [
      "A **database** is the part of the system that *remembers* — permanently, through restarts and crashes. **PostgreSQL** (‘Postgres') is a relational database: it stores data in **tables** of rows and columns, like very strict spreadsheets, where one order is one row in the `Order` table.",
      "‘Relational' means the tables are **linked**. An order points to the user who placed it and the store it's from; it owns a list of order-items, each pointing to a product. Those links are enforced — you can't have an order-item pointing at a product that doesn't exist. The database simply refuses.",
      "Postgres also guarantees **ACID transactions**: a group of writes either all happen or none do. That's the bedrock that makes it safe to handle money — there's no universe where a payment is recorded but its order vanishes.",
    ],
    analogy: {
      title: "A bank's ledger room, not a notebook",
      body: "A notebook (a simple file) is easy until two people write at once, or the power cuts mid-sentence, and now your records are nonsense. Postgres is the bank's ledger room: strict rules about what can be written, locked drawers so two clerks don't clash, and a guarantee that a half-finished entry is torn up entirely rather than left dangling.",
    },
    inside: [
      { name: "Tables, rows, columns", desc: "The grid. One `Order` row holds one order's `total`, `status`, timestamps." },
      { name: "Foreign keys", desc: "A column that points at another table's row — `Order.user_id` → `User`. Links, enforced." },
      { name: "Indexes", desc: "Pre-sorted lookups (`@@index([store_id, status])`) that make queries instant at scale." },
      { name: "Transactions (ACID)", desc: "All-or-nothing groups of writes — the core of safely handling money." },
    ],
    why: [
      "Burger Farm's data is deeply *related* (orders ↔ users ↔ stores ↔ products) and involves *money*, which demands exact decimals and real transactions. Postgres provides relationships, referential integrity, ACID transactions, and battle-tested decimal math — precisely the guarantees money needs.",
      "It's also open-source, endlessly capable (JSON columns, full-text search, geospatial), and trusted by enormous companies — so it scales with you instead of being outgrown.",
    ],
    alternatives: [
      { name: "MySQL", note: "The other big relational database; comparable, slightly different feature set and history." },
      { name: "MongoDB (NoSQL)", note: "Stores flexible documents, no fixed schema; weaker at the cross-table relationships and transactions an order system leans on." },
      { name: "SQLite", note: "A whole database in a single file — perfect for tiny/local apps, not a multi-user server." },
      { name: "Firebase/Firestore", note: "Great realtime + easy start, but the truth-and-transactions an ordering backend needs fit a relational DB better." },
    ],
    howWeUse: {
      body: [
        "Every model in `schema.prisma` becomes a Postgres table: `Order`, `OrderItem`, `OrderPayment`, `Product`, `LoyaltyTransaction`, and more. Money columns use `Decimal(10,2)` for exactness; `idempotency_key` is marked unique to block double-charges; indexes like `@@index([store_id, status])` keep ‘this store's pending orders' instant.",
        "Placing an order wraps several writes in a transaction so it's all-or-nothing — the guarantee explored in Part 05 and the order-journey simulator.",
      ],
      refs: [
        "apps/backend/prisma/schema.prisma  — every table's definition",
        "Order / OrderItem / OrderPayment models — relations, Decimal money, indexes",
      ],
    },
    breaks: "Strip out the constraints and transactions for ‘speed'. Now a crash mid-checkout leaves an order with no payment (free food) or a payment with no order (a charge for nothing), and a bug can insert an order-item pointing at a deleted product. Postgres's foreign keys and ACID transactions are exactly what make those corrupt half-states impossible.",
    related: ["prisma", "sql", "transactions"],
  },

  prisma: {
    slug: "prisma",
    title: "Prisma",
    category: "ORM",
    color: "teal",
    tagline: "The translator between your code's objects and the database's rows.",
    oneLiner: "Prisma lets the backend read and write the database using normal typed objects instead of hand-written SQL — and keeps the schema and code in lock-step.",
    what: [
      "Code thinks in *objects* (`order.total`); databases think in *tables and SQL*. An **ORM** (Object-Relational Mapper) is the translator between the two. **Prisma** is the ORM your backend uses.",
      "It starts from one file, `schema.prisma`, that describes every table in a clean, readable syntax. Run `prisma generate` and Prisma produces a fully **typed client**: code that knows your tables exactly, so `prisma.order.create({...})` is checked against the real shape of the `Order` table, with autocomplete and red squiggles for mistakes.",
      "Prisma also manages **migrations** — versioned, repeatable changes to the database's structure — so the schema evolves safely instead of someone editing tables by hand in production.",
    ],
    analogy: {
      title: "A perfect bilingual clerk",
      body: "You speak ‘objects'; the database speaks ‘SQL'. Prisma is a bilingual clerk who takes your request — ‘create this order with these items' — translates it into precise SQL, runs it, and hands back a tidy object. You never fumble the foreign language, and the clerk never mistranslates a column name.",
    },
    inside: [
      { name: "schema.prisma", desc: "One file describing every table, field, relation, and index — the single source of truth for data shape." },
      { name: "prisma generate", desc: "Reads the schema and emits a typed client your TypeScript code imports." },
      { name: "The Client", desc: "`prisma.order.findMany(...)` etc. — typed methods for every table." },
      { name: "Migrations", desc: "Versioned SQL changes that bring any database up to the current schema, repeatably." },
    ],
    why: [
      "Prisma was chosen because it makes the database **type-safe end to end**: the same `schema.prisma` defines the tables *and* generates the types your code uses, so the code literally cannot reference a column that doesn't exist. That kills a whole class of bugs.",
      "It also makes everyday data code readable (no string-concatenated SQL), and turns schema changes into reviewable, repeatable migrations rather than risky manual edits.",
    ],
    alternatives: [
      { name: "Raw SQL", note: "Maximum control and speed; you hand-write and hand-maintain every query and lose compile-time safety." },
      { name: "TypeORM / Sequelize", note: "Older ORMs; capable but historically clunkier types and rougher migrations than Prisma." },
      { name: "Drizzle", note: "A newer, lighter, SQL-flavoured type-safe alternative; smaller ecosystem." },
    ],
    howWeUse: {
      body: [
        "`schema.prisma` defines every table; the backend's build runs `prisma generate` before compiling so the typed client is always in sync. Services call the client (e.g. to create an order and its items inside a transaction), and Prisma turns those calls into the right SQL against Postgres.",
        "Because the client's types come from the schema, the rest of the TypeScript codebase inherits exact knowledge of every table — the link described in the TypeScript page.",
      ],
      refs: [
        "apps/backend/prisma/schema.prisma  — the schema Prisma reads",
        "apps/backend/package.json  — build runs `prisma generate` first",
      ],
    },
    breaks: "Skip migrations and just edit the live database by hand. Now the database has a column the code doesn't expect (or is missing one the code needs), and the two have silently drifted apart — the next deploy crashes on the first query. Prisma migrations keep code and schema moving together as one reviewed, repeatable step (Part 10).",
    related: ["postgresql", "typescript", "transactions"],
  },
};
