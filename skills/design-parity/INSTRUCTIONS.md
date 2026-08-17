# design-parity

## Purpose

Use this workflow when an **exact accepted design/reference is an acceptance target** and the implementation must demonstrate fidelity with evidence.

If there is no exact-design acceptance requirement, do not create a fake parity gate. Use `ui-design-authority` plus coherence/design-quality review instead.

`ui-review` helps identify gaps; this workflow defines the evidence needed to conclude whether an implementation satisfies exact-reference scope.

## 1. Authority boundary

Business, security, and operational source priority still come from the current project.

An exact design is visual/interaction authority only for the proven surface/state. Prototype-only data, routes, lifecycle, and fake state are not production contracts.

If an accepted reference conflicts with a newer business or security invariant, preserve the invariant and document an `intentional business-safe delta`.

## 2. Two-pass conversion for major structural changes

### Pass A — Structural / visual port

Verify:

- hierarchy;
- copy/labels;
- grouping;
- proportion;
- spacing rhythm;
- visual states;
- action placement.

### Pass B — Production rewire

Reconnect:

- real APIs/state;
- permission/domain gates;
- loading/error/empty states;
- audit/integration behavior;
- accessibility;
- production interaction.

Re-run visual verification after the rewire because real data can change layout.

## 3. Independent acceptance concerns

Treat these as separate concerns:

1. Visual.
2. Structure / semantics.
3. Interaction / state.
4. Business contract.
5. Regression.

A PASS in one concern does not replace another.

## 4. Visual gate

```text
Visual
├─ Structural Visual
└─ Pixel Visual
   └─ requires Comparable State
```

### Structural Visual

Judge composition and hierarchy independently of literal values:

- component/state variant;
- information order;
- row/column composition;
- proportion;
- spacing/alignment;
- wrapping/truncation;
- control placement;
- expanded/collapsed geometry;
- responsive/crop geometry within scope.

Literal data differences do not excuse structural defects.

### Comparable State

Pixel comparison is actionable only when the candidate and reference are meaningfully comparable:

- same business/component state;
- same role/tab/expanded condition;
- same viewport;
- same focused surface/crop;
- sufficiently comparable data shape/cardinality;
- intentional deltas declared in advance.

If state is not comparable:

```text
Structural Visual = PASS/FAIL/BLOCKED as usual
Pixel Visual      = BLOCKED
Raw pixel diff    = diagnostic only
```

### Pixel Visual

When comparable:

```text
REFERENCE screenshot
vs
PRODUCTION screenshot
→ focused diff
→ PASS / FAIL
```

Prefer stable focused surfaces over whole-page pixel ratios. Thresholds must be calibrated from known-good comparable evidence; a fixed percentage is not universal truth.

When structural parity passes but residual pixel mismatch remains, use `pixel-parity-calibration` before changing product code or thresholds.

### Verdict composition

```text
Structural FAIL                  → Visual FAIL
Structural PASS + Pixel FAIL    → Visual FAIL
Structural PASS + Pixel BLOCKED → Visual BLOCKED
Structural PASS + Pixel PASS    → Visual PASS
Structural BLOCKED              → Visual BLOCKED
```

Normalize viewport, fonts, animation, time/date, scroll/expanded state, and focus when practical. Never hide product elements merely to reduce a diff.

## 5. Structure and semantics

Use semantic evidence appropriate to the surface: role/name assertions, ARIA snapshots, DOM contracts, or equivalent.

A visually similar button/input/heading with incorrect semantics still fails.

Relevant page, API, or console failures can invalidate evidence and should produce FAIL/BLOCKED until resolved or proven out of scope.

## 6. Interaction and state

Exercise important states in a real browser when relevant:

- click/open/close;
- select/expand;
- enabled/disabled;
- loading/error/empty;
- form validation;
- state transitions;
- keyboard/focus behavior.

## 7. Business contract

Material invariants should have targeted executable assertions or scenarios when practical, not just prompt text.

If a prototype differs from a confirmed invariant, the invariant wins and the delta is documented.

## 8. Regression and candidate identity

Run project-appropriate targeted tests, type checks, lint, builds, or E2E. Test PASS does not replace visual evidence; visual PASS does not replace business/regression evidence.

Evidence proves only the candidate state it actually exercised:

```text
candidate A → PARITY READY
product changes → candidate B
→ evidence A does not automatically cover B
```

Use `runtime-regression` to determine what can carry forward and what must be rerun. Dirty/uncommitted work can be diagnostic evidence but must not be attributed to a different committed SHA.

## 9. Done rule

Do not claim `aligned`, `matches design`, `PARITY READY`, or equivalent while any required concern is FAIL/BLOCKED/NOT VERIFIED, including:

- required surfaces;
- Structural Visual;
- required Pixel Visual;
- semantics;
- interaction;
- business contract;
- regression;
- unexplained relevant runtime errors;
- undocumented intentional deltas;
- reviewer-inaccessible evidence when independent review is required.

Environment/data limitations should be reported as `BLOCKED` or `NOT VERIFIED`, not converted to PASS.

Use `N/A` only when a concern is genuinely outside acceptance scope.

## 10. Completion and evidence manifest

```text
PARITY READY
= executable evidence covers the exact-reference acceptance scope

PRODUCT COMPLETE
= PARITY READY + required human/product acceptance on the final product state
```

AI parity review does not replace human/product acceptance.

Minimum manifest:

```text
Product candidate: <branch/SHA>
Reference identity/ref:
Surface/state:
Viewport:
Structural Visual: PASS|FAIL|BLOCKED
Comparable State: PASS|FAIL|BLOCKED
Pixel Visual: PASS|FAIL|BLOCKED|N/A
Semantics: PASS|FAIL|BLOCKED
Interaction: PASS|FAIL|BLOCKED
Business: PASS|FAIL|BLOCKED
Regression: PASS|FAIL|BLOCKED
Intentional deltas:
Evidence:
```

If Pixel Visual is BLOCKED, state exactly what comparable fixture/state is missing rather than saying only `data differs`.

## 11. Evidence and helper lifecycle

Use `evidence-transport` for screenshots, diffs, traces, and reports that reviewers need to access.

```text
Evidence is disposable; reproducibility is durable.
Product repositories should retain capabilities, not debugging sessions.
```

Promote reusable helpers into owned verification infrastructure; delete session-specific helpers when they are no longer needed. Use `finalize-workstream` for cleanup/finalization.

## 12. Fixture and threshold discipline

Parity fixtures are verification infrastructure, not random UAT residue.

- prefer deterministic fixtures for important states;
- do not damage a valuable fixture merely to manufacture a screenshot;
- missing required scenario → BLOCKED, or seed at the correct layer when allowed;
- do not raise thresholds merely to turn red into green;
- do not crop/mask a defect without a documented scope reason;
- do not call geometry/hierarchy defects data noise because literal content differs.

If threshold, crop, config, or fixture changes, recapture/re-evaluate affected evidence.

## 13. Orchestration

Write slices may be parallelized by ownership, but the parity verdict must run against the **combined candidate** owned by final integration.

Do not aggregate independent subagent PASS results into a feature-level PASS without combined verification.
