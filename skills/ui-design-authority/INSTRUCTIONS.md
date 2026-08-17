# ui-design-authority

## Purpose

Use this before meaningful user-visible UI implementation to determine **how much design freedom the AI actually has**.

It prevents two opposite failures:

1. an exact accepted design exists, but the coding agent redesigns it;
2. no exact screen design exists, so the coding agent assumes unlimited freedom to create a new visual language.

```text
ABSENT SCREEN DESIGN != ABSENT DESIGN AUTHORITY
DESIGN FREEDOM MUST BE RESOLVED, NOT ASSUMED
INHERIT BEFORE DERIVE
DERIVE BEFORE INVENT
```

This is design-governance workflow, not a project-specific design system.

## 1. When authority must be resolved

Resolve design authority for user-visible work involving one or more of:

- a new screen/surface;
- new layout/composition;
- a new interaction pattern/component;
- meaningful visual-language change;
- a new form/table/detail/dashboard/navigation surface;
- no exact design but the agent must make UI decisions;
- conflicting or incomplete references/design-system evidence.

Small copy, icon, or token-aligned tweaks may reuse already-clear surface authority without a long manifest.

## 2. Evidence hierarchy

Follow current project source priority. Useful evidence may include:

- exact accepted design/prototype/spec for the required state;
- formal design system, tokens, component library, design docs, Storybook, or equivalent;
- current sibling product screens with similar intent;
- shared application chrome/patterns;
- CSS/theme variables and reusable primitives;
- confirmed product/design decisions;
- current implementation as evidence, not automatically canonical design.

Do not use framework defaults, template galleries, or model taste as authority when project evidence exists.

## 3. Four authority modes

### A. REFERENCE_BACKED

Use when an exact accepted design/reference is genuinely the target for the required surface/state.

The mere existence of a screenshot/Figma/export does not make it authoritative; provenance or explicit acceptance must support that role.

The implementation should:

- follow reference structure/visual/interaction;
- use production-safe equivalents where the reference is only a prototype;
- preserve production business/security/accessibility/integration contracts.

Do not:

- redesign because another direction seems prettier;
- copy mock data or prototype lifecycle into business rules;
- remove required production capability merely because the reference does not render it.

Use `design-parity` when exact visual fidelity is part of acceptance.

### B. SYSTEM_BACKED

Use when there is no exact screen design but an established design system or strong product convention exists.

The agent may decide information hierarchy, layout/composition, grouping, placement, feedback states, and which established pattern fits the task.

It should not arbitrarily replace established:

- typography;
- palette/semantic color grammar;
- radius/elevation language;
- form/table/control language;
- icon family;
- interaction conventions;
- shared primitives that already satisfy the need.

Goal: **new solution, same product language**.

### C. PRODUCT_DERIVED

Use when there is no reliable formal system but enough existing UI exists to infer recurring conventions.

Process:

1. choose a small set of representative screens from the same product and closest intent;
2. inspect recurring typography, spacing, controls, surfaces, navigation, feedback, and density;
3. distinguish repeated convention from one-off implementation accident;
4. produce a short `DERIVED DESIGN CONTRACT`;
5. attach confidence to material derived conventions when useful.

```text
Inherited / high confidence:
- compact table density
- primary action treatment

Derived / medium confidence:
- spacing rhythm
- surface radius

New proposal:
- side panel for a long edit flow because no equivalent form exists
```

Derived does not mean canonical. Do not formalize project-wide tokens/components merely because one screen needs a layout solution.

### D. GREENFIELD

Use when there is no exact reference, reliable formal system, or sufficiently representative existing UI.

Do not jump from requirements straight to arbitrary styling. Define a **Minimal Design Contract** first:

- product character/tone;
- density;
- typography strategy;
- color/semantic strategy;
- spacing rhythm;
- radius/elevation strategy;
- surface hierarchy;
- primary controls;
- form/navigation conventions;
- feedback/state behavior;
- accessibility/responsive baseline.

Keep the contract small. Do not build an enterprise design system before repeated need exists.

After the first surface, review in DESIGN_QUALITY mode and formalize only patterns that begin to repeat.

## 4. Progressive maturity

A product may mature through:

```text
NONE
→ PROVISIONAL CONTRACT
→ RECURRING PRODUCT PATTERNS
→ DERIVED SYSTEM
→ ESTABLISHED TOKENS/COMPONENTS
→ FORMAL DESIGN SYSTEM
```

Do not force a small project to adopt Figma, Storybook, or a token library merely to qualify for implementation.

The goal is enough governance to avoid inconsistency, not ceremony.

## 5. Design Manifest

For non-trivial UI work, the main agent or `ui-design-architect` should return a compact manifest before implementation:

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
```

The manifest is not a pixel-by-pixel spec. It defines the **authority boundary** for implementation and review.

## 6. When to use `ui-design-architect`

Prefer an independent design-architecture pass when:

- mode is PRODUCT_DERIVED or GREENFIELD and the task is meaningful;
- SYSTEM_BACKED work introduces substantial new composition/patterns;
- design sources conflict;
- a decision may affect many screens;
- the implementer risks inventing and self-certifying the same design.

Usually skip it when:

- REFERENCE_BACKED authority is already exact and clear;
- a small patch uses a well-established component/pattern;
- the task is a localized visual fix with an unambiguous baseline.

## 7. Anti-slop guardrails

Do not rely on rigid aesthetic bans. Apply these principles instead:

- do not introduce new visual vocabulary when existing language already expresses the task;
- do not create a new primitive when a shared primitive satisfies the semantics/interaction;
- do not use arbitrary color/radius/shadow/spacing when tokens/conventions exist;
- do not wrap every group in a card merely to make it look designed;
- do not duplicate the same fact across multiple regions without a workflow reason;
- do not use color decoratively when it implies state or consequence;
- do not add decorative metrics/badges/gradients without decision/action value;
- do not turn every product into a generic dashboard/SaaS template;
- do not prioritize novelty over workflow clarity;
- do not invent fields, states, permissions, or lifecycle behavior to make layout easier;
- do not treat framework defaults as design decisions when the product has its own wrappers/patterns;
- do not import another project's visual language without explicit authority.

## 8. Review routing

```text
REFERENCE_BACKED
→ ui-visual-reviewer mode PARITY

SYSTEM_BACKED / PRODUCT_DERIVED
→ ui-visual-reviewer mode COHERENCE

GREENFIELD
→ ui-visual-reviewer mode DESIGN_QUALITY
```

Runtime/interaction verification remains a separate concern.

## 9. Block vs proceed

Do not block merely because an exact mockup is absent.

Return `BLOCKED` only when unresolved authority materially prevents responsible design direction, for example:

- authoritative sources/owners conflict and source inspection cannot resolve them;
- target platform/viewport is unknown and materially changes the surface;
- unresolved business/workflow choice determines information architecture;
- the task requires changing a global design system without authority to do so.

Otherwise derive/propose the **smallest reasonable contract**, mark uncertainty/proposals, and continue.

## 10. Human acceptance

AI design review can demonstrate consistency/quality but does not replace product acceptance.

For greenfield or major proposals, final handoff should clearly identify new design decisions so a human can accept or redirect them without mistaking them for pre-existing rules.
