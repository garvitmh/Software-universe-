// The Library — a curated map to the best (mostly free) resources across the
// ENTIRE field of software engineering. Hand-picked canonical sources, grouped
// by area, each with a one-line "why". Pure data → rendered by /resources, and
// (later) ingestible into the assistant's knowledge base.
//
// kind: course · book · docs · interactive · video · roadmap · practice · reference

export const RESOURCE_GROUPS = [
  {
    id: "whole-degree",
    title: "Whole CS, free (start here)",
    blurb: "Complete, self-guided curricula — a degree's worth of structure.",
    items: [
      { name: "CS50 (Harvard)", url: "https://cs50.harvard.edu/x/", kind: "course", why: "The legendary intro to CS — from bits to web, beautifully taught." },
      { name: "OSSU Computer Science", url: "https://github.com/ossu/computer-science", kind: "roadmap", why: "A full, ordered CS degree built from free courses." },
      { name: "Teach Yourself CS", url: "https://teachyourselfcs.com/", kind: "reference", why: "The definitive 'which 9 books/courses actually matter' list." },
      { name: "The Odin Project", url: "https://www.theodinproject.com/", kind: "course", why: "Free, project-based full-stack web from zero to employable." },
      { name: "freeCodeCamp", url: "https://www.freecodecamp.org/learn", kind: "interactive", why: "Thousands of hands-on exercises + free certifications." },
      { name: "roadmap.sh", url: "https://roadmap.sh/", kind: "roadmap", why: "Role-based maps of exactly what to learn and in what order." },
      { name: "MIT OpenCourseWare", url: "https://ocw.mit.edu/search/?d=Electrical%20Engineering%20and%20Computer%20Science", kind: "course", why: "Real MIT CS courses — algorithms, OS, AI, theory." },
    ],
  },
  {
    id: "languages",
    title: "Programming languages",
    blurb: "Learn the languages, and how they differ.",
    items: [
      { name: "MDN — JavaScript", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript", kind: "docs", why: "The reference for JS — every method, with examples." },
      { name: "javascript.info", url: "https://javascript.info/", kind: "course", why: "The modern JavaScript tutorial, deep and clear." },
      { name: "TypeScript Handbook", url: "https://www.typescriptlang.org/docs/handbook/intro.html", kind: "docs", why: "Types, done right — straight from the source." },
      { name: "Real Python", url: "https://realpython.com/", kind: "course", why: "Thousands of high-quality Python tutorials, beginner→advanced." },
      { name: "The Rust Book", url: "https://doc.rust-lang.org/book/", kind: "book", why: "Learn memory-safe systems programming the right way." },
      { name: "A Tour of Go", url: "https://go.dev/tour/", kind: "interactive", why: "Learn Go in the browser, concept by concept." },
      { name: "Exercism", url: "https://exercism.org/", kind: "practice", why: "Practice 65+ languages with free human mentoring." },
      { name: "Learn X in Y Minutes", url: "https://learnxinyminutes.com/", kind: "reference", why: "A whole language's syntax on one scrollable page." },
    ],
  },
  {
    id: "dsa",
    title: "DSA & algorithms",
    blurb: "Data structures, algorithms, and complexity.",
    items: [
      { name: "NeetCode", url: "https://neetcode.io/", kind: "course", why: "The 150/250 with pattern-based explanations + video." },
      { name: "Visualgo", url: "https://visualgo.net/en", kind: "interactive", why: "Watch every data structure and algorithm animate." },
      { name: "CP-Algorithms", url: "https://cp-algorithms.com/", kind: "reference", why: "Deep, correct write-ups of algorithms from basic to advanced." },
      { name: "MIT 6.006 Intro to Algorithms", url: "https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/", kind: "course", why: "The rigorous foundations — analysis, graphs, DP." },
      { name: "LeetCode", url: "https://leetcode.com/", kind: "practice", why: "The standard problem bank for interview practice." },
      { name: "Big-O Cheat Sheet", url: "https://www.bigocheatsheet.com/", kind: "reference", why: "Time/space complexity of every common structure, at a glance." },
    ],
  },
  {
    id: "math",
    title: "Math for CS",
    blurb: "The math you actually need — made visual.",
    items: [
      { name: "3Blue1Brown", url: "https://www.3blue1brown.com/", kind: "video", why: "The most beautiful visual math ever made (linear algebra, calculus)." },
      { name: "Khan Academy", url: "https://www.khanacademy.org/math", kind: "course", why: "Patient, free, ground-up math from arithmetic to calculus." },
      { name: "MIT 6.042 Math for CS", url: "https://ocw.mit.edu/courses/6-042j-mathematics-for-computer-science-fall-2010/", kind: "course", why: "Discrete math, proofs, probability — the CS-relevant parts." },
      { name: "Seeing Theory", url: "https://seeing-theory.brown.edu/", kind: "interactive", why: "Probability & statistics you can play with." },
      { name: "Immersive Linear Algebra", url: "https://immersivemath.com/ila/index.html", kind: "interactive", why: "A linear algebra book with interactive figures." },
    ],
  },
  {
    id: "systems",
    title: "Computer systems & OS",
    blurb: "How computers actually work, top to bottom.",
    items: [
      { name: "nand2tetris", url: "https://www.nand2tetris.org/", kind: "course", why: "Build a computer from NAND gates to an OS, yourself." },
      { name: "OSTEP (free OS book)", url: "https://pages.cs.wisc.edu/~remzi/OSTEP/", kind: "book", why: "Operating Systems: Three Easy Pieces — the best free OS book." },
      { name: "CS:APP", url: "https://csapp.cs.cmu.edu/", kind: "book", why: "Computer Systems: how code becomes electrons, CMU's classic." },
      { name: "Computer, Enhance! (perf)", url: "https://www.computerenhance.com/", kind: "course", why: "Casey Muratori on how CPUs really execute your code." },
    ],
  },
  {
    id: "networking",
    title: "Networking",
    blurb: "How data crosses the internet.",
    items: [
      { name: "Beej's Guide to Network Programming", url: "https://beej.us/guide/bgnet/", kind: "book", why: "The friendliest deep intro to sockets & TCP/IP." },
      { name: "High Performance Browser Networking", url: "https://hpbn.co/", kind: "book", why: "Ilya Grigorik's free book on TCP, TLS, HTTP/2, the web." },
      { name: "Cloudflare Learning Center", url: "https://www.cloudflare.com/learning/", kind: "reference", why: "Crisp explainers: DNS, TLS, CDNs, DDoS, BGP." },
      { name: "Kurose Top-Down Approach", url: "https://gaia.cs.umass.edu/kurose_ross/index.php", kind: "course", why: "The standard networking textbook + lectures." },
    ],
  },
  {
    id: "web",
    title: "Web — frontend & backend",
    blurb: "Build for the browser and the server.",
    items: [
      { name: "MDN Web Docs", url: "https://developer.mozilla.org/", kind: "docs", why: "The reference for HTML, CSS, JS, and every browser API." },
      { name: "web.dev (Google)", url: "https://web.dev/learn/", kind: "course", why: "Modern courses on CSS, performance, accessibility, PWAs." },
      { name: "React docs", url: "https://react.dev/learn", kind: "docs", why: "The new, excellent, interactive React tutorial." },
      { name: "Flexbox Froggy", url: "https://flexboxfroggy.com/", kind: "interactive", why: "Learn CSS Flexbox by playing a game." },
      { name: "CSS Grid Garden", url: "https://cssgridgarden.com/", kind: "interactive", why: "Learn CSS Grid through puzzles." },
      { name: "Full Stack Open", url: "https://fullstackopen.com/en/", kind: "course", why: "Uni of Helsinki's deep, free modern full-stack course." },
    ],
  },
  {
    id: "databases",
    title: "Databases",
    blurb: "Store, query, and scale data.",
    items: [
      { name: "SQLBolt", url: "https://sqlbolt.com/", kind: "interactive", why: "Learn SQL with interactive in-browser exercises." },
      { name: "Use The Index, Luke!", url: "https://use-the-index-luke.com/", kind: "book", why: "The definitive free guide to SQL indexing & performance." },
      { name: "CMU 15-445 Database Systems", url: "https://15445.courses.cs.cmu.edu/", kind: "course", why: "Andy Pavlo's famous course on how databases are built." },
      { name: "PostgreSQL docs", url: "https://www.postgresql.org/docs/current/", kind: "docs", why: "Deep, readable reference for the best open-source DB." },
      { name: "Designing Data-Intensive Applications", url: "https://dataintensive.net/", kind: "book", why: "Kleppmann's masterpiece on storage, replication, consistency." },
    ],
  },
  {
    id: "system-design",
    title: "System design",
    blurb: "Architect systems that scale and survive.",
    items: [
      { name: "System Design Primer", url: "https://github.com/donnemartin/system-design-primer", kind: "reference", why: "The famous open repo: every concept, with diagrams." },
      { name: "ByteByteGo", url: "https://bytebytego.com/", kind: "course", why: "Alex Xu's visual system-design explainers." },
      { name: "Designing Data-Intensive Applications", url: "https://dataintensive.net/", kind: "book", why: "The one book every senior engineer recommends." },
      { name: "High Scalability", url: "http://highscalability.com/", kind: "reference", why: "Real architectures of how the giants actually scaled." },
      { name: "Engineering blogs (Netflix/Stripe/Discord)", url: "https://github.com/kilimchoi/engineering-blogs", kind: "reference", why: "How real companies solved real scaling problems." },
    ],
  },
  {
    id: "devops",
    title: "DevOps, cloud & SRE",
    blurb: "Ship it, run it, keep it up.",
    items: [
      { name: "Google SRE Books", url: "https://sre.google/books/", kind: "book", why: "The free, foundational books on running reliable systems." },
      { name: "Kubernetes Tutorials", url: "https://kubernetes.io/docs/tutorials/", kind: "docs", why: "Learn orchestration from the source, hands-on." },
      { name: "The Twelve-Factor App", url: "https://12factor.net/", kind: "reference", why: "The principles of building deployable, scalable services." },
      { name: "DigitalOcean Community", url: "https://www.digitalocean.com/community/tutorials", kind: "reference", why: "Thousands of clear Linux/Docker/Nginx/cloud tutorials." },
      { name: "roadmap.sh — DevOps", url: "https://roadmap.sh/devops", kind: "roadmap", why: "The ordered path through the whole DevOps stack." },
    ],
  },
  {
    id: "security",
    title: "Security",
    blurb: "Attack, defend, and threat-model.",
    items: [
      { name: "OWASP", url: "https://owasp.org/", kind: "reference", why: "The Top 10 + cheat sheets — the security canon." },
      { name: "PortSwigger Web Security Academy", url: "https://portswigger.net/web-security", kind: "interactive", why: "Free, hands-on labs for every web vulnerability." },
      { name: "Crypto 101", url: "https://www.crypto101.io/", kind: "book", why: "A free, approachable intro to applied cryptography." },
      { name: "OverTheWire (wargames)", url: "https://overthewire.org/wargames/", kind: "practice", why: "Learn security by hacking your way up levels." },
    ],
  },
  {
    id: "ai-ml",
    title: "AI / ML",
    blurb: "From tensors to transformers to LLMs.",
    items: [
      { name: "Neural Networks: Zero to Hero (Karpathy)", url: "https://karpathy.ai/zero-to-hero.html", kind: "video", why: "Build a GPT from scratch, line by line, with Karpathy." },
      { name: "3Blue1Brown — Neural Networks", url: "https://www.3blue1brown.com/topics/neural-networks", kind: "video", why: "The clearest visual intro to how networks learn." },
      { name: "fast.ai", url: "https://course.fast.ai/", kind: "course", why: "Practical deep learning, top-down, code-first." },
      { name: "The Illustrated Transformer", url: "https://jalammar.github.io/illustrated-transformer/", kind: "reference", why: "The diagram-led explainer that makes attention click." },
      { name: "Hugging Face Course", url: "https://huggingface.co/learn", kind: "course", why: "Free, practical courses on LLMs, NLP, diffusion." },
      { name: "Distill.pub", url: "https://distill.pub/", kind: "interactive", why: "The most beautiful interactive ML explanations ever published." },
    ],
  },
  {
    id: "craft",
    title: "Software craft",
    blurb: "Write code humans (and future-you) can live with.",
    items: [
      { name: "Refactoring Guru", url: "https://refactoring.guru/", kind: "reference", why: "Design patterns, SOLID & refactoring with great diagrams." },
      { name: "Pro Git (free book)", url: "https://git-scm.com/book/en/v2", kind: "book", why: "The definitive Git book, free and complete." },
      { name: "Learn Git Branching", url: "https://learngitbranching.js.org/", kind: "interactive", why: "Master Git visually, by playing with branches." },
      { name: "Google Eng Practices (code review)", url: "https://google.github.io/eng-practices/", kind: "reference", why: "How Google does code review — short and wise." },
      { name: "The Twelve-Factor App", url: "https://12factor.net/", kind: "reference", why: "Principles for clean, deployable service code." },
    ],
  },
  {
    id: "interview",
    title: "Interview prep",
    blurb: "Land the job.",
    items: [
      { name: "Tech Interview Handbook", url: "https://www.techinterviewhandbook.org/", kind: "reference", why: "Everything for the coding interview, free and curated." },
      { name: "NeetCode", url: "https://neetcode.io/practice", kind: "practice", why: "Pattern-first problem sets that actually build intuition." },
      { name: "System Design Primer", url: "https://github.com/donnemartin/system-design-primer", kind: "reference", why: "The free bible for the system-design round." },
      { name: "Pramp (mock interviews)", url: "https://www.pramp.com/", kind: "practice", why: "Free peer-to-peer mock interviews." },
    ],
  },
  {
    id: "reference",
    title: "Quick reference & playgrounds",
    blurb: "Bookmark these forever.",
    items: [
      { name: "DevDocs", url: "https://devdocs.io/", kind: "docs", why: "Every language & library's docs, searchable in one place, offline." },
      { name: "regex101", url: "https://regex101.com/", kind: "interactive", why: "Build & explain regular expressions step by step." },
      { name: "ExplainShell", url: "https://explainshell.com/", kind: "interactive", why: "Paste any shell command, see what every flag does." },
      { name: "TensorFlow Playground", url: "https://playground.tensorflow.org/", kind: "interactive", why: "Train a neural net in your browser, no code." },
      { name: "Explorable Explanations", url: "https://explorabl.es/", kind: "interactive", why: "A whole hub of 'play with the idea' interactive lessons." },
    ],
  },
];

export const RESOURCE_STATS = {
  groups: RESOURCE_GROUPS.length,
  total: RESOURCE_GROUPS.reduce((n, g) => n + g.items.length, 0),
};
