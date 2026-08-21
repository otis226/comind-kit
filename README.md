# CoMind Kit

Reusable Agent Skills for engineering delivery, UI design/review, verification, shipping, and deterministic external-worker execution.

CoMind Kit is project-neutral: project truth comes from the repository where the skills are used.

## Install

```bash
npx -y skills@1.5.22 add otis226/comind-kit
```

The canonical unit is an Agent Skill. CoMind Kit does not ship permanent specialist agent wrappers.

## Core architecture

```text
senior-dev
= main owner / architecture / integration

llm-resource-governor
= WHEN delegation is worthwhile

coding-agent-handoff
= WHAT the worker owns/receives/returns

worker-profiles.yaml
= WHICH runtime/model/API executes the role

agent-bridge
= HOW the configured external worker executes

bounded-code-worker
= bounded implementation execution
```

Do not map `senior-dev` to a cheap/external coding worker. Keep the main owner as the owner; map `bounded-code-worker` for implementation slices.

## Main skills

### Delivery and worker execution

| Skill | Use it when |
|---|---|
| `senior-dev` | Non-trivial feature/refactor/bug fix needs one accountable owner |
| `llm-resource-governor` | Delegation may save context/quota or isolate evidence work |
| `coding-agent-handoff` | A worker needs explicit ownership, packet, dispatch, and return contract |
| `bounded-code-worker` | One clear implementation/refactor slice should be delegated |
| `agent-bridge` | A configured role should run on an external runtime/model/API |
| `finalize-workstream` | An accepted candidate is ready for authorized merge/finalization |

### Product UI

| Skill | Use it when |
|---|---|
| `ui-design-authority` | Resolve reference/system/product-derived/greenfield design authority |
| `ui-design-architect` | A fresh read-only design-authority pass is useful |
| `product-ui-critique` | Diagnose an existing screen conservatively |
| `ui-review` | Choose review mode and prioritize actionable gaps |
| `ui-visual-reviewer` | Independent rendered visual verdict |
| `ui-runtime-reviewer` | Independent interaction/runtime verdict |

### Verification

| Skill | Use it when |
|---|---|
| `design-parity` | Exact reference is an acceptance target |
| `pixel-parity-calibration` | Residual pixel mismatch needs classification/calibration |
| `runtime-regression` | Candidate changed after prior runtime evidence |
| `evidence-transport` | Verification artifacts must be reviewer-accessible |

## Optional deterministic external workers

Create:

```text
~/.config/comind/worker-profiles.yaml
```

Start from `skills/agent-bridge/worker-profiles.example.yaml`.

Example:

```yaml
version: 1

profiles:
  ui-cheap:
    runtime: claude-code
    model: your-third-party-model-id
    base_url: https://gateway.example.com
    api_key_env: UI_REVIEW_TOKEN
    readonly: true

  runtime-review:
    runtime: grok
    model: grok-4.6
    readonly: true
    needs_browser: true

  coding:
    runtime: codex
    model: gpt-5.6-sol
    readonly: false

skills:
  ui-visual-reviewer: ui-cheap
  ui-runtime-reviewer: runtime-review
  bounded-code-worker: coding
```

Keep real secrets out of YAML. `api_key_env` and `env_from` reference environment variables.

The orchestrator chooses the role. Configuration chooses runtime/model/API. Agent Bridge does not guess model cost.

## Routing precedence

```text
explicit --sdk
→ direct debug/compatibility backend

explicit --profile
→ configured profile

agents.<agent>
→ project/user agent profile

skills.<skill>
→ canonical skill profile

no mapping
→ NATIVE
```

Prefer `skills:` mappings for canonical CoMind roles. `agents:` is available for explicit project/user agent definitions.

## Runtime notes

- Claude Code external workers run as separate non-interactive processes with explicit gateway/model/credential binding and sandboxing.
- External Claude Code browser capability is fail-closed until verified; route live browser review to a verified runtime.
- Grok browser-required runs probe the configured browser integration before work.
- Codex/Grok direct executors preserve explicit model/sandbox behavior.
- A third-party compatible endpoint does not automatically prove every model supports Claude Code tools correctly; smoke-test the exact route.

## Native runtime targeting

Claude Code only:

```bash
npx -y skills@1.5.22 add otis226/comind-kit --agent claude-code
```

Claude Code + Cursor + Codex:

```bash
npx -y skills@1.5.22 add otis226/comind-kit --global --skill '*' --agent claude-code --agent cursor --agent codex --yes
```

## Optional Claude Code plugin install

The plugin is another distribution path for the same canonical skills; it does not add separate specialist workflows.

```text
/plugin marketplace add otis226/comind-kit
/plugin install comind-kit@otis-tools
```

## Repository structure

```text
comind-kit/
├── README.md
├── AGENTS.md
├── CLAUDE.md
├── skills/                 # canonical reusable Agent Skills
├── scripts/                # public validation
└── .claude-plugin/         # plugin/marketplace metadata
```

## Trust model

- Business rules, design decisions, API contracts, permissions, and release policy come from the active project.
- Worker configuration is user-owned; repositories do not auto-control external routing.
- Secrets remain outside worker-profile YAML.
- AI review does not replace required product/user acceptance.

## Validation

```bash
node scripts/validate-public.mjs
```

See `CHANGELOG.md`, `CONTRIBUTING.md`, and `SECURITY.md` for maintenance and compatibility guidance.

MIT — see `LICENSE`.

