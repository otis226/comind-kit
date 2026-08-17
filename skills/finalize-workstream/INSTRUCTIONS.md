# finalize-workstream

## Purpose

Use this workflow when a feature/workstream has the required acceptance and an authorized user asks to merge, finalize, or clean it up.

```text
accepted candidate
→ freeze candidate
→ resolve project ship gate
→ merge safety
→ merge
→ lightweight integrity check
→ cleanup
→ durable knowledge/documentation update when applicable
→ COMPLETE / MERGED
```

This is reusable workflow policy. Project-specific ship/deploy rules must come from current project instructions, repository release policy, or other canonical project authority.

## 1. Merge authority

Do not merge merely because an agent or reviewer returned PASS.

Merge requires an explicit user instruction or another authority recognized by the current project.

If the project requires exact-SHA sign-off, freeze that SHA. Otherwise still record the candidate being merged and the evidence that applies to it.

A user may explicitly accept a known delta or override a missing non-critical gate. When that happens:

- record the override/risk acceptance;
- do not relabel an unverified gate as PASS;
- do not override a safety/security blocker that cannot legitimately be waived;
- resume from the latest valid checkpoint rather than restarting the entire workflow.

## 2. Freeze the candidate

Before merge:

- read current PR/branch metadata;
- verify expected HEAD/candidate;
- verify dependent candidates in multi-repo work;
- inspect relevant dirty/untracked state when a local workspace exists;
- never reset/delete user work blindly.

If an exact accepted candidate changed without explicit acceptance:

```text
MERGE BLOCKED — ACCEPTED CANDIDATE CHANGED
```

If the user explicitly accepts the new delta, record the original accepted state, the delta, and the actual merge state, then run impact-based verification when needed.

## 3. Resolve the pre-merge ship gate

There is no universal command list for every project.

Resolve in this order:

1. project/repository instructions;
2. repository-specific ship/release workflow;
3. required CI/check configuration;
4. canonical build/test/lint/type/security commands when no higher-level orchestrator exists.

Do not copy release commands from another project.

Signals such as `mergeable=true`, visual PASS, browser smoke PASS, or "CI will run after merge" do not replace a mandatory ship gate.

If a mandatory gate fails:

```text
MERGE BLOCKED — SHIP GATE RED
```

If it cannot be verified:

```text
MERGE BLOCKED — SHIP GATE NOT VERIFIED
```

unless authorized project policy explicitly accepts proceeding with that known gap. Report such a gate as `OVERRIDDEN / NOT VERIFIED`, never PASS.

## 4. Base drift and CI

If the target branch advances:

- inspect the delta;
- determine overlap with the accepted contract/scope;
- continue through irrelevant drift when safe;
- run targeted integration verification for relevant overlap/conflicts.

Do not resolve a conflict/rebase and assume the old acceptance automatically covers the changed code.

Required CI failures caused by the candidate block the merge unless an explicit policy-appropriate override exists. Distinguish infrastructure/historical noise from product failure.

## 5. Dependency-aware merge

Merge multi-repo/PR dependencies in dependency order.

```text
provider/API dependency
→ verify target contains accepted dependency
→ consumer
```

Record:

- PR/candidate;
- accepted deltas;
- ship-gate evidence/override;
- merge method;
- merge/target SHA.

A platform-generated squash/merge commit does not require replaying every historical check if accepted content is preserved and conflict resolution did not change behavior.

## 6. Post-merge integrity

Run a lightweight check sufficient to show that:

- target contains the intended change;
- important files/commits were not lost;
- conflict resolution did not silently alter behavior.

Whether post-merge CI/deploy is a synchronous closure gate or an operational signal depends on project policy.

Do not poll indefinitely when the project does not require waiting for a terminal post-merge pipeline state. If a concrete failure appears, open a targeted recovery scope.

## 7. Cleanup classification

After merge/integrity, classify remaining material:

```text
A. TRANSIENT → delete when safe
B. REUSABLE VERIFICATION INFRASTRUCTURE → keep/promote
C. PRODUCT SOURCE / TEST / FIXTURE → keep
D. FINAL AUDIT / SIGN-OFF EVIDENCE → keep
E. UNKNOWN / OWNERSHIP UNCERTAIN → keep and report
```

Do not substitute broad destructive commands such as `git clean -fdx`, `git reset --hard`, or blind recursive deletion for classification.

Untracked does not mean disposable.

Typical transient candidates include temporary screenshots/diffs/HAR/traces/videos, generated reports/ZIPs, debug dumps/logs, session-only helpers, and untracked generated build/test output.

Promote reusable helpers into owned infrastructure; delete session-specific scratch when safe.

## 8. Evidence, worktrees, processes, and branches

Use `evidence-transport` for reviewer-accessible artifacts and retain final audit metadata that matters. Do not create a release/tag merely to archive verification evidence.

Before removing a worktree:

- verify there is no unique/uncommitted user work;
- verify intended commits are reachable from target;
- stop processes owned by the workstream;
- use the normal worktree removal workflow.

Do not kill shared infrastructure.

Delete a feature branch only after merge, when it has no unique commits/worktree, and repository convention permits deletion.

## 9. Durable knowledge/documentation

After finalization, persist durable information through the documentation/knowledge mechanism allowed by the current project, if one exists.

Persist only information with cross-session value, such as:

- final review/provenance worth retaining;
- newly accepted product/business decisions;
- reusable workflow lessons;
- changed project-specific rules.

Do not convert a merge event or live CI status into a business rule. Operational status should normally be queried live unless historical evidence is required.

## 10. Anti-loop stop rule

Once status is `COMPLETE / MERGED`, do not start another general review merely because more checking is theoretically possible.

Reopen only for a material trigger such as:

- reproducible regression;
- new requirement/decision;
- candidate/integration change affecting acceptance;
- concrete required-gate or delivery failure;
- P0/P1 or another acceptance-affecting finding.

Do not reopen for speculative risk, optional refactoring, low-value polish, or a test improvement that does not demonstrate a current defect.

## 11. Final report

```text
CANDIDATE
Primary SHA/state:
Dependencies:
Accepted delta/override:

PRE-MERGE
PR HEAD verified:
Base drift:
Required CI:
Ship gate source:
Ship gate result: PASS | FAIL | NOT VERIFIED | OVERRIDDEN
Evidence:

MERGE
PR(s):
Merge method:
Merge/target SHA(s):

POST-MERGE
Integrity:
Post-merge pipeline if relevant:

CLEANUP
Transient removed:
Unknown kept:
Reusable infra/tests kept:
Worktrees/branches/processes:

KNOWLEDGE / DOCUMENTATION
Files changed:
Destination/state:

FINAL STATUS:
COMPLETE / MERGED | BLOCKED
```

```text
Resolve the project's actual ship policy.
Freeze what is accepted.
Do not pretend an override is a PASS.
Merge preserves the accepted state.
Cleanup removes the session, not the capability.
Done means stop unless something materially changes.
```
