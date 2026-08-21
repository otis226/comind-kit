# product-ui-critique

## Purpose

Use this as a reusable critique lens for existing product UI from screenshots, mockups, rendered implementation, or source-backed visual evidence.

It answers:

> What is actually wrong, why does it matter, what should change, and what should remain untouched?

It does **not** choose project source priority, design authority, review mode, business rules, or release acceptance.

Compose it with:

- `ui-design-authority` — what governs the design;
- `ui-review` — review routing and priority;
- `design-parity` — exact-reference acceptance when required;
- `ui-visual-reviewer` — independent candidate verdict.

Core principles:

```text
DIAGNOSE BEFORE REDESIGN
PRESERVE WHAT WORKS
CHANGE MUST EARN ITS COST
PRODUCT UI != MARKETING UI
AUTHORITY OVER PERSONAL TASTE
OBSERVATION BEFORE INFERENCE
```

## 1. Default posture

Do not assume something must change, redesign a sound screen merely because another solution exists, or introduce a new product language without authority. Prefer the smallest change that fixes an identifiable problem.

A valid review can conclude:

```text
No structural redesign is necessary.
```

## 2. Critique lenses

Apply these inside the review order defined by `ui-review`.

### Task / Product UX

Check task clarity/action hierarchy, discoverability/cognitive load, workflow/field order, progressive disclosure, validation/feedback/states, navigation/state transitions, and operational efficiency.

Do not invent fields, permissions, lifecycle states, or business behavior.

### Information Architecture

Check grouping/ownership, primary vs supporting information, duplication, scan order/comparison needs, hidden vs emphasized information, and whether layout follows workflow rather than decorative symmetry.

### System Coherence

When design-system evidence exists, check shared components/variants, typography/spacing/density/semantic colors, radius/elevation/icon language, standard form/table/dialog/sheet/select/tab patterns, and recurring state styling.

Prefer existing primitives when they satisfy the interaction. If system evidence is unavailable, mark uncertainty or derive only from recurring project evidence.

### Visual Taste / Anti-Slop

Watch for cards-inside-cards, excessive pills/badges/separators, decorative gradients/shadows/icons/colors, giant headings without workflow justification, equal emphasis on unrelated controls, arbitrary whitespace, repeated icon-title-description blocks, marketing/SaaS aesthetics applied to operational software, or styling used to compensate for weak information architecture.

These are **signals, not bans**. Flag them only when they harm comprehension, hierarchy, density, consistency, or task execution.

## 3. Evidence discipline

Be spatially specific. Separate direct observation from inference.

For material findings, distinguish:

```text
Observed
Impact
Authority
Recommendation
Confidence: HIGH | MEDIUM | LOW
```

Lower confidence when behavior, business intent, responsive states, or system rules are not observable. Do not turn inference into a confirmed product rule.

## 4. Change threshold

A recommendation should improve at least one of comprehension, task completion, consistency, accessibility, hierarchy/scanability, error prevention, interaction clarity, information density, operational efficiency, or maintainability.

“Looks nicer to me” is not enough.

## 5. Preservation contract — KEEP

When something already works and later fixes could damage it, record:

```text
KEEP — Do not change
- ...
```

Use KEEP for genuinely good grouping, density, action placement, component choice, field ordering, whitespace, hierarchy, or semantic status treatment. KEEP is not a severity level.

## 6. Priority contract

```text
P0     workflow/state/invariant/usability blocker
P1     material IA, interaction, hierarchy, or system-coherence issue
P2     localized density, spacing, accessibility, or polish refinement
Ignore data difference, shared chrome, accepted delta, or non-actionable issue
KEEP   preservation marker, not severity
```

## 7. Product-interface heuristics

Product software is not a marketing page; more whitespace is not automatically better. Evaluate density against task frequency, information volume, comparison needs, user expertise, operational speed, error risk, and viewport.

Do not use cards as the default grouping mechanism. Consider spacing, typography, alignment, dividers, columns, or subtle background regions first.

Color should have a job: status, selection, warning/error/success, primary action, meaningful category, or controlled emphasis.

Use badges/pills for compact status/category/metadata distinctions, not decoration. Use typography for hierarchy before adding containers.

For forms, check logical grouping, labels, required treatment, field width/order, control choice, helper text, validation/defaults, dependencies, disabled/read-only states, and save/cancel/destructive actions.

For tables, check column importance/order, scanability, alignment, density, row actions, sorting/filtering, status treatment, overflow/truncation, sticky behavior, selection/bulk actions, and empty state. Do not convert a table into cards unless the task genuinely benefits from losing tabular comparison.

## 8. Screenshot and source evidence

Screenshot/render = visual evidence. Source code = implementation evidence. Use both when available.

Source can reveal token bypass, duplicated components, raw library defaults, hidden states, and accessibility/runtime problems not visible in screenshots.

Do not assume visual similarity proves system correctness, source correctness proves visual quality, or a screenshot proves invisible behavior.

## 9. Recommended output

```text
Overall assessment
- Is the surface fundamentally sound?
- What is the dominant problem?
- Are changes local or structural?

Top findings
| Area | Finding | Type | Priority | Confidence | Recommendation |

Top 3 priorities
- ...

Quick wins
- ...

Structural changes
- ... | No structural redesign is necessary.

KEEP — Do not change
- ...

Unknown / verification required
- ... | NONE
```

Do not create a long cosmetic list when a few structural findings explain most of the problem.

## 10. Anti-redesign self-check

Ask whether recommendations are preference-driven, introduce unauthorized visual vocabulary, add unnecessary containers/whitespace/color, replace familiar controls without UX justification, confuse novelty with quality, lack evidence, or fail to preserve already-correct choices.

If so, revise them.

## Final rule

The goal is not:

> Make the screen prettier.

The goal is:

> Make the interface clearer, more coherent, easier to use, more consistent with its governing product language, and more visually intentional — while changing as little as necessary.
