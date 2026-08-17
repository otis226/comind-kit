# coding-agent-handoff

## Purpose

Use this workflow when preparing a prompt or handoff for Claude Code, Cursor, Codex, or another coding harness to implement a reviewed task.

It standardizes three things:

1. resolve the correct project/source before coding;
2. resolve design authority before user-visible UI implementation;
3. use main-agent → vertical subagents → final integration only when the task benefits from decomposition.

This is workflow policy, not a project-specific business rule.

```text
PROJECT TRUTH BEFORE CODE
DESIGN AUTHORITY BEFORE UI CODE
OWNERSHIP BEFORE PARALLEL WRITES
VERTICAL SUBAGENTS, NOT LAYER SUBAGENTS
MAIN AGENT OWNS INTEGRATION
```

## 1. Resolve project and source

Before implementation, the main coding agent should:

1. read the current repository instructions;
2. identify the actual repository, surface, and flow in scope;
3. inspect the current working tree/HEAD when a workspace exists;
4. resolve relevant business, product, API, security, and lifecycle sources;
5. avoid resetting to a historical snapshot merely because an older review used it;
6. report a blocker only when material ambiguity cannot be resolved from available authority.

Prefer repository names and relative paths over machine-specific absolute paths.

## 2. Resolve UI design authority

For user-visible UI work, use `ui-design-authority` or apply the same protocol.

Classify the task as:

```text
REFERENCE_BACKED
SYSTEM_BACKED
PRODUCT_DERIVED
GREENFIELD
```

### REFERENCE_BACKED

When an exact accepted design/reference is the acceptance target, resolve:

- affected surfaces and states;
- exact source/entrypoint for each surface;
- imported style/source bundles when the entrypoint is only a wrapper;
- corresponding production route/component;
- provenance/ref/local state when relevant.

Do not hand off vague instructions such as "match the design" when the exact source can be resolved.

If several plausible references remain genuinely ambiguous after inspection, return `BLOCKED` instead of choosing one arbitrarily.

### SYSTEM_BACKED / PRODUCT_DERIVED / GREENFIELD

Do not invent a fake parity target when no exact accepted reference exists.

Create or obtain a compact Design Manifest covering:

- authority mode;
- canonical inputs;
- inherited or derived conventions;
- new proposals;
- allowed freedom;
- do-not-deviate constraints;
- review baseline.

For meaningful PRODUCT_DERIVED or GREENFIELD work, or a substantial new SYSTEM_BACKED composition, prefer an independent read-only `ui-design-architect` pass when the runtime supports it.

## 3. Design is not business truth

A design/reference governs visual and interaction intent only within its proven scope. Lifecycle, permissions, API contracts, security, and business invariants still come from the current project authority.

Do not turn seed data, fake IDs, mock routing, or prototype-only states into production rules.

## 4. Main-agent ownership

When subagents are available, one main agent remains accountable for the whole task:

1. project/source resolution;
2. design authority when UI is involved;
3. risk and scope understanding;
4. ownership/decomposition;
5. fan-out decision;
6. vertical-slice assignment;
7. shared wiring/shared-file ownership;
8. specialist reports;
9. final integration;
10. combined regression and final verification.

Do not spawn write-capable subagents until source, surface, and ownership are clear enough.

## 5. When to fan out

Use parallel subagents when there are at least two slices that are meaningfully independent and can each perform:

```text
inspect → plan → implement → targeted verification
```

Parallelism should reduce elapsed work without creating shared-write conflicts or excessive context overhead.

Small, linear, or tightly coupled tasks should stay with the main agent.

## 6. Vertical slices, not technical layers

Good:

```text
Slice A = Documents
Slice B = Activity
Slice C = Edit flow
```

Avoid:

```text
Agent A = React
Agent B = CSS
Agent C = Tests
```

Do not let multiple writers mutate the same shared parent, API/state region, or styling surface without explicit isolation and ownership.

## 7. Ownership map

Before fan-out, produce a compact map:

```text
Slice A — <goal>
Owns:
- <components/files/logic boundary>
Tests/verify:
- <targeted checks>
Shared dependencies:
- <read-only or integration-needed>

Main / Final Integration owns:
- shared parent
- shared API/state wiring
- shared design-system/token changes
- cross-slice regression
```

## 8. Subagent return contract

```text
SLICE: <name>
STATUS: COMPLETE | BLOCKED

Implemented:
- ...

Files changed:
- ...

Tests / targeted verification:
- <check> — PASS/FAIL

Shared integration needed:
- ... | NONE

Assumptions / blockers:
- ... | NONE
```

## 9. Final integration

After fan-out:

```text
collect reports
→ inspect combined diff/current tree
→ resolve shared wiring/conflicts
→ verify source/design-authority coverage
→ run affected cross-slice regression
→ run required visual/runtime/business verification
→ fix integration defects
→ continue candidate/ship workflow
```

Local slice PASS does not imply feature PASS.

## 10. Risk-sensitive orchestration

### FAST

Prefer a single agent. Parallelize investigation only when the benefit is obvious.

### STANDARD

Use a main orchestrator plus vertical subagents when ownership separates cleanly.

### HIGH_RISK

Prefer parallel investigation over parallel mutation. Security, permissions, destructive actions, lifecycle logic, and shared contracts need explicit owners.

## 11. Resource governor

Do not run multiple heavy/E2E suites concurrently merely because several agents exist. Slices should run targeted checks; final integration runs the combined concerns that matter.

## 12. Prompt author contract

Coding-agent prompts should be English unless the user explicitly requests another language.

A non-trivial handoff should include the relevant parts of:

```text
GOAL
CURRENT PRODUCT/BUSINESS GUARDRAILS
PHASE 0 — PROJECT/SOURCE RESOLUTION
UI DESIGN AUTHORITY
ORCHESTRATION
IMPLEMENTATION SCOPE
VERIFICATION / DONE CRITERIA
DO NOT / GUARDRAILS
```

Do not micromanage implementation when the coding agent can inspect source, but do not replace hard acceptance gates with vague prose.

```text
The main agent coordinates the work.
Resolve what is authoritative before generating new behavior or UI.
Each subagent owns a complete vertical slice.
Subagents report back; the main agent integrates.
Do not parallelize ownership conflicts.
```
