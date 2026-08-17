# CoMind Kit

A shareable package of reusable engineering, product UI, review, and delivery workflows.

This repository contains only portable skills and runtime adapters. It does not require access to private project knowledge, project packs, decisions, or a private CoMind repository.

## Install Agent Skills

Claude Code + Cursor:

```bash
npx -y skills@1.5.22 add otis226/comind-kit --global --skill '*' --agent claude-code --agent cursor --yes
```

Claude Code + Cursor + Codex:

```bash
npx -y skills@1.5.22 add otis226/comind-kit --global --skill '*' --agent claude-code --agent cursor --agent codex --yes
```

If this repository is private, authenticate Git/GitHub on the machine first.

## Claude Code: install skills + specialist agents as a plugin

Add the marketplace:

```bash
claude plugin marketplace add otis226/comind-kit
```

Install the plugin:

```bash
claude plugin install comind-kit@otis-tools
```

The plugin adds the same canonical skills plus Claude Code specialist agents such as `senior-dev`, `ui-design-architect`, `ui-visual-reviewer`, `ui-runtime-reviewer`, and `product-ui-critic`.

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
