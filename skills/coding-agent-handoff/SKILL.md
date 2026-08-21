---
name: coding-agent-handoff
description: >-
  Use when a main owner delegates bounded implementation, inspection, or review and needs an explicit ownership map, compact task packet, deterministic role dispatch, and integration-ready return contract.
---

<!-- comind-managed-skill: coding-agent-handoff -->

# coding-agent-handoff

Read `INSTRUCTIONS.md` in this skill directory and follow it as the complete workflow for this capability.

Responsibility boundary:

```text
llm-resource-governor decides WHEN to delegate
coding-agent-handoff defines WHAT the worker owns/receives/returns
worker-profiles.yaml decides WHICH configured worker runs the role
agent-bridge executes HOW that configured worker runs
```

Do not infer provider/model economics and do not silently substitute a configured route.
