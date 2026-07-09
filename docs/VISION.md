# Vision

## The problem

Design-system "theme generators" almost always work the same way: a small
fixed set of hand-picked palettes, mapped to a small fixed set of outputs.
They're lookup tables wearing a generator's clothing — pick "Dracula" or
"Nord" and get exactly the same swatch everyone else gets. There's no
procedural depth, and the visual output (if there is one at all) is
decorative, not derived from any real generative-art process.

Separately, developers routinely need the *same* palette expressed in three
different, incompatible formats: CSS custom properties for a web project, a
terminal color scheme for their shell, and a wallpaper for their desktop —
and today that means three separate tools, three separate color choices, and
no guarantee the three ever match.

## Who it's for

Developers and designers who want a cohesive, personal visual identity
across their tools (editor/terminal/desktop/web project) and who'd rather
generate something singular from a seed than pick from someone else's preset
list — the audience that already reaches for tools like Coolors or
terminal.sexy, but wants more originality and cross-surface consistency than
either provides.

## The core idea

One seed drives everything. A seed plus a **motif family** (art-nouveau
whiplash curves, or astronomical constellation charts) deterministically
produces:

1. A **palette** — a small HSL color system (background surfaces, text,
   accent, support accent) generated from hue math tied to the motif family,
   not picked from a swatch list.
2. A **motif** — actual procedural generative art (Bezier curve generation
   for nouveau, random-graph star linking for astronomy), rendered as SVG.
3. Three **exports** derived from the same palette + motif: CSS custom
   properties, a 16-color terminal theme, and a tiled desktop wallpaper.

Change the seed, get a new palette and a new pattern — and every export
updates in lockstep, because they're all functions of the same seed.

## Key design decisions

- **Determinism over randomness.** Every generator is seeded (`xmur3` +
  `mulberry32`), so a seed is a durable, shareable identifier — "seed
  `first-light`" reproduces the exact same palette and pattern for anyone,
  forever. This is what makes exports trustworthy: the CSS tokens, terminal
  theme, and wallpaper for a given seed are always in sync with each other.
- **Real generative art, not templates.** The motif generators implement
  actual procedural algorithms (parameterized Bezier whiplash curves; random
  spanning-structure constellation graphs) rather than swapping colors on a
  fixed piece of clip art. This is the core "wow" of the project and the
  reason it's not just another palette picker.
- **Shared render core, format-specific exporters.** `core/render` produces
  motif markup once; `core/export/*` each consume the same
  `{ palette, motif }` bundle to produce a different artifact. Adding a new
  export format never touches the generators.
- **No framework, no build complexity.** Vanilla JS + SVG/Canvas, bundled
  with Vite. The whole app is a static site — no server, no database,
  deployable to a static subpath.
- **Static, subpath-deployable output.** All asset references are relative,
  and the entire app builds to a single `dist/` directory, so it can be
  hosted at `apps.charliekrug.com/ornament` without any path rewriting.

## What "v1 done" looks like

- A user can pick a seed (or generate a random one), pick a motif family,
  and see the palette + motif render live in the browser.
- They can download all three exports (CSS tokens file, terminal theme JSON,
  wallpaper SVG/PNG) for the current seed with one click each.
- The exports are verifiably in sync: the terminal theme's `accent` color
  and the CSS `--ornament-accent` value are always the same for a given
  seed.
- The page follows `docs/DESIGN.md` in full: astral-nouveau direction,
  responsive from phone to desktop, generation feedback (draw-in animation,
  synth chime), and a designed empty/first-load state.
- CI is green: the test suite (RNG determinism, palette shape, motif shape,
  export correctness) and the production build both pass on every push.
