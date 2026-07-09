# Backlog

Stories are marked `[ ]` to start. Every story lists concrete, verifiable
acceptance criteria — no vibes. Build implements to the criteria; QA attacks
them.

## Epic 1 — Live generation studio (the wow moment)

- [x] **Seed + motif picker renders a live palette and motif.** *(wow moment
      — build this first; the demo must land before anything else.)*
  - Entering a seed and choosing a motif family (nouveau/astro) renders an
    SVG preview within 1 second, with no page reload.
  - The rendered preview's fill/stroke colors match `generatePalette(seed,
    family)`'s output exactly (spot-checked via the browser inspector).
  - All three export buttons (CSS / terminal theme / wallpaper) are enabled
    as soon as a preview has rendered, and disabled before any seed is set.

- [x] **Random seed generator.**
  - A "New seed" control replaces the current seed with a freshly generated
    random string and re-renders the preview.
  - Clicking it twice in a row produces two different, non-empty previews
    (no seed collision on rapid clicks).

- [x] **Motif family switch.**
  - Toggling between "nouveau" and "astro" with the same seed re-renders
    immediately and produces a visibly different pattern and palette hue.
  - The currently active family is visually indicated (e.g. a selected
    state on the control) at all times.

- [ ] **Design polish — studio UI.**
  - The studio page passes the D2/D3 design self-review checklist (resize
    390/768/1440, hover/focus/active states on every control, no anti-generic
    bans present) as verified and noted in a QA run.

## Epic 2 — Export fidelity

- [x] **CSS token export.**
  - Clicking "Export CSS" downloads a `.css` file containing a `:root`
    block with all 9 `--ornament-*` custom properties.
  - The downloaded file's `--ornament-accent` value is byte-identical to
    the accent color rendered in the on-screen preview for the same seed.

- [x] **Terminal theme export.**
  - Clicking "Export terminal theme" downloads a `.json` file with all 16
    ANSI color keys plus `background`/`foreground`/`cursor`/`selection`.
  - The file parses as valid JSON and its `background` value matches the
    CSS export's `--ornament-bg` for the same seed.

- [x] **Wallpaper export at selectable resolution.**
  - A resolution selector offers at least 1920×1080, 2560×1440, and
    3840×2160; clicking "Export wallpaper" downloads an SVG (or rasterized
    PNG) at the exact selected dimensions.
  - The exported wallpaper's background color matches `--ornament-bg` for
    the current seed.

- [x] **Exports stay in sync with the current seed.**
  - After changing the seed or motif family, previously enabled export
    buttons immediately reflect the new seed — downloading any export after
    a change never returns data from the prior seed.

- [x] **Design polish — export feedback states.**
  - Each export action shows a distinct loading state (button briefly
    disabled) and a success confirmation (toast or inline checkmark) that
    disappears after a few seconds without user action.

## Epic 3 — Studio polish & shareability

- [x] **Shareable seed URL.**
  - Loading the studio with `?seed=<value>&family=<nouveau|astro>` in the
    URL renders that exact seed/family combination on first paint, with no
    extra click required.
  - Generating a new seed in the UI updates the URL query string to match
    (verified via browser history/address bar), so the page is always
    shareable at its current state.

- [x] **Copy-seed-to-clipboard control.**
  - A "Copy seed" button copies the current seed string to the clipboard
    and shows a brief "Copied" confirmation.
  - Works over `https` (or `localhost`) using the async Clipboard API, with
    a visible fallback message if clipboard access is denied.

- [x] **Motif parameter tuning.**
  - Nouveau exposes a "strand count" control (bounded e.g. 3–9) and astro
    exposes a "star count" control (bounded e.g. 8–24); changing either
    re-renders the motif with the new parameter while keeping the same
    seed and palette.
  - Values outside the bounds are clamped, never producing a broken or
    empty render.

- [x] **Generation feedback (juice).**
  - Regenerating tweens the old motif out and the new one in over roughly
    800ms ease-out rather than swapping instantly, except when
    `prefers-reduced-motion` is set, where the swap is instant.
  - A synthesized WebAudio chime plays on regenerate/export unless muted;
    the mute toggle's state persists across a page reload via
    `localStorage`.

- [x] **Responsive layout verification.**
  - The studio renders with no horizontal scroll and no overlapping
    elements at 390px, 768px, and 1440px widths.
  - The preview occupies at least 60% of the viewport height on desktop
    and stacks full-width above the controls on phone width.

- [ ] **Accessibility pass.**
  - Every interactive control has a visible focus ring and reaches focus
    via Tab in a logical order; icon-only buttons have `aria-label`s.
  - Body text and control labels meet a 4.5:1 contrast ratio against their
    background (checked with a contrast tool during QA).
