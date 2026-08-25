---
name: coding-agent-handoff
description: >-
  Use when a main owner delegates bounded implementation, inspection, or review and needs an explicit ownership map, compact task packet, native role dispatch, LEAN-aware verification sequencing, and integration-ready return contract.
---

<!-- comind-managed-skill: coding-agent-handoff -->

# coding-agent-handoff

Read `INSTRUCTIONS.md` in this skill directory and follow it as the complete workflow for this capability.

Responsibility boundary:

```text
llm-resource-governor decides EXECUTION MODE + WHEN to delegate
coding-agent-handoff defines WHAT the worker owns/receives/returns + verification sequencing
Agent Skill / explicit agent defines WHICH role/behavior executes
current runtime executes HOW through its native context/subagent/tooling
```

CoMind does not select providers/models or spawn another runtime. If a user wants another runtime, invoke the same role/task packet from that runtime directly.
