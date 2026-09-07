# ui-review

## Purpose

Use this as the default UI review workflow. Keep one accountable reviewer and choose the representation that best answers the question instead of loading every UI capability by default.

```text
CORRECT DEPTH BY DEFAULT
FLOW = STRUCTURED SEMANTIC EVIDENCE
VISUAL = RENDERED IMAGE EVIDENCE
BOTH = FLOW FIRST, VISUAL SECOND
PASS BELONGS TO THE EVIDENCE AND CANDIDATE THAT EARNED IT
REUSE BEFORE CREATE ON MATURE PRODUCT SURFACES
```

The goal is fast, high-signal review without sacrificing product correctness, visual quality, or evidence discipline.

## 1. Choose the review mode first

Use only the concern that can materially change the verdict:

```text
FLOW
= what exists, what the user can do, state/interaction changes, mutation result, recovery, downstream behavior

VISUAL
= composition, hierarchy, spatial UX, density, typography, color, product character, craft, taste, desirability

BOTH
= meaningful product UI work where behavior and rendered experience both matter

PARITY
= an exact accepted visual reference is an acceptance target
```

A local styling question normally needs `VISUAL`. A state/filter/form/workflow question normally needs `FLOW`. A meaningful new or changed screen often needs `BOTH`. Use `design-parity` only for exact-reference acceptance.

Do not turn every UI question into a full audit.

## 2. Resolve only the authority that can change the answer

Current product/business authority governs workflow, lifecycle, permission, ownership, mutation semantics, and required content. Current implementation/runtime is evidence of what exists now, not automatic product authority.

Load `ui-design-authority` only when visual/design authority is unclear or materially constrains the judgment. Do not reopen design governance for trivial changes whose product language is already clear.

When a claim depends on current code/runtime, inspect the exact current candidate rather than remembered screenshots or old review output.

## 3. FLOW review: prefer structured semantic UI evidence

For flow/state reasoning, prefer a compact semantic representation of the current UI over many screenshots or raw DOM/source dumps.

A useful semantic snapshot preserves only material UI meaning, for example:

```text
SCREEN / REGION
heading / text when it changes understanding
control role + label
value / selection
visible / hidden
enabled / disabled / read-only
required / validation
important ordering / relationship
navigation target
```

For an interaction, prefer a semantic delta:

```text
BEFORE
→ ACTION
→ ADDED / REMOVED / CHANGED
→ RESULT
```

For consequential mutations, extend only as needed:

```text
BEFORE
→ ACTION
→ INTERMEDIATE / loading or validation
→ request/result
→ rendered state
→ reload/persistence
→ downstream consequence / recovery
```

The semantic representation is derived evidence, not a new source of business truth. Generate it from current runtime/source/accessibility or equivalent product evidence when practical; do not maintain a second hand-written UI source of truth.

Avoid raw HTML, utility-class dumps, generated IDs, wrapper noise, or implementation names that do not change user meaning.

## 4. VISUAL review: use rendered evidence

Use current rendered images/runtime when the question is spatial or experiential.

Judge with five compact quality questions:

```text
CLEAR       — does the user understand the screen and action hierarchy quickly?
EFFECTIVE   — does the composition support the real job with low friction and error risk?
COHERENT    — does it belong to the product and use the right language for this job?
CRAFTED     — are hierarchy, typography, spacing, alignment and details intentionally resolved?
DESIRABLE   — does the product feel confident, polished and worth using repeatedly rather than merely correct?
```

Do not equate clean with good, novelty with quality, or more whitespace/cards/color with better design.

Diagnose before redesign. Fix at the level of the root problem: local polish for local defects, hierarchy for hierarchy defects, IA for IA defects, and concept redesign only when the concept itself is wrong.

Preserve already-correct choices when follow-up changes could damage them.

## 5. Mature product code: reuse before create

For existing app/web products with an established component/pattern language, source coherence is a material review concern when implementation changes UI structure or controls.

Before accepting a new UI component, primitive, wrapper, or pattern, inspect the relevant existing product components/patterns first.

```text
existing semantics/interaction fit
→ reuse directly

same semantic contract, small presentation difference
→ use an existing variant / composition / bounded extension

materially different semantic or interaction contract
→ a new component may be justified
```

A small spacing, copy, icon, color, radius, width, layout, or state-style difference is not by itself justification for a near-duplicate component.

Do not force unrelated semantics into one giant generic component merely to maximize reuse. Reuse follows semantic and interaction fit, not visual resemblance alone.

When a candidate creates a feature-local near-copy of an existing suitable primitive/pattern, treat it as a material system-coherence and maintainability finding because small divergence compounds across the product.

A new shared abstraction should earn its existence through a real independent contract or demonstrated recurring need, not one local screen.

## 6. Interaction sits between semantic and visual evidence

Use semantic evidence for questions such as whether a control appears, enables, validates, submits, navigates, persists, or changes state.

Use rendered/runtime visual evidence when spatial behavior matters, for example whether a newly revealed field is noticeable, focus/context is preserved, controls remain reachable, density becomes unusable, or layout shift obscures the next action.

Do not require both representations when one can prove the concern.

## 7. Escalate depth by risk, not ceremony

Keep simple/local review simple. Increase evidence only when consequence or uncertainty requires it.

Examples:

```text
icon / spacing / typography tweak
→ VISUAL only

filter / search / ordinary form state
→ FLOW + targeted runtime evidence

consequential mutation / permission / lifecycle / destructive action / cross-module seam
→ FLOW with relevant authority, persistence/reload, downstream/recovery evidence

meaningful finished screen
→ FLOW first when behavior changed, then focused VISUAL
```

Fail fast. If a material flow/business defect already invalidates the candidate, stop lower-value polish review until that defect is repaired unless visual evidence is independently needed for the next decision.

## 8. Candidate validity and reuse of evidence

A PASS is scoped to the concern, evidence, and candidate that earned it.

```text
candidate A + evidence → PASS
candidate changes
→ ask whether the change can affect that evidence
   ├─ no  → reuse it
   └─ yes → STALE / NEEDS REVERIFY
```

Do not expire evidence merely by age. Invalidate it by relevant change or changed authority/environment/state.

Use `runtime-regression` when prior runtime/UAT evidence must be carried across candidate changes and the impact is not trivial.

Visual PASS does not imply FLOW PASS. FLOW PASS does not imply visual quality. Screen PASS does not imply a downstream journey passed.

## 9. Review sequence

For `BOTH`:

```text
resolve current candidate + material authority
→ FLOW review from structured semantic evidence
→ material FLOW failure? stop lower-value polish
→ VISUAL review from representative rendered state(s)
→ source-coherence/reuse check when implementation changed components/patterns
→ aggregate only the concerns actually reviewed
```

Do not manufacture findings to make a review look deep. Do not keep reviewing low-value detail after a structural blocker makes that work disposable.

## 10. Findings and priority

Use only as much structure as the finding needs.

```text
P0 = workflow/state/invariant/usability blocker
P1 = material flow, IA, interaction, hierarchy, system-coherence, accessibility, responsive, or visual-quality issue
P2 = localized polish/refinement
```

When evidence strength matters, distinguish `OBSERVED`, `INFERRED`, and `UNVERIFIED`. Use `PROVEN` only when stronger source/runtime/current-authority evidence materially earns that claim.

A concise finding should normally say:

```text
[P0/P1/P2] problem
Current / evidence:
Impact:
Required direction:
Verification to close:
```

Use `KEEP — Do not change` only for important already-correct choices that are at risk of regression.

## 11. Verdict

Scope verdicts explicitly:

```text
Flow: PASS | NEEDS CHANGES | BLOCKED | NOT REVIEWED
Visual: PASS | NEEDS CHANGES | BLOCKED | NOT REVIEWED
Parity: PASS | NEEDS CHANGES | BLOCKED | N/A
Evidence validity: CURRENT | STALE
Overall: PASS | NEEDS CHANGES | BLOCKED
```

Overall PASS requires every concern actually required by the user's request and current risk to have sufficient current evidence. Absence of an observed problem is not evidence of correctness.

## 12. Optional specialist routing

The default is one reviewer using this workflow. Do not launch specialist reviewers merely because they exist.

Use additional capabilities only when they materially improve evidence or independence:

- `product-ui-critique` — optional detailed critique lens, not a default dependency;
- `ui-visual-reviewer` — optional fresh-eyes independent visual verdict;
- `ui-runtime-reviewer` — optional independent runtime verdict;
- `ui-design-authority` — when design authority is unclear/material;
- `design-parity` — exact accepted reference;
- `pixel-parity-calibration` — residual pixel mismatch after structural parity;
- `runtime-regression` — candidate-change validity for prior runtime evidence;
- `evidence-transport` — when reviewer-accessible artifacts must move between environments.

Independence is an execution choice, not a reason to duplicate the default review workflow.

## 13. Implementation handoff

`ui-review` owns diagnosis and product/design judgment. `senior-dev` owns implementation, integration, and engineering verification.

For a normal UI fix, hand off the smallest coherent outcome plus what must be preserved and how the reviewer will verify it. Use `IMPLEMENTATION_HANDOFF.md` only when the visual/interaction contract is substantial enough that prose could be reinterpreted.

Do not let the implementer self-certify product acceptance.
