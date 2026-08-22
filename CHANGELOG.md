# Changelog

All notable public changes to CoMind Kit are documented here.

CoMind Kit uses Semantic Versioning for tagged releases. Until the first tag is published, `main` is the latest development line.

## Unreleased

### Added

- `bounded-code-worker` as the canonical role for one clearly owned implementation/refactor slice.
- Public validation for canonical skill structure, private-reference leaks, legacy flat paths, English-first runtime instructions, absence of permanent specialist agent wrappers, and absence of cross-runtime bridge regressions.

### Changed

- `senior-dev` is strictly the accountable main owner for authority, architecture, integration, and final decision; bounded implementation uses `bounded-code-worker` or another explicit bounded role.
- `coding-agent-handoff` owns worker ownership/task-packet/native-dispatch/return protocol; `llm-resource-governor` remains the single source for fan-out, context/output budgets, escalation, and evidence reuse.
- Canonical execution is Agent/Skill-first and runtime-native. The runtime in which a skill is installed owns context/subagent/tool execution.
- Public-safe skill text is canonical instead of duplicated under a public skill overlay; only narrow private-reference sanitizers remain.
- Cross-skill references use installed skill names instead of legacy repository paths.

### Removed

- `agent-bridge` and its external CLI dispatch, credential-proxy, process-launch, model-routing, sandbox-adapter code and tests. To use another runtime, install/sync the same skills there and invoke them from that runtime directly.
- Persistent role-to-provider worker profile routing, the example YAML, and `--worker-config` / `--profile` routing semantics.
- Legacy flat `skills/<name>.md` compatibility shims.
- Generated Claude Code specialist agent wrappers from the public distribution. The Agent Skill is the canonical role and runs in a fresh native context/subagent when isolation is needed.
- Duplicate `tooling/shareable/public-overlay/skills/*` workflow copies.

## Versioning policy

- **MAJOR** — breaking skill names, output contracts, or materially incompatible workflow semantics.
- **MINOR** — new skills or backward-compatible capabilities.
- **PATCH** — clarifications, safety fixes, documentation fixes, and backward-compatible workflow corrections.

For reproducible automation, pin a tagged release or commit once tags are available instead of implicitly tracking `main`.
