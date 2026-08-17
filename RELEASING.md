# Releasing

CoMind Kit uses Semantic Versioning for tagged releases.

## Before tagging

1. Ensure `main` is the intended release candidate.
2. Confirm `Validate public toolkit` is green.
3. Update `CHANGELOG.md` so the release delta is understandable.
4. Choose the next version according to the public compatibility rules in `CHANGELOG.md`.

## Publish

Create and push a tag named:

```text
vMAJOR.MINOR.PATCH
```

The `Publish release` GitHub Actions workflow validates the tagged tree again and then creates the GitHub Release with generated notes.

Do not use release tags for temporary review evidence; use the `evidence-transport` workflow instead.
