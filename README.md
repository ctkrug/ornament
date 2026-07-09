# Ornament

**▶ Live demo — [apps.charliekrug.com/ornament](https://apps.charliekrug.com/ornament/)**

One seed themes your terminal, site, and desktop.

[![CI](https://github.com/ctkrug/ornament/actions/workflows/ci.yml/badge.svg)](https://github.com/ctkrug/ornament/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-c7a24a.svg)](LICENSE)

Ornament turns a single seed into a matching set of design artifacts: CSS
custom-property tokens for a web project, a 16-color terminal theme for your
shell, and a tiled SVG wallpaper for your desktop. They all share one seeded
palette, so your terminal, site, and desktop finally look like one thing
instead of three unrelated color choices.

It is for the people who already customize their tools (the dotfiles and
`terminal.sexy` crowd) and want originality and cross-surface consistency that
a fixed preset list cannot give them.

## Why it exists

Most theme generators are lookup tables: a small fixed set of hand-picked
palettes mapped to a small fixed set of outputs. Pick "Nord" and you get the
same swatch everyone else gets, with no procedural depth. And when you want the
same colors as CSS, as a terminal scheme, and as a wallpaper, that is three
separate tools and three separate color choices that never quite agree.

Ornament treats color and pattern as procedural systems. Whiplash art-nouveau
curves and star-chart constellations are drawn algorithmically from a seed, and
every export is derived from that same seed, so the three artifacts are
guaranteed to match.

## What it generates

- **Palette:** a seeded HSL color system (background, two surfaces, text,
  accent, support accent) from an art-nouveau or astronomy hue family.
- **Motif:** procedural SVG art, either nouveau whiplash curves or an
  astronomical constellation chart, drawn from the same seed.
- **CSS tokens:** a `:root { --ornament-* }` stylesheet you can drop into any
  project.
- **Terminal theme:** a 16-color ANSI scheme derived from the same palette.
- **Wallpaper:** a tiled SVG of the motif at 1080p, 1440p, or 4K.

Generation is deterministic: the same seed and motif family always reproduce
the same palette, artwork, and exports, so a seed is a shareable name for a
whole theme.

## Sample output

The seed `first-light` with the Astro family exports this CSS:

```css
:root {
  --ornament-bg: hsl(236 38% 14%);
  --ornament-surface-1: hsl(236 34% 20%);
  --ornament-surface-2: hsl(236 30% 27%);
  --ornament-text: hsl(236 45% 92%);
  --ornament-text-muted: hsl(236 20% 70%);
  --ornament-accent: hsl(48 55% 55%);
  --ornament-accent-support: hsl(178 45% 60%);
  --ornament-success: hsl(130 40% 55%);
  --ornament-danger: hsl(6 60% 58%);
}
```

The `--ornament-accent` value above (`hsl(48 55% 55%)`) is byte-identical to
the `yellow` key in that seed's terminal theme and the accent stroke in its
wallpaper. Change the seed and all three move together.

## Using the studio

1. Pick a seed. Type any word, or click **New seed** for a random one.
2. Choose **Nouveau** or **Astro**, then tune the strand or star count.
3. Click **Export CSS**, **Export terminal theme**, or **Export wallpaper**.
4. Click **Copy seed**, or share the URL: the address bar always reflects
   `?seed=&family=`, so any studio state is shareable as a link.

## Development

```bash
npm install
npm run dev      # local dev server
npm test         # run the test suite
npm run build    # production build to dist/
```

Vanilla JavaScript with SVG and the Canvas API, no UI framework. Built with
[Vite](https://vitejs.dev) and tested with [Vitest](https://vitest.dev); the
generative core (`src/core`) sits at 100% line coverage
(`npm run test:coverage`).

## Documentation

- [`docs/VISION.md`](docs/VISION.md): the problem and the design rationale.
- [`docs/DESIGN.md`](docs/DESIGN.md): the astral-nouveau visual direction.
- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md): how a seed becomes an export.

## License

MIT. See [`LICENSE`](LICENSE).

More of Charlie's projects → https://apps.charliekrug.com
</content>
</invoke>
