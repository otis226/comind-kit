# ui-review

## Purpose

Use this workflow to review UI/UX when an exact design/reference, current implementation, established design system/product language, derived product conventions, or greenfield proposal is available.

The goal is to find the right gaps, understand intent, and keep **business correctness**, **design authority**, **implementation detail**, and **evidence strength** distinct.

When exact-design acceptance applies, visual fidelity is a deliverable. Without exact design, do not invent a pixel-parity gate; review consistency and design quality against actual authority.

Use `product-ui-critique` as the critique lens for screenshots, mockups, or existing product UI.

## 0A. Default review depth: DEEP

Project UI review is **deep by default**. The user should not need to say "review carefully", "audit", or "checkup".

Deep review means:

```text
resolve the real user/job and work pattern
→ resolve product/design/business authority that can change the judgment
→ inspect the strongest available evidence
→ review product/domain correctness before visual polish
→ inspect UX/IA/interaction/system coherence
→ inspect responsive/accessibility/speed concerns when evidence can materially prove them
→ separate proven facts from inference and unknowns
→ return prioritized portable findings with verification-to-close
```

Use a lightweight review only when the user explicitly asks for a quick/local opinion or the question is a trivial isolated styling choice whose answer cannot materially change with project/business/runtime context.

Deep review does **not** mean mandatory browser fan-out or a full audit ritual for every screenshot. Evidence depth must remain proportional to the question and available capabilities. If source/runtime evidence is unavailable, review deeply from the evidence that exists and mark what remains unverified instead of guessing.

## 0B. Evidence ladder and truth labels

Prefer the strongest evidence that is useful for the current concern:

```text
SCREENSHOT / MOCKUP
= visible composition, hierarchy, density, labels, affordance, obvious state

SOURCE
= component/token usage, hidden states, gating, responsive code, API/state wiring, implementation constraints

LIVE RUNTIME
= actual interaction, layout measurements, focus/keyboard behavior, viewport behavior, network/console, loading/error/recovery

CURRENT PRODUCT / DOMAIN AUTHORITY
= what workflow, lifecycle, permission, ownership, and mutation semantics should be
```

Use these truth labels when the distinction matters:

```text
OBSERVED   = directly visible in the supplied/rendered evidence
PROVEN     = supported by source/runtime/current authority strong enough for the claim
INFERRED   = reasoned from available evidence but not directly proven
UNVERIFIED = material claim requires evidence that is not currently available
```

Never upgrade `INFERRED` or `UNVERIFIED` into a confirmed business rule or PASS through confident wording.

## 0C. Deep-review dimensions

A deep review should consider the following dimensions, while spending effort only where the surface and evidence make the dimension material:

### Product / Domain

- workflow and user-job fit;
- lifecycle/status semantics;
- permission/role gates;
- data ownership/source of truth;
- mutation preconditions/results;
- downstream consequences;
- frontend/backend agreement when relevant.

Business/domain authority outranks visual preference.

### Intentionality

- composition serves the dominant work pattern;
- information placement has a workflow reason;
- the surface avoids generic/template filler and accidental implementation-shaped UI;
- repeated facts/containers/decorations earn their cost.

### Readability

- hierarchy and scan order;
- typography and labels;
- density and grouping;
- contrast and state legibility where evidence permits.

### Usability

- discoverability and action hierarchy;
- repeated-use efficiency;
- feedback/recovery;
- control choice and target size when measurable;
- error prevention and next-step clarity.

### Responsiveness

- reflow/recomposition at relevant viewports;
- overflow/truncation;
- table/list/action behavior;
- sheet/dialog/popover behavior;
- preservation of task context.

Do not claim responsive PASS from one desktop screenshot.

### Accessibility

- semantics and accessible names;
- keyboard/focus path;
- contrast/state legibility;
- touch/click target size;
- disabled/read-only communication;
- screen-reader or platform behavior when actually testable.

### Speed / Perceived performance

- unnecessary request fan-out or serial round trips;
- loading/busy behavior;
- stale UI after mutation;
- obvious caching/prefetch opportunities only when supported by actual access patterns;
- repeated-work latency that materially affects the user job.

Do not recommend speculative prefetch/caching merely because it sounds faster.

### Scoring rule

Do not invent a scalar score such as `7.3/10` unless an explicit rubric defines how points are earned. Prefer:

```text
PASS | NEEDS CHANGES | BLOCKED | UNVERIFIED
```

or, when discrete checks exist:

```text
5/7 required checks passed
```

If a score is requested, show the underlying check rubric so the number is auditable rather than model taste presented as precision.

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

Inspect current HEAD and dirty state when source-backed review is in scope, prefer the current working tree when it is clearly the latest relevant source, do not reset to a historical commit merely because an older review used it, use repository names/relative paths in handoff, and use historical SHAs for provenance unless authority requires them as targets.

## 4. Exact reference handling

A reference may be Figma, exported source, HTML, screenshot, spec, or equivalent. When matching source can be rendered, prefer source plus real screenshots over guessing from a static screenshot alone.

Do not blindly copy mock data, fake routing, prototype-only state, styling that conflicts with production conventions, or lifecycle/permission/API behavior without a production contract.

Do not remove useful production capability merely because the reference omits it.

## 5. Define visual scope

Identify screen-owned content, shared application/project chrome, state/role/tab/viewport under review, literal data differences to ignore, and intentional product deltas.

Shared chrome may affect layout width but is not automatically part of a screen-specific conversion target.

## 5A. Review from the user's role and job

Before judging layout or polish, identify the real user job for the surface.

Resolve, when authority allows:

- the primary user or role group;
- why they enter this screen and from where;
- what they need to decide, find, or complete;
- which actions are frequent versus exceptional;
- what information must be visible before acting;
- what output or downstream consequence follows the action.

If the exact job title or permission mapping is not confirmed, use a clearly labeled inferred persona or role group for the UX walkthrough. Never convert that inference into an authorization rule or confirmed business role.

Run a short role walkthrough before final findings:

```text
entry context
→ what the user notices first
→ what they need to locate/understand
→ what they act on
→ what must remain visible during the action
→ what feedback/next step follows
→ what repeated-use friction or operational error could occur
```

Use this walkthrough to challenge developer-centric UI. Raw enums, internal aggregate names, IDs, technically convenient status models, exhaustive field dumps, or implementation-shaped navigation should not be promoted merely because they exist in code.

For list/work-queue screens, explicitly review:

- whether default views/queues match the role's actual work;
- whether filters narrow work using the user's mental model;
- whether row content supports a fast decision/next action;
- whether actionable work is distinguishable from terminal/history data;
- whether ordering can starve older or urgent work;
- whether pagination, density, grouping, and large-volume behavior support repeated daily use.

Product coherence still matters, but do not force a sibling screen's structure when the user's job is materially different.

## 5B. Classify the dominant work pattern

Before final findings, classify the surface by the user's dominant work pattern. Use one primary pattern and at most one secondary pattern when the surface genuinely combines jobs.

```text
MONITOR   = watch status, exceptions, alerts, recency, or operational health
OPERATE   = perform repeated actions directly on work objects
COMPARE   = scan or compare multiple items to choose, prioritize, or reconcile
CONFIGURE = set up rules, preferences, mappings, or system behavior
LEARN     = read, understand, inspect history, or build context before acting
DECIDE    = evaluate evidence and make a consequential choice
EXPLORE   = search, filter, browse, or discover the right object/work item
```

The work pattern is a review lens, not a business rule. Do not infer permissions, lifecycle, or domain semantics from the classification.

Use the pattern to sharpen the review:

- `MONITOR` — prioritize exceptions, recency, severity, and what needs attention now;
- `OPERATE` — prioritize speed, action clarity, state feedback, and repeated-use friction;
- `COMPARE` — prioritize stable scanning lanes, density, sorting/filtering, and comparable fields;
- `CONFIGURE` — prioritize grouping, dependencies, defaults, validation, and safe commit/recovery;
- `LEARN` — prioritize context, chronology, explanation, provenance, and progressive disclosure;
- `DECIDE` — prioritize evidence, consequences, uncertainty, and clear decision/action separation;
- `EXPLORE` — prioritize findability, filters, navigation, query feedback, and return-to-context behavior.

If no pattern is materially dominant, state `MIXED/UNCLEAR` and explain the ambiguity instead of forcing a category.

## 6. PARITY review

```text
render reference at required state/viewport
→ capture focused surface
→ render production under equivalent conditions
→ capture equivalent surface
→ identify the 3–5 largest gaps
→ inspect DOM/CSS/tokens/source for likely causes
→ report prioritized findings with evidence and verification-to-close
```

Screenshots show **what is wrong**; DOM/CSS/metrics help explain **why**. Use `design-parity` when exact-reference acceptance evidence is required.

`ui-review` diagnoses; it does not own production edits. If implementation is requested, hand the findings to `senior-dev`.

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

1. Product/business behavior and visible state.
2. User job / workflow effectiveness.
3. Information Architecture.
4. Interaction and feedback.
5. Layout / Proportion.
6. Visual Hierarchy.
7. Density / Spacing.
8. Accessibility / Responsive / Speed concerns supported by evidence.
9. Visual Polish.

Apply `product-ui-critique` within each layer without letting taste override workflow, information architecture, or authority.

Diagnose before redesign, make findings spatially specific when evidence allows, separate observation from inference, prefer the smallest effective change, and do not manufacture issues merely to make a review look substantial.

## 10. Gap taxonomy

- `Visual/Layout` — presentation/composition.
- `Interaction/State` — behavior/state.
- `Functional/Business` — workflow/capability/invariant.
- `System coherence` — mismatch with design-system/product grammar.
- `Design quality` — greenfield/provisional design problem.
- `Accessibility` — semantics, focus/keyboard, names, contrast, target sizes, assistive behavior.
- `Responsive` — reflow, overflow, viewport-dependent task behavior.
- `Speed` — request/loading/perceived-performance issue supported by evidence.
- `Data difference` — literal data difference, usually ignore.
- `Intentional current feature` — production capability that must be preserved.
- `Shared chrome / Out of scope`.
- `Unknown` — authority is insufficient.

## 11. Priority

- `P0` — important workflow/state/invariant failure or usability blocker.
- `P1` — material IA/interaction/layout/hierarchy/system-coherence/accessibility/responsive/speed issue affecting scan, action, reliability, or product consistency.
- `P2` — localized density/spacing/polish/accessibility refinement that does not block the main flow.
- `Ignore` — data/shared chrome/accepted delta outside scope.
- `KEEP` — preservation marker for something already correct; **not a severity**.

Do not add a parallel Critical/Major/Minor taxonomy unless the project explicitly requires one.

## 12. Finding format

State the evidence scope and surface work pattern once before the findings when they materially affect the review.

For each material actionable finding, use:

```text
[P0/P1/P2] <finding>
Type:
Visual/Layout | Interaction/State | Functional/Business | System coherence | Design quality | Accessibility | Responsive | Speed | Unknown
Truth:
OBSERVED | PROVEN | INFERRED | UNVERIFIED
Observed / Current:
...
Impact / Expected authority:
...
Assessment:
...
Recommendation:
...
Verification to close:
...
Status:
OPEN
Confidence:
HIGH | MEDIUM | LOW
```

`Verification to close` must describe the minimum evidence that would prove the finding is resolved. It should be concrete enough for an implementation owner or reviewer to execute without inheriting the original review conversation.

Use lifecycle status only when the finding is carried into implementation or a persistent task:

```text
OPEN       = diagnosed and not yet implemented
ADDRESSED  = implementation evidence exists, runtime/product proof may still be pending
VERIFIED   = required verification contract passed against the relevant candidate
ACCEPTED   = authorized owner explicitly accepts the remaining delta/risk
BLOCKED    = required proof cannot currently be obtained
```

The reviewer that creates a finding normally returns it as `OPEN`; do not self-promote it to `ADDRESSED` or `VERIFIED` merely because the recommendation seems straightforward.

When something important is already correct and later fixes could damage it:

```text
KEEP — Do not change
- ...
```

Do not invent KEEP items merely to fill a template.

## 13. Verification contract and completion bars

Use a finding-specific completion bar instead of a universal UI checklist. Require only the evidence that can materially prove or disprove the finding.

### Interaction / state findings

Consider the states and trigger paths that are actually affected, for example:

```text
idle
hover
focus
active
loading
disabled / read-only
empty
error
success
overflow
keyboard path
```

Do not require every state for every control. The completion bar is the smallest set needed to prove the interaction works in the affected scenario.

### Functional / business findings

When the finding touches domain behavior, verify relevant parts of:

```text
precondition
permission / role gate
lifecycle / status gate
source of truth
mutation result
persistence / reload behavior
downstream consequence
frontend/backend agreement
```

Do not infer these rules from the UI. Resolve them from current business/domain/API authority.

### Visual / system-coherence findings

Verify the relevant rendered viewport/state plus the governing design evidence. Depending on scope, this may include layout/overflow, hierarchy/density, shared primitives/tokens, semantic state styling, or sibling-screen coherence.

When exact-reference fidelity is part of acceptance, use `design-parity` rather than replacing parity evidence with subjective review.

### Accessibility / responsive findings

When material, verify the relevant keyboard/focus/accessible-name/contrast/target-size or viewport/overflow/control-recomposition evidence. Prefer runtime measurement when a suitable runtime capability is available.

### Speed findings

Tie claims to observed request/loading behavior, timing evidence, source access patterns, or reproducible user-perceived latency. Do not turn generic performance advice into a finding without evidence.

### Truthful completion

```text
INSPECTED != FIXED
CODED != WORKING
STATE IMPLEMENTED != STATE REACHABLE
TEST EXISTS != USER BEHAVIOR VERIFIED
VISUAL CHANGE != UX IMPROVEMENT
ONE VIEWPORT != RESPONSIVE PASS
SOURCE PRESENCE != ACCESSIBLE BEHAVIOR
```

A finding may be `ADDRESSED` from implementation evidence, but only the required verification contract can make it `VERIFIED`.

## 14. Runtime measurement when available

When live browser/runtime inspection is available and a claim depends on it, prefer measurement over visual guessing. Examples include:

- actual control/target dimensions;
- computed contrast or relevant rendered style;
- `:focus-visible`/keyboard traversal;
- overflow and layout widths at representative viewports;
- modal/sheet/popover lifecycle;
- network request count/order/failures;
- loading/error/success behavior;
- stale state after mutation/reload.

Choose representative viewports based on product/platform authority. Do not mechanically test an arbitrary viewport matrix when it does not affect the task.

If runtime evidence is required for a material conclusion but unavailable, return that concern as `UNVERIFIED` or `BLOCKED` as appropriate rather than claiming PASS.

## 15. Default deep-review output

Keep the final review concise enough to act on, but complete enough to hand off. Prefer this structure:

```text
Overall assessment
- PASS | NEEDS CHANGES | BLOCKED
- dominant problem / why it matters

Evidence scope
- screenshot/mockup: ...
- source: ... | unavailable
- runtime: ... | unavailable
- product/domain authority: ... | not material / unresolved

User / job / work pattern
- user/role: ...
- job: ...
- pattern: PRIMARY [+ SECONDARY]

Review dimensions
- Product/Domain: PASS | NEEDS CHANGES | BLOCKED | UNVERIFIED — <brief evidence>
- Intentionality: ...
- Readability: ...
- Usability: ...
- Responsiveness: ...
- Accessibility: ...
- Speed: ...

Top findings
[P0/P1/P2] ...
...

KEEP — Do not change
- ... | NONE

Unverified / blocked evidence
- ... | NONE

Top next actions
1. ...
2. ...
3. ...
```

Do not force every dimension to have a finding. A dimension can PASS, be not material, or remain UNVERIFIED. Do not produce a long cosmetic list when a few structural findings explain most of the problem.

## 16. Handoff rule

Describe the required outcome and its evidence/authority rather than writing the entire implementation when the coding agent can inspect source/runtime directly.

For implementation, preserve ownership boundaries:

```text
ui-review = deep diagnosis + prioritized finding + verification contract
senior-dev = implementation owner / architecture / integration / verification orchestration
specialist reviewer = independent evidence only when current risk/mode requires it
```

Do not create a parallel `treat` or `finish` ownership path inside this skill.

For substantial implementation handoff, pair the review outcome with `coding-agent-handoff`: preserve product/UX decisions as authority, let the coding agent resolve current source and own implementation planning, and avoid copying transient conversation history as the task contract.

Keep review findings portable. A durable issue/task packet should be sufficient for another runtime or a later session to understand the problem, authority, required outcome, and verification without the original conversation.

Do not claim `aligned` for exact-design scope without required `design-parity` evidence.

If there are few or no material gaps, it is valid to conclude that no structural redesign is necessary.
