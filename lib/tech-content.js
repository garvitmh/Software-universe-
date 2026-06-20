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
      "Networks are unreliable. The app sends ‘place order', the reply gets lost on the way back, so the app retries — but the backend may have *already* processed the first one. Without protection, you'd be charged twice and get two orders. **Idempotency** is the property that makes a repeated request land exactly once.",
      "The mechanism is an **idempotency key**: a unique token the client attaches to an attempt. The backend records keys it has seen. The first request with a given key does the work; any later request with the *same* key is recognised as a duplicate and quietly returns the original result instead of repeating the action.",
      "In your schema this is enforced at the strongest possible level — the database. The `Order` table's `idempotency_key` is marked **unique**, so a duplicate insert physically cannot happen; the second one bounces off a wall.",
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
};
