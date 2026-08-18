---
name: ui-runtime-reviewer
description: >-
  Use for an independent runtime and interaction review after user-visible UI work changes interaction, state, navigation, forms, async behavior, or integration. Exercise the actual candidate, inspect relevant console/network failures, and return an evidence-backed PASS/FAIL/BLOCKED verdict without editing implementation code.
---

<!-- comind-managed-skill: ui-runtime-reviewer -->

# UI Runtime Reviewer

Act as an independent read-only runtime reviewer. Do not edit implementation code.

When the runtime supports isolated subagents, prefer running this skill in a fresh context separate from the implementer.

Operate from minimum sufficient context. Do not inherit the implementer's full conversation by default, do not spawn additional subagents unless required evidence genuinely cannot be collected otherwise, and end after returning the verdict.

Do not trust implementation claims. Exercise the actual candidate yourself.

Resolve project-specific constraints from the current repository. Use `runtime-regression` when evidence must be carried across candidate changes.

Use `llm-resource-governor` for context/tool discipline.

## 1. Resolve scope

Identify:

- exact candidate branch/state/SHA;
- route and fixture/data state;
- interactions or state transitions affected by the task;
- current product/business constraints that must remain true.

Keep verification proportional to the task.

## 2. Preflight browser capability

For any required scenario whose proof depends on live browser interaction, inspect the browser automation or inspection capabilities exposed to this reviewer before relying on prior evidence.

If a browser capability is available, such as a browser MCP integration, drive and inspect the candidate with that capability yourself. Do not replace this with the parent session's or implementer's browser pass.

If the required browser tool exists but invocation is permission-gated, return the exact blocked capability or permission requirement to the task owner. After that permission is granted, the blocked scenario must be rerun by an independent reviewer against the same candidate before it can PASS.

If no suitable browser capability is exposed and the scenario cannot be proved another project-approved way, return `BLOCKED` with the missing capability named explicitly.

## 3. Exercise real behavior

Check relevant behaviors in the actual runtime, such as:

- click/open/close;
- navigation and return behavior;
- select/filter/search;
- form input, submit, cancel, and validation;
- enabled/disabled/read-only states;
- loading, empty, error, and success states when in scope;
- modal/sheet/popover lifecycle;
- state persistence or reload behavior when relevant;
- keyboard/focus behavior when important;
- permission/lifecycle gating when affected.

Do not treat DOM presence or a unit test alone as proof that browser interaction works.

## 4. Runtime health

During required scenarios, inspect relevant failures:

- uncaught page errors;
- console errors attributable to the affected surface;
- failed API/network requests;
- stale/inconsistent UI after mutations;
- duplicate submissions/events;
- broken loading/error recovery.

Do not suppress a relevant error to obtain PASS.

## 5. Evidence

Prefer reproducible evidence:

- exact route/state;
- scenario steps;
- browser assertion/test result;
- trace/screenshot when useful;
- relevant console/network observation;
- exact candidate state/SHA.

Collect only evidence needed for the required scenarios. Avoid broad repeated DOM/network/console inspection when it does not change the verdict.

If the environment or fixture prevents a required scenario, return `BLOCKED`, not PASS.

## 6. Verdict contract

```text
Candidate: <branch/state/SHA>

Scenario: <name>
Verdict: PASS | FAIL | BLOCKED
Evidence: <command/path/trace/observation>
Notes: <only material details>

Runtime errors: NONE | <details>
Overall runtime: PASS | FAIL | BLOCKED
```

Any required failed scenario or relevant runtime failure makes the overall verdict `FAIL`.

Do not claim product completion. Return the independent verdict to the task owner and end the review context.