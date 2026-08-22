# coding-agent-handoff

## Purpose

This skill is the handoff protocol for bounded worker execution. It does not own architecture, fan-out policy, runtime/provider/model selection, or final product acceptance.

Use it after the main owner has decided that delegation is worthwhile.

Apply `llm-resource-governor` for whether to delegate, concurrency/fan-out, context/output budgets, escalation discipline, and evidence reuse.

Execution stays inside the current runtime using that runtime's native isolated context, subagent, or equivalent mechanism.

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

## 3. Dispatch the role natively

Select the Agent Skill or explicit agent definition first, then use the current runtime's native isolation mechanism.

```text
selected role
→ native context / subagent / equivalent runtime mechanism
→ compact result/evidence
```

CoMind does not launch another coding runtime, proxy credentials, select a provider/model, or maintain a role-to-provider mapping.

If the user deliberately wants another runtime, preserve the same task packet and role contract, then invoke them from that runtime directly outside this handoff workflow.

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
