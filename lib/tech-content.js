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

  // ───────────────────────────── THE WEB IN BETWEEN ─────────────────────────────
  "http-rest": {
    slug: "http-rest",
    title: "HTTP & REST",
    category: "Protocol",
    color: "blue",
    tagline: "The grammar the app and backend use to talk to each other.",
    oneLiner: "HTTP is the request-and-reply language of the web; REST is the tidy convention your backend follows for naming and shaping those requests.",
    what: [
      "**HTTP** (HyperText Transfer Protocol) is how two computers on the web have a conversation. It's strictly request-and-reply: the app sends a **request** (‘please give me the menu'), the backend sends back a **response** (‘here it is, and it went fine'). Nothing is pushed unasked; the app always initiates.",
      "Every request has a **method** — the verb. `GET` means ‘read me something' (and changes nothing); `POST` means ‘here's something new, create it'; `PUT`/`PATCH` update; `DELETE` removes. It also has a **URL** (what you're talking about) and a **status code** in the reply: `200` OK, `404` not found, `401` not logged in, `500` the server broke.",
      "**REST** isn't a technology — it's a widely-followed *convention* for organising an HTTP API around ‘resources' (things like orders and products), addressed by tidy URLs, acted on with the standard methods. Your backend is RESTful: the menu lives at `GET /api/v1/menu`, an order is created with `POST /api/v1/orders`.",
    ],
    analogy: {
      title: "Ordering by postcard",
      body: "Imagine every interaction is a postcard. The app posts a card — ‘GET me the menu' — to a precise address (the URL). The backend reads it, does the work, and posts a card back with a result and a little stamp saying how it went (the status code). One card out, one card back; the app never just receives a card it didn't ask for.",
    },
    inside: [
      { name: "Method (verb)", desc: "GET reads, POST creates, PUT/PATCH update, DELETE removes. GET must never change anything." },
      { name: "URL / path", desc: "Which resource you mean: `/api/v1/menu`, `/api/v1/orders/123`." },
      { name: "Headers", desc: "Metadata travelling with the request — the auth cookie, the CSRF token, the content type." },
      { name: "Status code", desc: "The reply's verdict: 200 OK, 401 unauthorised, 404 missing, 500 server error." },
    ],
    why: [
      "HTTP is simply *the* language of the web — universal, cacheable, understood by every tool, proxy, and browser. Following REST on top of it makes the API predictable: once you know one resource works as `GET/POST /api/v1/<thing>`, you can guess the rest.",
      "The `GET`-changes-nothing rule is quietly important: it means reads can be safely cached and retried, which is what later lets caching and CDNs speed the whole system up.",
    ],
    alternatives: [
      { name: "GraphQL", note: "One flexible endpoint where the client asks for exactly the fields it wants; more power, more setup than REST." },
      { name: "gRPC", note: "A fast binary protocol for service-to-service calls; great internally, less friendly for public/browser APIs." },
      { name: "WebSockets / SSE", note: "For the server *pushing* updates (live order status) rather than the app always asking — see Live sync." },
    ],
    howWeUse: {
      body: [
        "The app's repositories make HTTP requests through the Dio client to RESTful routes under `/api/v1`. Express maps each method+URL to a handler; the response comes back as JSON with a status code the app reacts to (200 → show the data, 401 → send the user to log in).",
        "The `v1` in the path is API versioning — it lets a `v2` exist later without breaking apps still speaking `v1` (Part 09).",
      ],
      refs: [
        "apps/backend/src/routes/  — RESTful routes under /api/v1",
        "GET /api/v1/menu · POST /api/v1/orders  — resource-style endpoints",
      ],
    },
    breaks: "Break the convention — make a `GET` that secretly changes data — and you've planted a landmine: caches and link-prefetchers fire `GET`s freely, so something could ‘place an order' just by a page being previewed. Keeping verbs honest (reads read, writes write) is what makes the whole web's caching and retry machinery safe to use.",
    related: ["json", "auth", "express"],
  },

  json: {
    slug: "json",
    title: "JSON",
    category: "Data format",
    color: "blue",
    tagline: "The simple text shape that data travels in between every part of the system.",
    oneLiner: "JSON is a lightweight, human-readable way to write down structured data as text — the lingua franca the app, backend and database all understand.",
    what: [
      "When the backend sends the menu to the app, it can't send a living Dart or JavaScript object down a wire — it has to send *text*. **JSON** (JavaScript Object Notation) is the agreed text format for that: curly braces for objects, square brackets for lists, `\"key\": value` pairs inside.",
      "It maps onto exactly the things every language already has — objects/maps, arrays/lists, strings, numbers, booleans, null — so both sides can convert effortlessly. The backend turns an object *into* JSON text (‘serialise'); the app turns that text back *into* an object (‘parse'/‘deserialise').",
      "It's readable by humans too, which makes debugging an API a matter of just looking at the response.",
    ],
    analogy: {
      title: "A flat-pack for data",
      body: "A real object (a chair) can't be posted easily. So you flat-pack it into a labelled, standard box (JSON text), post it, and the receiver assembles it back into a chair (an object) at the other end. JSON is the flat-pack standard everyone agrees on, so the box always reassembles correctly.",
    },
    inside: [
      { name: "Objects { }", desc: "Named fields: `{ \"total\": 358, \"status\": \"PLACED\" }` — like a record." },
      { name: "Arrays [ ]", desc: "Ordered lists: `[ \"Burger\", \"Fries\" ]` — like the items in an order." },
      { name: "Primitives", desc: "Strings, numbers, booleans, null — the basic values that fill the fields." },
      { name: "Serialise / parse", desc: "Turning an object into JSON text, and JSON text back into an object." },
    ],
    why: [
      "JSON won because it's *simple* and *universal*: tiny to learn, native to JavaScript, and supported everywhere from Dart to Postgres. For an API that connects a Flutter app, a Node backend, and a Next admin, having one shared data shape they all speak removes a whole category of translation bugs.",
      "It's also flexible — new fields can be added to a response without breaking older clients that simply ignore them, which helps the API evolve.",
    ],
    alternatives: [
      { name: "XML", note: "The older, far more verbose markup; powerful but heavy. JSON replaced it for most web APIs." },
      { name: "Protocol Buffers", note: "A compact binary format — smaller and faster, but not human-readable and needs a schema on both sides." },
      { name: "Form-encoding", note: "Fine for simple HTML form posts; clumsy for the nested data an order needs." },
    ],
    howWeUse: {
      body: [
        "Backend handlers reply with `res.json(...)`, turning a JavaScript object into JSON text. The app's repository receives that text and parses it into typed Dart objects like `MenuProduct`. The app's order request travels *to* the backend as JSON too.",
        "Postgres can even store JSON directly — your schema uses `Json?` columns (e.g. loyalty tier config) for data whose shape is flexible.",
      ],
      refs: [
        "apps/backend/src/  — handlers reply with res.json(...)",
        "apps/mobile-app/lib/features/menu/data/  — JSON parsed into MenuProduct models",
        "schema.prisma  — `Json?` columns for flexible config",
      ],
    },
    breaks: "Let the two sides disagree on the shape — the backend renames `total` to `grand_total` in its JSON but the app still reads `total` — and the app parses `null`, then renders ‘₹null' or crashes. JSON has no built-in contract enforcement, which is exactly why typed models (Dart classes, TypeScript types from Prisma) sit on top of it to catch a mismatched shape.",
    related: ["http-rest", "dart", "typescript"],
  },

  auth: {
    slug: "auth",
    title: "Auth — JWT, cookies & CSRF",
    category: "Security",
    color: "pink",
    tagline: "How the system proves who you are — safely — on every request.",
    oneLiner: "Auth is two questions answered on every request: who are you (a signed token in an httpOnly cookie), and is this request genuine (a CSRF token).",
    what: [
      "‘Auth' covers two related jobs. **Authentication** is proving *who you are* (you log in). **Authorisation** is deciding *what you're allowed to do* (only an admin can change prices). The web is stateless — each request arrives cold — so you must prove yourself on *every* request, not just once.",
      "Your system does this with a **JWT** (JSON Web Token): a compact, **signed** badge the backend issues at login that says ‘this is user X'. Signed means it's stamped with a secret only the server knows, so it can't be forged or edited. The token is stored in an **httpOnly cookie** — a cookie that JavaScript on the page *cannot read* — so even a malicious injected script can't steal your login.",
      "Cookies are sent automatically by the browser, which is convenient but opens one hole: **CSRF** (Cross-Site Request Forgery), where another website quietly fires a request to your backend riding your cookie. The fix is a **CSRF token**: a separate value the real app reads and echoes back in a header, which a foreign site can't obtain.",
    ],
    analogy: {
      title: "A signed wristband and a secret handshake",
      body: "At the door you show ID and get a tamper-proof wristband (the JWT) you can't fake. The bar staff check the band, not your ID, on every drink — that's auth on every request. But a wristband alone could be abused by someone shoving a drinks order through the hatch in your name, so the staff also require a secret handshake only people actually *inside* know (the CSRF token). Band + handshake = it's really you, really asking.",
    },
    inside: [
      { name: "JWT", desc: "A signed token carrying ‘who you are', tamper-proof because only the server holds the signing secret." },
      { name: "httpOnly cookie", desc: "Where the token lives. JavaScript can't read it, so a page script can't steal the login." },
      { name: "CSRF token", desc: "A second value the genuine app echoes back, proving the request came from the real app, not a forger." },
      { name: "Authorisation checks", desc: "requireAdmin and friends — deciding what a proven identity is allowed to do." },
    ],
    why: [
      "The popular shortcut is to keep the login token in `localStorage` and attach it by hand. It's easy — but *any* script that runs on your page can read `localStorage` and walk off with the login. The httpOnly cookie removes that entire class of theft. The price is CSRF risk, which the CSRF token closes. Every security choice is a trade; this stack picks the safer pair.",
      "Signed JWTs also keep the backend **stateless** — your identity rides in the token, so no server has to ‘remember' your session, which is what lets the backend run many copies (Part 09).",
    ],
    alternatives: [
      { name: "Token in localStorage", note: "Simple, but readable by any script on the page — a real XSS theft risk this stack deliberately avoids." },
      { name: "Server-side sessions", note: "The server stores each session; simple and revocable, but stateful, which complicates horizontal scaling." },
      { name: "OAuth / ‘Sign in with…'", note: "Delegate identity to Google/Apple; great UX, an extra integration and dependency." },
    ],
    howWeUse: {
      body: [
        "On login the backend sets an httpOnly cookie holding a signed JWT. State-changing requests must also carry a matching CSRF token. Middleware enforces both: `requireAdmin` checks you're a logged-in admin, `requireCsrf` checks the request is genuine, before any handler runs.",
        "The admin panel reuses exactly this for every write, which is why changing a price is safe (Part 04, Part 06).",
      ],
      refs: [
        "apps/backend/src/middleware/  — requireAdmin, requireCsrf",
        "apps/backend/.env.example  — JWT_SECRET (the signing secret, kept out of code)",
      ],
    },
    breaks: "Drop the CSRF check and stay logged in as admin. Now you visit a booby-trapped page that silently POSTs to your admin API; the browser helpfully attaches your cookie, the backend sees a ‘valid' admin request, and prices change or data is deleted under your own login. Or store the JWT in localStorage instead of an httpOnly cookie, and one injected script steals it outright. The cookie-plus-CSRF pairing is precisely what closes both doors.",
    related: ["http-rest", "express", "nodejs"],
  },

  // ───────────────────────────── CROSS-CUTTING LOGIC ─────────────────────────────
  idempotency: {
    slug: "idempotency",
    title: "Idempotency",
    category: "Concept",
    color: "brand",
    tagline: "Why doing the same thing twice has the same effect as doing it once.",
    oneLiner: "An idempotent operation can be repeated safely — a retried ‘place order' charges you once, not twice, because the system recognises the repeat.",
    what: [
      "Networks are unreliable. The app sends ‘place order', the reply gets lost on the way back, so the app retries — but the [[backend|backend]] may have *already* processed the first one. Without protection, you'd be charged twice and get two orders. **Idempotency** is the property that makes a repeated [[request|request]] land exactly once.",
      "The mechanism is an **idempotency key**: a unique token the client attaches to an attempt. The backend records keys it has seen. The first request with a given key does the work; any later request with the *same* key is recognised as a duplicate and quietly returns the original result instead of repeating the action.",
      "In your [[schema|schema]] this is enforced at the strongest possible level — the [[database|database]]. The `Order` [[table|table]]'s `idempotency_key` is marked **unique**, so a duplicate insert physically cannot happen; the second one bounces off a wall.",
    ],
    analogy: {
      title: "A numbered ticket, not a new queue",
      body: "Imagine you hand the kitchen a ticket numbered #57 with your order. If the waiter, unsure the kitchen heard, hands #57 again, the kitchen sees the same number and says ‘already cooking that' — they don't make a second burger. The number, not the act of asking, is what guarantees one meal. That number is the idempotency key.",
    },
    inside: [
      { name: "Idempotency key", desc: "A unique token per attempt, like `earn:order:<id>` or a UUID the client generates." },
      { name: "Unique constraint", desc: "The database refuses a second row with the same key — the hard, last line of defence." },
      { name: "Safe verbs", desc: "GET, PUT and DELETE are naturally idempotent; POST (create) is the one that needs a key." },
      { name: "Return the original", desc: "On a duplicate, hand back the first result rather than erroring or redoing." },
    ],
    why: [
      "Anything touching money *must* survive retries, and retries are not optional — phones drop signal mid-request constantly. Idempotency is the cheapest, most reliable way to make ‘exactly once' true in a world that only really offers ‘at least once'.",
      "Putting the guarantee in the database (a unique key) rather than just in code means even two requests racing at the very same instant can't both win — the database serialises them.",
    ],
    alternatives: [
      { name: "Hope it doesn't happen", note: "Works until the first dropped connection; then it's a double charge and an angry customer." },
      { name: "Check-then-insert in code", note: "‘Does this order exist? No → create it' — but two racing requests can both pass the check. A unique constraint can't be raced." },
      { name: "A distributed lock", note: "Lock the operation so only one runs; heavier machinery, useful when there's no natural unique key." },
    ],
    howWeUse: {
      body: [
        "The `Order` table has a unique `idempotency_key`, so a retried checkout can't create a second order. Loyalty goes further: each `LoyaltyTransaction` carries a key like `earn:order:<id>`, guaranteeing an order credits points exactly once even if processed twice.",
        "You can feel this directly in the Loyalty-ledger simulator: hit ‘Retry last order' and watch the credit be refused.",
      ],
      refs: [
        "schema.prisma — Order.idempotency_key @unique",
        "schema.prisma — LoyaltyTransaction.idempotency_key (e.g. 'earn:order:<id>')",
      ],
    },
    breaks: "Remove the key and let a flaky network retry a payment. The customer is charged twice, two identical orders hit the kitchen, and the loyalty points are doubled — all from one tap that simply got retried. The single unique column is what turns that disaster into a non-event.",
    related: ["transactions", "ledgers", "concurrency"],
  },

  transactions: {
    slug: "transactions",
    title: "Transactions & ACID",
    category: "Concept",
    color: "teal",
    tagline: "All-or-nothing writes — the bedrock of never losing money or orders.",
    oneLiner: "A transaction groups several database writes so they all succeed together or all undo together — there's no half-finished state.",
    what: [
      "Placing an order isn't one write — it's several: the `Order` row, its `OrderItem` rows, the `OrderPayment`. If the server crashed after writing the payment but before the order, you'd have a charge for an order that doesn't exist. A **transaction** prevents that by wrapping the writes so they happen **all-or-nothing**: if any step fails, every step is rolled back and the database looks as if nothing happened.",
      "Databases like Postgres guarantee transactions are **ACID**: **A**tomic (all-or-nothing), **C**onsistent (rules are never left broken), **I**solated (concurrent transactions don't see each other's half-done work), **D**urable (once committed, it survives a crash). Those four letters are why a relational database is trusted with money.",
    ],
    analogy: {
      title: "A wedding vow, not two separate ‘I do's",
      body: "A marriage isn't ‘one person agrees, then later the other'. Both ‘I do's are bound into a single moment — either the marriage happens or it doesn't; there's no state where one is married and the other isn't. A transaction binds the order, its items, and its payment into one all-or-nothing moment the same way.",
    },
    inside: [
      { name: "Begin / commit / rollback", desc: "Start a transaction, then either commit all of it or roll all of it back." },
      { name: "Atomicity", desc: "All the writes land, or none do. No half-orders." },
      { name: "Isolation", desc: "Concurrent transactions don't see each other's unfinished work." },
      { name: "Durability", desc: "Once committed, it's permanent — it survives a power cut a millisecond later." },
    ],
    why: [
      "The moment a system involves money or linked records, partial writes are unacceptable — they create charges without orders, points without purchases, items without parents. Transactions are the standard, decades-proven way to make multi-step writes safe.",
      "They pair with idempotency: idempotency stops the *same* write happening twice; transactions stop a *group* of writes happening halfway.",
    ],
    alternatives: [
      { name: "Separate writes + cleanup jobs", note: "Write each step alone and run a background job to fix inconsistencies; fragile and always racing reality." },
      { name: "Sagas (across services)", note: "When data spans many services with no shared transaction, you coordinate with compensating undo-steps. Powerful, much more complex." },
      { name: "Just don't", note: "Skip them for speed and inherit a database full of impossible half-states. Never worth it for money." },
    ],
    howWeUse: {
      body: [
        "Order placement wraps the `Order`, its `OrderItem`s, and the `OrderPayment` in one Prisma transaction, so a failure anywhere undoes the whole thing — there is no charge without an order, ever. Loyalty earn/spend is written transactionally too, keeping the account balance and its ledger row consistent.",
        "This is the guarantee dramatised in the order-journey simulator and Part 05.",
      ],
      refs: [
        "apps/backend/src/services/  — order creation inside a transaction",
        "schema.prisma — Order / OrderItem / OrderPayment written together",
      ],
    },
    breaks: "Write the steps one by one with no transaction, then have the server hiccup mid-way. Now the payment exists but the order doesn't (a charge for nothing) — or the order exists but the payment doesn't (free food). At scale, isolation failures also let two transactions corrupt each other's half-done work. ACID transactions make every one of those half-states impossible.",
    related: ["postgresql", "idempotency", "ledgers"],
  },

  ledgers: {
    slug: "ledgers",
    title: "Ledgers",
    category: "Concept",
    color: "brand",
    tagline: "Track points and money like a bank: never a bare balance, always a tape of movements.",
    oneLiner: "A ledger records every change as its own immutable row, so the balance is the running total of a history you can always audit.",
    what: [
      "The naïve way to track loyalty points is a single number you add to and subtract from. The problem: when it's wrong, you have no idea *how* it got wrong, can't prove what a customer earned, and can't undo one bad change. A **ledger** fixes this by storing every movement as its own row — a signed amount, a reason, a timestamp — and treating the balance as the *sum of the tape*, not a standalone figure.",
      "Crucially the ledger is **append-only**: you never edit or delete a row, you only add new ones (including a reversal row to ‘undo' an earlier one). That immutability is what makes it trustworthy — the history can't be quietly rewritten.",
      "Your `LoyaltyTransaction` table is a textbook ledger: a `type` (EARN/REDEEM/ADJUST/REVERSAL/EXPIRE), a signed `points`, a `balance_after` snapshot for auditing, a `source`, and an `idempotency_key`.",
    ],
    analogy: {
      title: "A bank statement, not a sticky note",
      body: "Your bank doesn't keep a sticky note that just says ‘₹4,213' and overwrite it. It keeps a statement — every deposit and withdrawal, in order, each with the resulting balance. If something looks off, you read the line that did it. A ledger gives loyalty points that same accountability; a bare number is the sticky note.",
    },
    inside: [
      { name: "Append-only rows", desc: "Every earn/redeem is a new immutable entry; nothing is edited or deleted." },
      { name: "Signed amounts", desc: "`+20` earned, `-30` redeemed — the direction is in the number." },
      { name: "balance_after", desc: "A snapshot of the running total at each row, so any point in history is auditable." },
      { name: "Reversals", desc: "To undo, you append an opposite entry — the original stays as a record." },
    ],
    why: [
      "Anything people care about losing — money, points, inventory — converges on this design, because it's the only one that answers ‘what happened?' Disputes become readable, mistakes become reversible (by appending, not editing), and double-credits are blocked by an idempotency key on each row.",
      "It also pairs with **optimistic concurrency**: the account carries a `version` counter, so two requests trying to spend the same points can't both win — the second notices the version moved and backs off.",
    ],
    alternatives: [
      { name: "A bare balance number", note: "Smaller and simpler — until it's wrong, and then it's unexplainable and unfixable." },
      { name: "Balance + an audit log on the side", note: "Better, but the two can drift; in a true ledger the balance *is* the log, so they can't disagree." },
      { name: "Event sourcing (whole system)", note: "The same idea applied to everything, not just money — maximal auditability, much more machinery." },
    ],
    howWeUse: {
      body: [
        "`LoyaltyTransaction` is the append-only ledger; `LoyaltyAccount` holds the derived `points_balance` plus a `version` for safe concurrent spends and `lifetime_points` that only ever rises (it drives tiers). Earning and redeeming append signed rows with a `balance_after` snapshot and an idempotency key.",
        "The Loyalty-ledger simulator lets you watch the tape grow and try (and fail) to double-credit.",
      ],
      refs: [
        "schema.prisma — LoyaltyTransaction (type, points, balance_after, idempotency_key)",
        "schema.prisma — LoyaltyAccount (points_balance, version, lifetime_points)",
      ],
    },
    breaks: "Keep only a balance and let a bug subtract 30 points twice. The number is now wrong by 30 and there is no record of why, no way to prove the customer's real balance, and no clean way to reverse exactly one bad change. A ledger turns that into a single reversal row appended to an intact history.",
    related: ["idempotency", "transactions", "concurrency"],
  },

  dio: {
    slug: "dio",
    title: "Dio",
    category: "Networking",
    color: "purple",
    tagline: "The app's one network client — every request to the backend goes through it.",
    oneLiner: "Dio is the HTTP client the Flutter app uses; configured once with a base URL and interceptors that run on every single request.",
    what: [
      "The app needs to make HTTP requests — fetch the menu, post an order. **Dio** is the popular Dart library it uses to do that. Rather than each screen writing its own raw network call, the app builds **one** configured Dio client and shares it everywhere (as `apiClientProvider`).",
      "Dio's killer feature is **interceptors**: small pieces of code that run automatically on every request and every response. They're the perfect place for cross-cutting concerns — attaching the auth cookie, adding a request-id for tracing, logging, and retrying on a transient blip — so no screen has to remember to do any of it.",
      "Because there's a single client, changing how *all* networking behaves (a new base URL, a new header, a retry policy) is a one-place edit.",
    ],
    analogy: {
      title: "One mailroom, not everyone posting their own letters",
      body: "Instead of every employee wandering out to post their own letters (and each forgetting the stamp or return address differently), the company has one mailroom. Every letter goes through it, and the mailroom stamps, logs, and addresses each one consistently. Dio + interceptors is that mailroom for the app's requests.",
    },
    inside: [
      { name: "The client", desc: "One configured instance with the base URL, shared via `apiClientProvider`." },
      { name: "Interceptors", desc: "Run on every request/response: attach auth, add a request-id, log, retry." },
      { name: "Base options", desc: "Defaults like the backend URL and timeouts, set once for all calls." },
      { name: "Error handling", desc: "A central place to turn a failed response into a clean, typed error for the UI." },
    ],
    why: [
      "Centralising networking is the same ‘one source of truth' instinct applied to requests: it kills duplicated call-sites and the bugs that come from them (one screen forgets the auth header, another doesn't retry). Interceptors make auth, tracing, and resilience automatic and uniform.",
      "It pairs with the repository pattern: screens ask a repository, the repository uses the shared Dio client, and interceptors handle the invisible plumbing.",
    ],
    alternatives: [
      { name: "http (the basic package)", note: "Dart's simple client; fine for a few calls, but no interceptors — you'd hand-roll auth/retry everywhere." },
      { name: "Chopper / Retrofit", note: "Code-generated typed API clients built on top of Dio/http; more structure, more build tooling." },
      { name: "Raw HttpClient", note: "The lowest level; maximum control, maximum boilerplate." },
    ],
    howWeUse: {
      body: [
        "`apiClientProvider` builds the shared Dio client; interceptors attach the auth cookie and a request-id and handle logging/retries. Repositories take that client (dependency injection) and make their calls through it — no screen ever touches raw networking.",
        "The request-id added here is what lets one order be traced across the backend later (observability, Part 09).",
      ],
      refs: [
        "apps/mobile-app/lib/app/network/api_client_provider.dart",
        "apps/mobile-app/lib/core/api/interceptors/network_interceptors.dart",
      ],
    },
    breaks: "Skip the shared client and let every screen call the network directly. The day you change how auth works or add a retry, you're editing dozens of scattered call-sites and missing some — and a momentary network blip with no retry shows a broken screen for a request that would've succeeded half a second later. One client with interceptors fixes all of it in one place.",
    related: ["flutter", "riverpod", "http-rest"],
  },

  nextjs: {
    slug: "nextjs",
    title: "Next.js & React",
    category: "Web framework",
    color: "pink",
    tagline: "The framework behind the admin panel — and this very learning site.",
    oneLiner: "React builds web UIs from components; Next.js is the full framework around React that adds routing, server rendering, and a build system.",
    what: [
      "**React** is a library for building web interfaces out of **components** — reusable pieces of UI (a button, a table, a form) that describe themselves from data, just like Flutter widgets. You compose small components into pages.",
      "**Next.js** is the framework *around* React that turns it into a complete app: file-based **routing** (a file at `app/users/page.tsx` becomes the `/users` route), **server rendering** (pages can be built on the server for speed and SEO), a build system, and an API layer. The admin panel is a Next.js app; so is this site you're reading.",
      "A key Next idea is **server vs client components**: most of a page can render on the server (fast, no JavaScript shipped), and only the genuinely interactive bits run in the browser. This very page is mostly server-rendered; the sidebar and simulators are client components.",
    ],
    analogy: {
      title: "React is the bricks; Next.js is the house kit",
      body: "React hands you really good bricks (components) but leaves you to figure out plumbing, wiring, and a front door. Next.js is the complete house kit: the same bricks, plus routing (rooms), server rendering (pre-built walls), and a build system (the instructions) — so you get a finished, fast house instead of a pile of excellent bricks.",
    },
    inside: [
      { name: "Components", desc: "Reusable UI pieces that render from props/state — React's core unit." },
      { name: "File-based routing", desc: "`app/<path>/page.tsx` becomes a route automatically." },
      { name: "Server vs client", desc: "Server components render on the server (fast); client components (`\"use client\"`) run in the browser for interactivity." },
      { name: "Build & render modes", desc: "Static, server-rendered, or hybrid — chosen per page for speed." },
    ],
    why: [
      "For an admin panel you want fast pages, real routing, and easy data-loading without hand-building a server — exactly Next.js's sweet spot. React's component model also makes a consistent, reusable UI library straightforward.",
      "Server components mean less JavaScript shipped to the browser, so pages load fast and feel snappy — which is why this learning site renders its dense reading pages on the server and only hydrates the interactive widgets.",
    ],
    alternatives: [
      { name: "Plain React (Vite)", note: "Just the library + a bundler; you add routing and rendering yourself. Lighter, less batteries-included." },
      { name: "Vue / Nuxt, Svelte / SvelteKit", note: "Rival component frameworks with their own full-stack kits; similar ideas, different syntax." },
      { name: "Angular", note: "A heavier, all-in-one framework; more opinionated and verbose than React." },
    ],
    howWeUse: {
      body: [
        "The admin panel is a Next.js app: each admin screen is a route under `app/`, built from React components, talking to the backend's API. Refine sits on top to generate the CRUD screens. This learning site is Next.js too — server-rendered reading pages plus client components for the sidebar, roadmap, and simulators.",
        "The mobile app uses Flutter, not React — but the *idea* (compose UI from small components/widgets) is the same on both sides.",
      ],
      refs: [
        "apps/admin-panel/src/app/  — Next.js routes (users, stores, …)",
        "apps/admin-panel/src/app/layout.tsx  — the Refine + Next shell",
      ],
    },
    breaks: "Render everything as heavy client-side JavaScript (the old single-page-app default) and the admin's first load gets slow and blank until a big bundle downloads and runs. Next.js's server rendering sends a ready-made page first, so it's useful immediately — and ships less JavaScript by keeping non-interactive parts on the server.",
    related: ["refine", "typescript", "riverpod"],
  },

  refine: {
    slug: "refine",
    title: "Refine",
    category: "Admin framework",
    color: "pink",
    tagline: "Generates the admin's CRUD screens so they don't have to be hand-built.",
    oneLiner: "Refine is a React framework that turns ‘here are my resources and how to fetch them' into ready-made list, create, edit, and detail screens.",
    what: [
      "An admin console is mostly the same four screens repeated for every kind of thing: a **list** of items, a **create** form, an **edit** form, and a **detail** view. Developers call this ‘CRUD' — Create, Read, Update, Delete. Hand-coding hundreds of nearly-identical forms is tedious and error-prone.",
      "**Refine** is a React framework that *generates* this scaffolding. You declare your **resources** (products, stores, users) and give it **providers** — a data provider that knows how to talk to your backend's API, and an auth provider that knows how to log in — and Refine wires up consistent CRUD screens, pagination, forms, and routing on top.",
      "It runs inside Next.js, so you get Refine's productivity *and* Next's routing and rendering.",
    ],
    analogy: {
      title: "A label-maker for admin screens",
      body: "Without Refine you'd hand-write the same ‘list / add / edit / view' screen for products, then again for stores, then again for users — slightly differently each time. Refine is a label-maker: tell it the resource and where the data lives, and it stamps out a clean, consistent set of screens every time. Less typing, fewer inconsistencies.",
    },
    inside: [
      { name: "Resources", desc: "The things you administer — products, stores, users — declared once." },
      { name: "Data provider", desc: "The adapter that tells Refine how to read/write your backend's API." },
      { name: "Auth provider", desc: "How login, logout, and ‘who am I' work — wired to the cookie+CSRF auth." },
      { name: "Generated CRUD", desc: "List, create, edit, show screens with forms, tables, and pagination, ready-made." },
    ],
    why: [
      "Refine was chosen to get a real, consistent admin console *fast* without hand-coding repetitive forms. Because every resource flows through the same data and auth providers, behaviour (and security) is uniform across the whole panel.",
      "It's also flexible: where a screen needs something bespoke, you drop down to plain React/Next — so you're never boxed in by the generator.",
    ],
    alternatives: [
      { name: "Build screens by hand", note: "Total control; enormous repetition and the bugs that come with copy-paste forms." },
      { name: "React-Admin", note: "The most established CRUD framework; similar idea, different conventions and ecosystem." },
      { name: "A hosted admin (Retool, etc.)", note: "Fastest to start, but your admin lives in someone else's tool and pricing." },
    ],
    howWeUse: {
      body: [
        "The admin panel declares resources (stores, users, catalogue, content) and a data provider pointing at the backend's `/api/v1` admin routes, plus an auth provider using the httpOnly cookie + CSRF flow. Refine then renders the list/create/edit/show screens staff use to run the business.",
        "Those writes land in the same database the customer app reads — the live-control trick of Part 06.",
      ],
      refs: [
        "apps/admin-panel/src/app/layout.tsx  — Refine setup (providers, resources)",
        "apps/admin-panel/src/app/{stores,users}/  — generated CRUD screens",
      ],
    },
    breaks: "Hand-build forty bespoke CRUD screens and watch them drift: this list paginates, that one doesn't; this form validates, that one forgets; one screen skips the CSRF header and quietly breaks. A single framework with shared data/auth providers keeps every screen consistent — and consistently secure.",
    related: ["nextjs", "auth", "admin-panel"],
  },

  sql: {
    slug: "sql",
    title: "SQL & indexes",
    category: "Database",
    color: "teal",
    tagline: "The language for asking the database questions — and the trick that keeps answers instant.",
    oneLiner: "SQL is how you query a relational database; an index is the pre-sorted lookup that makes those queries fast even over millions of rows.",
    what: [
      "**SQL** (Structured Query Language) is the language for talking to a relational database like Postgres. You *describe what you want* and the database figures out how to get it: `SELECT * FROM \"Order\" WHERE store_id = '...' AND status = 'PLACED'` means ‘give me this store's placed orders'. `JOIN` stitches linked tables together (an order with its items); `INSERT`, `UPDATE`, `DELETE` change data.",
      "By default, finding rows means scanning the whole table — fine for a hundred rows, ruinous for ten million. An **index** is a pre-sorted structure (think the index at the back of a book) that lets the database jump straight to matching rows instead of reading every page.",
      "You usually don't hand-write this SQL — Prisma generates it from your code — but knowing what's happening underneath is what lets you reason about speed.",
    ],
    analogy: {
      title: "The index at the back of the book",
      body: "Want every mention of ‘transactions' in a 900-page book? Without an index you read all 900 pages. With the index, you flip to one line and jump straight to pages 41, 205, 388. A database index is literally that: the difference between scanning everything and jumping to the answer.",
    },
    inside: [
      { name: "SELECT … WHERE", desc: "Read rows that match a condition — the everyday query." },
      { name: "JOIN", desc: "Combine linked tables: an order together with its items and user." },
      { name: "INSERT / UPDATE / DELETE", desc: "The writes — create, change, remove rows." },
      { name: "Indexes", desc: "Pre-sorted lookups on chosen columns that turn a full scan into a jump." },
    ],
    why: [
      "SQL is declarative — you say *what*, not *how* — so the database's query planner can pick the fastest path, use indexes, and adapt as data grows, without you rewriting queries. It's a decades-proven, universal language for exactly this.",
      "Indexes are the single biggest lever for query speed. Your schema adds them deliberately on the columns real queries filter by, so the app stays fast as the orders table grows.",
    ],
    alternatives: [
      { name: "NoSQL query styles", note: "Document/key-value stores use their own query models; great for some shapes, weaker at ad-hoc joins SQL does easily." },
      { name: "Raw scans / in-app filtering", note: "Pull everything and filter in code — fine for tiny data, catastrophic at scale." },
      { name: "Hand-tuned SQL vs an ORM", note: "Raw SQL gives control; Prisma generates safe SQL for you. Most apps mix: ORM for the 95%, raw SQL for the hot 5%." },
    ],
    howWeUse: {
      body: [
        "Prisma turns code like `prisma.order.findMany({ where: { store_id, status } })` into SQL against Postgres. The schema declares indexes — e.g. `@@index([store_id, status])` on `Order` and `@@index([account_id, created_at])` on the loyalty ledger — so the queries that matter stay instant.",
        "That ‘this store's pending orders' lookup the admin runs constantly is fast precisely because of that composite index.",
      ],
      refs: [
        "schema.prisma — @@index([store_id, status]) on Order",
        "schema.prisma — @@index([account_id, created_at]) on LoyaltyTransaction",
      ],
    },
    breaks: "Drop the indexes and the queries still *work* — they just get slower every day as data grows, until ‘show this store's orders' takes seconds and the admin grinds to a halt under load. Worse, missing indexes often look fine in testing (small data) and only bite in production. Adding the right index turns a full-table scan back into an instant jump.",
    related: ["postgresql", "prisma", "caching"],
  },

  "realtime-sync": {
    slug: "realtime-sync",
    title: "Live sync (SSE)",
    category: "Realtime",
    color: "blue",
    tagline: "How an admin's change shows up on screens without anyone hitting refresh.",
    oneLiner: "Server-Sent Events let the backend push a little ‘something changed' nudge to connected clients, so the UI updates live.",
    what: [
      "Normally the app only learns things by *asking* (an HTTP request). But sometimes the server needs to tell clients ‘something just changed' — an admin updated the menu, an order's status advanced. **Server-Sent Events (SSE)** is a simple way to do that: the client opens one long-lived connection and the server *pushes* small event messages down it whenever there's news.",
      "It's one-directional (server → client) and rides ordinary HTTP, which makes it lightweight and easy compared to a full two-way WebSocket. Perfect for ‘broadcast a nudge', not for chat.",
      "Your backend has a `sync.service` that broadcasts these events; clients listening on the stream react — typically by re-fetching the now-changed data.",
    ],
    analogy: {
      title: "A radio station, not a phone call",
      body: "Polling is calling the shop every minute to ask ‘any news?'. SSE is leaving the radio on: the station (server) broadcasts an announcement only when there's actually something to say, and every tuned-in client hears it at once. One open channel, updates only when they matter.",
    },
    inside: [
      { name: "The event stream", desc: "One long-lived HTTP connection the server keeps open to push messages." },
      { name: "Events", desc: "Small typed messages — ‘menu changed', ‘config changed' — broadcast to listeners." },
      { name: "The sync service", desc: "Backend code that decides what changed and pushes the nudge." },
      { name: "Client reaction", desc: "On an event, the client re-fetches the affected data and the UI updates live." },
    ],
    why: [
      "For admin-driven content, ‘change it and it's live' is the whole promise — and waiting for the next poll, or asking the user to refresh, breaks the magic. SSE delivers near-instant updates with far less complexity than WebSockets, and reuses your existing HTTP/auth.",
      "It keeps the model simple: the server still owns the truth and just *signals* change; clients re-read through the same API they always use, so there's no second source of data to keep consistent.",
    ],
    alternatives: [
      { name: "Polling", note: "Ask every N seconds. Dead simple, but laggy and wasteful — lots of ‘nothing changed' requests." },
      { name: "WebSockets", note: "Full two-way real-time channel; more powerful (chat, live cursors) and more to operate. Overkill for one-way nudges." },
      { name: "Push notifications", note: "For reaching a closed app on the device; a different tool than in-app live updates." },
    ],
    howWeUse: {
      body: [
        "The backend's `sync.service` broadcasts change events over an SSE stream set up in `app.ts`. When an admin edits content or config, connected clients get a nudge and re-fetch — so the change appears live without a manual refresh.",
        "This is the real-time half of the admin story (Part 06): the admin writes, a sync event fires, and screens update themselves.",
      ],
      refs: [
        "apps/backend/src/services/sync.service.ts  — broadcasts change events",
        "apps/backend/src/app.ts  — the SSE stream endpoint",
      ],
    },
    breaks: "Without live sync you're back to polling or manual refresh: an admin drops a price, but customers keep seeing the old menu until their app happens to re-fetch — and the ‘instant control' promise quietly dies. (You must still invalidate caches on change, or even a re-fetch returns the stale value — see Caching.)",
    related: ["http-rest", "caching", "nextjs"],
  },

  "state-machines": {
    slug: "state-machines",
    title: "State machines",
    category: "Concept",
    color: "amber",
    tagline: "An order is always in exactly one known state, and only some moves are legal.",
    oneLiner: "A state machine restricts a thing to a fixed set of states and only the allowed transitions between them — so ‘impossible' situations can't occur.",
    what: [
      "Some things move through a defined lifecycle. An order is `PENDING_PAYMENT`, then `PLACED`, `PREPARING`, `OUT_FOR_DELIVERY`, `DELIVERED`, `COMPLETED` — or `CANCELLED`. A **state machine** models exactly this: a fixed list of **states**, and a fixed list of **allowed transitions** between them.",
      "The power is in what it *forbids*. An order can't jump from `DELIVERED` back to `PREPARING`, and it's never in two states at once or some vague in-between. By only permitting legal moves, a whole category of corrupt situations becomes impossible by design.",
      "Your `OrderStatus` is precisely this set of states, and every move is recorded in an append-only `OrderEvent` log stamped with who made it.",
    ],
    analogy: {
      title: "A board game, not a free-for-all",
      body: "In a board game you can't teleport your piece anywhere — the rules say which squares you may move to from where you are. A state machine is those rules for your data: from ‘preparing' you may go to ‘out for delivery', but not back to ‘pending payment'. The rulebook makes illegal moves simply impossible.",
    },
    inside: [
      { name: "States", desc: "The fixed set a thing can be in: the `OrderStatus` values." },
      { name: "Transitions", desc: "The allowed moves between states; everything else is rejected." },
      { name: "Events / triggers", desc: "What causes a move — payment confirmed, kitchen done, driver delivered." },
      { name: "History log", desc: "An append-only record (`OrderEvent`) of every transition and who caused it." },
    ],
    why: [
      "Modelling a lifecycle as explicit states + legal transitions prevents the messy ‘flag soup' alternative (a pile of booleans like `isPaid`, `isShipped` that can contradict each other). With one state field, the order is never in a contradictory condition.",
      "The transition log doubles as an audit trail: you can replay an order's entire history and know exactly who moved it, when — invaluable for disputes and debugging.",
    ],
    alternatives: [
      { name: "Boolean flags", note: "`isPaid`, `isDelivered`… — they can combine into impossible states (delivered but not paid). The bug source a state machine removes." },
      { name: "A status string with no rules", note: "One field, but any value can be set to any other — you lose the ‘only legal moves' guarantee." },
      { name: "Workflow engines", note: "For very complex, long-running processes you might use a dedicated engine; overkill for an order's handful of states." },
    ],
    howWeUse: {
      body: [
        "`OrderStatus` is the enum of states; transitions advance an order along its lifecycle, and each move appends an `OrderEvent` with an `actor` (customer / admin / system / pos). That log is the order's auditable history.",
        "The order-journey simulator walks these states; Part 08 covers them in depth.",
      ],
      refs: [
        "schema.prisma — enum OrderStatus { PENDING_PAYMENT … COMPLETED, CANCELLED }",
        "schema.prisma — OrderEvent (status, actor, note) — the transition log",
      ],
    },
    breaks: "Replace the state machine with loose booleans and you'll eventually produce an order that's `delivered` but `not paid`, or `cancelled` yet still `preparing` — contradictions no one intended and everyone has to clean up. One state field with enforced transitions makes those contradictions unrepresentable.",
    related: ["ledgers", "transactions", "idempotency"],
  },

  caching: {
    slug: "caching",
    title: "Caching",
    category: "Concept",
    color: "blue",
    tagline: "Compute the answer once, serve it many times — and the hard part: knowing when it's stale.",
    oneLiner: "A cache keeps a ready-made copy of a costly-to-produce answer (like the menu) so most requests are served instantly instead of recomputed.",
    what: [
      "Some answers are expensive to produce and rarely change — the menu, for instance, is read constantly but edited occasionally. **Caching** means keeping a ready copy of that answer close by, so the vast majority of requests are served from the copy instead of hitting the database every time.",
      "Caches live at several layers: in the backend's memory, in a shared fast store like **Redis** that all backend copies share, and — for images and assets — in a **CDN**, a network of servers near your customers around the world.",
      "The genuinely hard part isn't *storing* the cache, it's **invalidation**: knowing when the cached copy is out of date and must be thrown away. ‘There are only two hard things in computer science: naming things, and cache invalidation.'",
    ],
    analogy: {
      title: "Specials written on the board",
      body: "A waiter doesn't sprint to the kitchen to ask the price of fries for every table — it's chalked on the board (the cache), instantly readable. But the moment the chef changes the price, someone must wipe and rewrite the board, or customers get charged yesterday's price. Writing the board is easy; remembering to wipe it (invalidation) is the hard, important part.",
    },
    inside: [
      { name: "In-memory cache", desc: "Fastest, lives inside one backend process; lost on restart and not shared." },
      { name: "Shared cache (Redis)", desc: "A fast store all backend copies read, so they agree on the cached value." },
      { name: "CDN", desc: "Caches images/assets on servers near the user for instant, global delivery." },
      { name: "Invalidation", desc: "Throwing away a stale copy when the underlying data changes — the hard part." },
    ],
    why: [
      "Caching is the highest-leverage speed-and-cost win available: it turns repeated expensive work into a single computation served thousands of times, slashing both latency and database load. For read-heavy data like a menu, it's transformational.",
      "But it's added *deliberately and late* (Part 09), because every cache introduces the risk of serving stale data — so you only take that on when a real measurement says you need the speed.",
    ],
    alternatives: [
      { name: "No cache", note: "Always fresh, never stale — but every read pays full price. Right until traffic makes it too slow." },
      { name: "Short time-to-live (TTL)", note: "Auto-expire cached copies after N seconds; simple, but accepts up to N seconds of staleness." },
      { name: "Explicit invalidation", note: "Drop the cache the instant data changes; freshest, but you must wire every change to its invalidation." },
    ],
    howWeUse: {
      body: [
        "The menu and config are the natural cache candidates — read constantly, changed occasionally from the admin. The discipline that makes it safe: when an admin edits a price (Part 06), the cached menu must be invalidated so the next read recomputes the fresh value, and a live-sync event nudges clients to re-fetch.",
        "This is a scale layer (Part 09): added around an already-correct design, not baked in from day one.",
      ],
      refs: [
        "Concept layer — applied to /api/v1/menu and config reads",
        "Pairs with: admin writes (Part 06) → invalidate → live-sync nudge",
      ],
    },
    breaks: "Cache the menu but forget to invalidate it. An admin drops a price; the cache keeps cheerfully serving the old one for hours; customers see — and pay — last week's price. Stale caches are subtle because everything *looks* fast and fine. Wiring every change to its invalidation is what keeps ‘fast' from quietly becoming ‘wrong'.",
    related: ["realtime-sync", "sql", "concurrency"],
  },

  concurrency: {
    slug: "concurrency",
    title: "Concurrency & races",
    category: "Concept",
    color: "purple",
    tagline: "What happens when two requests touch the same thing at the same instant.",
    oneLiner: "Concurrency is many things happening at once; a race condition is the bug where two of them collide on the same data and corrupt it.",
    what: [
      "A backend serves many users at the same time — that's **concurrency**, and it's essential for performance. The danger is the **race condition**: two requests read the same value, both act on it, and one silently clobbers the other. Classic example: an account has 100 points; two ‘spend 80' requests both read 100, both think there's enough, and both succeed — now the balance is -60.",
      "The fixes share one idea: make the conflicting step *atomic* (indivisible). **Optimistic concurrency** adds a `version` number to a row; you only write if the version is unchanged since you read it, so the second writer notices someone moved first and retries. **Conditional updates** push the check into the database (‘subtract 80 *only if* balance ≥ 80'). **Locks** make others wait. The database, being the single serialisation point, is where these guarantees are made.",
    ],
    analogy: {
      title: "Two hands grabbing the last cookie",
      body: "Two people see one cookie left and both reach for it. If nothing coordinates them, both ‘take' it and you've given away a cookie you don't have. A version check is like numbering the plate: the second hand sees the number changed (someone already took it) and pulls back. The cookie is given out exactly once.",
    },
    inside: [
      { name: "Race condition", desc: "Two operations interleave on the same data and produce a wrong result." },
      { name: "Optimistic concurrency", desc: "A `version` column; write only if it hasn't changed since you read — else retry." },
      { name: "Conditional update", desc: "Push the check into the write itself: ‘decrement only if ≥ amount'." },
      { name: "Locks", desc: "Make one operation wait for another to finish; safe, but can slow things down." },
    ],
    why: [
      "On anything shared and valuable — points, stock, balances — races aren't rare edge cases; under real traffic they happen constantly. Handling them is the difference between a balance you can trust and one that mysteriously goes negative.",
      "Optimistic concurrency is preferred here because conflicts are *rare*: you don't pay the cost of locking on every request, you just detect the occasional collision and retry. It keeps the common path fast.",
    ],
    alternatives: [
      { name: "Ignore it", note: "Works in testing (one user at a time); breaks in production the first time two requests collide." },
      { name: "Pessimistic locks", note: "Lock the row before reading so no one else can touch it. Always-safe, but slower and can deadlock." },
      { name: "Single-threaded queue", note: "Funnel conflicting operations through one worker so they can't overlap. Simple, limits throughput." },
    ],
    howWeUse: {
      body: [
        "The `LoyaltyAccount` carries a `version` counter for optimistic concurrency, and the balance is kept `>= 0` by conditional updates — so two requests trying to spend the same points can't both win; the second is rejected and the balance never goes negative. Idempotency keys handle the related ‘same request twice' problem.",
        "These guarantees ultimately rest on the database serialising writes — the same backbone that powers transactions.",
      ],
      refs: [
        "schema.prisma — LoyaltyAccount.version (optimistic concurrency)",
        "schema.prisma — points_balance kept >= 0 by conditional updates",
      ],
    },
    breaks: "Ignore concurrency and let two ‘redeem points' requests land together. Both read the old balance, both pass the ‘enough points?' check, both write — and the customer spends points they didn't have, or a discount applies twice. A version check or conditional update makes the second one notice the collision and fail cleanly, so value is never conjured from a race.",
    related: ["idempotency", "transactions", "ledgers"],
  },

  // ───────────────────────────── THE WIDER STACK ─────────────────────────────
  docker: {
    slug: "docker",
    title: "Docker & containers",
    category: "DevOps",
    color: "blue",
    tagline: "Pack an app and everything it needs into one sealed box that runs identically everywhere.",
    oneLiner: "A container is your app plus its exact environment, frozen into an image that runs the same on your laptop, a teammate's, and production.",
    what: [
      "'Works on my machine' fails because your laptop isn't the server — different OS, library versions, settings. A **container** fixes this by bundling your app together with the exact runtime, libraries, and config it needs into one **image** that runs identically anywhere a container engine exists.",
      "**Docker** is the tool that builds these images (from a `Dockerfile` recipe) and runs them as containers. Unlike a full virtual machine, a container shares the host's OS kernel, so it's tiny and starts in milliseconds, not minutes.",
    ],
    analogy: {
      title: "A shipping container, not loose cargo",
      body: "Before standardized steel shipping containers, loading a ship meant hand-stacking odd-shaped cargo that broke and didn't fit. The container changed the world: any box fits any ship, crane, and truck. A software container does the same — your app is sealed in a standard box any host can run, no matter what's inside.",
    },
    inside: [
      { name: "Image", desc: "A frozen, read-only snapshot of your app + its environment, built in layers." },
      { name: "Dockerfile", desc: "The recipe: base image, copy code, install deps, the start command." },
      { name: "Container", desc: "A running instance of an image — isolated, disposable, fast to start." },
      { name: "Registry", desc: "Where images are stored & shared (Docker Hub, GHCR) so prod pulls the exact image you built." },
    ],
    why: [
      "Containers make the environment **part of the artifact**, so the thing you tested is byte-for-byte the thing that runs in production — killing a whole class of 'it worked locally' bugs. They're also the unit that orchestrators like Kubernetes schedule and scale.",
      "Versus a full VM: containers share the host kernel, so they're far lighter (MBs not GBs) and start instantly — you can run dozens on one machine.",
    ],
    alternatives: [
      { name: "Virtual machines", note: "Stronger isolation (own kernel) but heavy and slow to boot; containers are the modern default for app packaging." },
      { name: "Buildpacks / Nixpacks", note: "Auto-detect and build an image with no hand-written Dockerfile — convenient, less control." },
      { name: "Deploy raw source", note: "Let the host install deps at deploy time — simple, but reintroduces 'works on my machine' drift." },
    ],
    breaks: "Bake a secret or a host-specific path into an image and it leaks or breaks elsewhere. Forget to pin versions in your Dockerfile and a rebuild months later silently pulls newer, incompatible deps — the image is no longer reproducible. Treat images as immutable, version-pinned, and secret-free, and inject config via environment variables at run time.",
    related: ["ci-cd", "cloud"],
  },

  "ci-cd": {
    slug: "ci-cd",
    title: "CI/CD",
    category: "DevOps",
    color: "amber",
    tagline: "Automatically test every change and ship it — so broken code is caught before users see it, and releasing is boring.",
    oneLiner: "CI runs your tests on every push; CD deploys what passed — turning 'release day' into a non-event that happens many times a day.",
    what: [
      "**CI (Continuous Integration)** means every code change is automatically built and tested the moment it's pushed, so problems surface in minutes — not weeks later when everything's tangled together. **CD (Continuous Delivery/Deployment)** takes the changes that passed and automatically ships them to staging or production.",
      "Concretely it's a **pipeline** — a sequence of steps (install → lint → test → build → deploy) defined in a file (GitHub Actions, GitLab CI) that runs on a fresh machine for every push or pull request.",
    ],
    analogy: {
      title: "A factory line with quality gates",
      body: "Instead of one person hand-assembling and hoping it works, the product moves down a line where each station checks it and rejects defects automatically. Nothing reaches the customer without passing every gate — and because it's automated, you can run it hundreds of times a day.",
    },
    inside: [
      { name: "Trigger", desc: "What starts the pipeline — a push, a pull request, a tag, a schedule." },
      { name: "Stages / jobs", desc: "install → lint → test → build → deploy, each able to fail the run." },
      { name: "Runner", desc: "A fresh, clean machine that executes the steps — reproducible every time." },
      { name: "Gates & environments", desc: "'Tests must pass to merge', and promotion staging → prod." },
    ],
    why: [
      "The longer a bug lives, the more expensive it is. CI catches it within minutes of being written, when it's cheap to fix and the author still remembers the change. CD makes releases small and frequent, so each is low-risk and easy to roll back — the opposite of a scary quarterly 'big bang'.",
      "It also removes humans from the repetitive, error-prone parts (running tests, building, deploying), so those happen the same way every time.",
    ],
    alternatives: [
      { name: "Manual testing + deploys", note: "Works at tiny scale; becomes a bottleneck and a 'forgot to run the tests' incident source as the team grows." },
      { name: "Continuous Delivery (vs Deployment)", note: "Auto-deploy to staging but require a human click for production — a common, safe middle ground." },
    ],
    breaks: "A flaky or slow test suite is the silent killer: people start ignoring red builds or skipping CI, and the safety net rots. Deploy without a migration step and code hits a database missing a column. Keep tests fast and reliable, gate merges on green, and make schema changes part of the pipeline.",
    related: ["docker", "deployment"],
  },

  observability: {
    slug: "observability",
    title: "Observability",
    category: "Operations",
    color: "teal",
    tagline: "Seeing what your running system is actually doing — so you find problems before your users tell you.",
    oneLiner: "Logs, metrics, and traces working together to answer 'what's happening, where, and why' in a live system you can't put under a microscope.",
    what: [
      "At ten users you watch the terminal. At a million you can't — you need **observability**: the ability to ask new questions about a running system from the data it emits. Three pillars: **logs** (timestamped events: 'order 8f3 failed'), **metrics** (numbers over time: latency, error rate, requests/sec), and **traces** (one request's full journey across services).",
      "The goal isn't just dashboards — it's answering a question you didn't anticipate ('why are payments slow only in Mumbai after 9pm?') from data you're already collecting.",
    ],
    analogy: {
      title: "The cockpit and black box of a plane",
      body: "A pilot can't see the engine, so the cockpit shows live gauges (metrics), warning messages (logs), and a flight recorder that reconstructs exactly what happened (traces). Observability is that instrumentation for software — you fly the system by its readouts, not by staring at the engine.",
    },
    inside: [
      { name: "Logs", desc: "Discrete timestamped events — best for 'what exactly happened here'." },
      { name: "Metrics", desc: "Cheap numeric time-series — best for 'is it healthy' and alerting." },
      { name: "Traces", desc: "One request followed across services via a shared request-id — best for 'where's the slow part'." },
      { name: "Alerts & SLOs", desc: "Rules that page a human when a metric crosses a user-experience threshold." },
    ],
    why: [
      "You can't fix what you can't see. Without observability an outage is a frantic guessing game; with it you follow the evidence to the cause in minutes. The pillars complement: metrics say *something*'s wrong, traces say *where*, logs say *what*.",
      "It also catches slow degradations (a leak, creeping latency) before they become outages — the difference between proactive and reactive operations.",
    ],
    alternatives: [
      { name: "Just logging", note: "Logs alone are noisy and expensive to search at scale; metrics and traces make the haystack navigable." },
      { name: "Monitoring (the older term)", note: "Watching known dashboards for known problems; observability adds answering *unknown* questions after the fact." },
    ],
    breaks: "Log everything and you drown in noise and a huge bill; log too little and you're blind during the one incident that matters. No request-id and a trace can't be stitched across services. Alert on everything and people tune out (alert fatigue). The craft is signal over volume: structured logs, alerts tied to user-facing SLOs, and a request-id on every call.",
    related: ["ci-cd", "concurrency"],
  },

  cloud: {
    slug: "cloud",
    title: "The cloud",
    category: "Cloud",
    color: "blue",
    tagline: "Renting someone else's always-on computers — and the managed services on top — instead of owning the hardware.",
    oneLiner: "Computers in someone else's data center that you rent by the minute, plus higher-level services (databases, queues, storage) you rent instead of running yourself.",
    what: [
      "A **server** is a computer that runs all the time to answer requests. **The cloud** means renting those computers from a provider (AWS, Google Cloud, Azure, Vercel) instead of buying and racking your own — paying for what you use, scaling up or down on demand.",
      "The real power is the **managed services** layered on top: instead of installing and babysitting a database, a queue, or a load balancer, you rent one the provider operates, patches, and scales for you.",
    ],
    analogy: {
      title: "Renting the power grid, not owning a generator",
      body: "You don't run a diesel generator in your basement — you plug into the grid and pay for the electricity you use. The cloud is the grid for computing: tap as much compute, storage, and bandwidth as you need, when you need it, without owning the plant.",
    },
    inside: [
      { name: "Compute", desc: "Where code runs: virtual machines, containers, or serverless functions." },
      { name: "Storage", desc: "Object storage (S3) for files, block storage for disks, plus CDNs near users." },
      { name: "Managed data & messaging", desc: "Databases, caches, and queues you rent instead of operating." },
      { name: "Regions & availability zones", desc: "Physical locations; spreading across zones survives a data-center failure." },
    ],
    why: [
      "Owning servers means huge upfront cost, capacity you must guess in advance, and a team to run them. The cloud turns that into pay-as-you-go: start tiny, scale instantly for a spike, and never touch hardware. Managed services let a small team run systems that used to need a whole ops department.",
      "The trade is cost at very large scale and lock-in to a provider's APIs — which is why some big companies repatriate workloads or stay multi-cloud.",
    ],
    alternatives: [
      { name: "On-premise (own hardware)", note: "Full control and predictable cost at huge scale; heavy capital and ops burden." },
      { name: "Serverless / PaaS (Vercel, Lambda)", note: "Rent at an even higher level — just deploy code; less control, fastest to ship." },
      { name: "Hybrid / multi-cloud", note: "Mix owned + rented, or several providers, to balance cost, risk, and lock-in." },
    ],
    breaks: "Pay-per-use cuts both ways: a misconfigured autoscaler or an infinite loop can run up a massive bill overnight. Putting everything in one availability zone means one data-center outage takes you down. Leaning on provider-specific services deepens lock-in. Guardrails: budgets and alerts, multi-zone deployment, and keeping the truly portable parts portable.",
    related: ["docker", "deployment"],
  },

  embeddings: {
    slug: "embeddings",
    title: "Embeddings & vector search",
    category: "AI / ML",
    color: "purple",
    tagline: "Turning text (or images) into lists of numbers so a computer can measure meaning by distance.",
    oneLiner: "An embedding is a vector — a long list of numbers — that places text in 'meaning space', where similar things sit close together, enabling search by meaning instead of keywords.",
    what: [
      "Computers compare numbers, not meaning. An **embedding model** converts text into a **vector** (say, 1,536 numbers) positioned so that texts with similar meaning land near each other in that high-dimensional space. 'dog' and 'puppy' end up close; 'dog' and 'invoice' end up far apart.",
      "Once everything is a vector, **semantic search** is just geometry: embed the query, find the nearest vectors. This is the engine behind search-by-meaning, recommendations, and **RAG** (feeding an LLM the most relevant documents).",
    ],
    analogy: {
      title: "A map where related ideas are neighbors",
      body: "Imagine a giant map where every sentence is a pin, placed so pins about the same idea cluster together — all the 'refund policy' sentences in one neighborhood, all the 'shipping' ones in another. To answer a question, you drop a pin for it and read the pins nearby. Embeddings build that map automatically.",
    },
    inside: [
      { name: "Embedding model", desc: "A neural network that maps text → a fixed-length vector capturing meaning." },
      { name: "Vector", desc: "The list of numbers (the coordinates) for one piece of text." },
      { name: "Similarity metric", desc: "Cosine similarity / distance — how 'close' two vectors are in meaning." },
      { name: "Vector database", desc: "A store (pgvector, Pinecone, FAISS) that finds nearest vectors fast at scale." },
    ],
    why: [
      "Keyword search misses meaning: it can't tell that 'how do I get my money back' matches a doc titled 'Refunds'. Embeddings capture meaning, so search finds the right thing even with different words. They're also the bridge that lets LLMs use *your* private, up-to-date data (RAG) rather than only what they were trained on.",
      "Compared to training a custom model, embeddings + search are cheap, fast, and update instantly — just embed new documents and add them.",
    ],
    alternatives: [
      { name: "Keyword / TF-IDF search", note: "Fast, transparent, no model needed (this site's assistant uses it) — but blind to synonyms and meaning." },
      { name: "Fine-tuning an LLM on your data", note: "Bakes knowledge into the model; expensive and slow to update, vs. embeddings you refresh instantly." },
    ],
    breaks: "Embeddings are only as good as the model and the chunking: split documents badly and the right answer never surfaces. They're also a black box — hard to explain *why* two things were judged similar. And at scale a brute-force nearest-neighbor search is too slow, so you need an approximate vector index (trading a little accuracy for speed). Match the model to your domain, chunk thoughtfully, and measure retrieval quality.",
    related: ["rag"],
  },

  kubernetes: {
    slug: "kubernetes",
    title: "Kubernetes",
    category: "DevOps",
    color: "blue",
    tagline: "The manager for many containers — it runs them, heals them, and scales them so you don't babysit servers.",
    oneLiner: "Kubernetes keeps the right number of your containers running across a fleet of machines, restarting failures and scaling on demand — you declare the goal, it makes it true.",
    what: [
      "A single container is great, but production needs many copies across many machines, restarted when they crash, replaced on deploy, and scaled with load. Doing that by hand is impossible. **Kubernetes** (k8s) is the **orchestrator** that does it for you.",
      "You don't tell it *how* — you declare the **desired state** ('I want 5 replicas of this image, reachable here'), and Kubernetes continuously makes reality match: starting and stopping containers, replacing dead ones, and rolling out new versions without downtime.",
    ],
    analogy: {
      title: "An air-traffic controller for containers",
      body: "You don't fly each plane yourself — a controller tracks every aircraft, assigns runways, reroutes around failures, and keeps the whole airspace flowing. Kubernetes is that controller for your containers: you say what you want in the sky, it handles the constant adjustments.",
    },
    inside: [
      { name: "Pod", desc: "The smallest unit — one (or a few tightly-coupled) containers that run together." },
      { name: "Deployment", desc: "Declares 'keep N copies of this version running'; handles rollouts and rollbacks." },
      { name: "Service", desc: "A stable address that load-balances across the pods behind it." },
      { name: "Control loop", desc: "Controllers constantly compare desired vs actual state and fix the difference." },
    ],
    why: [
      "Kubernetes turns 'operate a fleet of servers' into 'declare what you want'. It self-heals (restarts crashes), scales (adds replicas under load), and deploys without downtime (rolling updates) — capabilities that used to need a large ops team. The same manifests also run on any cloud.",
      "The cost is real complexity — it's a powerful, intricate system. For a small app, a simpler platform (Vercel, a single container host) is often the wiser choice until you actually need fleet-scale orchestration.",
    ],
    alternatives: [
      { name: "Managed platforms (Vercel, Render, Fly)", note: "Hide orchestration entirely — just deploy; far simpler, less control, great until you outgrow them." },
      { name: "Docker Compose / Swarm", note: "Lighter multi-container orchestration for small setups; less powerful than k8s." },
      { name: "Serverless", note: "No servers or containers to manage at all — a different model with different limits." },
    ],
    breaks: "Kubernetes' power is a foot-gun: a misconfigured resource limit can starve or OOM-kill your pods, a bad readiness probe can take all traffic down, and the learning curve means small teams drown in YAML. The honest rule: adopt it when you genuinely have many services and a team to run it — not because it's fashionable.",
    related: ["docker", "cloud"],
  },

  rag: {
    slug: "rag",
    title: "RAG — grounding an LLM",
    category: "AI / ML",
    color: "purple",
    tagline: "Give an LLM your own, up-to-date documents to answer from — instead of relying only on what it memorized in training.",
    oneLiner: "Retrieval-Augmented Generation: search your documents for the most relevant chunks, hand them to the LLM as context, and have it answer grounded in those real sources.",
    what: [
      "An LLM only knows what it saw in training — it can't know your private docs, and it 'hallucinates' confident wrong answers when it doesn't know. **RAG (Retrieval-Augmented Generation)** fixes this: before answering, you **retrieve** the most relevant pieces of your own knowledge base and feed them to the model as context, so it answers from real sources.",
      "The pipeline: chunk your documents → (often) embed them into vectors → on a question, find the closest chunks → put them into the prompt → the LLM synthesizes a grounded answer. This very site's assistant is a small RAG: it searches an in-repo index and grounds the answer in the matching content.",
    ],
    analogy: {
      title: "An open-book exam, not a memory test",
      body: "A closed-book exam forces you to recall everything (and bluff when you forget). An open-book exam lets you look up the relevant page first, then answer accurately. RAG turns the LLM's closed-book test into an open-book one — it reads the right page before it writes.",
    },
    inside: [
      { name: "Chunking", desc: "Splitting documents into retrievable pieces — too big and retrieval is fuzzy, too small and context is lost." },
      { name: "Retrieval", desc: "Finding the most relevant chunks for a query — by keywords (TF-IDF) or meaning (embeddings)." },
      { name: "Augmentation", desc: "Injecting those chunks into the prompt as 'context to answer from'." },
      { name: "Generation", desc: "The LLM synthesizes a grounded answer, ideally citing its sources." },
    ],
    why: [
      "RAG is how you make an LLM useful on *your* data without the cost and staleness of fine-tuning. Update a document and the next answer reflects it instantly — no retraining. It also reduces hallucination (the model has the facts in front of it) and lets you show sources, which builds trust.",
      "Versus fine-tuning: RAG keeps knowledge external and fresh; fine-tuning bakes behaviour/style into the model. They solve different problems and are often combined.",
    ],
    alternatives: [
      { name: "Fine-tuning", note: "Train the model on your data — great for style/format, expensive and slow to update with new facts." },
      { name: "Long context (stuff it all in)", note: "Paste all docs into the prompt; simple but hits token limits and cost, and dilutes relevance." },
      { name: "Plain prompting", note: "Just ask the model; fine for general knowledge, blind to your private/current data." },
    ],
    breaks: "RAG is only as good as retrieval: if the search returns the wrong chunks, the model confidently answers from the wrong context (garbage in, garbage out). Bad chunking, a weak embedding model, or no relevance filtering all surface as 'it sounds right but it's wrong.' The fixes: measure retrieval quality, chunk thoughtfully, and tell the model to say 'I don't know' when the context is thin.",
    related: ["embeddings"],
  },

  rendering: {
    slug: "rendering",
    title: "Rendering — CSR · SSR · SSG · ISR",
    category: "Web",
    color: "blue",
    tagline: "Where a web page gets built — in the browser, on the server, or ahead of time — and the trade-offs of each.",
    oneLiner: "CSR, SSR, SSG, and ISR are four answers to 'who assembles the HTML, and when' — trading off first-paint speed, freshness, and server cost.",
    what: [
      "A web page's HTML has to be built somewhere. The four common strategies: **CSR (Client-Side Rendering)** — send a near-empty page + JavaScript and let the browser build it; **SSR (Server-Side Rendering)** — the server builds fresh HTML on each request; **SSG (Static Site Generation)** — build all pages once at deploy time and serve the files; **ISR (Incremental Static Regeneration)** — static, but quietly re-built in the background every so often.",
      "Modern frameworks like Next.js let you choose **per page**, because the right answer depends on whether the content is the same for everyone (static) or personalized/changing (server), and how much an instant first paint matters.",
    ],
    analogy: {
      title: "Cooked to order vs a buffet vs a meal kit",
      body: "SSR is cooking each dish to order (always fresh, but the kitchen works on every request). SSG is a buffet laid out in advance (instant to serve, prepared once). CSR is shipping a meal kit the diner assembles at the table (light to send, but they wait while it's built). You pick per dish.",
    },
    inside: [
      { name: "CSR", desc: "Browser builds the page from JS. Great for highly-interactive apps; slower first paint, weaker SEO." },
      { name: "SSR", desc: "Server builds HTML per request. Fresh + good SEO; more server work per visit." },
      { name: "SSG", desc: "Pages built at deploy, served as static files. Fastest + cheapest; can go stale." },
      { name: "ISR", desc: "Static, but regenerated in the background on a schedule — fresh-ish without per-request cost." },
    ],
    why: [
      "The choice is about three tensions: **first-paint speed** (static wins), **freshness/personalization** (server wins), and **cost** (static is nearly free; server scales with traffic). Choosing per page lets a marketing page be static and instant while a dashboard is server-rendered and personalized.",
      "It also affects SEO: crawlers see full HTML from SSR/SSG immediately, whereas pure CSR can hide content behind JavaScript until it runs.",
    ],
    alternatives: [
      { name: "Pick one globally", note: "Simpler mental model, but forces compromises — a static blog and a live dashboard want different things." },
      { name: "Streaming / partial hydration", note: "Newer hybrids send HTML progressively and hydrate only the interactive bits — best of both, more complexity." },
    ],
    breaks: "Server-render everything and a traffic spike hammers your servers (and your bill) rebuilding the same page millions of times. Statically generate a page that needs to be fresh and users see stale prices. Lean fully on CSR and the first visit is a blank white screen until a big JS bundle loads — bad for slow phones and SEO. Match the strategy to each page's freshness and interactivity needs.",
    related: ["nextjs", "caching"],
  },

  // ───────────────────────── SCALE, SECURITY & OPS ─────────────────────────
  "rate-limiting": {
    slug: "rate-limiting",
    title: "Rate limiting",
    category: "Backend",
    color: "amber",
    tagline: "Capping how fast anyone can hit your API, so no single client can flood it.",
    oneLiner: "Rate limiting puts a ceiling on requests per client per window — protecting the system from abuse, runaway bugs, and accidental stampedes.",
    what: [
      "A **rate limit** is a rule like ‘at most 100 requests per minute from one client'. Go over it and the server replies `429 Too Many Requests` and asks you to slow down. It's the bouncer counting how fast people come through the door.",
      "Without it, one buggy app stuck in a retry loop — or one attacker — can send thousands of requests a second and starve everyone else, or run up a huge bill. The limit makes load **predictable**.",
      "Limits are keyed by something that identifies the caller: an API key, a user id, or an IP address. Each key gets its own budget.",
    ],
    analogy: {
      title: "The buffet counter",
      body: "A buffet doesn't stop you eating — it just refills a fixed tray at a steady pace so one person can't clear it and leave nothing for the queue. A rate limit refills your ‘tray' of requests steadily; take too much too fast and you wait for the next refill.",
    },
    insideTitle: "How the budget is counted",
    inside: [
      { name: "Fixed window", desc: "Count requests per clock minute. Simple, but a burst at the boundary can briefly double the rate." },
      { name: "Sliding window", desc: "A rolling count over the last N seconds — smoother, with no boundary spikes." },
      { name: "Token bucket", desc: "A bucket refills at a steady rate; each request spends a token. Allows short bursts, then throttles. The common choice." },
      { name: "429 + Retry-After", desc: "The polite ‘slow down' response, telling a client exactly how long to wait." },
    ],
    how: [
      "On each request the server looks up the caller's counter (usually in a fast shared store like **Redis**, so all server copies agree), checks whether budget is left, decrements it, and either serves the request or returns `429`.",
      "Because the counter must be shared across every backend copy, rate limiting almost always lives in a central place — an API gateway or a Redis-backed middleware — not in each server's local memory.",
      "Good limiters return headers like `X-RateLimit-Remaining` and `Retry-After`, so well-behaved clients back off on their own instead of guessing.",
    ],
    why: [
      "The alternative — trusting clients to be reasonable — fails the moment one isn't. A single retry storm, a scraping bot, or a misconfigured cron job can take the whole service down for everyone. A limit turns ‘outage' into ‘that one client gets throttled'.",
      "It also protects cost and fairness: paid tiers get higher budgets, abuse gets a low one, and capacity planning becomes possible because the maximum load per client is known.",
    ],
    alternatives: [
      { name: "Quotas (per day/month)", note: "Longer-window budgets for billing and fair use, layered on top of per-second limits." },
      { name: "Load shedding", note: "Under extreme load, drop low-priority requests entirely rather than rate-limit per client." },
      { name: "Concurrency limits", note: "Cap simultaneous in-flight requests instead of rate — good for protecting a slow backend." },
    ],
    breaks: "Set the limit in each server's local memory and it silently multiplies: with 5 servers behind a load balancer, a ‘100/min' limit becomes 500/min, because each server counts only its own share. Set it too low and you throttle real users on a busy day. Forget the `Retry-After` header and clients hammer you the instant they're blocked, making the overload worse. Shared state and a sensible budget are everything.",
    scale: "At small scale a simple in-process counter is fine. As you add server copies you must move the counter to a shared store (Redis). At very large scale, limiting moves to the edge — a CDN or API gateway rejects floods before they reach your servers — and budgets become distributed, each node enforcing a slice of the global limit.",
    related: ["caching", "observability", "kubernetes", "auth"],
  },

  "message-queues": {
    slug: "message-queues",
    title: "Message queues",
    category: "System Design",
    color: "pink",
    tagline: "Handing slow or risky work to a line of messages, so the user never waits for it.",
    oneLiner: "A message queue lets one part of the system drop a job and reply instantly, while a separate worker does the slow work later — decoupling speed from reliability.",
    what: [
      "A **queue** is a line of messages. Instead of doing a slow job inside the request (sending an email, notifying the kitchen), the backend writes a short message — ‘send receipt for order 42' — onto the queue and immediately tells the user ‘done'. A separate **worker** picks it up and does the real work.",
      "This **decouples** the fast path (answering the user) from the slow path (the actual work). The user's screen doesn't freeze waiting for an email server on the other side of the world.",
      "Queues also add **durability**: if the worker is down, messages wait safely in line instead of being lost, and get processed when it comes back.",
    ],
    analogy: {
      title: "The kitchen ticket rail",
      body: "When you order, the waiter doesn't stand at your table until the food is cooked — they clip a ticket on the rail and move on. The kitchen works through tickets at its own pace. If a cook steps away, tickets wait; nothing is forgotten. A message queue is that ticket rail for software.",
    },
    insideTitle: "The moving parts",
    inside: [
      { name: "Producer", desc: "Whoever puts a message on the queue — here, the backend after taking an order." },
      { name: "Broker", desc: "The queue itself (RabbitMQ, SQS, Kafka). It stores messages reliably until they're handled." },
      { name: "Consumer / worker", desc: "A separate process that pulls messages, does the slow work, then acknowledges them." },
      { name: "Ack & dead-letter", desc: "A message is removed only once the worker confirms success; repeat failures go to a dead-letter queue." },
    ],
    how: [
      "The producer publishes a message and returns immediately. The broker holds it durably. A worker subscribes, receives the message, does the work, and sends an **acknowledgement** — only then does the broker delete it.",
      "If the worker crashes mid-job, no ack arrives, so the broker re-delivers the message to another worker. This is why queue jobs must be **idempotent**: they might run more than once.",
      "Messages that keep failing are moved to a **dead-letter queue** for inspection, so one poison message doesn't block the line forever.",
    ],
    why: [
      "The alternative — doing everything synchronously inside the request — means the user waits for the slowest external thing, and a single downstream outage (the email provider) takes your checkout down with it. A queue absorbs spikes and survives outages.",
      "It also smooths load: a flood of orders becomes a long queue the workers drain steadily, instead of a thundering herd hitting a fragile downstream service all at once (**backpressure**).",
    ],
    alternatives: [
      { name: "Do it synchronously", note: "Simplest, fine for fast critical work — but couples your speed and uptime to every dependency." },
      { name: "Event streaming (Kafka)", note: "A durable log many consumers can replay — better for analytics and event-sourcing than a simple job queue." },
      { name: "Cron / scheduled jobs", note: "For work that's periodic rather than triggered by an event." },
    ],
    breaks: "Forget that messages can be delivered twice and a retried ‘charge card' job double-charges the customer — queues demand idempotency. Let workers fall behind without monitoring and the queue grows for hours; users wonder why their receipt never arrived. Skip the dead-letter queue and one malformed message blocks everything behind it. A queue gives reliability only if the worker expects repeats and failures.",
    scale: "At small scale you may not need a queue at all. As external work and traffic grow, a queue decouples and protects you. At large scale you run many workers in parallel (scaled independently of web servers), partition the queue by topic, and use streaming logs (Kafka) so fulfilment, analytics, and notifications each consume the same order events independently.",
    related: ["idempotency", "concurrency", "kubernetes", "observability"],
  },

  sharding: {
    slug: "sharding",
    title: "Sharding & replication",
    category: "Databases",
    color: "teal",
    tagline: "Splitting and copying a database so it can hold more data and survive failures.",
    oneLiner: "Replication makes copies of your data for safety and read speed; sharding splits it across machines so no single one has to hold it all.",
    what: [
      "A single database server has limits — disk, memory, and queries per second. Two techniques push past them. **Replication** keeps full copies of the database in sync. **Sharding** splits the data into pieces, each on a different machine.",
      "**Replication** gives you read scaling and safety: many *replicas* answer read queries, and if the primary dies, a replica is promoted to take over. Writes still go to one primary.",
      "**Sharding** gives you write and storage scaling: the User table might split so users A–M live on shard 1 and N–Z on shard 2. No single machine holds everything, so you grow by adding shards.",
    ],
    analogy: {
      title: "Library branches and photocopies",
      body: "Replication is photocopying the whole library so more people can read at once and a fire in one building doesn't lose the books. Sharding is splitting the collection across branches — fiction here, science there — so no single building has to be impossibly large. Big systems do both.",
    },
    insideTitle: "The pieces",
    inside: [
      { name: "Primary & replicas", desc: "One writable primary; read-only replicas kept in sync, ready to be promoted if it fails." },
      { name: "Shard key", desc: "The column that decides which shard a row lives on (user id, region). Choosing it well is everything." },
      { name: "Routing layer", desc: "Reads the shard key and sends each query to the right shard." },
      { name: "Rebalancing", desc: "Moving data when you add shards — the hard, risky part of growing." },
    ],
    how: [
      "For replication, every write to the primary is streamed to the replicas, which apply it to stay in sync. Reads spread across replicas; the primary is freed for writes. A small lag means replicas can be a moment behind — **eventual consistency**.",
      "For sharding, a routing layer computes the shard from the shard key (often a hash of the user id) and forwards the query. A query needing data from many shards (a global report) must fan out and combine results — far slower and more complex.",
      "Pick a shard key that spreads load evenly and keeps related data together, so most queries hit a single shard.",
    ],
    why: [
      "The alternative — one ever-bigger machine (**vertical scaling**) — eventually hits a hard ceiling and a single point of failure. Replication removes the single point of failure for reads; sharding removes the storage and write ceiling.",
      "Most systems reach for replication first (simpler, solves reads + availability) and only shard when one machine genuinely can't hold the data or absorb the writes — because sharding adds real complexity.",
    ],
    alternatives: [
      { name: "Vertical scaling", note: "Just buy a bigger box. Simplest, works surprisingly far, but has a ceiling and one failure domain." },
      { name: "Caching + read replicas", note: "Often removes the need to shard entirely by taking read load off the primary." },
      { name: "NoSQL stores", note: "Cassandra/DynamoDB shard automatically by design — at the cost of some relational guarantees." },
    ],
    breaks: "Choose a bad shard key and you get a **hot shard**: shard orders by date and today's shard takes all the writes while the rest sit idle. Cross-shard queries and transactions become slow and awkward — a join that was trivial now spans machines. Rebalancing a live, sharded database without downtime is one of the hardest jobs in infrastructure. Shard only when you must, and pick the key with great care.",
    scale: "10 users: one database, no replicas. Thousands: add read replicas and a cache to take read load off the primary. Millions with heavy writes: shard by a well-chosen key and accept cross-shard complexity. Planet-scale: globally distributed shards placed near users, with deliberate consistency trade-offs (CAP) on every cross-region operation.",
    related: ["sql", "postgresql", "caching", "transactions"],
  },

  "cloud-compute": {
    slug: "cloud-compute",
    title: "Cloud compute — VMs, containers, serverless",
    category: "Cloud",
    color: "blue",
    tagline: "The three ways to rent someone else's computers to run your code.",
    oneLiner: "From a whole rented machine (VM) to a sealed box (container) to just-a-function (serverless), cloud compute trades control for convenience — pick by how much you want to manage.",
    what: [
      "‘The cloud' is renting computers by the second instead of owning them. There are three main shapes, from most hands-on to least. A **virtual machine (VM)** is a whole simulated computer you rent and manage — you install everything on it.",
      "A **container** packs just your app and its dependencies into a sealed box that runs identically anywhere; many containers share one machine, so they're lighter and faster to start than VMs. (This is Docker; Kubernetes runs many of them.)",
      "**Serverless** (functions) goes furthest: you upload a function and the cloud runs it on demand, scaling to zero when idle and billing per call. There's still a server — you just never see or manage it.",
    ],
    analogy: {
      title: "House, apartment, hotel room",
      body: "A VM is renting a whole house — total control, but you maintain everything. A container is an apartment — your own sealed space, but the building (the host machine) is shared and managed. Serverless is a hotel room booked by the night — bring nothing, pay only for what you use, walk away when done.",
    },
    insideTitle: "The trade-offs at a glance",
    inside: [
      { name: "VM", desc: "Full control of the OS; you patch, scale and secure it. Heaviest to run, slowest to start." },
      { name: "Container", desc: "Just your app + deps, sealed and portable. Fast to start, dense, the modern default." },
      { name: "Serverless", desc: "Just a function. Scales to zero, pay-per-call — but cold starts and time limits apply." },
      { name: "Managed services", desc: "Rent the database/queue/cache itself, so you don't run it at all." },
    ],
    how: [
      "With VMs you choose a size (CPU/RAM), boot an image, and own everything on it — like a real server, just rented. **Autoscaling groups** add or remove VMs as load changes.",
      "With containers you build an image once and an orchestrator (Kubernetes) schedules copies across a pool of machines, restarting and scaling them automatically.",
      "With serverless the platform keeps your function dormant until a request arrives, spins up an instance (a brief **cold start**), runs it, and tears it down — so an idle app costs nothing.",
    ],
    why: [
      "The choice is about how much undifferentiated heavy lifting you want to own. VMs maximise control and suit legacy or specialised workloads. Containers are the sweet spot for most services: portable, dense, orchestratable. Serverless is unbeatable for spiky or occasional work where paying for idle servers is wasteful.",
      "Owning physical servers (the old way) means buying for peak load and eating the cost when idle. Renting flips that — you pay for what you use and grow in seconds, not procurement cycles.",
    ],
    alternatives: [
      { name: "On-prem / bare metal", note: "Own the hardware. Cheapest at huge steady scale and maximal control, but you carry all the ops and capital cost." },
      { name: "Platform-as-a-Service", note: "Push code, the platform runs it (Heroku-style). Less control than containers, less work than VMs." },
    ],
    breaks: "Run everything on always-on VMs sized for peak traffic and you pay for idle capacity most of the day. Go all-in on serverless for a high-traffic, latency-sensitive service and cold starts and per-call costs bite. Treat containers as magic and forget that a crashing container restarts forever unless you watch it. Each model has a workload it's wrong for — match the shape to the traffic pattern.",
    scale: "A side project runs cheaply on serverless or one small VM. A growing product standardises on containers + an orchestrator for portability and steady scaling. At massive scale you blend all three — containers for services, serverless for bursty glue, managed services for data — across multiple regions, optimising relentlessly for cost.",
    related: ["cloud", "docker", "kubernetes", "ci-cd"],
  },

  "web-security": {
    slug: "web-security",
    title: "Web security — XSS, SQLi, SSRF",
    category: "Security",
    color: "pink",
    tagline: "The classic ways web apps get broken — and the one habit that stops most of them.",
    oneLiner: "Most web attacks come from trusting input that should never be trusted; the fix is to treat all input as data, never as code.",
    what: [
      "Almost every web vulnerability is a version of the same mistake: **mixing untrusted input with trusted commands.** Three classics show the pattern. **XSS (Cross-Site Scripting)** sneaks attacker JavaScript into a page so it runs in other users' browsers — stealing logins or defacing the page.",
      "**SQL injection (SQLi)** smuggles database commands into an input field. Build a query by gluing strings — `\"SELECT * FROM users WHERE name = '\" + input + \"'\"` — and an attacker types `' OR '1'='1` to read the whole table.",
      "**SSRF (Server-Side Request Forgery)** tricks your *server* into making requests it shouldn't — fetching an internal-only admin URL or cloud metadata endpoint — because it blindly trusted a user-supplied address.",
      "The thread through all three: the system confused *data the user gave* with *instructions to execute*.",
    ],
    analogy: {
      title: "The forged note to the kitchen",
      body: "Imagine a waiter who copies the customer's words straight onto the kitchen order without thinking. A customer writes ‘one burger — AND give me everything in the safe'. A careless kitchen obeys. The fix isn't a smarter cook; it's a rule that customer words are always an order for *food*, never instructions to staff. That rule — input is data, not commands — stops injection everywhere.",
    },
    insideTitle: "The defences",
    inside: [
      { name: "Escape output (XSS)", desc: "Render user text as text, never as HTML/JS. A strict Content-Security-Policy is the backstop." },
      { name: "Parameterised queries (SQLi)", desc: "Send the query and the values separately, so input can never become SQL. ORMs like Prisma do this for you." },
      { name: "Allow-lists (SSRF)", desc: "Only let the server fetch approved destinations; block internal IPs and metadata endpoints." },
      { name: "Validate input", desc: "Reject anything that doesn't match the expected shape at the edge, before it reaches anything sensitive." },
    ],
    how: [
      "The unifying defence is **separation of data and code.** For SQL, parameterised queries hand the database the command and the values down separate channels, so `' OR '1'='1` is treated as a literal name, not logic.",
      "For XSS, frameworks escape interpolated text by default, turning `<script>` into harmless characters; a Content-Security-Policy then refuses to run any script the page didn't explicitly allow.",
      "For SSRF, the server validates and allow-lists any URL it's asked to fetch, and blocks requests to internal networks and cloud metadata addresses.",
    ],
    why: [
      "These defences are cheap and the attacks are devastating — a single SQLi can leak every customer record; one stored XSS can hijack every visitor. ‘Treat input as data' costs almost nothing and removes whole categories of bug at once.",
      "The alternative — trying to ‘clean' dangerous input by stripping bad characters (a blocklist) — is a losing game; attackers always find an encoding you forgot. Allow-listing and separating data from code are robust by design.",
    ],
    alternatives: [
      { name: "Blocklist filtering", note: "Trying to strip ‘bad' input. Brittle and bypassable — prefer parameterisation and escaping." },
      { name: "A Web Application Firewall", note: "A useful extra net that blocks known attack patterns, but never a substitute for fixing the code." },
    ],
    breaks: "Build one SQL query with string concatenation and your entire user table is one crafted input away from being dumped. Render one comment as raw HTML and an attacker's script runs in every reader's browser, stealing sessions. Let your server fetch any URL a user supplies and it may hand back your cloud's secret credentials. The damage is total and the fix is a habit: never let input become code.",
    scale: "For a small app, parameterised queries, output escaping, and input validation cover the vast majority of risk. As you grow, add a Content-Security-Policy, security headers, dependency scanning, and least-privilege access so a breach in one place can't reach everything. At enterprise scale: threat modelling, regular pen-tests, secret rotation, and a WAF — but the foundation never changes: trust no input.",
    related: ["auth", "sql", "http-rest", "observability"],
  },

  // ─────────────────────────── COMPUTING FROM SCRATCH ───────────────────────────
  "what-is-a-program": {
    slug: "what-is-a-program",
    title: "What a program is",
    category: "Foundations",
    color: "blue",
    tagline: "Underneath every app you've ever used is the same thing: a list of instructions.",
    oneLiner: "A program is a precise list of instructions a computer follows, one at a time, exactly — no more, no less.",
    what: [
      "Strip away the screens and the magic and a **program** is just a list of instructions, written down, that a computer carries out in order. The computer is breathtakingly fast and breathtakingly literal: it does *exactly* what the instructions say — even when that's not what you meant.",
      "Those instructions are written in a **programming language** — a set of words and rules precise enough that there's no ambiguity. English is too fuzzy (‘clean the room' means a hundred things); a program has to spell out every step.",
      "When you ‘run' a program, the computer starts at the first instruction and works down, sometimes looping back or branching depending on conditions. That's it. Everything else — apps, games, websites, AI — is built from this one idea, stacked very high.",
    ],
    analogy: {
      title: "A recipe, followed by someone with no common sense",
      body: "A program is a recipe followed by a cook who is impossibly fast but has zero common sense. Say ‘add salt' without saying how much and they tip in the whole box. Forget ‘turn off the oven' and it burns. The skill of programming is writing instructions so complete and precise that even a literal-minded machine can't get them wrong.",
    },
    insideTitle: "The handful of ideas every program is built from",
    inside: [
      { name: "Instructions", desc: "The individual steps — do this, then this. Run top to bottom." },
      { name: "Conditions (if)", desc: "‘If this is true, do that' — how a program makes a decision." },
      { name: "Loops", desc: "‘Repeat this until done' — handling many things without writing each one out." },
      { name: "Input & output", desc: "What it reads (a tap, a file) and what it produces (a screen, a saved order)." },
    ],
    how: [
      "You write instructions as source code. The computer reads them in order, keeps track of where it is, and follows each one. **Conditions** let it choose a path (‘if the cart is empty, show a message'); **loops** let it repeat (‘for each item, add up the price').",
      "Most useful programs spend their time reacting to **input** — a tap, a network request — doing a little work, and producing **output**. The order app you're learning from is millions of these tiny instructions, triggered by your taps.",
    ],
    why: [
      "Why be this literal and precise? Because a computer has no judgement. Precision is the price of a machine that never tires, never improvises, and runs billions of these steps a second. The rigidity that makes programming hard is the same rigidity that makes computers reliable.",
    ],
    breaks: "The classic beginner's shock: the program does *exactly* what you wrote, not what you intended. Tell it to charge ‘the price' but forget to multiply by quantity, and every customer pays for a single burger no matter how many they ordered — forever, without complaint, until someone notices. The computer won't catch your mistake; it has no idea what you wanted.",
    related: ["variables-and-memory", "how-code-runs", "dart"],
  },

  "variables-and-memory": {
    slug: "variables-and-memory",
    title: "Variables & memory",
    category: "Foundations",
    color: "blue",
    tagline: "Where a program keeps the things it's thinking about right now.",
    oneLiner: "A variable is a labelled box in the computer's memory that holds one value your program can read and change.",
    what: [
      "While a program runs it needs to remember things — a total, a name, whether the user is logged in. It keeps them in **memory** (RAM): a vast wall of tiny numbered slots the computer can read and write in an instant.",
      "A **variable** is a friendly name for one of those slots. Instead of ‘slot #4,891,233' you write `cartTotal`, and the language remembers which slot that is. You can read it (`cartTotal`) and change it (`cartTotal = 250`).",
      "Memory is **fast but temporary** — it's wiped when the program stops or the phone restarts. That's the crucial difference from a **database**, which remembers permanently. Variables are a scratchpad; the database is the filing cabinet.",
    ],
    analogy: {
      title: "Labelled boxes on a desk",
      body: "Picture a desk covered in labelled boxes. ‘cartTotal' holds a number; ‘userName' holds some text. You can peek inside a box (read) or swap its contents (write). When you leave for the day (the program ends), the desk is cleared. Anything you need tomorrow must go in the filing cabinet — the database — before you go.",
    },
    insideTitle: "What makes up a variable",
    inside: [
      { name: "Value", desc: "What's currently in the box — a number, text, true/false, a list." },
      { name: "Name", desc: "The label you gave it, so you and the code can find it again." },
      { name: "Type", desc: "What kind of thing it holds — a number behaves differently from text." },
      { name: "Scope", desc: "Where in the program the box exists. Most are cleared away when their little job finishes." },
    ],
    how: [
      "When you declare a variable, the language reserves a slot in memory and points your name at it. Reading the name fetches the value; assigning overwrites it. Simple — but it's the basis of all the state a program holds while it runs.",
      "Variables have **types** — a number, text, true/false, or a structured object like an `Order`. The type tells the computer how to store it and what you may do with it (you can multiply numbers, not sentences).",
    ],
    why: [
      "Without named variables you'd juggle raw memory addresses — unreadable and unmaintainable. Names turn memory into something humans can reason about. And keeping ‘right now' data in fast memory (not the database) is what makes apps feel instant; you only pay the slow cost of saving when something must persist.",
    ],
    breaks: "Confuse the scratchpad with the filing cabinet and you get the saddest bug: the user adds ten items, the app holds them in memory, the phone dies — and the cart is gone, because nothing was ever written to the database. Or two parts of the app keep their own `cartTotal` and drift apart. Knowing what lives in memory versus what's saved — and keeping one source of truth — is half of getting software right.",
    related: ["what-is-a-program", "how-code-runs", "sql"],
  },

  "how-code-runs": {
    slug: "how-code-runs",
    title: "How code runs",
    category: "Foundations",
    color: "blue",
    tagline: "The journey from the text you type to something a computer can actually do.",
    oneLiner: "Computers don't understand your code directly — it's first translated into the simple numeric instructions a processor executes.",
    what: [
      "You write code in a human-friendly language, but a processor only understands **machine code** — bare numeric instructions like ‘add these two slots', ‘jump to here'. Something has to bridge that gap.",
      "There are two main ways. A **compiler** translates your whole program into machine code *ahead of time*, producing something the computer runs directly and fast. An **interpreter** reads and runs your code *line by line, as it goes* — slower, but flexible and quick to start.",
      "Many modern systems blend the two (‘just-in-time'): they start by interpreting, then compile the hot parts for speed. Dart does exactly this — interpreted while you develop (instant hot reload), compiled to native code when you ship.",
    ],
    analogy: {
      title: "Two kinds of translator",
      body: "Imagine giving a speech to an audience that speaks another language. A **compiler** is a translator who takes your whole script the night before and hands out a printed translation — fast to read, but you can't change a word on stage. An **interpreter** stands beside you translating sentence by sentence — you can improvise, but it's slower. Computers use both tricks to run your code.",
    },
    insideTitle: "The pieces of the journey",
    inside: [
      { name: "Source code", desc: "The text you write, in a language made for humans." },
      { name: "Compiler", desc: "Translates the whole program to machine code ahead of time. Fast to run." },
      { name: "Interpreter", desc: "Runs your code line by line as it reads it. Flexible, quick to start." },
      { name: "Machine code", desc: "The bare numeric instructions the processor actually executes." },
    ],
    how: [
      "A compiler reads your source, checks it for errors, and emits machine code (or an intermediate form). Mistakes are caught **before** the program ever runs — at your desk. An interpreter executes as it reads, so some errors only surface when that line happens to run.",
      "This is why a typed, compiled language can refuse to build code with a mistake (great for catching bugs early), while a purely interpreted one is more forgiving but lets some bugs reach the user. Your TypeScript backend literally has a compile step (`tsc`) that turns it into the JavaScript Node actually runs.",
    ],
    why: [
      "The trade is **speed and safety vs flexibility and quickness-to-start**. Compiling ahead of time gives you fast, checked programs — ideal for shipping. Interpreting gives instant feedback while developing. Knowing which is happening explains a lot: why some errors appear instantly and others only in production, and why ‘it builds' is a real milestone.",
    ],
    breaks: "Assume the computer grasps your intent and you'll be baffled when a tiny typo stops the whole program from building — the compiler can't run code it can't translate. Or, in an interpreted language, a mistake hides on a rarely-run line for months until the day it executes in front of a customer. Understanding the translation step tells you *when* your mistakes will be caught.",
    related: ["what-is-a-program", "variables-and-memory", "typescript"],
  },

  // ───────────────────────── BREADTH: MOBILE / CLOUD / AI ─────────────────────────
  "offline-first": {
    slug: "offline-first",
    title: "Offline-first & sync",
    category: "Mobile",
    color: "purple",
    tagline: "Building an app that still works when the network doesn't.",
    oneLiner: "Offline-first treats the network as an unreliable luxury: the app reads and writes locally first, then syncs when it can.",
    what: [
      "Phones lose signal — in lifts, on trains, in dead zones. An **offline-first** app is built so that losing the network is a non-event: it keeps working from a local copy of the data and quietly catches up with the server later.",
      "The core move is a **local store** on the device (a small database or cache). The app reads from it instantly and writes to it immediately, so the screen never waits on a flaky connection. A background **sync** reconciles local changes with the server when a connection returns.",
      "This flips the usual assumption. A naive app treats the server as the source of truth for every action; an offline-first app treats the *device* as good enough for now and the server as eventually-authoritative.",
    ],
    analogy: {
      title: "Writing in your own notebook first",
      body: "Imagine a courier who jots every delivery in a pocket notebook the moment it happens, even with no signal. Later, back in range, they sync the notebook to head office. They never stand frozen waiting for a signal bar — they record locally and reconcile later. That's offline-first.",
    },
    insideTitle: "What it takes",
    inside: [
      { name: "Local store", desc: "An on-device database/cache the app reads and writes instantly." },
      { name: "Sync engine", desc: "Pushes local changes up and pulls server changes down when online." },
      { name: "Conflict resolution", desc: "A rule for when the same thing changed in two places — last-write-wins, merge, or ask." },
      { name: "Pending-write queue", desc: "Actions taken offline, held until they can be sent — and made idempotent so retries are safe." },
    ],
    how: [
      "Reads hit the local store first (instant), optionally refreshing from the server in the background. Writes go to the local store immediately and onto a **pending queue**. When connectivity returns, the sync engine drains the queue to the server and pulls down anything that changed elsewhere.",
      "Because a queued write may be sent more than once (retries, app restarts), each must be **idempotent** — the server recognises a repeat and doesn't double-apply it. Conflicts (the item changed on the server too) are settled by a chosen policy.",
    ],
    why: [
      "The alternative — blocking every action on a live request — produces an app that spins, freezes, and loses work the instant the signal drops. For anything used on the move, offline-first is the difference between ‘usable' and ‘useless in a tunnel'.",
      "It also makes the happy path feel *faster*: reads and writes are local and instant, and the network cost is paid in the background, off the critical path.",
    ],
    breaks: "Skip conflict handling and two devices editing the same record silently clobber each other — last writer wins, the other's work vanishes. Forget idempotency and a queued ‘place order' replays on reconnect, charging twice. Let the local store and server drift without a clear source-of-truth rule and the user sees different data on different devices. Offline-first is powerful but demands you take sync and conflicts seriously.",
    scale: "A simple app might cache reads and queue a few writes. As it grows you need real conflict resolution, partial sync (don't pull everything), and schema versioning so old offline clients can't corrupt new data. At large scale this becomes its own discipline — CRDTs and sync engines that merge concurrent edits mathematically.",
    related: ["riverpod", "idempotency", "caching", "dio"],
  },

  "object-storage-cdn": {
    slug: "object-storage-cdn",
    title: "Object storage & CDNs",
    category: "Cloud",
    color: "blue",
    tagline: "Where the world's files live — and how they reach users fast.",
    oneLiner: "Object storage holds files cheaply and durably by key; a CDN caches copies of them near users so they load fast everywhere.",
    what: [
      "Databases are the wrong place for big files — images, video, backups, PDFs. Those go in **object storage** (like Amazon S3): cheap, effectively unlimited storage where each file is an ‘object' addressed by a **key** (a path-like name). Put a file in by key, get it back by key. Not a filesystem, not a database — a giant, durable key→file store.",
      "But a file in one data centre is slow for users on the other side of the planet. A **CDN (Content Delivery Network)** fixes that: it keeps cached copies of your files on servers all over the world, so each user is served from one nearby — cutting latency dramatically.",
      "Together they're how nearly every site delivers static assets: store once in object storage, serve everywhere via a CDN.",
    ],
    analogy: {
      title: "The warehouse and the local shops",
      body: "Object storage is one enormous central warehouse holding every item cheaply and reliably, each on a labelled shelf (the key). A CDN is the network of local shops that keep copies of the popular items on hand, so customers don't wait for delivery from the warehouse. Most requests are served from the nearby shop; the warehouse stays the source of truth.",
    },
    insideTitle: "The pieces",
    inside: [
      { name: "Object & key", desc: "A file plus its address (e.g. images/burger-42.jpg). Get and put by key." },
      { name: "Buckets", desc: "Top-level containers that group objects and set access rules." },
      { name: "Edge cache (CDN)", desc: "Servers worldwide holding cached copies, serving the nearest user." },
      { name: "Cache headers & TTL", desc: "Tell the CDN how long it may reuse a copy before re-checking the origin." },
    ],
    how: [
      "You upload files to a bucket in object storage; each gets a URL. You point a CDN at that storage as its **origin**. The first time a user in a region requests a file, the CDN fetches it from the origin and caches it at the nearby **edge**; everyone after is served the cached copy — fast, without touching your origin.",
      "Cache headers (and a TTL) control freshness. Change a file and you either wait for the TTL or explicitly **invalidate** the CDN's copy. A common trick: put a version or hash in the filename, so a new file is simply a new URL the CDN has never cached.",
    ],
    why: [
      "Storing files in your database bloats it, slows backups, and costs far more than object storage. Serving them from a single region makes distant users wait. Object storage + CDN is cheaper, faster, and scales to huge traffic because the CDN absorbs the load your origin would otherwise take.",
      "It improves resilience too: the CDN keeps serving cached assets even if your origin has a hiccup.",
    ],
    breaks: "Serve a file with a long cache time and then change it in place — users keep getting the old version for hours, because the CDN still has it (classic cache-invalidation pain). Make a private bucket public by accident and you've leaked data to the whole internet. Forget that the CDN caches by URL and you'll wonder why nobody sees your update. Versioned filenames and careful cache headers are the cure.",
    scale: "A small site might serve a few images straight from object storage. As traffic grows, a CDN becomes essential to keep latency low and origin load down. At global scale you tune cache strategy per asset type, use signed URLs for private content, and lean on the CDN for the vast majority of traffic so the origin barely works.",
    related: ["cloud", "cloud-compute", "caching", "rendering"],
  },

  "neural-networks": {
    slug: "neural-networks",
    title: "What a neural network computes",
    category: "AI / ML",
    color: "purple",
    tagline: "Underneath the AI hype is a stack of multiply-add-and-bend, repeated.",
    oneLiner: "A neural network is a big function that turns numbers into numbers by multiplying, adding and bending — and 'learning' is just nudging those numbers until its answers improve.",
    what: [
      "Strip away the mystique and a **neural network** is a mathematical function: numbers go in (an image as pixels, text as numbers), numbers come out (a label, a probability, the next word). In between it repeatedly multiplies the inputs by **weights**, adds them up, and passes the result through a simple bending function (an **activation**) that lets it represent more than straight lines.",
      "Stack many such layers and the network can represent astonishingly complex relationships. The **weights** are the knobs — millions or billions of them — and they start random and meaningless.",
      "‘**Training**' is the process of nudging those weights. Show the network an example, compare its answer to the right one, and adjust every weight a tiny bit in the direction that would have made the answer better (**gradient descent**, via **backpropagation**). Do that across millions of examples and the random knobs settle into something that works.",
    ],
    analogy: {
      title: "A mixing desk with a million knobs",
      body: "Picture a giant audio mixing desk with a million knobs, fed by a teacher with perfect ears. At first the knobs are random and the output is noise. Each example, the teacher says ‘a little more of this, a little less of that', turning every knob a hair toward a better sound. After millions of rounds the desk produces music. The knobs are the weights; the nudging is training.",
    },
    insideTitle: "The parts",
    inside: [
      { name: "Weights & biases", desc: "The millions of numbers that get tuned — the network's actual ‘knowledge'." },
      { name: "Layers", desc: "Stages of multiply-add-bend; deeper stacks capture more complex patterns." },
      { name: "Activation function", desc: "The ‘bend' that lets the network model non-linear relationships, not just straight lines." },
      { name: "Loss & gradient descent", desc: "A score of how wrong it is, and the rule for nudging weights to lower it." },
    ],
    how: [
      "In a **forward pass**, inputs flow through the layers — each neuron multiplies its inputs by weights, sums them, adds a bias, applies the activation — until an answer pops out. A **loss** measures how wrong that answer is.",
      "In the **backward pass** (backpropagation), the network works out how much each weight contributed to the error and nudges it to reduce the loss. Repeat over huge datasets and the weights converge on values that generalise. Once trained, only the fast forward pass is used — that's **inference**, what you pay for per request.",
    ],
    why: [
      "Why this and not hand-written rules? Because for things like recognising a cat or continuing a sentence, nobody can write the rules — there are too many, too fuzzy. A neural network *learns* them from examples instead. The trade: it needs lots of data and compute, and its ‘reasoning' is opaque (millions of numbers, not readable logic).",
      "Modern language models are this idea at enormous scale, with a particular architecture — the transformer — that's especially good at sequences like text.",
    ],
    breaks: "Train on biased or thin data and the network faithfully learns the bias — it has no judgement, only patterns. Ask it something outside what it saw and it may **hallucinate** a confident wrong answer, because it's pattern-matching, not looking anything up (which is exactly why grounding it with RAG matters). And because the ‘knowledge' is millions of opaque numbers, debugging a wrong answer is genuinely hard.",
    scale: "Tiny networks run on a phone. Big ones need clusters of specialised chips (GPUs/TPUs) for days or weeks to train. Serving them at scale means optimising **inference** — batching requests, compressing the model, caching — because every answer costs real compute. The frontier is largely an engineering problem of training and serving these functions efficiently.",
    related: ["embeddings", "rag"],
  },
};
