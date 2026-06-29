// Databases & data, in depth.
// Each entry is rendered by components/TechArticle.jsx. Inline markup in strings:
//   `code`  and  **bold**.
// Pure data — no imports. An OBJECT keyed by slug. New kebab-case slugs only.
export const DATA_DEEP = {
  // ─────────────────────────── DATABASE INDEXES ───────────────────────────
  "database-indexes": {
    slug: "database-indexes",
    title: "Database indexes — B-trees, composite & covering",
    category: "Databases",
    color: "teal",
    tagline: "A pre-sorted lookup structure that lets the database jump straight to the rows you want instead of reading every one.",
    oneLiner: "An index is a separate, sorted data structure (almost always a B+-tree) that maps column values to row locations, so a query can find matching rows in a few steps instead of scanning the whole table — at the cost of extra storage and slower writes.",
    what: [
      "A table without an index is just a pile of rows. To answer 'find the user with email X', the database has no choice but to read every row and check — a **full table scan**. On a thousand rows that's instant; on a hundred million it's a disaster. An **index** is a second, pre-sorted structure built over one or more columns that lets the database jump almost directly to the matching rows, the way a book's index lets you find a topic without reading every page.",
      "The structure underneath is almost always a **B-tree**, or more precisely a **B+-tree**: a shallow, wide, balanced tree where each node holds many keys and points to child nodes, and all the actual values live in the leaf level, which is itself a linked list. Because it's wide and balanced, even a billion rows sit only three or four levels deep — so a lookup is three or four steps, not a billion. The leaves being linked is what makes **range** queries ('all orders between two dates') and `ORDER BY` cheap: you find the start and walk sideways.",
      "Two ideas turn a basic index into a powerful one. A **composite index** covers several columns in order — `(customer_id, created_at)` — and works like a phone book sorted by last name then first name: brilliant for 'this customer's orders newest-first', useless for searching by `created_at` alone. A **covering index** includes every column a query needs, so the database answers entirely from the index and never touches the table at all — the fastest read there is.",
    ],
    analogy: {
      title: "The index at the back of a textbook",
      body: "Without an index, finding every mention of 'mitochondria' means reading all 900 pages cover to cover. The back-of-book index is a separate, alphabetically sorted list — 'mitochondria … pages 88, 204, 511' — so you flip straight there. A composite index is like a list sorted by chapter then topic: perfect if you know the chapter, unhelpful if you only know the topic. And a covering index is a footnote so complete you get your answer from the index entry itself and never turn to the page. The catch is the same as a real book: every time the content changes, the index has to be reprinted too.",
    },
    insideTitle: "The pieces of an index",
    inside: [
      { name: "B+-tree", desc: "A wide, balanced tree with all values in a linked leaf level. Shallow depth means any lookup is a handful of steps even on huge tables." },
      { name: "Primary vs secondary index", desc: "The primary (often the primary key) usually dictates row storage order; secondary indexes are extra trees pointing back at rows." },
      { name: "Composite index", desc: "An index on several columns in a fixed order. Usable left-to-right only — its leftmost-prefix rule decides which queries it can help." },
      { name: "Covering index", desc: "An index that already holds every column a query reads, so the engine answers from the index alone — no trip to the table." },
      { name: "Selectivity / cardinality", desc: "How many distinct values a column has. High-selectivity columns (email) make great indexes; low-selectivity ones (a boolean flag) rarely do." },
      { name: "Other index types", desc: "Hash (exact-match only), GIN/GiST (full-text, arrays, geo), and partial indexes (only rows matching a condition) for specialized jobs." },
    ],
    how: [
      "When you declare an index, the database builds the B+-tree by reading the column values and sorting them into the tree, then keeps it updated on every write. A `SELECT ... WHERE email = ?` now descends the tree — root to branch to leaf — finds the matching key, and follows the pointer to the full row. A range query (`created_at BETWEEN ...`) finds the lower bound and walks the linked leaves until the upper bound, reading only the slice it needs.",
      "Composite indexes obey the **leftmost-prefix rule**: an index on `(a, b, c)` can serve queries filtering on `a`, on `a` and `b`, or all three — but **not** one filtering on `b` alone, because the data is sorted by `a` first. This is why column *order* in a composite index is a real design decision: put the column you always filter by equality on first, the range column last. Get the order wrong and the index sits unused.",
      "The database doesn't blindly use an index — the **query planner** estimates, from statistics about each column's distribution, whether the index actually saves work. If a query would match most of the table, a full scan is genuinely faster (jumping around to fetch scattered rows is slower than reading them all in order), so the planner skips the index. You confirm what it actually chose with `EXPLAIN`.",
    ],
    why: [
      "Indexes are the single biggest lever on read performance. The difference between an indexed and an unindexed lookup on a large table is the difference between sub-millisecond and seconds — between a snappy app and timeouts. Almost every slow query in production traces back to a missing or mis-ordered index, and adding the right one is often a one-line fix with a hundredfold payoff.",
      "But indexes are not free, and that's the whole tension. Each one is extra storage, and — crucially — every `INSERT`, `UPDATE`, and `DELETE` must update every index on the table, so writes get slower as indexes pile up. The art is indexing exactly the columns your real queries filter and sort by, and no more: enough to make reads fast, few enough to keep writes cheap.",
    ],
    alternatives: [
      { name: "Full table scan", note: "No index — read every row. Genuinely best when the table is tiny or the query matches most of it; catastrophic on large selective lookups." },
      { name: "Hash index", note: "A hash table instead of a tree: O(1) exact-match lookups, but useless for ranges or ordering. Niche; B-trees are the default for a reason." },
      { name: "Covering / included columns", note: "Bolt extra read-only columns onto an index so it answers a query alone. Bigger index, but skips the table fetch entirely." },
      { name: "Materialized views / denormalization", note: "Pre-compute the answer instead of indexing the inputs. Faster reads still, at the cost of staleness and refresh logic." },
    ],
    whoUses: "Every backend and data engineer who has ever watched a query get slow. Application teams add indexes as their tables grow; DBAs and platform teams audit them, drop unused ones, and tune composite order. ORMs (Prisma, Rails, Django) let you declare indexes in the schema, and tools like `pg_stat_statements` and the query planner's `EXPLAIN ANALYZE` are how you find which index is missing. It is one of the most universal performance skills in software.",
    bigPicture: "Indexes are the speed layer under **SQL** and **PostgreSQL**, and the thing **query optimization** spends most of its effort deciding whether to use. They are why an **OLTP** database can fetch one row instantly, and the columnar layout of **data lakes and warehouses** is the analytical answer to the same 'don't read what you don't need' problem. As data grows beyond one machine, indexing pairs with **partitioning and sharding** — each shard keeps its own indexes — and the **connection-pooling** and **caching** layers sit in front to absorb the reads indexes make cheap.",
    prereqs: ["sql", "postgresql", "data-structures-overview"],
    projects: [
      "Load a table with a million rows, run a `WHERE` lookup on an unindexed column and time it, then add a B-tree index and time it again — and use `EXPLAIN` to watch the plan flip from a sequential scan to an index scan.",
      "Create a composite index on `(customer_id, created_at)` and prove the leftmost-prefix rule: confirm it speeds up a query filtering by `customer_id`, but is ignored by one filtering only on `created_at`.",
      "Add the columns a `SELECT` reads into the index so it becomes covering, then check `EXPLAIN` shows an index-only scan with no table access — and measure how many writes per second you lose to maintaining three indexes versus one.",
    ],
    breaks: "Index every column 'just in case' and your writes crawl while half the indexes are never used, wasting storage and slowing every insert. Get composite column order backwards and the planner quietly ignores the index you were counting on. Index a low-cardinality column (a status flag with three values) and the planner skips it anyway because a scan is cheaper. Wrap an indexed column in a function (`WHERE lower(email) = ?`) and the index can't be used — the value it stored no longer matches. And forget that a write-heavy table pays for every index on every write, so the right number of indexes is the smallest set that makes your real queries fast.",
    scale: "Local: a primary-key index on a small SQLite or Postgres table — every lookup is fast because there's barely any data. Production: deliberate B-tree indexes on the columns your real queries filter and sort by, a few well-ordered composite indexes, and `EXPLAIN ANALYZE` in your toolkit to catch the slow ones. Enterprise: index audits that drop the unused, partial and covering indexes tuned to specific hot queries, and write-path budgets that cap how many indexes a hot table may carry. Planet-scale: indexes maintained per shard across a partitioned fleet, specialized structures (GIN for search, geo indexes) alongside the B-trees, and online index builds so adding one never locks a table serving millions of requests a second.",
    related: ["sql", "postgresql", "query-optimization", "oltp-vs-olap", "data-structures-overview", "trees-and-bsts"],
  },

  // ─────────────────────────── QUERY OPTIMIZATION ───────────────────────────
  "query-optimization": {
    slug: "query-optimization",
    title: "Query optimization — the planner & EXPLAIN",
    category: "Databases",
    color: "teal",
    tagline: "How the database turns your SQL into a step-by-step execution plan, picks the cheapest one, and how you read it when it picks wrong.",
    oneLiner: "Query optimization is the database's job of translating declarative SQL into the cheapest physical execution plan — choosing scan methods, join algorithms, and join order from cost estimates built on table statistics — and EXPLAIN is the window that shows you the plan it chose.",
    what: [
      "SQL is **declarative**: you say *what* you want ('these columns where this is true, joined to that, ordered this way'), not *how* to get it. Something has to decide the *how* — which index to use, whether to scan, in what order to join three tables, which join algorithm. That something is the **query planner** (or optimizer), and for a query touching several tables there can be thousands of valid ways to execute it, ranging from milliseconds to minutes.",
      "The planner picks by **cost estimation**. It keeps **statistics** about each table — row counts, how many distinct values a column has, how values are distributed — and uses them to *estimate* how many rows each step will produce and how much work it'll cost. It then chooses the plan with the lowest estimated cost. The estimate is everything: when the statistics are stale or the data is skewed, the planner guesses wrong and picks a bad plan even though the database is healthy.",
      "**EXPLAIN** is how you see the plan: a tree of operations the database *will* run — sequential scan, index scan, nested-loop join, hash join, sort. **EXPLAIN ANALYZE** actually runs it and shows estimated *versus actual* row counts, which is the single most useful diagnostic in databases: a step that estimated 10 rows but produced 2 million tells you exactly where the planner was fooled, and that's almost always the root of a slow query.",
    ],
    analogy: {
      title: "A GPS planning a route",
      body: "You tell the GPS the destination (declarative — *what*), not which roads to take. It considers many possible routes and picks the fastest using its map data: typical speeds, distances, known traffic (the statistics). If that data is out of date — a new road it doesn't know, a jam it can't see — it confidently routes you the slow way even though the car runs fine. EXPLAIN is asking the GPS to show you the route before you drive; EXPLAIN ANALYZE is driving it and comparing the predicted travel time against the actual clock, so you can see exactly which leg blew the estimate.",
    },
    insideTitle: "The pieces of the optimizer",
    inside: [
      { name: "Parser & rewriter", desc: "Turns SQL text into an internal tree and applies rule-based simplifications before any costing begins." },
      { name: "Statistics", desc: "Per-column row counts, distinct values, and distribution histograms the planner uses to estimate how many rows each step yields." },
      { name: "Cost model", desc: "A formula weighing disk reads, CPU, and memory to assign each candidate plan a number; the lowest-cost plan wins." },
      { name: "Scan methods", desc: "Sequential scan (read all rows), index scan (use a B-tree), or index-only scan (covering index) — the ways to read a single table." },
      { name: "Join algorithms", desc: "Nested-loop (small inputs), hash join (large unsorted inputs), merge join (already-sorted inputs) — and choosing the join order matters most of all." },
      { name: "EXPLAIN / EXPLAIN ANALYZE", desc: "Show the chosen plan, and (ANALYZE) run it to compare estimated vs actual rows and time — the core debugging tool." },
    ],
    how: [
      "When a query arrives, the database parses it, rewrites it into a logical form, then enumerates candidate **physical plans**: for each table, a scan method; for each join, an algorithm and an order. Using its statistics it estimates the row count and cost of each step, multiplies them up the tree, and keeps the cheapest overall plan. All of this happens in milliseconds before a single row is read — and the plan may be cached for repeated queries.",
      "**Join order** is where the biggest wins and losses live. Joining the two smallest results first keeps every later step small; joining the wrong pair first can blow up an intermediate result to billions of rows. The planner relies entirely on its row estimates to get this right, which is why a single bad estimate early in the tree cascades into a catastrophically slow plan.",
      "You diagnose with `EXPLAIN ANALYZE`. You read the tree from the innermost (deepest-indented) node outward, looking for: a sequential scan where an index should apply, an estimated-vs-actual row mismatch (the planner was misled), a join algorithm that doesn't fit the data sizes, or an unexpected sort. The fixes are usually one of: refresh statistics (`ANALYZE`), add or reorder an index, rewrite the query so the planner can use one, or raise the statistics target on a skewed column.",
    ],
    why: [
      "Without an optimizer, you'd have to hand-write the execution strategy for every query — choosing indexes and join orders manually — and rewrite it whenever the data shape changed. The planner does this automatically and re-decides as the data grows, which is the entire reason SQL can be declarative. It's one of the most sophisticated pieces of any database, and it's why the same query stays fast as a table goes from thousands to millions of rows.",
      "But the optimizer is only as good as its estimates, and that's why *you* still need to understand it. The most common production performance fire is not a missing feature — it's a query that 'suddenly' got slow because statistics went stale or data grew skewed, and the planner flipped to a bad plan. Reading `EXPLAIN ANALYZE`, spotting the estimate that's off by orders of magnitude, and nudging the planner back on track is a core, evergreen engineering skill.",
    ],
    alternatives: [
      { name: "Query hints / forced plans", note: "Override the optimizer to force a specific index or join. A last resort — it fixes today's plan but ignores tomorrow's data, and rots over time." },
      { name: "Rewriting the query", note: "Restructure the SQL so the planner naturally picks a better plan (avoid functions on indexed columns, break up a monster query). Usually the right fix." },
      { name: "Materialized views", note: "Pre-compute and store an expensive result, so the planner reads a small table instead of optimizing a huge join every time. Trades freshness for speed." },
      { name: "Caching the result", note: "Skip the database entirely for repeated reads (see caching). Doesn't make the query faster — avoids running it at all." },
    ],
    whoUses: "Every engineer who writes SQL that runs against real data, and especially backend and data engineers chasing a slow endpoint or dashboard. DBAs live in `EXPLAIN ANALYZE`; analytics engineers tune warehouse queries the same way. Every serious database — PostgreSQL, MySQL, SQL Server, and the cloud warehouses (BigQuery, Snowflake, Redshift) — ships a cost-based optimizer, so the skill of reading a plan transfers everywhere.",
    bigPicture: "Query optimization sits directly on top of **database indexes** — most of what the planner decides is *whether and which* index to use — and is the brain behind **SQL** and **PostgreSQL**. It's where **OLTP** point-lookups and **OLAP** big-scan analytics diverge, since the warehouses of **data lakes and warehouses** optimize for scanning columns rather than seeking rows. When optimization isn't enough, you reach for **caching** to avoid the query, or **partitioning and sharding** to give the planner less data to work through in the first place.",
    prereqs: ["sql", "database-indexes", "postgresql"],
    projects: [
      "Run `EXPLAIN ANALYZE` on a slow multi-table join, find the node where estimated rows differ wildly from actual rows, and trace why — usually a stale statistic or a missing index.",
      "Take a query the planner runs with a sequential scan, run `ANALYZE` to refresh statistics (or add an index), and watch the plan switch to an index scan — confirming the planner re-decided.",
      "Write the same logical query two ways — one wrapping an indexed column in a function, one not — and use EXPLAIN to show only the second can use the index, demonstrating how query shape steers the planner.",
    ],
    breaks: "Let statistics go stale after a big load and the planner estimates against old row counts, choosing a plan that was right yesterday and ruinous today. Wrap an indexed column in a function or a leading wildcard `LIKE '%x'` and the planner silently abandons the index. Write a query that forces a bad join order on skewed data and one intermediate step explodes to billions of rows. Reach for query hints to force a plan and you freeze a decision that should adapt as data grows. The discipline: keep statistics fresh, read `EXPLAIN ANALYZE` for estimate-vs-actual gaps, and fix the cause rather than overriding the planner.",
    scale: "Local: the planner trivially picks index scans on a tiny database and you rarely think about it. Production: you run `EXPLAIN ANALYZE` on slow endpoints, keep auto-`ANALYZE` healthy, and fix the occasional bad plan by adding an index or rewriting a query. Enterprise: plan regressions are monitored, slow-query logs and `pg_stat_statements` surface the worst offenders, statistics targets are tuned on skewed columns, and critical queries have reviewed plans. Planet-scale: distributed query planners split work across shards and regions, cost models account for network transfer, adaptive execution re-plans mid-query when estimates prove wrong, and plan stability is a tracked SLO because a single regression can topple a fleet.",
    related: ["sql", "database-indexes", "postgresql", "oltp-vs-olap", "caching", "data-lakes-and-warehouses"],
  },

  // ─────────────────────────── DATABASE REPLICATION ───────────────────────────
  "database-replication": {
    slug: "database-replication",
    title: "Database replication — primaries, replicas & failover",
    category: "Databases",
    color: "teal",
    tagline: "Keeping live copies of your database on other machines — so reads scale out, a dead server doesn't lose data, and the system survives a failure.",
    oneLiner: "Replication continuously copies a database's changes from a primary to one or more replicas, so you can serve reads from the copies, survive the loss of any single machine, and promote a replica to take over when the primary fails — trading some consistency for availability and scale.",
    what: [
      "A single database server is a single point of failure: if its disk dies, your data and your uptime die with it. **Replication** fixes this by keeping live, continuously-updated **copies** of the database on other machines. One node, the **primary** (or leader), accepts all the writes; it streams every change to one or more **replicas** (followers) that apply those changes to stay in sync. Now there are several copies of the truth instead of one.",
      "This buys three distinct things. **Durability and failover**: if the primary dies, a replica already holds the data and can be **promoted** to become the new primary, so you lose neither the data nor (for long) the service. **Read scaling**: read-only queries can be spread across the replicas, so a read-heavy app serves far more traffic than one machine could. **Geographic reach**: replicas in other regions put a local copy near distant users.",
      "The central tension is **synchronous vs asynchronous**. With **async** replication (the common default) the primary commits a write and tells the user 'done' *before* the replicas have it — fast, but a replica may lag behind by milliseconds to seconds, so a read from a replica can be slightly stale (**replication lag**), and a crash at the wrong moment can lose the last few writes. With **synchronous** replication the primary waits for a replica to confirm before saying 'done' — no data loss on failover, but every write is slower and a slow replica drags the whole system down.",
    ],
    analogy: {
      title: "A head chef dictating to line cooks",
      body: "The head chef (primary) is the only one allowed to change the master recipe book; everyone takes their orders from the chef. As the chef makes a change, runners carry the update to several line cooks (replicas) who copy it into their own books, so any cook can answer a diner's question (serve a read). If the head chef collapses, a line cook is instantly promoted to head chef and service barely pauses (failover). Async replication is runners who deliver updates a beat late — fast kitchen, but a cook might quote a recipe that changed seconds ago. Synchronous is the chef refusing to start the next dish until a runner confirms the last update landed — perfectly consistent, but the chef stands waiting.",
    },
    insideTitle: "The pieces of replication",
    inside: [
      { name: "Primary (leader)", desc: "The single node that accepts writes and is the source of truth all replicas copy from." },
      { name: "Replica (follower)", desc: "A node that continuously applies the primary's changes; serves reads and stands ready to be promoted." },
      { name: "Replication log (WAL)", desc: "The stream of changes the primary ships — Postgres streams its write-ahead log; MySQL ships its binlog." },
      { name: "Sync vs async", desc: "Whether the primary waits for a replica to confirm before committing. Sync = no data loss, slower; async = fast, possible lag and loss." },
      { name: "Failover & promotion", desc: "Detecting a dead primary and promoting a replica to replace it — automatic (with a coordinator) or manual." },
      { name: "Replication lag", desc: "How far behind a replica is. The reason a read just after a write may not see it on a replica." },
    ],
    how: [
      "The primary records every change to a **write-ahead log** (WAL in Postgres, binlog in MySQL) — the same log it uses for crash recovery. Replicas connect and stream this log, replaying each change in order to reach the same state. Most setups are **single-leader**: all writes go to one primary, reads can go anywhere. The application (or a proxy like PgBouncer/ProxySQL) routes writes to the primary and load-balances reads across replicas.",
      "On **failover**, a coordinator (Patroni, an orchestrator, or a managed service's control plane) detects the primary is unreachable, picks the most up-to-date replica, promotes it to primary, and redirects traffic. With async replication, any writes the old primary hadn't yet shipped are lost — the **RPO** (how much data you can lose). The time to detect and promote is the **RTO** (how long you're down). Both are tuned by how aggressive the health checks and replication settings are.",
      "Beyond single-leader, there are harder modes. **Multi-leader** lets several nodes accept writes (useful across regions) but creates **write conflicts** when two leaders change the same row — which must be resolved by rules or last-write-wins. **Leaderless** (Dynamo-style, used by Cassandra) writes to several nodes at once and reads from several, using quorums to stay consistent. These scale writes and survive partitions, at the cost of the application having to reason about conflicts and eventual consistency.",
    ],
    why: [
      "Replication is how a database stops being a single point of failure. The moment data matters, you cannot bet the business on one disk: a replica turns 'we lost the database' into 'we promoted a replica and kept running'. It's the foundation of high availability and disaster recovery, and it's table stakes for any production system handling real users or money.",
      "It's also the cheapest way to scale **reads**, which most apps are dominated by — adding replicas multiplies read capacity without touching the write path. The price is the consistency tax: async replicas can serve stale data, so 'read your own write' bugs appear (a user updates their profile, gets routed to a lagging replica, and sees the old value). Choosing where to read, and how much lag and potential loss you'll tolerate, becomes a real design decision.",
    ],
    alternatives: [
      { name: "Single server + backups", note: "One node, periodic backups. Simple and cheap; a failure means downtime and losing everything since the last backup. Fine for low-stakes apps only." },
      { name: "Synchronous replication", note: "Primary waits for a replica before committing. Zero data loss on failover; every write is slower and a slow replica stalls the system." },
      { name: "Multi-leader / leaderless", note: "Several nodes accept writes for cross-region scale and partition tolerance, at the cost of write conflicts and eventual consistency the app must handle." },
      { name: "Sharding (instead of/with)", note: "Split the data so each shard's write load is smaller (see partitioning and sharding). Solves write scale, which replication alone can't; usually combined with it." },
    ],
    whoUses: "Essentially every team running a production relational database. Platform and DBA teams own the replication topology and failover automation; backend teams route reads to replicas and learn to handle lag. Managed databases (Amazon RDS/Aurora, Cloud SQL, Azure Database) make replicas and automatic failover a checkbox, which is why most teams use them. Postgres streaming replication, MySQL replication, and Aurora's shared-storage design are the common foundations.",
    bigPicture: "Replication is the practical engine behind **consistency models** — the strong-vs-eventual choice *is* the sync-vs-async replica choice — and the high-availability half of the classic **replication and partitioning** pairing. It complements **partitioning and sharding** (replication copies for safety and read scale; sharding splits for write scale), relies on the same **transactions** and WAL machinery, and is why a system can promise the durability the **D** in ACID demands even when a whole machine dies. **Caching** and **connection-pooling** sit in front to shed load off the primary.",
    prereqs: ["postgresql", "consistency-models", "transactions"],
    projects: [
      "Set up a Postgres primary and one streaming replica locally, write a row to the primary, and read it from the replica — then deliberately pause the replica and watch replication lag grow.",
      "Route writes to the primary and reads to the replica in a small app, then trigger a 'read-your-own-write' bug by reading from a lagging replica immediately after a write, and fix it by reading that one query from the primary.",
      "Kill the primary and promote the replica to become the new primary, measuring your RTO (time to recover) and reasoning about the RPO (how many un-shipped writes you'd have lost under async replication).",
    ],
    breaks: "Read from an async replica right after a write and the user sees stale data — the classic 'I updated it but it didn't change' bug. Run synchronous replication with one slow replica and every write across the whole system stalls behind it. Forget that async failover loses un-shipped writes and you quietly drop the last few transactions during an outage. Run multi-leader without a conflict-resolution plan and two regions silently overwrite each other. And assuming replicas scale *writes* is the deepest trap — every replica still applies every write, so replication scales reads only; write scale needs sharding.",
    scale: "Local: a single database, maybe one replica for practice — no real availability concern. Production: a primary with one or two async replicas, reads load-balanced across them, automatic failover via a managed service, and a few queries pinned to the primary to dodge lag. Enterprise: multiple replicas per primary, cross-region replicas for DR and locality, monitored replication lag with alerts, and tested failover runbooks with defined RTO/RPO targets. Planet-scale: globally distributed topologies — regional primaries, leaderless or multi-leader designs where writes must scale and survive partitions, quorum reads/writes, and consensus protocols underneath to keep the copies agreeing as machines and whole regions come and go.",
    related: ["consistency-models", "replication-and-partitioning", "partitioning-and-sharding", "transactions", "postgresql", "distributed-consensus"],
  },

  // ─────────────────────── PARTITIONING & SHARDING ───────────────────────
  "partitioning-and-sharding": {
    slug: "partitioning-and-sharding",
    title: "Partitioning & sharding — splitting data to scale writes",
    category: "Databases",
    color: "teal",
    tagline: "Cutting one too-big table or database into many smaller pieces — so no single machine has to hold all the data or take all the writes.",
    oneLiner: "Partitioning splits a large table into smaller pieces, and sharding spreads those pieces across separate machines by a shard key — letting writes and storage scale past what one server can hold, at the cost of cross-shard queries and rebalancing complexity.",
    what: [
      "Replication copies a database so reads scale and failures survive — but every replica still applies *every* write and holds *all* the data, so it can't help when the dataset or the write rate outgrows a single machine. **Partitioning** and **sharding** solve that by *splitting* the data. Partitioning divides one big table into smaller chunks (often within one database); sharding takes those chunks and puts them on *different machines*, so each server owns only a slice of the data and handles only that slice's writes.",
      "Everything hinges on the **shard key** — the column whose value decides which shard a row lives on (user id, tenant id, region). Two common strategies: **range** partitioning ('users A–M here, N–Z there', or 'this month's data on this shard') keeps related rows together and makes range scans easy, but risks **hotspots** if one range gets all the traffic. **Hash** partitioning runs the key through a hash to scatter rows evenly, which spreads load beautifully but destroys locality — a range query now has to ask every shard.",
      "Choosing the shard key is the most consequential — and least reversible — decision. A good key spreads both data and load evenly and keeps the queries you run most often inside a single shard. A bad one creates a hotspot (one celebrity user's shard melts while others idle) or forces **cross-shard queries** and **cross-shard transactions**, which are slow and complex because no single machine can answer them or guarantee atomicity alone. Re-sharding later, once data is live, is famously painful.",
    ],
    analogy: {
      title: "One overflowing filing cabinet becomes a row of them",
      body: "A single filing cabinet works until it's jammed full and clerks queue to use the one drawer. So you buy a row of cabinets and split the files — say, by surname's first letter (range), or by a rule that scatters them evenly (hash). Now many clerks file at once and no cabinet overflows. The rule you split by is the shard key, and it had better be chosen well: split by surname and the cabinet holding all the Smiths overflows again (a hotspot). And a question like 'every file added today' now means opening every cabinet (a cross-shard query) — fast lookups got faster, but broad questions got harder.",
    },
    insideTitle: "The pieces of sharding",
    inside: [
      { name: "Shard key", desc: "The column whose value maps a row to a shard. The single most important — and hardest to change — design choice." },
      { name: "Range partitioning", desc: "Split by contiguous key ranges or time windows. Great locality and range scans; prone to hotspots and uneven fill." },
      { name: "Hash partitioning", desc: "Hash the key to scatter rows evenly across shards. Excellent load spread; range queries must hit every shard." },
      { name: "Hotspot", desc: "A single shard receiving a disproportionate share of data or traffic — the failure mode a bad shard key creates." },
      { name: "Routing layer", desc: "The logic (in the app, a proxy, or the database) that sends each query to the shard(s) holding its data." },
      { name: "Rebalancing / re-sharding", desc: "Moving data when you add shards or a hotspot appears. Consistent hashing minimizes how much must move." },
    ],
    how: [
      "First you partition: split a table by range (e.g. monthly time buckets, or id ranges) or by hash of the shard key. Within one database this already helps — the engine can **prune** partitions it knows can't match a query, scanning far less. To scale *out*, you shard: place partitions on separate database servers, each a full database owning its slice. A **routing layer** — in the application, a proxy (Vitess for MySQL, Citus for Postgres), or the database itself — computes the shard key for each query and sends it to the right machine.",
      "A query that includes the shard key is fast: it goes to exactly one shard. A query that *doesn't* (or spans many) becomes a **scatter-gather** — sent to all shards, with results merged — which is slower and scales poorly, so you design your schema and access patterns to keep the common queries shard-local. **Cross-shard transactions** are worse: guaranteeing atomicity across machines needs two-phase commit or sagas, both heavy, so good designs keep a transaction's rows on one shard.",
      "When you add capacity or a hotspot appears, you **rebalance** — move some rows to new shards. Naive hashing (`key mod N`) is a disaster here: changing `N` remaps almost everything. **Consistent hashing** and **virtual nodes** are the standard fix — they move only a small fraction of data when shards are added or removed. Sharding is almost always combined with replication: each shard has its own replicas, so you get write scale (from sharding) *and* read scale plus failover (from replication) together.",
    ],
    why: [
      "There is a hard ceiling to one machine: a finite disk, a finite write throughput, finite memory. Replication can't lift it because every node still takes every write. Sharding is the answer when you genuinely outgrow a single server — it's the only way to scale **writes** and total storage horizontally, by ensuring each machine is responsible for only a fraction of both. The biggest systems on earth run on it.",
      "But sharding is a serious step up in complexity and should be a *last* resort, reached only after indexing, caching, read replicas, and a bigger box have been exhausted. It complicates every cross-shard query, makes multi-row transactions hard, demands a thoughtful shard key you can't easily change, and turns rebalancing into a project. The discipline is to delay it as long as honestly possible, then choose the shard key with great care.",
    ],
    alternatives: [
      { name: "Vertical scaling (bigger box)", note: "Buy more CPU/RAM/disk for one server. Far simpler; always try first. Hits a hard ceiling and gets expensive at the top end." },
      { name: "Read replicas only", note: "Scale reads by replication without splitting data (see database replication). Solves read load; does nothing for write or storage limits." },
      { name: "Functional / vertical partitioning", note: "Put different tables on different databases (users here, orders there). Easier than sharding one table; doesn't help a single huge table." },
      { name: "NewSQL / distributed SQL", note: "Databases (Spanner, CockroachDB, Vitess) that shard and rebalance automatically under a single SQL interface. Hides the pain at the cost of adopting a new system." },
    ],
    whoUses: "Teams whose dataset or write rate has genuinely outgrown one machine: large social, fintech, gaming, and SaaS platforms. Platform and infra engineers own the shard topology, routing, and rebalancing; product teams must write shard-aware queries. Vitess (YouTube/MySQL), Citus (Postgres), MongoDB's native sharding, and Cassandra's leaderless partitioning are common tools, while distributed-SQL systems (Spanner, CockroachDB) automate it. Most apps never need it — and the ones that do reach for it reluctantly.",
    bigPicture: "Sharding is the write-scaling counterpart to **database replication** (the two together make the **replication and partitioning** pairing), and it's the same 'spread it across machines' idea as the original **sharding** topic, taken deeper into how the split is actually chosen. It depends on **consistency models** (cross-shard reads and writes force eventual-consistency trade-offs), reuses the **distributed-consensus** machinery for cross-shard coordination, and is exactly how the **data lakes and warehouses** layer partitions huge analytical tables. **Database indexes** still live inside each shard, and **caching** sits in front to keep scatter-gather queries rare.",
    prereqs: ["replication-and-partitioning", "consistency-models", "database-replication"],
    projects: [
      "Range-partition a large time-series table by month in Postgres, then run a query for one month and use EXPLAIN to confirm the engine prunes the other partitions and scans only one.",
      "Simulate two shards in code, route rows by hash of a user id, and demonstrate that a query filtering by user id hits one shard while a query by date must scatter-gather across both.",
      "Pick a deliberately bad shard key (e.g. a status flag) to manufacture a hotspot, watch one shard take most of the load, then re-shard on a better key and show the load spreading evenly.",
    ],
    breaks: "Choose a shard key with low cardinality or skewed traffic and you create a hotspot — one shard melts while the rest idle, and you've gained nothing. Run queries that omit the shard key and every read becomes a slow scatter-gather across all machines. Need a transaction spanning two shards and you're forced into two-phase commit or sagas, fragile and slow. Shard with `key mod N` and adding one server reshuffles nearly all your data. And sharding too early — before exhausting indexes, caching, and a bigger box — buys enormous complexity to solve a problem you didn't yet have.",
    scale: "Local: one database, no sharding — you may partition a table by date just to keep queries fast. Production: vertical scaling and read replicas carry you; you partition the biggest tables by time and prune, but everything still fits on one primary. Enterprise: a genuinely large table is sharded by a carefully chosen key across several database servers (Vitess/Citus), each shard replicated, with a routing layer keeping common queries shard-local. Planet-scale: hundreds of shards across regions, consistent hashing and virtual nodes for painless rebalancing, automatic split/merge of hot ranges, and a distributed-SQL layer presenting one logical database over a fleet that serves millions of writes per second.",
    related: ["replication-and-partitioning", "database-replication", "consistency-models", "sharding", "distributed-consensus", "data-lakes-and-warehouses"],
  },

  // ─────────────────────── CHANGE DATA CAPTURE ───────────────────────
  "change-data-capture": {
    slug: "change-data-capture",
    title: "Change data capture (CDC)",
    category: "Data Engineering",
    color: "amber",
    tagline: "Streaming a database's row-level changes out as they happen, by tailing its transaction log — instead of repeatedly re-reading the whole table.",
    oneLiner: "Change data capture turns a database's internal transaction log into a live stream of inserts, updates, and deletes, so other systems — warehouses, caches, search indexes, microservices — stay in sync in near real time without polling or dual-writes.",
    what: [
      "Data created in one place almost always needs to show up elsewhere: your app's database changes, and a warehouse, a search index, a cache, and other services all need to know. The naive fixes are bad. **Polling** ('every minute, re-read everything that changed') is laggy, misses deletes, and hammers the source. **Dual writes** ('write to the database *and* publish an event in the app code') break the moment one succeeds and the other fails, silently drifting the two systems apart.",
      "**Change data capture** solves this at the right layer. Every transactional database already writes a **transaction log** — Postgres's WAL, MySQL's binlog — recording every committed row change for its own crash recovery. CDC **tails that log**: it reads the stream of changes the database is already producing and emits them as a clean feed of events — 'row 42 in `orders` was inserted with these values', 'row 17 was updated', 'row 9 was deleted'. The source database does no extra work beyond what it already does.",
      "This is **log-based** CDC, the modern standard (Debezium is the dominant tool), and it's powerful because it's *complete and ordered*: it captures every change including deletes, in commit order, with before-and-after values, and it can't drift because it reads the same source of truth the database commits to. The events are typically published to **Kafka**, where any number of downstream consumers read them independently — making CDC the bridge between your operational database and the whole event-driven and analytics world.",
    ],
    analogy: {
      title: "A live transcript of a meeting vs re-reading the minutes",
      body: "Polling is walking into a meeting room every few minutes to re-read the entire whiteboard and guess what changed — you miss things that were written and erased between visits, and you annoy everyone by barging in. A dual write is asking the speaker to both say each point *and* separately text it to you — eventually they say something but forget to text, and your notes silently fall out of sync. CDC is wiring a live transcript off the official recording that's already being made: every word, in order, exactly as it was committed, delivered to anyone subscribed — and the meeting carries on completely unaffected.",
    },
    insideTitle: "The pieces of CDC",
    inside: [
      { name: "Transaction log (WAL/binlog)", desc: "The change record the database already writes for recovery. Log-based CDC reads this — the complete, ordered, low-overhead source." },
      { name: "Connector / capture process", desc: "The component (e.g. Debezium) that tails the log, decodes it, and emits structured change events." },
      { name: "Change event", desc: "A message describing one row change — operation (insert/update/delete), before/after values, table, and a position/LSN." },
      { name: "Snapshot + stream", desc: "An initial full read of existing rows, then a switch to streaming only new changes — so consumers start with the whole table, then stay current." },
      { name: "Offset / log position", desc: "Where the capture process has read up to (the LSN). Lets it resume exactly after a restart without missing or duplicating." },
      { name: "Sink", desc: "The downstream that consumes the events — a warehouse, search index, cache, or another service." },
    ],
    how: [
      "A connector like Debezium first takes a **consistent snapshot** of the existing data (so consumers start whole), then switches to **streaming** by tailing the transaction log from the snapshot's position onward. It decodes each logged change into a structured event and publishes it — almost always to a **Kafka** topic per table — recording its **log position** as it goes so a restart resumes exactly where it left off.",
      "Downstream **sinks** consume the stream and apply it. A warehouse sink upserts each change so the analytical copy mirrors the source within seconds (this is how modern ELT keeps a warehouse fresh). A search-index sink reindexes changed documents. A cache sink invalidates or updates entries. A microservice consumes the events to react to another service's data changes — the foundation of event-driven integration and **event sourcing** read-models — all without the source service knowing or caring who's listening.",
      "Because the log is replayed and delivery is **at-least-once**, the same change can arrive twice after a restart or rebalance, so sinks must be **idempotent** — applying a change twice must equal applying it once (upsert by primary key, not blind insert). Done right, CDC gives near-real-time, ordered, exactly-effecting sync. The cost is operating the pipeline: the connector needs log access and replication slots, schema changes in the source must be handled, and an unconsumed log can fill the source's disk.",
    ],
    why: [
      "CDC removes the two classic failure modes of keeping systems in sync. It eliminates **polling** (no lag, no missed deletes, no load on the source from repeated full reads) and it eliminates **dual writes** (no chance of the database and the event stream disagreeing, because there's only one write — to the database — and the event is *derived* from it). One source of truth, faithfully fanned out.",
      "It also decouples producers from consumers exactly like Kafka does: the application just writes to its database as it always has, and any number of downstream systems — present or future — can subscribe to the change feed without the application changing at all. That's why CDC has become the standard way to feed warehouses, sync microservices, and bridge a monolith's database into an event-driven world. The trade is real operational weight and the discipline of idempotent, schema-tolerant consumers.",
    ],
    alternatives: [
      { name: "Polling for changes", note: "Periodically query rows changed since last run (by an updated_at column). Simple; laggy, misses deletes, loads the source, easy to get subtly wrong." },
      { name: "Dual writes / outbox", note: "Write the event in app code. Naive dual-write drifts on partial failure; the transactional outbox pattern fixes it — and CDC often reads that outbox." },
      { name: "Trigger-based CDC", note: "Database triggers write changes to an audit table. Works without log access; adds write overhead and is harder to scale than log-based." },
      { name: "Batch full reload", note: "Re-copy whole tables on a schedule. Dead simple and robust; far from real time and wasteful as data grows." },
    ],
    whoUses: "Data and platform engineering teams building real-time sync: feeding warehouses (the modern alternative to nightly batch loads), keeping search indexes and caches current, and integrating microservices through events. Debezium is the open-source standard; Fivetran, Airbyte, AWS DMS, and the managed cloud connectors offer it as a service. Any company moving from nightly batch ETL toward fresh analytics, or breaking a monolith into services that must react to each other's data, ends up using CDC.",
    bigPicture: "CDC is the on-ramp from the **OLTP** operational world into everything downstream: it's the modern **extract** step of **ETL pipelines**, it publishes onto **Kafka and event streaming**, and it feeds **stream processing** and **data lakes and warehouses** with fresh data. It's the practical mechanism behind event-driven **microservices** and event sourcing, leans hard on the same **idempotency** discipline as **message queues**, and is itself built by tailing the **transactions** log (the WAL) that **database replication** also streams — CDC and replication are siblings reading the same source.",
    prereqs: ["transactions", "kafka-and-event-streaming", "idempotency"],
    projects: [
      "Run Postgres with logical replication enabled and point Debezium at it, then insert, update, and delete a row and watch each change appear as a structured event on a Kafka topic.",
      "Build a tiny sink consumer that keeps a second 'mirror' table in sync from the change stream using upserts, then replay the stream from the start and confirm the mirror ends up identical — proving idempotency.",
      "Compare a polling-based sync (query rows changed since last run) against the CDC stream on the same workload: show the poller miss a deleted row and lag behind, while CDC captures the delete in order and near-instantly.",
    ],
    breaks: "Build non-idempotent sinks and a single connector restart double-applies changes (duplicate rows, double-counted metrics). Forget that an unconsumed replication slot keeps the source's log from being recycled and the source database's disk silently fills until it crashes. Ignore schema changes in the source and an added or dropped column breaks every downstream consumer. Assume events are globally ordered when ordering only holds per table/partition and you reassemble related changes wrong. CDC is reliable only when consumers are idempotent and schema-tolerant, and the log's growth is actually consumed and monitored.",
    scale: "Local: a single Debezium connector tailing one Postgres database into a local Kafka, mirroring a few tables — CDC in miniature. Production: connectors capturing the key tables, publishing per-table topics to Kafka, with idempotent sinks keeping a warehouse, a search index, and a cache fresh within seconds, and replication-slot lag monitored. Enterprise: CDC across many source databases feeding a central event backbone, a schema registry enforcing change-event contracts, dead-letter handling, and CDC as the standard integration path between services and into analytics. Planet-scale: high-throughput capture from sharded, multi-region databases, exactly-once stream-processing topologies built on the change feeds, and the log stream treated as the authoritative real-time spine that warehouses, caches, indexes, and services are all rebuilt from by replay.",
    related: ["etl-pipelines", "kafka-and-event-streaming", "stream-processing", "oltp-vs-olap", "transactions", "idempotency"],
  },

  // ─────────────────────── TIME-SERIES DATABASES ───────────────────────
  "time-series-databases": {
    slug: "time-series-databases",
    title: "Time-series databases",
    category: "Databases",
    color: "teal",
    tagline: "Databases built for one shape of data — a relentless stream of timestamped measurements — and the append-mostly, time-windowed queries that go with it.",
    oneLiner: "A time-series database is specialized for data that is timestamped, append-only, and queried by time window — using time-based partitioning, heavy columnar compression, automatic downsampling, and retention policies to ingest millions of points per second and answer 'over the last hour/day/month' queries fast.",
    what: [
      "Some data is fundamentally a **stream of measurements over time**: a server's CPU every second, a sensor's temperature every reading, a stock price every tick, a request's latency on every call. This data has a peculiar shape — it's almost always **appended** (you rarely update or delete an old reading), it arrives in a relentless high-volume firehose, and you query it by **time window and aggregation** ('average CPU per minute over the last 6 hours', not 'find this one row by id'). A general-purpose database can store it, but it's the wrong tool for that shape.",
      "A **time-series database** (TSDB) — InfluxDB, TimescaleDB, Prometheus, ClickHouse for analytics — is built around exactly this shape. Its core trick is **time-based partitioning**: data is bucketed into time chunks, so a 'last hour' query touches one small chunk and ignores years of history, and old chunks can be dropped wholesale. Because adjacent timestamps and similar metric values compress extraordinarily well, TSDBs lean on **columnar storage** and specialized compression (delta-of-delta on timestamps, run-length on repeated values) to store the firehose at a tiny fraction of the raw size.",
      "Two features fall naturally out of this. **Downsampling / continuous aggregates**: raw per-second data is automatically rolled up into per-minute and per-hour summaries, so long-range queries read pre-computed aggregates instead of billions of raw points. **Retention policies**: because old detail rarely matters, the database automatically expires raw data after a window (keep raw for 7 days, hourly rollups for 2 years, then delete) — turning the otherwise-unbounded firehose into a bounded, affordable store.",
    ],
    analogy: {
      title: "A heart-rate monitor's memory, not a filing cabinet",
      body: "A filing cabinet is built to pull out one specific document by its label — a general database fetching one row by id. A fitness tracker is built for the opposite job: it records your heart rate every second, forever, and you never ask 'what was beat number 4,812,003?' — you ask 'average heart rate during this morning's run' and 'resting trend this month'. So it stores the firehose compactly, keeps every second for only a few days, keeps minute-by-minute summaries for longer, and yearly trends after that (downsampling and retention). That specialized shape is exactly what a time-series database is, scaled up to millions of streams.",
    },
    insideTitle: "The pieces of a TSDB",
    inside: [
      { name: "Time-based partitioning", desc: "Data bucketed into time chunks so time-window queries scan one chunk and old chunks drop in one operation." },
      { name: "Columnar + delta compression", desc: "Storing values by column and exploiting that timestamps and readings change little, so the firehose compresses to a fraction of raw size." },
      { name: "Downsampling / continuous aggregates", desc: "Automatic roll-ups (per-second to per-minute to per-hour) so long-range queries read summaries, not raw points." },
      { name: "Retention policy", desc: "Rules that auto-expire old raw data, bounding storage of an otherwise-infinite stream." },
      { name: "Tags / labels & high cardinality", desc: "Metadata (host, region, sensor) you group and filter by. Too many distinct combinations (high cardinality) is the classic TSDB performance killer." },
      { name: "Ingestion path", desc: "A write path tuned for huge append-only throughput — batched, append-optimized, often with an in-memory buffer before flushing to chunks." },
    ],
    how: [
      "Writes arrive as a flood of `(timestamp, metric, tags, value)` points. The TSDB appends them into the current time chunk — often buffering in memory and flushing to a compressed, columnar chunk on disk — which keeps ingestion fast because there's no random-access updating, just appending. As each chunk closes, compression squeezes the timestamps (delta-of-delta) and values hard, so months of high-frequency data fit in a manageable footprint.",
      "Reads are **time-windowed aggregations**. A query like 'p99 latency per minute over the last day' hits only the chunks in that window, reads only the columns it needs, and — if a **continuous aggregate** exists — reads pre-rolled-up minute buckets instead of raw points, returning in milliseconds what a raw scan of billions of rows could never do quickly. The query language is often SQL-flavored (TimescaleDB is literally Postgres) or purpose-built (PromQL, Flux, InfluxQL) with first-class time functions.",
      "Lifecycle management runs in the background: a **downsampling** job continuously computes the rollups, and a **retention policy** drops chunks older than their limit in one cheap metadata operation (not a slow row-by-row delete). The main thing you must design around is **cardinality** — the number of distinct tag combinations. Each unique combination is effectively its own series; put something unbounded in a tag (a user id, a request id) and the series count explodes, blowing up memory and indexes. Tags are for low-cardinality dimensions; high-cardinality identifiers belong in fields, not tags.",
    ],
    why: [
      "The volume and shape of time-series data break general-purpose databases. A relational table taking millions of inserts per second, indexed for point lookups it never gets, queried with hand-rolled time-bucketing SQL, will struggle on ingestion, balloon in storage, and run slow aggregations. A TSDB matches the workload exactly — append-optimized writes, time-partitioned reads, aggressive compression, automatic rollups and expiry — turning an impossible workload into a routine one, often at a fraction of the storage cost.",
      "And this data is everywhere modern systems care about: **observability** (metrics that power dashboards and alerts), IoT and sensors, finance, application and infrastructure monitoring, and product analytics. The trade-offs are that a TSDB is specialized — it's not where you put your users and orders — and that you have to design tags around cardinality and accept that old data lives only as summaries. Within its niche it's dramatically better; outside it, the wrong choice.",
    ],
    alternatives: [
      { name: "Relational table with a timestamp index", note: "Just store points in Postgres/MySQL. Fine at low volume; struggles on ingestion, storage, and aggregation as the firehose grows." },
      { name: "Wide-column store (Cassandra)", note: "Time-bucketed rows in a leaderless store scale writes well; you build downsampling and retention yourself rather than getting them built-in." },
      { name: "Columnar analytics DB (ClickHouse)", note: "Blazing time-window aggregations and compression; more of a general analytics engine, less of the TSDB lifecycle automation out of the box." },
      { name: "Metrics-native (Prometheus)", note: "Purpose-built for monitoring with pull-based scraping and PromQL. Superb for ops metrics; not a general data store and weak on long retention alone." },
    ],
    whoUses: "Anyone drowning in timestamped data: SRE and platform teams for **observability** metrics (Prometheus + Grafana is the canonical stack), IoT and industrial teams for sensor fleets, fintech for market data, and product teams for event analytics. InfluxDB, TimescaleDB, Prometheus, and ClickHouse are the common engines; managed versions (Amazon Timestream, InfluxDB Cloud, Grafana Cloud) handle the operations. It's a near-universal supporting database — most companies run one even if their primary store is relational.",
    bigPicture: "Time-series databases are the storage home of **observability** metrics and the natural sink for **stream processing** output, where windowed aggregates over event time land. They borrow the **data lakes and warehouses** playbook — columnar storage, time **partitioning**, compression — applied to one specialized shape, and they're squarely on the **OLAP** analytical side of the **oltp-vs-olap** split (your transactional store stays relational). They're often fed by **CDC** or **Kafka**, and their time-window aggregation queries are the same kind **query optimization** tunes elsewhere.",
    prereqs: ["oltp-vs-olap", "observability", "data-lakes-and-warehouses"],
    projects: [
      "Ingest a few million fake sensor readings into TimescaleDB (or InfluxDB), then run 'average per minute over the last hour' and compare its speed and storage size against the same data in a plain Postgres table.",
      "Set up a continuous aggregate / downsampling rule that rolls per-second data into per-minute buckets, and a retention policy that drops raw data after 7 days — then confirm long-range queries read the rollup and old raw chunks disappear automatically.",
      "Manufacture a high-cardinality problem by putting a unique id into a tag/label, watch series count and memory explode, then fix it by moving the id into a field and keeping tags low-cardinality.",
    ],
    breaks: "Put a high-cardinality value (user id, request id) into a tag and the series count explodes, devouring memory and indexes until the database falls over — the number-one TSDB mistake. Skip downsampling and long-range queries scan billions of raw points and time out. Forget retention and the unbounded firehose fills the disk. Use a TSDB as your primary transactional store and you'll fight its append-only, eventually-summarized model on every update. And running time-series load on a general relational database without time-partitioning means ingestion chokes and aggregations crawl. The fit is narrow but, inside it, decisive.",
    scale: "Local: a single TimescaleDB or InfluxDB instance ingesting one app's metrics, with a basic retention policy — time-series in miniature. Production: a TSDB behind your observability stack taking thousands of points per second, continuous aggregates powering dashboards, retention tiering raw-to-rollup, and tags kept deliberately low-cardinality. Enterprise: a clustered TSDB ingesting millions of points per second across many services and sensor fleets, multi-tier downsampling, long-term cold storage for compliance, and cardinality budgets enforced per team. Planet-scale: globally distributed ingestion with regional write paths, sharded by series and time, automatic compaction and tiered storage to object stores, and the time-series layer feeding both real-time alerting and long-horizon trend analysis over trillions of points.",
    related: ["observability", "oltp-vs-olap", "data-lakes-and-warehouses", "stream-processing", "change-data-capture", "query-optimization"],
  },
};
