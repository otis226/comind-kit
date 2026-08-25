# coding-agent-handoff

## Purpose

This skill is the handoff protocol for bounded worker execution. It does not own architecture, execution-mode choice, fan-out policy, runtime/provider/model selection, or final product acceptance.

Use it after the main owner has decided that delegation is worthwhile.

Apply `llm-resource-governor` for LEAN vs FULL mode, whether to delegate, task-worker fit, concurrency/fan-out, context/output budgets, escalation discipline, verification economics, and evidence reuse.

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

SCENARIOS:
- observable acceptance/manual scenarios known before implementation

VERIFY AT END:
- targeted checks for the completed slice

MAIN OWNER RETAINS:
- architecture
- shared contracts
- integration
- final acceptance
```

Prefer a vertical slice that one worker can complete independently. Do not split several writers across the same shared region without explicit isolation.

For a normal bounded coding slice, use `bounded-code-worker` unless the project defines a more specific role.

## 2. Plan from live source before handoff

For substantial implementation work, the main owner should resolve current canonical source before writing the task contract.

Use live code/runtime to understand what exists, then separate responsibilities deliberately:

```text
main owner / product-review owner
= WHAT should change, WHY, authority, guardrails, KEEP/REMOVE decisions, acceptance

coding agent
= HOW to implement from the current source, implementation sequence, exact files/functions, verification details
```

Do not ask the coding agent to rediscover product semantics that the main owner can resolve from authority first.

For LEAN parallel coding, resolve shared invariants/contracts before dispatch, then freeze non-overlapping ownership boundaries. Parallelize implementation only when workers can proceed without waiting on unresolved output from another writer.

Do not dispatch several workers to independently investigate the same root cause as a default speed strategy. Reason centrally first; execute independent coding slices in parallel second.

Do not over-prescribe stale implementation details when the codebase is changing. Prefer outcome-level implementation constraints and known reuse boundaries; let the coding agent inspect current HEAD and produce the concrete implementation plan.

Historical SHAs are provenance unless explicitly fixed as the target candidate. At execution time, re-resolve live HEAD/current worktree when the task depends on current implementation.

## 3. Build a minimum sufficient task packet

Send only what the worker needs:

```text
ROLE / SKILL
GOAL
EXECUTION MODE
CANDIDATE / SHA / WORKTREE
EXACT SCOPE / ROUTE
RELEVANT AUTHORITY / ACCEPTANCE RULES
OWNERSHIP OR READ-ONLY BOUNDARY
PRE-CODE SCENARIOS
FINAL REQUIRED CHECKS
MID-IMPLEMENTATION CHECK EXCEPTIONS
CONTEXT BUDGET
OUTPUT BUDGET
ESCALATE WHEN
RETURN CONTRACT
```

Prefer exact paths, SHAs, identifiers, and concise authority summaries over copied conversation history.

In LEAN, explicitly tell implementation workers to finish the complete owned slice before executing final verification. They may write/update automated test code during implementation, but should batch execution at the end unless a check result is information required to continue.

Default LEAN mid-implementation check exceptions are:

- uncertain shared type/API/schema contract;
- unknown baseline failure state;
- generated code or migration output required for subsequent coding;
- genuine runtime evidence needed to unblock implementation.

`To be safe`, `for completeness`, or habit alone is not sufficient reason for repeated test/typecheck/build/browser runs.

## 3A. Persistent issue/task contract for substantial work

When work is substantial, multi-turn, remote, likely to be revised, shared across agents, or needs later Product Owner review, prefer one persistent issue/task record as the handoff contract instead of one very long dispatch prompt.

The persistent contract should hold the durable task-specific decisions:

```text
GOAL / USER OUTCOME
ROLE / USER JOB when relevant
AUTHORITY / BUSINESS-DESIGN RULES
CURRENT SCOPE BOUNDARY
KEEP
REMOVE / CHANGE
TARGET BEHAVIOR / IA
ACCEPTANCE SCENARIOS
DO NOT CHANGE
UNRESOLVED / ESCALATE WHEN
STOP / REVIEW BOUNDARY
```

Use one bounded issue per coherent workstream. Do not mix sibling scopes such as list correction, detail design, backend refactor, and unrelated cleanup merely because the same agent may touch them later.

The issue/task contract is **normative task authority**, not operational current-state truth. Do not freeze transient PR/CI/runtime state into it as if permanent. The coding agent must still resolve the current branch/HEAD/runtime before implementation.

If product/UX decisions change while work is in progress, update or clearly supersede the issue contract so later agents read one coherent current direction rather than reconstructing truth from chat history.

A short dispatch prompt should then point to the contract and provide only execution-time facts, for example:

```text
Implement <issue/task contract> in LEAN mode.
Resolve current live HEAD before coding.
Treat the issue as WHAT/WHY/acceptance authority.
Own the implementation plan inside your assigned boundary.
Finish the scoped implementation before the final targeted verification gate.
Do not reinterpret confirmed product decisions.
Stop at the requested review boundary.
```

Use a direct inline prompt instead when the task is genuinely small, isolated, unlikely to be revised, and does not benefit from persistent review/history. Creating an issue for every trivial change adds ceremony without improving correctness.

## 3B. Issue lifecycle and closure

Implementation completion is not the same as task acceptance.

For work that uses a persistent issue/task contract, keep the issue open through implementation, automated verification, required runtime/reviewer checks, Product Owner review, and any correction passes unless the project explicitly defines another acceptance authority.

Default lifecycle:

```text
ISSUE OPEN
→ implementation
→ consolidated automated verification
→ required runtime / reviewer evidence when applicable
→ READY FOR PRODUCT OWNER REVIEW
→ correction passes when needed
→ explicit authorized acceptance
→ closing record
→ ISSUE CLOSED
```

A coding/review worker must not close the issue merely because its assigned work is `COMPLETE` or its checks pass. Unless explicitly authorized otherwise, the worker should stop at the review boundary and report `READY FOR PRODUCT OWNER REVIEW`.

Close only after explicit acceptance by the Product Owner or other authority defined by the project. Reviewer PASS, CI PASS, or agent COMPLETE alone does not imply acceptance.

When closing a completed issue, leave a compact closing record when the repository/workflow supports comments. Include the evidence needed to identify what was accepted:

```text
Accepted by: <authority>
Accepted candidate / HEAD: <sha or exact candidate identity>
Related PR / workstream: <reference when applicable>
Final verification: <compact PASS / accepted-risk summary>
```

Do not copy transient history or long logs into the closing record. Record only the accepted candidate and evidence necessary to reconstruct the closure decision.

If a task is intentionally abandoned, superseded, duplicated, or closed as not planned, record that reason instead of pretending it completed successfully.

Do not use merge-coupled auto-close syntax such as `Closes #X` when merge is not the project's acceptance boundary. Prefer a non-closing reference such as `Refs #X` and close after the actual acceptance event. Use merge-driven auto-close only when the project explicitly defines merge as sufficient acceptance.

## 3C. Shape the packet to task-worker fit

Follow `llm-resource-governor` for capability judgment. Do not write different policy merely because a worker is called `frontier`, `small`, `cheap`, or belongs to a particular vendor/model family.

For a worker with demonstrated reliable fit on comparable work, the packet may stay outcome-oriented and allow more freedom over implementation sequencing within the bounded scope.

When fit is uncertain or prior evidence shows contract-retention problems, make the execution contract more constrained without simply making the prompt longer:

```text
ONE COHERENT SLICE
EXPLICIT KEEP
EXPLICIT CHANGE
EXPLICIT DO NOT CHANGE
OBSERVABLE ACCEPTANCE SCENARIOS
CHECKPOINT / STOP BOUNDARY when needed
TARGETED FINAL VERIFICATION
```

The main owner should retain product/design/architecture choices that would otherwise require the worker to infer authority.

For substantial constrained execution, prefer placing stable WHAT/WHY/acceptance in the persistent issue/task contract and using a short dispatch prompt. Do not paste the same long contract repeatedly into every correction prompt.

If the worker misses the same explicit acceptance class after the contract has been clarified, do not respond by indefinitely appending more prose. Re-evaluate task-worker fit and choose one or more of:

- shrink the owned slice;
- add an evidence checkpoint before proceeding;
- start a fresh worker context if the current one is stale/overloaded;
- move unresolved authority back to the main owner;
- escalate to a more suitable role/runtime/model outside CoMind's routing responsibility.

Do not use a fixed failure-count rule. Severity and the repeated error class determine whether to correct, restructure, or escalate.

## 4. Dispatch the role natively

Select the Agent Skill or explicit agent definition first, then use the current runtime's native isolation mechanism.

```text
selected role
→ native context / subagent / equivalent runtime mechanism
→ compact result/evidence
```

CoMind does not launch another coding runtime, proxy credentials, select a provider/model, or maintain a role-to-provider mapping.

If the user deliberately wants another runtime, preserve the same task packet and role contract, then invoke them from that runtime directly outside this handoff workflow.

## 5. Worker execution contract

For LEAN implementation workers:

```text
READ MINIMUM SUFFICIENT SOURCE
→ IMPLEMENT THE COMPLETE OWNED SLICE
→ INCLUDE RELEVANT TEST CODE
→ MECHANICAL DIFF CHECK
→ RUN THE FINAL TARGETED CHECKS ONCE
→ FIX FAILURES
→ RERUN ONLY INVALIDATED CHECKS
→ RETURN COMPACTLY
```

Do not insert repeated test/typecheck/build/browser cycles between small edits unless one of the packet's mid-implementation exceptions applies.

The worker may inspect existing tests before/during coding to understand expected behavior. The optimization concerns repeated **execution**, not useful source reading.

Browser/runtime tooling is not a default implementation completion step in LEAN. Use it only when the packet explicitly requires it or the worker hits an allowed runtime blocker and cannot proceed from source evidence.

## 6. Worker return contracts

Implementation worker:

```text
STATUS: COMPLETE | BLOCKED

Implemented:
- compact bullets

Files changed:
- exact paths

Verification:
- command/check — PASS | FAIL

Manual scenarios for owner/product review:
- scenario → expected result

Shared integration needed:
- value | NONE

Assumptions/blockers:
- value | NONE
```

When the assignment is governed by a Product Owner review boundary, `COMPLETE` means implementation/worker scope is complete; the issue remains open and the worker should end with `READY FOR PRODUCT OWNER REVIEW`.

Reviewer/evidence workers should return the structured verdict required by their skill when available. Do not request private chain-of-thought, long transcripts, or a tutorial.

## 7. Escalation boundary

The worker should stop and return BLOCKED/escalation when completing the assignment would require:

- a material business/product/design authority decision;
- architecture or shared-contract changes outside ownership;
- security/lifecycle/destructive behavior not already authorized;
- writing outside the assigned boundary;
- a required capability or credential it does not have;
- materially conflicting evidence;
- repeated verification failure that changes task scope.

Do not let a bounded worker silently become the feature owner.

## 8. Integration

The main owner:

1. collects compact worker reports;
2. verifies candidate/scope identity;
3. resolves shared wiring or conflicts;
4. checks authority/acceptance coverage;
5. reuses still-valid evidence;
6. runs the integrated consolidated verification gate required by the actual blast radius;
7. reruns only affected checks when the candidate changes;
8. updates the persistent issue/task contract when authoritative task decisions change;
9. adapts slice size/checkpoints when evidence shows poor task-worker fit rather than only lengthening prompts;
10. obtains the required Product Owner/authorized acceptance before closure when that is the project boundary;
11. records accepted candidate/evidence and closes the issue only after that acceptance;
12. runs project-required final review/ship gates according to the project's actual release boundary.

Worker PASS proves only the assigned concern.

In LEAN, do not add visual/runtime/browser review after integration merely as a completion ritual. Hand off explicit manual/product-review scenarios unless project authority or concrete unresolved evidence requires those agents/tools.

## 9. Prompt author contract

Coding-agent instructions should be English unless the user asks otherwise.

A substantial worker packet should be explicit about:

```text
GOAL
EXECUTION MODE
AUTHORITY / GUARDRAILS
OWNED SCOPE
DO NOT CHANGE
PRE-CODE SCENARIOS
FINAL REQUIRED VERIFICATION
MID-IMPLEMENTATION CHECK EXCEPTIONS
CONTEXT BUDGET
OUTPUT BUDGET
ESCALATE WHEN
RETURN CONTRACT
```

When a persistent issue/task contract exists, do not duplicate its full body into the dispatch prompt. Reference it, add execution-time facts, and keep one canonical task contract.

If the issue must remain open for Product Owner review, state that explicitly in the dispatch prompt: do not close the issue; stop at `READY FOR PRODUCT OWNER REVIEW`.

Do not compensate for poor task-worker fit by indiscriminately increasing prompt length. Prefer clearer authority, smaller scope, stronger acceptance evidence, and checkpoints.

Keep the packet executable and bounded.
