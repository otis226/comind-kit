# First Design Brief

Use this template when the task owner prepares a compact brief for a fresh visual-design or external image-generation pass under the human-selected image-first loop.

The purpose is to communicate the product problem and desired visual character without turning ideation into a compliance checklist or causing the worker to reproduce a weak current implementation.

## Brief shape

Prefer a compact brief with these sections:

```text
SCREEN
- the target surface / state / platform

USER JOB
- what the user is trying to understand or accomplish

REQUIRED CONTENT / ACTIONS
- only information and actions that materially affect the composition

PRODUCT CHARACTER
- the durable experiential qualities the product should express

VISUAL DIRECTION / ACCEPTED REFERENCES
- desired visual direction and any genuinely accepted same-product references

CREATIVE FREEDOM
- what the designer may rethink: composition, grouping, hierarchy, navigation, density, interaction
```

Add a hard invariant only when violating it would invalidate the concept. Do not inflate this template into a lifecycle, permission, component, or implementation checklist.

## Product character versus layout prescription

`PRODUCT CHARACTER` should describe qualities such as mature, operational, calm, confident, dense-but-readable, native-mobile, precise, refined, or other project-authoritative qualities.

It should not prescribe arbitrary layout details such as exact card counts, fixed row heights, radius values, component names, or current-screen structure unless those details already have accepted design authority.

The goal is:

```text
NO STYLE GUIDANCE
→ GENERIC / RANDOM PRODUCT LANGUAGE

EXCESSIVE STYLE RULES
→ CHECKLIST OPTIMIZATION / WEAK EXPLORATION

PRODUCT CHARACTER + ACCEPTED VISUAL ANCHORS
→ COHERENT PRODUCT DNA WITH REAL CREATIVE FREEDOM
```

## Accepted references

When the product already has human-accepted screens or visual directions, prefer supplying those as visual anchors. State what they govern at a high level, for example typography character, density, navigation character, surface treatment, or spacing rhythm.

Do not ask the new screen to copy the reference layout unless the reference is an exact acceptance target for that surface. The design should belong to the same product while solving its own user job.

As more screens are accepted, treat the set of accepted references as an emerging product visual language. Prefer those references over generic style prose when they provide stronger evidence.

## Current implementation is not desired style by default

Never equate `CURRENT IMPLEMENTATION` with `CURRENT DESIRED STYLE` merely because the implementation exists.

A current screenshot or source implementation may be useful evidence, but do not expose it to the creative pass as a visual anchor when it is known to be weak, under redesign, accidental, or otherwise not accepted.

Only inherit current implementation details when their design authority is established by the project/user. This prevents a first-design worker from preserving exactly the visual problems the design pass is intended to escape.

## Recommended creative-freedom language

Keep the instruction permissive and compact, for example:

```text
You are free to rethink composition, grouping, hierarchy, navigation, density, and interaction patterns.
Do not reproduce the current implementation by default.
Preserve the intended user job and the accepted product character.
```

Do not append long anti-invention or anti-slop checklists to the creative brief. Those belong to later product/domain validation and design review.
