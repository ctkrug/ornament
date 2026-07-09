const CANVAS_SIZE = 512;

/**
 * Renders the constellation links, stars, and nouveau strands of a motif
 * bundle as bare SVG markup (no wrapping <svg> or background). Exposed
 * separately from renderMotifToSvg so the wallpaper exporter can tile this
 * body without nesting <svg> elements.
 */
export function renderMotifBody({ palette, nouveauPaths, astro }) {
  const lines = astro.links
    .map(([a, b]) => {
      const from = astro.points[a];
      const to = astro.points[b];
      return `<line x1="${from.x.toFixed(1)}" y1="${from.y.toFixed(1)}" x2="${to.x.toFixed(1)}" y2="${to.y.toFixed(1)}" stroke="${palette.accentSupport}" stroke-width="0.6" opacity="0.5" />`;
    })
    .join('\n  ');

  const stars = astro.points
    .map((p) => `<circle cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="${p.r.toFixed(1)}" fill="${palette.text}" />`)
    .join('\n  ');

  const strands = nouveauPaths
    .map((d) => `<path d="${d}" fill="none" stroke="${palette.accent}" stroke-width="3" stroke-linecap="round" />`)
    .join('\n  ');

  return `${lines}\n  ${stars}\n  ${strands}`;
}

/**
 * Wraps a motif body in a standalone, self-contained <svg> document sized
 * for direct preview or download.
 */
export function renderMotifToSvg(motifBundle, { size = CANVAS_SIZE } = {}) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${CANVAS_SIZE} ${CANVAS_SIZE}" width="${size}" height="${size}">
  <rect width="${CANVAS_SIZE}" height="${CANVAS_SIZE}" fill="${motifBundle.palette.bg}" />
  ${renderMotifBody(motifBundle)}
</svg>`;
}
