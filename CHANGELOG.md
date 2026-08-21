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
- `llm-resource-governor` for resource-aware agent orchestration: earned fan-out, minimum sufficient specialist context, short-lived reviewers, evidence reuse, and concurrency discipline.
- `agent-bridge` for replaying bounded agent/skill contracts on external coding runtimes with explicit capability boundaries.
- Deterministic `worker-profiles.yaml` routing for mapping agents/skills to runtime, model, endpoint, and credential source without model-price inference.
- External `claude-code` worker profiles for running a separate Claude Code process against an explicitly configured gateway/model while isolating the main owner's Claude route/auth variables.
- `worker-profiles.example.yaml` showing Claude Code gateway, Grok browser-review, and Codex implementation profiles.

### Changed

- Public reusable instructions are English-first.
- Cross-skill references use installed skill names rather than legacy repository paths such as `skills/<name>.md`.
- Public skill package entrypoints no longer depend on private CoMind routing or legacy migration notes.
- GitHub Actions dependencies are pinned to exact commit SHAs while retaining the documented v4 compatibility line.
- Independent UI review preflights reviewer-owned browser capability, reports exact MCP/tool permission blockers, and requires blocked visual/runtime reviews to be rerun after permission is granted instead of reusing the implementer or parent session's pass.
- `senior-dev` and coding handoff default to bounded fan-out, compact task packets, review routing by actual change type, and reuse of still-valid evidence.
- `llm-resource-governor` no longer guesses the cheapest provider/model. It decides when to offload, context/output budgets, fan-out, and escalation; user worker configuration decides which runtime/model/API executes each role.
- `coding-agent-handoff` invokes roles through deterministic worker mappings and treats `NATIVE`, `BLOCKED`, and configured external routes explicitly instead of silently selecting another provider.
- `agent-bridge` now loads only user-owned worker config by default. Repository `.comind/worker-profiles.yaml` is not auto-loaded, preventing an untrusted project from redirecting its source/evidence to an arbitrary endpoint.
- Worker secrets stay outside YAML through `api_key_env`/`env_from`; literal API keys and secret-like environment entries are rejected.
- The previous Grok/Codex direct dispatcher is retained behind the routing wrapper, preserving existing backend safety behavior and explicit `--sdk` compatibility.

## Versioning policy

- **MAJOR** — breaking skill names, agent names, output contracts, or materially incompatible workflow semantics.
- **MINOR** — new skills/agents or backward-compatible capabilities.
- **PATCH** — clarifications, safety fixes, documentation fixes, and backward-compatible workflow corrections.

For reproducible automation, pin a tagged release or commit once tags are available instead of implicitly tracking `main`.
