# Design direction

## Aesthetic direction

**Astral nouveau: an antique star-chart brought to life.** Deep indigo
parchment-dark surfaces, aged-gold whiplash linework, and constellation-dot
accents — like a Mucha poster crossed with an 18th-century celestial atlas.
Warm and ornamental rather than cold and technical, even though the subject
matter (star charts) could easily tip into "blueprint" territory — the gold
line quality and organic curves are what keep it nouveau instead of
technical-diagram.

This is a deliberate departure from a generic dark-mode-with-one-accent
treatment: the palette is warm-leaning (gold + verdigris against indigo,
not blue-on-black), and the signature visual motif (whiplash curves) is
organic and hand-drawn in feeling, not geometric.

## Tokens

| Token | Value | Use |
|---|---|---|
| `--ornament-bg` | `hsl(235 38% 14%)` | page background — deep astronomical indigo |
| `--ornament-surface-1` | `hsl(235 34% 20%)` | cards, preview panel |
| `--ornament-surface-2` | `hsl(235 30% 27%)` | raised surfaces, control panel |
| `--ornament-text` | `hsl(235 45% 92%)` | primary text — warm parchment cream |
| `--ornament-text-muted` | `hsl(235 20% 70%)` | secondary text, labels |
| `--ornament-accent` | `hsl(45 55% 55%)` | antique gold — whiplash linework, primary actions |
| `--ornament-accent-support` | `hsl(175 45% 60%)` | verdigris teal — constellation links, secondary actions |
| success | `hsl(130 40% 55%)` | export confirmation states |
| danger | `hsl(6 60% 58%)` | error states |

These are the *default* preview tokens (seed `first-light`); every generated
palette is a seeded variation on this same hue relationship (indigo base +
gold/verdigris accents for the astro family, a botanical green base +
gold/violet accents for the nouveau family), so the app never strays from
its own aesthetic no matter what a user generates.

**Type pairing:** [Cinzel](https://fonts.google.com/specimen/Cinzel) (display
— the engraved, classical-capitals feel of star-atlas title pages) for the
wordmark and headings; [Inter](https://fonts.google.com/specimen/Inter) (UI)
for body text and controls. System-font fallback stack on both.

**Spacing scale:** 4px base — 4 / 8 / 16 / 24 / 32 / 48px.

**Corner radius:** 10px — soft but not glassy.

**Shadow:** layered dark shadow for depth, no glow yet
(`0 2px 4px rgba(0,0,0,.4), 0 8px 24px rgba(0,0,0,.35)`); a subtle gold-tinted
glow is planned for interactive/focus states in BUILD.

**Motion:** UI transitions 120–250ms ease-out (control hover/press, panel
open); the generative pattern draws itself in over ~800ms ease-out when a
new seed is generated, so regenerating reads as a reveal, not a snap.

## Layout intent

The hero is the **motif preview** — the live SVG render of the current
palette + motif. On desktop (1440×900) it occupies the majority of the
viewport (~60%+), centered, with a control rail (seed input, palette-family
picker, motif picker, export buttons) alongside it. On phone (390×844) the
preview stacks full-width at the top, controls flow below it — no dead space
above or below the preview on either breakpoint.

## Signature detail

The wordmark "Ornament" draws itself: a thin gold whiplash line (an SVG path
with `stroke-dasharray`/`stroke-dashoffset` animated on load) traces beneath
the text, echoing the same curve generator used for the motif itself. The
preview panel also carries a faint radial vignette so the pattern reads as
sitting *in* a dark sky rather than floating on a flat rectangle.

## Juice plan

Ornament is a generative toy, not a game, so the "juice" is about generation
feedback rather than combat/movement feedback:

- **Regenerate feedback:** clicking "New seed" tweens the old motif out and
  the new one in (~800ms ease-out), never a hard swap.
- **Export feedback:** each export button (CSS / terminal / wallpaper) pops
  and shows a small checkmark + filename toast on successful download.
- **Sound:** a soft WebAudio "chime" (short sine + noise burst, synthesized,
  no audio files) on regenerate and on export, at low volume, rate-throttled
  so rapid clicks don't stack; a mute toggle persisted to `localStorage`;
  `AudioContext` created lazily on first user gesture and guarded for
  environments without WebAudio (tests, headless browsers).
- All motion respects `prefers-reduced-motion` (draw-in/tween become
  instant; sound and functionality are unaffected).
