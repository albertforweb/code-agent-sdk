# CodeAgent Feature Package SDK

This repo contains the TypeScript contracts shared by the CodeAgent core app and feature packages.

The SDK is intentionally separate from `code-agent/src/features` so package authors can build against stable manifest, extension, and runtime activation contracts without depending on core app internals.

Current contracts include:

- Feature package manifests
- Entitlement and install-state profile types
- Shell adapter metadata
- Extension point registrations for desktop, Electron, CLI, mobile, settings, and status surfaces
- Runtime activation module shape for installed package artifacts

Local development consumers reference this repo as `@codeagent/feature-package-sdk` through a `file:../code-agent-sdk` dependency.
