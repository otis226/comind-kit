# Repository instructions for AI agents

This file is the maintenance entrypoint for AI agents working on CoMind Kit itself.

## Repository purpose

CoMind Kit is a public, project-neutral collection of reusable Agent Skills.

`README.md` is human onboarding. Runtime workflow semantics belong in `skills/*`.

## Rules

1. Keep reusable skill instructions English-first.
2. Keep every public workflow project-neutral. Never add private project facts, customer data, private repository paths, internal URLs, secrets, or credentials.
3. Resolve project-specific truth from the repository where an installed skill is used.
4. Use `skills/<name>/SKILL.md` as the skill entrypoint; a sibling `INSTRUCTIONS.md` may hold a longer body.
5. Reference sibling capabilities by installed skill name, never legacy flat paths.
6. The skill is the canonical reusable role. Do not add permanent runtime-specific specialist agent copies when a fresh native context/subagent can execute the skill.
7. `llm-resource-governor` decides when delegation is useful. The current runtime executes the selected role through its native context/subagent/tooling.
8. Do not add persistent role-to-provider routing or cross-runtime execution adapters. Keep literal secrets out of skills, agent definitions, task packets, and repository files.
9. Preserve observation/inference/proposal/authority/evidence distinctions and do not weaken verification merely to obtain PASS.
10. Update `README.md` and `CHANGELOG.md` when public behavior, install flow, skill set, or output contract materially changes.

## Before finalizing

Run:

```bash
node scripts/validate-public.mjs
```

If a skill changes, inspect the complete package and sibling capabilities it composes with.

## Public trust boundary

A public skill must never depend on unavailable private context. Project-specific information must be resolved from the active project rather than embedded here.
