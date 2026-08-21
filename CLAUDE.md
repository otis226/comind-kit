# Claude Code repository guidance

Read and follow `AGENTS.md` before editing this repository.

For runtime behavior:

- canonical reusable roles/workflows live in `skills/`;
- deterministic external-worker execution lives in `skills/agent-bridge/`;
- plugin distribution metadata lives in `.claude-plugin/`;
- CoMind Kit does not ship permanent specialist agent wrappers.

Do not treat `README.md` as canonical agent policy.
