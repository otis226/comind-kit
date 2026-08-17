# evidence-transport

## Purpose

Use this workflow when verification produces screenshots, diffs, traces, reports, or other artifacts that reviewers need to access but cannot read from the local machine.

The goal is to keep evidence reviewable without turning source history, release namespaces, or tag namespaces into temporary artifact storage.

## 1. Default meaning of artifact

In this workflow, an `artifact` normally means:

1. a PR/CI workflow artifact with retention; or
2. another temporary reviewer-accessible mechanism.

It does **not** mean GitHub Release by default.

## 2. Do not use releases/tags merely to transport evidence

Do not create, solely for verification evidence:

- GitHub releases/prereleases;
- Git tags;
- permanent binary/source commits containing temporary screenshots, diffs, traces, or reports.

Release/tag namespaces belong to product release/versioning unless explicitly required otherwise.

## 3. Transport priority

```text
1. Living PR/review comment attachment or embed
   ↓
2. PR/CI workflow artifact with retention
   ↓
3. Another reviewer-accessible temporary mechanism
```

A living review location should retain the current candidate SHA, verdict, intentional deltas, and artifact link.

Prefer updating the existing review location instead of creating a new comment/release/tag for every iteration.

## 4. Local working evidence

Keep working evidence in gitignored paths such as `.tmp-verify/`, `.playwright-mcp/`, or a project equivalent.

Do not commit binary iterations merely because local files are not reviewer-accessible.

Durable, reproducible text assets such as deterministic scenarios, configuration, or a final report may be kept in the appropriate verification/tooling location when genuinely reusable.

## 5. If an evidence-only release/tag already exists

```text
migrate evidence
→ update living review location
→ verify reviewer access
→ delete evidence-only release
→ delete evidence-only tag
```

Do not delete the only copy of evidence before a replacement is accessible. If transport or cleanup cannot be completed safely, report `BLOCKED` and retain the evidence temporarily.

## 6. Final evidence

After the final candidate/sign-off:

- preserve exact candidate SHA, reference/configuration, intentional deltas, and verdict when useful for audit;
- raw screenshots/diffs/traces may expire when deterministic and reproducible according to project policy;
- do not create a product release merely to archive parity evidence.

```text
Review evidence belongs to the review workflow.
Product releases belong to the release workflow.
Do not mix the two namespaces.
```
