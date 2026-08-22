# Claude Code repository guidance

Read and follow `AGENTS.md` before editing this repository.

For runtime behavior:

- canonical reusable roles/workflows live in `skills/`;
- execute installed skills using Claude Code's native context/subagent/tooling;
- plugin distribution metadata lives in `.claude-plugin/`;
- CoMind Kit does not ship permanent specialist agent wrappers or cross-runtime execution adapters.

Do not treat `README.md` as canonical agent policy.
