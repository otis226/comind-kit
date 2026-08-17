# CoMind Kit

> **Reusable Agent Skills and specialist agents for building, reviewing, and shipping software with AI coding tools.**

![Agent Skills](https://img.shields.io/badge/Agent%20Skills-portable-4f46e5?style=flat-square)
![Claude Code](https://img.shields.io/badge/Claude%20Code-plugin%20%2B%20agents-d97706?style=flat-square)
![Cursor](https://img.shields.io/badge/Cursor-compatible-111827?style=flat-square)
![Codex](https://img.shields.io/badge/Codex-compatible-059669?style=flat-square)

CoMind Kit packages a practical software-delivery workflow into portable skills that can be installed into supported AI coding runtimes.

It is intentionally **project-neutral**: no private project knowledge, no private repository routing, and no dependency on the private CoMind repository.

---

## Install

Use the normal `skills` CLI flow:

```bash
npx -y skills@1.5.22 add otis226/comind-kit
```

That keeps the CLI defaults for scope, skill selection, target runtimes, and installation method.

> Start here unless you specifically need runtime targeting or Claude Code specialist agents.

---

## What do you get?

| Area | What it helps with | Main skills |
|---|---|---|
| 🧭 **Engineering delivery** | Understand the task, plan, implement, coordinate subagents, hand off | `senior-dev`, `coding-agent-handoff` |
| 🎨 **Product & UI** | Resolve design authority, critique UI, review visual quality | `ui-design-authority`, `ui-design-architect`, `product-ui-critique`, `ui-review`, `ui-visual-reviewer` |
| 🧪 **Verification** | Runtime checks, regression decisions, design parity, evidence | `ui-runtime-reviewer`, `runtime-regression`, `design-parity`, `pixel-parity-calibration`, `evidence-transport` |
| 🚢 **Finish & ship** | Final candidate checks, merge safety, cleanup | `finalize-workstream` |

```mermaid
flowchart LR
    A[Task] --> B{What kind of work?}
    B -->|Build / fix| C[senior-dev]
    B -->|Design decision| D[ui-design-architect]
    B -->|Visual review| E[ui-visual-reviewer]
    B -->|Runtime behavior| F[ui-runtime-reviewer]
    C --> G[Candidate]
    D --> C
    G --> E
    G --> F
    E --> H[Manual check]
    F --> H
    H --> I[finalize-workstream]
```

---

## Skills at a glance

### 🧭 Build & orchestration

| Skill | Use it when | What it does |
|---|---|---|
| `senior-dev` | A feature, refactor, or bug fix is non-trivial | Main delivery owner: inspect → plan → implement → verify → handoff |
| `coding-agent-handoff` | Work can be split across coding agents | Defines vertical slices, ownership, return contracts, and final integration |
| `finalize-workstream` | The candidate has been accepted and needs to ship | Resolves ship policy, merge safety, cleanup, and final status |

### 🎨 Design & product UI

| Skill | Use it when | What it does |
|---|---|---|
| `ui-design-authority` | Before meaningful UI implementation | Decides whether the work is reference-backed, system-backed, product-derived, or greenfield |
| `ui-design-architect` | The UI needs an independent design-authority pass | Produces a compact Design Manifest without editing production code |
| `product-ui-critique` | Reviewing an existing screen or screenshot | Diagnoses UX/visual/system issues while preserving what already works |
| `ui-review` | Reviewing UI against a design/system/product language | Chooses the right review mode and prioritizes actionable gaps |
| `ui-visual-reviewer` | After meaningful UI implementation | Independent PARITY / COHERENCE / DESIGN_QUALITY verdict |

### 🧪 Runtime, parity & evidence

| Skill | Use it when | What it does |
|---|---|---|
| `ui-runtime-reviewer` | UI behavior, state, navigation, forms, or async flows changed | Exercises the real candidate and returns PASS / FAIL / BLOCKED |
| `design-parity` | An exact design/reference is an acceptance target | Verifies visual, structural, interaction, business, and regression concerns |
| `pixel-parity-calibration` | Pixel mismatch remains after structural parity is close | Separates real product defects from fixture/clock/render noise |
| `runtime-regression` | A candidate changed after a previous runtime PASS | Decides what evidence still carries forward and what must be rerun |
| `evidence-transport` | Reviewers need screenshots, traces, reports, or diffs | Moves evidence to reviewable locations without polluting release history |

---

## Claude Code specialist agents

The same workflows can also be exposed as isolated Claude Code subagents.

| Agent | Role | Typical use |
|---|---|---|
| `senior-dev` | Main engineering delivery owner | Own a substantial implementation from source inspection through handoff |
| `ui-design-architect` | Read-only design authority specialist | Resolve UI direction before implementation when design freedom is unclear |
| `ui-visual-reviewer` | Independent visual reviewer | Review the rendered candidate without trusting implementer rationale |
| `ui-runtime-reviewer` | Independent runtime reviewer | Exercise interactions, state, forms, navigation, and runtime health |
| `product-ui-critic` | Conservative product UI critic | Diagnose what should change — and explicitly preserve what should not |

The agent definitions are intentionally thin. **The canonical workflow stays in the skills**, so behavior is not duplicated across runtimes.

---

## Real workflows

### 1. Build a feature or fix a bug

```text
senior-dev
  → inspect current repository truth
  → classify risk and scope
  → implement directly or split vertical slices
  → targeted verification
  → visual/runtime review when relevant
  → READY FOR MANUAL CHECK
```

Use this when you want one main agent to own delivery rather than manually composing many separate prompts.

### 2. Implement or improve a UI screen

```text
ui-design-authority
  → ui-design-architect when design freedom is unclear
  → senior-dev implementation
  → ui-visual-reviewer
  → ui-runtime-reviewer when behavior changed
  → manual check
```

This prevents a common failure mode: the coding agent invents its own visual language and then reviews its own work against that invention.

### 3. Match an exact design/reference

```text
design-parity
  → structural visual comparison
  → comparable-state check
  → pixel comparison when required
  → pixel-parity-calibration for residual noise
  → runtime/business/regression evidence
  → final verdict
```

Use exact parity only when an exact reference is genuinely an acceptance target. Do not create fake pixel gates for ordinary product-coherence work.

---

## Optional runtime targeting

Use these only when you want to skip the normal CLI choices.

<details>
<summary><strong>Claude Code only</strong></summary>

```bash
npx -y skills@1.5.22 add otis226/comind-kit --agent claude-code
```

</details>

<details>
<summary><strong>Cursor only</strong></summary>

```bash
npx -y skills@1.5.22 add otis226/comind-kit --agent cursor
```

</details>

<details>
<summary><strong>Claude Code + Cursor, all skills, global</strong></summary>

```bash
npx -y skills@1.5.22 add otis226/comind-kit --global --skill '*' --agent claude-code --agent cursor --yes
```

</details>

<details>
<summary><strong>Claude Code + Cursor + Codex, all skills, global</strong></summary>

```bash
npx -y skills@1.5.22 add otis226/comind-kit --global --skill '*' --agent claude-code --agent cursor --agent codex --yes
```

</details>

---

## Optional: Claude Code plugin + specialist agents

If you use Claude Code and want the specialist subagents in addition to the skills, run these commands **inside Claude Code**:

```text
/plugin marketplace add otis226/comind-kit
/plugin install comind-kit@otis-tools
```

The plugin loads the same canonical skills plus the five specialist agents listed above.

The plugin intentionally omits a fixed semantic version so Git-hosted updates can resolve by commit instead of staying pinned to a stale version string.

---

## How humans and AI should read this repo

**Humans:** start with this README to understand what is available and which workflow fits the task.

**AI runtimes:** use the installed `SKILL.md` files and runtime agent definitions as the actual operating instructions. This README is onboarding documentation, not the canonical agent policy.

```text
README.md        → human orientation
skills/*         → canonical reusable workflows
agents/*         → Claude Code specialist adapters
.claude-plugin/* → Claude Code distribution metadata
```

---

## Boundary

CoMind Kit intentionally does **not** include:

- private project knowledge;
- business rules from a specific project;
- private decisions or references;
- private repository routing;
- private CoMind context/sync capabilities.

Each installed agent must resolve project-specific truth from the repository it is currently working in.

---

## Repository structure

```text
comind-kit/
├── README.md
├── skills/                 # portable canonical Agent Skills
├── agents/                 # Claude Code specialist adapters
└── .claude-plugin/         # plugin + marketplace metadata
```

Built from a sanitized allowlisted distribution pipeline; it is safe to use without access to the private CoMind repository.
