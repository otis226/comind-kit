---
name: agent-bridge
description: >-
  Run an existing agent definition on a different coding CLI (SDK backend) instead of the native runtime, choosing the backend and model per call. Use when a subagent should execute on another vendor's CLI for an independent second opinion, for a capability the native runtime lacks, or to pin a specific model, and when adding or swapping such a backend later should be a configuration change rather than a rewrite.
---

<!-- comind-managed-skill: agent-bridge -->

# Agent Bridge

Run any agent definition on a non-native SDK backend.

One invocation shape covers every combination:

```text
<agent>  <sdk>  [model]  <scope>
```

The agent definition stays the single source of truth. The bridge reads it, inlines the
Agent Skills it declares, derives its capability boundary, and replays that contract on the
chosen backend. Nothing is duplicated per backend.

```text
AGENT DEFINITION IS THE PORTABLE CONTRACT
CAPABILITY IS DECLARED, NOT ASSUMED
NEVER INHERIT AN AMBIENT SANDBOX OR MODEL
PROBE ENVIRONMENT-DEPENDENT CAPABILITY BEFORE WORK
NO EVIDENCE CAPABILITY -> BLOCKED, NOT A PROSE VERDICT
```

## 1. Parse the invocation

Apply these rules in order. They are deterministic; do not guess.

| Token | Rule |
|---|---|
| 1 | Agent name. Required. |
| 2 | Backend if it matches a known sdk id, otherwise the backend is `claude` and this token begins the scope. |
| 3 | Model, only when token 2 was a backend and token 3 is not scope-like. Otherwise the backend's pinned default applies. |
| rest | Scope: free text describing the task, the surface to inspect, and any preconditions. |

An agent name may instead be written `skill:<name>` to anchor the run on a workflow skill
(section 8).

If the agent name is missing, ask for it. Everything else has a defined default.

## 2. Route

| Backend | Action |
|---|---|
| `claude` (default) | Spawn the agent natively with the Agent tool. Do not shell out. Its pinned model, effort, and tool restrictions apply unchanged. |
| anything else | One `Bash` call to `dispatch.mjs` in this skill directory. |

Native routing is not a fallback; it is the correct path when no other backend was requested.
Bridging exists to reach a different vendor, not to replace the native runtime.

## 3. Dispatch

```bash
node <skill-dir>/dispatch.mjs \
  --agent <name> --sdk <backend> [--model <id>] [--effort <level>] \
  --scope-file <path> \
  [--needs-browser] [--schema <skill-dir>/verdict.schema.json] \
  [--readonly auto|yes|no] [--cwd <dir>] [--max-turns <n>] [--raw]
```

Write the scope to a file and pass `--scope-file`. Inline `--scope` exists for one-liners only;
a real task packet is long enough that argument-length limits become a portability hazard.

Agent definitions resolve project-first from `.claude/agents/` and `.grok/agents/`, walking up
from `--cwd`, then from user-scope and installed plugin agent roots. Nearest project scope wins.
Use `--agent-file` when an explicit definition must override normal resolution.

Return the dispatcher's stdout to the caller. Do not summarize away the evidence it carries,
and do not upgrade a `BLOCKED` result into a pass because the prose sounded confident.

## 4. Caller obligations

The dispatcher enforces what it can prove. These remain the caller's responsibility.

**Declare browser need.** Pass `--needs-browser` whenever the task requires evidence from a
running UI. Agent definitions do not announce this, and inferring it from prose is unreliable.
An environment-dependent browser integration must pass its runtime probe before model work
starts. The Grok backend currently probes the configured `chrome-devtools` MCP server with
`grok mcp doctor` in the requested `--cwd`. Backends without a verified or successfully probed
browser capability refuse the run instead of producing an unevidenced verdict.

**Carry preconditions in the scope packet.** A bridged run starts with no session state. If the
surface needs a running server, a signed-in session, seeded data, or a specific branch checked
out, the scope must say so and say how. An isolated browser profile in particular starts with
no cookies, so an authenticated surface needs its sign-in steps spelled out.

**Apply the verdict schema for reviewer-type agents.** Pass `--schema` with the bundled
`verdict.schema.json` so the result is a checkable object rather than an argument. `PASS` and
`FAIL` require at least one evidence item; `BLOCKED` requires a non-empty `notVerified` list.
Leave the schema off for open-ended work, where the natural return is prose.

**Serialize browser runs.** Two agents driving one browser interleave and corrupt each other's
evidence. Dispatch them one at a time.

**Write a task packet, not a sentence.** The scope replaces the entire conversation the native
subagent would have inherited:

```text
GOAL
CANDIDATE / BRANCH / COMMIT
EXACT SCOPE OR SURFACE
PRECONDITIONS (how to run it, how to sign in, what data)
ACCEPTANCE RULES
REQUIRED CHECKS
RETURN CONTRACT
```

## 5. What the dispatcher guarantees

Derived from the agent definition, not from the prompt:

- **Capability boundary.** An agent that disallows write tools, or allowlists tools without
  them, runs read-only. The backend is told in its own vocabulary, and the prompt states the
  boundary as well. For Grok, read-only runs use the native `read-only` sandbox plus removal of
  edit, shell, and subagent escape paths; write-capable runs use the `workspace` sandbox.
  `--readonly yes|no` overrides the derivation when a run genuinely differs.
- **Explicit sandbox and model, always.** Every enabled backend invocation passes both explicitly,
  so a run cannot silently inherit a permissive sandbox or a drifting model from interactive
  user configuration. A backend without a pinned default model must receive `--model` or the
  dispatcher refuses the run.
- **Skills resolved or refused.** Skills declared by the agent are read from the installed skill
  root and inlined. A missing skill fails the run rather than letting the backend improvise a
  workflow of its own.
- **Capability gate before work.** A missing CLI, a disabled backend, or a required browser whose
  static declaration or runtime probe cannot establish capability returns `BLOCKED` before any
  model is invoked.

## 6. Result envelope

JSON on stdout: which agent and definition file resolved, backend, model, whether the run was
read-only, which skills were inlined, the backend exit code, and `result`. Use `--raw` to emit
the backend's own output unwrapped.

Status values: `OK`, `BLOCKED`, `BACKEND_FAILED`, `ERROR`, `DRY_RUN`.
Exit codes: `0` ok, `2` usage or resolution error, `3` blocked, `4` backend failure.

`--dry-run` prints the composed prompt and the exact argv without invoking the model backend.
Capability preflights such as CLI presence and browser probes still run because a dry-run must
not claim an impossible execution plan.

## 7. Adding or changing a backend

Edit the `BACKENDS` table at the top of `dispatch.mjs`: `bin`, `enabled`, `browser`,
`defaultModel`, and a `build()` that maps the common context onto that CLI's flags. Nothing
else in the skill changes, and no caller changes.

Set `browser` honestly. A static `verified` value is only appropriate for capability that is
truly part of the backend itself. Environment-dependent integrations should use a runtime probe
instead; `unverified` or `none` must fail closed when `--needs-browser` is requested. An
optimistic browser declaration defeats the mechanism that prevents unevidenced reviewer passes.

Every enabled backend must map read-only/write-capable execution onto a real backend boundary,
and every invocation must pass an explicit model. Do not rely on a vendor's interactive global
config for either property.

Ship a new backend disabled until its CLI is installed and its path has actually been exercised.

## 8. Bridging a skill instead of an agent

A workflow skill can be the anchor of a run: pass `--skill <name>` instead of `--agent`.
The skill body becomes the operating contract, exactly as an agent definition would. In the
invocation grammar, mark it explicitly — `skill:<name>` — because the same name can exist both
as an agent and as a skill, and guessing between them is not resolution.

Skills resolve from project scope first: `.claude/skills/<name>/SKILL.md`, walking up from
`--cwd`, then the installed user-scope roots. A workflow that lives beside the repository it
operates on is found without configuration.

Two consequences follow from a skill having no capability metadata:

- **No declared boundary means write-capable.** An agent definition can disallow write tools; a
  skill cannot. Skill-anchored runs default to write-capable, which is usually right for a
  workflow, and `--readonly yes` is available when it is not.
- **Enforcement that lives in the native runtime does not travel.** Guard rails implemented as
  runtime hooks stay behind: a backend that does not run them cannot enforce them, so a rule
  the workflow relies on degrades from a mechanism into an instruction the model may or may not
  follow. Before bridging a workflow, ask what stops it from doing the wrong thing. If the
  answer is a hook rather than the workflow text, keep that workflow native.

Weigh destructiveness the same way. A workflow that only reads, builds, and reports is a safe
first bridge. One that merges, deletes branches, or removes working trees should stay native
until the bridged path has been exercised on the safe one.

References between skills degrade gracefully: a bridged workflow that cites another skill by
path reads it from the repository like any other file.

## 9. Limits

- An agent with no definition file cannot be bridged; pass `--agent-file` explicitly.
- A successful browser preflight proves the configured integration was reachable at dispatch
  time, not that every later UI interaction will succeed. If required evidence still cannot be
  collected, the reviewer must return `BLOCKED`.
- The bridge replays a contract; it cannot grant a backend a tool that backend does not have.
- Vendor CLIs change their flags and safety semantics. When a backend starts failing, check its
  current CLI contract before assuming the agent contract regressed.
