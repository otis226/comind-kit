# ui-review

## Purpose

Use this workflow to review UI/UX when one or more of these are available:

- an exact design/reference;
- current implementation;
- an established design system/product language;
- derived product conventions;
- a greenfield design proposal.

The goal is to find the right gaps, understand intent, and keep **business correctness**, **design authority**, and **implementation detail** distinct.

When exact-design acceptance applies, visual fidelity is a deliverable. Without exact design, do not invent a pixel-parity gate; review consistency and design quality against the actual authority.

Use `product-ui-critique` as the critique lens for screenshots, mockups, or existing product UI. It does not replace source priority or review-mode selection.

## 1. Resolve authority before review

Use current project source priority and `ui-design-authority` when design authority is unclear.

```text
REFERENCE_BACKED → PARITY REVIEW
SYSTEM_BACKED / PRODUCT_DERIVED → COHERENCE REVIEW
GREENFIELD → DESIGN QUALITY REVIEW
```

Current implementation is evidence, not automatically the design source of truth.

## 2. Source priority

Unless the project defines a more specific order, prefer:

1. latest confirmation from the user/authorized owner;
2. current canonical product/design source for the project;
3. confirmed project decisions;
4. established or reliably derived product patterns;
5. current implementation.

If an exact design conflicts with a newer business/security invariant, the invariant wins and the visual delta must be documented.

## 3. Local-first and portable handoff

When local repositories are available:

- inspect current HEAD and dirty state;
- prefer the current working tree when it is clearly the latest source for the required surface;
- do not reset to a historical commit merely because an older review used it;
- use repository names and relative paths in handoff;
- use historical SHAs for provenance/fallback, not as mandatory targets unless authority requires them.

## 4. Exact reference handling

A reference may be Figma, exported source, HTML, screenshot, spec, or equivalent.

When matching source can be rendered, prefer source plus real screenshots over guessing from a static screenshot alone.

Do not blindly copy:

- mock data;
- fake routing;
- prototype-only state;
- inline styling that conflicts with the production system;
- lifecycle/permission/API behavior without a production contract.

Do not remove useful production capability merely because the reference omits it. Classify intentional deltas/out-of-scope behavior first.

## 5. Define visual scope

Identify:

- screen-owned content;
- shared application/project chrome;
- state/role/tab/viewport under review;
- literal data differences to ignore;
- intentional product deltas.

Shared chrome may affect layout width but is not automatically part of a screen-specific conversion target.

## 6. PARITY review

When an exact reference can be rendered:

```text
render reference at the required state/viewport
→ capture focused surface
→ render production under equivalent conditions
→ capture equivalent surface
→ identify the 3–5 largest gaps
→ inspect DOM/CSS/tokens for those gaps
→ fix
→ recapture
```

Screenshots show **what is wrong**; DOM/CSS/metrics help explain **why**.

Do not begin with a large spreadsheet of pixel metrics before identifying the dominant visual gaps.

Use `design-parity` when exact-reference acceptance evidence is required.

## 7. COHERENCE review

When there is no exact accepted screen design but a product/system language exists, review:

- token/component reuse;
- typography hierarchy;
- spacing rhythm and density;
- surface/card/control grammar;
- interaction conventions;
- semantic colors/states;
- icon family;
- sibling-screen consistency;
- responsive behavior;
- workflow-driven information architecture.

Key question:

> If the URL and feature name were hidden, would this surface clearly belong to the same product and use the right patterns for this job?

Do not pixel-match a sibling screen with a different purpose.

## 8. DESIGN QUALITY review

For greenfield/provisional authority, review:

- hierarchy and scanability;
- task clarity;
- primary/secondary actions;
- information density;
- feedback/state handling;
- accessibility baseline;
- responsive baseline;
- consistency with the Minimal Design Contract;
- generic/template-driven treatment that does not serve the task.

The goal is not novelty. It is intentional, usable, coherent product UI.

## 9. Review order

Review from large/structural concerns to local polish. Apply `product-ui-critique` within each layer without letting taste override workflow, information architecture, or authority.

### Behavior / State

- default/selected/expanded;
- enabled/disabled;
- loading/empty/error;
- role/action visibility;
- feedback after actions.

### Information Architecture

- grouping;
- primary/secondary/supporting information;
- fact/action ownership;
- workflow order;
- duplicated information.

### Layout / Proportion

- grid/columns/container;
- alignment;
- whitespace distribution;
- width/height constraints;
- wrapping/truncation;
- responsive behavior.

### Visual Hierarchy

- title/context/action weight;
- status/badge emphasis;
- section separation;
- muted hierarchy.

### Density / Spacing

Describe the gap before prescribing pixels. Do not assume more whitespace is always better; operational product UI can benefit from density when it improves scanning, comparison, and speed.

### Visual Polish

- typography;
- icons;
- border/radius/shadow;
- color/surface;
- control variants;
- minor alignment.

### Critique discipline

- diagnose before redesign;
- make findings spatially specific when evidence allows;
- separate direct observation from inference;
- require recommendations to clear a meaningful change threshold;
- prefer the smallest effective change;
- do not manufacture issues merely to make a review look substantial.

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

For implementation review/handoff:

```text
[P0/P1/P2] <gap>

Current:
...

Expected / authority:
...

Assessment:
<taxonomy>

Recommendation:
...

Coding agent should inspect:
...
```

For screenshot/existing-design critique:

```text
[P0/P1/P2] <finding>

Observed:
...

Impact:
...

Authority:
...

Recommendation:
...

Confidence:
HIGH | MEDIUM | LOW
```

When something important is already correct and a later fix could damage it, record:

```text
KEEP — Do not change
- ...
```

Do not invent KEEP items merely to fill a template.

## 13. Handoff rule

A reviewer should describe the required outcome and its evidence/authority, not write the entire implementation when the coding agent can inspect source/runtime directly.

Do not claim `aligned` for exact-design scope without the required `design-parity` evidence.

If there are few or no material gaps, it is valid to conclude that no structural redesign is necessary.
