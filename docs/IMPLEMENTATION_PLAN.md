# Implementation Plan — Order Refactoring, Payment Deep-Dive & AI Professor Hooks

We will refactor the Order Journey Simulator into a modular component architecture, expand the Payment World into an enterprise-tier masterclass, and build interactive AI Professor Hooks into the Unified World Explorer.

---

## Proposed Changes

### 1. Refactor Order Journey Simulator
We will break down the single ~600-line `OrderJourney.jsx` file into a clean, modular folder structure at `components/order-journey/`:
*   **`OrderJourney.jsx` [NEW/MODIFY]**: The central orchestrator managing state (`currentEventIdx`, `scaleLoad`, `posOffline`, `running`, `selectedEventIdx`).
*   **`TimelineControls.jsx` [NEW]**: Handles Play/Pause, Step Back/Forward, Reset, POS offline toggle, and the scale selector.
*   **`PipelineStages.jsx` [NEW]**: Visual horizontal step bubbles with icons and progress bars.
*   **`EventLog.jsx` [NEW]**: Chronological events log panel (Redux DevTools style).
*   **`StateInspector.jsx` [NEW]**: JSON scope viewer showing variables for active events.
*   **`DependencyGraph.jsx` [NEW]**: Dynamically renders scale-based topologies.
*   **`Graph10Users.jsx` / `Graph100kUsers.jsx` / `Graph1MUsers.jsx` [NEW]**: Separate SVG modules representing system nodes and active animated edges for each scale.
*   **`EventDetailsPanel.jsx` [NEW]**: Explains what is happening at the selected step.
*   **`GiantComparisonPanel.jsx` [NEW]**: Connects steps to real-world corporate architectures (Netflix, Swiggy, Stripe, etc.).

---

### 2. Payment World Deep-Dive
We will rewrite `payment` content in `components/worlds/world-content.js` to address the following:
*   **Webhooks:** Server-side confirmation vs client callback security.
*   **Signature Verification:** Validating payload digests using signing secrets (preventing fake webhooks).
*   **Idempotency:** Unique keys mapped in transactions to prevent duplicate charges.
*   **Transactions:** ACID properties and atomic commits (locking order/payment rows).
*   **Refunds:** Partial vs. full refunds, ledger balancing.
*   **Reconciliation:** Automatically balancing checkout transactions with bank statements.
*   **Fraud & Failure Scenarios:** Fake callback injections, lost webhooks, gateway timeout loops, and network retries.

---

### 3. AI Professor Hooks
We will add an interactive panel at the bottom of the Codex section in [CodexPanel.jsx](file:///c:/Desktop/Software%20Universe/components/worlds/CodexPanel.jsx):
*   Provide 5 interactive hooks:
    1.  **🧠 Explain Simpler**: Translates the concept into basic, non-technical analogies.
    2.  **🔬 Explain Deeper**: Explains low-level byte/network/DB locking operations.
    3.  **⚖️ Show Alternatives**: Compares rejected patterns (e.g. JWT vs Sessions, REST vs WebSockets).
    4.  **💥 Show Failures**: Walks through exactly what fails and the rescue path.
    5.  **🛠️ Show Burger Farm Code**: Details the exact file links and code lines in the codebase.
*   Clicking a hook will smoothly expand a sub-card in the UI, fetching content defined in `components/worlds/world-content.js` for that specific world.

---

## Proposed Files

### [MODIFY] [world-content.js](file:///c:/Desktop/Software%20Universe/components/worlds/world-content.js)
- Add comprehensive Payment world topics.
- Define `professorHooks` content (simpler, deeper, alternatives, failures, code) for all 4 worlds.

### [MODIFY] [CodexPanel.jsx](file:///c:/Desktop/Software%20Universe/components/worlds/CodexPanel.jsx)
- Build the AI Professor Hooks UI panel with expanding/collapsing slide-in state.

### [NEW] Components in `components/order-journey/`
- Move segments of `OrderJourney.jsx` into modular components.

---

## Verification Plan

### Automated Tests
- Run `npm run build` to confirm clean Next.js static rendering.

### Manual Verification
- Test simulator: Verify all timeline controls, logs, inspectors, and evolving dependency graphs function exactly as before.
- Test professor hooks: Click "Explain Simpler" and verify the card expands with custom explanations for the active world.
