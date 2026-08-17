# Repository instructions for AI agents

This file is the maintenance entrypoint for AI agents working **on CoMind Kit itself**.

## Repository purpose

CoMind Kit is a public, project-neutral collection of reusable Agent Skills and thin runtime adapters for software delivery, UI review, design parity, runtime verification, and workstream finalization.

`README.md` is human onboarding. Runtime behavior belongs in `skills/*` and `agents/*`.

## Rules

1. Keep reusable skill and agent instructions in English.
2. Keep every public workflow project-neutral. Never add private project facts, customer data, private repository paths, internal URLs, secrets, or credentials.
3. Resolve project-specific truth from the repository in which an installed skill is being used; never encode that truth into CoMind Kit.
4. Use `skills/<name>/SKILL.md` as the skill entrypoint. Longer workflows may live in sibling `INSTRUCTIONS.md` files.
5. Reference sibling capabilities by installed skill name (`ui-review`, `design-parity`, `runtime-regression`, etc.), not by legacy flat paths such as `skills/ui-review.md`.
6. Keep `agents/*` thin. Canonical reusable workflow semantics belong in skills, not duplicated agent prompts.
7. Do not hard-code machine-specific absolute paths or assume a particular user's local environment.
8. Preserve the distinction between observation, inference, proposal, authority, and evidence.
9. Do not weaken safety/verification gates merely to obtain a PASS result.
10. Update `README.md` and `CHANGELOG.md` when a public capability, install flow, agent, skill, or output contract materially changes.

## Before finalizing a repository change

Run:

```bash
node scripts/validate-public.mjs
```

If a change modifies a skill, also inspect the complete package and any sibling skills it references.

## Public trust boundary

A public skill must never depend on unavailable private context. If a workflow needs project-specific information, instruct the runtime to resolve it from the current project rather than embedding a private source.
