# Changelog

All notable public changes to CoMind Kit are documented here.

CoMind Kit uses Semantic Versioning for tagged releases. Until the first tag is published, `main` is the latest development line and may still receive workflow-contract refinements.

## Unreleased

### Added

- MIT license for public reuse.
- Public contribution and security guidance.
- Repository instructions for AI maintainers through `AGENTS.md` and `CLAUDE.md`.
- Public self-validation for skill package structure, plugin metadata, private-reference leaks, legacy skill paths, and language consistency.
- Real installation smoke test using pinned `skills@1.5.22` against the current checkout.
- Public issue templates for bugs, skill proposals, and documentation problems, with security reports routed to the security policy.
- Tag-driven GitHub Release workflow for future SemVer releases.
- `llm-resource-governor` for resource-aware agent orchestration: earned fan-out, minimum sufficient specialist context, explicit cheaper-capable specialist model selection, short-lived browser reviewers, evidence reuse, and concurrency discipline.

### Changed

- Public reusable instructions are English-first.
- Cross-skill references use installed skill names rather than legacy repository paths such as `skills/<name>.md`.
- Public skill package entrypoints no longer depend on private CoMind routing or legacy migration notes.
- GitHub Actions dependencies are pinned to exact commit SHAs while retaining the documented v4 compatibility line.
- Independent UI review preflights reviewer-owned browser capability, reports exact MCP/tool permission blockers, and requires blocked visual/runtime reviews to be rerun after permission is granted instead of reusing the implementer or parent session's pass.
- `senior-dev` and coding handoff now default to single-owner FAST work, bounded STANDARD fan-out, compact task packets, review routing by actual change type, and reuse of still-valid evidence.

## Versioning policy

- **MAJOR** — breaking skill names, agent names, output contracts, or materially incompatible workflow semantics.
- **MINOR** — new skills/agents or backward-compatible capabilities.
- **PATCH** — clarifications, safety fixes, documentation fixes, and backward-compatible workflow corrections.

For reproducible automation, pin a tagged release or commit once tags are available instead of implicitly tracking `main`.
