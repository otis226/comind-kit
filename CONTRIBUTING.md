# Contributing

Thanks for improving CoMind Kit.

## Principles

Contributions should keep the toolkit:

- project-neutral and portable;
- English-first for reusable runtime instructions;
- explicit about evidence, authority, uncertainty, and verification;
- free of secrets, private project knowledge, private repository paths, and machine-specific assumptions;
- compatible with the Agent Skills package model;
- free of duplicate runtime-specific workflow sources.

## Skill structure

Each skill lives under:

```text
skills/<name>/
├── SKILL.md
└── INSTRUCTIONS.md   # optional
```

`SKILL.md` is the runtime entrypoint. A longer `INSTRUCTIONS.md` remains part of the same canonical package.

Reference sibling capabilities by installed skill name such as `design-parity` or `runtime-regression`. Do not introduce legacy flat references.

The skill is the reusable role. Do not add permanent Claude/Cursor/Grok-specific specialist agent wrappers. Use a fresh native context by default. When external execution is genuinely useful, use `agent-bridge` with an explicitly selected runtime/model instead of adding a persistent role-to-provider mapping layer.

Project/user agent definitions may compose skills with project-specific instructions, but they are role contracts rather than provider-routing configuration.

## Pull requests

Keep each PR focused. Include the problem, affected skills, behavior/output-contract changes, verification, and compatibility impact.

If public behavior changes, update `README.md` and `CHANGELOG.md`.

## Validation

```bash
node scripts/validate-public.mjs
```

GitHub Actions also performs an installation smoke test with the pinned Agent Skills CLI.

## Breaking changes

Treat renaming/removing a skill, changing a documented verdict/output contract, or materially changing orchestration semantics as a breaking public API decision. Prefer explicit migration guidance when practical.
