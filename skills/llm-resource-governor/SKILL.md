---
name: llm-resource-governor
description: >-
  Use when a coding/review workflow may spawn workers, accumulate large context, or consume scarce owner quota. Decide when bounded work should be offloaded, keep worker context/output compact, and escalate only when earned. Choose roles by capability; runtime/provider/model selection is outside this skill.
---

<!-- comind-managed-skill: llm-resource-governor -->

# LLM Resource Governor

Preserve delivery quality while reducing unnecessary owner token/context burn.

```text
MAIN OWNER THINKS / DECIDES / INTEGRATES
BOUNDED WORKERS READ / WRITE / REVIEW
AGENT SKILL / AGENT DEFINES THE ROLE
CURRENT RUNTIME EXECUTES NATIVELY
MINIMUM SUFFICIENT CONTEXT
COMPACT RESULTS
ESCALATION IS EARNED
QUALITY GATES STAY
```

`llm-resource-governor` answers **WHEN should this work be offloaded?**

The selected Agent Skill or explicit agent definition answers **WHICH role/behavior should execute?**

The current runtime answers **HOW that role executes** through its native context/subagent/tooling.

Do not collapse these responsibilities.

## 1. Runtime selection is out of scope

Do not infer price, scarcity, capability, or preferred provider from model/vendor names and do not implement runtime routing here.

Delegation is:

```text
resolve whether delegation helps
→ choose the correct role/skill
→ execute it natively in the current runtime
```

If the user deliberately chooses another runtime, preserve the role/task packet and run it from that runtime directly. CoMind does not spawn or proxy between runtimes.

## 2. Main owner responsibility

Keep one main owner responsible for:

- resolving project/source/business/design authority;
- deciding scope and risk;
- decomposition and ownership;
- architecture/shared-contract decisions;
- resolving disagreement/ambiguity;
- final integration and completion reasoning.

The owner should avoid mechanical work when a bounded worker can independently perform it with a compact task packet.

Strong offload candidates:

- repository search/exact-source inspection;
- bounded diff/code review;
- isolated implementation with clear acceptance rules;
- repetitive refactor/migration within explicit boundaries;
- screenshot/visual UI review;
- runtime/browser evidence collection when the current runtime has the required capability;
- targeted test/log/console/network evidence.

Do not offload a tiny task when packet construction/integration would cost more than doing it locally.

## 3. Role-first native execution

Choose the role by concern and authority.

```text
main owner
→ choose Agent Skill / explicit agent
→ current runtime native context/subagent/tooling
→ compact result
```

No hidden role-to-provider mapping, cross-runtime execution adapter, or provider substitution belongs in CoMind orchestration.

## 4. Minimum sufficient context

A worker should not inherit the entire main conversation by default.

Send only:

```text
ROLE / SKILL
GOAL
CANDIDATE / SHA / WORKTREE
EXACT SCOPE / ROUTE
RELEVANT AUTHORITY / ACCEPTANCE RULES
OWNERSHIP OR READ-ONLY BOUNDARY
REQUIRED CHECKS / SCENARIOS
CONTEXT BUDGET
OUTPUT BUDGET
ESCALATE WHEN
RETURN CONTRACT
```

Prefer exact paths, SHAs, URLs/identifiers, and concise authority summaries over copied transcripts.

A useful context budget says:

```text
Start from the named files/routes.
Follow imports/callers only when required.
Do not scan unrelated modules.
Do not repeat source text unless it is evidence.
```

## 5. Output budget

Cheap execution is not enough if the main owner must ingest a huge transcript.

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

Default implementation return:

```text
Implemented: compact bullets
Files changed: exact paths
Verification: check + PASS/FAIL
Shared integration needed: value or NONE
Assumptions/blockers: value or NONE
```

Use structured schemas when available. Do not hard-truncate a structured result after generation; constrain the return contract before execution.

## 6. Earned escalation

Escalate bounded work to the main owner when:

- authority remains materially ambiguous;
- a finding touches architecture, lifecycle, security, destructive behavior, or shared contracts;
- required capability/credential is unavailable;
- independent workers materially disagree;
- verification repeatedly fails;
- completing the task would cross the worker's ownership boundary;
- confidence is insufficient for a high-severity mutation/finding.

Do not automatically launch a second reviewer for every pass. A second opinion is earned by uncertainty, severity, disagreement, or a project-specific gate.

## 7. Fan-out

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
Is context compact?
Will the result also be compact?
```

If materially no, queue it.

## 8. UI review

UI review is a strong offload target.

```text
visual/composition/style changed
→ ui-visual-reviewer

interaction/state/navigation/form/async/runtime changed
→ ui-runtime-reviewer

both changed materially
→ both reviewers

neither
→ neither UI reviewer
```

Browser/runtime reviewers must use capabilities actually available in the current runtime. If required evidence cannot be produced, keep the result BLOCKED rather than inventing or substituting evidence.

## 9. Coding offload

For a clear implementation slice, the owner should provide:

```text
GOAL
CURRENT AUTHORITY / BUSINESS GUARDRAILS
OWNED SCOPE
DO NOT CHANGE
ACCEPTANCE RULES
TARGETED VERIFICATION
CONTEXT BUDGET
OUTPUT BUDGET
ESCALATE WHEN
```

The selected worker may inspect, edit, test, and report within its boundary. The owner retains architecture, shared wiring, integration, and unresolved trade-offs.

A worker PASS does not equal product completion.

## 10. Evidence reuse and context lifecycle

Do not rerun expensive evidence against an unchanged candidate just because the workflow phase changed.

If candidate changes:

1. identify invalidated evidence;
2. rerun only that evidence;
3. broaden only when blast radius is unclear.

Compact/start fresh context at natural boundaries such as implementation -> independent review or completed workstream -> unrelated task.

Preserve only durable state:

```text
candidate SHA
open decisions
acceptance criteria
proven verification
remaining blockers
worker verdicts/evidence locators
```

Discard stale tool chatter and superseded debugging.

## 11. Safety boundary

Resource optimization never justifies skipping required product/business/security/release gates.

Do not use delegation to bypass capability, credential, security, or destructive-operation boundaries.

The governor controls delegation discipline. Role definitions live in agents/skills. Runtime execution remains native to the runtime the user is currently using.
