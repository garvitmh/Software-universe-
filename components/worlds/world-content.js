import React from "react";
import OrderJourney from "@/components/OrderJourney";
import LoyaltyLedgerSim from "@/components/LoyaltyLedgerSim";

export const WORLD_CONTENT = {
  order: {
    title: "Order World",
    sub: "State Machines & Queue Separation",
    desc: "How order placement, status changes, and database-level synchronization prevent collision and guarantee a predictable delivery flow.",
    tint: "brand",
    simulatorName: "order",
    codex: [
      {
        heading: "What We Do",
        text: "The placement of a food order is the core transaction of Burger Farm. In the code, this starts as a PENDING_PAYMENT state and transitions linearly through PLACED, PREPARING, OUT_FOR_DELIVERY, and finally COMPLETED or CANCELLED."
      },
      {
        heading: "Why This Way",
        text: "Every order state transition is logged as an immutable OrderEvent. We reject holding only a single mutable status column in the database because it creates a black box: if an order is marked cancelled, we wouldn't know if the customer, the admin, or a system failure triggered it. The event log provides an unbreakable audit trail."
      },
      {
        heading: "Alternatives Considered",
        text: "We rejected polling status endpoints from the mobile app (which strains connection pools). Instead, we chose an event-driven flow-packet system where server-side updates push events directly to the app (using SSE), keeping clients in perfect sync without API spam."
      }
    ],
    failures: {
      disaster: "Two backend request threads simultaneously try to modify an order's status (e.g. preparing and cancelling at the same time), leading to a split-brain DB state where cooked food is delivered for a cancelled order.",
      recovery: "We enforce database-level pessimistic locking (using Prisma transactions) and a strict State Machine transition check. If the order status is already CANCELLED, any request to mark it PREPARING is aborted."
    },
    scalingStats: {
      "10": "Direct synchronous SQL updates on the main database connect immediately.",
      "100k": "Multiple write locks on the Order table cause checkout lag. We offload order placement to Redis message queues to buffer writes.",
      "1M": "Database connection pools exhaust. An asynchronous worker pool processes orders off the queue, separating intake from database writing completely."
    },
    anchors: [
      { name: "order.service.ts", path: "apps/backend/src/services/order.service.ts" },
      { name: "schema.prisma (Order model)", path: "schema.prisma" }
    ],
    industry: "Uber and Swiggy use event log streams (Kafka) to coordinate order and driver dispatch state changes, ensuring every state transition is audited and reversible.",
    professorHooks: {
      simpler: {
        title: "Explain Simpler",
        emoji: "🧠",
        content: "Imagine ordering food at a physical restaurant counter. The clerk writes down your order on a ticket pad, stamps it 'Paid', hands it to the kitchen, and gives you a receipt. The state of your food is clear. If the clerk just wrote it on a whiteboard and wiped it off, the kitchen wouldn't know what to cook or who to refund!"
      },
      deeper: {
        title: "Explain Deeper",
        emoji: "🔬",
        content: "Order states are managed as a strict Finite State Machine (FSM). We use Postgres 'SELECT ... FOR UPDATE' inside Prisma transactions to acquire an exclusive row-level write lock. This blocks concurrent processes from reading or writing the same order until the active status change commits, preventing split-brain database anomalies."
      },
      alternatives: {
        title: "Show Alternatives",
        emoji: "⚖️",
        content: "We compared a simple mutable status field with an append-only event ledger. While a mutable column saves storage, it destroys audit history. We opted for a hybrid approach: a current status column in the Order table for quick querying, backed by a detailed OrderEvent relation table containing every status change timestamp, initiator, and metadata."
      },
      failures: {
        title: "Show Failures",
        emoji: "💥",
        content: "If a user attempts to cancel an order at the exact millisecond the chef hits 'Accept Kitchen Ticket', a double-update race occurs. Without row locking, both threads read the status as 'PLACED', both write their status updates, and the database commits both. The customer gets refunded, but the kitchen wastefully prepares the food."
      },
      code: {
        title: "Show Burger Farm Code",
        emoji: "🛠️",
        content: "Look at order.service.ts. The validateTransition() helper checks the incoming state against a predefined transition matrix: PLACED -> PREPARING (Valid), CANCELLED -> PREPARING (Invalid). If validation passes, a transaction writes both the new status and the audit event."
      }
    }
  },
  
  payment: {
    title: "Payment World",
    sub: "Gateways, Webhooks & Idempotency",
    desc: "How we interface with external payment gateways like Stripe without double-charging users during network failure.",
    tint: "amber",
    simulatorName: "loyalty", // Uses the ledger/idempotency retry simulator
    codex: [
      {
        heading: "1. Webhooks & Server Authority",
        text: "Webhooks act as server-to-server HTTP POST requests sent by the payment gateway (e.g. Stripe) when a transaction completes. What Happened: A secure PaymentIntent session is created, and the customer pays on a gateway page. Why: Charging a card synchronously in the checkout thread makes the server hang. If the client network drops, the status freezes. With webhooks, Stripe acts as the authority, notifying the server directly and independently of client-side connectivity."
      },
      {
        heading: "2. Webhook Signature Verification",
        text: "What Happened: When Stripe fires a webhook to /api/webhooks, the payload contains a 'Stripe-Signature' header. Why: To prevent malicious spoofing attacks where an attacker posts a fake successful transaction to bypass checkout. We verify the payload digest using HMAC SHA-256 with our signing secret. What breaks without this: Anyone could send fake payload files to our endpoint to order food for free. Tradeoff: Minor CPU verify overhead, but absolute cryptographic safety."
      },
      {
        heading: "3. Idempotency Keys",
        text: "What Happened: The Flutter client generates a unique UUID (e.g., hash of cart ID and user ID) and sends it in the 'X-Idempotency-Key' header on checkout. Why: If a network timeout occurs and the client retries, the server checks Redis. If the key exists, it returns the cached response without processing the charge again. What breaks: The user is double-charged if they click 'Pay' twice during a spotty connection."
      },
      {
        heading: "4. Database Transactions",
        text: "What Happened: Once webhook payment is verified, the server executes a single Prisma transaction writing both the Order (status: PLACED) and the OrderPayment details. Why: ACID properties guarantee all-or-nothing writes. If the order insertion fails due to a database constraint, the payment log rollback occurs, ensuring we never hold money without a corresponding food order."
      },
      {
        heading: "5. Refunds & Ledger Balancing",
        text: "What Happened: Refunds (partial or full) are processed through the gateway's refund endpoint and written as negative ledger adjustments in our database. Why: Modifying the original transaction row directly creates accounting anomalies. By appending adjustment rows, accounting teams can reconcile Stripe payouts with bank statements to the penny."
      },
      {
        heading: "6. Reconciliation",
        text: "What Happened: Automated daily cron jobs compare our internal OrderPayment ledgers against Stripe's bank transfer statements. Why: Bank processing fees, FX adjustments, or silent gateway glitches can cause discrepancies. Reconciliation matches every checkout transaction with bank deposits to prevent financial leakage."
      },
      {
        heading: "7. Fraud & Resiliency Scenarios",
        text: "What Happened: The system is designed to handle fake callback injections, duplicate payments, lost webhooks, gateway timeouts, and network retry loops. Why: If Stripe goes offline, webhook alerts fail. We queue incoming webhooks in Redis and retry them with exponential backoff, preventing lost states."
      }
    ],
    failures: {
      disaster: "The client hits 'Pay' and the network blips. They tap it again. Without protections, the payment gateway processes the charge twice, leading to double-billing and user frustration.",
      recovery: "Every payment request carries a unique, deterministic `idempotency_key` generated from the cart hash. The gateway reads this key, detects the duplicate request, and returns the cached first response without recharging."
    },
    scalingStats: {
      "10": "Synchronous webhook callbacks are processed immediately on a single instance.",
      "100k": "Spike loads on popular meal hours delay payment processing. We queue webhooks in Redis and process them asynchronously via background workers.",
      "1M": "Gateway callback bursts can trigger DDoS-like load. We deploy a global rate-limiting gateway (like Cloudflare) and verify webhook signatures in distributed serverless functions."
    },
    anchors: [
      { name: "payment.service.ts", path: "apps/backend/src/services/payment.service.ts" },
      { name: "apiClientProvider", path: "apps/mobile-app/lib/core/providers/api_client.dart" }
    ],
    industry: "Stripe and Adyen enforce mandatory idempotency keys on all API endpoints. Stripe has a dedicated ledger system to guarantee that transaction charges occur exactly once.",
    professorHooks: {
      simpler: {
        title: "Explain Simpler",
        emoji: "🧠",
        content: "Think of buying movie tickets. You hand your card to the cashier. If the card machine freezes, you don't keep swiping unless you want to buy 5 tickets! Instead, the system uses a unique transaction ID. If the machine sees the exact same ID, it says 'I already processed this ticket, here you go!' without charging you again."
      },
      deeper: {
        title: "Explain Deeper",
        emoji: "🔬",
        content: "When a payment request hits the server, we calculate a SHA-256 checksum of the cart. This serves as the idempotency key. We store this key in Redis with a 24-hour TTL using SETNX to guarantee atomicity. If Stripe sends a webhook, we verify the signature by taking the request body, prepending the Stripe-Signature timestamp, hashing it using HMAC SHA-256 with the webhook secret, and doing a constant-time comparison."
      },
      alternatives: {
        title: "Show Alternatives",
        emoji: "⚖️",
        content: "We rejected direct client-side callbacks to mark orders paid. While client callbacks feel faster (no webhook lag), they are easily intercepted and spoofed using tools like Postman or Charles Proxy. Webhooks are server-to-server, and signature verification guarantees they originated from Stripe, not a clever user's terminal."
      },
      failures: {
        title: "Show Failures",
        emoji: "💥",
        content: "A webhook could be lost due to network issues or our backend being temporarily down. If we didn't have webhook retries, the customer's order would remain 'PENDING' indefinitely while Stripe has taken their money. To fix this, we store the Stripe PaymentIntent ID and configure Stripe to retry webhook delivery with exponential backoff."
      },
      code: {
        title: "Show Burger Farm Code",
        emoji: "🛠️",
        content: "Inspect payment.service.ts. It uses stripe.webhooks.constructEvent(body, signature, secret) to mathematically verify signatures. In mobile-app/lib/core/providers/api_client.dart, the client interceptor injects the X-Idempotency-Key UUID header in all payment requests."
      }
    }
  },
  
  delivery: {
    title: "Delivery World",
    sub: "Geofencing & Serviceability",
    desc: "Determining store delivery boundaries using geographical coordinates and spatial check systems.",
    tint: "teal",
    simulatorName: "none",
    codex: [
      {
        heading: "What We Do",
        text: "When a user adds an address, the backend checks if the store serves that latitude/longitude boundary. This is geofencing—determining if a coordinate falls inside a polygon representing the store's delivery zone."
      },
      {
        heading: "Why This Way",
        text: "We do not let the mobile app decide serviceability because a user could bypass the checks by spoofing GPS coordinates, forcing drivers to make unprofitable long-distance trips. Serviceability rules are server-side only."
      },
      {
        heading: "Alternatives Considered",
        text: "We rejected calling the Google Maps distance API for every address check because it costs $5+ per 1000 requests. Instead, we use local ray-casting polygons in-memory to filter coordinates first, only using Google APIs for final distance routing."
      }
    ],
    failures: {
      disaster: "The geofence algorithm fails on boundaries, marking valid nearby addresses as 'unserviceable' or allowing orders for address locations 50 miles away.",
      recovery: "We run a spatial boundary checker using Postgres PostGIS. Addresses near boundaries are checked against buffer zones, and fallback stores are automatically mapped."
    },
    scalingStats: {
      "10": "In-memory geometry calculations are extremely fast (sub-millisecond).",
      "100k": "CPU overhead increases as addresses grow. We move polygon intersection checks to database spatial indexes (PostgreSQL GiST indices).",
      "1M": "Database lookups during spikes slow down. We cache active delivery zone coordinates inside Redis using geospatial data structures (GEOSEARCH)."
    },
    anchors: [
      { name: "delivery.service.ts", path: "apps/backend/src/services/delivery.service.ts" }
    ],
    industry: "Swiggy and Zomato partition cities into H3 hexagonal indices (developed by Uber) to perform ultra-fast serviceability, driver dispatch, and surge-pricing calculations.",
    professorHooks: {
      simpler: {
        title: "Explain Simpler",
        emoji: "🧠",
        content: "Imagine drawing a delivery boundary circle on a map with a crayon. When a customer orders, we check if their home pin falls inside the crayon circle. Instead of using a crayon, the computer does math (checks if the coordinate coordinates match the boundary boundary coordinates) to verify serviceability instantly."
      },
      deeper: {
        title: "Explain Deeper",
        emoji: "🔬",
        content: "We use the Ray-Casting algorithm (Jordan Curve Theorem). We draw an infinite horizontal line starting from the user's coordinate and count how many times it intersects the store's boundary polygon edges. If the number of intersections is odd, the coordinate is inside the geofence; if even, it is outside."
      },
      alternatives: {
        title: "Show Alternatives",
        emoji: "⚖️",
        content: "We rejected calling Google Maps Distance Matrix API on every click. A single call costs money and takes 500ms+. By running ray-casting locally, we filter 95% of invalid requests in 0.2ms for free, only calling Google Maps for exact courier routes after order confirmation."
      },
      failures: {
        title: "Show Failures",
        emoji: "💥",
        content: "If a user lives exactly on the geofence border, floating point precision discrepancies between the client's GPS and server math can cause their address to toggle between serviceable and unserviceable. We solve this by applying a 50-meter buffer zone around our polygons."
      },
      code: {
        title: "Show Burger Farm Code",
        emoji: "🛠️",
        content: "Look at delivery.service.ts. It loads the store's geofence polygon coordinate array from PostgreSQL and executes the rayCastCheck(userLocation, polygon) math function in the service logic."
      }
    }
  },
  
  loyalty: {
    title: "Loyalty World",
    sub: "Immutable Double-Entry Ledgers",
    desc: "Modeling reward points earning and redeeming like a banking ledger to prevent points double-spend fraud.",
    tint: "purple",
    simulatorName: "loyalty",
    codex: [
      {
        heading: "What We Do",
        text: "Every reward point earned (e.g. from buy-order) or redeemed (e.g. for discount) is written as an immutable row in the LoyaltyTransaction table, storing the points change and balance snapshot."
      },
      {
        heading: "Why This Way",
        text: "We reject storing loyalty points as a single integer column (e.g., `user.points = 100`). If a database corruption or concurrent tap occurs, the value becomes wrong, and we have no transaction history to audit or rebuild the balance."
      },
      {
        heading: "Alternatives Considered",
        text: "We rejected mutable database updates. We chose an append-only transaction ledger. The current balance is simply the sum of all transaction logs, matching financial systems."
      }
    ],
    failures: {
      disaster: "A customer opens the app on two devices and clicks 'Redeem' simultaneously. Both requests read a positive balance, processing twice and leaving the customer with a negative points balance.",
      recovery: "We use optimistic concurrency control. Each user record has a `version` field. When writing a loyalty transaction, the update checks `WHERE version = current_version`. If another thread updated it first, the version mismatch aborts the second redemption."
    },
    scalingStats: {
      "10": "A simple SUM query on the ledger table calculates the current balance instantly.",
      "100k": "Summing millions of rows on every page load slows down. We cache the running balance in Redis, updating it alongside the database ledger write.",
      "1M": "High transaction throughput locks the database. We write transactions to a fast stream (Kafka/Redis Stream) and commit them to the database in micro-batches."
    },
    anchors: [
      { name: "loyalty.service.ts", path: "apps/backend/src/services/loyalty.service.ts" },
      { name: "schema.prisma (LoyaltyTransaction model)", path: "schema.prisma" }
    ],
    industry: "Credit card ledgers (Visa, Mastercard) and banking balances never overwrite numbers; they are strictly append-only transaction ledgers. Balance is derived, not mutated.",
    professorHooks: {
      simpler: {
        title: "Explain Simpler",
        emoji: "🧠",
        content: "Imagine a savings book. You don't rub out the old balance and write the new one when you get money. You write a line: '+10 points', and compute the total. If we just overwrote a single number in the database, we couldn't prove where your points came from or find out why they disappeared!"
      },
      deeper: {
        title: "Explain Deeper",
        emoji: "🔬",
        content: "To prevent double-spending reward points during concurrent calls, we use Optimistic Concurrency Control (OCC). Every user record has a version column. When redeeming points, the transaction does: UPDATE User SET balance = balance - 50, version = version + 1 WHERE id = ? AND version = ?. If the version changed in between, the query returns 0 rows updated, and we roll back the transaction."
      },
      alternatives: {
        title: "Show Alternatives",
        emoji: "⚖️",
        content: "We rejected storing points as a mutable field in the User record because it is vulnerable to write skew and provides zero audit trace. We opted for a double-entry ledger where every point is either a credit (earned) or a debit (redeemed), making auditing simple and transaction logs immutable."
      },
      failures: {
        title: "Show Failures",
        emoji: "💥",
        content: "If a user logs into two devices and clicks 'Redeem 100 Points' at the exact same millisecond, without OCC or locking, both API threads would read their balance as 150 points. Both check constraints pass, both write redemption logs, and the user gets 200 points worth of discounts, leaving them with -50 points."
      },
      code: {
        title: "Show Burger Farm Code",
        emoji: "🛠️",
        content: "Look at loyalty.service.ts. It performs database-level transactions that write the LoyaltyTransaction log and updates the User's balance, checking for optimistic lock version conflicts before committing."
      }
    }
  },
  
  pos: {
    title: "POS World",
    sub: "Asynchronous Queue Printing & POS",
    desc: "How incoming order events are buffered in Redis message queues and dispatched to offline-prone kitchen printers without duplicate tickets.",
    tint: "blue",
    simulatorName: "pos",
    codex: [
      {
        heading: "1. Kitchen POS & Printers",
        text: "In a high-volume kitchen, order tickets must print physically. We reject direct synchronous HTTP pushes from the checkout server because printers often go offline (paper jams, power blips)."
      },
      {
        heading: "2. Asynchronous Queue Dispatch",
        text: "We buffer print jobs in Redis/Kafka queues. The checkout server completes immediately, returning a success page to the user, while worker threads push tickets to the printer in the background, achieving eventual consistency."
      },
      {
        heading: "3. Deduplication & Retry Loops",
        text: "Every print job has a unique order UUID. If the printer times out or fails, the worker retries. If the connection reconnects, the printer verifies the UUID in its local storage before printing to avoid double-cooking."
      }
    ],
    failures: {
      disaster: "A kitchen printer goes offline due to a paper jam. When restarted, the system re-sends all pending requests without verification, printing duplicates and causing double-cooking waste and kitchen chaos.",
      recovery: "We assign an immutable print job ID to each ticket. The printer controller logs printed IDs in local SQLite. On reconnect, duplicate ticket IDs are silently acknowledged and discarded."
    },
    scalingStats: {
      "10": "Printers connect directly via websocket. Simple print calls execute synchronously in-memory.",
      "100k": "Multiple stores create high print traffic. We run a centralized Redis queue buffer for each store and handle disconnects asynchronously.",
      "1M": "Thousands of stores process order bursts. We stream jobs through Kafka to localized POS Store Controllers, completely separating the cloud backend from local store hardware dependencies."
    },
    anchors: [
      { name: "pos.service.ts", path: "apps/backend/src/services/pos.service.ts" },
      { name: "printer_controller.dart", path: "apps/pos-app/lib/services/printer_controller.dart" }
    ],
    industry: "Swiggy and Zomato route orders to store-level terminals (POS) using MQTT protocols, queuing requests locally and verifying receipts to guarantee single-print safety.",
    professorHooks: {
      simpler: {
        title: "Explain Simpler",
        emoji: "🧠",
        content: "Think of a ticket window at a train station. If the printer jams, the clerk doesn't stop selling tickets. They write them down on a clipboard. Once the paper is fixed, they print all the buffered tickets in order. This is how our print queue operates."
      },
      deeper: {
        title: "Explain Deeper",
        emoji: "🔬",
        content: "When checkout succeeds, the server appends a job to a Redis list using RPUSH. A POS worker runs a continuous BRPOP loop, taking jobs from the queue and sending them via a persistent WebSocket connection to the kitchen printer. This decouples the client checkout HTTP request from local hardware availability."
      },
      alternatives: {
        title: "Show Alternatives",
        emoji: "⚖️",
        content: "We rejected synchronous HTTP POST requests from backend to printer endpoints. While simpler, any printer outage would freeze the checkout transaction, causing checkout timeouts for customers if a printer in Bangalore goes offline."
      },
      failures: {
        title: "Show Failures",
        emoji: "💥",
        content: "If a network packet drops during print confirmation, the backend assumes the ticket was lost and triggers a retry. Without client-side deduplication, the printer outputs the same ticket twice. We prevent this by checking a local SQLite list of processed order IDs on the print controller."
      },
      code: {
        title: "Show Burger Farm Code",
        emoji: "🛠️",
        content: "Look at pos.service.ts. The enqueuePrintJob() pushes payloads into Redis. The printer_controller.dart implements the WebSocket client that processes incoming JSON messages, logs completion to local storage, and handles reconnection retry loops."
      }
    }
  },

  security: {
    title: "Security World",
    sub: "Stateless Authentication & Tokens",
    desc: "JWT verification, encryption, RBAC permissions, and guarding endpoints from session hijacking.",
    tint: "rose",
    simulatorName: "security",
    codex: [
      {
        heading: "1. JWT & Stateless Auth",
        text: "We use JSON Web Tokens (JWT) for user sessions. The backend signs the token with a private key. We reject querying the database for every API request because it slows down response times. The backend simply verifies the token's cryptographic signature."
      },
      {
        heading: "2. Refresh Token Rotation",
        text: "Access tokens expire in 15 minutes. To get a new one, the client sends a Refresh Token. Each refresh token is single-use: when used, it is rotated. If a stolen refresh token is reused, we instantly revoke the entire family tree of tokens, blocking the attacker."
      },
      {
        heading: "3. Role-Based Access Control (RBAC)",
        text: "Endpoints are protected by authorization middleware. Users hold a role claim (e.g. USER, ADMIN). The middleware reads the role inside the cryptographically signed token and rejects requests to admin routes if the claim is insufficient."
      }
    ],
    failures: {
      disaster: "An attacker intercepts a user's network traffic, steals their JWT, and modifies the role claim to ADMIN inside the token payload, gaining complete access to the admin dashboard.",
      recovery: "The server verifies the JWT signature using the HMAC SHA-256 algorithm with a private secret. If the payload is modified, the signature check fails, the request is rejected, and the event is logged as an intrusion attempt."
    },
    scalingStats: {
      "10": "Stateless verification is performed in CPU memory in less than 1ms.",
      "100k": "Verifying signatures is fast, but secret key storage must be secure. We store keys in environment variables.",
      "1M": "Cryptographic checks load the CPU. We offload JWT verification to an API Gateway (Kong or AWS API Gateway) at the edge before hitting microservices."
    },
    anchors: [
      { name: "auth.middleware.ts", path: "apps/backend/src/middleware/auth.middleware.ts" },
      { name: "auth.routes.ts", path: "apps/backend/src/routes/auth.routes.ts" }
    ],
    industry: "Stripe and AWS verify API key signatures using HMAC SHA-256 or RSA signatures, allowing them to authenticate millions of requests per second without database bottleneck overhead.",
    professorHooks: {
      simpler: {
        title: "Explain Simpler",
        emoji: "🧠",
        content: "Think of a movie ticket with a holographic stamp. The ticket inspector doesn't call the theater office to verify your ticket; they just look at the hologram. If someone tries to write 'VIP' on the ticket, the hologram doesn't match, and they are kicked out."
      },
      deeper: {
        title: "Explain Deeper",
        emoji: "🔬",
        content: "JWTs consist of three parts: Header, Payload, and Signature. The signature is created by base64-encoding the header and payload, joining them with a dot, and hashing it with HMAC SHA-256 using a server-side secret key. The auth middleware splits the incoming token, hashes the payload, and compares it to the signature in constant-time."
      },
      alternatives: {
        title: "Show Alternatives",
        emoji: "⚖️",
        content: "We compared database-backed sessions (Redis) with stateless JWTs. Database sessions can be revoked instantly but require a network call on every request. JWTs are stateless and require zero DB calls, but revocation requires blacklist tracking. We chose stateless JWTs with short expiries and refresh token rotation."
      },
      failures: {
        title: "Show Failures",
        emoji: "💥",
        content: "If the private signing secret is leaked, attackers can forge admin tokens at will. We secure secrets in AWS Secrets Manager and implement automated secret rotation to mitigate leakage risk."
      },
      code: {
        title: "Show Burger Farm Code",
        emoji: "🛠️",
        content: "Inspect auth.middleware.ts. It uses jwt.verify() to check signatures and validates claims. Admin controllers check req.user.role === 'ADMIN' before executing updates."
      }
    }
  },

  analytics: {
    title: "Analytics World",
    sub: "OLTP vs OLAP & Reporting",
    desc: "How transactional checkout databases are isolated from analytical queries to prevent CPU lockups.",
    tint: "indigo",
    simulatorName: "analytics",
    codex: [
      {
        heading: "1. OLTP vs OLAP Databases",
        text: "Online Transaction Processing (OLTP) is optimized for fast, single-row writes (checkout). Online Analytical Processing (OLAP) is optimized for scanning millions of rows (reports). Running heavy reports on checkout databases locks tables and freezes checkouts."
      },
      {
        heading: "2. Read Replicas & Database Isolation",
        text: "We deploy Read Replicas of our primary database. Transaction writes go to the primary writer. Analytical dashboards route their heavy SELECT queries to the read-only replicas, keeping checkout response times completely unaffected."
      },
      {
        heading: "3. Event Pipelines & clickstream tracking",
        text: "Rather than logging every user click to our relational database, we pipe clickstream data asynchronously through an event stream to a time-series or columnar database, keeping transactional databases clean and lightweight."
      }
    ],
    failures: {
      disaster: "An admin loads a 'Sales Funnel Report for the Last 5 Years' during a high-traffic meal hour. The heavy database scan exhausts connection pools, checkout queries queue up, and customers get checkout timeout errors.",
      recovery: "We configure database routing. Analytical queries are directed to a read replica. If the replica gets overloaded, checkouts on the primary write database continue uninterrupted."
    },
    scalingStats: {
      "10": "Reports run directly on the primary database with minimal impact.",
      "100k": "Primary CPU spikes during reports. We replicate data to a Read Replica and route all admin dashboards there.",
      "1M": "Replica storage becomes too slow. We stream checkout events to ClickHouse (a columnar database) for sub-second analytical reporting over billions of rows."
    },
    anchors: [
      { name: "dashboard.tsx", path: "apps/admin-panel/src/pages/dashboard.tsx" }
    ],
    industry: "Netflix and Uber capture clickstream events via Kafka and route them to data warehouses like Snowflake, keeping checkout databases 100% isolated.",
    professorHooks: {
      simpler: {
        title: "Explain Simpler",
        emoji: "🧠",
        content: "Imagine a restaurant where the accountant stops the chefs to count all the plates in the middle of dinner service! The customers wait, and the food gets cold. Instead, the accountant should copy the receipts at the end of the day and do their calculations separately."
      },
      deeper: {
        title: "Explain Deeper",
        emoji: "🔬",
        content: "We separate transactional (OLTP) write pools from reporting (OLAP) read pools. Postgres replication stream copies data asynchronously from primary to replica. Our database connection manager routes read operations to the replica port, ensuring checkout connection pools are never exhausted by long-running aggregates."
      },
      alternatives: {
        title: "Show Alternatives",
        emoji: "⚖️",
        content: "We weighed real-time aggregates in Postgres against pre-aggregated tables (Materialized Views). Pre-aggregates load instantly but are stale. Real-time replica queries are fresh but cost hardware resource overhead. We chose read-only replicas for reporting to get fresh data safely."
      },
      failures: {
        title: "Show Failures",
        emoji: "💥",
        content: "Asynchronous replication introduces replication lag (e.g. reports show transactions 5 seconds after they occur). If the replica lags too far behind, reports look outdated. We monitor replica lag metrics and trigger alarms if lag exceeds 60 seconds."
      },
      code: {
        title: "Show Burger Farm Code",
        emoji: "🛠️",
        content: "Look at dashboard.tsx. It queries replica endpoints to load sales totals and item popularity charts, keeping the checkout server free of heavy reporting SQL load."
      }
    }
  },

  deployment: {
    title: "Deployment World",
    sub: "Containers, Load Balancers & Rollouts",
    desc: "How software builds are packed into containers and deployed across distributed networks without causing service downtime.",
    tint: "rose",
    simulatorName: "deployment-explorer",
    codex: [
      {
        heading: "1. Virtualization & Containers",
        text: "Containers package your code, runtime, system tools, and libraries into a single lightweight image. Rather than spinning up full guest operating systems (VMs), containers share the host kernel. This makes them start in milliseconds and use fractional resources."
      },
      {
        heading: "2. Load Balancers & Traffic Routing",
        text: "A load balancer distributes user requests across a pool of healthy backend containers. Using algorithms like Round Robin, Least Connections, or Sticky Sessions, it prevents any single server from overload and shields users from container failures."
      },
      {
        heading: "3. Deployment Rollouts (Rolling & Canary)",
        text: "Rolling deployments update containers incrementally (e.g. 25% at a time), ensuring the system maintains capacity with zero downtime. Canary releases route a fraction of production traffic (e.g. 5%) to the new build to verify health before full rollout."
      }
    ],
    failures: {
      disaster: "A rolling deployment releases a version containing a missing production environment secret key. The containers crash-loop during startup, but because health probes are not configured, the load balancer continues routing user traffic to the dead containers, causing a complete checkout blackout.",
      recovery: "We configure liveness and readiness probes. If a container fails to start or crashes, Kubernetes catches the failure, keeps traffic routed to the old version (v1), halts the rollout, and triggers an automatic rollback to the last healthy state."
    },
    scalingStats: {
      "10": "We run a single VPS and deploy code using simple git pulls or file copies directly.",
      "100k": "Manual server updates become slow and risky. We package the app in Docker and run multiple containers behind an Nginx load balancer.",
      "1M": "Managing hundreds of containers manually is impossible. We use Kubernetes (K8s) to automate container scheduling, auto-scaling, health checks, and rolling updates."
    },
    anchors: [
      { name: "Dockerfile", path: "Dockerfile" },
      { name: "docker-compose.yml", path: "docker-compose.yml" },
      { name: "k8s-deployment.yaml", path: "k8s/deployment.yaml" }
    ],
    industry: "Netflix uses automated Spinnaker pipelines to run Canary deployments, routing a tiny slice of traffic to new builds and automatically aborting rollouts if latency or error rates spike.",
    professorHooks: {
      simpler: {
        title: "Explain Simpler",
        emoji: "🧠",
        content: "Imagine a restaurant with food trucks. A container is a fully-equipped food truck. If a truck breaks down, you don't repair it on the street; you just tow a brand-new truck to the site. The ingredients storage (volume) is kept separate, so when the truck changes, the food is still there! The load balancer is a host directing customers to the truck with the shortest line."
      },
      deeper: {
        title: "Explain Deeper",
        emoji: "🔬",
        content: "Kubernetes orchestrates containers using Pods (the smallest deployable unit) and Deployments (which declare the desired state, like '4 replicas of image v2'). A rolling update scales up the new ReplicaSet (v2) while scaling down the old one (v1). Readiness probes check if the container's /health endpoint returns 200 before routing traffic via the Service (load balancer) proxy."
      },
      alternatives: {
        title: "Show Alternatives",
        emoji: "⚖️",
        content: "We weighed Blue-Green deployments against Rolling updates. Blue-Green spins up a duplicate production environment (Green), switches all traffic via the router, and keeps the old (Blue) for quick rollback. This requires double the server resources. Rolling updates update containers gradually on the same cluster, saving resources but risking mixed-version traffic API compatibilities."
      },
      failures: {
        title: "Show Failures",
        emoji: "💥",
        content: "Without a readiness probe, a newly started container is marked healthy instantly. If the container crashes after 2 seconds due to an unhandled exception or missing environment secret, it creates a black hole: requests are routed to it and fail. Readiness probes verify stable operation before exposure."
      },
      code: {
        title: "Show Burger Farm Code",
        emoji: "🛠️",
        content: "Check k8s-deployment.yaml. It specifies replica counts, environment variables mapped to Kubernetes Secrets, and readinessProbe/livenessProbe configurations with initialDelaySeconds and periodSeconds."
      }
    }
  }
};
