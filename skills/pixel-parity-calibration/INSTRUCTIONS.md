# pixel-parity-calibration

## Purpose

Use this with `design-parity` when Structural Visual has PASSed but Pixel Visual still fails and residual mismatch may come from intentional deltas, fixtures/data, deterministic clock/state, or capture/render noise rather than a real product visual defect.

This workflow does not replace Structural Visual. It determines which residuals require product changes and which require verification normalization.

## 1. Exact product state

Acceptance evidence must identify the product state it actually exercised.

If a browser renders a committed SHA plus dirty WIP, screenshots may be used for diagnosis but must not be reported as PASS evidence for the clean committed SHA.

Before acceptance, either commit the proven changes or deliberately remove unneeded experimental changes and recapture. Never reset/delete a dirty worktree blindly.

## 2. Residual classes

### A — Product visual defect

Layout, hierarchy, action placement, spacing, or wrapping genuinely violates authority.

```text
fix product → targeted verify → commit → recapture
```

### B — Intentional product/design delta

A valid capability/product decision differs from the exact reference. Document the delta, keep exclusions/masks minimal and deterministic, and never mask Class A.

### C — Fixture/cardinality/literal-data mismatch

Normalize deterministic data shape. Do not change CSS merely to match a different dataset.

### D — Clock/state-derived text

Freeze time/state or seed a semantically equivalent fixture. Do not change business calculations merely to match a snapshot.

### E — Capture/render noise

Normalize crop, shared chrome, focus, motion, font/render variance, and equivalent capture conditions before changing thresholds.

## 3. Calibration sequence

```text
confirm exact clean candidate
→ classify A/B/C/D/E
→ eliminate A with product fixes
→ normalize C/D/E
→ predeclare B
→ recapture
→ evaluate threshold
```

Do not reuse an old mismatch ratio after product, fixture, crop, or capture conditions change.

## 4. Sub-crop / exclusion

An exclusion is valid only when whole-surface Structural Visual already PASSes, the excluded area is a documented Class B or non-owned Class E region, it contains no known Class A defect, configuration is deterministic/reviewer-accessible, and semantic/interaction/business concerns still cover product-owned behavior.

## 5. Threshold discipline

A threshold is meaningful only after comparable deterministic evidence has been calibrated. Do not increase a threshold merely because the current candidate fails.

Recalibration requires Structural Visual PASS, Class A = NONE, reasonable C/D/E normalization, correct B documentation/splitting, and repeated known-good captures demonstrating baseline noise.

## 6. Handoff

```text
Candidate:
Working tree clean: YES|NO
Structural Visual: PASS
Pixel Visual:
Residual classes A/B/C/D/E:
Product fixes:
Fixture/clock/capture normalization:
Intentional exclusions/sub-crops:
Threshold/calibration:
Evidence:
```

If the working tree is dirty, do not claim the evidence proves PR HEAD.

This is reusable verification policy, not a project-specific business/design rule.
