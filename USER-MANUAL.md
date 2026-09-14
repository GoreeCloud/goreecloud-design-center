# GoreeCloud Design Center — Development User Manual

GoreeCloud Design Center is currently a Development web application and is not production deployed.

## Build

Requires Node.js 20 or newer.

```bash
npm run build
```

The build synchronizes the exact pinned current Stable Glaze UI source, validates the source and repository baseline, and creates a static artifact under `dist/`.

## Use

Open the built `dist/index.html` through an appropriate local static web server.

- Use the navigation to move between Overview, Foundations, Tokens, Components, Adaptation, and Accessibility.
- Press `/` outside an input to focus catalog search.
- Press Escape while catalog search is focused to clear and exit search.
- Use the Appearance selector for System, Light, Dark, or Deep Dark presentation.
- Use the Token inspector to view resolved computed Glaze variables. Copy controls are available only when the browser exposes the corresponding variable and clipboard access is permitted.

## Limits

The application has no production account, backend, synchronization service, public deployment, or Stable acceptance. Development UI examples are references and must not be interpreted as evidence that other GoreeCloud products have implemented the same state.
