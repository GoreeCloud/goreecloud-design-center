# GoreeCloud Design Center

GoreeCloud Design Center is the development workspace for exploring, presenting, and validating GoreeCloud interface foundations and reusable Glaze UI patterns.

## Current state

**Lifecycle:** Development  
**Deployment:** Not configured  
**Stable Glaze target:** GLAZE UI V1.4 / `1.4.0`

This repository now contains a runnable, mobile-first Design Center foundation instead of the previous placeholder-only README. It is intentionally **not** labeled Stable: application-specific visual, accessibility, platform, identity, and production acceptance still have to be completed and verified.

## What is implemented

- Responsive Design Center application shell for Mobile, Tablet, Desktop, and Wide Desktop.
- Local-only interface assets and a repository-local Design Center mark.
- Foundation reference panels for material hierarchy, adaptive window classes, accessibility priorities, and protected truth boundaries.
- Interactive component specimens using inherited Glaze component classes where available.
- Appearance switching for Light, Dark, and Deep Dark.
- Client-side catalog filtering.
- Reduced-motion, reduced-transparency, increased-contrast, forced-colors, keyboard-focus, touch-target, and reflow safeguards.
- A fail-closed Glaze synchronization step that pins the canonical `goreecloud-glaze-ui` source revision and vendors its recursive CSS dependency chain at build time.
- Source validation and a dependency-free static build pipeline.
- GitHub Actions validation on pull requests and pushes to `main`.

## Development

Requires Node.js 20 or newer.

```bash
npm run build
```

`npm run build` performs three controlled steps:

1. Synchronizes the pinned GoreeCloud-controlled Glaze UI source into `vendor/`.
2. Validates the Design Center source and the synchronized Glaze lifecycle/version.
3. Produces a deployable static artifact in `dist/`.

No third-party runtime CDN, remote font, tracker, analytics library, or advertising dependency is required.

## Authority boundary

The canonical Glaze implementation remains `GoreeCloud/goreecloud-glaze-ui`. This repository consumes that authority; it does not redefine Glaze lifecycle, security, privacy, identity, or resilience truth.

## Acceptance boundary

This source foundation is not a Stable application claim. Stable eligibility still requires application-specific rendered visual review, mobile-first acceptance, assistive-technology review, browser/platform qualification, performance review, repository-local identity completion, security/privacy/resilience integration review where applicable, and any required production/deployment evidence.

A canonical Design Center project specification and its required application umbrella identity were not established by this source-foundation change and remain separate governance work. Passing CI proves only the automated checks encoded in this repository; it does not prove manual optical approval, physical-device acceptance, production deployment, or Stable certification.
