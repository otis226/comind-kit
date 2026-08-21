---
name: coding-agent-handoff
description: >-
  Use for non-trivial coding handoffs or agent orchestration: resolve project/source/design authority, assign ownership, use vertical slices, offload bounded work through deterministic worker profiles, and integrate evidence.
---

<!-- comind-managed-skill: coding-agent-handoff -->

# coding-agent-handoff

Read `INSTRUCTIONS.md` in this skill directory and follow it as the complete CoMind workflow for this capability.

When model/runtime choice is available, also apply `llm-resource-governor`.

Key routing rule:

```text
llm-resource-governor decides WHEN to offload
worker-profiles.yaml decides WHICH runtime/model/API runs the role
agent-bridge executes that configured route
```

Do not infer price/cost tier from model or vendor names. Do not silently replace a configured worker with a different provider/model.

For bounded source inspection, review, implementation, UI evidence, or targeted verification:

- give the worker minimum sufficient context;
- include context/output budgets and escalation conditions;
- invoke the role through `agent-bridge` without routine `--sdk`/`--model` overrides;
- `NATIVE` means use the normal native specialist;
- `BLOCKED` means resolve the configured route's blocker or escalate;
- do not repeat sufficient worker evidence on the premium owner merely to redo the same bounded work.

This directory is the canonical CoMind skill package. Installed copies/symlinks are runtime distribution artifacts, not separate sources of truth.
