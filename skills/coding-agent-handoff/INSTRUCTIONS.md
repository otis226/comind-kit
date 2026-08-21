# coding-agent-handoff

## Purpose

This skill is the handoff protocol for bounded worker execution. It does not own architecture, fan-out policy, model/provider selection, or final product acceptance.

Use it after the main owner has decided that delegation is worthwhile.

Apply `llm-resource-governor` for whether to delegate, concurrency/fan-out, context/output budgets, escalation discipline, and evidence reuse. Use `agent-bridge` for configured external execution.

## 1. Define ownership before dispatch

A write worker must have a clear boundary.

```text
ROLE:
GOAL:

OWNS:
- exact files/components/logic boundary

MAY READ:
- exact starting files/routes
- dependencies only as needed

DO NOT CHANGE:
- shared parent/wiring
- unrelated modules
- business/design/security contracts outside the packet

VERIFY:
- targeted checks

MAIN OWNER RETAINS:
- architecture
- shared contracts
- integration
- final acceptance
```

Prefer a vertical slice that one worker can complete independently. Do not split several writers across the same shared region without explicit isolation.

For a normal bounded coding slice, use `bounded-code-worker` unless the project defines a more specific role.

## 2. Build a minimum sufficient task packet

Send only what the worker needs:

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

Prefer exact paths, SHAs, identifiers, and concise authority summaries over copied conversation history.

## 3. Dispatch by role, not provider/model

Invoke the required agent/skill name through `agent-bridge`.

Normal orchestration should not pass `--sdk` or `--model`; those are deliberate one-off debug/experiment overrides.

Interpret route results:

```text
NATIVE
→ use the runtime's normal native isolated specialist for that role

OK
→ consume the compact result/evidence

BLOCKED
→ resolve the declared config/capability/credential blocker or escalate

BACKEND_FAILED
→ inspect the bounded failure; retry only when useful
```

Never silently replace a BLOCKED configured worker with another third-party provider.

## 4. Worker return contracts

Implementation worker:

```text
STATUS: COMPLETE | BLOCKED

Implemented:
- compact bullets

Files changed:
- exact paths

Verification:
- command/check — PASS | FAIL

Shared integration needed:
- value | NONE

Assumptions/blockers:
- value | NONE
```

Reviewer/evidence workers should return the structured verdict required by their skill when available. Do not request private chain-of-thought, long transcripts, or a tutorial.

## 5. Escalation boundary

The worker should stop and return BLOCKED/escalation when completing the assignment would require:

- a material business/product/design authority decision;
- architecture or shared-contract changes outside ownership;
- security/lifecycle/destructive behavior not already authorized;
- writing outside the assigned boundary;
- a required capability or credential it does not have;
- materially conflicting evidence;
- repeated verification failure that changes task scope.

Do not let a bounded worker silently become the feature owner.

## 6. Integration

The main owner:

1. collects compact worker reports;
2. verifies candidate/scope identity;
3. resolves shared wiring or conflicts;
4. checks authority/acceptance coverage;
5. reuses still-valid evidence;
6. reruns only affected checks when the candidate changed;
7. runs project-required final review/ship gates.

Worker PASS proves only the assigned concern.

## 7. Prompt author contract

Coding-agent instructions should be English unless the user asks otherwise.

A substantial worker packet should be explicit about:

```text
GOAL
AUTHORITY / GUARDRAILS
OWNED SCOPE
DO NOT CHANGE
REQUIRED VERIFICATION
CONTEXT BUDGET
OUTPUT BUDGET
ESCALATE WHEN
RETURN CONTRACT
```

Keep the packet executable and bounded.
