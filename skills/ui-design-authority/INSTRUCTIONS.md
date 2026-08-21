# ui-design-authority

## Purpose

Use this before meaningful user-visible UI implementation to determine **how much design freedom the AI actually has**.

It prevents two opposite failures: redesigning despite an exact accepted reference, and assuming unlimited creative freedom merely because no exact screen design exists.

```text
ABSENT SCREEN DESIGN != ABSENT DESIGN AUTHORITY
DESIGN FREEDOM MUST BE RESOLVED, NOT ASSUMED
INHERIT BEFORE DERIVE
DERIVE BEFORE INVENT
```

This is design-governance workflow, not a project-specific design system.

## 1. When authority must be resolved

Resolve authority for new screens/surfaces, new layout/composition, new interaction patterns, meaningful visual-language changes, new form/table/detail/dashboard/navigation surfaces, missing exact design when the agent must decide UI, or conflicting/incomplete design evidence.

Small copy, icon, or token-aligned tweaks may reuse already-clear surface authority without a long manifest.

## 2. Evidence hierarchy

Follow current project source priority. Useful evidence may include exact accepted design/prototype/spec, formal design system/tokens/components/design docs/Storybook, sibling product screens with similar intent, shared application chrome, CSS/theme variables/primitives, confirmed product/design decisions, and current implementation as evidence rather than automatic authority.

Do not use framework defaults, template galleries, or model taste as authority when project evidence exists.

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
```

The manifest defines the **authority boundary**, not a pixel-by-pixel spec.

## 6. When to use `ui-design-architect`

Prefer an independent design-architecture pass for meaningful PRODUCT_DERIVED/GREENFIELD work, substantial new SYSTEM_BACKED composition, conflicting design sources, decisions that may affect many screens, or when an implementer risks inventing and self-certifying the same design.

Usually skip it for clear REFERENCE_BACKED work, small patches using well-established patterns, or localized fixes with an unambiguous baseline.

## 7. Anti-slop guardrails

Do not introduce new visual vocabulary when existing language works; do not create new primitives when shared primitives fit; do not use arbitrary color/radius/shadow/spacing when conventions exist; do not card-wrap every group; do not duplicate facts without workflow reason; do not use semantic color decoratively; do not add decorative metrics/badges/gradients without decision value; do not turn every product into a generic SaaS dashboard; do not prioritize novelty over workflow clarity; do not invent fields/states/permissions/lifecycle for layout convenience; do not treat framework defaults as product design authority; and do not import another project's visual language without authority.

## 8. Review routing

```text
REFERENCE_BACKED
→ ui-visual-reviewer mode PARITY

SYSTEM_BACKED / PRODUCT_DERIVED
→ ui-visual-reviewer mode COHERENCE

GREENFIELD
→ ui-visual-reviewer mode DESIGN_QUALITY
```

Runtime/interaction verification remains separate.

## 9. Block vs proceed

Do not block merely because an exact mockup is absent.

Return `BLOCKED` only when unresolved authority materially prevents responsible design direction, such as unresolved authoritative conflicts, an unknown platform/viewport that materially changes the surface, unresolved workflow choices that determine information architecture, or a requested global design-system change without authority.

Otherwise derive/propose the **smallest reasonable contract**, mark uncertainty/proposals, and continue.

## 10. Human acceptance

AI design review can demonstrate consistency/quality but does not replace product acceptance. For greenfield or major proposals, final handoff should clearly identify new design decisions so a human can accept or redirect them.
