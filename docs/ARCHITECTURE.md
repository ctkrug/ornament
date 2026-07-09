# Architecture

A concise map for picking this project back up with fresh context.

## Data flow

```
seed + family
  │
  ├─► core/palette.js        generatePalette(seed, family) → HSL token set
  ├─► core/motifs/nouveau.js generateNouveauMotif(seed)     → bezier path strings
  └─► core/motifs/astro.js   generateAstroMotif(seed)       → star points + links
        │
        ▼
  { palette, nouveauPaths, astro }   "motif bundle" — the one shared shape
        │
        ├─► core/render/svgRenderer.js  → <svg> markup for on-screen preview
        ├─► core/export/cssTokens.js    → :root { --ornament-* } stylesheet
        ├─► core/export/terminalTheme.js→ 16-color ANSI terminal theme JSON
        └─► core/export/wallpaper.js    → tiled <svg> at a chosen resolution
```

Every generator is seeded through `core/rng.js` (xmur3 + mulberry32), so the
same seed always reproduces the same palette, motif, and every export
derived from it. `core/render/svgRenderer.js` is the single place that turns
a bundle into markup; `wallpaper.js` reuses its `renderMotifBody` export
rather than re-implementing rendering.

## App shell (`src/main.js`)

Holds one piece of mutable state, `{ seed, family }`, seeded from a
`?seed=&family=` query string (`core/urlState.js`) or the defaults
(`first-light` / `astro`). `render()` is the only place that rebuilds the
bundle and touches the DOM:

1. Rebuilds `{ palette, nouveauPaths, astro }` from current state.
2. Pushes the palette onto `--ornament-*` custom properties on
   `document.documentElement`, so the whole page themes itself — not just
   the preview SVG.
3. Swaps the preview markup with a brief fade/scale tween (skipped under
   `prefers-reduced-motion`).
4. Syncs the family toggle buttons' `aria-pressed` state.
5. Rewrites the URL query string via `history.replaceState`.
6. Enables the (initially disabled) export buttons.

Every control (new-seed, seed input, family toggle, the three export
buttons, copy-seed, mute) is wired directly to `state` + `render()` at the
bottom of `main.js` — there's no framework or virtual DOM, so "state changed"
and "re-render" are the same call.

Export buttons read `generatePalette(state.seed, state.family)` /
`currentBundle()` live at click time (not a cached bundle), which is what
guarantees an export always matches whatever seed is currently on screen.

## Supporting modules

- `core/randomSeed.js` — `generateRandomSeed(random = Math.random)`, an
  injectable-RNG syllable generator for the "New seed" control.
- `core/motifParams.js` — `clamp()` bounds the strand-count/star-count
  slider values into their valid ranges before they reach the motif
  generators.
- `core/download.js` — `buildExportFilename` (pure, sanitizes the seed for a
  safe file name) and `triggerDownload` (Blob + anchor-click plumbing).
- `core/audio/mutePreference.js` + `core/audio/chime.js` — a synthesized
  WebAudio chime (oscillator + gain envelope), with its own mute flag
  persisted to `localStorage`. The `AudioContext` is created lazily on first
  `play()` to respect the browser autoplay-gesture rule, and every
  dependency (audio context class, storage) is injectable so both modules
  are unit-tested without a real browser audio backend.

## Testing

`npm test` runs Vitest over `test/*.test.js`, one file per core module —
pure logic only (no DOM). Everything DOM-facing in `main.js` is exercised by
manually driving the built app in a real (headless) browser rather than
mocked in Vitest; see the BUILD run notes for the Playwright session used to
verify it.

## Build / run

- `npm run dev` — Vite dev server.
- `npm test` — Vitest suite.
- `npm run build` — production build to `dist/`, base-path-relative
  (`vite.config.js` sets `base: './'`) so it's servable from a subpath like
  `apps.charliekrug.com/ornament/`.
