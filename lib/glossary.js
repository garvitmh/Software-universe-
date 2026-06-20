// Plain-language definitions for every piece of jargon, so a doubt can be
// cleared inline (see components/Term.jsx). Keep each `def` to 1–2 sentences a
// total beginner can understand. `more` is an optional second layer.
// Usage in content:  <Term id="api">API</Term>   or   <Term def="...">x</Term>

export const GLOSSARY = {
  // ── the big picture ──
  api: { term: "API", def: "A fixed menu of requests one program offers to another. The app uses the backend's API to ask for the menu, place orders, and so on — it can only ask for things on the menu." },
  backend: { term: "Backend", def: "The program running on a server that does the real work and enforces the rules — the 'brain'. The app can't be trusted; the backend can." },
  frontend: { term: "Frontend", def: "The part a person actually sees and touches — here, the mobile app. Its job is to show things and ask for things." },
  server: { term: "Server", def: "A computer in a data centre that runs all the time and answers requests over the internet. Your backend runs on one." },
  client: { term: "Client", def: "Whoever is making the request — usually the app on a customer's phone. 'Never trust the client' means the phone can be tampered with, so the backend re-checks everything." },
  database: { term: "Database", def: "The part that remembers things permanently — through restarts and crashes. Every order and customer lives here." },

  // ── database ──
  table: { term: "Table", def: "One kind of thing in the database, like a strict spreadsheet. The Order table holds all orders, one per row." },
  row: { term: "Row", def: "One single item in a table — one order, one user." },
  column: { term: "Column", def: "One fact about each row — an order's total, its status." },
  "foreign-key": { term: "Foreign key", def: "A column that points at a row in another table. An order's user_id points at the User who placed it — that's how tables link together." },
  "primary-key": { term: "Primary key", def: "The unique id that identifies one row, so you can always find exactly it." },
  index: { term: "Index", def: "A pre-sorted lookup, like the index at the back of a book. It lets the database jump straight to matching rows instead of reading every one." },
  query: { term: "Query", def: "A question you ask the database — 'give me this store's pending orders'." },
  sql: { term: "SQL", def: "The language for asking a relational database questions. You describe what you want; the database figures out how to get it." },
  transaction: { term: "Transaction", def: "A group of writes that all succeed together or all undo together. There's no half-finished state — the bedrock of handling money safely." },
  acid: { term: "ACID", def: "Four guarantees a serious database makes: writes are all-or-nothing, rules are never left broken, simultaneous work doesn't collide, and once saved it survives a crash." },
  migration: { term: "Migration", def: "A versioned, repeatable change to the database's shape (a new column or table), so the structure evolves safely instead of by hand." },
  orm: { term: "ORM", def: "A translator between your code's objects and the database's rows, so you read/write data without hand-writing SQL. Prisma is the one here." },
  decimal: { term: "Decimal", def: "An exact number type used for money, so amounts like ₹0.10 are stored precisely — unlike ordinary computer 'floats', which can't." },
  schema: { term: "Schema", def: "The blueprint that describes every table, column, and link in the database. Here it's one file: schema.prisma." },
  "referential-integrity": { term: "Referential integrity", def: "The database's promise that a link always points at something real — you can't have an order item for a product that doesn't exist." },

  // ── the web in between ──
  http: { term: "HTTP", def: "The request-and-reply language of the web. The app sends a request; the backend sends back a response. The app always asks first." },
  rest: { term: "REST", def: "A tidy convention for organising a web API around 'resources' (orders, products) addressed by clean URLs and standard verbs (GET to read, POST to create)." },
  endpoint: { term: "Endpoint", def: "One specific address + action in an API, like 'GET /api/v1/menu' — a single thing you can ask for." },
  request: { term: "Request", def: "A message the app sends to the backend asking for something or sending something." },
  response: { term: "Response", def: "The backend's reply to a request — the data, plus a status code saying how it went." },
  json: { term: "JSON", def: "A simple text way to write down structured data (objects and lists), understood by every language. It's the shape data travels in." },
  jwt: { term: "JWT", def: "A 'JSON Web Token' — a tamper-proof badge the backend issues at login that says 'this is who I am', signed with a secret only the server knows." },
  cookie: { term: "Cookie", def: "A small piece of data the browser stores and sends back automatically on each request — here it carries your signed login token." },
  httponly: { term: "httpOnly", def: "A cookie setting meaning JavaScript on the page cannot read it. So even a malicious injected script can't steal your login." },
  csrf: { term: "CSRF", def: "Cross-Site Request Forgery — an attack where another website quietly fires a request to your backend riding your cookie. A CSRF token blocks it." },
  token: { term: "Token", def: "A small string that stands in for something — proof of who you are, or a one-time key. Tokens here include the login JWT and the CSRF token." },
  header: { term: "Header", def: "Extra info attached to a request or response — the auth cookie, the content type, a request id — sitting alongside the main data." },
  "status-code": { term: "Status code", def: "A number in the reply saying how it went: 200 OK, 401 not logged in, 404 not found, 500 the server broke." },
  stateless: { term: "Stateless", def: "The backend keeps no memory of you between requests — your identity rides in your token each time. That's what lets many copies of it run at once." },
  session: { term: "Session", def: "The idea of 'you, currently logged in'. Here it's carried in a signed cookie rather than stored on the server." },
  sse: { term: "SSE", def: "Server-Sent Events — one long-lived connection the server uses to push small 'something changed' nudges to the app, so the screen can update live." },
  webhook: { term: "Webhook", def: "When an outside service (like a payment gateway) calls your backend to tell it something happened, instead of you having to keep asking." },

  // ── the app ──
  flutter: { term: "Flutter", def: "The toolkit the app is built with. It draws every pixel itself, so the app looks identical on iPhone and Android from one codebase." },
  widget: { term: "Widget", def: "Flutter's building block. Everything on screen is a widget, and screens are just bigger widgets made of smaller ones — like Lego." },
  dart: { term: "Dart", def: "The programming language the app is written in — typed and 'null-safe', designed to pair with Flutter." },
  state: { term: "State", def: "Anything that can change while the app is open — what's in your cart, which filter is on. Managing it well is what keeps the screen consistent." },
  provider: { term: "Provider", def: "In Riverpod, a named place that holds a piece of shared state (like the cart) so any part of the screen can read the same truth." },
  riverpod: { term: "Riverpod", def: "The library the app uses to hold and share state, so different parts of the screen never disagree about the cart or the filters." },
  reactive: { term: "Reactive", def: "When something recomputes itself automatically the moment its inputs change — change one value and the screen redraws, with no manual syncing." },
  repository: { term: "Repository", def: "The one place that knows how to fetch a kind of data (the menu). Screens ask it for 'the menu' without knowing any URLs." },
  "dependency-injection": { term: "Dependency injection", def: "Instead of a piece of code creating its own tools, it's handed them. That makes it easy to swap a real tool for a fake one in tests." },
  interceptor: { term: "Interceptor", def: "Code that runs automatically on every network request/response — attaching the login cookie, adding a trace id, retrying a blip — so no screen has to." },
  dio: { term: "Dio", def: "The app's single network client. Every request to the backend goes through it, which is where interceptors do their work." },
  "null-safety": { term: "Null safety", def: "A language feature that forces you to say whether a value can be 'nothing'. It kills the classic 'it was empty and the app crashed' bug." },

  // ── the backend ──
  nodejs: { term: "Node.js", def: "The thing that lets JavaScript run on a server. Your backend is a Node program. It's great at handling many requests that are mostly waiting." },
  express: { term: "Express", def: "A small framework for Node that maps each URL to the right code and runs 'middleware' guards along the way." },
  middleware: { term: "Middleware", def: "Code that runs before the main handler, on every matching request — checking auth, verifying a CSRF token — and can stop a bad request cold." },
  route: { term: "Route", def: "The rule that says 'a request to this URL with this method runs this function'. The front desk of the backend." },
  service: { term: "Service", def: "Where the real logic lives (fetch the catalogue, apply prices). Routes stay thin and call services, so the logic is testable on its own." },
  "event-loop": { term: "Event loop", def: "Node's single line of work that never sits idle waiting. It hands off slow jobs and serves other requests meanwhile — like one waiter juggling many tables." },

  // ── cross-cutting logic ──
  idempotency: { term: "Idempotency", def: "Doing something twice has the same effect as doing it once. A retried 'place order' is recognised as a repeat and charges you only once." },
  ledger: { term: "Ledger", def: "Tracking points or money as an append-only list of every movement (like a bank statement), so the balance is the running total and nothing can be lost." },
  "append-only": { term: "Append-only", def: "You only ever add new rows, never edit or delete old ones. That's what makes a history trustworthy — it can't be quietly rewritten." },
  "state-machine": { term: "State machine", def: "A thing that's always in exactly one of a fixed set of states, where only certain moves are allowed — so impossible situations can't happen." },
  "optimistic-concurrency": { term: "Optimistic concurrency", def: "A version number on a row so two requests changing it at once can't both win — the second notices it changed and backs off." },
  "race-condition": { term: "Race condition", def: "A bug where two things happen at the same instant and collide on the same data, producing a wrong result (like spending the same points twice)." },
  cache: { term: "Cache", def: "A ready-made copy of an expensive answer (like the menu), kept close by so most requests are served instantly instead of recomputed." },
  "cache-invalidation": { term: "Cache invalidation", def: "Throwing away a cached copy when the real data changes, so you don't keep serving a stale price. Famously the hard part of caching." },
  queue: { term: "Queue", def: "A line of messages for slow or external work. The backend drops a job on it and replies instantly; a separate worker handles the job later." },
  worker: { term: "Worker", def: "A separate process that picks jobs off a queue and does the slow work (sending emails, notifying the kitchen) in the background." },
  "load-balancer": { term: "Load balancer", def: "One public 'door' that spreads incoming requests across many identical copies of the backend, so traffic can grow by adding copies." },
  "horizontal-scaling": { term: "Horizontal scaling", def: "Handling more load by running more copies of the same thing, rather than one ever-bigger machine. Statelessness is what makes it possible." },
  cdn: { term: "CDN", def: "A network of servers around the world that keep copies of images/files close to users, so they load fast everywhere." },
  redis: { term: "Redis", def: "A very fast in-memory store often used as a shared cache that all backend copies read from." },
  observability: { term: "Observability", def: "Being able to see what your running system is doing — logs, metrics, and traces — so you can find a problem before customers tell you." },
  "request-id": { term: "Request id", def: "A unique tag attached to each request so you can follow one order's whole journey across every part of the system." },

  // ── admin & ops ──
  refine: { term: "Refine", def: "A framework that generates the admin panel's repetitive screens (list, create, edit, view) so they don't have to be hand-built." },
  crud: { term: "CRUD", def: "Create, Read, Update, Delete — the four basic things you do to data, and the four screens an admin panel mostly needs." },
  nextjs: { term: "Next.js", def: "The framework behind the admin panel (and this site). It adds routing, server rendering, and a build system on top of React." },
  react: { term: "React", def: "A library for building web interfaces out of reusable 'components' — the web equivalent of Flutter's widgets." },
  component: { term: "Component", def: "A reusable piece of UI that renders itself from data — a button, a table, a card. You build pages by composing them." },
  ssr: { term: "Server rendering", def: "Building a page's HTML on the server so it arrives ready-to-show and fast, instead of a blank page that fills in later." },
  docker: { term: "Docker", def: "A way to pack an app together with everything it needs into one sealed 'container' that runs identically on any machine." },
  kubernetes: { term: "Kubernetes", def: "A manager for many containers — it runs them, restarts crashed ones, and adds or removes copies as load changes." },
  "ci-cd": { term: "CI/CD", def: "Automatically testing every change and then deploying it — so broken code is caught before it ships, and shipping is routine." },
  "environment-variable": { term: "Environment variable", def: "A setting (like the database address or a secret key) supplied to the app from outside the code, so secrets never live in the codebase." },
  deploy: { term: "Deploy", def: "To put a new version of the code live on the server where real customers use it." },
  infrastructure: { term: "Infrastructure as code", def: "Describing your servers and database in a file in your repo, so a deploy is reproducible and reviewable instead of clicking around a dashboard." },
};
