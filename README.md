# CoMind Kit

Reusable Agent Skills for engineering delivery, UI design/review, verification, shipping, and optional explicit external-worker execution.

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

Agent Skill / explicit agent
= WHICH role/behavior executes

agent-bridge
= HOW an explicitly selected external runtime/model executes the role

bounded-code-worker
= bounded implementation execution
```

Do not use `senior-dev` as a bounded coding worker. Keep the main owner as the owner; use `bounded-code-worker` for implementation slices.

Native execution is the default. CoMind Kit does not maintain persistent role-to-provider mappings.

## Main skills

### Delivery and worker execution

| Skill | Use it when |
|---|---|
| `senior-dev` | Non-trivial feature/refactor/bug fix needs one accountable owner |
| `llm-resource-governor` | Delegation may save context/quota or isolate evidence work |
| `coding-agent-handoff` | A worker needs explicit ownership, packet, dispatch, and return contract |
| `bounded-code-worker` | One clear implementation/refactor slice should be delegated |
| `agent-bridge` | A role should deliberately run on an explicitly selected external runtime/model |
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

## Explicit external workers

Use the native runtime/context unless there is a concrete reason to execute the role elsewhere.

When external execution is useful, choose runtime/model at dispatch time:

```bash
node skills/agent-bridge/dispatch.mjs \
  --skill bounded-code-worker \
  --sdk codex \
  --model gpt-5.6-sol \
  --scope-file /tmp/task.md \
  --cwd /path/to/repo
```

For an external Claude Code route, bind the worker credential by environment-variable name rather than embedding a secret:

```bash
node skills/agent-bridge/dispatch.mjs \
  --skill ui-visual-reviewer \
  --sdk claude-code \
  --model <model-id> \
  --api-key-env UI_REVIEW_TOKEN \
  --base-url https://gateway.example.com \
  --readonly yes \
  --scope-file /tmp/review.md
```

The orchestrator chooses the role. External runtime/model selection is explicit. Agent Bridge does not guess model cost or silently substitute another provider.

## Runtime notes

- Claude Code external workers run as separate non-interactive processes with explicit model/credential binding and sandboxing.
- External Claude Code browser capability is fail-closed until verified; use a verified runtime for live browser review.
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
- Agent Skills/agent definitions own role behavior; repositories do not auto-select external providers.
- Secrets remain outside skills, agent definitions, task packets, repository files, and CLI literals.
- AI review does not replace required product/user acceptance.

## Validation

```bash
node scripts/validate-public.mjs
```

See `CHANGELOG.md`, `CONTRIBUTING.md`, and `SECURITY.md` for maintenance and compatibility guidance.

MIT — see `LICENSE`.
