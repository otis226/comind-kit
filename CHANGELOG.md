# Changelog

All notable public changes to CoMind Kit are documented here.

CoMind Kit uses Semantic Versioning for tagged releases. Until the first tag is published, `main` is the latest development line.

## Unreleased

### Added

- `bounded-code-worker` as the canonical role for one clearly owned implementation/refactor slice.
- `agent-bridge` explicit external execution for Agent Skills and project/user agent definitions across supported runtimes.
- External Claude Code credential isolation with explicit environment-variable binding and fail-closed sandboxing.
- Public validation for canonical skill structure, private-reference leaks, legacy flat paths, English-first runtime instructions, and absence of permanent specialist agent wrappers.

### Changed

- `senior-dev` is strictly the accountable main owner for authority, architecture, integration, and final decision; bounded implementation uses `bounded-code-worker` or another explicit bounded role.
- `coding-agent-handoff` owns worker ownership/task-packet/dispatch/return protocol; `llm-resource-governor` remains the single source for fan-out, context/output budgets, escalation, and evidence reuse.
- Canonical execution is Agent/Skill-first and native-first. External runtime/model selection is visible only when explicitly requested at the Agent Bridge dispatch boundary.
- Public-safe skill text is canonical instead of duplicated under a public skill overlay; only narrow private-reference sanitizers remain.
- Cross-skill references use installed skill names instead of legacy repository paths.
- Agent Bridge and orchestration do not infer price/cost tier from vendor/model names and do not silently substitute another provider after a blocked or failed explicit route.

### Removed

- Persistent role-to-provider worker profile routing, the example YAML, and `--worker-config` / `--profile` routing semantics.
- Legacy flat `skills/<name>.md` compatibility shims.
- Generated Claude Code specialist agent wrappers from the public distribution. The Agent Skill is the canonical role and can run in a fresh native context or through explicit Agent Bridge execution.
- Duplicate `tooling/shareable/public-overlay/skills/*` workflow copies.

## Versioning policy

- **MAJOR** — breaking skill names, output contracts, or materially incompatible workflow semantics.
- **MINOR** — new skills or backward-compatible capabilities.
- **PATCH** — clarifications, safety fixes, documentation fixes, and backward-compatible workflow corrections.

For reproducible automation, pin a tagged release or commit once tags are available instead of implicitly tracking `main`.
