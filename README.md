# CoMind Kit

Reusable Agent Skills for engineering delivery, UI design/review, verification, and shipping.

CoMind Kit is project-neutral: project truth comes from the repository where the skills are used.

## Install

```bash
npx -y skills@1.5.22 add otis226/comind-kit
```

The canonical unit is an Agent Skill. CoMind Kit does not ship permanent specialist agent wrappers or cross-runtime execution adapters.

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

current runtime
= HOW the role executes through native context/subagent/tooling

bounded-code-worker
= bounded implementation execution
```

Do not use `senior-dev` as a bounded coding worker. Keep the main owner as the owner; use `bounded-code-worker` for implementation slices.

## Main skills

### Delivery and worker execution

| Skill | Use it when |
|---|---|
| `senior-dev` | Non-trivial feature/refactor/bug fix needs one accountable owner |
| `llm-resource-governor` | Delegation may save context/quota or isolate evidence work |
| `coding-agent-handoff` | A worker needs explicit ownership, packet, native dispatch, and return contract |
| `bounded-code-worker` | One clear implementation/refactor slice should be delegated |
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

## Runtime-native execution

Install the same skills into whichever supported runtime you want to use, then execute roles with that runtime's native context/subagent/tooling.

Claude Code only:

```bash
npx -y skills@1.5.22 add otis226/comind-kit --agent claude-code
```

Claude Code + Cursor + Codex + Grok Build:

```bash
npx -y skills@1.5.22 add otis226/comind-kit --global --skill '*' --agent claude-code --agent cursor --agent codex --agent grok --yes
```

If you want a task handled in another runtime, start that runtime directly and invoke the same Agent Skill/task packet there. CoMind Kit does not spawn external CLIs, proxy credentials, select models, or maintain provider routing.

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
- Agent Skills/agent definitions own role behavior; execution is native to the runtime in which they are installed.
- Secrets remain outside skills, agent definitions, task packets, and repository files.
- AI review does not replace required product/user acceptance.

## Validation

```bash
node scripts/validate-public.mjs
```

See `CHANGELOG.md`, `CONTRIBUTING.md`, and `SECURITY.md` for maintenance and compatibility guidance.

MIT — see `LICENSE`.
