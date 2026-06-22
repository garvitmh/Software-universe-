# ADR 0001: The Architectural Handshake (ChatGPT + Antigravity)

## Status
Proposed / Approved

## Context
We want to combine the conceptual, high-level system-design capability of ChatGPT (acting as Chief Architect) with the fast, precise, environment-integrated implementation capability of Antigravity (acting as the Builder).

We need an operational model that bridges these two AI entities without requiring a direct, real-time API socket integration which is complex, brittle, and lacks human review.

## Alternatives Considered

### Option A: The Manual Loop (Human in the Middle)
* **Description:** The user queries ChatGPT for high-level system design. ChatGPT outputs markdown specifications or instructions. The user pastes these into Antigravity. Antigravity writes the code and builds. The user copies compilation results, logs, or UI designs back to ChatGPT for critique.
* **Tradeoffs:** Low friction, 100% reliable today. Forces the user to act as the "router," which serves as an excellent educational loop (Garvit learns by reviewing what gets passed back and forth).

### Option B: The Repository as the "Brain"
* **Description:** The codebase docs (e.g., `CONSTITUTION.md`, `ADRs/`, `OBSERVATORY.md`) act as a shared state. Both AIs read and write to this documentation structure.
* **Tradeoffs:** Keeps a clean history. Allows any LLM with folder access or file uploading capabilities to instantly get hydrated with the latest architectural state.

### Option C: Custom MCP Server (Automated API Bridge)
* **Description:** A local Model Context Protocol (MCP) server that calls OpenAI's API. Antigravity can invoke tools like `ask_chatgpt_architect(prompt, file_context)` directly from the terminal/IDE context.
* **Tradeoffs:** High automation. Requires an OpenAI API key and local scripting setup. Excellent for automated reviews against the Observatory.

## Decision
We choose a hybrid approach combining **Option A (Manual Loop)** and **Option B (Repository as the Brain)** as our core protocol. 

We will:
1. Maintain all rules, product specs, and decisions inside the `/docs` folder as the repository's "brain."
2. Guide ChatGPT to act as the **Chief Architect** by feeding it the contents of the `/docs` folder.
3. Guide Antigravity to act as the **Builder**, executing tasks and validating code while strictly complying with the rules set in the `/docs` folder.

We also keep **Option C (Custom MCP)** as an optional advanced upgrade.

## Consequences
* Every major feature must have a corresponding ADR in `/docs/ADRs/` before implementation begins.
* The `/docs/OBSERVATORY.md` checklist will be used to review all built components.
* No code changes should be done by Antigravity unless they align with the current architecture decisions documented in the `/docs` directory.
