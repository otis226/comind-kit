# CoMind Kit

A shareable package of reusable engineering, product UI, review, and delivery workflows.

This repository contains only portable skills and runtime adapters. It does not require access to private project knowledge, project packs, decisions, or a private CoMind repository.

## Option 1 — Install Agent Skills across runtimes

Claude Code + Cursor:

```bash
npx -y skills@1.5.22 add otis226/comind-kit --global --skill '*' --agent claude-code --agent cursor --yes
```

Claude Code + Cursor + Codex:

```bash
npx -y skills@1.5.22 add otis226/comind-kit --global --skill '*' --agent claude-code --agent cursor --agent codex --yes
```

This installs the portable Agent Skills for the selected runtimes.

## Option 2 — Claude Code plugin with specialist agents

For Claude Code, the repository is also a plugin marketplace. Run these commands **inside Claude Code**:

```text
/plugin marketplace add otis226/comind-kit
/plugin install comind-kit@otis-tools
```

The plugin loads the same skills plus specialist subagents:

- `senior-dev`
- `ui-design-architect`
- `ui-visual-reviewer`
- `ui-runtime-reviewer`
- `product-ui-critic`

Plugin skills are namespaced by Claude Code under the plugin name. The custom agents appear through Claude Code's agent system.

The plugin intentionally omits a fixed semantic version so Git-hosted updates can resolve by commit instead of remaining pinned to a stale `0.1.0`.

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
