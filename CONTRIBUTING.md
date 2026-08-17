# Contributing

Thanks for improving CoMind Kit.

## Principles

Contributions should keep the toolkit:

- project-neutral and portable;
- English-first for reusable skill and agent instructions;
- explicit about evidence, authority, uncertainty, and verification;
- free of secrets, private project knowledge, private repository paths, and machine-specific assumptions;
- compatible with the Agent Skills package model.

## Skill structure

Each skill lives under:

```text
skills/<name>/
├── SKILL.md
└── INSTRUCTIONS.md   # optional
```

`SKILL.md` is the runtime entrypoint. If a longer workflow is needed, keep it in `INSTRUCTIONS.md` and have `SKILL.md` load it.

Reference sibling capabilities by **skill name**, for example `design-parity` or `runtime-regression`. Do not introduce legacy flat references such as `skills/design-parity.md`.

## Agent structure

Claude Code specialist agents live under `agents/` and should remain thin adapters over canonical skills. Do not duplicate the full workflow into an agent definition.

## Pull requests

Keep each PR focused. Include:

- the problem being solved;
- affected skills/agents;
- behavior or output-contract changes;
- verification performed;
- any compatibility impact.

If the change affects public behavior, update `README.md` and `CHANGELOG.md` when appropriate.

## Validation

Run:

```bash
node scripts/validate-public.mjs
```

The same validation runs in GitHub Actions.

## Breaking changes

Treat renaming/removing a skill or agent, changing a documented verdict/output contract, or materially changing orchestration semantics as a breaking public API decision. Prefer deprecation/migration guidance when practical.
