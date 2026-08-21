---
name: agent-bridge
description: >-
  Run a configured agent or workflow skill on an external coding runtime. Use deterministic worker profiles to map each role to a runtime, endpoint, model, and credential source without asking the orchestrator to infer model cost.
---

<!-- comind-managed-skill: agent-bridge -->

# Agent Bridge

Use Agent Bridge when a bounded worker should run outside the main owner's native model/runtime.

The architecture is deliberately deterministic:

```text
main owner decides WHEN to offload
        ↓
worker-profiles.yaml decides WHICH worker runs the role
        ↓
agent-bridge resolves and executes the configured profile
        ↓
compact result returns to the owner
```

Core rules:

```text
CONFIG DECIDES THE WORKER
DO NOT INFER COST FROM MODEL NAMES
NO SECRET VALUES IN YAML
NO REPOSITORY-CONTROLLED CONFIG AUTO-LOAD
EXPLICIT MODEL AND EXECUTION BOUNDARY
NO REQUIRED CAPABILITY -> BLOCKED
NO MAPPING -> NATIVE
```

## 1. Worker config

Default config location:

```text
$XDG_CONFIG_HOME/comind/worker-profiles.yaml
```

or, when `XDG_CONFIG_HOME` is unset:

```text
~/.config/comind/worker-profiles.yaml
```

Override with:

```text
AGENT_BRIDGE_WORKER_CONFIG=/path/to/worker-profiles.yaml
```

or per invocation:

```text
--worker-config /path/to/worker-profiles.yaml
```

A project/repository `.comind/worker-profiles.yaml` is intentionally not auto-loaded. A repository must not be able to redirect its own source or evidence to an arbitrary external endpoint. Pass a project-owned config explicitly only when you trust it.

Start from `worker-profiles.example.yaml`.

## 2. Config shape

The file maps roles to named profiles:

```yaml
version: 1

profiles:
  ui-review:
    runtime: claude-code
    model: third-party-model-id
    base_url: https://gateway.example.com
    api_key_env: UI_REVIEW_TOKEN
    readonly: true
    max_turns: 16

  runtime-review:
    runtime: grok
    model: grok-4.6
    readonly: true
    needs_browser: true

agents:
  ui-visual-reviewer: ui-review
  ui-runtime-reviewer: runtime-review

skills:
  product-ui-critique: ui-review
```

The parser intentionally accepts a constrained map-only YAML subset: two-space indentation, maps, and scalar values. Lists, anchors, tags, and multiline YAML are not part of this configuration contract.

## 3. Profiles

Supported common profile fields:

- `runtime`: `claude-code`, `grok`, `codex`, or another enabled direct backend.
- `model`: explicit model ID/alias for that runtime or gateway.
- `effort`: optional runtime reasoning-effort value.
- `readonly`: `true`, `false`, `yes`, `no`, or `auto` semantics.
- `max_turns`: bounded turn limit.
- `needs_browser`: require verified browser evidence capability.
- `base_url`: non-secret Claude Code gateway endpoint.
- `api_key_env`: environment variable holding the profile credential.
- `api_key_mode`: `auth-token` (default) or `api-key` for Claude Code gateways.
- `env`: additional non-secret environment values.
- `env_from`: map target environment variable -> source secret environment variable.

Do not store an `api_key` value in YAML. Agent Bridge rejects it. It also rejects literal `env` keys whose names look like credentials (`KEY`, `TOKEN`, `SECRET`, `PASSWORD`, `CREDENTIAL`). Use `api_key_env` or `env_from` instead.

Example:

```yaml
profiles:
  ui-review:
    runtime: claude-code
    model: model-via-agentrouter
    base_url: https://router.example/v1
    api_key_env: AGENTROUTER_UI_TOKEN
    env:
      SOME_NON_SECRET_FLAG: enabled
    env_from:
      CUSTOM_GATEWAY_SECRET: ANOTHER_LOCAL_SECRET
```

The resolved secret value is passed only in the worker process environment. Dry-run/result metadata must not expose it.

## 4. Routing precedence

Use deterministic precedence:

```text
explicit --sdk
→ direct legacy bridge; bypass profile routing

explicit --profile
→ use that configured profile

agents.<agent>
→ mapped profile

skills.<skill>
→ mapped profile

no mapping
→ NATIVE
```

`NATIVE` is not an error. It tells the main owner to use the runtime's normal native subagent/context for that role.

An explicit CLI value such as `--model`, `--effort`, `--readonly`, or `--max-turns` overrides the selected profile for that invocation. Do not use overrides as hidden routing policy; they are for deliberate one-off experiments/debugging.

## 5. Invocation

Configured routing:

```bash
node <skill-dir>/dispatch.mjs \
  --agent ui-visual-reviewer \
  --scope-file /tmp/task.md \
  --cwd /path/to/repo \
  --schema <skill-dir>/verdict.schema.json
```

Skill anchor:

```bash
node <skill-dir>/dispatch.mjs \
  --skill product-ui-critique \
  --scope-file /tmp/task.md \
  --cwd /path/to/repo
```

Explicit profile override:

```bash
node <skill-dir>/dispatch.mjs \
  --agent ui-visual-reviewer \
  --profile another-profile \
  --scope-file /tmp/task.md
```

Explicit direct backend remains supported for compatibility:

```bash
node <skill-dir>/dispatch.mjs \
  --agent reviewer --sdk grok --model grok-4.6 \
  --scope-file /tmp/task.md
```

## 6. Claude Code external workers

A `runtime: claude-code` profile launches a separate non-interactive Claude Code process with the configured gateway/model.

Agent Bridge clears ambient main-owner Claude routing/auth/model variables before profile values are injected, including saved environment routes such as `ANTHROPIC_BASE_URL`, `ANTHROPIC_API_KEY`, `ANTHROPIC_AUTH_TOKEN`, `CLAUDE_CODE_OAUTH_TOKEN`, and model override variables. This prevents a configured worker from accidentally consuming the main owner's route/quota.

The worker receives:

- explicit `--model`;
- bounded `--max-turns`;
- `--safe-mode`;
- no session persistence;
- fail-closed Claude Code sandbox settings;
- the resolved agent definition and declared Agent Skills in the composed prompt;
- structured schema when requested.

Read-only workers use plan mode plus `Read,Grep,Glob`. Write-capable workers use `dontAsk`, a fail-closed sandbox, and an `Edit(./**)` allow rule anchored to the requested working directory. Claude Code's current permission model applies `Edit(path)` rules to built-in file-editing tools.

Third-party gateway compatibility is configuration responsibility. Claude Code can be pointed at compatible gateways, but a gateway/model alias is not automatically proven compatible merely because it accepts an Anthropic-shaped endpoint. Treat a profile as usable only after that exact route has been exercised.

Browser capability for external Claude Code workers is intentionally unverified in worker-profile v1. A profile/task with `needs_browser: true` returns `BLOCKED`; route runtime UI review to a backend whose browser integration is actually verified.

## 7. Grok and Codex direct executors

The previous direct dispatcher is retained as `dispatch-direct.mjs` and remains the execution path for Grok/Codex profiles and explicit `--sdk` calls.

Its existing guarantees remain:

- explicit model and sandbox;
- read-only derivation/enforcement;
- Grok browser runtime probe when required;
- missing CLI/capability fails closed;
- agent skill resolution before work;
- reviewer schema support.

The routing wrapper does not reimplement those backend semantics.

## 8. Task packet and return budget

A fresh worker does not inherit the main conversation. Give it minimum sufficient context:

```text
ROLE / SKILL
GOAL
CANDIDATE / SHA / WORKTREE
EXACT SCOPE / ROUTE
AUTHORITY / ACCEPTANCE RULES
OWNERSHIP OR READ-ONLY BOUNDARY
REQUIRED CHECKS
CONTEXT BUDGET
OUTPUT BUDGET
ESCALATE WHEN
RETURN CONTRACT
```

For reviewer workers, prefer `verdict.schema.json`. PASS/FAIL must be evidence-bearing; BLOCKED must state what could not be verified.

Do not return raw browser/tool transcripts when compact evidence locators are enough.

## 9. Caller behavior

The main owner/resource governor decides whether offload is worthwhile. It does not choose a different provider/model by estimating prices.

When Agent Bridge returns:

```text
NATIVE
→ use the normal native subagent/context

OK
→ consume the compact worker result

BLOCKED
→ resolve the capability/config/credential blocker or escalate

BACKEND_FAILED
→ inspect the bounded failure; retry/escalate according to policy
```

Do not silently fall back from a configured external profile to a different paid provider. The mapping is user intent.

## 10. Limits

- Configured routing does not prove the third-party model is good enough; the user controls mappings and can change them.
- A successful CLI launch does not prove every later tool interaction succeeds.
- Runtime-specific hooks that are not part of the inlined Agent Skill contract do not automatically travel across runtimes.
- Destructive release/deploy/credential/database operations should stay on explicitly trusted project-approved paths.
- Keep the config user-owned; secrets remain outside YAML.
