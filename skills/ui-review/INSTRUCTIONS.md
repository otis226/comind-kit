# ui-review

## Purpose

Use this workflow to review UI/UX when an exact design/reference, current implementation, established design system/product language, derived product conventions, or greenfield proposal is available.

The goal is to find the right gaps, understand intent, and keep **business correctness**, **design authority**, and **implementation detail** distinct.

When exact-design acceptance applies, visual fidelity is a deliverable. Without exact design, do not invent a pixel-parity gate; review consistency and design quality against actual authority.

Use `product-ui-critique` as the critique lens for screenshots, mockups, or existing product UI.

## 1. Resolve authority before review

Use current project source priority and `ui-design-authority` when design authority is unclear.

```text
REFERENCE_BACKED → PARITY REVIEW
SYSTEM_BACKED / PRODUCT_DERIVED → COHERENCE REVIEW
GREENFIELD → DESIGN QUALITY REVIEW
```

Current implementation is evidence, not automatically the design source of truth.

## 2. Source priority

Unless the project defines a more specific order, prefer latest authorized confirmation, current canonical product/design source, confirmed project decisions, established/reliably derived product patterns, then current implementation.

If an exact design conflicts with a newer business/security invariant, the invariant wins and the visual delta must be documented.

## 3. Local-first and portable handoff

Inspect current HEAD and dirty state, prefer the current working tree when it is clearly the latest relevant source, do not reset to a historical commit merely because an older review used it, use repository names/relative paths in handoff, and use historical SHAs for provenance unless authority requires them as targets.

## 4. Exact reference handling

A reference may be Figma, exported source, HTML, screenshot, spec, or equivalent. When matching source can be rendered, prefer source plus real screenshots over guessing from a static screenshot alone.

Do not blindly copy mock data, fake routing, prototype-only state, styling that conflicts with production conventions, or lifecycle/permission/API behavior without a production contract.

Do not remove useful production capability merely because the reference omits it.

## 5. Define visual scope

Identify screen-owned content, shared application/project chrome, state/role/tab/viewport under review, literal data differences to ignore, and intentional product deltas.

Shared chrome may affect layout width but is not automatically part of a screen-specific conversion target.

## 6. PARITY review

```text
render reference at required state/viewport
→ capture focused surface
→ render production under equivalent conditions
→ capture equivalent surface
→ identify the 3–5 largest gaps
→ inspect DOM/CSS/tokens for those gaps
→ fix
→ recapture
```

Screenshots show **what is wrong**; DOM/CSS/metrics help explain **why**. Use `design-parity` when exact-reference acceptance evidence is required.

## 7. COHERENCE review

Review token/component reuse, typography hierarchy, spacing rhythm/density, surface/card/control grammar, interaction conventions, semantic colors/states, icon family, sibling-screen consistency, responsive behavior, and workflow-driven information architecture.

Key question:

> If the URL and feature name were hidden, would this surface clearly belong to the same product and use the right patterns for this job?

Do not pixel-match a sibling screen with a different purpose.

## 8. DESIGN QUALITY review

Review hierarchy/scanability, task clarity, primary/secondary actions, information density, feedback/state handling, accessibility/responsive baselines, consistency with the Minimal Design Contract, and template-driven treatment that does not serve the task.

The goal is not novelty. It is intentional, usable, coherent product UI.

## 9. Review order

Review from large structural concerns to local polish:

1. Behavior / State.
2. Information Architecture.
3. Layout / Proportion.
4. Visual Hierarchy.
5. Density / Spacing.
6. Visual Polish.

Apply `product-ui-critique` within each layer without letting taste override workflow, information architecture, or authority.

Diagnose before redesign, make findings spatially specific when evidence allows, separate observation from inference, prefer the smallest effective change, and do not manufacture issues merely to make a review look substantial.

## 10. Gap taxonomy

- `Visual/Layout` — presentation/composition.
- `Interaction/State` — behavior/state.
- `Functional/Business` — workflow/capability/invariant.
- `System coherence` — mismatch with design-system/product grammar.
- `Design quality` — greenfield/provisional design problem.
- `Data difference` — literal data difference, usually ignore.
- `Intentional current feature` — production capability that must be preserved.
- `Shared chrome / Out of scope`.
- `Unknown` — authority is insufficient.

## 11. Priority

- `P0` — important workflow/state/invariant failure or usability blocker.
- `P1` — material IA/layout/hierarchy/system-coherence issue affecting scan/action or product consistency.
- `P2` — localized density/spacing/polish/accessibility refinement that does not block the main flow.
- `Ignore` — data/shared chrome/accepted delta outside scope.
- `KEEP` — preservation marker for something already correct; **not a severity**.

Do not add a parallel Critical/Major/Minor taxonomy unless the project explicitly requires one.

## 12. Finding format

```text
[P0/P1/P2] <finding>
Observed / Current:
...
Impact / Expected authority:
...
Assessment:
...
Recommendation:
...
Confidence:
HIGH | MEDIUM | LOW
```

When something important is already correct and later fixes could damage it:

```text
KEEP — Do not change
- ...
```

Do not invent KEEP items merely to fill a template.

## 13. Handoff rule

Describe the required outcome and its evidence/authority rather than writing the entire implementation when the coding agent can inspect source/runtime directly.

Do not claim `aligned` for exact-design scope without required `design-parity` evidence.

If there are few or no material gaps, it is valid to conclude that no structural redesign is necessary.
