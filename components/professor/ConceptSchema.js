export const CONCEPT_SCHEMA = {
  order: {
    name: "State Machines & Audit Logs",
    mentalModel: {
      analogy: "Physical Restaurant Ticket Pad",
      explanation: "A clerk writes your order on a ticket pad, stamps it 'Paid', hands it to the kitchen, and gives you a receipt. The state is locked on paper. If they just wrote it on a whiteboard and wiped it off, no one would know who paid, who got refunded, or what to cook!"
    },
    simpleExplanation: "Orders don't just change status arbitrarily. They follow a strict timeline—from payment to preparation to delivery—where every single change is validated and logged so we have a permanent audit trail of what happened.",
    deepExplanation: {
      problem: "Concurrent requests (e.g. chef accepts order while user cancels) causing split-brain states.",
      solution: "A Finite State Machine (FSM) backed by database pessimistic locking.",
      tradeoffs: "Exclusive write locks block other checkout requests for that specific order, which can cause lag if locks are held too long.",
      failures: "Race conditions without locks could result in food being prepared and delivered while a refund is issued.",
      scaling: "At millions of users, holding exclusive database locks stalls write throughput. We buffer incoming orders in Redis queues and process them sequentially via background workers."
    },
    failures: "If a user cancels an order at the exact millisecond the chef accepts it, a double-update race occurs. Without row locks, both processes read the status as 'PLACED', both write their status updates, and both succeed: the customer gets refunded while the chef cooks the food.",
    alternatives: [
      { name: "Mutable status column", details: "Saves storage but destroys audit history (cannot tell who cancelled or when)." },
      { name: "Event sourcing", details: "High audit detail but complex to rebuild current state from historical events." }
    ],
    tradeoffs: [
      { metric: "Audit Detail", value: "High (every transition is a permanent record)" },
      { metric: "Database Size", value: "Medium (requires event log table growth)" },
      { metric: "Lock Overhead", value: "High (pessimistic locking blocks concurrent writes)" }
    ],
    burgerFarmFiles: [
      { name: "order.service.ts", path: "apps/backend/src/services/order.service.ts" },
      { name: "schema.prisma (Order model)", path: "schema.prisma" }
    ],
    giantExamples: [
      { company: "Uber & Swiggy", detail: "Use distributed event logs (like Apache Kafka) to coordinate driver dispatch and order state changes across multiple isolated microservices, auditing every transition." }
    ],
    evolutionStory: [
      { users: "10 Users", problem: "Direct synchronous SQL updates on the main database connect immediately.", solution: "Direct DB updates" },
      { users: "1000 Users", problem: "Spike traffic causes DB connection locks to pile up.", solution: "Database Connection Pooler" },
      { users: "100k Users", problem: "Multiple write locks on the Order table cause checkout lag.", solution: "Redis buffer queues offload DB writes" },
      { users: "1M Users", problem: "Intake pool exhaustion.", solution: "Asynchronous worker pool processes orders off the queue, separating intake from database writing completely." }
    ],
    questions: [
      {
        id: "order_1",
        difficulty: "Beginner",
        text: "Why is a single mutable status column in the order database insufficient for enterprise auditing?",
        options: [
          "It makes it impossible to know who changed the status, why they changed it, or when.",
          "It uses too much database storage space.",
          "It prevents the database from performing any updates.",
          "It is not supported by Next.js or Flutter."
        ],
        answerIdx: 0,
        explanation: "A mutable status column overwrites history, leaving no record of the order's state transitions, their timestamps, or the initiator."
      },
      {
        id: "order_2",
        difficulty: "Intermediate",
        text: "What database-level feature prevents concurrent requests from causing double-status modifications on a single order?",
        options: [
          "Row-level pessimistic locking (e.g., SELECT ... FOR UPDATE)",
          "Database indexes",
          "Soft deletes",
          "Foreign key constraints"
        ],
        answerIdx: 0,
        explanation: "Pessimistic locking (SELECT FOR UPDATE) blocks concurrent transactions from reading or writing the same row until the lock is released."
      },
      {
        id: "order_3",
        difficulty: "Senior",
        text: "How do we scale write throughput when database locks on the Order table begin to bottle-neck checkout times?",
        options: [
          "By inserting orders into an asynchronous memory queue (e.g., Redis List) and letting background workers write to the DB.",
          "By disabling transaction row locks on the checkout endpoint.",
          "By moving the order records to local storage on the user's phone.",
          "By adding database read replicas to distribute checkout writes."
        ],
        answerIdx: 0,
        explanation: "Asynchronous queuing decouples user requests from database writes, smoothing spikes and preventing database lock queues."
      }
    ]
  },

  payment: {
    name: "Idempotency Keys & Webhook Security",
    mentalModel: {
      analogy: "Hotel Keycard System",
      explanation: "A front desk clerk gives you a room keycard. No matter how many times you tap the card against the door reader, it only unlocks the room once. It does not create new rooms, charge you again, or clone your booking!"
    },
    simpleExplanation: "When paying online, network glitches can cause users to hit 'Pay' twice. We use unique keys to ensure that a checkout request is processed exactly once, and secure signature checks to verify payment confirmations.",
    deepExplanation: {
      problem: "Double-billing and spoofed payments.",
      solution: "Idempotency keys using Redis locks and SHA-256 HMAC signature verification on webhook routes.",
      tradeoffs: "Redis caching introduces minor network hops, and signature verification requires CPU cryptographic processing.",
      failures: "Without signature verification, an attacker could POST successful payment fake receipts to mark orders paid for free.",
      scaling: "At high loads, webhook signature checks are offloaded to edge CDN worker scripts to protect core server CPU from DDoS attacks."
    },
    failures: "Without idempotency, a network time-out during Stripe payment leaves the customer in the dark. They tap submit again, Stripe processes the charge twice, and the backend creates two orders, resulting in customer frustration and double charges.",
    alternatives: [
      { name: "Client-side disable-button", details: "Easy to bypass (users can reload, refresh, or trigger requests programmatically)." },
      { name: "Database unique constraints", details: "Creates orphaned gateway charges if DB rolls back but gateway succeeds." }
    ],
    tradeoffs: [
      { metric: "Payment Safety", value: "Maximum (zero double-charges, zero spoofed orders)" },
      { metric: "Server Latency", value: "Low (Redis lock check takes <2ms)" },
      { metric: "Implementation Cost", value: "Medium (requires client-side UUID coordination)" }
    ],
    burgerFarmFiles: [
      { name: "payment.service.ts", path: "apps/backend/src/services/payment.service.ts" },
      { name: "apiClientProvider", path: "apps/mobile-app/lib/core/providers/api_client.dart" }
    ],
    giantExamples: [
      { company: "Stripe & Adyen", detail: "Mandate idempotency keys on all post requests. If a request is retried, the exact same response headers and body are returned from cache." }
    ],
    evolutionStory: [
      { users: "10 Users", problem: "Webhook requests hit backend server synchronously.", solution: "Direct webhook routing" },
      { users: "1000 Users", problem: "Stripe callback failures or server hiccups drop payments.", solution: "Queue webhooks in Redis and retry on failure" },
      { users: "100k Users", problem: "DDoS spikes on webhook routes.", solution: "Cloudflare Webhook signature caching" },
      { users: "1M Users", problem: "Reconciliation discrepancies.", solution: "Automated daily cron matching database transaction ledger against Stripe bank deposits" }
    ],
    questions: [
      {
        id: "payment_1",
        difficulty: "Beginner",
        text: "What is the primary purpose of an idempotency key during checkout?",
        options: [
          "To guarantee a request is executed only once, even if sent multiple times.",
          "To encrypt the user's credit card number.",
          "To speed up the page load times of the payment panel.",
          "To generate a receipt PDF file."
        ],
        answerIdx: 0,
        explanation: "Idempotency keys prevent duplicate processing of the same request, avoiding duplicate charges."
      },
      {
        id: "payment_2",
        difficulty: "Intermediate",
        text: "How does payment signature verification protect a backend webhook route?",
        options: [
          "It uses a shared secret and HMAC hashing to prove the callback originated from the trusted payment provider.",
          "It checks if the user has a valid username and password.",
          "It compresses the payload to save bandwidth.",
          "It runs an antivirus scan on the incoming JSON payload."
        ],
        answerIdx: 0,
        explanation: "Signature checks (using HMAC SHA-256) verify that the payload has not been tampered with and was sent by the payment gateway."
      },
      {
        id: "payment_3",
        difficulty: "Senior",
        text: "Why should idempotency checks be stored in Redis instead of the primary relational database?",
        options: [
          "To avoid expensive transactional writes on the database for duplicate requests, resolving them in memory.",
          "Because relational databases cannot store UUID strings.",
          "Because Redis automatically encrypts keys.",
          "To allow payment details to be shared publicly."
        ],
        answerIdx: 0,
        explanation: "Redis lookup is extremely fast (<2ms) and SETNX allows atomic lock acquisition, protecting the relational database from double-writes."
      }
    ]
  },

  delivery: {
    name: "Geofencing & Serviceability",
    mentalModel: {
      analogy: "Delivery Zones on a Blackboard Map",
      explanation: "Imagine drawing circles on a map with chalk. If a house is inside a chalk circle, the driver can deliver. If it's outside, they can't. We use coordinates to check if a user is inside our delivery radius."
    },
    simpleExplanation: "We need to know if a store can deliver to a customer. We use lat/lng coordinates and geofencing equations to check if the address falls within the store's delivery polygon.",
    deepExplanation: {
      problem: "Routing orders to stores that are too far, causing cold food or driver delays.",
      solution: "Geofencing calculations (Haversine distance or Ray-Casting polygon checks) in the database.",
      tradeoffs: "High accuracy geofencing requires geometric query calculations on the database CPU.",
      failures: "Without boundaries, customers could order from a store 50 miles away, causing delivery failure.",
      scaling: "At scale, we index coordinates using spatial indexes (PostGIS or R-Trees) to query store polygons in microseconds."
    },
    failures: "If geofencing is bypassed or miscalculated, a customer could place a delivery order for a store that is physically separated by a river or highway with no connecting bridges, resulting in stranded drivers and cancelled orders.",
    alternatives: [
      { name: "Postcode lookup", details: "Simple but imprecise (postcodes often span huge, irregular geographic shapes)." },
      { name: "Direct radius circles", details: "Computationally cheap but ignores geographical obstacles (rivers, mountains)." }
    ],
    tradeoffs: [
      { metric: "Computation Cost", value: "High (polygon check requires coordinate geometry math)" },
      { metric: "Boundary Accuracy", value: "Maximum (matches real streets and barriers)" },
      { metric: "Driver Efficiency", value: "High (minimizes transit distance and cold deliveries)" }
    ],
    burgerFarmFiles: [
      { name: "delivery.service.ts", path: "apps/backend/src/services/delivery.service.ts" },
      { name: "schema.prisma", path: "schema.prisma" }
    ],
    giantExamples: [
      { company: "DoorDash & UberEats", detail: "Use spatial databases (like PostGIS) and complex hexagonal indexing systems (Uber H3) to dynamically define pricing zones and service areas." }
    ],
    evolutionStory: [
      { users: "10 Users", problem: "Compute distance between user and store in CPU.", solution: "Haversine math in Javascript" },
      { users: "1000 Users", problem: "Relational database queries get slower as address records grow.", solution: "Add Postgres indexes on Latitude and Longitude" },
      { users: "100k Users", problem: "Irregular service polygons overload standard index scans.", solution: "Upgrade to PostGIS spatial indexes (SP-GiST)" },
      { users: "1M Users", problem: "Dynamic driver matching bottleneck.", solution: "Implement Uber H3 hexagonal spatial grid queries" }
    ],
    questions: [
      {
        id: "delivery_1",
        difficulty: "Beginner",
        text: "What is a geofence?",
        options: [
          "A virtual boundary drawn on a map using coordinates to restrict or enable services.",
          "A physical fence built around a server warehouse.",
          "A protocol for encrypting delivery addresses.",
          "An algorithm for sorting menu items by price."
        ],
        answerIdx: 0,
        explanation: "A geofence uses coordinate shapes (polygons or circles) to check if a location is service-eligible."
      },
      {
        id: "delivery_2",
        difficulty: "Intermediate",
        text: "Why is postcode lookup inferior to coordinate-based polygon checking?",
        options: [
          "Postcodes are coarse shapes that ignore actual road networks, rivers, and store radiuses.",
          "Postcodes cannot be stored in databases.",
          "Postcodes are only used in the United States.",
          "Postcodes make queries slower."
        ],
        answerIdx: 0,
        explanation: "Postcodes represent broad regions and do not account for physical distance, driving routes, or precise boundaries."
      },
      {
        id: "delivery_3",
        difficulty: "Senior",
        text: "How does Uber's H3 hexagonal indexing improve geographic search performance compared to polygon intersection?",
        options: [
          "It maps coordinates to a discrete hexagonal grid index, converting slow geometry operations into fast key lookups.",
          "It runs geomath inside the user's mobile browser.",
          "It eliminates the need for latitude and longitude fields.",
          "It uses satellite imaging to track users without GPS."
        ],
        answerIdx: 0,
        explanation: "H3 assigns coordinates to fixed hexagons. Finding nearby points becomes a simple grid-cell indexing lookup, avoiding expensive geometry calculations."
      }
    ]
  },

  loyalty: {
    name: "Append-Only Ledgers & Optimistic Versioning",
    mentalModel: {
      analogy: "Bank Ledger Book",
      explanation: "A banker never uses an eraser. If you deposit $50 and then spend $20, they don't erase the first page and write $30. They append a new line: '+50' and then '-20'. You balance it by adding up all entries."
    },
    simpleExplanation: "To prevent points or balances from drifting, we never use simple UPDATE queries (e.g. SET points = points + 10). Instead, we write every points transaction as a new row in an append-only ledger.",
    deepExplanation: {
      problem: "Points drift, balance leaks, and database concurrency collisions.",
      solution: "Append-only transactions with optimistic concurrency control (using a `version` column).",
      tradeoffs: "Queries require aggregate calculations (SUM) to fetch balance, increasing database read overhead.",
      failures: "Double-spending points if concurrent checkouts happen simultaneously.",
      scaling: "At high volumes, we cache current balances in Redis and reconcile them asynchronously against the master DB ledger."
    },
    failures: "Without optimistic locking, if a customer triggers checkout from two devices at the same second with 100 points, both checkouts read the points balance as 100, both authorize a discount, and the database updates. The customer double-spends points, creating a negative balance.",
    alternatives: [
      { name: "Mutable balance field", details: "Saves storage but makes financial auditing impossible (cannot trace point history)." },
      { name: "Pessimistic DB lock", details: "Extremely slow. Blocks the user's whole checkout thread just to check loyalty status." }
    ],
    tradeoffs: [
      { metric: "Audit Compliance", value: "Maximum (every single point earned/spent is tracked forever)" },
      { metric: "Read Overhead", value: "Medium (requires SUM queries or balance caching)" },
      { metric: "Write Latency", value: "Low (append queries are much faster than lock-blocked updates)" }
    ],
    burgerFarmFiles: [
      { name: "loyalty.service.ts", path: "apps/backend/src/services/loyalty.service.ts" },
      { name: "schema.prisma (LoyaltyTransaction model)", path: "schema.prisma" }
    ],
    giantExamples: [
      { company: "Retail Banks & Credit Card Networks", detail: "Enforce strict append-only ledger ledgers. A transaction row is never modified or deleted; corrections are written as compensating transactions." }
    ],
    evolutionStory: [
      { users: "10 Users", problem: "Calculate balance by querying and summing all database rows.", solution: "Direct SQL SUM queries" },
      { users: "1000 Users", problem: "Checkout latencies rise due to frequent ledger SUM queries.", solution: "Cache balance in Redis" },
      { users: "100k Users", problem: "Concurrent requests write duplicate points during retries.", solution: "Optimistic locking using a transaction version column" },
      { users: "1M Users", problem: "Reconciliation drift.", solution: "Asynchronous background reconciliation and ledger partitioning" }
    ],
    questions: [
      {
        id: "loyalty_1",
        difficulty: "Beginner",
        text: "What is an append-only ledger?",
        options: [
          "A database design where data is only added as new records, never updated or deleted.",
          "A security feature that deletes files after reading them.",
          "A method of compressing log files.",
          "A system for storing user profiles."
        ],
        answerIdx: 0,
        explanation: "Append-only databases preserve historical entries, ensuring transaction trails cannot be erased."
      },
      {
        id: "loyalty_2",
        difficulty: "Intermediate",
        text: "How does optimistic concurrency control protect a user's loyalty balance?",
        options: [
          "It uses a version number. If the version in the database has changed since you read it, the write is rejected.",
          "It uses a firewall to block concurrent IP addresses.",
          "It encrypts the points balance with a public key.",
          "It locks the entire database table during checkout."
        ],
        answerIdx: 0,
        explanation: "Optimistic locking checks the version. If another process updated the record, the versions mismatch, and the transaction safely aborts."
      },
      {
        id: "loyalty_3",
        difficulty: "Senior",
        text: "What is the trade-off of using an append-only ledger for storing point balances?",
        options: [
          "Increased storage and read overhead to calculate balances, requiring cache layer management.",
          "It is insecure compared to mutable columns.",
          "It prevents the use of foreign keys.",
          "It requires a distributed blockchain network."
        ],
        answerIdx: 0,
        explanation: "Since point balance is calculated by summing entries, reads require aggregations, which is resolved at scale by caching current balances."
      }
    ]
  },

  security: {
    name: "JWT Revocation & Token Buckets",
    mentalModel: {
      analogy: "Hotel Room Keycard vs Blacklist",
      explanation: "A JWT is like a hotel room keycard. Once programmed, it grants access autonomously. If you lose the card, the hotel can't change the card remotely; they must update the door locks or keep a list of deactivated card IDs!"
    },
    simpleExplanation: "JSON Web Tokens (JWT) allow users to stay logged in securely. But since they are stateless, we need a fast revocation list (blacklist) to log users out, and rate-limiting buckets to prevent brute-force attacks.",
    deepExplanation: {
      problem: "Stolen stateless tokens and dictionary attacks on login routes.",
      solution: "Stateless JWT authentication paired with Redis-based blacklist checks and token-bucket rate limiting.",
      tradeoffs: "Adding a revocation check means token validation is no longer 100% stateless (requires a Redis read hop).",
      failures: "Without rate limiting, attackers can run dictionary search bots to crack passwords.",
      scaling: "At scale, token blacklist lookups are replicated in memory across clusters, and rate limits are enforced at the API gateway layer."
    },
    failures: "Without token revocation, if a user logs out because their phone was stolen, the stolen JWT remains valid in the thief's browser until its expiry date. The attacker can access user data, modify profiles, and place fraudulent orders.",
    alternatives: [
      { name: "Stateful session IDs", details: "Requires querying the database on every request, creating a severe bottleneck." },
      { name: "Short-lived JWTs (e.g. 5m)", details: "Safer, but client must refresh constantly, complicating offline handling." }
    ],
    tradeoffs: [
      { metric: "Statelessness", value: "Medium (requires a Redis hit for blacklist check)" },
      { metric: "Security", value: "High (allows immediate logout and token ban)" },
      { metric: "Gateway Load", value: "Low (rate limit processed at gateway before backend)" }
    ],
    burgerFarmFiles: [
      { name: "auth.middleware.ts", path: "apps/backend/src/middleware/auth.middleware.ts" },
      { name: "rateLimiter.ts", path: "apps/backend/src/middleware/rateLimiter.ts" }
    ],
    giantExamples: [
      { company: "Auth0 & Netflix", detail: "Use stateless JWTs for API access but maintain distributed Redis cache blacklists to immediately invalidate tokens during security incidents or logouts." }
    ],
    evolutionStory: [
      { users: "10 Users", problem: "Check password using synchronous encryption inside checkout thread.", solution: "Bcrypt hash checks on login" },
      { users: "1000 Users", problem: "Login route is flooded by automated brute-force scripts.", solution: "Token-bucket rate limiting on server" },
      { users: "100k Users", problem: "Database sessions slow down API requests.", solution: "Stateless JWT authorization" },
      { users: "1M Users", problem: "Token theft window.", solution: "Redis JWT Blacklist check and API Gateway rate-limiting" }
    ],
    questions: [
      {
        id: "security_1",
        difficulty: "Beginner",
        text: "What makes JSON Web Tokens (JWT) stateless?",
        options: [
          "The token contains the user data and signature inside itself, requiring no database lookup to verify.",
          "The token is stored in the browser's cookies.",
          "The token is destroyed immediately after read.",
          "The token does not require a secret key to verify."
        ],
        answerIdx: 0,
        explanation: "Because JWTs are cryptographically signed, the server can trust the claims inside without querying a session database."
      },
      {
        id: "security_2",
        difficulty: "Intermediate",
        text: "How does a Redis token-bucket rate limiter regulate requests?",
        options: [
          "It maintains a counter of 'tokens' in Redis. Each request consumes a token; if empty, the request is rejected (HTTP 429).",
          "It blocks requests based on the country of origin.",
          "It encrypts request routes to slow down traffic.",
          "It redirects users to a captcha page after 3 clicks."
        ],
        answerIdx: 0,
        explanation: "The Token Bucket algorithm refills tokens at a fixed rate, allowing bursts of requests up to the maximum bucket capacity."
      },
      {
        id: "security_3",
        difficulty: "Senior",
        text: "If JWT authentication is chosen for scale, why must we still implement a revocation list?",
        options: [
          "To allow immediate token invalidation (e.g. during logout or account compromise) before the token expires naturally.",
          "Because JWTs cannot hold custom payload fields.",
          "To prevent the token from being copied by other browsers.",
          "Because browser cookies automatically delete stateless tokens."
        ],
        answerIdx: 0,
        explanation: "Without a blacklist/revocation check, the server has no way to force a logout, since the token remains cryptographically valid until expiry."
      }
    ]
  },

  pos: {
    name: "Asynchronous Print Queues & Retries",
    mentalModel: {
      analogy: "Diner Vibe Coasters",
      explanation: "When you order at a diner, they hand you a plastic coaster that vibrates when your food is ready. You sit down; if the kitchen is busy, the kitchen does not stall checkouts. When they finish, they buzz your coaster."
    },
    simpleExplanation: "POS kitchen printers can run out of paper or go offline. To prevent this from breaking checkouts, we queue print jobs in Redis and retry them once the printer connects, deduplicating print IDs.",
    deepExplanation: {
      problem: "Printer jams blocking checkouts and duplicate print tickets.",
      solution: "Asynchronous job queues (using BullMQ or Redis Lists) with idempotent print job UUIDs.",
      tradeoffs: "Requires worker processes and introduces brief latency between checkout and kitchen printing.",
      failures: "Duplicate tickets printed if retry loops trigger before printer responds.",
      scaling: "At scale, print queues are partitioned per store location, and workers run distributed on site to survive cloud outages."
    },
    failures: "If checkout is synchronous, a jammed POS printer blocks the thread. The customer's mobile app freezes, the payment gateway charges their card, but the checkout response fails, leaving the store with payment but no order ticket.",
    alternatives: [
      { name: "Direct TCP print call", details: "Simple but fragile (stalls checkout if printer is slow, offline, or busy)." },
      { name: "Local file buffering", details: "Requires local server nodes, adding maintenance overhead." }
    ],
    tradeoffs: [
      { metric: "Checkout Resilience", value: "Maximum (checkouts succeed even if printers are offline)" },
      { metric: "Print Latency", value: "Low (delayed by queue processing time, typically <500ms)" },
      { metric: "Complexity", value: "High (requires job workers, retry backoffs, and state polling)" }
    ],
    burgerFarmFiles: [
      { name: "pos.service.ts", path: "apps/backend/src/services/pos.service.ts" },
      { name: "kitchen_worker.ts", path: "apps/backend/src/workers/kitchen_worker.ts" }
    ],
    giantExamples: [
      { company: "McDonalds & Starbucks", detail: "Enforce decoupled POS print grids. Kitchen displays (KDS) and receipt printers run on local local-area-network queues, buffering orders during WAN outages." }
    ],
    evolutionStory: [
      { users: "10 Users", problem: "Connect directly to printer IP address and send bytes.", solution: "Direct raw TCP prints" },
      { users: "1000 Users", problem: "Printer jams cause checkout requests to timeout.", solution: "Decouple print jobs into a background thread" },
      { users: "100k Users", problem: "Network drops cause lost kitchen tickets during peak hours.", solution: "Store print jobs in persistent Redis queues" },
      { users: "1M Users", problem: "Scale replication print storms.", solution: "Partition print queues per store location with local offline failover workers" }
    ],
    questions: [
      {
        id: "pos_1",
        difficulty: "Beginner",
        text: "Why should kitchen printing be decoupled from the customer checkout request?",
        options: [
          "To prevent printer jams, paper cuts, or offline networks from stalling checkout payments.",
          "To speed up credit card validation.",
          "To format the receipts in HTML instead of PDF.",
          "To prevent the customer from seeing the kitchen status."
        ],
        answerIdx: 0,
        explanation: "Decoupling checkouts from printing ensures that hardware issues do not affect transaction processing or block customer payments."
      },
      {
        id: "pos_2",
        difficulty: "Intermediate",
        text: "How do we prevent duplicate tickets from printing when retry loops trigger?",
        options: [
          "By attaching a unique UUID to each print job and storing processed IDs in a Redis cache for deduplication.",
          "By printing tickets on double-sided paper.",
          "By limiting retry attempts to exactly one.",
          "By shutting down the printer after each print."
        ],
        answerIdx: 0,
        explanation: "Attaching a unique print job ID allows the receiver to track printed IDs and ignore duplicate retry packets."
      },
      {
        id: "pos_3",
        difficulty: "Senior",
        text: "In a multi-store architecture, what is the best way to handle print queues during a complete cloud internet outage?",
        options: [
          "Deploy local gateway nodes at each store that buffer order packets locally and sync to local LAN printers.",
          "Use a single global queue and display a connection error to all customers.",
          "Disable all printing and let kitchen staff read database logs.",
          "Move the backend server code into the printer firmware."
        ],
        answerIdx: 0,
        explanation: "Store-level gateways ensure that even if the WAN drops, local LAN checkouts and printing continue, keeping operations functional."
      }
    ]
  },

  analytics: {
    name: "OLTP vs OLAP Isolations",
    mentalModel: {
      analogy: "Photocopied Ledgers",
      explanation: "Imagine a restaurant cashier writing down sales. If the manager grabs the ledger book to calculate a 10-hour sales report, they block the cashier from writing! Instead, the manager makes a photocopy of yesterday's ledger to analyze, letting cashiers ring up sales."
    },
    simpleExplanation: "Relational databases are optimized for fast checkouts (OLTP). Running heavy business reports (OLAP) directly on them locks database tables and stalls checkout writes. We separate these by routing reports to read replicas.",
    deepExplanation: {
      problem: "Connection pool exhaustion and database locks caused by analytics queries blocking transactions.",
      solution: "Separating Online Transaction Processing (OLTP) database pools from Online Analytical Processing (OLAP) read replicas.",
      tradeoffs: "Read replicas introduce replication lag, meaning reports may not show the absolute real-time checkout state.",
      failures: "Running business funnels on the primary DB exhausts connection pools, causing checkout requests to time out.",
      scaling: "At scale, transaction logs are streamed continuously (CDC) into dedicated columnar warehouses (Snowflake/BigQuery) for OLAP analytics."
    },
    failures: "A manager loads the 'Weekly Store Performance and Loyalty Cohorts' dashboard at Friday 8 PM. Without replica isolation, the database spends 30 seconds scanning millions of rows, locking tables. Active checkout threads exhaust connection pools, and customers get HTTP 504 Gateway Timeout errors.",
    alternatives: [
      { name: "Single Database Instance", details: "Simple and cheap, but high risk of dashboard queries bringing down checkout systems." },
      { name: "NoSQL Database", details: "Fast writes, but extremely poor at handling complex join reports." }
    ],
    tradeoffs: [
      { metric: "Checkout Availability", value: "Maximum (reports never lock transaction tables)" },
      { metric: "Data Consistency", value: "Eventual (delayed by replica sync lag, typically <2s)" },
      { metric: "Infrastructure Cost", value: "Medium (requires running read replica instances)" }
    ],
    burgerFarmFiles: [
      { name: "analytics.service.ts", path: "apps/backend/src/services/analytics.service.ts" },
      { name: "database.ts (Replica pools)", path: "apps/backend/src/lib/database.ts" }
    ],
    giantExamples: [
      { company: "Amazon & Netflix", detail: "Enforce strict separation. Transaction databases write to OLTP stores, which continuously stream transaction logs (using Debezium CDC) to OLAP warehouses." }
    ],
    evolutionStory: [
      { users: "10 Users", problem: "Run simple SQL count/sum queries on the main database.", solution: "Direct SQL queries on Primary DB" },
      { users: "1000 Users", problem: "Dashboard queries lock the Order table, stalling checkouts.", solution: "Add read replica instance for reports" },
      { users: "100k Users", problem: "Complex multi-table join reports run out of database memory.", solution: "Denormalize reporting tables and create hourly pre-aggregated summaries" },
      { users: "1M Users", problem: "Relational database is bottlenecked by petabyte-scale data history.", solution: "Stream transaction logs using Change Data Capture (CDC) into a columnar warehouse (BigQuery)" }
    ],
    questions: [
      {
        id: "analytics_1",
        difficulty: "Beginner",
        text: "What does OLTP stand for and what is its primary focus?",
        options: [
          "Online Transaction Processing; focused on fast, real-time checkout writes and lookups.",
          "Online Analytical Processing; focused on running complex reports.",
          "Only Line Translation Protocol; focused on network routing.",
          "Object Link Transaction Pool; focused on database connections."
        ],
        answerIdx: 0,
        explanation: "OLTP systems process day-to-day transactions rapidly, prioritizing checkout availability and consistency."
      },
      {
        id: "analytics_2",
        difficulty: "Intermediate",
        text: "What is database replication lag?",
        options: [
          "The delay between writing data to the primary database and it appearing on the read replicas.",
          "The network ping between the server and the browser.",
          "The time it takes to restore a database backup.",
          "A bug that deletes duplicate records from replicas."
        ],
        answerIdx: 0,
        explanation: "Replication lag is the delay (usually milliseconds to seconds) for transactions on the primary database to sync to replicas."
      },
      {
        id: "analytics_3",
        difficulty: "Senior",
        text: "Why are columnar data warehouses (like Snowflake or BigQuery) superior to row-based relational databases for OLAP analytics?",
        options: [
          "They store data by column instead of row, allowing aggregate queries (like SUM/AVG) to read only target columns, saving I/O.",
          "They do not require SQL queries.",
          "They guarantee zero replication lag.",
          "They automatically index every record."
        ],
        answerIdx: 0,
        explanation: "Columnar databases only read columns referenced in the query, significantly reducing disk I/O when aggregating millions of rows."
      }
    ]
  }
};
