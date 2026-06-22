# Software Universe — Phase 7: Knowledge Ingestion Catalog

This catalog outlines all the target learning resources (GitHub repositories, textbooks, blogs, and interactive visualizers) to be ingested into the Software Universe local RAG database.

---

## 1. GitHub Repositories

| Repository Name | Clone URL | Focus / Educational Value | Est. Clone Size |
| :--- | :--- | :--- | :--- |
| **system-design-primer** | `https://github.com/donnemartin/system-design-primer.git` | System design blueprints, visual diagrams, and multi-resource reference guides. | ~95 MB |
| **every-programmer-should-know** | `https://github.com/mtdvio/every-programmer-should-know.git` | Hard hardware limits, latency numbers, memory hierarchies, and database cost estimates. | ~3 MB |
| **ai-engineering-from-scratch** | `https://github.com/rohitg00/ai-engineering-from-scratch.git` | Code-first AI pipelines, neural layers, and tensor mathematical visualizers from scratch. | ~10 MB |
| **awesome-scalability** | `https://github.com/binhnguyennus/awesome-scalability.git` | Deep repository listing the real scale-up strategies and database designs of high-traffic giants. | ~8 MB |
| **awesome-sre** | `https://github.com/sbarnea/awesome-sre.git` | SRE playbooks, SLO calculators, postmortem formats, monitoring setups, and runbooks. | ~4 MB |
| **professional-programming** | `https://github.com/charlax/professional-programming.git` | Curated checklist of design patterns, refactoring checklists, and engineering maturity reviews. | ~6 MB |
| **coding-interview-university** | `https://github.com/jwasham/coding-interview-university.git` | Complete structural syllabus mapping algorithms, B-Trees, heaps, hashing, and locks. | ~12 MB |
| **engineering-blogs** | `https://github.com/kilimchoi/engineering-blogs.git` | Comprehensive index of 500+ top company engineering blogs (useful for targeted crawling). | ~2 MB |

---

## 2. Systems Textbooks

*Note: These represent textbooks to be parsed locally into text chunks via PDF/EPUB converters.*

| Book Title | Author | Core Architectural Lessons | Est. Text Size |
| :--- | :--- | :--- | :--- |
| **Designing Data-Intensive Applications** | Martin Kleppmann | Storage engines, WAL layouts, replica consensus, SSTables, transactions, and partitioning. | ~14 MB |
| **Google Site Reliability Engineering** | Betsy Beyer et al. | Service Level Objectives (SLOs), blameless postmortems, canary rollouts, and load shedding. | ~8 MB |
| **Database Internals** | Alex Petrov | B-Tree internals, LSM Trees, buffer management, concurrency control, and Paxos/Raft consensus. | ~6 MB |
| **System Design Interview (Vol. 1 & 2)** | Alex Xu | Practical, diagrammatic breakdowns of payment processors, rate limiters, and chat backends. | ~18 MB |
| **Architecture Patterns with Python** | Harry Percival et al. | Clean Architecture, Repository Pattern, Unit of Work, and Event-Driven Abstractions. | ~5 MB |

---

## 3. High-Traffic Engineering Blogs

*Note: Only the text content (paragraphs, markdown) will be crawled and indexed in vectors; image binaries will be skipped.*

| Engineering Blog | Source Domain / URL | Core Learning Value | Est. Scraped Text Size |
| :--- | :--- | :--- | :--- |
| **Stripe Tech Blog** | `https://stripe.com/blog/engineering` | Idempotency keys, dual-entry accounting logs, distributed locking, and zero-downtime database migrations. | ~20 MB |
| **Netflix Tech Blog** | `https://netflixtechblog.com` | Chaos Monkey injection, microservice bulkheads, circuit breakers, global failovers, and streaming routing. | ~35 MB |
| **Discord Blog** | `https://discord.com/blog` | Cassandra to ScyllaDB migration, WebSockets scaling, Go/Rust thread allocations, and voice server architecture. | ~12 MB |
| **Cloudflare Blog** | `https://blog.cloudflare.com` | Edge DNS routing, BGP leak recoveries, DDoS mitigations, rate limiting, and network packet optimization. | ~45 MB |
| **Uber Tech Blog** | `https://www.uber.com/blog/engineering` | Geospatial indexing (H3), Schemaless DB scaling, and distributed service mesh mesh routing. | ~25 MB |

---

## 4. World-Class Interactive Visualizers

*Note: These visualizers will be listed in our registry to embed directly via iframe sandboxes.*

| Visualizer Name | Reference URL | Target Integration Concept | Est. Web Asset Size |
| :--- | :--- | :--- | :--- |
| **LLM Visualized** | `https://bbycroft.net/llm` | Token generation, KV Cache storage, and Transformer matrix paths. | ~4 MB |
| **Raft Consensus** | `https://raft.github.io` | Leader election cycles, heartbeats, logs synchronization, and split-brains. | ~3 MB |
| **Visualgo** | `https://visualgo.net` | Interactive B-Tree balancing, hash maps collision handling, and graph sorting. | ~8 MB |
| **DNS Visualizer** | `https://dns-visualization.netlify.app` | Iterative DNS root resolver hopping and packet query paths. | ~2 MB |

---

## 5. Storage Estimation Summary

* **Total Git Repository Clone Size:** ~140 MB
* **Total Systems Textbooks Size:** ~51 MB
* **Total Engineering Blogs Scraped Size:** ~137 MB
* **Total Interactive Visualizer Assets Size:** ~17 MB
* **Total Data Lake Footprint:** **~345 MB**

### Feasibility Verdict
A total storage requirement of **~345 MB** is exceptionally lightweight. It is highly feasible to host the entire raw repository and vector database **fully locally** within the Next.js workspace. This completely avoids cloud storage costs, database subscription fees, and internet bandwidth bottlenecks, matching our local-first, high-performance RAG architecture.
