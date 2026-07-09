import { createRng } from '../rng.js';

const CANVAS_SIZE = 512;

/**
 * Generates a set of art-nouveau "whiplash" curves — the sinuous asymmetric
 * S-curves characteristic of Mucha-era ornament — as SVG cubic Bezier path
 * data, rising from the bottom edge of a CANVAS_SIZE x CANVAS_SIZE square.
 */
export function generateNouveauMotif(seed, { strands = 5 } = {}) {
  const rng = createRng(`${seed}:nouveau`);
  return Array.from({ length: strands }, (_, index) => whiplashPath(rng, index, strands));
}

function whiplashPath(rng, index, total) {
  const spacing = CANVAS_SIZE / total;
  const originX = spacing * (index + 0.5);
  const originY = CANVAS_SIZE - 32;

  const sway = 40 + rng() * 70;
  const lift = CANVAS_SIZE * (0.5 + rng() * 0.35);
  const curl = (rng() - 0.5) * 140;
  const direction = rng() > 0.5 ? 1 : -1;

  const c1x = originX + sway * direction;
  const c1y = originY - lift * 0.35;
  const c2x = originX + curl;
  const c2y = originY - lift * 0.75;
  const endX = originX + curl * 1.4;
  const endY = originY - lift;

  return `M ${originX.toFixed(1)} ${originY.toFixed(1)} C ${c1x.toFixed(1)} ${c1y.toFixed(1)} ${c2x.toFixed(1)} ${c2y.toFixed(1)} ${endX.toFixed(1)} ${endY.toFixed(1)}`;
}
