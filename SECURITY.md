# GoreeCloud Design Center — Security

## Current scope

GoreeCloud Design Center is a Development static web application. It currently has no production backend, database, account system, privileged administrative API, reusable credential store, or public deployment configured by this repository.

## Source controls

- Glaze UI source is pinned to an exact GoreeCloud-controlled revision.
- Runtime UI assets are built for local serving rather than loaded from third-party CDNs.
- Validation rejects remote runtime scripts, stylesheets, fonts, and images from the primary application source.
- GitHub Actions builds and validates the exact pull-request or `main` revision and retains a source-derived static artifact.

## Security boundary

These controls do not constitute accepted Wardveil Security integration or production security acceptance. Future deployment, APIs, accounts, privileged functions, or external integrations require renewed threat, authorization, dependency, and exposure review.

Do not commit passwords, API keys, tokens, private keys, recovery material, or other reusable secrets to this repository or its documentation.
