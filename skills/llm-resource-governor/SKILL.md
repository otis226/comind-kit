---
name: llm-resource-governor
description: >-
  Use when a coding/review workflow may spawn workers, accumulate large context, or consume scarce owner quota. Decide when delegation is worthwhile, keep fan-out/context/output proportional, reuse valid evidence, and escalate only when earned. Runtime/provider/model selection is outside this skill.
---

<!-- comind-managed-skill: llm-resource-governor -->

# LLM Resource Governor

This skill owns delegation/resource discipline only.

```text
WHEN TO DELEGATE
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

## 1. Decide whether delegation is worth it

Delegate only when a worker can proceed independently with a bounded concern and a compact packet, and the result will reduce owner context burn or shorten the critical path enough to justify handoff/integration cost.

Strong candidates include:

- exact-source inspection or repository search;
- bounded diff/code review;
- isolated implementation/refactor with clear acceptance rules;
- independent visual/runtime evidence collection;
- targeted test/log/console/network investigation.

Do not delegate tiny work when packet construction and integration cost more than direct execution.

Choose the role by concern and authority. Runtime/provider/model selection is outside this skill. CoMind does not route or proxy between runtimes.

## 2. Fan-out

Do not spawn workers merely because the runtime supports them.

### FAST

```text
main owner + zero/one bounded worker when offload has clear value
```

### STANDARD

```text
main owner + up to 2 concurrent bounded workers
```

Parallelize only independent scopes with non-overlapping ownership.

### HIGH_RISK

Prefer parallel investigation over parallel mutation. Keep destructive/shared mutation centralized.

Before opening another context ask:

```text
Can it proceed independently now?
Will it preserve meaningful owner context/quota or shorten critical path?
Is ownership non-overlapping?
Will both input and output stay compact?
```

If materially no, queue it.

## 3. Minimum sufficient context

A worker should not inherit the entire main conversation by default.

Send only the task packet prepared by `coding-agent-handoff`, with exact paths/SHAs/routes and concise authority summaries. Start from named files/routes and follow dependencies only when required.

Do not copy long transcripts, repeated source text, or unrelated project context.

## 4. Output budget

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

## 5. Earned escalation

Escalate to the main owner when:

- authority remains materially ambiguous;
- architecture/shared contracts, security, lifecycle, or destructive behavior are implicated;
- required capability/credential is unavailable;
- workers materially disagree;
- verification repeatedly fails;
- completing the task would cross the worker's ownership boundary;
- confidence is insufficient for a high-severity mutation/finding.

Do not automatically launch a second reviewer for every pass. A second opinion is earned by uncertainty, severity, disagreement, or a project-specific gate.

## 6. Evidence reuse and context lifecycle

Do not rerun expensive evidence against an unchanged candidate just because the workflow phase changed.

If the candidate changes:

1. identify which evidence was invalidated;
2. rerun only that evidence;
3. broaden only when blast radius is unclear.

At natural boundaries, compact or start a fresh context. Preserve only durable execution state such as candidate identity, open decisions, acceptance criteria, proven verification, blockers, and worker verdict/evidence locators.

## 7. Safety boundary

Resource optimization never justifies skipping product/business/security/release gates or weakening verification.

A worker PASS proves only its assigned concern. The main owner retains integration and final completion reasoning.
