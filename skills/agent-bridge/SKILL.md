---
name: agent-bridge
description: >-
  Execute an Agent Skill or explicit agent definition on an explicitly selected external coding runtime/model. Preserve the role contract, enforce runtime boundaries, and return the worker result without owning delegation policy or provider economics.
---

<!-- comind-managed-skill: agent-bridge -->

# Agent Bridge

Agent Bridge is an optional execution adapter, not an orchestrator or routing registry.

```text
main owner / llm-resource-governor
= decide WHEN external execution is useful

coding-agent-handoff
= define WHAT the role owns/receives/returns

Agent Skill / explicit agent
= define WHICH role/behavior executes

agent-bridge
= execute HOW the explicitly selected external runtime/model runs
```

Native execution is the default. Agent Bridge is used only when the caller deliberately selects an external runtime.

## 1. No persistent worker routing layer

CoMind does not maintain a role-to-provider profile file.

The caller chooses external execution explicitly with:

- `--sdk`: external runtime/backend;
- `--model`: explicit model ID/alias;
- optional execution controls such as `--effort`, `--readonly`, `--max-turns`, and `--needs-browser`.

If `--sdk` is omitted, Agent Bridge returns `NATIVE` so the caller can use the runtime's normal native specialist/subagent/context.

Do not infer a provider/model from the role name. Do not silently substitute another provider/model after a route is blocked or fails.

## 2. Skill-first roles

Canonical CoMind roles are Agent Skills:

```bash
node <skill-dir>/dispatch.mjs \
  --skill bounded-code-worker \
  --sdk codex \
  --model gpt-5.6-sol \
  --scope-file /tmp/task.md \
  --cwd /path/to/repo
```

Explicit project/user agent definitions are also supported:

```bash
node <skill-dir>/dispatch.mjs \
  --agent my-project-reviewer \
  --sdk grok \
  --model grok-4.6 \
  --scope-file /tmp/task.md \
  --cwd /path/to/repo
```

Agent definitions may compose skills and project-specific instructions. They are role contracts, not a place to hide global runtime routing or literal secrets.

## 3. Claude Code external worker binding

An external `claude-code` run launches a separate non-interactive Claude Code process.

Because this path is intentionally separate from the main owner's native Claude context, the bridge does not inherit ambient owner Claude credentials. Bind the worker credential explicitly by environment-variable name:

```bash
node <skill-dir>/dispatch.mjs \
  --skill ui-visual-reviewer \
  --sdk claude-code \
  --model <model-id> \
  --api-key-env UI_REVIEW_TOKEN \
  --base-url https://gateway.example.com \
  --readonly yes \
  --scope-file /tmp/review.md
```

`--api-key-env` names an existing environment variable; it never accepts the secret itself. `--api-key-mode` may be `auth-token` (default) or `api-key`.

Do not place literal secrets in Agent Skills, agent definitions, task packets, repository files, or CLI arguments.

External Claude Code browser capability remains fail-closed until verified.

## 4. Runtime enforcement

### Claude Code external worker

- requires explicit `--model` and explicit credential binding;
- clears ambient owner Claude routing/auth/model variables before injecting the selected worker binding;
- uses a fail-closed sandbox and bounded tool surface;
- denies common credential paths and project `.env` files;
- keeps browser-required work BLOCKED until capability is verified.

### Grok / Codex

The direct executor keeps explicit model/sandbox behavior. Grok browser-required tasks run only after the runtime browser probe succeeds. Missing CLI/capability fails closed.

Third-party gateway/model compatibility is execution responsibility. An Anthropic-compatible request shape does not itself prove reliable Claude Code tool behavior.

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

Do not pass worker-controlled model/schema arguments through `cmd.exe`. Structured JSON loses quoting through ordinary `shell: true` batch execution and shell metacharacters create an avoidable injection surface.

Child processes use `windowsHide: true` as headless-process hygiene. Do not treat that option as proof of the root cause or fix for terminal redraw/flicker; terminal escape sequences can come from runtime hooks or wrappers outside Agent Bridge and must be diagnosed separately.

## 5. Result contract

```text
NATIVE
→ caller uses the runtime's normal native isolated role/context

OK
→ selected external worker completed and returned a result

BLOCKED
→ required credential/capability/runtime is unavailable

BACKEND_FAILED
→ the bounded backend invocation failed
```

Agent Bridge must not silently substitute another provider/model.

## 6. Trust boundary

- Role/workflow authority comes from the Agent Skill or explicit agent definition.
- External runtime/model selection stays visible at the dispatch boundary.
- Secrets stay in environment variables and are bound by name, never embedded literally.
- Repository-controlled files do not auto-select external providers.
- Destructive release/deploy/credential/database operations require an explicitly trusted project-approved path.

Agent Bridge executes a selected route; it does not decide task authority, architecture, worker economics, or product acceptance.
