# Security Policy

CoMind Kit contains instructions that can influence AI coding agents, so security reports include both conventional repository security issues and instruction-safety issues.

## Report privately

Please report sensitive issues privately when they involve:

- accidentally published secrets, credentials, tokens, or private data;
- private project/repository information leaking into the public toolkit;
- instructions that could cause destructive, privilege-bypassing, or unsafe behavior outside the documented workflow;
- supply-chain or plugin-installation concerns that should not be disclosed publicly before a fix exists.

Do **not** open a public issue containing sensitive data.

Contact: `otis22699@gmail.com`

For ordinary bugs, documentation problems, or non-sensitive workflow suggestions, a public GitHub issue is appropriate.

## Supported line

Before the first tagged release, security fixes target the latest `main`. After tagged releases begin, this document will identify any maintained release lines if more than the latest release is supported.

## Scope boundary

CoMind Kit is workflow guidance, not a sandbox or permission system. Users are responsible for the permissions granted to their AI runtime, repository credentials, CI environment, and deployment systems.
