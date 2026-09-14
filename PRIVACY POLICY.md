# GoreeCloud Design Center — Development Privacy Policy

This document describes the current Development source behavior. It is not a statement about a future production deployment that does not yet exist.

## Current runtime data handling

The current application does not include accounts, advertising, analytics, trackers, remote fonts, third-party runtime UI libraries, or a backend data service.

The application stores the selected appearance preference in browser `localStorage` when that storage is available. Catalog search text is processed in the browser and is not intentionally transmitted by the application. The current token inspector reads computed CSS values locally in the browser.

## Build-time network access

Development/build tooling retrieves the exact pinned Glaze UI source from the canonical GoreeCloud-controlled GitHub repository. This is a build-time dependency and is not a browser runtime tracking dependency.

## Privacy Shield boundary

These source characteristics do not establish accepted Privacy Shield integration. Privacy Shield application integration and acceptance remain blocked until verified evidence exists.
