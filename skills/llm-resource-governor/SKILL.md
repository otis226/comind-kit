---
name: llm-resource-governor
description: >-
  Use when a coding or review workflow may spawn subagents, accumulate large context, use browser/MCP-heavy evidence, or run multiple expensive model sessions. Preserve delivery quality while minimizing unnecessary premium-model, context, tool, and concurrency cost by offloading bounded work to the cheapest capable prepaid or low-cost runtime.
---

<!-- comind-managed-skill: llm-resource-governor -->

# LLM Resource Governor

Optimize orchestration cost without weakening source resolution, implementation ownership, verification, independent review, or ship gates.

The default operating model is:

```text
PREMIUM OWNER THINKS AND DECIDES
BOUNDED WORKERS READ / WRITE / REVIEW
CHEAPEST CAPABLE RUNTIME FIRST
MINIMUM SUFFICIENT CONTEXT
COMPACT RESULTS BACK TO THE OWNER
ESCALATION IS EARNED
QUALITY GATES STAY
```

This skill governs policy. `agent-bridge` is an execution transport when a bounded worker should run on another CLI/backend; do not move cost-routing policy into the bridge.

## 1. Govern the resources that actually burn quota

Treat these as separate budgets:

- premium-owner input and output tokens;
- number of active model contexts;
- context size carried by each worker;
- model/runtime cost source when selection exists;
- long-lived tool transcripts, especially browser/MCP output;
- concurrent subagents/sessions;
- repeated verification against an unchanged candidate;
- worker output that the premium owner must ingest again.

Machine CPU/RAM governors do not control model quota. Apply this skill even when test/build resource scheduling is already correct.

A cheap worker that returns a huge transcript can still be expensive because the premium owner must read it. Optimize both execution cost and return-path cost.

## 2. Cost sources and routing priority

Classify available execution capacity by cost source, independently from vendor/model name:

```text
PREPAID_SUBSCRIPTION
LOW_COST_API
PREMIUM_OWNER
```

A prepaid subscription means marginal usage is already paid for within its quota. A low-cost API means usage is metered but materially cheaper than the premium owner. The premium owner is the strongest reasoning context whose quota should be preserved for decisions that need it.

For bounded work, choose the cheapest source that satisfies all required capabilities and evidence requirements:

```text
capability fit
→ safety/enforcement fit
→ prepaid or low-cost fit
→ model strength needed for this bounded task
→ latency
```

Do not choose a cheaper worker that cannot provide required browser evidence, filesystem enforcement, structured output, repository access, or other hard capability.

Do not consume the premium owner merely because it is already open when a capable prepaid/cheap worker can perform the bounded task independently.

## 3. Main owner vs workers

Keep one main owner responsible for:

- project/source resolution;
- product/business/design authority;
- risk classification;
- decomposition and ownership;
- architecture and shared-contract decisions;
- conflict resolution between worker findings;
- final candidate reasoning;
- final handoff state.

Prefer the strongest available reasoning tier for the main owner when the task contains meaningful ambiguity, architecture, business rules, security, lifecycle, destructive operations, or cross-slice integration.

The main owner should avoid spending premium quota on mechanical work when a bounded worker can do it. Offload by default when capability is sufficient:

- repository search and exact-source inspection;
- bounded code review;
- isolated implementation with clear acceptance rules;
- repetitive refactors or migrations with explicit boundaries;
- screenshot-based UI critique;
- browser/runtime UI review;
- targeted verification and evidence collection;
- log/console/network inspection for a defined scenario.

The owner does not need to reread every raw artifact the worker inspected. It needs the worker's compact evidence-bearing result plus exact source locators for anything that may require escalation.

## 4. Work-class routing defaults

Use these defaults unless project-specific constraints require stronger routing.

| Work class | Default execution source | Premium owner role |
|---|---|---|
| Architecture, business rules, lifecycle, security, ambiguous product decisions | `PREMIUM_OWNER` | Reason and decide directly |
| Broad source discovery with an exact question | `PREPAID_SUBSCRIPTION`, otherwise `LOW_COST_API` | Consume compact findings |
| Bounded code review / diff inspection | `PREPAID_SUBSCRIPTION`, otherwise capable cheap API | Resolve only major ambiguity/conflict |
| Bounded implementation / refactor | `PREPAID_SUBSCRIPTION` preferred | Define contract, integrate, decide shared changes |
| Visual UI review from screenshots/rendered state | capable `LOW_COST_API` or prepaid vision worker | Escalate only ambiguous/high-severity findings |
| Runtime/browser UI review | cheapest worker with verified browser capability | Decide on blockers/conflicts |
| Repetitive test/evidence collection | cheapest capable worker | Consume verdict/evidence only |
| Destructive release/deploy/credential/database mutation | project-approved trusted path | Retain explicit owner control |

Vendor names are deliberately absent. Runtime availability changes; capability and cost source are the durable routing dimensions.

## 5. Offload gate

Before the premium owner performs a substantial read/write/review pass itself, ask:

```text
Is this mainly a decision or mainly execution/evidence?
Can a cheaper/prepaid worker operate independently?
Can I express the task with a bounded scope and acceptance rules?
Can the worker return compact evidence instead of a transcript?
Does the worker have the required enforcement/capabilities?
```

If the work is mainly execution/evidence and all remaining answers are yes, offload it.

Do not offload solely to create activity. If constructing the packet and re-integrating the result costs more than doing a tiny task directly, keep it local.

## 6. Minimum sufficient worker packet

A fresh worker must not inherit the main conversation by default.

Pass a compact task packet with only what it needs:

```text
ROLE / SKILL
WORK CLASS
GOAL
CANDIDATE / SHA / WORKTREE
EXACT SCOPE OR ROUTE
RELEVANT AUTHORITY / ACCEPTANCE RULES
OWNED FILES OR READ-ONLY BOUNDARY
REQUIRED CAPABILITIES
REQUIRED SCENARIOS / CHECKS
CONTEXT BUDGET
OUTPUT BUDGET
ESCALATE WHEN
RETURN CONTRACT
```

Prefer links, exact paths, SHAs, issue/PR identifiers, and concise authority summaries over copied transcripts.

If the worker can resolve a detail cheaply from canonical source, give it the locator instead of pasting the source. Do not preload unrelated project docs, earlier debugging logs, previous browser traces, or implementer rationale.

`CONTEXT BUDGET` should state what the worker may load, for example:

```text
- Start from the named files/routes only.
- Follow imports/callers only when needed to answer the task.
- Do not scan unrelated modules.
- Do not restate source content in the return unless it is evidence.
```

## 7. Compact output budgets

Every bounded worker should receive an explicit output budget. The purpose is to reduce both worker generation and premium-owner ingestion.

Default reviewer budget:

```text
summary: <= 120 words
findings: <= 8
per finding: <= 70 words
include: severity + exact location + issue + evidence
exclude: chain-of-thought, tutorial prose, repeated context
```

Default source-inspection/code-review budget:

```text
summary: <= 150 words
findings: <= 10
per finding: <= 80 words
include exact file/line/symbol/command evidence
return only material findings
```

Default implementation-worker budget:

```text
Implemented: compact bullets
Files changed: exact paths
Verification: command/check + PASS/FAIL
Shared integration needed: explicit or NONE
Assumptions/blockers: explicit or NONE
Do not narrate the implementation process
```

A structured schema should be used when available. For reviewer-style runs through `agent-bridge`, use its verdict schema so the owner receives evidence-bearing PASS/FAIL/BLOCKED rather than free-form prose.

Do not hard-truncate a structured result after generation; constrain the return contract before execution.

## 8. Earned escalation

A cheap/prepaid worker should finish the bounded task or escalate, not silently broaden scope.

Escalate to the premium owner when any of these occur:

- source/design/business authority remains materially ambiguous after bounded inspection;
- a blocker touches architecture, lifecycle, security, destructive behavior, or shared contracts;
- required capability is unavailable or cannot be verified;
- two independent workers materially disagree;
- the same bounded worker fails the task or verification repeatedly;
- the worker would need to expand outside its ownership boundary;
- confidence is insufficient for a high-severity finding or mutation.

Do not automatically launch a second reviewer after every first pass. A second opinion is earned by uncertainty, severity, disagreement, or an explicit project gate.

## 9. Fan-out and concurrency

Do not spawn a worker merely because the runtime supports subagents.

### FAST

Default:

```text
premium owner + zero or one bounded worker when offload has clear value
```

### STANDARD

Default:

```text
premium owner + up to 2 concurrent bounded workers
```

Only parallelize independent scopes whose outputs do not require each other.

### HIGH_RISK

Prefer parallel investigation over parallel mutation. Keep destructive/shared mutation ownership centralized.

Before starting another context, ask:

```text
Will this work proceed independently now?
Will it shorten the critical path or preserve meaningful premium quota?
Is ownership non-overlapping?
Is required context compact?
Will the owner receive a compact result rather than another large transcript?
```

If any answer is materially no, queue the work instead.

## 10. UI review offload

UI review is a strong default offload target because much of the work is evidence collection rather than premium architectural reasoning.

Route visual review to the cheapest capable vision worker that can inspect the required screenshot/rendered state.

Route runtime review to the cheapest worker with verified browser/runtime capability. Give it exact route/state/fixture, exact interactions, candidate identifier, and health checks.

Use this review routing:

```text
visual/composition/style changed
→ visual review worker

interaction/state/navigation/form/async/runtime integration changed
→ runtime review worker

both changed meaningfully
→ both, preferably sequential unless they are truly independent

neither changed
→ neither UI reviewer
```

Browser/MCP workers are short-lived evidence workers. They collect scenario-specific evidence, return a concise verdict, then end. Do not keep their browser transcript alive for implementation work.

If the cheap reviewer returns a clear evidence-backed result, the premium owner should not redo the same UI inspection. Escalate only the disputed or high-risk part.

## 11. Coding offload

For implementation, prefer a capable prepaid coding runtime when the contract is clear.

The premium owner should provide:

```text
GOAL
CURRENT AUTHORITY / BUSINESS GUARDRAILS
OWNED SCOPE
DO NOT CHANGE
ACCEPTANCE RULES
TARGETED VERIFICATION
OUTPUT BUDGET
ESCALATE WHEN
```

The worker should inspect, edit, test, and return the compact implementation contract. The premium owner owns architecture, shared wiring, cross-slice integration, and unresolved trade-offs.

Do not make the premium owner reread all files just to repeat the worker's work. Inspect the combined diff/evidence at the level required by risk and integration.

## 12. Evidence reuse and context lifecycle

Do not rerun expensive evidence against an unchanged candidate just because a new phase started.

If the candidate changes:

1. identify which evidence is invalidated;
2. rerun only that evidence;
3. rerun broader verification only when blast radius is unclear.

Checkpoint, compact, or start a fresh context at natural boundaries:

- source resolution completed and implementation starts;
- implementation stabilizes and independent review starts;
- browser/MCP-heavy review finishes;
- a PR/workstream is handed off;
- the user switches to an unrelated issue.

Preserve only compact durable state:

```text
candidate SHA
open decisions
acceptance criteria
verification already proven
remaining blockers
worker verdicts with evidence locators
```

Discard stale tool chatter and superseded reasoning.

## 13. Stop conditions

End a worker when it has returned its contract.

Do not keep background/loop workers alive without a current required responsibility.

End or compact the main context when the workstream reaches a stable handoff and the next task is unrelated.

## 14. Reporting

For substantial orchestrated tasks, report resource choices compactly when useful:

```text
Owner: premium reasoning
Offload: <work class> -> <prepaid | low-cost API>
Workers: <count + purpose>
Review: visual | runtime | both | N/A
Evidence reused: <yes/no + what>
Escalations: <none | reason>
```

Never expose private chain-of-thought. Report decisions, evidence, and routing rationale only.

Resource optimization must never justify skipping a required safety, business, release, or acceptance gate.
