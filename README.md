# GoreeCloud Design Center

GoreeCloud Design Center is the Development workspace for inspecting, presenting, and validating GoreeCloud interface foundations and reusable current-Stable Glaze UI patterns.

## Current state

**Lifecycle:** Development  
**Deployment:** Not configured  
**Stable Glaze target:** GLAZE UI V1.4 / `1.4.0`  
**Platform Contract:** `0.3`

The repository contains an original GoreeCloud-owned, mobile-first static web application. It is intentionally **not** labeled Stable: application-specific visual, accessibility, browser/platform, platform-system, identity, deployment, rollback, and production acceptance are still incomplete.

## What is implemented

- Responsive Design Center shell for Mobile, Tablet, Desktop, and Wide Desktop.
- Repository-local Design Center mark and favicon.
- Foundation reference panels for material hierarchy, semantic state, adaptive windows, and accessibility priorities.
- Runtime semantic-token inspector that reads computed values from the locally synchronized Glaze stylesheet without redefining Glaze authority.
- Interactive component and operational-state specimens.
- Light, Dark, Deep Dark, and system appearance switching.
- Client-side catalog filtering and URL hash navigation.
- Reduced-motion, reduced-transparency, increased-contrast, forced-colors, keyboard-focus, touch-target, and reflow safeguards.
- Fail-closed Glaze synchronization pinned to exact canonical source.
- Platform Contract `0.3` declaration covering all eight Integral Platform Systems.
- Source/repository validation for IDs, internal anchors, `aria-controls`, baseline documentation, runtime dependency boundaries, and Platform Contract consistency.
- GitHub Actions validation against the pinned central Platform Contract validator and exact source revision.
- Static build artifact generation with source-derived metadata.

## Development

Requires Node.js 20 or newer.

```bash
npm run build
```

The build:

1. Synchronizes the pinned GoreeCloud-controlled Glaze UI source into `vendor/`.
2. Validates Design Center source and synchronized Glaze lifecycle/version.
3. Produces the static artifact in `dist/`.
4. Runs workspace, repository-baseline, and Platform Contract consistency checks.

The GitHub Actions workflow additionally validates `goreecloud.platform.yaml` using the central Platform Contract `0.3` validator pinned to GoreeCloud/GoreeCloud commit `908701c6795ffcd608bd3d8a1e787395a04f1d62`.

No third-party runtime CDN, remote font, tracker, analytics library, or advertising dependency is required by the current source.

## Authority boundary

The canonical Glaze implementation remains `GoreeCloud/goreecloud-glaze-ui`. Platform Contract authority remains in `GoreeCloud/GoreeCloud`. Design Center consumes those authorities; it does not redefine Glaze lifecycle, security, privacy, identity, synchronization, recovery, or platform truth.

## Acceptance boundary

Green CI proves only the automated checks encoded in this repository and the pinned central declaration validator. It does not prove manual optical approval, assistive-technology acceptance, representative-device/browser qualification, complete Integral Platform System acceptance, production deployment, rollback, or Stable certification.

A canonical Design Center project specification and its required application umbrella identity remain separate governance work.
