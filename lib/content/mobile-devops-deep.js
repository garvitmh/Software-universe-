// Mobile & DevOps, in depth.
// Each entry is rendered by components/TechArticle.jsx. Inline markup in strings:
//   `code`  and  **bold**.
// Pure data — no imports. An OBJECT keyed by slug. New kebab-case slugs only.
export const MOBILE_DEVOPS_DEEP = {
  // ──────────────────────────── MOBILE NAVIGATION ────────────────────────────
  "mobile-navigation": {
    slug: "mobile-navigation",
    title: "Mobile navigation",
    category: "Mobile",
    color: "purple",
    tagline: "How screens stack, swap, and link together — the invisible map a user walks through your app.",
    oneLiner: "Mobile navigation is the system that decides which screen is showing, what ‘back' does, and how a tap (or a link from outside) moves the user from one screen to the next.",
    what: [
      "An app isn't one screen — it's dozens, and the user is always *somewhere* in them. **Navigation** is the machinery that tracks where they are and moves them around: tap a burger and the detail screen slides in over the menu; press back and it slides away again. The thing being tracked is a **stack** — a pile of screens where the top one is what you see, and ‘back' pops the top off.",
      "There are a few distinct movements, and good apps mix them. A **stack** push/pop is the forward-and-back drill-down (menu → product → checkout). **Tabs** are parallel sections you flip between without losing your place in each (Home / Orders / Profile, each with its own little stack). A **modal** slides up over everything for a focused task (login, a filter sheet) and is dismissed rather than navigated past.",
      "Finally, navigation has an *outside* entrance: a **deep link** is a URL like `burgerfarm://order/8f3` (or an `https://` App/Universal Link) that opens the app *directly on a specific screen* — from a notification, a shared message, or a search result — instead of always dumping the user on the home page.",
    ],
    analogy: {
      title: "A building with a lift, floors, and a side door",
      body: "Think of the app as a building. The **stack** is the staircase — you climb screen by screen and walk back down the same steps. The **tabs** are separate wings, each with its own staircase, so leaving the Orders wing and coming back finds you exactly where you were. A **modal** is a meeting room that pops open in front of you — you finish or cancel, you don't walk *through* it. And a **deep link** is a side door with the room number on it: someone hands you a key that drops you straight into room 8f3, skipping the lobby entirely.",
    },
    insideTitle: "The pieces of a navigation system",
    inside: [
      { name: "The navigation stack", desc: "The pile of screens; the top is visible, push adds one, pop (or back) removes it. The user's history lives here." },
      { name: "Routes & a router", desc: "Named destinations (`/product/:id`) and the code that maps a name to the screen that should appear." },
      { name: "Tabs / nested navigators", desc: "Parallel sections, each keeping its own independent stack so switching tabs never loses your place." },
      { name: "Deep links & link handling", desc: "URLs that open the app on a precise screen from outside — notifications, the web, another app." },
      { name: "Passing & guarding", desc: "Carrying data into a screen (which product) and blocking routes behind auth (can't open checkout logged out)." },
    ],
    how: [
      "Most modern frameworks use **declarative, URL-style routing**: you describe a table of routes (`/`, `/menu`, `/product/:id`, `/checkout`) and the current location, and the router renders the matching screen — the same mental model as the web. Flutter's `go_router`, React Navigation, and SwiftUI's `NavigationStack` all work this way. The router owns the stack; you ask it to *go to* a route rather than imperatively constructing screens.",
      "A route can take **parameters** (`/product/8f3` carries the id) and the destination screen reads them to fetch its data. Routes can also be **guarded** by a redirect rule: if the user hits `/checkout` while logged out, the router quietly sends them to `/login` first and back afterwards — auth and navigation meeting at the same seam.",
      "**Deep links** plug into this same route table. The OS hands the app a URL when a link is tapped; the framework parses it into a route + params and pushes the right screen — so `burgerfarm://order/8f3` and an in-app tap that goes to the same place run identical code. The hard part is **state restoration**: when the OS kills a backgrounded app and the user returns, the navigator should rebuild the stack so they land where they left off.",
    ],
    why: [
      "Navigation is one of the first things to rot in an app. Wire screens together ad-hoc — each one pushing the next by hand — and within months ‘back' behaves differently in five places, deep links open the wrong screen, and nobody can answer ‘how does a user get here?'. A single, declarative route table makes the whole map readable in one file and the back-behaviour consistent by construction.",
      "It also unlocks things users now expect: a notification that opens the exact order, a shared link that opens the exact product, tabs that remember their place. Those are all just ‘the OS hands us a URL, the router renders the screen' — trivial with a real navigation system, near-impossible to bolt on later.",
    ],
    alternatives: [
      { name: "Imperative navigation", note: "Each screen calls `push(NextScreen())` directly. Dead simple for a 3-screen app; becomes an untraceable tangle with no central map as screens multiply." },
      { name: "Declarative / URL router", note: "A central route table maps URLs to screens (go_router, React Navigation). The modern default — deep-linkable, guardable, restorable." },
      { name: "Single-screen + conditional UI", note: "One screen that swaps its body based on state. Fine for a wizard or onboarding; no real back stack or deep links." },
      { name: "Native per-platform navigation", note: "Use each OS's own navigator (UINavigationController, Jetpack Navigation). Best platform feel; two systems to keep in sync in a cross-platform app." },
    ],
    whoUses: "Every app team — it's foundational, not optional. In a small app one engineer owns the route table; in a large one a platform team owns the navigation framework and deep-link scheme while product teams register their feature's routes. Anyone who's wired a push notification, a marketing link, or an in-app ‘share' has touched the deep-link side of this.",
    bigPicture: "Navigation is the mobile cousin of web **routing**, and it leans directly on **state — one source of truth**: the current route *is* a piece of shared state, which is why route guards and auth (a logged-in flag) meet here. It pairs with the framework that draws the screens (**flutter**) and the shared-state layer that survives navigation (**riverpod**). Deep links are also a security surface — an attacker-crafted link shouldn't bypass an auth guard — which connects it to the same checks the backend enforces.",
    prereqs: ["flutter", "state-management", "http-rest"],
    projects: [
      "Build a 3-screen drill-down (list → detail → confirm) with a declarative router, then verify ‘back' pops exactly one screen at each level.",
      "Add a tab bar where each tab keeps its own stack: drill into tab A, switch to B and back, and confirm A is right where you left it.",
      "Wire a deep link (`yourapp://product/42`) that opens the app directly on product 42, and add a route guard that redirects `/checkout` to `/login` when logged out.",
    ],
    breaks: "Push screens imperatively all over the app and ‘back' becomes a lottery — sometimes it pops one screen, sometimes it exits to home, sometimes it loops. Forget state restoration and the OS killing a backgrounded app dumps the user back on the home page mid-checkout, work lost. Let a deep link skip the auth guard and a crafted URL opens a screen the user shouldn't reach. Hold heavy screens in the stack forever and memory balloons. A single declarative route table with guards and restoration prevents all four.",
    scale: "Local: a handful of screens pushed and popped on one stack — you can hold the whole map in your head. Production: a declarative router with named routes, parameters, tabbed sections, auth guards, and deep links from notifications and shared URLs, restored correctly after the OS reclaims the app. Enterprise: a navigation framework owned by a platform team, with feature modules registering their own routes, a versioned deep-link scheme, and A/B-testable flows so product teams reroute users without touching core code. Planet-scale: deferred/lazy-loaded feature routes (the app downloads a feature module on demand), server-driven navigation where the backend decides the next screen for personalisation and experiments, and a deep-link layer that resolves the same `https://` link to web or app across dozens of locales and app versions.",
    related: ["flutter", "riverpod", "state-management", "auth", "offline-first"],
  },

  // ──────────────────────────── MOBILE ANIMATIONS ────────────────────────────
  "mobile-animations": {
    slug: "mobile-animations",
    title: "Mobile animations",
    category: "Mobile",
    color: "purple",
    tagline: "Motion that feels native — every frame on time, every gesture answered, nothing janky.",
    oneLiner: "Mobile animation is the craft of changing the screen smoothly over time inside a strict per-frame budget, so transitions and gestures feel instant and physical rather than choppy.",
    what: [
      "A screen doesn't really *move* — it's redrawn many times a second, each frame slightly different, and your eye stitches the sequence into motion. Phones target **60fps** (often 120fps now), which means a new frame roughly every **16 milliseconds**. That 16ms is a hard **frame budget**: if the work for one frame takes longer, the phone misses the deadline, the frame is dropped, and the user sees a stutter — **jank**.",
      "So animation is really a *budgeting* discipline. Cheap things to animate are **transforms** — moving, scaling, rotating, fading — because they don't force the screen to recompute layout; they just re-place pixels the GPU already has. Expensive things — re-measuring layout, re-rasterising images, rebuilding big chunks of UI — eat the budget and cause drops. Native-feeling motion is mostly: animate the cheap properties, never the expensive ones, every frame.",
      "The second half is **gestures**. A native-feeling animation is *interruptible and tied to your finger*: a sheet you drag follows your thumb exactly, and if you fling it, it continues with **physics** (spring, friction, momentum) rather than snapping. The motion isn't a fixed canned clip — it's driven by your input in real time, which is what separates ‘premium' from ‘a website in an app'.",
    ],
    analogy: {
      title: "A flip-book on a metronome",
      body: "An animation is a flip-book: each page is one frame, and flicking them fast makes motion. The phone flicks pages on a strict metronome — one page every 16ms. As long as you can *draw* each new page before its tick, the motion is glassy smooth. The moment a page takes too long to draw, the metronome ticks anyway with the old page still showing — the eye catches the hitch. Animating cheap things (sliding a finished drawing across) keeps you ahead of the metronome; re-drawing the whole page each tick makes you miss it.",
    },
    insideTitle: "What goes into smooth motion",
    inside: [
      { name: "The frame budget (16ms)", desc: "At 60fps you have ~16ms per frame to do everything. Blow it and the frame drops — visible jank." },
      { name: "Transforms vs layout", desc: "Move/scale/rotate/fade are cheap (GPU re-places pixels); re-measuring layout each frame is expensive." },
      { name: "Tweens & curves", desc: "Interpolating a value over a duration along an easing curve — ease-out, ease-in-out — so motion accelerates naturally." },
      { name: "Spring / physics animation", desc: "Motion driven by stiffness, damping, and velocity rather than a fixed duration — feels physical and continues a fling." },
      { name: "Gesture-driven & interruptible", desc: "The animation tracks the finger in real time and can be grabbed mid-flight, the hallmark of native feel." },
    ],
    how: [
      "Frameworks give you a **ticker** (Flutter's `Ticker`/`AnimationController`, the browser's `requestAnimationFrame`, iOS's `CADisplayLink`) that fires once per frame. You hold a value between 0 and 1, advance it a little each tick along an **easing curve**, and rebuild only the small widget that depends on it. The key discipline: keep that per-frame rebuild tiny — animate a `Transform`/opacity, not a relayout of the whole screen.",
      "**Physics-based** animation replaces ‘go from A to B over 300ms' with a tiny simulation: a spring has a target, a stiffness, and a damping, and you integrate its position each frame until it settles. This is why a flung sheet decelerates believably and why interrupting it mid-motion (grabbing it again) is natural — you just feed the current velocity back in. Springs, not durations, are the secret to motion that feels alive.",
      "To stay inside budget, heavy work moves *off* the UI path: rendering on a separate thread/engine (Flutter's Impeller, the browser's compositor thread), decoding images ahead of time, and shoving CPU-heavy work onto an **isolate**/worker so the animating thread is never blocked. You profile with the framework's tools (Flutter DevTools' timeline, Chrome's performance panel), watch for dropped frames, and chase the one expensive operation sneaking into the 16ms window.",
    ],
    why: [
      "Smoothness is perceived as *quality and speed* even when nothing is actually faster. A janky transition makes an app feel cheap and broken; the same screens with buttery, interruptible motion feel premium and responsive. For an app whose personality lives in motion — a radial burger builder, an animated cart — this is the difference between ‘a real product' and ‘a prototype'.",
      "It's also where ‘cross-platform' is won or lost. Because Flutter draws its own pixels, it can hit a consistent 60/120fps with custom motion on both phones — but only if you respect the frame budget. Get it right and the app feels native everywhere; get it wrong and the jank is the first thing a user notices.",
    ],
    alternatives: [
      { name: "Implicit / tween animations", note: "Declare ‘animate this property over 300ms' and the framework interpolates it. Easiest; perfect for simple state-driven transitions." },
      { name: "Explicit controller-driven", note: "You own an AnimationController and drive multiple values from it — needed for orchestrated, multi-part, or interruptible motion." },
      { name: "Physics / spring", note: "Motion from a simulation (stiffness/damping/velocity). The native-feel default for gestures and anything a user can fling." },
      { name: "Lottie / pre-rendered", note: "Play a designer-authored vector animation (e.g. a loading burger). Gorgeous and cheap to play, but not interactive or gesture-driven." },
    ],
    whoUses: "Mobile and front-end engineers everywhere, working closely with designers and motion specialists. On a polished consumer app there's often a dedicated ‘motion' layer (reusable animated widgets); on smaller teams every app developer owns it. Game and AR developers live in this world at an even tighter budget.",
    bigPicture: "Animation sits on top of the toolkit that draws the pixels (**flutter**) and is bounded by the same single-thread reality as **the event loop** and **concurrency** — heavy work must move to an isolate or the frame drops. It's the deep, per-frame view of the same craft as the **burger-builder & motion engine** chapter, and it shares its profiling mindset with **app-performance**: both are about respecting a budget and finding the one operation that blows it.",
    prereqs: ["flutter", "app-performance", "the-event-loop"],
    projects: [
      "Animate a card from small to full-screen using only transform + opacity, then deliberately animate its layout instead and watch the timeline show dropped frames.",
      "Build a draggable bottom sheet that follows your finger and, on release, springs to open or closed based on velocity — interruptible mid-fling.",
      "Profile a list that janks while scrolling, find the expensive per-frame work (image decode, relayout), and move it off the frame path to hit a steady 60fps.",
    ],
    breaks: "Animate layout-affecting properties every frame and the relayout cost blows the 16ms budget — visible stutter. Run a canned, non-interruptible animation and a user who grabs it mid-flight feels the app fight them. Do image decoding or JSON parsing on the UI thread during a transition and frames drop exactly when motion should be smoothest. Forget to dispose an AnimationController and you leak it, ticking forever. Respect the budget — cheap properties, springs over durations, heavy work off-thread, controllers disposed — and motion stays glassy.",
    scale: "Local: a couple of tween animations on one screen, eyeballed as ‘smooth enough' on your dev phone. Production: a consistent motion language (shared curves, durations, reusable animated widgets), gesture-driven interruptible transitions, and profiling on real low-end devices — not just the flagship on your desk. Enterprise: a motion design system owned across teams, animations driven by a shared engine, automated performance budgets in CI that fail a build if a screen regresses on frame time, and tested across a matrix of device tiers. Planet-scale: per-device-tier motion (rich on flagships, reduced on budget phones and on ‘reduce motion' accessibility settings), 120fps where the panel allows, GPU-shader-driven effects, and frame-timing telemetry streamed from millions of real devices to catch jank regressions in the field.",
    related: ["flutter", "app-performance", "the-event-loop", "concurrency", "css-accessibility"],
  },

  // ──────────────────────────── APP PERFORMANCE ────────────────────────────
  "app-performance": {
    slug: "app-performance",
    title: "App performance",
    category: "Mobile",
    color: "purple",
    tagline: "Fast on the phone in someone's pocket — quick to start, smooth to use, and easy on memory and battery.",
    oneLiner: "App performance is making the app start fast, scroll without jank, use memory and battery sparingly, and stay responsive on a real low-end device, not just your dev phone.",
    what: [
      "‘Fast' on a phone is four different things, and they trade off against each other. **Startup time** is how long from tap-icon to usable screen. **Smoothness (jank)** is whether scrolling and animation hold their frame budget. **Memory** is how much RAM the app holds — go too high and the OS kills you in the background. **Battery** is how much CPU, GPU, network, and GPS you burn — the silent metric users feel as a hot, draining phone.",
      "The trap is measuring on the wrong device. Your dev phone is a flagship with a fast CPU, plenty of RAM, and a warm cache. Most users are on **mid- or low-tier devices** with slower chips, less memory, and a flaky network. Performance work is really about the **p90/p99 device and network**, not the median, because the slow tail is where users churn.",
      "Two startup distinctions matter. A **cold start** is launching from nothing (process not in memory) — the slow, important one. A **warm start** resumes a backgrounded app — fast. Most of your startup effort goes into shrinking cold start: doing less before first paint, deferring everything that isn't needed for the first screen.",
    ],
    analogy: {
      title: "Judging a kitchen by its worst night, not its best",
      body: "A restaurant kitchen that's fast on a quiet Tuesday with one chef and a stocked fridge tells you nothing. The real test is a packed Saturday on a small line with a cold start: how fast does the first dish leave the pass (startup), does service stay smooth or back up (jank), how much bench space is jammed with prep (memory), and how knackered is the team by close (battery)? You tune the kitchen for its hardest night — the busy, under-resourced one — because that's when customers walk out. App performance tunes for the slow phone on the bad network for the same reason.",
    },
    insideTitle: "The four dimensions (and their tools)",
    inside: [
      { name: "Startup (cold vs warm)", desc: "Time from tap to usable. Cold start (from nothing) is the one to optimise: do less before first paint." },
      { name: "Jank / frame time", desc: "Dropped frames during scroll or animation. Measured per-frame against the 16ms budget — see mobile-animations." },
      { name: "Memory & leaks", desc: "RAM held over time. Leaks (undisposed listeners/controllers, retained images) grow it until the OS kills the app." },
      { name: "Battery & network", desc: "CPU/GPU spin, wakeups, GPS, and chatty requests. Batch work, back off polling, cache to spare the battery." },
      { name: "Profilers", desc: "DevTools timeline, memory snapshots, the network inspector — measure first, never guess where the cost is." },
    ],
    how: [
      "**Startup**: defer everything not needed for first paint. Lazy-initialise heavy services, load the first screen's data only, split code so rarely-used features download on demand, and show a real first frame fast (a skeleton beats a spinner beats a white screen). Measure cold start with a stopwatch trace, not a feeling.",
      "**Smoothness & memory**: profile, don't guess. Use the framework's timeline to find the frame that blew its budget and the one operation inside it (a relayout, an image decode, a giant rebuild). For memory, take heap snapshots over time and watch for things that only grow — the signature of a **leak**, usually an undisposed listener, controller, or stream subscription, or a cache with no eviction. Build lists lazily (`ListView.builder`) so only visible rows exist.",
      "**Battery & network**: the heaviest battery costs are radio wakeups and the screen. Batch network calls, back off or stop polling when idle, cache so you don't refetch, downscale and cache images, and stop GPS/sensors the moment you don't need them. The same caching and offline-first machinery that makes the app feel fast also makes it sip battery, because the cheapest request is the one you never send.",
    ],
    why: [
      "Performance is retention. Users abandon slow-starting apps, uninstall battery hogs, and remember jank as ‘this app is broken'. App-store rankings and the OS itself reward fast apps (and kill memory-hungry ones in the background). On a low-end device, the gap between a tuned and an untuned app is the gap between ‘usable' and ‘deleted'.",
      "It's also cheaper to build in than to bolt on. Performance problems compound — a leak here, an eager init there, a chatty endpoint — until the app is sluggish everywhere and no single fix helps. Measuring early on a realistic device keeps each regression visible and cheap while it's still one isolated cause.",
    ],
    alternatives: [
      { name: "Profile-then-fix", note: "Measure on a real low-end device, find the actual bottleneck, fix that one thing. The only reliable approach." },
      { name: "Guess-and-optimise", note: "Tune what *feels* slow without measuring. Usually optimises the wrong thing and adds complexity for no gain — the classic trap." },
      { name: "Throw hardware at it", note: "On the backend you can add servers; on a phone you can't. The user's device is fixed, so client perf must be earned, not bought." },
      { name: "Native rewrite", note: "Drop to platform-native for a hot path. Sometimes warranted; usually a last resort after profiling proves the framework isn't the cause." },
    ],
    whoUses: "Every mobile engineer, with performance specialists at larger companies who own startup time and frame budgets as tracked metrics. Closely tied to QA (who test on a device matrix) and to the same SRE mindset as backend ops — except the ‘server' is millions of phones you don't control.",
    bigPicture: "Performance is the umbrella over **mobile-animations** (the jank dimension), feeds on **offline-first** and caching (the cheapest request is none), and is bounded by the single-thread reality of **the event loop** and **concurrency** (heavy work must leave the UI thread). It's the client-side mirror of backend **observability**: you can't fix what you can't measure, so profilers and field telemetry are the whole game.",
    prereqs: ["flutter", "the-event-loop", "offline-first"],
    projects: [
      "Trace your app's cold start, then move heavy initialisation off the startup path (lazy-init, defer) and measure the time saved.",
      "Find a memory leak: open and close a screen 20 times while watching the heap, locate the undisposed listener or controller, and fix it so memory returns to baseline.",
      "Throttle the network to slow-3G and the CPU to low-end in the profiler, then make a janky list scroll smoothly — proving it works on the device most users actually have.",
    ],
    breaks: "Do everything eagerly at startup and the app shows a white screen for three seconds on a mid-tier phone — many users never wait. Forget to dispose listeners and controllers and memory climbs until the OS silently kills the app in the background, losing the user's place. Poll an endpoint every second and the battery drains while the phone runs hot. Build a list eagerly instead of lazily and a long menu allocates thousands of off-screen rows. Each is invisible on a flagship and fatal on the device most users hold — which is exactly why you profile on the slow one.",
    scale: "Local: it feels fast on your flagship dev phone, so you ship — and miss every problem. Production: a cold-start budget, lazy initialisation, leak-free screens, image and data caching, and testing on a real low-end device and throttled network. Enterprise: performance budgets enforced in CI (a build fails if startup or frame time regresses), a device-tier test matrix, and tracked metrics with owners. Planet-scale: real-user performance telemetry streamed from millions of devices (startup, jank, ANRs, OOM kills) broken down by device tier, OS version, and region, with automated regression alerts — you tune the slow tail of devices you'll never physically hold, guided entirely by field data.",
    related: ["flutter", "mobile-animations", "offline-first", "observability", "the-event-loop"],
  },

  // ─────────────────────────── APP RELEASE PROCESS ───────────────────────────
  "app-release-process": {
    slug: "app-release-process",
    title: "App release process",
    category: "Mobile",
    color: "purple",
    tagline: "Getting a build into millions of pockets — signing, store review, staged rollout, and fixing it fast.",
    oneLiner: "The app release process is everything between ‘code is done' and ‘users have it': building a signed binary, passing store review, rolling it out gradually, and shipping urgent fixes — some without a new store submission.",
    what: [
      "Unlike a website you can redeploy in seconds, an app ships through **gatekept stores** (Apple App Store, Google Play) and lands on devices you don't control and *can't take back*. That changes everything: a bad release reaches users who may never update, so the process is built around catching problems before — and limiting blast radius after — a build goes wide.",
      "Two unavoidable gates come first. **Code signing**: every build is cryptographically signed with your developer certificate so the OS (and store) can prove it really came from you and wasn't tampered with — an unsigned or wrongly-signed build simply won't install. Then **store review**: a (partly human) check against the platform's rules, which can take hours to days and can *reject* you, so it's a step you plan around, not a formality.",
      "Once approved, you don't flip it on for everyone at once. A **staged (phased) rollout** releases to 1% of users, then 5, 20, 50, 100 — watching crash rates between steps, ready to **halt** if something spikes. And because store review is slow, two escape hatches exist: **OTA (over-the-air) updates** push certain code/asset changes straight to devices without a new submission, and **feature flags / remote config** let you turn a broken feature off instantly without shipping anything at all.",
    ],
    analogy: {
      title: "Mailing out a million printed books",
      body: "Shipping a web app is updating a poster on your own wall — change it and everyone passing sees the new one. Shipping a mobile app is printing and mailing a million books. First the printer verifies it's really your manuscript (signing). Then the distributor reads it against their content rules before stocking it (store review). You don't mail all million at once — you send a first batch and watch for complaints (staged rollout), ready to stop the presses. And because you *can't* recall a book once it's in someone's house, you design it with a few pages you can update remotely (OTA) and switches you can flip from afar (feature flags) — because ‘recall and reprint' takes days you may not have.",
    },
    insideTitle: "The release pipeline, step by step",
    inside: [
      { name: "Build & versioning", desc: "A reproducible release build (in CI) with a bumped version and build number — the identity stores track updates by." },
      { name: "Code signing", desc: "Cryptographic signature with your developer cert/key; the OS refuses to install anything signed wrong or unsigned." },
      { name: "Store review", desc: "Apple/Google check the build against their rules; can take hours–days and can reject. Plan time for it." },
      { name: "Staged / phased rollout", desc: "Release to a growing % of users (1→5→20→100), watching crash-free rate, with a halt button if it spikes." },
      { name: "OTA & feature flags", desc: "Push code/asset fixes or flip features without a new submission — your fast lane around slow review." },
    ],
    how: [
      "A release build is produced in **CI/CD** (not on someone's laptop) for reproducibility, signed with keys held securely (never in the repo — this is where **secrets-management** meets release), and uploaded to the store's console alongside a version bump. The build first goes to an **internal/beta track** (TestFlight, Google Play internal testing) for the team and trusted testers, *then* is submitted for review.",
      "After approval you start a **phased rollout** from the store console: a small percentage gets it first while you watch the **crash-free users** rate and key metrics in your crash reporter (Crashlytics, Sentry) and analytics. If those hold, you ratchet the percentage up; if a crash spikes, you **halt the rollout** so the bad build stops spreading — the rest of your users never receive it.",
      "When something does slip through, the speed of the fix depends on the tool. A code bug needing a full fix means a new build → review → rollout (slow). But if it's behind a **feature flag**, you flip it off remotely and the fix is instant for everyone. And for narrow classes of change, **OTA** updates (CodePush for React Native, Flutter via allowed mechanisms, web-asset bundles) deliver a patch directly — within platform rules, since stores forbid OTA-ing *arbitrary* native code. The whole design assumes you cannot recall a build, only outrun it.",
    ],
    why: [
      "The stakes are asymmetric: a web rollback is a redeploy, but a bad app build sits on millions of devices, and the users who hit the bug are often the *least* likely to update to your fix. So the process front-loads safety (beta tracks, review, signing) and builds in damage control (staged rollout, flags, OTA) precisely because ‘undo' barely exists.",
      "It also keeps releasing *boring and frequent*. Automating the build/sign/upload in CI and rolling out in stages turns shipping from a terrifying quarterly event into a routine, low-risk, halt-able process — the same philosophy as CI/CD on the backend, adapted to a world where you can't instantly take a release back.",
    ],
    alternatives: [
      { name: "Staged rollout + crash monitoring", note: "The standard. Release to a growing %, watch crash-free rate, halt on a spike. Safest default for native releases." },
      { name: "Feature flags / remote config", note: "Ship the code dark and turn it on remotely (and off instantly). Decouples ‘deployed' from ‘released' — see feature-flags." },
      { name: "OTA / CodePush", note: "Push approved classes of fix straight to devices, skipping review. Fast, but limited by platform rules on native code." },
      { name: "Ship-to-everyone at once", note: "One push, 100% immediately. Fine for a tiny user base; reckless at scale — a bad build hits everyone with no halt." },
    ],
    whoUses: "Mobile/release engineers and, at larger companies, a dedicated release-management or mobile-platform team that owns the signing keys, the CI release pipeline, and the rollout dashboards. Product and on-call engineers watch the staged-rollout metrics; security owns the signing secrets.",
    bigPicture: "This is the mobile face of **ci-cd** and the **deployment** chapter, sharing their ‘small, frequent, halt-able releases' philosophy but bound by stores you don't own. It depends hard on **secrets-management** (signing keys), watches the same **observability** signals (crash-free rate) you'd watch on a server, and reaches for **feature-flags** and the staged ideas in **deployment-strategies** to ship safely when ‘undo' isn't available.",
    prereqs: ["ci-cd", "feature-flags", "secrets-management"],
    projects: [
      "Take an app from source to a signed release build in CI, then push it to an internal/beta test track and install it on a real device.",
      "Run a phased rollout on a test app: release to a small %, watch the crash-free metric in a crash reporter, then halt the rollout deliberately and confirm new users stop receiving it.",
      "Put a risky feature behind a remote flag, ship it off, then turn it on for 10% of users and off again — releasing without any new store submission.",
    ],
    breaks: "Lose or leak the signing key and you can lock yourself out of ever updating the app (or let an attacker publish as you) — the worst release mistake there is. Skip the staged rollout and a crash that only shows on one OS version hits 100% of users before you notice. Ignore the crash-free metric and you ratchet a bad build wider instead of halting it. Try to OTA arbitrary native code and the store pulls your app for policy violation. Ship without feature flags and your only fix for a bad feature is another multi-day review cycle. The safe path: keys in a vault, every release staged and monitored, risky features flagged, fixes flag-flipped or OTA'd within the rules.",
    scale: "Local: build on your laptop, sideload onto your own phone, no store involved. Production: signed builds from CI, an internal beta track, store submission, and a manual phased rollout you watch by hand with a crash reporter. Enterprise: a release-management team, automated signed pipelines, locked-down keys, feature-flag-gated launches, and dashboards tying rollout percentage to crash-free rate and business metrics. Planet-scale: continuous mobile releases on a train schedule across dozens of locales and device tiers, server-driven rollouts that auto-halt on a metric regression, OTA fast-lanes within platform rules, and crash/ANR telemetry from hundreds of millions of devices steering each rollout step automatically.",
    related: ["ci-cd", "feature-flags", "deployment-strategies", "secrets-management", "observability"],
  },

  // ────────────────────────── DEPLOYMENT STRATEGIES ──────────────────────────
  "deployment-strategies": {
    slug: "deployment-strategies",
    title: "Deployment strategies",
    category: "DevOps",
    color: "teal",
    tagline: "Blue-green, canary, rolling — patterns for swapping in new code without downtime or a big-bang risk.",
    oneLiner: "Deployment strategies are the named patterns — rolling, blue-green, canary — for replacing the running version of a service with a new one safely: no downtime, small blast radius, fast rollback.",
    what: [
      "Once an app serves real traffic, ‘deploy' can't mean ‘turn it off, install the new version, turn it back on' — that's downtime, and at scale that's lost orders. **Deployment strategies** are the patterns for moving from version N to version N+1 *while it's running*, so users either notice nothing or, at worst, a tiny fraction hit a problem you can instantly reverse.",
      "Three classic patterns, each a different trade. **Rolling**: replace instances a few at a time — old and new run side by side until all are upgraded; cheap (no extra capacity) but both versions serve traffic at once. **Blue-green**: stand up a full second environment (green) running the new version, test it, then flip *all* traffic from the old (blue) to it at once — instant cutover and instant rollback, but you pay for two full environments. **Canary**: send a *small slice* of real traffic (1–5%) to the new version, watch its error and latency metrics, and only widen if it's healthy — the safest, because problems are caught on a few users, not everyone.",
      "Underneath all of them is one rule that makes safe deploys possible: the new and old versions must be able to **coexist**. That forces a discipline on everything they share — especially the database, where schema changes must be **backward-compatible** so version N keeps working while N+1 rolls out. Break that and no strategy saves you.",
    ],
    analogy: {
      title: "Reopening a bridge lane by lane",
      body: "You need to repave a busy bridge without closing it. **Rolling** is repaving one lane at a time — traffic keeps flowing on the others, but for a while old and new surfaces are both in use. **Blue-green** is building a whole second identical bridge alongside, testing it empty, then switching every car over at once at midnight (and switching them straight back if it's wrong). **Canary** is opening the new lane to just a few cars first, watching whether they skid, and only waving the rest across once it's proven safe. In every case the bridge never closes — and the cars only switch onto surfaces that can bear them, which is the backward-compatibility rule.",
    },
    insideTitle: "The strategies & what they cost",
    inside: [
      { name: "Rolling", desc: "Upgrade instances in batches; old and new coexist during the roll. No extra capacity, but mixed versions serve traffic." },
      { name: "Blue-green", desc: "Two full environments; test the idle one, flip all traffic at once. Instant cutover and rollback; double the cost." },
      { name: "Canary", desc: "Route a tiny % to the new version, watch metrics, widen gradually. Smallest blast radius; needs good observability." },
      { name: "Health checks & rollback", desc: "Automated readiness/liveness probes gate each step, and a one-command return to the last good version." },
      { name: "Backward-compatible changes", desc: "Schema and API changes that let old and new run simultaneously — the precondition every strategy depends on." },
    ],
    how: [
      "An orchestrator (Kubernetes, a load balancer, a platform like Render/Vercel) drives the swap. In a **rolling** update it spins up a new instance, waits for its **health check** to pass, routes traffic to it, then retires an old one — repeating until none of the old remain. If a new instance fails its health check, the rollout pauses instead of replacing more, so a broken build can't take the fleet down.",
      "**Blue-green** keeps two environments behind a switch (a load balancer target group or DNS/router rule). You deploy to the idle ‘green', smoke-test it with real-ish traffic, then change one setting to send 100% of traffic there; rollback is flipping that one setting back to ‘blue', which is still warm. **Canary** uses weighted routing: the router sends, say, 5% to the new version, your monitoring compares its error rate and latency to the old, and a controller (or a human) widens the weight only while the metrics stay healthy — automatically rolling back if they don't.",
      "The non-negotiable companion is **schema migration discipline**. Because old and new code run together, you use **expand-then-contract**: first add the new column/field (both versions tolerate it), deploy code that writes both old and new, backfill, then in a *later* release remove the old — never a single migration that the currently-running version can't handle. This is why deployment strategy and database migration are really one topic.",
    ],
    why: [
      "Downtime and risk are the two things these patterns buy down. ‘Big-bang' deploys — stop everything, swap, restart — mean an outage on every release *and* an all-users blast radius if the new version is broken. Strategies turn that into either zero downtime (all of them) or a tiny, reversible exposure (canary), so releasing often stops being scary.",
      "They also make **rollback** a first-class, fast operation. The whole point of blue-green's warm idle environment and canary's small slice is that the answer to ‘the new version is bad' is seconds away, not a frantic redeploy. Fast, boring rollback is what lets a team deploy many times a day with confidence — the CI/CD promise, made real in production.",
    ],
    alternatives: [
      { name: "Recreate (big-bang)", note: "Stop the old, start the new. Causes downtime and an all-users blast radius; only acceptable for tiny or internal tools." },
      { name: "Rolling", note: "The cheap default — no extra capacity, gradual. Accepts mixed-version traffic and a slower rollback than blue-green." },
      { name: "Blue-green", note: "Instant cutover and instant rollback at the cost of running two full environments. Great when fast reversal matters most." },
      { name: "Canary", note: "Smallest blast radius and metric-gated, but needs solid observability and weighted routing to run well." },
    ],
    whoUses: "Platform, SRE, and DevOps teams own the deployment machinery; every backend team uses it on each release. Managed platforms bake one or more strategies in (rolling by default), while large orgs run canary with automated metric-gated promotion as the standard for any user-facing service.",
    bigPicture: "Deployment strategies are the production payoff of **ci-cd** (the pipeline that produced the artifact) and **docker**/**kubernetes** (the units and orchestrator that swap it), the runtime expression of the **deployment** chapter, and utterly dependent on **observability** (canary needs metrics to judge health). They pair with **feature-flags**, which decouple ‘deployed' from ‘released' — together they let you ship code to production and reveal it on your own schedule.",
    prereqs: ["ci-cd", "docker", "kubernetes", "observability"],
    projects: [
      "Do a rolling update of a containerised service behind a load balancer with health checks, and confirm zero failed requests during the swap.",
      "Set up two environments (blue & green) behind one switch, deploy a new version to the idle one, flip traffic over, then roll back by flipping it back.",
      "Run a canary: route 10% of traffic to a new version that has a deliberate error, watch the error rate rise on that slice only, and auto-roll-back without affecting the other 90%.",
    ],
    breaks: "Ship a breaking schema change in the same release as the code that needs it and the old, still-running version crashes the instant the migration lands — every strategy fails on a backward-incompatible change. Skip health checks and a rolling update happily replaces healthy instances with broken ones until the whole fleet is down. Canary without real metrics is just a slow big-bang — you widen a bad release blind. Run blue-green but let the database be shared and mutated incompatibly and the ‘instant rollback' rolls back code but not data. Expand-then-contract migrations, gated health checks, and metric-driven canary promotion keep every deploy zero-downtime and reversible.",
    scale: "Local: you just restart the process — there's nobody to keep online. Production: a rolling update behind a load balancer with health checks and a one-command rollback, plus backward-compatible migrations so a redeploy never breaks the running version. Enterprise: blue-green or canary as standard, automated metric-gated promotion, and migration discipline enforced in review — deploys are routine and reversible. Planet-scale: progressive, region-by-region canary rollouts (one zone, then one region, then global), automated rollback triggered by SLO regressions, traffic shifting at the edge, and thousands of deploys a day where any single one touches only a sliver of users before it's proven safe.",
    related: ["ci-cd", "docker", "kubernetes", "feature-flags", "observability"],
  },

  // ──────────────────────── INFRASTRUCTURE AS CODE ────────────────────────
  "infrastructure-as-code": {
    slug: "infrastructure-as-code",
    title: "Infrastructure as code",
    category: "DevOps",
    color: "teal",
    tagline: "Your servers, networks, and databases defined in reviewable text files — not clicked into existence and forgotten.",
    oneLiner: "Infrastructure as code (IaC) means describing your cloud resources — servers, databases, networks, permissions — in version-controlled files a tool applies, so infrastructure is reproducible, reviewable, and auditable instead of hand-clicked.",
    what: [
      "The old way to set up infrastructure was the **cloud console**: a human clicks through web forms to create a server here, a database there, a firewall rule somewhere. It works once — but nobody can say exactly what exists, why, or how to recreate it, and the staging environment slowly drifts from production until ‘works in staging' means nothing. This is **click-ops**, and it doesn't scale.",
      "**Infrastructure as code** flips it: you *write down* the desired infrastructure in files — ‘two web servers of this size, one Postgres database, this network, these permissions' — and a tool reads those files and makes reality match. The files live in **git** alongside your app code, so infrastructure changes are reviewed in pull requests, diffed, and rolled back exactly like any other code.",
      "Most IaC tools are **declarative**: you describe the desired *end state*, not the steps. The tool compares that to what currently exists and computes the **plan** — the minimal set of creates, changes, and deletes to get there — then applies it. It keeps a record (**state**) of what it manages, so it knows the difference between ‘this is new' and ‘this already exists and is correct'.",
    ],
    analogy: {
      title: "A blueprint and a building inspector, not a memory",
      body: "Click-ops is constructing a building by telling workers ‘put a wall roughly here, a door about there' and keeping the only record in your head. A year later nobody can rebuild it or even say what's load-bearing. IaC is a **blueprint**: the exact, written spec of the building. The IaC tool is a tireless inspector that walks the site, compares it to the blueprint, and lists precisely what to add, change, or remove to match — then does it. Want a second identical building (a staging environment)? Hand over the same blueprint. Want to know why a wall exists? Read the commit that added it.",
    },
    insideTitle: "The pieces of an IaC workflow",
    inside: [
      { name: "Declarative config", desc: "Files describing the desired end state (resources, sizes, networks, permissions) — what you want, not the steps." },
      { name: "Plan / diff", desc: "The tool previews exactly what it will create, change, or destroy before touching anything — your review gate." },
      { name: "Apply", desc: "Executing the plan so reality matches the files; idempotent — re-running with no changes does nothing." },
      { name: "State", desc: "The tool's record of what it manages, mapping your config to real resources so it knows what already exists." },
      { name: "Modules / reuse", desc: "Parameterised, reusable building blocks (a ‘standard web service') so environments are consistent by construction." },
    ],
    how: [
      "You write config in the tool's language — **Terraform**/OpenTofu's HCL, **Pulumi** in a real programming language, **CloudFormation** YAML, or Kubernetes manifests for cluster resources. You run a **plan** command, which reads your files and the recorded **state**, queries the cloud for what actually exists, and prints a diff: ‘+ create 1 database, ~ change server size, - destroy 0'. Nothing has changed yet — this is the review step.",
      "After the plan is reviewed (often in a pull request, the diff posted as a comment), you **apply** it, and the tool makes the calls to the cloud provider to reach the desired state, updating its state file. The operation is **idempotent**: applying the same config twice changes nothing the second time, because reality already matches — which is what makes IaC safe to run repeatedly and from CI.",
      "In a team, two practices matter. **Remote, locked state** (stored in a shared backend, not on a laptop) so two engineers can't apply conflicting changes at once. And running plan/apply from **CI/CD** with a human approval on the plan — so infrastructure changes go through the same pipeline and gates as code. Secrets (cloud credentials, DB passwords) are *injected*, never written into the files, tying IaC tightly to **secrets-management**.",
    ],
    why: [
      "IaC turns infrastructure into something you can *trust and reason about*. Environments become **reproducible** (spin up an identical staging from the same files), changes become **reviewable** (a diff in a PR instead of a silent console click), and the whole setup becomes **auditable** (git history says who changed what, when, and why). That kills environment drift and the ‘nobody knows how prod was built' problem outright.",
      "It also makes disaster recovery and scaling real. If a region dies, you re-apply your config elsewhere and the infrastructure rebuilds itself; if you need a tenth environment for a new market, it's a parameter change, not a week of clicking. Infrastructure becomes a repeatable artifact, not a fragile hand-made one.",
    ],
    alternatives: [
      { name: "Click-ops (console)", note: "Click resources into being by hand. Fine for a one-off experiment; produces undocumented, drifting, irreproducible infra at any real scale." },
      { name: "Imperative scripts", note: "Shell/SDK scripts that issue create commands. Better than clicking, but you manage ‘already exists?' yourself and lose the plan/diff safety." },
      { name: "Declarative IaC (Terraform/Pulumi)", note: "Describe end state; the tool computes and applies the diff. The modern default — reproducible, reviewable, idempotent." },
      { name: "Managed PaaS config", note: "A platform (Render/Vercel/Heroku) with a small config file (e.g. render.yaml). Less power than full IaC, far less to manage — great for small teams." },
    ],
    whoUses: "Platform, DevOps, and SRE teams own the IaC for shared infrastructure; product teams increasingly define their own service's resources in code reviewed by platform. It's near-universal in cloud-native companies — and even a solo project benefits from a single config file (like a `render.yaml`) describing its services rather than memory.",
    bigPicture: "IaC is how you provision the **cloud** and **cloud-compute** resources your app runs on, and it provisions the very things **kubernetes** and **deployment-strategies** then operate. It runs through **ci-cd** (plan on PR, apply on merge) and leans on **secrets-management** (credentials injected, never committed). It's the foundation under the **deployment** chapter: before you can deploy code, something has to create the servers — and IaC is that something, written down.",
    prereqs: ["cloud", "cloud-compute", "ci-cd"],
    projects: [
      "Define a single small resource (a storage bucket or a VM) in Terraform or a render.yaml, run plan to preview it, then apply and confirm it appears in the cloud console.",
      "Change the resource's size in the file, run plan, and read the diff showing exactly the one change before applying it.",
      "Tear it all down with one destroy command, then re-apply the same files and watch an identical environment rebuild itself from scratch.",
    ],
    breaks: "Edit a resource by hand in the console after IaC created it and you get **drift** — the files and reality disagree, and the next apply may ‘fix' your manual change by undoing it. Commit cloud credentials into the config files and you've leaked the keys to your whole account. Keep state on one laptop and a second engineer's apply silently clobbers your changes. Run apply without reading the plan and a careless edit destroys a production database (the diff would have screamed ‘- 1 database'). Locked remote state, secrets injected not committed, all changes through reviewed plans, and never touching managed resources by hand keep infrastructure honest.",
    scale: "Local: no IaC — you run things on your laptop or click a free-tier resource once. Production: a single config file or Terraform project describing your real resources, in git, applied carefully (even a managed-platform render.yaml counts). Enterprise: modular IaC owned by a platform team, remote locked state, plan-on-PR and apply-on-merge through CI, with product teams composing standard modules for their services. Planet-scale: hundreds of accounts and regions described in code, policy-as-code guardrails that reject non-compliant resources at plan time, automated drift detection, and entire regions reproducible from the repository — infrastructure managed as a first-class software system in its own right.",
    related: ["cloud", "cloud-compute", "kubernetes", "ci-cd", "secrets-management"],
  },

  // ──────────────────────────── FEATURE FLAGS ────────────────────────────
  "feature-flags": {
    slug: "feature-flags",
    title: "Feature flags",
    category: "DevOps",
    color: "teal",
    tagline: "Ship code dark, switch it on for whoever you choose, and kill it instantly — without a new deploy.",
    oneLiner: "A feature flag is a remote on/off switch wrapped around a piece of code, so you can deploy a feature turned off, enable it for a chosen slice of users, and disable it instantly — separating ‘deployed' from ‘released'.",
    what: [
      "Normally, deploying code and exposing the feature are the same act — merge it, deploy it, everyone has it. A **feature flag** breaks that link. You wrap the new behaviour in a conditional — `if (flags.newCheckout) { ...new... } else { ...old... }` — and the value of that flag is controlled *remotely*, not baked into the build. So the code can ship to production **off**, and you turn it on later, from a dashboard, with no new deploy.",
      "That one move unlocks several things. You can **roll out gradually**: on for 1% of users, then 10%, then 100%, watching metrics between steps. You can **target**: on for internal staff, or beta testers, or one region first. You can run **experiments** (A/B tests): half the users see variant A, half see B, and you measure which performs better. And critically, you get a **kill switch**: a feature misbehaving in production is turned *off in seconds*, with no rollback, no redeploy, no waiting.",
      "Flags come in flavours. **Release flags** are temporary, guarding an in-progress feature until it's fully launched (then removed). **Ops flags** are long-lived kill switches for risky subsystems. **Experiment flags** drive A/B tests. **Permission flags** gate features to certain plans or users. They look identical in code; their *lifecycle* is what differs.",
    ],
    analogy: {
      title: "A dimmer switch wired before the bulb is installed",
      body: "Deploying without flags is like only being able to wire a new light by cutting the power to the whole house, connecting it, and flipping everything back on at once — if the bulb's faulty, the room (and everyone in it) is affected, and fixing it means another house-wide power cut. A feature flag is a **dimmer wired in ahead of time**: the wiring (code) is already in the wall, switched off. You ease the dimmer up for one room first, watch for sparks, bring it up gradually — and if the bulb pops, you snap the dimmer off instantly without touching the mains. Installed-but-dark, then revealed on your terms.",
    },
    insideTitle: "The parts of a flag system",
    inside: [
      { name: "The flag (the switch)", desc: "A named condition wrapped around code; its value is read at runtime, not compiled in." },
      { name: "Targeting rules", desc: "Who gets ‘on' — a %, a user segment, a region, internal staff — evaluated per request/user." },
      { name: "Remote config & dashboard", desc: "Where flag values live and are changed, so flipping a flag needs no deploy." },
      { name: "Kill switch", desc: "Flip a misbehaving feature off in seconds — incident response without a rollback." },
      { name: "Lifecycle & cleanup", desc: "Release flags are temporary and must be removed once launched, or they rot into permanent dead branches." },
    ],
    how: [
      "Your code asks a **flag SDK** for a value, passing context about the current user (`flags.isEnabled('new-checkout', user)`). The SDK evaluates the flag's **targeting rules** — is this user in the 10% bucket? on the beta list? in the enabled region? — and returns true or false, in microseconds, from a config it keeps in memory and refreshes from the flag service. The code branches on the answer. Flag values change in a dashboard and propagate to running apps without a deploy.",
      "On mobile, this overlaps with **remote config**: because you can't redeploy an app instantly (store review), the flag value is fetched from the server on launch (and refreshed), so a feature can be turned off for *already-installed* apps — making flags the mobile world's primary kill switch and gradual-rollout tool when a real deploy is days away.",
      "The discipline is **cleanup and consistency**. A release flag should be removed once the feature is fully launched — otherwise every flag is a permanent `if/else` that doubles the code paths to test and reason about (‘flag debt'). And flags need a sensible **default** for when the flag service is unreachable, so an outage of the flag system fails *safe* (usually: feature off) rather than breaking the app.",
    ],
    why: [
      "Flags make releasing fundamentally safer and calmer. Decoupling deploy from release means you can merge unfinished work behind an off flag (no long-lived branches), turn features on for a few users to validate in real production, and — the big one — *kill a bad feature instantly* instead of scrambling a rollback while users suffer. The blast radius of any launch shrinks to whatever slice you chose.",
      "They also turn product decisions into measurable experiments. Instead of arguing whether the new checkout is better, you flag it on for half your users and let the conversion numbers decide. And on mobile, where you genuinely cannot redeploy fast, a flag is often the *only* fast lever you have over a feature already in users' pockets.",
    ],
    alternatives: [
      { name: "Deploy = release", note: "No flags; shipping the code exposes the feature to everyone. Simplest, but every launch is all-or-nothing with no kill switch." },
      { name: "Long-lived branches", note: "Keep unfinished work on a branch until done. Avoids dark code in main, but causes painful merges and ‘big bang' integration." },
      { name: "Build-time config", note: "Bake the on/off into the build. No remote control — changing it needs a full redeploy, useless as a kill switch." },
      { name: "Managed flag platform", note: "LaunchDarkly, Unleash, Flagsmith, Firebase Remote Config — targeting, dashboards, audit built in. The standard once flags get serious." },
    ],
    whoUses: "Product engineers (gating and rolling out features), product managers (running experiments from the dashboard), and on-call/SRE teams (killing misbehaving features during incidents). Near-universal at companies that deploy continuously, and especially load-bearing on mobile teams who can't rely on fast redeploys.",
    bigPicture: "Feature flags are the partner of **deployment-strategies** and **ci-cd**: deployment gets the *code* to production safely; flags decide *when and for whom* it's actually live — together they fully separate deploy from release. They're a core tool of the **app-release-process** (the mobile kill switch around slow store review), lean on the same **observability** you watch during a rollout, and are themselves often configured via **infrastructure-as-code** or remote config.",
    prereqs: ["ci-cd", "deployment-strategies", "observability"],
    projects: [
      "Wrap a new feature in a simple boolean flag read from config, deploy it off, then turn it on without redeploying.",
      "Add percentage targeting so the flag is on for a stable 10% of users (same users each time), and confirm the other 90% see the old behaviour.",
      "Build a kill switch: put a risky code path behind an ops flag, simulate it failing, flip the flag off, and watch the app recover instantly — then practise the cleanup by removing a fully-launched release flag.",
    ],
    breaks: "Never clean up release flags and the codebase rots into a maze of stale `if/else` branches nobody dares delete — ‘flag debt' that doubles your test surface. Forget a safe default and an outage of the flag service takes your app down with it instead of failing to ‘feature off'. Use unstable targeting and a user flickers between old and new on every request. Leave a permission flag with a weak check and a user flips themselves into a paid feature. Treat flags as deliberate and temporary — stable targeting, safe defaults, server-checked permissions, and disciplined cleanup — and they stay a superpower, not a liability.",
    scale: "Local: a boolean in a config file, flipped by hand — enough to develop a feature behind a switch. Production: a small flag service or remote config with percentage rollouts and a kill switch, values changed from a dashboard with no redeploy. Enterprise: a managed flag platform with user-segment targeting, audit logs of every flip, A/B experimentation tied to metrics, and a cleanup process that retires release flags. Planet-scale: flags evaluated in microseconds per request across millions of users with consistent bucketing, edge-evaluated for latency, integrated with experimentation pipelines and automated rollbacks, and serving as the real-time control plane for launching and killing features globally — independent of any deploy.",
    related: ["deployment-strategies", "app-release-process", "ci-cd", "observability", "infrastructure-as-code"],
  },
};
