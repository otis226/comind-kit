# coding-agent-handoff

## Purpose

Use this workflow for non-trivial coding handoff/orchestration when one owner may delegate bounded implementation, inspection, or review to specialist workers.

It standardizes:

1. project/source resolution before coding;
2. design authority before user-visible UI changes;
3. ownership and vertical slicing before parallel mutation;
4. deterministic worker routing through user configuration;
5. minimum sufficient worker context and compact returns;
6. final integration and affected verification.

```text
PROJECT TRUTH BEFORE CODE
DESIGN AUTHORITY BEFORE UI CODE
OWNER DECIDES WHEN TO DELEGATE
CONFIG DECIDES WHICH WORKER RUNS THE ROLE
OWNERSHIP BEFORE PARALLEL WRITES
MINIMUM SUFFICIENT WORKER CONTEXT
COMPACT EVIDENCE BACK TO OWNER
MAIN OWNER INTEGRATES
```

Apply `llm-resource-governor` whenever delegation may save meaningful premium-owner quota or isolate review/evidence work.

## 1. Resolve project/source

Before implementation, the owner must:

- read current repository instructions;
- identify the actual repository/surface/flow in scope;
- inspect current working tree/HEAD when relevant;
- resolve current business/product/API/security/lifecycle authority;
- avoid using stale historical snapshots as current truth;
- report BLOCKED only when material ambiguity cannot be resolved from available authority.

Prefer repository-relative paths, SHAs, issue/PR identifiers, and exact source locators over copied transcripts.

## 2. Resolve UI design authority

For user-visible UI work, apply `ui-design-authority` and classify the surface:

```text
REFERENCE_BACKED
SYSTEM_BACKED
PRODUCT_DERIVED
GREENFIELD
```

An exact accepted reference governs parity only where proven. Business/lifecycle/security truth still comes from current project authority.

Do not let a coding worker invent a new visual language merely because no exact screen exists.

## 3. Main owner responsibility

One main owner remains accountable for:

- source/design/business authority;
- risk and scope;
- decomposition/ownership;
- architecture and shared contracts;
- fan-out decisions;
- integration/conflict resolution;
- combined verification;
- final handoff state.

Bounded workers execute clearly scoped work. They do not become independent owners of shared architecture.

## 4. Deterministic worker routing

Do not choose worker provider/model by estimating price from names.

Use this boundary:

```text
llm-resource-governor
= WHEN offload is valuable / WHEN escalation is required

worker-profiles.yaml
= WHICH runtime + model + endpoint + credential source runs each agent/skill

agent-bridge
= HOW the configured profile is executed/enforced
```

Invoke the desired role by name through Agent Bridge. Avoid routine `--sdk`/`--model` overrides because they bypass configured user intent.

Handle route results:

```text
NATIVE
→ spawn/use the normal native specialist

OK
→ consume compact result/evidence

BLOCKED
→ resolve configured credential/capability/config blocker or escalate

BACKEND_FAILED
→ inspect bounded failure; retry only when useful
```

Never silently switch a BLOCKED configured worker to another third-party provider.

## 5. Fan-out gate

Do not spawn a worker just because the runtime supports it.

### FAST

```text
owner only, or owner + one bounded worker when offload has clear value
```

### STANDARD

```text
owner + up to two concurrent bounded workers
```

### HIGH_RISK

Prefer parallel investigation over parallel mutation. Keep destructive/shared mutation centralized.

Parallel work must be independently executable, have non-overlapping ownership, and produce compact results.

## 6. Vertical slices

Prefer complete slices:

```text
Slice A = Documents flow
Slice B = Activity flow
Slice C = Edit flow
```

Avoid layer fan-out:

```text
Agent A = React
Agent B = CSS
Agent C = Tests
```

Do not let several write workers mutate the same shared parent/API/state/style region without explicit isolation.

## 7. Ownership map

Before parallel mutation, define:

```text
SLICE: <goal>
OWNS:
- exact files/components/logic boundary

VERIFY:
- targeted checks

SHARED DEPENDENCIES:
- read-only / integration-needed

MAIN OWNER OWNS:
- shared parent/wiring
- shared API/state contracts
- shared design-system changes
- cross-slice regression
```

## 8. Worker task packet

A worker must not inherit the entire owner conversation by default.

Send:

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

Context budget example:

```text
Start from the named files/routes only.
Follow imports/callers only when needed.
Do not scan unrelated modules.
Do not copy source text unless it is material evidence.
```

## 9. Worker output contracts

Implementation worker:

```text
STATUS: COMPLETE | BLOCKED
Implemented:
- compact bullets
Files changed:
- exact paths
Verification:
- command/check — PASS/FAIL
Shared integration needed:
- value | NONE
Assumptions/blockers:
- value | NONE
```

Reviewer worker should use an evidence-bearing structured verdict when available. Keep summary/findings bounded; do not return chain-of-thought or large raw transcripts.

End the worker after it returns its contract.

## 10. UI review routing

Choose reviewer role by actual change:

```text
visual/composition/style
→ ui-visual-reviewer

interaction/state/navigation/form/async/runtime
→ ui-runtime-reviewer

both materially changed
→ both reviewers

neither
→ neither UI reviewer
```

The worker config decides which model/runtime runs those roles.

If browser evidence is required, the mapped worker must have verified browser capability. BLOCKED evidence may not be replaced by implementer intuition.

## 11. Final integration

After delegation:

```text
collect compact worker reports
→ inspect combined diff/current candidate at required risk level
→ resolve shared wiring/conflicts
→ verify authority/acceptance coverage
→ reuse still-valid evidence
→ rerun only invalidated/affected checks
→ run required visual/runtime/business verification
→ fix integration defects
→ continue ship/handoff workflow
```

Worker PASS is evidence for a bounded concern, not feature completion.

## 12. Evidence reuse

Do not rerun expensive evidence on an unchanged candidate just because the workflow phase changed.

When candidate changes:

1. identify invalidated evidence;
2. rerun only affected evidence;
3. broaden only when blast radius is unclear.

## 13. Escalation

Escalate to the owner when:

- authority is materially ambiguous;
- architecture/shared contracts/security/lifecycle/destructive behavior are implicated;
- the configured worker lacks required capability/credential;
- independent workers materially disagree;
- verification repeatedly fails;
- worker scope must expand across ownership boundaries;
- confidence is insufficient for a high-severity decision/mutation.

Second opinions are earned, not automatic.

## 14. Prompt author contract

Coding-agent prompts should be English unless the user asks otherwise.

A substantial handoff should include relevant sections:

```text
GOAL
CURRENT AUTHORITY / BUSINESS GUARDRAILS
PROJECT/SOURCE RESOLUTION
UI DESIGN AUTHORITY
ORCHESTRATION / OWNERSHIP
WORKER ROUTING (role names, not guessed providers)
CONTEXT / OUTPUT BUDGET
IMPLEMENTATION SCOPE
VERIFICATION / DONE CRITERIA
DO NOT / GUARDRAILS
```

Do not skip quality/safety/business/release gates to save quota.
