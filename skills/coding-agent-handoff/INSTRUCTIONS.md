# coding-agent-handoff

## Purpose

Use this workflow when preparing a prompt or handoff for Claude Code, Cursor, Codex, or another coding harness to implement a reviewed task.

It standardizes four things:

1. resolve the correct project/source before coding;
2. resolve design authority before user-visible UI implementation;
3. use main-agent → vertical subagents → final integration only when the task benefits from decomposition;
4. keep model, context, browser/MCP, and concurrency cost proportional to the work.

This is workflow policy, not a project-specific business rule.

```text
PROJECT TRUTH BEFORE CODE
DESIGN AUTHORITY BEFORE UI CODE
OWNERSHIP BEFORE PARALLEL WRITES
FAN-OUT IS EARNED, NOT DEFAULT
MINIMUM SUFFICIENT SUBAGENT CONTEXT
VERTICAL SUBAGENTS, NOT LAYER SUBAGENTS
MAIN AGENT OWNS INTEGRATION
```

Use `llm-resource-governor` whenever the handoff may spawn subagents, accumulate large context, use browser/MCP-heavy evidence, or run multiple expensive model contexts.

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

When an exact accepted design/reference is the acceptance target, resolve affected surfaces/states, exact source/entrypoints, relevant imported source/style bundles, corresponding production routes/components, and provenance when needed.

Do not hand off vague instructions such as "match the design" when the exact source can be resolved.

If several plausible references remain genuinely ambiguous after inspection, return `BLOCKED` instead of choosing one arbitrarily.

### SYSTEM_BACKED / PRODUCT_DERIVED / GREENFIELD

Do not invent a fake parity target when no exact accepted reference exists.

Create or obtain a compact Design Manifest covering authority mode, canonical inputs, inherited/derived conventions, new proposals, allowed freedom, do-not-deviate constraints, and review baseline.

For meaningful PRODUCT_DERIVED or GREENFIELD work, or a substantial new SYSTEM_BACKED composition, prefer an independent read-only `ui-design-architect` pass when the runtime supports it.

## 3. Design is not business truth

A design/reference governs visual and interaction intent only within its proven scope. Lifecycle, permissions, API contracts, security, and business invariants still come from current project authority.

Do not turn seed data, fake IDs, mock routing, or prototype-only states into production rules.

## 4. Main-agent ownership

When subagents are available, one main agent remains accountable for project/source resolution, design authority, risk/scope, ownership/decomposition, fan-out decisions, shared wiring, specialist reports, final integration, and combined verification.

Do not spawn write-capable subagents until source, surface, and ownership are clear enough.

## 5. Fan-out gate

Do not spawn a subagent merely because the runtime supports subagents.

Default policy:

```text
FAST
→ main owner only

STANDARD
→ main owner + up to 2 concurrent specialists

HIGH_RISK
→ prefer parallel investigation over parallel mutation
```

Exceed the default only when additional concurrency clearly shortens the critical path or reduces a concrete risk.

Use parallel write subagents only when there are at least two meaningfully independent vertical slices that can each perform:

```text
inspect → plan → implement → targeted verification
```

Small, linear, or tightly coupled tasks should stay with the main agent.

## 6. Minimum sufficient context

A fresh subagent should not inherit the main conversation by default.

Pass a compact task packet:

```text
ROLE / SKILL
GOAL
CANDIDATE / SHA / WORKTREE
EXACT SCOPE OR ROUTE
RELEVANT AUTHORITY / ACCEPTANCE RULES
OWNERSHIP OR READ-ONLY BOUNDARY
REQUIRED CHECKS / SCENARIOS
RETURN CONTRACT
```

Prefer exact paths, links, SHAs, issue/PR identifiers, and concise authority summaries over copied transcripts, old browser traces, or broad project dumps.

When per-agent model selection exists, explicitly choose a cheaper capable tier for bounded specialists instead of silently inheriting the main owner's strongest model. Escalate only when the specialist task itself contains material ambiguity, high-risk reasoning, or repeated failure indicating the cheaper tier is insufficient.

## 7. Vertical slices, not technical layers

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

## 8. Ownership map

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

## 9. Subagent return contract

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

End the specialist after it returns this contract. Do not leave background/loop agents alive without a current responsibility.

## 10. Final integration

```text
collect reports
→ inspect combined diff/current tree
→ resolve shared wiring/conflicts
→ verify source/design-authority coverage
→ reuse still-valid evidence from the unchanged candidate
→ run affected cross-slice regression
→ run only required visual/runtime/business verification
→ fix integration defects
→ continue candidate/ship workflow
```

Local slice PASS does not imply feature PASS.

If the candidate changes, identify which evidence was invalidated and rerun only that evidence unless the impact is unclear.

## 11. Browser and reviewer discipline

Treat browser/MCP-heavy reviewers as short-lived evidence workers.

Give them the exact candidate, route/state/fixture, required scenarios, runtime-health checks, relevant authority, and verdict contract. They should collect only scenario-relevant evidence, return a concise verdict, then end.

Before launching an independent reviewer whose proof depends on the live UI, preflight that review context's browser capability. If the required browser tool is permission-gated, resolve the permission when authorized and rerun the blocked reviewer. Never substitute the implementer or parent session's browser pass for a required independent reviewer pass.

Route UI reviewers by the actual change:

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

Project-specific mandatory gates override this routing.

## 12. Machine resource governor

Do not run multiple heavy/E2E suites concurrently merely because several agents exist. Slices should run targeted checks; final integration runs combined concerns through the project's machine-resource scheduling policy when one exists.

Machine CPU/RAM scheduling and LLM/context governance solve different problems; apply both when relevant.

## 13. Prompt author contract

Coding-agent prompts should be English unless the user explicitly requests another language.

A non-trivial handoff should include the relevant parts of:

```text
GOAL
CURRENT PRODUCT/BUSINESS GUARDRAILS
PHASE 0 — PROJECT/SOURCE RESOLUTION
UI DESIGN AUTHORITY
ORCHESTRATION / RESOURCE BUDGET
IMPLEMENTATION SCOPE
VERIFICATION / DONE CRITERIA
DO NOT / GUARDRAILS
```

Do not micromanage implementation when the coding agent can inspect source, but do not replace hard acceptance gates with vague prose.

```text
The main agent coordinates the work.
Resolve what is authoritative before generating new behavior or UI.
Fan-out is earned, not default.
Each subagent gets minimum sufficient context and owns a complete vertical slice.
Use cheaper capable specialist models when the runtime supports explicit selection.
Subagents report back and end; the main agent integrates.
Do not parallelize ownership conflicts.
Do not keep browser-heavy reviewer contexts alive after their verdict.
```
