---
name: coding-agent-handoff
description: >-
  Use when a main owner delegates bounded implementation, inspection, or review and needs an explicit ownership map, compact task packet, role dispatch, and integration-ready return contract.
---

<!-- comind-managed-skill: coding-agent-handoff -->

# coding-agent-handoff

Read `INSTRUCTIONS.md` in this skill directory and follow it as the complete workflow for this capability.

Responsibility boundary:

```text
llm-resource-governor decides WHEN to delegate
coding-agent-handoff defines WHAT the worker owns/receives/returns
Agent Skill / explicit agent defines WHICH role/behavior executes
agent-bridge optionally executes HOW an explicitly selected external runtime runs that role
```

Native execution is the default. When external execution is deliberately chosen, keep runtime/model selection explicit at the dispatch boundary.

Do not infer provider/model economics and do not silently substitute another runtime/model after a failed or blocked external route.
