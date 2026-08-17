# runtime-regression

## Purpose

Use this workflow when a feature previously PASSed real browser/UAT verification but the product receives additional commits before final acceptance or merge.

It prevents runtime evidence from being carried forward incorrectly across different candidate states. When exact design parity also applies, this evidence can support Interaction, Business, and Regression concerns in `design-parity`.

## 1. Exact-candidate evidence rule

A runtime/UAT PASS proves only the candidate state that was actually exercised.

```text
candidate A
→ critical journey PASS

product changes → candidate B
→ A's PASS does not automatically cover B
```

Rerun based on impact rather than replaying the entire historical suite after every commit.

- isolated visual-only change may need only targeted smoke;
- state/API/cache/shared-component changes should rerun affected journeys;
- shared integration changes affecting many surfaces should rerun the combined affected flow.

If you cannot demonstrate that a change cannot affect prior critical behavior, prefer rerunning the relevant journey.

## 2. Current-candidate regression bridge

When a historical browser baseline exists but the candidate has advanced:

```text
historical functional PASS
→ subsequent changes
→ CURRENT-CANDIDATE REGRESSION
→ critical capabilities still PASS?
```

If a real regression appears:

- reopen root-cause investigation at the correct scope;
- fix the correct layer;
- add/adjust a test from the observed failure when practical;
- rerun the affected journey.

If the journey still PASSes, carry forward only concerns that the new changes demonstrably did not affect.

## 3. Final-candidate critical journey

Before final readiness for an important flow, use the real application and matching dependency contracts when practical:

- real browser;
- relevant critical mutation with network evidence;
- reload/persistence for important state;
- relevant page/console errors clean;
- no mock-only evidence standing in for required runtime behavior.

If code changes after this journey, rerun affected parts before the new candidate inherits PASS.

## 4. Relationship to visual/design work

Runtime PASS does not prove visual fidelity. Visual PASS does not prove runtime workflow correctness.

With exact parity:

```text
Structural/Pixel Visual
+ Runtime Interaction/Business/Regression evidence
= independent concerns of one candidate
```

Without exact design, runtime regression still applies alongside coherence/design-quality visual review.

## 5. Orchestration

- read/search investigation may be parallelized;
- independent journeys may run in parallel when fixtures/state do not collide;
- mutation-heavy journeys require clear fixture/ownership boundaries;
- do not let multiple writers mutate the same shared region without isolation;
- final integration owns the combined result.

## 6. Evidence handoff

```text
Candidate: <exact SHA/state>
Historical runtime baseline: <SHA/evidence>
Changes since baseline: <impact summary>
Journeys rerun: <list>
Browser/page errors: NONE|details
Console errors: NONE|details
Critical API failures: NONE|details
Interaction: PASS|FAIL|BLOCKED
Business: PASS|FAIL|BLOCKED
Regression: PASS|FAIL|BLOCKED
Evidence: <reviewer-accessible location>
```

If a journey was not rerun and the new changes could affect it, do not silently carry forward PASS. Mark it `NOT VERIFIED`/`BLOCKED` or rerun it.
