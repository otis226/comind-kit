---
name: llm-resource-governor
description: >-
  Use when a coding or review workflow may spawn subagents, accumulate large context, use browser/MCP-heavy evidence, or run multiple expensive model sessions. Preserve delivery quality while minimizing unnecessary model, context, tool, and concurrency cost.
---

<!-- comind-managed-skill: llm-resource-governor -->

# LLM Resource Governor

Optimize orchestration cost without weakening source resolution, implementation ownership, verification, independent review, or ship gates.

Core rules:

```text
QUALITY GATES STAY
FAN-OUT IS EARNED, NOT DEFAULT
MINIMUM SUFFICIENT CONTEXT
STRONGEST REASONING WHERE IT MATTERS MOST
EXPLICIT SPECIALIST MODEL SELECTION
SHORT-LIVED SPECIALISTS
REUSE EVIDENCE BEFORE RE-RUNNING
CONCURRENCY MUST BUY REAL LATENCY
```

## 1. Govern the actual expensive resources

Treat these as separate budgets:

- number of active model contexts;
- context size carried by each context;
- model capability/cost tier when runtime selection exists;
- long-lived tool transcripts, especially browser/MCP output;
- concurrent subagents/sessions;
- repeated verification against an unchanged candidate.

Machine CPU/RAM governors do not control model quota. Apply this skill even when test/build resource scheduling is already correct.

## 2. Main owner vs specialists

Keep one main owner responsible for:

- project/source resolution;
- product/business/design authority;
- risk classification;
- decomposition and ownership;
- shared implementation/integration decisions;
- final candidate inspection;
- final handoff state.

Prefer the strongest available reasoning tier for the main owner when the task has meaningful ambiguity, architecture, business rules, security, lifecycle, or integration risk.

Specialists should be narrow. When the runtime supports per-agent model selection, explicitly select a cheaper capable tier by default for bounded work such as:

- read-only exploration with an exact question;
- isolated implementation slices with clear contracts;
- visual review against a resolved authority;
- runtime review with explicit scenarios;
- repetitive evidence collection.

Do not rely on implicit inheritance from the main owner's model when an explicit cheaper-capable selection is available.

Escalate a specialist to the strongest tier only when the specialist task itself contains material ambiguity, high-risk reasoning, or repeated failure that indicates the cheaper tier is insufficient.

## 3. Fan-out gate

Do not spawn a subagent merely because the runtime supports subagents.

### FAST

Default:

```text
main owner only
```

Allow a specialist only when it removes a real blocker or provides required independent evidence.

### STANDARD

Default:

```text
main owner + up to 2 concurrent specialists
```

Spawn only for independent vertical slices or genuinely independent read-only investigation/review.

### HIGH_RISK

Prefer parallel investigation over parallel mutation.

Additional specialists are allowed when they reduce a concrete risk or critical-path delay, but the owner must still keep mutation ownership explicit and integration centralized.

Do not exceed the default concurrency merely to keep every possible role busy.

## 4. Minimum sufficient context

A fresh subagent must not inherit the main conversation by default.

Pass a compact task packet containing only what the specialist needs, for example:

```text
ROLE / SKILL
GOAL
CANDIDATE / SHA / WORKTREE
EXACT SCOPE OR ROUTE
RELEVANT AUTHORITY / ACCEPTANCE RULES
OWNED FILES OR READ-ONLY BOUNDARY
REQUIRED SCENARIOS / CHECKS
RETURN CONTRACT
```

Prefer links, exact paths, SHAs, issue/PR identifiers, and concise authority summaries over copied transcripts.

Do not preload unrelated project docs, earlier debugging logs, previous browser traces, or implementer rationale.

If a specialist can resolve a detail cheaply from canonical source, give it the source locator instead of pasting the source into its prompt.

## 5. Context lifecycle

Long context is allowed when it remains useful, not because the session happened to stay open.

Checkpoint, compact, or start a fresh context at natural boundaries such as:

- source resolution completed and implementation starts;
- implementation stabilizes and independent review starts;
- browser/MCP-heavy review finishes;
- a PR/workstream is handed off;
- the user switches to an unrelated issue.

Preserve the compact durable state:

```text
candidate SHA
open decisions
acceptance criteria
verification already proven
remaining blockers
```

Discard stale tool chatter and superseded reasoning.

## 6. Browser and MCP discipline

Browser/runtime reviewers should be short-lived evidence workers.

Give them:

- exact route/state/fixture;
- exact interactions to exercise;
- exact runtime health checks required;
- the candidate identifier;
- a compact verdict contract.

They should collect only evidence relevant to the affected surface, return a concise verdict, then end.

Do not keep a browser-heavy reviewer alive for subsequent implementation work. Do not repeatedly inspect broad DOM/network/console state without a scenario-driven reason.

## 7. Review routing

Do not collapse independent review, but only run the reviewer that the change requires.

```text
visual/composition/style changed
→ visual review

interaction/state/navigation/form/async/runtime integration changed
→ runtime review

both changed meaningfully
→ both reviews

neither changed
→ neither UI reviewer
```

A reviewer may still be required by a project-specific gate; project authority wins.

## 8. Evidence reuse

Do not rerun expensive evidence against an unchanged candidate just because a new phase started.

If the candidate changes:

1. identify the affected evidence;
2. rerun only what the change invalidated;
3. rerun broader verification only when impact is unclear.

A specialist PASS is evidence for its bounded concern, not product completion.

## 9. Concurrency test

Before starting another expensive context, ask:

```text
Will this work proceed independently now?
Will it shorten the critical path?
Is ownership non-overlapping?
Is the required context compact?
Is the expected value greater than context/orchestration overhead?
```

If any answer is materially no, queue the work instead of running it concurrently.

## 10. Stop conditions

End a specialist when it has returned its contract.

End or compact the main context when the current workstream has reached a stable handoff and the next task is unrelated.

Do not keep background/loop agents alive without a current required responsibility.

## 11. Reporting

For substantial orchestrated tasks, the main owner may report resource choices compactly when useful:

```text
Orchestration: single-owner | owner + <n> specialists
Specialists: <purpose only>
Review: visual | runtime | both | N/A
Evidence reused: <yes/no + what>
```

Resource optimization must never be used to justify skipping a required safety, business, release, or acceptance gate.
