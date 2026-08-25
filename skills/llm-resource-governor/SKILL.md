---
name: llm-resource-governor
description: >-
  Use when a coding/review workflow may spawn workers, accumulate large context, or consume scarce owner quota. Choose LEAN vs FULL execution, decide when delegation is worthwhile, match task shape to observed worker capability, keep fan-out/context/output proportional, reuse valid evidence, and escalate only when earned. Runtime/provider/model selection is outside this skill.
---

<!-- comind-managed-skill: llm-resource-governor -->

# LLM Resource Governor

This skill owns execution-mode and delegation/resource discipline only.

```text
WHICH EXECUTION MODE TO USE
WHEN TO DELEGATE
HOW MUCH AUTONOMY / SCOPE TO GIVE
HOW MUCH TO FAN OUT
HOW MUCH CONTEXT TO SEND
HOW MUCH OUTPUT TO RETURN
WHEN TO ESCALATE
WHEN EVIDENCE CAN BE REUSED
```

It does not own architecture, worker ownership, task-packet structure, runtime/provider/model selection, or final product acceptance.

- `senior-dev` owns authority, architecture, integration, and final decision.
- `coding-agent-handoff` owns worker scope, task packets, native dispatch, and return contracts.
- The selected Agent Skill/agent defines the role.
- The current runtime executes that role natively.

## 1. Execution mode

### LEAN — default

LEAN optimizes for coding throughput, wall-clock speed, quota efficiency, and short-lived context while preserving required engineering correctness.

Use LEAN unless the user/project explicitly requests a broader autonomous flow.

Core rule:

```text
REASON CENTRALLY
EXECUTE IN PARALLEL WHEN BOUNDARIES ARE INDEPENDENT
VERIFY ONCE AFTER THE SCOPED IMPLEMENTATION IS COMPLETE
ESCALATE REVIEW/RUNTIME TOOLING ONLY WHEN IT CAN CHANGE THE RESULT
```

LEAN does **not** mean the main owner must write every line. The main owner owns the outcome and may delegate independent implementation slices to bounded coding workers.

Default LEAN fan-out:

```text
review workers: 0
coding workers: 0..3 when independent boundaries materially shorten the critical path
```

Prefer contract-first parallelism:

```text
main owner resolves root cause / authority / shared contract
→ freezes the owned boundaries
→ dispatches independent coding slices
→ integrates once
```

Do not send several workers to independently rediscover the same root cause or review the same candidate merely because parallelism is available.

In LEAN, subjective visual/UX/product acceptance is not a default coding-agent gate. Hand the integrated candidate and explicit manual scenarios to the product-review owner. Use visual/runtime/browser reviewers only when explicitly requested, required by project authority, or needed to resolve a concrete runtime uncertainty.

### FULL — explicit autonomous mode

FULL trades substantially more quota/context for broader autonomy and independent evidence.

Use FULL only when the user/project explicitly asks for it, or clearly asks the agent to operate autonomously while the normal product/runtime operator is unavailable.

FULL may include, when useful:

- independent investigation/review workers;
- browser/runtime evidence collection;
- visual/runtime review roles;
- broader regression evidence;
- retry/correction loops;
- additional specialist opinions.

FULL is not automatically activated because a task is difficult. A difficult LEAN task should first use bounded escalation. Switch execution mode only when the authority requesting the work wants the broader autonomous cost profile.

## 2. Decide whether delegation is worth it

Delegate only when a worker can proceed independently with a bounded concern and a compact packet, and the result will reduce owner context burn or shorten the critical path enough to justify handoff/integration cost.

Strong LEAN candidates include:

- independent frontend/backend implementation slices after a shared contract is resolved;
- isolated implementation/refactor with clear acceptance rules;
- exact-source inspection when it can be bounded and does not duplicate owner investigation;
- targeted tests or mechanical work that can proceed without product inference.

Review/runtime delegation is normally escalation-only in LEAN and broader in FULL.

Do not delegate tiny work when packet construction and integration cost more than direct execution.

Choose the role by concern and authority. Runtime/provider/model selection is outside this skill. CoMind does not route or proxy between runtimes.

## 3. Match task shape to observed worker capability

Do not encode execution policy around marketing labels such as `frontier`, `non-frontier`, vendor names, model families, or price tiers. Those labels are unstable and do not reliably predict performance on one concrete task.

Judge **task-worker fit** from:

- task ambiguity and consequence;
- amount of cross-file / cross-domain state the worker must retain;
- how much product/design/architecture inference would be required;
- verification complexity;
- observed performance on similar work when evidence exists.

Treat unknown capability conservatively rather than assuming either weakness or strength.

A worker that has shown reliable contract retention and implementation judgment on comparable work may receive a larger bounded slice and more freedom over implementation sequencing. That does **not** grant authority to reinterpret business, product, design, security, or architecture decisions.

When fit is uncertain or prior evidence shows contract-retention problems, change the shape of execution rather than merely adding prose: shrink the slice, make KEEP/CHANGE/DO NOT CHANGE explicit, use observable acceptance scenarios, keep product/architecture decisions with the main owner, use checkpoints when needed, and keep context minimum-sufficient.

When a worker misses an explicit requirement, diagnose whether the failure is authority/context, execution/contract retention, tooling/environment, or verification. If the same class persists after the contract is clear, restructure execution instead of indefinitely lengthening prompts.

## 4. Fan-out and parallelism

Do not spawn workers merely because the runtime supports them.

### LEAN

```text
main owner + 0..3 bounded coding workers
review/browser/runtime workers = 0 by default
```

Parallelize **execution**, not duplicated reasoning. Independent workers must have non-overlapping ownership and a resolved shared contract.

Good:

```text
main resolves invariant + API contract
├─ frontend worker owns FE slice
└─ backend worker owns BE slice
```

Bad:

```text
three workers investigate the same bug
→ main synthesizes
→ two reviewers reread the same candidate
```

Do not parallelize writers that must edit the same shared region or where one worker depends on another worker's unresolved output.

### FULL

Broader fan-out is allowed when the extra autonomy/evidence is intentional. Still avoid redundant workers that cannot proceed independently or whose output will not affect a decision.

### HIGH_RISK work

Prefer parallel investigation over parallel destructive/shared mutation. Keep architecture/security/lifecycle/shared-contract mutation centralized unless ownership is explicitly isolated.

Before opening another context ask:

```text
Can it proceed independently now?
Will it preserve meaningful owner context/quota or shorten critical path?
Is ownership non-overlapping?
Will both input and output stay compact?
Will the result change implementation, verification, or acceptance?
```

If materially no, queue it or do not run it.

## 5. Verification economics

LEAN should not fall into repeated `code → test → code → test` loops by default.

For a bounded task or worker slice:

1. derive acceptance/manual scenarios before implementation;
2. inspect enough source to lock the owned scope;
3. implement the complete scoped change, including relevant test code;
4. perform a mechanical diff/self-check;
5. run one consolidated risk-based verification gate;
6. after a failure, rerun only checks invalidated by the fix.

Do not run full test/typecheck/build/browser checks after every small edit merely for reassurance.

Mid-implementation execution checks are justified when they are information needed to continue, for example an uncertain shared contract/type/schema, unknown baseline state, required generated/migration output, or a genuine runtime blocker.

Final verification is risk-based, not ritual-based. Run the affected checks required by project authority and actual blast radius. Independent machine checks may run concurrently when the runtime permits.

## 6. Browser/runtime and UI-review cost boundary

Browser/MCP/runtime evidence can be high-context because tool results may remain in the session. In LEAN, do not load or run browser/runtime tooling by default for subjective UI review.

Use it when the user/project explicitly requires it, a concrete bug can only be reproduced or distinguished at runtime, network/console/state/navigation evidence is needed to choose the implementation, or automated browser behavior is itself an acceptance criterion.

Do not use browser automation as a substitute for a product-review owner's visual/UX judgment when a manual review surface is available.

## 7. Minimum sufficient context

A worker should not inherit the entire main conversation by default.

Send only the task packet prepared by `coding-agent-handoff`, with exact paths/SHAs/routes and concise authority summaries. Start from named files/routes and follow dependencies only when required.

Do not copy long transcripts, repeated source text, browser dumps, or unrelated project context.

Treat long-lived context as a budget. Prefer one issue/coherent work unit per context when practical. At natural boundaries, compact or start fresh rather than carrying large completed-task history forward. Durable state belongs in the issue/PR/project source, not in an indefinitely growing session.

## 8. Output budget

Constrain output before execution.

Default reviewer budget:

```text
summary <= 120 words
findings <= 8
per finding <= 70 words
include severity + exact location + issue + evidence
exclude chain-of-thought/tutorial/repeated context
```

Default source/code-review budget:

```text
summary <= 150 words
findings <= 10
return only material findings
include exact file/line/symbol/command evidence
```

Implementation workers should use the compact return contract defined by `coding-agent-handoff` / `bounded-code-worker`.

## 9. Earned escalation

Escalate to the main owner when authority remains materially ambiguous; architecture/shared contracts, security, lifecycle, or destructive behavior are implicated; required capability/credential is unavailable; workers materially disagree; verification repeatedly fails; repeated contract-retention failures show poor task-worker fit; completing the task would cross ownership; or confidence is insufficient for a high-severity mutation/finding.

Do not automatically launch a second reviewer for every pass. A second opinion is earned by uncertainty, severity, disagreement, a project-specific gate, or explicit FULL-mode intent.

## 10. Evidence reuse and context lifecycle

Do not rerun expensive evidence against an unchanged candidate just because the workflow phase changed.

If the candidate changes, identify which evidence was invalidated, rerun only that evidence, and broaden only when blast radius is unclear.

At natural boundaries, compact or start a fresh context. Preserve only durable execution state such as candidate identity, open decisions, acceptance criteria, proven verification, blockers, and worker verdict/evidence locators.

## 11. Safety boundary

Resource optimization never justifies skipping product/business/security/release gates or weakening verification.

A worker PASS proves only its assigned concern. The main owner retains integration and final completion reasoning.
