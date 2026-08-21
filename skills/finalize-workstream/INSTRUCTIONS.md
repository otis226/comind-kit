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
→ durable knowledge sync when applicable
→ COMPLETE / MERGED
```

Project-specific ship/deploy rules must come from current project instructions, repository release policy, or other canonical project authority.

## 1. Merge authority

Do not merge merely because an agent or reviewer returned PASS. Merge requires an explicit user instruction or another authority recognized by the current project.

If the project requires exact-SHA sign-off, freeze that SHA. Otherwise still record the candidate being merged and the evidence that applies to it.

A user may explicitly accept a known delta or override a missing non-critical gate. Record the override/risk acceptance, do not relabel an unverified gate as PASS, do not override a safety/security blocker that cannot legitimately be waived, and resume from the latest valid checkpoint.

## 2. Freeze the candidate

Before merge, read current PR/branch metadata, verify expected HEAD/candidate, verify dependent candidates in multi-repo work, inspect relevant dirty/untracked state when local, and never reset/delete user work blindly.

If an exact accepted candidate changed without explicit acceptance:

```text
MERGE BLOCKED — ACCEPTED CANDIDATE CHANGED
```

## 3. Resolve the pre-merge ship gate

There is no universal command list for every project. Resolve project/repository instructions, repository-specific ship/release workflow, required CI/check configuration, then canonical build/test/lint/type/security commands when no higher-level orchestrator exists.

Do not copy release commands from another project.

Signals such as `mergeable=true`, visual PASS, browser smoke PASS, or "CI will run after merge" do not replace a mandatory ship gate.

```text
MERGE BLOCKED — SHIP GATE RED
MERGE BLOCKED — SHIP GATE NOT VERIFIED
```

An authorized override must remain reported as `OVERRIDDEN / NOT VERIFIED`, never PASS.

## 4. Base drift and CI

If the target branch advances, inspect the delta, determine overlap with accepted scope, continue through irrelevant drift when safe, and run targeted integration verification for relevant overlap/conflicts.

Do not resolve a conflict/rebase and assume old acceptance automatically covers changed code.

Required CI failures caused by the candidate block merge unless a policy-appropriate explicit override exists. Distinguish infrastructure/historical noise from product failure.

## 5. Dependency-aware merge

Merge multi-repo/PR dependencies in dependency order.

```text
provider/API dependency
→ verify target contains accepted dependency
→ consumer
```

Record candidate, accepted deltas, ship-gate evidence/override, merge method, and merge/target SHA.

## 6. Post-merge integrity

Run a lightweight check sufficient to show that target contains the intended change, important files/commits were not lost, and conflict resolution did not silently alter behavior.

Whether post-merge CI/deploy is a synchronous closure gate or an operational signal depends on project policy. Do not poll indefinitely when the project does not require it.

## 7. Cleanup classification

```text
A. TRANSIENT → delete when safe
B. REUSABLE VERIFICATION INFRASTRUCTURE → keep/promote
C. PRODUCT SOURCE / TEST / FIXTURE → keep
D. FINAL AUDIT / SIGN-OFF EVIDENCE → keep
E. UNKNOWN / OWNERSHIP UNCERTAIN → keep and report
```

Do not substitute broad destructive commands such as `git clean -fdx`, `git reset --hard`, or blind recursive deletion for classification. Untracked does not mean disposable.

## 8. Evidence, worktrees, processes, and branches

Use `evidence-transport` for reviewer-accessible artifacts and retain final audit metadata that matters. Do not create a release/tag merely to archive verification evidence.

Before removing a worktree, verify there is no unique/uncommitted user work, verify intended commits are reachable from target, stop workstream-owned processes, and use the normal worktree removal workflow.

Do not kill shared infrastructure. Delete a feature branch only after merge, when it has no unique commits/worktree, and repository convention permits deletion.

## 9. Durable knowledge

After finalization, persist durable information through the documentation or knowledge mechanism allowed by the current project when such information has cross-session value.

Do not turn a merge event, branch HEAD, or live CI status into a business rule.

## 10. Anti-loop stop rule

Once status is `COMPLETE / MERGED`, do not start another general review merely because more checking is theoretically possible.

Reopen only for a material trigger such as reproducible regression, new requirement/decision, candidate/integration change affecting acceptance, concrete required-gate/delivery failure, or an acceptance-affecting finding.

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

KNOWLEDGE SYNC
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
