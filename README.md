# CoMind Kit

A shareable package of reusable engineering, product UI, review, and delivery workflows.

This repository contains only portable skills and runtime adapters. It does not require access to private project knowledge, project packs, decisions, or a private CoMind repository.

## Install

Use the normal `skills` CLI flow:

```bash
npx -y skills@1.5.22 add otis226/comind-kit
```

This intentionally keeps the CLI defaults for scope, skill selection, target agents, and installation method instead of forcing Claude Code, Cursor, Codex, global scope, or every skill.

## Optional targeting

Use these only when you specifically want to target a runtime or skip the normal choices.

Claude Code only:

```bash
npx -y skills@1.5.22 add otis226/comind-kit --agent claude-code
```

Cursor only:

```bash
npx -y skills@1.5.22 add otis226/comind-kit --agent cursor
```

Claude Code + Cursor, all skills, global install:

```bash
npx -y skills@1.5.22 add otis226/comind-kit --global --skill '*' --agent claude-code --agent cursor --yes
```

Claude Code + Cursor + Codex, all skills, global install:

```bash
npx -y skills@1.5.22 add otis226/comind-kit --global --skill '*' --agent claude-code --agent cursor --agent codex --yes
```

## Optional Claude Code plugin

If you use Claude Code and also want the specialist subagents, this repository can be installed as a plugin marketplace. Run inside Claude Code:

```text
/plugin marketplace add otis226/comind-kit
/plugin install comind-kit@otis-tools
```

The plugin loads the same skills plus specialist subagents: `senior-dev`, `ui-design-architect`, `ui-visual-reviewer`, `ui-runtime-reviewer`, and `product-ui-critic`.

Plugin skills are namespaced by Claude Code under the plugin name. The custom agents appear through Claude Code's agent system.

The plugin intentionally omits a fixed semantic version so Git-hosted updates can resolve by commit instead of remaining pinned to a stale version string.

## Included skills

- `coding-agent-handoff`
- `design-parity`
- `evidence-transport`
- `pixel-parity-calibration`
- `product-ui-critique`
- `runtime-regression`
- `ui-design-authority`
- `ui-review`
- `senior-dev`
- `finalize-workstream`
- `ui-design-architect`
- `ui-runtime-reviewer`
- `ui-visual-reviewer`

## Boundary

Project-specific business rules, design decisions, private references, historical reviews, and repository routing are intentionally not part of this package. Each agent must resolve project-specific truth from the repository it is currently working in.
