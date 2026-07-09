---
title: "Ornament: one seed, a matching terminal, site, and desktop theme"
published: false
tags: javascript, svg, generative, webdev
---

I customize my terminal, my editor, and my desktop wallpaper, and for years
the colors never matched. I would pick a nice terminal scheme, then hand-pick a
CSS palette for a side project, then grab some wallpaper, and the three would
sit next to each other looking like three different people's taste. Every
"theme generator" I tried was a lookup table: a fixed list of palettes mapped
to a fixed list of outputs, with no way to get the *same* colors out in the
three formats I actually needed.

So I built [Ornament](https://apps.charliekrug.com/ornament/). You give it a
seed and pick a motif family, and it generates a palette, a 16-color terminal
theme, and a tiled desktop wallpaper, all from that one seed. Because they come
from the same source, they match by construction.

## The one-seed idea

The whole thing hangs on determinism. A seed is hashed into a 32-bit integer
with `xmur3`, and that integer drives a `mulberry32` PRNG. Every generator (the
palette, the nouveau curves, the constellation graph) pulls from a stream keyed
off the seed:

```js
export function createRng(seed) {
  return mulberry32(xmur3(String(seed))());
}
```

Each consumer namespaces its stream so they do not interfere:

```js
const rng = createRng(`${seed}:palette`);
```

The payoff is that a seed is a durable, shareable name for a whole theme. Load
the studio with `?seed=first-light&family=astro` and you get the exact palette
and artwork I got. The CSS `--ornament-accent`, the terminal `yellow` key, and
the accent stroke in the wallpaper are all the same value because they all read
the same palette object.

## Drawing the motif, not stamping it

The part I enjoyed most was making the artwork real generative art rather than
recolored clip art. The nouveau family draws art-nouveau "whiplash" curves:
each strand is a cubic Bezier rising from the bottom edge, with a seeded sway,
lift, and curl.

```js
const sway = 40 + rng() * 70;
const lift = CANVAS_SIZE * (0.5 + rng() * 0.35);
const curl = (rng() - 0.5) * 140;
```

The astro family scatters stars and links each one back to an earlier star, so
you always get a connected constellation graph rather than a random dust of
dots:

```js
for (let i = 1; i < points.length; i++) {
  const target = Math.floor(rng() * i);
  links.push([i, target]);
}
```

## One render core, three exporters

The build decision I would repeat: there is a single function,
`renderMotifBody`, that turns a `{ palette, nouveauPaths, astro }` bundle into
bare SVG elements. The preview wraps it in an `<svg>`, and the wallpaper
exporter tiles the same body across a grid without re-implementing any
rendering. Adding a new export format never touches the generators. The CSS and
terminal exporters are just pure functions from a palette object to a string,
which made them trivial to unit test to 100% coverage.

## What I would do differently

The exports are close but not deep. The terminal theme maps blue, magenta, and
cyan onto the same support accent, which is honest but a little flat; a real
16-hue derivation would be better. And the wallpaper is an SVG, which is crisp
and tiny but not what every wallpaper picker wants, so a PNG rasterize step is
the obvious next move.

If you want to poke at it, the studio is live at
[apps.charliekrug.com/ornament](https://apps.charliekrug.com/ornament/) and the
source is on [GitHub](https://github.com/ctkrug/ornament). It is vanilla JS with
Vite and Vitest, no framework. Feedback on the motif math is very welcome.
</content>
