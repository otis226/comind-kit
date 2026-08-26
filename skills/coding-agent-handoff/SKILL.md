---
name: coding-agent-handoff
description: >-
  Use when a main owner delegates bounded implementation, inspection, or review and needs an explicit ownership map, compact task packet, native role dispatch, LEAN-aware verification sequencing, and integration-ready return contract.
---

<!-- comind-managed-skill: coding-agent-handoff -->

# coding-agent-handoff

Read `INSTRUCTIONS.md` in this skill directory and follow it as the complete workflow for this capability.

Attention-safe dispatch rule:

```text
THE DISPATCH PROMPT IS AN EXECUTION COMMAND, NOT THE TASK CONTRACT.
```

When a persistent issue/task contract exists, keep the agent-facing dispatch prompt short and front-load the actual action. Default to roughly 4-8 lines / <=100 words: task first, issue/task reference second, then only live-HEAD, non-negotiable boundary, verification/stop-state facts that are needed at execution time. Do not repeat the issue body, long rationale, chat history, or full acceptance criteria in the prompt. If critical instructions no longer fit cleanly, update the issue/task contract instead of lengthening the dispatch prompt.

For a genuinely small task without a persistent contract, keep the inline prompt compact and ordered as: `TASK -> CHANGE/KEEP -> DONE`. Do not bury the requested action between background paragraphs.

Responsibility boundary:

```text
llm-resource-governor decides EXECUTION MODE + WHEN to delegate
coding-agent-handoff defines WHAT the worker owns/receives/returns + verification sequencing
Agent Skill / explicit agent defines WHICH role/behavior executes
current runtime executes HOW through its native context/subagent/tooling
```

CoMind does not select providers/models or spawn another runtime. If a user wants another runtime, invoke the same role/task packet from that runtime directly.
