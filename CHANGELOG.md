# Changelog

All notable public changes to CoMind Kit are documented here.

CoMind Kit uses Semantic Versioning for tagged releases. Until the first tag is published, `main` is the latest development line and may still receive workflow-contract refinements.

## Unreleased

### Added

- MIT license for public reuse.
- Public contribution and security guidance.
- Repository instructions for AI maintainers through `AGENTS.md` and `CLAUDE.md`.
- Public self-validation for skill package structure, plugin metadata, private-reference leaks, legacy skill paths, and language consistency.

### Changed

- Public reusable instructions are English-first.
- Cross-skill references use installed skill names rather than legacy repository paths such as `skills/<name>.md`.
- Public skill package entrypoints no longer depend on private CoMind routing or legacy migration notes.

## Versioning policy

- **MAJOR** — breaking skill names, agent names, output contracts, or materially incompatible workflow semantics.
- **MINOR** — new skills/agents or backward-compatible capabilities.
- **PATCH** — clarifications, safety fixes, documentation fixes, and backward-compatible workflow corrections.

For reproducible automation, pin a tagged release or commit once tags are available instead of implicitly tracking `main`.
