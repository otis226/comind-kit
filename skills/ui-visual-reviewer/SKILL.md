---
name: ui-visual-reviewer
description: >-
  Use after meaningful user-visible UI implementation for an independent visual review. Inspect the rendered candidate in PARITY, COHERENCE, or DESIGN_QUALITY mode, apply product-ui critique discipline, and return an evidence-backed PASS/FAIL/BLOCKED verdict without editing implementation code.
---

<!-- comind-managed-skill: ui-visual-reviewer -->

# UI Visual Reviewer

Act as an independent read-only reviewer. Do not edit implementation code.

When the runtime supports isolated subagents, prefer running this skill in a fresh context separate from the implementer.

Do not trust the implementer's claim that the UI is correct. Inspect rendered evidence and design authority yourself.

Resolve project-specific evidence and design authority from the current repository. Compose this skill with `ui-review`, `product-ui-critique`, and `design-parity` when relevant.

## 1. Resolve review mode

Use the design authority to select:

```text
PARITY
= exact accepted reference exists

COHERENCE
= established system or product-derived conventions govern the surface

DESIGN_QUALITY
= greenfield/provisional design contract
```

Do not invent an exact reference to enable PARITY.

## 2. Resolve candidate and baseline

Identify the exact candidate, required surface/state, relevant viewport, authority inputs, and shared-chrome/out-of-scope boundaries.

If required authority is genuinely ambiguous, return `BLOCKED`.

When acceptance depends on the current rendered candidate rather than only on a supplied immutable artifact, preflight the browser automation or inspection capabilities exposed to this reviewer. If a suitable browser capability is available, open and inspect the live candidate yourself instead of accepting the implementer's or parent session's visual pass as proof.

If the required browser tool exists but invocation is permission-gated, report the exact blocked capability or permission requirement. After permission is granted, rerun the blocked visual review independently against the same candidate before it can PASS. If no suitable browser capability is exposed and the required rendered state cannot be established another project-approved way, return `BLOCKED`.

## 3. Review order

Review in this order:

1. task/action clarity and visible state;
2. information hierarchy/grouping;
3. system/product coherence;
4. layout/proportion/density;
5. visual taste/polish/anti-slop.

Do not let aesthetic preference outrank project authority or workflow clarity.

## 4. PARITY mode

Compare exact reference and production in a meaningfully comparable state.

Judge composition/structural fidelity, styling fidelity, and pixel evidence when pixel comparison is required and comparable.

Literal data differences do not excuse structural defects. Do not use critique heuristics to redesign an accepted reference.

## 5. COHERENCE mode

Review against tokens/theme, shared primitives, design-system rules, representative sibling screens, and derived conventions.

Ask whether the surface clearly belongs to the same product, reuses the right primitives, avoids unnecessary new visual vocabulary, and uses cards/badges/color/whitespace/controls only when they serve the workflow.

Do not pixel-match sibling screens with different intent.

## 6. DESIGN_QUALITY mode

Review against the Minimal Design Contract and task intent.

Judge hierarchy, action path, visual grammar, appropriate density, readable/accessible states, responsive baseline, and absence of template filler that does not serve the task.

Novelty is not a PASS criterion.

## 7. Critique discipline

For each material issue:

- identify where it appears using spatial or control anchors;
- separate direct observation from inference;
- explain impact, not preference;
- tie the assessment to authority or task intent;
- recommend the smallest effective correction;
- lower confidence when evidence cannot prove hidden behavior or system rules.

Use `KEEP — Do not change` for already-correct choices that follow-up fixes must preserve.

## 8. Verdict contract

```text
Surface: <name>
Mode: PARITY | COHERENCE | DESIGN_QUALITY
Composition: PASS | FAIL | BLOCKED
Styling/System: PASS | FAIL | BLOCKED
Pixel: PASS | FAIL | BLOCKED | N/A
Evidence: ...
Mismatches:
- ... | NONE
KEEP — Do not change:
- ... | NONE
```

Aggregate:

- any required FAIL → visual FAIL;
- any required BLOCKED without FAIL → visual BLOCKED;
- PASS requires every required concern to pass;
- Pixel must pass only when it is part of acceptance scope.

Do not claim product completion. Return the independent verdict to the task owner.
