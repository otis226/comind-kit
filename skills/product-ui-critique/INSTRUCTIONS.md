# product-ui-critique

## Purpose

Use this as a reusable critique lens for existing product UI from screenshots, mockups, rendered implementation, or source-backed visual evidence.

It answers:

> What is actually wrong, why does it matter, what should change, and what should remain untouched?

It does **not** choose project source priority, design authority, review mode, business rules, or release acceptance.

Compose it with:

- `skills/ui-design-authority.md` — what governs the design;
- `skills/ui-review.md` — review routing and priority;
- `skills/design-parity.md` — exact-reference acceptance when required;
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

When reviewing an existing design:

- do not assume something must change;
- do not redesign a sound screen because another solution is possible;
- preserve the current product language unless authority says otherwise;
- prefer the smallest change that fixes an identifiable problem;
- do not recommend a change that cannot explain what it improves.

A valid review can conclude:

```text
No structural redesign is necessary.
```

## 2. Critique lenses

Apply these inside the review order defined by `skills/ui-review.md`.

### Task / Product UX

Check:

- task clarity and action hierarchy;
- discoverability and cognitive load;
- workflow/field order and progressive disclosure;
- validation, feedback, empty/loading/error/disabled/read-only states;
- navigation/state transitions;
- operational efficiency.

Do not invent fields, permissions, lifecycle states, or business behavior.

### Information Architecture

Check:

- grouping and ownership;
- primary vs supporting information;
- duplication;
- scan order and comparison needs;
- hidden vs emphasized information;
- whether layout follows workflow rather than decorative symmetry.

### System Coherence

When design-system evidence exists, check:

- shared components/variants;
- typography, spacing, density, semantic colors;
- radius/elevation/icon language;
- form/table/dialog/sheet/select/tab patterns;
- state styling and recurring product conventions.

Prefer existing primitives when they satisfy the interaction.

If system evidence is unavailable, do not pretend to know tokens or canonical components. Mark uncertainty or derive only from recurring project evidence.

### Visual Taste / Anti-Slop

Inspect for template-driven treatment that harms the task, such as:

- cards inside cards or every group boxed;
- excessive pills/badges/separators;
- decorative gradients/shadows/icons/colors;
- giant headings without workflow justification;
- equal emphasis on unrelated controls;
- arbitrary whitespace or every action becoming a button;
- repeated icon + title + description blocks;
- marketing/SaaS aesthetics applied to operational software;
- styling used to compensate for weak information architecture.

These are **signals, not bans**. Flag them only when they hurt comprehension, hierarchy, density, consistency, or task execution.

## 3. Evidence discipline

### Be spatially specific

Weak:

```text
Spacing is inconsistent.
```

Strong:

```text
Observed:
In the right-side Opportunity section, the heading-to-first-field gap is visibly larger than the field-to-field rhythm below it.

Impact:
The heading feels detached from the group and weakens scan continuity.
```

Use section names, labels, button text, row/column, top/middle/bottom, left/right, or nearby controls as anchors.

### Separate observation from inference

For material findings, distinguish:

```text
Observed
What is directly visible or source-backed.

Impact
Why it matters.

Authority
Reference/system/pattern/task principle supporting the assessment.

Recommendation
Smallest effective correction.

Confidence
HIGH | MEDIUM | LOW when uncertainty matters.
```

Lower confidence when behavior, business intent, responsive states, or system rules are not observable.

Do not turn inference into a confirmed product rule.

## 4. Change threshold

Before recommending a change, require improvement in at least one of:

- comprehension;
- task completion;
- consistency;
- accessibility;
- hierarchy/scanability;
- error prevention;
- interaction clarity;
- information density;
- operational efficiency;
- maintainability of the existing product system.

If none apply, do not recommend it.

“Looks nicer to me” is not enough.

## 5. Preservation contract — KEEP

When something already works and could be damaged by follow-up fixes, record it explicitly:

```text
KEEP — Do not change
- ...
```

Good KEEP candidates include:

- effective grouping;
- appropriate operational density;
- clear primary action placement;
- correct shared component choice;
- good field ordering;
- useful whitespace;
- strong hierarchy;
- correct semantic status treatment.

`KEEP` is not a severity level. It is preservation guidance.

Do not invent KEEP items just to fill a template.

## 6. Priority contract

Reuse CoMind priority language:

```text
P0     workflow/state/invariant/usability blocker
P1     material IA, interaction, hierarchy, or system-coherence issue
P2     localized density, spacing, accessibility, or polish refinement
Ignore data difference, shared chrome, accepted delta, or non-actionable issue
KEEP   preservation marker, not severity
```

Do not add a parallel `Critical/Major/Minor` taxonomy unless the project explicitly requires it.

## 7. Product-interface heuristics

### Density

Product software is not a marketing page. More whitespace is not automatically better.

Evaluate density against task frequency, information volume, comparison needs, user expertise, operational speed, error risk, and target viewport.

Dense CRM/admin/engineering/finance/configuration/workflow screens can be correct when density improves scanning and execution.

### Grouping and cards

Do not use cards as the default grouping mechanism.

Before adding a container, ask whether hierarchy can be expressed with spacing, typography, alignment, divider, columns, or a subtle background region.

Cards should communicate meaningful containment or interaction ownership.

### Color

Color should have a job: status, selection, warning/error/success, primary action, meaningful category, or controlled emphasis.

Do not add color simply because a screen feels plain. First inspect hierarchy, typography, grouping, density, and emphasis.

Do not use decorative color in a way that implies product state or consequence that does not exist.

### Badges, pills, typography

Use badges/pills for compact status/category/metadata distinctions, not decoration.

Use typography for hierarchy before introducing containers. Check heading levels, label/value contrast, metadata weight, line height, truncation, and excessive bolding.

### Controls and forms

Check logical grouping, label placement, required treatment, field width/order, control choice, helper text, validation/defaults, dependencies, disabled/read-only states, and save/cancel/destructive actions.

Do not replace a familiar standard control purely for novelty.

Example: replacing Select with segmented controls only makes sense when option count, frequency, visibility benefit, and governing product patterns support it.

### Tables

Check column importance/order, scanability, alignment, density, row actions, sorting/filtering, status treatment, overflow/truncation, sticky behavior when needed, selection/bulk actions, and empty state.

Do not convert a table into cards unless the task genuinely benefits from losing tabular comparison.

## 8. Screenshot and source evidence

Screenshot/render = visual evidence.

Source code = implementation evidence.

When both exist, use both.

Source can reveal token bypass, duplicated components, raw library defaults, hidden states, and accessibility/runtime problems not visible in a screenshot.

Do not assume visual similarity proves system correctness.

Do not assume source correctness proves visual quality.

Do not claim invisible behavior from a screenshot.

## 9. Recommended output

Prefer a compact review:

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

Before finalizing, ask:

- Did I change something only because I prefer another style?
- Did I introduce a new visual vocabulary without authority?
- Did I add cards/containers where hierarchy could do the job?
- Did I increase whitespace without considering operational density?
- Did I use color decoratively?
- Did I replace familiar controls without UX justification?
- Did I confuse novelty with quality?
- Is every recommendation supported by evidence?
- Did I preserve already-correct choices?
- Are the highest-impact findings first?

If the answers expose over-design, revise the recommendations.

## Final rule

The goal is not:

> Make the screen prettier.

The goal is:

> Make the interface clearer, more coherent, easier to use, more consistent with its governing product language, and more visually intentional — while changing as little as necessary.
