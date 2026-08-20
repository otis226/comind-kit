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
- `agent-bridge` for running an existing agent definition or workflow skill on a non-native coding CLI, choosing backend and model per call, deriving the capability boundary from the definition, passing sandbox and model explicitly instead of inheriting ambient configuration, and blocking a run whose required evidence capability the backend cannot provide.

### Changed

- Public reusable instructions are English-first.
- Cross-skill references use installed skill names rather than legacy repository paths such as `skills/<name>.md`.
- Public skill package entrypoints no longer depend on private CoMind routing or legacy migration notes.
- GitHub Actions dependencies are pinned to exact commit SHAs while retaining the documented v4 compatibility line.
- Independent UI review preflights reviewer-owned browser capability, reports exact MCP/tool permission blockers, and requires blocked visual/runtime reviews to be rerun after permission is granted instead of reusing the implementer or parent session's pass.
- `senior-dev` and coding handoff now default to single-owner FAST work, bounded STANDARD fan-out, compact task packets, review routing by actual change type, and reuse of still-valid evidence.
- `llm-resource-governor` now treats premium-model quota as a first-class budget: premium owners keep authority/architecture/integration reasoning while bounded source inspection, code review, implementation, UI review, and evidence work route to the cheapest capable prepaid/subscription or low-cost runtime. Worker packets now carry explicit context budgets, output budgets, escalation conditions, and compact return contracts.
- `coding-agent-handoff` now applies that cost-aware offload policy whenever runtime/model choice is available, while keeping `agent-bridge` limited to execution transport and capability enforcement.

## Versioning policy

- **MAJOR** — breaking skill names, agent names, output contracts, or materially incompatible workflow semantics.
- **MINOR** — new skills/agents or backward-compatible capabilities.
- **PATCH** — clarifications, safety fixes, documentation fixes, and backward-compatible workflow corrections.

For reproducible automation, pin a tagged release or commit once tags are available instead of implicitly tracking `main`.
