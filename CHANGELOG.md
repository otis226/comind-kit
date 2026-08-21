# Changelog

All notable public changes to CoMind Kit are documented here.

CoMind Kit uses Semantic Versioning for tagged releases. Until the first tag is published, `main` is the latest development line.

## Unreleased

### Added

- `bounded-code-worker` as the canonical role for one clearly owned implementation/refactor slice.
- `agent-bridge` deterministic `worker-profiles.yaml` routing for external Claude Code, Grok, Codex, and configured compatible runtimes.
- External Claude Code gateway/model profiles with explicit credential binding and owner-secret isolation.
- Public validation for canonical skill structure, private-reference leaks, legacy flat paths, English-first runtime instructions, and absence of permanent specialist agent wrappers.

### Changed

- `senior-dev` is now strictly the accountable main owner for authority, architecture, integration, and final decision; it selects worker roles but never infers model economics.
- `coding-agent-handoff` is slimmed to the worker ownership/task-packet/dispatch/return protocol; `llm-resource-governor` remains the single source for fan-out, context/output budgets, escalation, and evidence reuse.
- Canonical CoMind role routing is skill-first. `worker-profiles.example.yaml` maps `bounded-code-worker`, `ui-visual-reviewer`, and `ui-runtime-reviewer` by skill name.
- Public-safe skill text is canonical instead of duplicated under a public skill overlay; only narrow private-reference sanitizers remain.
- Cross-skill references use installed skill names instead of legacy repository paths.
- Worker configuration decides runtime/model/API. Agent Bridge and orchestration do not infer price/cost tier from vendor/model names.
- Repository `.comind/worker-profiles.yaml` is not auto-loaded; worker secrets stay outside YAML through `api_key_env`/`env_from`.

### Removed

- Legacy flat `skills/<name>.md` compatibility shims.
- Generated Claude Code specialist agent wrappers from the public distribution. The Agent Skill is the canonical role and can run in a fresh native context or through Agent Bridge.
- Duplicate `tooling/shareable/public-overlay/skills/*` workflow copies.

## Versioning policy

- **MAJOR** — breaking skill names, output contracts, or materially incompatible workflow semantics.
- **MINOR** — new skills or backward-compatible capabilities.
- **PATCH** — clarifications, safety fixes, documentation fixes, and backward-compatible workflow corrections.

For reproducible automation, pin a tagged release or commit once tags are available instead of implicitly tracking `main`.
