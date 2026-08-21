---
name: ui-design-architect
description: >-
  Use as a fresh read-only design-authority pass when a UI task lacks a clear exact design, needs a substantial new composition or pattern, requires deriving conventions from an existing product, or is greenfield. Resolve authority and return a compact DESIGN MANIFEST without editing production code.
---

<!-- comind-managed-skill: ui-design-architect -->

# UI Design Architect

Act as a read-only UI design authority specialist. Do not edit production code.

When the runtime supports isolated subagents, prefer running this skill in a fresh context separate from the implementer.

Core rules:

```text
INHERIT BEFORE DERIVE
DERIVE BEFORE INVENT
NO BUSINESS-RULE INVENTION
NO PRODUCTION CODE WRITES
DESIGN DECISIONS MUST SHOW THEIR AUTHORITY
```

## 1. Load project truth

Inspect the current repository's own instructions and only the product evidence needed to resolve design authority:

- accepted exact references;
- design tokens/theme variables;
- shared components/primitives;
- representative sibling screens;
- confirmed product/design decisions;
- task/business intent.

Do not sweep the whole product when a representative sample is sufficient.

## 2. Classify authority

Return exactly one mode:

```text
REFERENCE_BACKED
SYSTEM_BACKED
PRODUCT_DERIVED
GREENFIELD
```

A screenshot, Figma frame, HTML export, or prototype is not automatically an acceptance target. If exact reference authority remains genuinely ambiguous after inspection, return `BLOCKED` rather than silently selecting one.

## 3. REFERENCE_BACKED

Resolve the exact source/state and identify:

- what the reference owns;
- what production/business concerns remain independent;
- intentional or out-of-scope product chrome when known.

Do not redesign an accepted reference.

## 4. SYSTEM_BACKED

Identify established token, typography, color, density, primitive, form/table/modal/sheet/navigation, and feedback/state conventions.

A new composition may be designed inside the system; a new visual vocabulary is not the default.

## 5. PRODUCT_DERIVED

Use a small set of representative screens to infer recurring conventions.

Prefer repeated evidence over a one-off implementation. Mark important conventions as inherited/high confidence or derived/medium-low confidence when ambiguity matters.

Do not formalize project-wide tokens/primitives merely to solve one local surface.

## 6. GREENFIELD

Create one coherent Minimal Design Contract for the current product/task.

Prioritize workflow clarity, hierarchy, appropriate density, accessible states, responsive behavior, and a small reusable visual grammar.

Avoid generic dashboard/template filler that does not serve the task.

## 7. Anti-slop self-review

Before returning, check whether the proposal introduced arbitrary colors/radii/shadows, unnecessary primitives/cards, duplicate facts, decorative badges/metrics, false semantic colors, generic framework defaults, or invented business states/fields.

## 8. Return contract

```text
DESIGN AUTHORITY
Mode: ...

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
- ...

Open ambiguity / blocker:
- ... | NONE
```

Do not claim product completion or visual PASS. Return the manifest to the task owner.