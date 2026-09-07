# UI implementation handoff

## Purpose

Use this after a UI review has produced approved findings and the user wants those findings implemented by a coding agent.

The goal is to preserve design intent without turning the handoff into a long essay. The reviewer owns the UI/product decision; the implementation agent owns how to realize it in code inside the approved boundary.

```text
REVIEW != IMPLEMENTATION CONTRACT
SHORT != VAGUE
VISUAL INTENT MUST BE TESTABLE
IMPLEMENTER MUST NOT SELF-CERTIFY PRODUCT ACCEPTANCE
```

## 1. Inspect source before writing the contract

Before prescribing a meaningful visual treatment, inspect enough current source to avoid inventing a parallel product language:

- the target screen/component;
- relevant shared primitives/components;
- governing theme/tokens/variants;
- one to three representative sibling surfaces when product conventions must be derived.

Current implementation is evidence, not automatic design authority. Separate recurring product convention from one-off implementation accidents.

Do not invent arbitrary hex values, spacing, radius, shadow, typography, or control variants when authoritative project primitives/tokens already exist.

## 2. Slice by coherent UI outcome, not finding count

Do not use an arbitrary rule such as "3-5 findings per pass".

A coding slice should be one coherent visual/workflow outcome whose parts need to land together. A slice may contain two requirements or eight requirements; coherence and ownership determine the boundary.

Split only when the surfaces can be implemented and verified independently without one pass destabilizing the other.

## 3. Convert approved findings into a UI implementation contract

Keep rationale outside the execution contract unless it materially changes implementation choices.

Use the minimum sections needed from this shape:

```text
OUTCOME
- observable user/product result

VISUAL TARGET
- accepted reference, annotated screenshot, ASCII wireframe, or concise composition description when useful

LOCKED
- structure/composition that must not be reinterpreted
- action placement and hierarchy
- required component/pattern/variant
- key dimensions or proportions when materially important
- authoritative tokens/semantic colors when known

BOUNDED
- decisions the implementer may make only within current product conventions
- responsive adaptation, minor spacing, wrapping, intrinsic sizing, or similar bounded freedom

FREE
- implementation-only choices such as internal component decomposition or helper structure

DO NOT SUBSTITUTE
- plausible alternatives that satisfy the wording but violate the approved visual intent

KEEP
- already-correct behavior, content, component choice, density, or product capability that must survive the change

STATES
- only loading/empty/error/disabled/overflow/responsive/interaction states materially affected by the change

ACCEPTANCE
- observable criteria the independent reviewer can verify against the rendered candidate

REQUIRED EVIDENCE
- screenshot/runtime/source evidence needed to close the specific acceptance concerns
```

Not every small UI change needs every section.

## 4. Use visual targets when composition matters

When the approved direction depends on placement, proportion, grouping, or hierarchy that prose can easily reinterpret, provide a visual target.

Appropriate forms include:

- accepted design/reference;
- annotated screenshot;
- small mock/wireframe;
- ASCII composition sketch when that is sufficient.

A visual target is especially useful when the change is structurally significant, the implementer has previously substituted a different treatment, or several regions must coordinate visually.

Do not manufacture pixel-parity requirements when no exact accepted reference exists. Lock only dimensions/proportions that materially define the approved treatment; leave normal responsive and intrinsic behavior bounded by the product system.

## 5. Close semantic loopholes explicitly

Generic instructions such as `improve hierarchy`, `add visualization`, or `make it cleaner` are not implementation contracts.

When multiple implementations could technically satisfy the wording but only some satisfy the approved design, add `DO NOT SUBSTITUTE` constraints.

Example:

```text
LOCKED
- Use a compact sparkline in the right side of the KPI card.
- Keep the primary metric visually dominant.

DO NOT SUBSTITUTE
- no bar/donut/full Cartesian chart;
- no chart below the metric;
- no nested chart card;
- no new decorative color family.
```

The goal is not to enumerate every impossible variation. Block the realistic alternatives most likely to distort the approved intent.

## 5A. Preserve semantic/source truth during visual polish

Visual completeness never authorizes content invention. When the approved UI needs a fact that current product/domain/source authority does not provide, the implementer must not fabricate plausible labels, statuses, hardware/device identity, capabilities, timestamps, events, versions, or business actions merely to make the composition feel complete.

Do not reinterpret a generic boolean, enum, route characteristic, fixture field, or implementation name into more specific user-facing business meaning unless that meaning is explicitly supported by the governing contract. Prefer, in order:

1. omit an optional fact that is not known;
2. use a neutral source-safe value such as `Not specified` only when the UI genuinely requires a visible value;
3. derive a presentation field only when the derivation is unambiguous from current source authority.

Demo/fixture facts belong in explicit fixture/repository contracts rather than hardcoded presentation fallbacks. If a polished layout depends on invented content, fix the composition instead of inventing domain truth.

## 6. Keep dispatch prompts short

For a genuinely small isolated UI change, the contract may be inline.

For substantial, persistent, multi-turn, remote, or review-heavy work, place the UI implementation contract in the existing persistent issue/task record according to `coding-agent-handoff`, then use a short dispatch prompt that points to it.

Do not paste the review essay into the issue. Do not copy the issue body back into the dispatch prompt.

A good dispatch prompt says, in substance:

```text
Implement the approved UI contract in <issue/task>.
Follow the visual target, LOCKED, KEEP, and DO NOT SUBSTITUTE sections literally.
Resolve current source first and reuse authoritative primitives/tokens.
Do not redesign or reinterpret the approved treatment.
Stop at READY FOR PRODUCT/MANUAL REVIEW.
```

## 7. Separate execution checklist from acceptance

The implementation agent may use the contract as an execution checklist, but its own checkmarks are not product evidence.

```text
IMPLEMENTED != VISUALLY ACCEPTED
TEST PASS != UI PASS
SOURCE PRESENCE != RENDERED RESULT
IMPLEMENTER SELF-CHECK != INDEPENDENT ACCEPTANCE
```

After implementation, return the candidate to the product/review owner with the evidence required by the acceptance contract.

For meaningful visual changes, rendered evidence is normally required. Source inspection can prove primitives/tokens/structure but cannot by itself prove composition quality. Machine verification and visual/product verification remain separate concerns.

When exact accepted reference fidelity is required, use `design-parity` for the applicable acceptance evidence.

## 8. Verify contract-by-contract on the final candidate

Review the integrated rendered candidate against the approved contract, not against the implementer's summary.

Check, as applicable:

```text
LOCKED item -> PASS | FAIL | BLOCKED
KEEP item -> PASS | FAIL | BLOCKED
DO NOT SUBSTITUTE -> PASS | FAIL | BLOCKED
affected state -> PASS | FAIL | BLOCKED
visual target/composition -> PASS | FAIL | BLOCKED
```

Do not let automated tests, typecheck, or a worker `COMPLETE` verdict replace this acceptance step.

If current source/runtime evidence is unavailable for a material criterion, report it as unverified/blocked instead of assuming compliance.

## 9. Correct deltas, do not rewrite the whole task

When implementation misses the contract, issue a narrow correction:

```text
Expected: <contract item>
Actual: <observed candidate>
Required correction: <specific delta>
Keep: <already-correct parts that must not regress>
```

Do not respond to a missed UI requirement by indefinitely appending more prose to the full prompt.

If the same class of substitution repeats, tighten the LOCKED/DO NOT SUBSTITUTE boundary, shrink the coherent slice when possible, use a fresh worker context when the existing one is stale, or escalate task-worker fit according to `coding-agent-handoff`.

## 10. Completion boundary

The coding agent may report implementation complete, but UI/product completion requires the independent acceptance evidence defined by the contract and the project's authorized review boundary.

Default stop state for delegated implementation:

```text
READY FOR PRODUCT/MANUAL REVIEW
```

Do not close a persistent task or claim product acceptance solely because the implementation agent says the checklist is complete.
