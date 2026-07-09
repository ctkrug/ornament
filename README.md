# Ornament

A generative art-nouveau/astronomy-themed UI kit builder. Pick a palette and a
motif, and Ornament procedurally draws you a matching set of design
artifacts: CSS custom-property tokens, a terminal color theme, and a desktop
wallpaper — all derived from a single seed, all generated in code.

## Why

Most "theme generator" tools are lookup tables: a fixed list of palettes
mapped to a fixed list of outputs. Ornament instead treats color and pattern
as procedural systems — whiplash art-nouveau curves and star-chart
constellations are drawn algorithmically from a seed, so every combination of
palette and motif produces a genuinely unique, reproducible result.

## What it generates

- **Palette** — a seeded HSL color system (background, surfaces, text,
  accent, support accent) drawn from an art-nouveau or astronomy hue family.
- **Motif** — procedural SVG pattern art: nouveau whiplash curves or
  astronomical constellation charts, rendered from the same seed.
- **CSS tokens** — a `:root { --ornament-* }` stylesheet ready to drop into
  any project.
- **Terminal theme** — a 16-color ANSI scheme derived from the same palette.
- **Wallpaper** — a tiled SVG composition of the motif, sized for desktop
  backgrounds.

Every export is deterministic: the same seed always reproduces the same
palette, motif, and derived artifacts.

## Stack

Vanilla JavaScript, SVG, and the Canvas API — no UI framework. Built and
tested with [Vite](https://vitejs.dev) and [Vitest](https://vitest.dev).

## Development

```bash
npm install
npm run dev      # local dev server
npm test         # run the test suite
npm run build    # production build to dist/
```

## Status

Early scaffold. See [`docs/VISION.md`](docs/VISION.md) for the design
rationale and [`docs/BACKLOG.md`](docs/BACKLOG.md) for the build plan.

## License

MIT — see [`LICENSE`](LICENSE).
