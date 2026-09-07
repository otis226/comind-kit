# ui-design-authority

## Purpose

Use this before meaningful user-visible UI implementation to determine **how much design freedom the AI actually has**.

It prevents two opposite failures: redesigning despite an exact accepted reference, and assuming unlimited creative freedom merely because no exact screen design exists.

```text
ABSENT SCREEN DESIGN != ABSENT DESIGN AUTHORITY
DESIGN FREEDOM MUST BE RESOLVED, NOT ASSUMED
INHERIT BEFORE DERIVE
DERIVE BEFORE INVENT
CONSTRAINTS SHOULD PROTECT DESIGN, NOT PRE-DESIGN IT
```

This is design-governance workflow, not a project-specific design system.

## 0. Separate authority resolution from first design

Do not confuse the amount of context needed to **govern** a design with the amount of context a designer should receive to **create** the first design.

The task owner/orchestrator may inspect full project authority. The first-design pass should normally receive a compact, intentionally filtered **Design Safety Envelope** instead of the raw authority corpus.

```text
FULL PROJECT AUTHORITY
→ TASK OWNER RESOLVES WHAT ACTUALLY MATTERS
→ DESIGN SAFETY ENVELOPE
→ FRESH FIRST-DESIGN / EXPLORATION PASS
→ PRODUCT / DOMAIN COMPLIANCE
→ SYSTEMIZATION
→ IMPLEMENTATION
→ RENDERED REVIEW
```

### Design Safety Envelope

Keep it short. Include only what can materially change the composition:

- real user job / dominant work pattern;
- platform and material viewport/device context;
- required information and required user actions;
- hard business/security/accessibility invariants that the UI must not violate;
- genuinely accepted visual reference(s), preferably as visual evidence rather than a long textual decomposition;
- one or two material feasibility constraints only when they truly bound the design space.

Do **not** routinely feed the first-design pass the full AGENTS stack, delivery contracts, tooling rules, component catalogs, implementation history, test matrices, historical review findings, or long negative-rule lists. Those remain available to later compliance/systemization/implementation stages.

### Constraint classes

Classify constraints before passing them downstream:

```text
HARD INVARIANT
= must be present in the Design Safety Envelope when materially relevant.

DESIGN PRINCIPLE
= review criterion; do not prescribe layout merely to encode the principle.

SYSTEM / ENGINEERING CONSTRAINT
= bind after a coherent composition exists unless feasibility truly depends on it.

HISTORICAL IMPLEMENTATION
= evidence only; never a design constraint by default.
```

This is **staged constraint binding**, not unrestricted design. The first design is allowed to explore composition, hierarchy, interaction model, density, and visual character; later stages are responsible for proving that the concept remains valid inside product/domain/system constraints.

If the first implementation becomes visually weak through accumulated local patches, return to the design stage rather than continuing to patch styling indefinitely.

### Human-selected image-first loop

When visual quality materially benefits from external image generation or a fresh visual-design environment, prefer separating the business-authority pass from the visual exploration pass instead of asking one context to design, validate, and implement simultaneously.

```text
FULL PRODUCT / BUSINESS AUTHORITY
→ TASK OWNER WRITES A SMALL FIRST-DESIGN BRIEF
→ HUMAN GENERATES / EXPLORES VISUAL CONCEPTS IN A FRESH CONTEXT
→ HUMAN SELECTS THE STRONGEST VISUAL DIRECTION
→ TASK OWNER REVIEWS THE SELECTED IMAGE FOR PRODUCT / DOMAIN VALIDITY
→ TARGETED CORRECTIONS ONLY WHEN NEEDED
→ HUMAN ACCEPTS THE VISUAL REFERENCE
→ SYSTEMIZATION / IMPLEMENTATION / PARITY REVIEW
```

The first-design brief should communicate the business problem without turning the creative pass into a compliance exercise. Prefer:

- the user's real job and operating context;
- required information that materially affects the screen;
- required actions that materially affect the screen;
- product character or usage character when useful;
- only the hard invariants whose violation would invalidate the concept.

Do not routinely include complete lifecycle matrices, permission matrices, implementation history, component inventories, exhaustive negative rules, or long anti-invention checklists. A creative worker optimizing against a checklist can produce a technically compliant but visually weak design.

The externally generated image is a **design hypothesis** until reviewed. It may propose stronger composition, hierarchy, navigation, density, interaction, or visual language, but it does not establish new business states, permissions, fields, workflow semantics, or product rules.

After the human selects a visual direction, review that concrete image against full product/domain authority. When a conflict is local, preserve the accepted composition and correct only the conflicting element. Do not reflexively regenerate or redesign the whole concept merely to make it resemble the current implementation or satisfy a broad checklist.

Typical targeted correction:

```text
KEEP THE ACCEPTED COMPOSITION
→ IDENTIFY THE SPECIFIC BUSINESS CONFLICT
→ REPLACE / REMOVE ONLY THE INVALID SEMANTIC ELEMENT
→ RECHECK THE RESULT
```

Only after the human accepts the visual direction and material business conflicts are resolved should the image become an accepted visual reference. At that point it may become `REFERENCE_BACKED` presentation authority for its declared surface/state, while confirmed product/domain semantics remain independently authoritative.

### Product Design specialist integration

When a capable external Product Design specialist is available, it is an approved execution path for the creative/research stages of this loop. In ChatGPT, prefer `@Product Design` for this role when available.

Use it selectively:

```text
UX / pattern uncertainty
-> Product Design Research or Audit

VISUAL DIRECTION uncertainty
-> Design Safety Envelope
-> Product Design Ideate
-> exactly three materially different directions when broad exploration is needed
-> human selects one

SELECTED visual target + prototype/candidate
-> Product Design Design QA may provide detailed source-vs-rendered comparison evidence
```

Boundaries:

- CoMind/project authority remains the source of product/domain truth.
- Product Design research and generated concepts are evidence/proposals, not business rules.
- Do not expose the full authority corpus to first ideation; pass the compact Design Safety Envelope.
- Do not let Product Design prototype/code output silently become production implementation authority. Production implementation remains under the normal engineering owner.
- A Product Design Design QA result is a specialist comparison input. Final review routing remains owned by `ui-review`; exact-reference acceptance uses `design-parity` when required. `ui-visual-reviewer` and `ui-runtime-reviewer` are optional independent evidence passes when fresh-eyes separation can materially change the verdict.

This loop is especially useful when current implementation quality is weak: do not expose the first-design worker to the existing UI by default merely because it exists. Current UI is evidence, not a visual target, unless its authority has already been established.

## 1. When authority must be resolved

Resolve authority for new screens/surfaces, new layout/composition, new interaction patterns, meaningful visual-language changes, new form/table/detail/dashboard/navigation surfaces, missing exact design when the agent must decide UI, or conflicting/incomplete design evidence.

Small copy, icon, or token-aligned tweaks may reuse already-clear surface authority without a long manifest.

## 2. Evidence hierarchy

Follow current project source priority. Useful evidence may include exact accepted design/prototype/spec, formal design system/tokens/components/design docs/Storybook, sibling product screens with similar intent, shared application chrome, CSS/theme variables/primitives, confirmed product/design decisions, and current implementation as evidence rather than automatic authority.

Do not use framework defaults, template galleries, or model taste as authority when project evidence exists.

Do not automatically expose every item in this evidence hierarchy to the first-design worker. Evidence hierarchy determines authority; the Design Safety Envelope determines creative-pass context.

## 3. Four authority modes

### A. REFERENCE_BACKED

Use when an exact accepted design/reference is genuinely the target for the required surface/state. Mere existence of a screenshot/Figma/export is insufficient without provenance or explicit acceptance.

Follow reference structure/visual/interaction, use production-safe equivalents for prototype-only constructs, and preserve production business/security/accessibility/integration contracts.

Do not redesign because another direction seems prettier, copy mock/prototype behavior into business rules, or remove required production capability merely because the reference omits it.

Use `design-parity` when exact visual fidelity is part of acceptance.

### B. SYSTEM_BACKED

Use when there is no exact screen design but an established design system or strong product convention exists.

The agent may decide hierarchy, composition, grouping, placement, feedback states, and pattern selection, but should not arbitrarily replace established typography, semantic colors, radius/elevation language, form/table/control language, icon family, interaction conventions, or shared primitives.

Goal: **new solution, same product language**.

For substantial new composition, explore the composition first from the compact safety envelope, then bind the accepted concept back to the system. Do not turn a component catalog into the ideation prompt unless a component materially defines the interaction.

### C. PRODUCT_DERIVED

Use when there is no reliable formal system but enough existing UI exists to infer recurring conventions.

1. choose a small set of representative same-product screens closest in intent;
2. inspect recurring typography, spacing, controls, surfaces, navigation, feedback, and density;
3. separate recurring convention from one-off implementation accident;
4. produce a short `DERIVED DESIGN CONTRACT`;
5. attach confidence to material derived conventions when useful.

Derived does not mean canonical. Do not formalize project-wide tokens/components merely because one screen needs a layout solution.

### D. GREENFIELD

Use when there is no exact reference, reliable formal system, or sufficiently representative existing UI.

Define a **Minimal Design Contract** before production styling: product character/tone, density, typography, semantic color, spacing rhythm, radius/elevation, surface hierarchy, primary controls, form/navigation conventions, feedback/state behavior, and accessibility/responsive baseline.

Keep the contract small. Do not build an enterprise design system before repeated need exists.

For first design, prefer a compact product character + user-job brief over enumerating every eventual token. Freeze detailed system choices only after a coherent concept exists.

## 4. Progressive maturity

```text
NONE
→ PROVISIONAL CONTRACT
→ RECURRING PRODUCT PATTERNS
→ DERIVED SYSTEM
→ ESTABLISHED TOKENS/COMPONENTS
→ FORMAL DESIGN SYSTEM
```

The goal is enough governance to avoid inconsistency, not ceremony.

## 5. Design Manifest

For non-trivial UI work, the main agent or `ui-design-architect` should return:

```text
DESIGN AUTHORITY
Mode: REFERENCE_BACKED | SYSTEM_BACKED | PRODUCT_DERIVED | GREENFIELD

Canonical inputs:
- ...
Representative product surfaces:
- ... | N/A
Inherited conventions:
- ... | NONE
Derived conventions:
- ... | NONE
New design decisions/proposals:
- ... | NONE
Allowed freedom:
- ...
Do-not-deviate:
- ...
Intentional deltas:
- ... | NONE
Review baseline:
- exact reference | product system/sibling screens | minimal contract
Open ambiguity:
- ... | NONE

DESIGN SAFETY ENVELOPE
User job / work pattern:
- ...
Required information/actions:
- ...
Hard invariants:
- ...
Visual reference:
- ... | NONE
Material feasibility constraint:
- ... | NONE
```

The manifest defines the **authority boundary**. The safety envelope is the smaller payload intended for a fresh first-design pass. Neither is a pixel-by-pixel spec.

## 6. When to use `ui-design-architect`

Prefer an independent design-architecture pass for meaningful PRODUCT_DERIVED/GREENFIELD work, substantial new SYSTEM_BACKED composition, conflicting design sources, decisions that may affect many screens, or when an implementer risks inventing and self-certifying the same design.

For creative exploration, keep the design pass fresh and give it the Design Safety Envelope rather than requiring it to rediscover all project governance. The task owner remains responsible for later product/domain and system compliance.

Usually skip it for clear REFERENCE_BACKED work, small patches using well-established patterns, or localized fixes with an unambiguous baseline.

## 7. Anti-slop guardrails

Do not introduce new visual vocabulary when existing language works; do not create new primitives when shared primitives fit; do not use arbitrary color/radius/shadow/spacing when conventions exist; do not card-wrap every group; do not duplicate facts without workflow reason; do not use semantic color decoratively; do not add decorative metrics/badges/gradients without decision value; do not turn every product into a generic SaaS dashboard; do not prioritize novelty over workflow clarity; do not invent fields/states/permissions/lifecycle for layout convenience; do not treat framework defaults as product design authority; and do not import another project's visual language without authority.

These are review/systemization guardrails. Do not mechanically paste the whole list into a first-design prompt; doing so can turn evaluation criteria into premature composition constraints.

## 8. Review routing

Return the resolved authority to `ui-review`. The default reviewer uses that authority directly in `VISUAL` or `BOTH` mode.

Use `design-parity` for exact accepted-reference acceptance. Use `ui-visual-reviewer` only when an independent fresh-eyes visual verdict is materially useful; use `ui-runtime-reviewer` only when an independent runtime verdict is materially useful.

Authority resolution does not require a separate reviewer chain.

## 9. Block vs proceed

Do not block merely because an exact mockup is absent.

Return `BLOCKED` only when unresolved authority materially prevents responsible design direction, such as unresolved authoritative conflicts, an unknown platform/viewport that materially changes the surface, unresolved workflow choices that determine information architecture, or a requested global design-system change without authority.

Otherwise derive/propose the **smallest reasonable contract**, mark uncertainty/proposals, and continue.

## 10. Human acceptance

AI design review can demonstrate consistency/quality but does not replace product acceptance. For greenfield or major proposals, final handoff should clearly identify new design decisions so a human can accept or redirect them.
