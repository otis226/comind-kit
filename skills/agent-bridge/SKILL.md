---
name: agent-bridge
description: >-
  Execute a configured bounded worker on an external coding runtime. Resolve deterministic user-owned worker profiles, enforce the runtime boundary, and return the worker result without choosing roles or inferring model economics.
---

<!-- comind-managed-skill: agent-bridge -->

# Agent Bridge

Agent Bridge is an execution adapter, not an orchestrator.

```text
main owner / llm-resource-governor
= decide WHEN and WHICH ROLE is needed

coding-agent-handoff
= define WHAT the role owns/receives/returns

worker-profiles.yaml
= decide WHICH runtime/model/endpoint/credential runs the role

agent-bridge
= execute HOW that configured route runs
```

## 1. Worker configuration

Default location:

```text
$XDG_CONFIG_HOME/comind/worker-profiles.yaml
```

or:

```text
~/.config/comind/worker-profiles.yaml
```

Override with `AGENT_BRIDGE_WORKER_CONFIG` or `--worker-config`.

Repository `.comind/worker-profiles.yaml` is intentionally not auto-loaded. An untrusted repository must not be able to redirect its own source/evidence to an arbitrary external endpoint.

Start from `worker-profiles.example.yaml`.

## 2. Skill-first role mapping

Canonical CoMind roles are Agent Skills, so prefer `skills:` mappings:

```yaml
skills:
  ui-visual-reviewer: ui-review-profile
  ui-runtime-reviewer: runtime-review-profile
  bounded-code-worker: implementation-profile
```

`agents:` remains supported for explicit project/user agent definitions resolved from normal project/user agent locations. CoMind does not require permanent runtime-specific agent wrappers.

## 3. Profile fields

Common fields:

- `runtime`: `claude-code`, `grok`, `codex`, or another enabled direct backend;
- `model`: explicit model ID/alias;
- `effort`: optional runtime reasoning effort;
- `readonly`: `true`, `false`, or auto-compatible value;
- `max_turns`: bounded turn count;
- `needs_browser`: require a verified browser-capable executor;
- `base_url`: non-secret Claude Code gateway endpoint;
- `api_key_env`: environment variable that contains the worker credential;
- `api_key_mode`: `auth-token` or `api-key` for Claude Code gateways;
- `env`: additional non-secret environment values;
- `env_from`: target environment variable -> source secret environment variable.

Never store a literal API key in YAML. Secret-like literal `env` entries are rejected; use `api_key_env` or `env_from`.

## 4. Routing precedence

```text
explicit --sdk
→ direct compatibility/debug backend; bypass profile routing

explicit --profile
→ selected profile

agents.<agent>
→ mapped profile

skills.<skill>
→ mapped profile

no mapping
→ NATIVE
```

Explicit `--model`, `--effort`, `--readonly`, or `--max-turns` overrides are for deliberate one-off tests/debugging, not hidden orchestration policy.

## 5. Invocation

Canonical skill role:

```bash
node <skill-dir>/dispatch.mjs \
  --skill bounded-code-worker \
  --scope-file /tmp/task.md \
  --cwd /path/to/repo
```

Visual reviewer with schema:

```bash
node <skill-dir>/dispatch.mjs \
  --skill ui-visual-reviewer \
  --scope-file /tmp/task.md \
  --cwd /path/to/repo \
  --schema <skill-dir>/verdict.schema.json
```

Explicit project/user agent definition:

```bash
node <skill-dir>/dispatch.mjs \
  --agent my-project-reviewer \
  --scope-file /tmp/task.md \
  --cwd /path/to/repo
```

## 6. Runtime enforcement

### Claude Code external worker

A `runtime: claude-code` profile launches a separate non-interactive Claude Code process using the configured gateway/model.

The bridge clears ambient owner Claude routing/auth/model variables before injecting the profile route. A Claude Code profile must declare an explicit worker credential binding; owner/saved credentials are not a fallback.

Read-only workers use read-only tools and plan mode. Write-capable workers remain fail-closed sandboxed with a bounded tool surface. Common credential paths and project `.env` files are denied.

External Claude Code browser capability is unverified in worker-profile v1; `needs_browser: true` fails closed.

### Grok / Codex

The direct executor keeps explicit model/sandbox behavior. Grok browser-required tasks run only after the configured browser runtime probe succeeds. Missing CLI/capability fails closed.

Third-party gateway/model compatibility is configuration responsibility. A route accepting an Anthropic-shaped request does not by itself prove reliable Claude Code tool behavior.

### Windows launcher safety

Windows launcher behavior is resolved from the actual PATH entry, not inferred from backend name.

```text
native .exe/.com
→ direct spawn

recognized npm .cmd/.bat shim
→ resolve its real node/native entrypoint
→ direct spawn without cmd.exe

unknown batch shim
→ BLOCKED
```

Do not pass worker-controlled model/schema/profile arguments through `cmd.exe`. Structured JSON loses quoting through ordinary `shell: true` batch execution and shell metacharacters create an avoidable injection surface.

Child processes use `windowsHide: true` as headless-process hygiene. Do not treat that option as proof of the root cause or fix for terminal redraw/flicker; terminal escape sequences can come from runtime hooks or wrappers outside Agent Bridge and must be diagnosed separately.

## 7. Result contract

```text
NATIVE
→ caller uses the runtime's normal native isolated role

OK
→ configured worker completed and returned a result

BLOCKED
→ required config/credential/capability is unavailable

BACKEND_FAILED
→ the bounded backend invocation failed
```

The bridge must not silently substitute another provider/model for a configured route.

## 8. Trust boundary

- Worker config is user-owned.
- Secrets stay outside YAML.
- Repository-controlled config is not auto-loaded.
- Explicit model and sandbox boundaries stay visible.
- Destructive release/deploy/credential/database operations require an explicitly trusted project-approved path.

Agent Bridge executes the selected route; it does not decide task authority, architecture, worker economics, or product acceptance.
