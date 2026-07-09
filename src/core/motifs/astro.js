import { createRng } from '../rng.js';

const CANVAS_SIZE = 512;
const MARGIN = 24;

/**
 * Generates a constellation motif: a scattering of stars connected by a
 * random spanning structure (each star links back to an earlier one), in
 * the style of a hand-drawn celestial chart.
 */
export function generateAstroMotif(seed, { stars = 14 } = {}) {
  const rng = createRng(`${seed}:astro`);
  const span = CANVAS_SIZE - MARGIN * 2;

  const points = Array.from({ length: stars }, (_, id) => ({
    id,
    x: MARGIN + rng() * span,
    y: MARGIN + rng() * span,
    r: 1 + rng() * 2.5,
  }));

  const links = [];
  for (let i = 1; i < points.length; i++) {
    const target = Math.floor(rng() * i);
    links.push([i, target]);
  }

  return { points, links };
}
